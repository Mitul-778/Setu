import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown server error";
}

type ChecklistItem = { key: string; label: string; done: boolean };

function readChecklist(value: unknown): ChecklistItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item) => ({
      key: String(item.key ?? ""),
      label: String(item.label ?? ""),
      done: Boolean(item.done),
    }))
    .filter((item) => item.key);
}

function scheduledLabel(date: Date, now: Date) {
  const startOfDay = (value: Date) => {
    const copy = new Date(value);
    copy.setHours(0, 0, 0, 0);
    return copy.getTime();
  };
  const dayDiff = Math.round((startOfDay(date) - startOfDay(now)) / 86_400_000);
  const time = date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
  if (dayDiff === 0) return `Today, ${time}`;
  if (dayDiff === 1) return `Tomorrow, ${time}`;
  return `${date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}, ${time}`;
}

const statusLabels: Record<string, string> = {
  accepted: "Accepted",
  in_progress: "In progress",
  completed: "Completed",
};

type BookingRecord = {
  id: string;
  customerName: string;
  serviceTitle: string;
  scheduledAt: Date;
  address: string | null;
  amountInr: number;
  status: string;
  otp: string | null;
  checklist: unknown;
};

function toJob(booking: BookingRecord, now: Date) {
  return {
    id: booking.id,
    customerName: booking.customerName,
    serviceTitle: booking.serviceTitle,
    whenLabel: scheduledLabel(booking.scheduledAt, now),
    address: booking.address,
    amountInr: booking.amountInr,
    status: booking.status,
    statusLabel: statusLabels[booking.status] ?? booking.status,
    otp: booking.otp,
    checklist: readChecklist(booking.checklist),
  };
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

export async function GET(request: NextRequest) {
  try {
    const result = await getProvider(request);
    if ("error" in result) return result.error;

    const now = new Date();
    const bookings = await db.booking.findMany({
      where: { providerId: result.providerId, status: { in: ["accepted", "in_progress"] } },
      orderBy: { scheduledAt: "asc" },
    });

    return NextResponse.json({ ok: true as const, jobs: bookings.map((booking) => toJob(booking, now)) });
  } catch (error) {
    console.error("Provider jobs load failed", error);
    return NextResponse.json(
      {
        error: "Could not load jobs.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const result = await getProvider(request);
    if ("error" in result) return result.error;

    const body = await request.json().catch(() => null);
    const action = body?.action as "start" | "toggle" | "complete";
    const bookingId = String(body?.bookingId ?? "");

    const booking = await db.booking.findFirst({
      where: { id: bookingId, providerId: result.providerId },
    });
    if (!booking) return NextResponse.json({ error: "Job not found." }, { status: 404 });

    const now = new Date();

    if (action === "start") {
      const otp = String(body?.otp ?? "").trim();
      if (!booking.otp || otp !== booking.otp) {
        return NextResponse.json({ error: "Incorrect OTP. Ask the customer to confirm it." }, { status: 400 });
      }
      const updated = await db.booking.update({
        where: { id: booking.id },
        data: { status: "in_progress", startedAt: booking.startedAt ?? now },
      });
      return NextResponse.json({ ok: true as const, job: toJob(updated, now) });
    }

    if (action === "toggle") {
      const key = String(body?.key ?? "");
      const done = Boolean(body?.done);
      const checklist = readChecklist(booking.checklist).map((item) =>
        item.key === key ? { ...item, done } : item,
      );
      const updated = await db.booking.update({
        where: { id: booking.id },
        data: { checklist },
      });
      return NextResponse.json({ ok: true as const, job: toJob(updated, now) });
    }

    if (action === "complete") {
      const updated = await db.booking.update({
        where: { id: booking.id },
        data: { status: "completed", completedAt: now },
      });
      return NextResponse.json({ ok: true as const, job: toJob(updated, now) });
    }

    return NextResponse.json({ error: "Unknown job action." }, { status: 400 });
  } catch (error) {
    console.error("Provider job action failed", error);
    return NextResponse.json(
      {
        error: "Could not update the job.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}
