import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serviceLabel } from "@/lib/services";

type Role = "customer" | "provider";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown server error";
}

function timeLabel(date: Date) {
  return date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
}

const conversationInclude = {
  provider: { select: { id: true, displayName: true, category: true } },
  messages: { orderBy: { createdAt: "asc" as const } },
};

type ConversationWithRelations = NonNullable<
  Awaited<ReturnType<typeof loadConversation>>
>;

async function getCurrentUser(request: NextRequest) {
  const userId = request.cookies.get("setu_user_id")?.value;
  if (!userId) return null;
  return db.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, role: true, providerProfile: { select: { id: true } } },
  });
}

function loadConversation(id: string) {
  return db.conversation.findUnique({ where: { id }, include: conversationInclude });
}

type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

function resolveRole(user: CurrentUser, conversation: ConversationWithRelations): Role | null {
  if (user.providerProfile?.id === conversation.providerId) return "provider";
  if (user.id === conversation.customerUserId) return "customer";
  return null;
}

function toThreadResponse(conversation: ConversationWithRelations, role: Role) {
  const otherParty =
    role === "customer"
      ? {
          name: conversation.provider.displayName ?? "Provider",
          subtitle: conversation.provider.category ? serviceLabel(conversation.provider.category) : "Provider",
        }
      : { name: conversation.customerName, subtitle: "Customer" };

  return {
    ok: true as const,
    conversationId: conversation.id,
    currentRole: role,
    otherParty,
    messages: conversation.messages.map((message) => ({
      id: message.id,
      sender: message.sender,
      body: message.body,
      timeLabel: timeLabel(message.createdAt),
      mine: message.sender === role,
    })),
  };
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: "Login is required." }, { status: 401 });

    const conversationIdParam = request.nextUrl.searchParams.get("conversationId");
    const providerIdParam = request.nextUrl.searchParams.get("providerId");

    let conversation: ConversationWithRelations | null = null;

    if (conversationIdParam) {
      conversation = await loadConversation(conversationIdParam);
      if (!conversation) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    } else if (providerIdParam) {
      const provider = await db.providerProfile.findUnique({
        where: { id: providerIdParam },
        select: { id: true },
      });
      if (!provider) return NextResponse.json({ error: "Provider not found." }, { status: 404 });

      conversation = await db.conversation.findFirst({
        where: { providerId: providerIdParam, customerUserId: user.id },
        include: conversationInclude,
      });

      if (!conversation) {
        const created = await db.conversation.create({
          data: {
            providerId: providerIdParam,
            customerUserId: user.id,
            customerName: user.name ?? "Customer",
          },
        });
        conversation = await loadConversation(created.id);
      }
    } else {
      return NextResponse.json({ error: "A conversation or provider is required." }, { status: 400 });
    }

    if (!conversation) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });

    const role = resolveRole(user, conversation);
    if (!role) return NextResponse.json({ error: "You are not part of this conversation." }, { status: 403 });

    // Provider opening the thread clears their unread badge.
    if (role === "provider" && conversation.unreadCount > 0) {
      await db.conversation.update({ where: { id: conversation.id }, data: { unreadCount: 0 } });
    }

    return NextResponse.json(toThreadResponse(conversation, role));
  } catch (error) {
    console.error("Chat thread load failed", error);
    return NextResponse.json(
      {
        error: "Could not load the conversation.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: "Login is required." }, { status: 401 });

    const body = await request.json().catch(() => null);
    const conversationId = String(body?.conversationId ?? "");
    const text = String(body?.body ?? "").trim();

    if (!text) return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });

    const conversation = await loadConversation(conversationId);
    if (!conversation) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });

    const role = resolveRole(user, conversation);
    if (!role) return NextResponse.json({ error: "You are not part of this conversation." }, { status: 403 });

    const message = await db.message.create({
      data: { conversationId: conversation.id, sender: role, body: text },
    });

    await db.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessage: text,
        lastMessageAt: message.createdAt,
        ...(role === "customer" ? { unreadCount: { increment: 1 } } : {}),
      },
    });

    return NextResponse.json({
      ok: true as const,
      message: {
        id: message.id,
        sender: message.sender,
        body: message.body,
        timeLabel: timeLabel(message.createdAt),
        mine: true,
      },
    });
  } catch (error) {
    console.error("Chat message send failed", error);
    return NextResponse.json(
      {
        error: "Could not send the message.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}
