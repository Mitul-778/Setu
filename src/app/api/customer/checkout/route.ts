import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serviceLabel } from "@/lib/services";

const platformFee = 49;

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

async function getBookingForCustomer(request: NextRequest, bookingId: string) {
  const userId = request.cookies.get("setu_user_id")?.value;
  if (!userId) return { error: NextResponse.json({ error: "Login is required." }, { status: 401 }) };

  const booking = await db.booking.findFirst({
    where: { id: bookingId, customerUserId: userId },
    select: {
      id: true,
      serviceTitle: true,
      amountInr: true,
      status: true,
      paidAt: true,
      paymentMethod: true,
      address: true,
      provider: { select: { displayName: true, category: true } },
    },
  });

  if (!booking) return { error: NextResponse.json({ error: "Booking not found." }, { status: 404 }) };
  return { booking };
}

function toCheckout(booking: NonNullable<Awaited<ReturnType<typeof getBookingForCustomer>>["booking"]>) {
  const providerName = booking.provider.displayName ?? "Provider";
  const total = booking.amountInr + (booking.amountInr > 0 ? platformFee : 0);
  return {
    id: booking.id,
    providerName,
    providerInitials: initialsOf(providerName),
    service: booking.provider.category ? serviceLabel(booking.provider.category) : "Service",
    serviceTitle: booking.serviceTitle,
    amountInr: booking.amountInr,
    platformFee: booking.amountInr > 0 ? platformFee : 0,
    totalInr: total,
    address: booking.address,
    status: booking.status,
    paid: Boolean(booking.paidAt),
    paymentMethod: booking.paymentMethod,
  };
}

export async function GET(request: NextRequest) {
  try {
    const bookingId = request.nextUrl.searchParams.get("bookingId") ?? "";
    const result = await getBookingForCustomer(request, bookingId);
    if ("error" in result) return result.error;

    return NextResponse.json({ ok: true as const, checkout: toCheckout(result.booking) });
  } catch (error) {
    console.error("Checkout load failed", error);
    return NextResponse.json(
      {
        error: "Could not load checkout.",
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
    const method = String(body?.method ?? "UPI").trim() || "UPI";

    const result = await getBookingForCustomer(request, bookingId);
    if ("error" in result) return result.error;
    const { booking } = result;

    if (booking.status !== "completed") {
      return NextResponse.json(
        { error: "Payment opens once the provider marks the service complete." },
        { status: 400 },
      );
    }
    if (booking.paidAt) {
      return NextResponse.json({ ok: true as const, alreadyPaid: true, nextPath: "/customer/bookings" });
    }

    await db.booking.update({
      where: { id: booking.id },
      data: { paidAt: new Date(), paymentMethod: method },
    });

    return NextResponse.json({ ok: true as const, nextPath: "/customer/bookings" });
  } catch (error) {
    console.error("Checkout payment failed", error);
    return NextResponse.json(
      {
        error: "Could not complete the payment.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}
