import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/utils";

const listLimit = 6;

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown server error";
}

const leadStatusLabels: Record<string, string> = {
  new: "New",
  viewed: "Viewed",
  accepted: "Accepted",
  declined: "Declined",
  quoted: "Quoted",
};

const bookingStatusLabels: Record<string, string> = {
  accepted: "Accepted",
  confirmed: "Confirmed",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function relativeTime(date: Date, now: Date) {
  const minutes = Math.max(0, Math.round((now.getTime() - date.getTime()) / 60000));
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  return `${days}d`;
}

function formatSchedule(date: Date, now: Date) {
  const time = date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  if (sameDay(date, now)) return `Today, ${time}`;
  if (sameDay(date, tomorrow)) return `Tomorrow, ${time}`;

  const datePart = date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  return `${datePart}, ${time}`;
}

async function getCurrentProvider(request: NextRequest) {
  const userId = request.cookies.get("setu_user_id")?.value;

  if (!userId) {
    return { error: NextResponse.json({ error: "Login is required." }, { status: 401 }) };
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      providerProfile: {
        include: { documents: true, verification: true },
      },
    },
  });

  if (!user) {
    return { error: NextResponse.json({ error: "User session is invalid." }, { status: 401 }) };
  }

  const provider =
    user.providerProfile ??
    (await db.providerProfile.create({
      data: {
        userId: user.id,
        onboardingStatus: "draft",
        serviceIds: [],
        serviceNames: [],
        languages: [],
      },
      include: { documents: true, verification: true },
    }));

  return { user, provider };
}

type ProviderSuccess = Extract<
  Awaited<ReturnType<typeof getCurrentProvider>>,
  { provider: unknown }
>;
type ProviderRecord = ProviderSuccess["provider"];
type UserRecord = ProviderSuccess["user"];

function buildVerification(provider: ProviderRecord) {
  const needsFixCount = provider.documents.filter(
    (doc) => doc.status === "needs_fix" || doc.status === "rejected",
  ).length;

  switch (provider.onboardingStatus) {
    case "approved":
      return { label: "Verified", detail: "Profile is live" };
    case "submitted":
      return { label: "In Review", detail: "Awaiting review" };
    case "needs_fix":
      return {
        label: "Needs Fixes",
        detail: needsFixCount ? `${needsFixCount} item${needsFixCount > 1 ? "s" : ""} to fix` : "Action needed",
      };
    case "rejected":
      return { label: "Rejected", detail: "See details" };
    default:
      return { label: "Draft", detail: "Finish setup" };
  }
}

async function buildResponse(user: UserRecord, provider: ProviderRecord) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  let leads: Awaited<ReturnType<typeof db.lead.findMany>> = [];
  let bookings: Awaited<ReturnType<typeof db.booking.findMany>> = [];
  let conversations: Awaited<ReturnType<typeof db.conversation.findMany>> = [];
  let ratingAvg = 0;
  let ratingCount = 0;

  // Activity tables are optional: if they are missing or empty, the dashboard
  // still renders with zeros / empty lists instead of failing.
  try {
    const [leadRows, bookingRows, conversationRows, reviewAgg] = await Promise.all([
      db.lead.findMany({ where: { providerId: provider.id }, orderBy: { createdAt: "desc" } }),
      db.booking.findMany({ where: { providerId: provider.id }, orderBy: { scheduledAt: "asc" } }),
      db.conversation.findMany({
        where: { providerId: provider.id },
        orderBy: { lastMessageAt: "desc" },
        take: listLimit,
      }),
      db.review.aggregate({
        where: { providerId: provider.id },
        _avg: { rating: true },
        _count: true,
      }),
    ]);

    leads = leadRows;
    bookings = bookingRows;
    conversations = conversationRows;
    ratingAvg = reviewAgg._avg.rating ?? 0;
    ratingCount = typeof reviewAgg._count === "number" ? reviewAgg._count : 0;
  } catch (error) {
    console.warn("Provider dashboard activity data unavailable; defaulting to empty.", error);
  }

  const activeBookings = bookings.filter((booking) => booking.status !== "cancelled");
  const respondedLeads = leads.filter((lead) => lead.respondedAt);
  const acceptedLeads = leads.filter((lead) => lead.status === "accepted").length;
  const repeatBookings = bookings.filter((booking) => booking.isRepeatCustomer).length;
  const earningsThisMonth = bookings
    .filter((booking) => booking.status === "completed" && booking.createdAt >= monthStart)
    .reduce((total, booking) => total + booking.amountInr, 0);

  const avgResponseMin = respondedLeads.length
    ? Math.round(
        respondedLeads.reduce(
          (total, lead) => total + (lead.respondedAt!.getTime() - lead.createdAt.getTime()) / 60000,
          0,
        ) / respondedLeads.length,
      )
    : 0;

  const newLeads = leads.filter((lead) => lead.status === "new");
  const urgentToday = newLeads.filter((lead) => lead.urgent).length;

  const leadCards = leads
    .filter((lead) => lead.status === "new" || lead.status === "viewed")
    .slice(0, listLimit)
    .map((lead) => ({
      id: lead.id,
      title: lead.serviceTitle,
      meta: [lead.area, lead.preferredLanguage ? `${lead.preferredLanguage} preferred` : null]
        .filter(Boolean)
        .join(" • "),
      budget: lead.budgetInr != null ? formatINR(lead.budgetInr) : "Open budget",
      status: leadStatusLabels[lead.status] ?? lead.status,
      urgent: lead.urgent,
    }));

  const jobCards = activeBookings
    .filter((booking) => booking.status !== "completed")
    .slice(0, listLimit)
    .map((booking) => ({
      id: booking.id,
      title: booking.serviceTitle,
      time: formatSchedule(booking.scheduledAt, now),
      status: bookingStatusLabels[booking.status] ?? booking.status,
    }));

  const messageCards = conversations.map((conversation) => ({
    id: conversation.id,
    name: conversation.customerName,
    text: conversation.lastMessage,
    time: relativeTime(conversation.lastMessageAt, now),
    unread: conversation.unreadCount,
  }));

  return {
    ok: true as const,
    providerId: provider.id,
    displayName: provider.displayName ?? user.name ?? "",
    greetingName: (provider.displayName ?? user.name ?? "there").split(" ")[0],
    onboardingStatus: provider.onboardingStatus,
    verification: buildVerification(provider),
    summary: {
      newLeads: newLeads.length,
      urgentToday,
      acceptedJobs: activeBookings.length,
      jobsThisWeek: activeBookings.filter((booking) => booking.createdAt >= weekAgo).length,
      earningsThisMonthInr: earningsThisMonth,
      earningsThisMonthLabel: formatINR(earningsThisMonth),
      responseRatePct: leads.length ? Math.round((respondedLeads.length / leads.length) * 100) : 0,
      avgResponseMin,
      ratingAvg: Math.round(ratingAvg * 10) / 10,
      ratingCount,
    },
    performance: {
      views: provider.profileViews ?? 0,
      acceptPct: leads.length ? Math.round((acceptedLeads / leads.length) * 100) : 0,
      repeatPct: bookings.length ? Math.round((repeatBookings / bookings.length) * 100) : 0,
    },
    leads: leadCards,
    jobs: jobCards,
    messages: messageCards,
  };
}

export async function GET(request: NextRequest) {
  try {
    const result = await getCurrentProvider(request);
    if ("error" in result) return result.error;

    return NextResponse.json(await buildResponse(result.user, result.provider));
  } catch (error) {
    console.error("Provider dashboard load failed", error);
    return NextResponse.json(
      {
        error: "Could not load dashboard.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}
