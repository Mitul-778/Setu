import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serviceLabel } from "@/lib/services";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown server error";
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function bucketFor(status: string): "upcoming" | "active" | "completed" {
  if (status === "in_progress") return "active";
  if (status === "completed" || status === "cancelled") return "completed";
  return "upcoming";
}

function whenLabel(date: Date, now: Date) {
  const startOfDay = (value: Date) => {
    const copy = new Date(value);
    copy.setHours(0, 0, 0, 0);
    return copy.getTime();
  };
  const dayDiff = Math.round((startOfDay(date) - startOfDay(now)) / 86_400_000);
  const time = date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });

  if (dayDiff === 0) return `Today, ${time}`;
  if (dayDiff === 1) return `Tomorrow, ${time}`;
  if (dayDiff === -1) return `Yesterday, ${time}`;
  const datePart = date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  return `${datePart}, ${time}`;
}

const statusLabels: Record<string, string> = {
  accepted: "Upcoming",
  confirmed: "Upcoming",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export async function GET(request: NextRequest) {
  const userId = request.cookies.get("setu_user_id")?.value;

  if (!userId) {
    return NextResponse.json({ error: "Login is required." }, { status: 401 });
  }

  try {
    const bookings = await db.booking.findMany({
      where: { customerUserId: userId },
      orderBy: { scheduledAt: "desc" },
      select: {
        id: true,
        providerId: true,
        serviceTitle: true,
        scheduledAt: true,
        status: true,
        amountInr: true,
        address: true,
        provider: { select: { displayName: true, category: true } },
      },
    });

    const now = new Date();

    return NextResponse.json({
      ok: true as const,
      bookings: bookings.map((booking) => {
        const providerName = booking.provider.displayName ?? "Provider";
        return {
          id: booking.id,
          providerId: booking.providerId,
          providerName,
          providerInitials: initialsOf(providerName),
          service: booking.provider.category ? serviceLabel(booking.provider.category) : "Service",
          packageTitle: booking.serviceTitle,
          whenLabel: whenLabel(booking.scheduledAt, now),
          amountInr: booking.amountInr,
          address: booking.address,
          status: booking.status,
          statusLabel: statusLabels[booking.status] ?? booking.status,
          bucket: bucketFor(booking.status),
        };
      }),
    });
  } catch (error) {
    console.error("Customer bookings load failed", error);
    return NextResponse.json(
      {
        error: "Could not load your bookings.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const userId = request.cookies.get("setu_user_id")?.value;

  if (!userId) {
    return NextResponse.json({ error: "Login is required to book." }, { status: 401 });
  }

  try {
    const user = await db.user.findUnique({ where: { id: userId }, select: { name: true } });
    if (!user) {
      return NextResponse.json({ error: "User session is invalid." }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const providerId = String(body?.providerId ?? "");

    const provider = await db.providerProfile.findUnique({
      where: { id: providerId },
      select: {
        id: true,
        category: true,
        packages: { where: { active: true }, select: { id: true, name: true, priceInr: true } },
      },
    });

    if (!provider) {
      return NextResponse.json({ error: "Provider not found." }, { status: 404 });
    }

    const scheduledAt = new Date(String(body?.scheduledAt ?? ""));
    if (Number.isNaN(scheduledAt.getTime())) {
      return NextResponse.json({ error: "Please choose a valid date and time." }, { status: 400 });
    }

    const selectedPackage = provider.packages.find((pkg) => pkg.id === String(body?.packageId ?? ""));
    const serviceTitle =
      selectedPackage?.name ?? (provider.category ? `${serviceLabel(provider.category)} service` : "Service");
    const amountInr = selectedPackage?.priceInr ?? 0;
    const address = String(body?.address ?? "").trim() || null;
    const notes = String(body?.notes ?? "").trim();

    const booking = await db.booking.create({
      data: {
        providerId: provider.id,
        customerName: user.name ?? "Customer",
        customerUserId: userId,
        serviceTitle,
        scheduledAt,
        amountInr,
        address,
        notes,
        status: "confirmed",
      },
      select: { id: true },
    });

    // Surface the new booking to the provider as an incoming lead.
    try {
      await db.lead.create({
        data: {
          providerId: provider.id,
          customerName: user.name ?? "Customer",
          serviceTitle,
          area: address,
          budgetInr: amountInr > 0 ? amountInr : null,
          note: notes,
          status: "new",
        },
      });
    } catch (leadError) {
      console.warn("Could not create lead from booking", leadError);
    }

    return NextResponse.json({ ok: true as const, bookingId: booking.id, nextPath: "/customer/bookings" });
  } catch (error) {
    console.error("Booking create failed", error);
    return NextResponse.json(
      {
        error: "Could not create your booking.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}
