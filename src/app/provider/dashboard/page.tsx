import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock3,
  IndianRupee,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  ShieldCheck,
  Star,
  TrendingUp,
  User,
} from "lucide-react";

const summaryCards = [
  { label: "Verification", value: "In Review", detail: "2 items pending", icon: ShieldCheck },
  { label: "New Leads", value: "4", detail: "2 urgent today", icon: ListChecks },
  { label: "Accepted Jobs", value: "12", detail: "3 this week", icon: BriefcaseBusiness },
  { label: "Earnings", value: "₹18,500", detail: "This month", icon: IndianRupee },
  { label: "Response Rate", value: "92%", detail: "Avg 8 min", icon: Clock3 },
  { label: "Rating", value: "4.9", detail: "38 reviews", icon: Star },
];

const tabs = ["Leads", "Jobs", "Messages", "Performance"];

const leads = [
  {
    title: "Bridal mehendi for Sunday",
    meta: "Koramangala • Hindi preferred",
    budget: "₹2,500",
    status: "New",
  },
  {
    title: "Party makeup for family event",
    meta: "Indiranagar • 6 PM today",
    budget: "₹1,800",
    status: "Fast reply",
  },
];

const jobs = [
  { title: "Engagement mehendi", time: "Today, 5:30 PM", status: "Confirmed" },
  { title: "Festival home service", time: "Tomorrow, 11:00 AM", status: "Accepted" },
];

const messages = [
  { name: "Ananya R.", text: "Can you share one more bridal design?", time: "4m" },
  { name: "Priya S.", text: "Is travel included for HSR Layout?", time: "18m" },
];

export default function ProviderDashboardPage() {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)] pb-[calc(92px+env(safe-area-inset-bottom))]">
        <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
          <div className="flex h-14 items-center justify-between gap-2 px-4 min-[390px]:px-5">
            <button
              aria-label="Provider profile"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]"
              type="button"
            >
              <User className="h-5 w-5" />
            </button>
            <h1 className="min-w-0 flex-1 truncate text-center text-headline-lg text-[var(--primary)]">
              Dashboard
            </h1>
            <button
              aria-label="Notifications"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--on-surface)]"
              type="button"
            >
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </header>

        <section className="px-4 py-5 min-[390px]:px-5 min-[390px]:py-6">
          <div className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-label-md text-[var(--on-surface-variant)]">Operational home</p>
                <h2 className="mt-1 text-headline-md text-[var(--on-surface)]">
                  Good morning, Arjun
                </h2>
                <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                  Review leads, manage jobs, reply fast, and track performance.
                </p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--primary)] text-[var(--on-primary)]">
                <LayoutDashboard className="h-5 w-5" />
              </span>
            </div>
          </div>

          <section className="mt-4 grid grid-cols-2 gap-3" aria-label="Provider summary">
            {summaryCards.map(({ detail, icon: Icon, label, value }) => (
              <article
                className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]"
                key={label}
              >
                <div className="flex items-center gap-2 text-[var(--on-surface-variant)]">
                  <Icon className="h-4 w-4" />
                  <span className="truncate text-label-md">{label}</span>
                </div>
                <p className="mt-2 text-headline-sm text-[var(--on-surface)]">{value}</p>
                <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">{detail}</p>
              </article>
            ))}
          </section>

          <section className="mt-5 border-b border-[var(--outline-variant)]">
            <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1">
              {tabs.map((tab, index) => (
                <button
                  className={
                    index === 0
                      ? "min-h-11 shrink-0 border-b-2 border-[var(--primary)] px-4 text-label-lg text-[var(--primary)]"
                      : "min-h-11 shrink-0 px-4 text-label-lg text-[var(--on-surface-variant)]"
                  }
                  key={tab}
                  type="button"
                >
                  {tab}
                </button>
              ))}
            </div>
          </section>

          <section className="mt-4 flex flex-col gap-3">
            {leads.map(({ budget, meta, status, title }) => (
              <article
                className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4"
                key={title}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-label-lg text-[var(--on-surface)]">{title}</h3>
                    <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">{meta}</p>
                  </div>
                  <span className="shrink-0 rounded bg-[var(--surface-container)] px-2 py-1 text-label-sm text-[var(--on-surface)]">
                    {status}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--surface-variant)] pt-3">
                  <div>
                    <p className="text-label-sm text-[var(--on-surface-variant)]">Customer budget</p>
                    <p className="text-label-lg text-[var(--on-surface)]">{budget}</p>
                  </div>
                  <button className="min-h-10 rounded-md bg-[var(--primary)] px-4 text-label-md text-[var(--on-primary)]" type="button">
                    View Lead
                  </button>
                </div>
              </article>
            ))}
          </section>

          <section className="mt-5 grid grid-cols-2 gap-3">
            <DashboardPanel title="Jobs" icon={CalendarClock}>
              {jobs.map(({ status, time, title }) => (
                <CompactRow key={title} title={title} detail={`${time} • ${status}`} />
              ))}
            </DashboardPanel>
            <DashboardPanel title="Messages" icon={MessageSquare}>
              {messages.map(({ name, text, time }) => (
                <CompactRow key={name} title={`${name} • ${time}`} detail={text} />
              ))}
            </DashboardPanel>
          </section>

          <section className="mt-5 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[var(--primary)]" />
              <h3 className="text-headline-sm text-[var(--on-surface)]">Performance</h3>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <Metric label="Views" value="248" />
              <Metric label="Accept" value="68%" />
              <Metric label="Repeat" value="22%" />
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-md bg-[var(--surface-container-low)] p-3">
              <TrendingUp className="h-5 w-5 shrink-0 text-[var(--primary)]" />
              <p className="text-body-sm text-[var(--on-surface-variant)]">
                Responding within 10 minutes keeps you higher in local matches.
              </p>
            </div>
          </section>
        </section>

        <ProviderBottomNav />
      </div>
    </main>
  );
}

function DashboardPanel({
  children,
  icon: Icon,
  title,
}: {
  children: React.ReactNode;
  icon: typeof CalendarClock;
  title: string;
}) {
  return (
    <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Icon className="h-4 w-4 shrink-0 text-[var(--primary)]" />
          <h3 className="truncate text-label-lg text-[var(--on-surface)]">{title}</h3>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-[var(--secondary)]" />
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  );
}

function CompactRow({ detail, title }: { detail: string; title: string }) {
  return (
    <div className="border-t border-[var(--surface-variant)] pt-2 first:border-t-0 first:pt-0">
      <p className="truncate text-label-md text-[var(--on-surface)]">{title}</p>
      <p className="mt-0.5 line-clamp-2 text-body-sm text-[var(--on-surface-variant)]">{detail}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-[var(--surface-container-low)] px-2 py-3">
      <p className="text-headline-sm text-[var(--on-surface)]">{value}</p>
      <p className="mt-1 text-label-sm text-[var(--on-surface-variant)]">{label}</p>
    </div>
  );
}

function ProviderBottomNav() {
  const items = [
    { label: "Dashboard", icon: LayoutDashboard, active: true },
    { label: "Leads", icon: ListChecks },
    { label: "Jobs", icon: BriefcaseBusiness },
    { label: "Messages", icon: MessageSquare },
    { label: "Earnings", icon: IndianRupee },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]">
      <div className="grid h-20 grid-cols-5 px-1 pb-[env(safe-area-inset-bottom)] text-[var(--on-surface-variant)]">
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
