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

const performanceStats = [
  {
    label: "Repeat customers",
    value: "15%",
    detail: "+3 this month",
    icon: UsersRound,
  },
  {
    label: "Avg response time",
    value: "12 mins",
    detail: "Target under 10 mins",
    icon: Timer,
  },
  {
    label: "Completion rate",
    value: "98%",
    detail: "49 of 50 jobs complete",
    icon: CheckCircle2,
  },
  {
    label: "Avg rating",
    value: "4.8 / 5",
    detail: "38 customer reviews",
    icon: Star,
  },
];

const ratingTrend = [
  { day: "Mon", value: "4.6", height: "58%" },
  { day: "Tue", value: "4.7", height: "66%" },
  { day: "Wed", value: "4.8", height: "76%" },
  { day: "Thu", value: "4.8", height: "74%" },
  { day: "Fri", value: "4.9", height: "86%" },
  { day: "Sat", value: "4.8", height: "78%" },
];

const payouts = [
  { amount: "\u20B93,500", date: "Oct 24, 2026", service: "Engagement mehendi" },
  { amount: "\u20B91,200", date: "Oct 20, 2026", service: "Guest makeup" },
  { amount: "\u20B94,800", date: "Oct 15, 2026", service: "Bridal package" },
];

const aiSuggestions = [
  "Add 2 more portfolio photos for bridal work to improve profile visibility.",
  "Open one more evening slot this week to capture high-intent leads around 5 PM.",
  "Reply with a custom quote within 10 minutes to improve lead conversion.",
];

export default function ProviderEarningsPerformancePage() {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)] pb-[calc(92px+env(safe-area-inset-bottom))]">
        <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
          <div className="flex h-14 items-center justify-between gap-3 px-4 min-[390px]:px-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface-container-high)] text-[var(--on-surface)]">
              AS
            </div>
            <h1 className="min-w-0 flex-1 truncate text-center text-headline-sm text-[var(--primary)]">
              Earnings & Performance
            </h1>
            <button
              aria-label="Open payout settings"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--primary)]"
              type="button"
            >
              <Wallet className="h-5 w-5" />
            </button>
          </div>
        </header>

        <section className="px-4 py-4 min-[390px]:px-5">
          <article className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-label-lg text-[var(--on-surface-variant)]">Wallet balance</p>
                <p className="mt-1 text-headline-lg text-[var(--primary)]">{"\u20B912,450"}</p>
                <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                  Next payout expected Friday morning.
                </p>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[var(--surface-container-lowest)] text-[var(--primary)]">
                <IndianRupee className="h-6 w-6" />
              </span>
            </div>
            <button
              className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 text-label-lg text-[var(--on-primary)]"
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
                <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">Weekly average from completed jobs</p>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--surface-container-low)] text-[var(--primary)]">
                <BarChart3 className="h-5 w-5" />
              </span>
            </div>
            <div className="mt-4 flex h-36 items-end gap-2 rounded-md border border-[var(--surface-variant)] bg-[var(--surface-container-low)] px-3 py-3">
              {ratingTrend.map(({ day, height, value }) => (
                <div className="flex h-full min-w-0 flex-1 flex-col justify-end gap-2" key={day}>
                  <div className="flex flex-1 items-end justify-center">
                    <div
                      aria-label={`${day} rating ${value}`}
                      className="w-full max-w-8 rounded-t bg-[var(--primary)]"
                      style={{ height }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-label-sm text-[var(--on-surface)]">{value}</p>
                    <p className="text-label-sm text-[var(--on-surface-variant)]">{day}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

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
              <button className="text-label-sm uppercase text-[var(--on-surface-variant)]" type="button">
                View all
              </button>
            </div>
            <div className="divide-y divide-[var(--surface-variant)]">
              {payouts.map(({ amount, date, service }) => (
                <article className="flex items-center justify-between gap-3 p-4" key={`${service}-${date}`}>
                  <div className="min-w-0">
                    <p className="text-label-lg text-[var(--primary)]">{amount}</p>
                    <p className="mt-0.5 truncate text-body-sm text-[var(--on-surface-variant)]">{service}</p>
                    <p className="mt-0.5 text-body-sm text-[var(--on-surface-variant)]">{date}</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--surface-container-low)] px-2 py-1 text-label-sm text-[var(--on-surface-variant)]">
                    <CheckCircle2 className="h-4 w-4 text-[var(--primary)]" />
                    Paid
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-4 grid grid-cols-2 gap-3">
            <MetricCard label="Profile views" value="248" icon={TrendingUp} />
            <MetricCard label="Lead conversion" value="32%" icon={ArrowUpRight} />
            <MetricCard label="Avg close time" value="18 min" icon={Clock3} />
            <MetricCard label="Visibility score" value="Good" icon={Sparkles} />
          </section>
        </section>

        <ProviderBottomNav />
      </div>
    </main>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
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

function ProviderBottomNav() {
  const items = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Leads", icon: ListChecks },
    { label: "Messages", icon: MessageSquare },
    { label: "Earnings", icon: IndianRupee, active: true },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]">
      <div className="grid h-20 grid-cols-4 px-2 pb-[env(safe-area-inset-bottom)] text-[var(--on-surface-variant)]">
        {items.map(({ active, icon: Icon, label }) => (
          <button className="flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 text-label-sm" key={label} type="button">
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
