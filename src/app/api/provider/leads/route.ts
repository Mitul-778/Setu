import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown server error";
}

const statusLabels: Record<string, string> = {
  new: "New",
  viewed: "Viewed",
  accepted: "Accepted",
  declined: "Declined",
  quoted: "Quoted",
};

function whenLabel(date: Date, now: Date) {
  const startOfDay = (value: Date) => {
    const copy = new Date(value);
    copy.setHours(0, 0, 0, 0);
    return copy.getTime();
  };
  const dayDiff = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);
  const time = date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });

  if (dayDiff === 0) return `Today, ${time}`;
  if (dayDiff === 1) return `Yesterday, ${time}`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

type LeadRecord = {
  id: string;
  customerName: string;
  serviceTitle: string;
  area: string | null;
  preferredLanguage: string | null;
  budgetInr: number | null;
  note: string;
  status: string;
  urgent: boolean;
  createdAt: Date;
};

function toLead(lead: LeadRecord, now: Date) {
  return {
    id: lead.id,
    customerName: lead.customerName,
    serviceTitle: lead.serviceTitle,
    area: lead.area,
    preferredLanguage: lead.preferredLanguage,
    budgetInr: lead.budgetInr,
    budgetLabel: lead.budgetInr != null ? `₹${lead.budgetInr.toLocaleString("en-IN")}` : "Open budget",
    note: lead.note,
    status: lead.status,
    statusLabel: statusLabels[lead.status] ?? lead.status,
    urgent: lead.urgent,
    whenLabel: whenLabel(lead.createdAt, now),
  };
}

async function getProvider(request: NextRequest) {
  const userId = request.cookies.get("setu_user_id")?.value;
  if (!userId) {
    return { error: NextResponse.json({ error: "Login is required." }, { status: 401 }) };
  }

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
    const leadId = request.nextUrl.searchParams.get("leadId");

    if (leadId) {
      const lead = await db.lead.findFirst({ where: { id: leadId, providerId: result.providerId } });
      if (!lead) return NextResponse.json({ error: "Lead not found." }, { status: 404 });
      return NextResponse.json({ ok: true as const, lead: toLead(lead, now) });
    }

    // Only show incoming, unactioned leads here. Once a lead is accepted (it
    // becomes a job), declined, or quoted, it drops off the leads list.
    const leads = await db.lead.findMany({
      where: { providerId: result.providerId, status: { in: ["new", "viewed"] } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ok: true as const, leads: leads.map((lead) => toLead(lead, now)) });
  } catch (error) {
    console.error("Provider leads load failed", error);
    return NextResponse.json(
      {
        error: "Could not load leads.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}
