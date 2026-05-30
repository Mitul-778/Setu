import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serviceLabel } from "@/lib/services";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown server error";
}

function initialsOf(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "SP"
  );
}

async function getBooking(request: NextRequest, bookingId: string) {
  const userId = request.cookies.get("setu_user_id")?.value;
  if (!userId) return { error: NextResponse.json({ error: "Login is required." }, { status: 401 }) };

  const booking = await db.booking.findFirst({
    where: { id: bookingId, customerUserId: userId },
    select: {
      id: true,
      providerId: true,
      serviceTitle: true,
      status: true,
      provider: { select: { displayName: true, category: true } },
    },
  });
  if (!booking) return { error: NextResponse.json({ error: "Booking not found." }, { status: 404 }) };
  return { userId, booking };
}

export async function GET(request: NextRequest) {
  try {
    const bookingId = request.nextUrl.searchParams.get("bookingId") ?? "";
    const result = await getBooking(request, bookingId);
    if ("error" in result) return result.error;

    const alreadyReviewed = (await db.review.count({ where: { bookingId } })) > 0;
    const providerName = result.booking.provider.displayName ?? "Provider";

    return NextResponse.json({
      ok: true as const,
      context: {
        bookingId: result.booking.id,
        providerName,
        providerInitials: initialsOf(providerName),
        service: result.booking.provider.category ? serviceLabel(result.booking.provider.category) : "Service",
        serviceTitle: result.booking.serviceTitle,
        alreadyReviewed,
      },
    });
  } catch (error) {
    console.error("Review context load failed", error);
    return NextResponse.json(
      {
        error: "Could not load review details.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const bookingId = String(body?.bookingId ?? "");
    const rating = Math.round(Number(body?.rating));
    const comment = String(body?.comment ?? "").trim();

    const result = await getBooking(request, bookingId);
    if ("error" in result) return result.error;

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Please give a rating from 1 to 5 stars." }, { status: 400 });
    }

    const existing = await db.review.findFirst({ where: { bookingId } });
    if (existing) {
      return NextResponse.json({ ok: true as const, alreadyReviewed: true, nextPath: "/customer/bookings" });
    }

    const user = await db.user.findUnique({ where: { id: result.userId }, select: { name: true } });

    await db.review.create({
      data: {
        providerId: result.booking.providerId,
        customerName: user?.name ?? "Customer",
        rating,
        comment,
        bookingId,
      },
    });

    return NextResponse.json({ ok: true as const, nextPath: "/customer/bookings" });
  } catch (error) {
    console.error("Review create failed", error);
    return NextResponse.json(
      {
        error: "Could not submit your review.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}
