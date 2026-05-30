export type ProviderEarnings = {
  ok: true;
  initials: string;
  walletInr: number;
  walletLabel: string;
  performance: {
    repeatPct: number;
    repeatDetail: string;
    avgResponseMin: number;
    completionRate: number;
    completionDetail: string;
    ratingAvg: number;
    ratingCount: number;
  };
  ratingTrend: { label: string; value: string; heightPct: string }[];
  recentReviews: { customerName: string; rating: number; comment: string; dateLabel: string }[];
  payouts: { amountLabel: string; dateLabel: string; service: string }[];
  metrics: {
    profileViews: number;
    leadConversionPct: number;
    avgResponseMin: number;
    visibilityLabel: string;
  };
};

export async function loadProviderEarnings() {
  const response = await fetch("/api/provider/earnings", { method: "GET", cache: "no-store" });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error ?? "Could not load earnings.");
  return data as ProviderEarnings;
}
