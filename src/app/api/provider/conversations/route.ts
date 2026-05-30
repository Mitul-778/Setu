import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown server error";
}

function relativeTime(date: Date, now: Date) {
  const minutes = Math.max(0, Math.round((now.getTime() - date.getTime()) / 60000));
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

export async function GET(request: NextRequest) {
  const userId = request.cookies.get("setu_user_id")?.value;
  if (!userId) return NextResponse.json({ error: "Login is required." }, { status: 401 });

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { providerProfile: { select: { id: true } } },
    });
    if (!user?.providerProfile) {
      return NextResponse.json({ error: "Provider profile not found." }, { status: 404 });
    }

    const now = new Date();
    const conversations = await db.conversation.findMany({
      where: { providerId: user.providerProfile.id },
      orderBy: { lastMessageAt: "desc" },
      select: { id: true, customerName: true, lastMessage: true, lastMessageAt: true, unreadCount: true },
    });

    return NextResponse.json({
      ok: true as const,
      conversations: conversations.map((conversation) => ({
        id: conversation.id,
        name: conversation.customerName,
        subtitle: "Customer",
        lastMessage: conversation.lastMessage || "Start the conversation",
        timeLabel: relativeTime(conversation.lastMessageAt, now),
        unread: conversation.unreadCount,
      })),
    });
  } catch (error) {
    console.error("Provider conversations load failed", error);
    return NextResponse.json(
      {
        error: "Could not load messages.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}
