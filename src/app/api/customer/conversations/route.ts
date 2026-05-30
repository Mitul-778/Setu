import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serviceLabel } from "@/lib/services";

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
    const now = new Date();
    const conversations = await db.conversation.findMany({
      where: { customerUserId: userId },
      orderBy: { lastMessageAt: "desc" },
      select: {
        id: true,
        lastMessage: true,
        lastMessageAt: true,
        provider: { select: { displayName: true, category: true } },
      },
    });

    return NextResponse.json({
      ok: true as const,
      conversations: conversations.map((conversation) => ({
        id: conversation.id,
        name: conversation.provider.displayName ?? "Provider",
        subtitle: conversation.provider.category ? serviceLabel(conversation.provider.category) : "Provider",
        lastMessage: conversation.lastMessage || "Start the conversation",
        timeLabel: relativeTime(conversation.lastMessageAt, now),
        unread: 0,
      })),
    });
  } catch (error) {
    console.error("Customer conversations load failed", error);
    return NextResponse.json(
      {
        error: "Could not load your messages.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}
