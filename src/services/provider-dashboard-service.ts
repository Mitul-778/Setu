export type DashboardVerification = {
  label: string;
  detail: string;
};

export type DashboardSummary = {
  newLeads: number;
  urgentToday: number;
  acceptedJobs: number;
  jobsThisWeek: number;
  earningsThisMonthInr: number;
  earningsThisMonthLabel: string;
  responseRatePct: number;
  avgResponseMin: number;
  ratingAvg: number;
  ratingCount: number;
};

export type DashboardPerformance = {
  views: number;
  acceptPct: number;
  repeatPct: number;
};

export type DashboardLead = {
  id: string;
  title: string;
  meta: string;
  budget: string;
  status: string;
  urgent: boolean;
};

export type DashboardJob = {
  id: string;
  title: string;
  time: string;
  status: string;
};

export type DashboardMessage = {
  id: string;
  name: string;
  text: string;
  time: string;
  unread: number;
};

export type ProviderDashboardResponse = {
  ok: true;
  providerId: string;
  displayName: string;
  greetingName: string;
  onboardingStatus: "draft" | "submitted" | "needs_fix" | "approved" | "rejected";
  verification: DashboardVerification;
  summary: DashboardSummary;
  performance: DashboardPerformance;
  leads: DashboardLead[];
  jobs: DashboardJob[];
  messages: DashboardMessage[];
};

export async function loadProviderDashboard() {
  const response = await fetch("/api/provider/dashboard", {
    method: "GET",
    cache: "no-store",
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = data?.detail ? ` ${data.detail}` : "";
    throw new Error(`${data?.error ?? "Could not load dashboard."}${detail}`);
  }

  return data as ProviderDashboardResponse;
}
