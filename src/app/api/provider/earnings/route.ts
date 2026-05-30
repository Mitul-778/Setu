import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/utils";

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

async function getProvider(request: NextRequest) {
  const userId = request.cookies.get("setu_user_id")?.value;
  if (!userId) return { error: NextResponse.json({ error: "Login is required." }, { status: 401 }) };

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { providerProfile: { select: { id: true, displayName: true, profileViews: true, trustScore: true } } },
  });
  if (!user?.providerProfile) {
    return { error: NextResponse.json({ error: "Provider profile not found." }, { status: 404 }) };
  }
  return { provider: user.providerProfile };
}

export async function GET(request: NextRequest) {
  try {
    const result = await getProvider(request);
    if ("error" in result) return result.error;
    const { provider } = result;

    const [bookings, reviews, leads] = await Promise.all([
      db.booking.findMany({
        where: { providerId: provider.id },
        select: {
          status: true,
          amountInr: true,
          isRepeatCustomer: true,
          serviceTitle: true,
          scheduledAt: true,
          completedAt: true,
        },
      }),
      db.review.findMany({
        where: { providerId: provider.id },
        select: { rating: true, createdAt: true, customerName: true, comment: true },
        orderBy: { createdAt: "asc" },
      }),
      db.lead.findMany({
        where: { providerId: provider.id },
        select: { status: true, createdAt: true, respondedAt: true },
      }),
    ]);

    const completed = bookings.filter((booking) => booking.status === "completed");
    const totalBookings = bookings.length;
    const walletInr = completed.reduce((sum, booking) => sum + booking.amountInr, 0);
    const repeatBookings = bookings.filter((booking) => booking.isRepeatCustomer).length;

    const respondedLeads = leads.filter((lead) => lead.respondedAt);
    const avgResponseMin = respondedLeads.length
      ? Math.round(
          respondedLeads.reduce(
            (sum, lead) => sum + (lead.respondedAt!.getTime() - lead.createdAt.getTime()) / 60000,
            0,
          ) / respondedLeads.length,
        )
      : 0;
    const acceptedLeads = leads.filter((lead) => lead.status === "accepted" || lead.status === "quoted").length;
    const leadConversionPct = leads.length ? Math.round((acceptedLeads / leads.length) * 100) : 0;

    const ratings = reviews.map((review) => review.rating);
    const ratingAvg = ratings.length ? ratings.reduce((sum, value) => sum + value, 0) / ratings.length : 0;
    const completionRate = totalBookings ? Math.round((completed.length / totalBookings) * 100) : 0;
    const repeatPct = totalBookings ? Math.round((repeatBookings / totalBookings) * 100) : 0;

    const ratingTrend = reviews.slice(-6).map((review) => ({
      label: review.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      value: review.rating.toFixed(1),
      heightPct: `${Math.max(20, Math.round((review.rating / 5) * 100))}%`,
    }));

    const payouts = completed
      .slice()
      .sort((a, b) => (b.completedAt ?? b.scheduledAt).getTime() - (a.completedAt ?? a.scheduledAt).getTime())
      .slice(0, 6)
      .map((booking) => ({
        amountLabel: formatINR(booking.amountInr),
        dateLabel: (booking.completedAt ?? booking.scheduledAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        service: booking.serviceTitle,
      }));

    const trustScore = provider.trustScore;
    const visibilityLabel =
      trustScore >= 80 ? "Great" : trustScore >= 60 ? "Good" : trustScore > 0 ? "Improving" : "New";

    return NextResponse.json({
      ok: true as const,
      initials: initialsOf(provider.displayName ?? "Service Pro"),
      walletInr,
      walletLabel: formatINR(walletInr),
      performance: {
        repeatPct,
        repeatDetail: `${repeatBookings} of ${totalBookings} bookings`,
        avgResponseMin,
        completionRate,
        completionDetail: `${completed.length} of ${totalBookings} jobs complete`,
        ratingAvg,
        ratingCount: ratings.length,
      },
      ratingTrend,
      recentReviews: reviews
        .slice(-5)
        .reverse()
        .map((review) => ({
          customerName: review.customerName,
          rating: review.rating,
          comment: review.comment,
          dateLabel: review.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        })),
      payouts,
      metrics: {
        profileViews: provider.profileViews,
        leadConversionPct,
        avgResponseMin,
        visibilityLabel,
      },
    });
  } catch (error) {
    console.error("Provider earnings load failed", error);
    return NextResponse.json(
      {
        error: "Could not load earnings.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}
