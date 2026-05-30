import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown server error";
}

const defaultChecklist = [
  { key: "reached", label: "Reached the location", done: false },
  { key: "setup", label: "Setup & materials ready", done: false },
  { key: "work", label: "Service work completed", done: false },
];

function generateOtp() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

async function getProvider(request: NextRequest) {
  const userId = request.cookies.get("setu_user_id")?.value;
  if (!userId) return { error: NextResponse.json({ error: "Login is required." }, { status: 401 }) };

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { providerProfile: { select: { id: true } } },
  });

  if (!user?.providerProfile) {
    return { error: NextResponse.json({ error: "Provider profile not found." }, { status: 404 }) };
  }

  return { providerId: user.providerProfile.id };
}

export async function POST(request: NextRequest) {
  try {
    const result = await getProvider(request);
    if ("error" in result) return result.error;

    const body = await request.json().catch(() => null);
    const leadId = String(body?.leadId ?? "");
    const action = body?.action as "accept" | "decline" | "quote";

    if (!["accept", "decline", "quote"].includes(action)) {
      return NextResponse.json({ error: "Unknown lead action." }, { status: 400 });
    }

    const lead = await db.lead.findFirst({ where: { id: leadId, providerId: result.providerId } });
    if (!lead) return NextResponse.json({ error: "Lead not found." }, { status: 404 });

    const booking = lead.bookingId
      ? await db.booking.findUnique({ where: { id: lead.bookingId } })
      : null;
    const now = new Date();

    if (action === "accept") {
      await db.lead.update({ where: { id: lead.id }, data: { status: "accepted", respondedAt: now } });
      if (booking) {
        await db.booking.update({
          where: { id: booking.id },
          data: { status: "accepted", otp: generateOtp(), checklist: defaultChecklist },
        });
      }
      return NextResponse.json({ ok: true as const, status: "accepted", nextPath: "/provider/todays-jobs" });
    }

    if (action === "decline") {
      await db.lead.update({ where: { id: lead.id }, data: { status: "declined", respondedAt: now } });
      if (booking) {
        await db.booking.update({ where: { id: booking.id }, data: { status: "cancelled" } });
      }
      return NextResponse.json({ ok: true as const, status: "declined", nextPath: "/provider/leads" });
    }

    // quote → open a chat with the customer
    const customerUserId = booking?.customerUserId;
    if (!customerUserId) {
      return NextResponse.json(
        { error: "This lead has no linked customer to chat with." },
        { status: 400 },
      );
    }

    let conversation = await db.conversation.findFirst({
      where: { providerId: result.providerId, customerUserId },
    });
    if (!conversation) {
      conversation = await db.conversation.create({
        data: { providerId: result.providerId, customerUserId, customerName: lead.customerName },
      });
    }

    await db.lead.update({ where: { id: lead.id }, data: { status: "quoted", respondedAt: now } });

    return NextResponse.json({
      ok: true as const,
      status: "quoted",
      conversationId: conversation.id,
      nextPath: `/provider/chat-thread?conversationId=${conversation.id}`,
    });
  } catch (error) {
    console.error("Provider lead decision failed", error);
    return NextResponse.json(
      {
        error: "Could not update the lead.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}
