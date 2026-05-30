"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Landmark,
  LayoutDashboard,
  Lightbulb,
  ListChecks,
  MessageSquare,
  Sparkles,
  Star,
  Timer,
  TrendingUp,
  UsersRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { loadProviderEarnings, type ProviderEarnings } from "@/services/provider-earnings-service";
import { SetuLoader } from "@/components/setu-loader";

const aiSuggestions = [
  "Add 2 more portfolio photos for bridal work to improve profile visibility.",
  "Open one more evening slot this week to capture high-intent leads around 5 PM.",
  "Reply with a custom quote within 10 minutes to improve lead conversion.",
];

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export default function ProviderEarningsPerformancePage() {
  const router = useRouter();
  const [data, setData] = useState<ProviderEarnings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    loadProviderEarnings()
      .then((response) => {
        if (cancelled) return;
        setData(response);
        setError("");
      })
      .catch((loadError) => {
        if (cancelled) return;
        setError(getErrorMessage(loadError));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const performanceStats = data
    ? [
        {
          label: "Repeat customers",
          value: `${data.performance.repeatPct}%`,
          detail: data.performance.repeatDetail,
          icon: UsersRound,
        },
        {
          label: "Avg response time",
          value: data.performance.avgResponseMin ? `${data.performance.avgResponseMin} mins` : "—",
          detail: "Target under 10 mins",
          icon: Timer,
        },
        {
          label: "Completion rate",
          value: `${data.performance.completionRate}%`,
          detail: data.performance.completionDetail,
          icon: CheckCircle2,
        },
        {
          label: "Avg rating",
          value: data.performance.ratingCount ? `${data.performance.ratingAvg.toFixed(1)} / 5` : "New",
          detail: `${data.performance.ratingCount} customer reviews`,
          icon: Star,
        },
      ]
    : [];

  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)] pb-[calc(92px+env(safe-area-inset-bottom))]">
        <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
          <div className="flex h-14 items-center justify-between gap-3 px-4 min-[390px]:px-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface-container-high)] text-[var(--on-surface)]">
              {data?.initials ?? "SP"}
            </div>
            <h1 className="min-w-0 flex-1 truncate text-center text-headline-sm text-[var(--primary)]">
              Earnings &amp; Performance
            </h1>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--primary)]">
              <Wallet className="h-5 w-5" />
            </span>
          </div>
        </header>

        <section className="px-4 py-4 min-[390px]:px-5">
          {isLoading ? (
            <SetuLoader label="Loading earnings..." />
          ) : error ? (
            <p className="rounded-md border border-[var(--error)] bg-[var(--error-container)] px-3 py-2 text-body-sm text-[var(--on-error-container)]">
              {error}
            </p>
          ) : data ? (
            <>
              <article className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-label-lg text-[var(--on-surface-variant)]">Total earned</p>
                    <p className="mt-1 text-headline-lg text-[var(--primary)]">{data.walletLabel}</p>
                    <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                      From completed and settled jobs.
                    </p>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[var(--surface-container-lowest)] text-[var(--primary)]">
                    <IndianRupee className="h-6 w-6" />
                  </span>
                </div>
                <button
                  className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 text-label-lg text-[var(--on-primary)] disabled:opacity-60"
                  disabled={data.walletInr <= 0}
                  type="button"
                >
                  <Landmark className="h-5 w-5" />
                  Withdraw to Bank
                </button>
              </article>

              <section className="mt-4 grid grid-cols-2 gap-3" aria-label="Performance summary">
                {performanceStats.map(({ detail, icon: Icon, label, value }) => (
                  <article
                    className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3"
                    key={label}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="min-w-0 text-label-md text-[var(--on-surface-variant)]">{label}</p>
                      <Icon className="h-4 w-4 shrink-0 text-[var(--primary)]" />
                    </div>
                    <p className="mt-2 text-headline-sm text-[var(--primary)]">{value}</p>
                    <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">{detail}</p>
                  </article>
                ))}
              </section>

              <section className="mt-4 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-headline-sm text-[var(--primary)]">Ratings trend</h2>
                    <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">Your most recent review ratings</p>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--surface-container-low)] text-[var(--primary)]">
                    <BarChart3 className="h-5 w-5" />
                  </span>
                </div>
                {data.ratingTrend.length ? (
                  <div className="mt-4 flex h-36 items-end gap-2 rounded-md border border-[var(--surface-variant)] bg-[var(--surface-container-low)] px-3 py-3">
                    {data.ratingTrend.map((point, index) => (
                      <div
                        className="flex h-full min-w-0 flex-1 flex-col justify-end gap-2"
                        key={`${point.label}-${index}`}
                      >
                        <div className="flex flex-1 items-end justify-center">
                          <div
                            aria-label={`${point.label} rating ${point.value}`}
                            className="w-full max-w-8 rounded-t bg-[var(--primary)]"
                            style={{ height: point.heightPct }}
                          />
                        </div>
                        <div className="text-center">
                          <p className="text-label-sm text-[var(--on-surface)]">{point.value}</p>
                          <p className="truncate text-label-sm text-[var(--on-surface-variant)]">{point.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 rounded-md border border-dashed border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-4 text-center text-body-sm text-[var(--on-surface-variant)]">
                    No reviews yet — ratings appear here after completed jobs.
                  </p>
                )}
              </section>

              {data.recentReviews.length ? (
                <section className="mt-4 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
                  <h2 className="text-headline-sm text-[var(--primary)]">Recent reviews</h2>
                  <div className="mt-3 flex flex-col divide-y divide-[var(--surface-variant)]">
                    {data.recentReviews.map((review, index) => (
                      <div className="py-3 first:pt-0 last:pb-0" key={`${review.dateLabel}-${index}`}>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-label-lg text-[var(--on-surface)]">{review.customerName}</span>
                          <span className="flex items-center gap-1 text-label-md text-[var(--on-surface-variant)]">
                            <Star className="h-3.5 w-3.5 fill-current text-[var(--primary)]" />
                            {review.rating.toFixed(1)}
                          </span>
                        </div>
                        {review.comment ? (
                          <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">{review.comment}</p>
                        ) : null}
                        <p className="mt-1 text-label-sm text-[var(--on-surface-variant)]">{review.dateLabel}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="mt-4 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container)] p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[var(--primary)]" fill="currentColor" />
                  <h2 className="text-headline-sm text-[var(--primary)]">Setu AI suggestions</h2>
                </div>
                <div className="mt-3 flex flex-col gap-3">
                  {aiSuggestions.map((suggestion) => (
                    <div className="flex gap-3" key={suggestion}>
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--surface-container-lowest)] text-[var(--primary)]">
                        <Lightbulb className="h-4 w-4" />
                      </span>
                      <p className="text-body-md text-[var(--on-surface)]">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-4 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]">
                <div className="flex items-center justify-between gap-3 border-b border-[var(--surface-variant)] p-4">
                  <div>
                    <h2 className="text-headline-sm text-[var(--primary)]">Payout history</h2>
                    <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">Recent settled jobs</p>
                  </div>
                </div>
                {data.payouts.length ? (
                  <div className="divide-y divide-[var(--surface-variant)]">
                    {data.payouts.map((payout, index) => (
                      <article
                        className="flex items-center justify-between gap-3 p-4"
                        key={`${payout.service}-${index}`}
                      >
                        <div className="min-w-0">
                          <p className="text-label-lg text-[var(--primary)]">{payout.amountLabel}</p>
                          <p className="mt-0.5 truncate text-body-sm text-[var(--on-surface-variant)]">
                            {payout.service}
                          </p>
                          <p className="mt-0.5 text-body-sm text-[var(--on-surface-variant)]">{payout.dateLabel}</p>
                        </div>
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--surface-container-low)] px-2 py-1 text-label-sm text-[var(--on-surface-variant)]">
                          <CheckCircle2 className="h-4 w-4 text-[var(--primary)]" />
                          Paid
                        </span>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="p-4 text-body-sm text-[var(--on-surface-variant)]">No settled payouts yet.</p>
                )}
              </section>

              <section className="mt-4 grid grid-cols-2 gap-3">
                <MetricCard label="Profile views" value={String(data.metrics.profileViews)} icon={TrendingUp} />
                <MetricCard label="Lead conversion" value={`${data.metrics.leadConversionPct}%`} icon={ArrowUpRight} />
                <MetricCard
                  label="Avg response"
                  value={data.metrics.avgResponseMin ? `${data.metrics.avgResponseMin} min` : "—"}
                  icon={Clock3}
                />
                <MetricCard label="Visibility score" value={data.metrics.visibilityLabel} icon={Sparkles} />
              </section>
            </>
          ) : null}
        </section>

        <ProviderBottomNav onNavigate={(href) => router.push(href)} />
      </div>
    </main>
  );
}

function MetricCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <article className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3">
      <div className="flex items-center gap-2 text-[var(--on-surface-variant)]">
        <Icon className="h-4 w-4" />
        <p className="truncate text-label-md">{label}</p>
      </div>
      <p className="mt-2 text-headline-sm text-[var(--primary)]">{value}</p>
    </article>
  );
}

function ProviderBottomNav({ onNavigate }: { onNavigate: (href: string) => void }) {
  const items = [
    { label: "Dashboard", href: "/provider/dashboard", icon: LayoutDashboard },
    { label: "Leads", href: "/provider/leads", icon: ListChecks },
    { label: "Messages", href: "/provider/messages", icon: MessageSquare },
    { label: "Earnings", href: "/provider/earnings-performance", icon: IndianRupee, active: true },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]">
      <div className="grid h-20 grid-cols-4 px-2 pb-[env(safe-area-inset-bottom)] text-[var(--on-surface-variant)]">
        {items.map(({ active, href, icon: Icon, label }) => (
          <button
            className="flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 text-label-sm"
            key={label}
            onClick={() => onNavigate(href)}
            type="button"
          >
            <span
              className={
                active
                  ? "flex h-8 w-12 items-center justify-center rounded-full bg-[var(--primary-container)] text-[var(--on-primary)]"
                  : "flex h-8 w-12 items-center justify-center rounded-full"
              }
            >
              <Icon className="h-5 w-5" fill={active ? "currentColor" : "none"} />
            </span>
            <span className={active ? "max-w-full truncate text-[var(--primary)]" : "max-w-full truncate"}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
