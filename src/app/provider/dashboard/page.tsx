"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CalendarClock,
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
import {
  loadProviderDashboard,
  type ProviderDashboardResponse,
} from "@/services/provider-dashboard-service";

const tabs = ["Leads", "Jobs", "Messages", "Performance"] as const;
type Tab = (typeof tabs)[number];

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export default function ProviderDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<ProviderDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("Leads");

  useEffect(() => {
    let cancelled = false;

    loadProviderDashboard()
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

  const summary = data?.summary;
  const summaryCards = data
    ? [
        {
          label: "Verification",
          value: data.verification.label,
          detail: data.verification.detail,
          icon: ShieldCheck,
          href: "/provider/verification-status",
        },
        {
          label: "New Leads",
          value: String(summary!.newLeads),
          detail: `${summary!.urgentToday} urgent today`,
          icon: ListChecks,
        },
        {
          label: "Accepted Jobs",
          value: String(summary!.acceptedJobs),
          detail: `${summary!.jobsThisWeek} this week`,
          icon: BriefcaseBusiness,
        },
        {
          label: "Earnings",
          value: summary!.earningsThisMonthLabel,
          detail: "This month",
          icon: IndianRupee,
        },
        {
          label: "Response Rate",
          value: `${summary!.responseRatePct}%`,
          detail: `Avg ${summary!.avgResponseMin} min`,
          icon: Clock3,
        },
        {
          label: "Rating",
          value: summary!.ratingCount ? summary!.ratingAvg.toFixed(1) : "—",
          detail: `${summary!.ratingCount} reviews`,
          icon: Star,
        },
      ]
    : [];

  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)] pb-[calc(92px+env(safe-area-inset-bottom))]">
        <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
          <div className="flex h-14 items-center justify-between gap-2 px-4 min-[390px]:px-5">
            <button
              aria-label="Provider profile"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]"
              onClick={() => router.push("/provider/profile-preview")}
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
          {isLoading ? (
            <div className="rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-3 py-2 text-body-sm text-[var(--on-surface-variant)]">
              Loading dashboard...
            </div>
          ) : null}

          {error ? (
            <div className="rounded-md border border-[var(--error)] bg-[var(--error-container)] px-3 py-2 text-body-sm text-[var(--on-error-container)]">
              {error}
            </div>
          ) : null}

          {data ? (
            <>
              <div className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-label-md text-[var(--on-surface-variant)]">Operational home</p>
                    <h2 className="mt-1 text-headline-md text-[var(--on-surface)]">
                      Good morning, {data.greetingName}
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
                {summaryCards.map(({ detail, href, icon: Icon, label, value }) => {
                  const className =
                    "rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3 text-left shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]";
                  const inner = (
                    <>
                      <div className="flex items-center gap-2 text-[var(--on-surface-variant)]">
                        <Icon className="h-4 w-4" />
                        <span className="truncate text-label-md">{label}</span>
                      </div>
                      <p className="mt-2 text-headline-sm text-[var(--on-surface)]">{value}</p>
                      <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">{detail}</p>
                    </>
                  );

                  return href ? (
                    <button className={className} key={label} onClick={() => router.push(href)} type="button">
                      {inner}
                    </button>
                  ) : (
                    <article className={className} key={label}>
                      {inner}
                    </article>
                  );
                })}
              </section>

              <section className="mt-5 border-b border-[var(--outline-variant)]">
                <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1">
                  {tabs.map((tab) => (
                    <button
                      className={
                        activeTab === tab
                          ? "min-h-11 shrink-0 border-b-2 border-[var(--primary)] px-4 text-label-lg text-[var(--primary)]"
                          : "min-h-11 shrink-0 px-4 text-label-lg text-[var(--on-surface-variant)]"
                      }
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      type="button"
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </section>

              {activeTab === "Leads" ? (
                <section className="mt-4 flex flex-col gap-3">
                  {data.leads.length === 0 ? (
                    <EmptyState message="No new leads right now. We will notify you when a customer reaches out." />
                  ) : (
                    data.leads.map((lead) => (
                      <article
                        className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4"
                        key={lead.id}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="text-label-lg text-[var(--on-surface)]">{lead.title}</h3>
                            {lead.meta ? (
                              <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">{lead.meta}</p>
                            ) : null}
                          </div>
                          <span className="shrink-0 rounded bg-[var(--surface-container)] px-2 py-1 text-label-sm text-[var(--on-surface)]">
                            {lead.urgent ? "Urgent" : lead.status}
                          </span>
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--surface-variant)] pt-3">
                          <div>
                            <p className="text-label-sm text-[var(--on-surface-variant)]">Customer budget</p>
                            <p className="text-label-lg text-[var(--on-surface)]">{lead.budget}</p>
                          </div>
                          <button
                            className="min-h-10 rounded-md bg-[var(--primary)] px-4 text-label-md text-[var(--on-primary)]"
                            onClick={() => router.push("/provider/lead-details")}
                            type="button"
                          >
                            View Lead
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </section>
              ) : null}

              {activeTab === "Jobs" ? (
                <DashboardPanel className="mt-4" title="Jobs" icon={CalendarClock}>
                  {data.jobs.length === 0 ? (
                    <EmptyState message="No upcoming jobs scheduled." />
                  ) : (
                    data.jobs.map((job) => (
                      <CompactRow key={job.id} title={job.title} detail={`${job.time} • ${job.status}`} />
                    ))
                  )}
                </DashboardPanel>
              ) : null}

              {activeTab === "Messages" ? (
                <DashboardPanel className="mt-4" title="Messages" icon={MessageSquare}>
                  {data.messages.length === 0 ? (
                    <EmptyState message="No messages yet." />
                  ) : (
                    data.messages.map((message) => (
                      <CompactRow
                        key={message.id}
                        title={`${message.name}${message.unread ? ` • ${message.unread} new` : ""}`}
                        detail={message.text}
                      />
                    ))
                  )}
                </DashboardPanel>
              ) : null}

              {activeTab === "Performance" ? (
                <section className="mt-4 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[var(--primary)]" />
                    <h3 className="text-headline-sm text-[var(--on-surface)]">Performance</h3>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <Metric label="Views" value={String(data.performance.views ?? 0)} />
                    <Metric label="Accept" value={`${data.performance.acceptPct ?? 0}%`} />
                    <Metric label="Repeat" value={`${data.performance.repeatPct ?? 0}%`} />
                  </div>
                  <div className="mt-4 flex items-center gap-2 rounded-md bg-[var(--surface-container-low)] p-3">
                    <TrendingUp className="h-5 w-5 shrink-0 text-[var(--primary)]" />
                    <p className="text-body-sm text-[var(--on-surface-variant)]">
                      Responding within 10 minutes keeps you higher in local matches.
                    </p>
                  </div>
                </section>
              ) : null}
            </>
          ) : null}
        </section>

        <ProviderBottomNav onNavigate={(href) => router.push(href)} />
      </div>
    </main>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-lg border border-dashed border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-4 text-body-sm text-[var(--on-surface-variant)]">
      {message}
    </p>
  );
}

function DashboardPanel({
  children,
  className,
  icon: Icon,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  icon: typeof CalendarClock;
  title: string;
}) {
  return (
    <section
      className={`rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3 ${className ?? ""}`}
    >
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

function ProviderBottomNav({ onNavigate }: { onNavigate: (href: string) => void }) {
  const items = [
    { label: "Dashboard", href: "/provider/dashboard", icon: LayoutDashboard, active: true },
    { label: "Leads", href: "/provider/lead-details", icon: ListChecks },
    { label: "Jobs", href: "/provider/todays-jobs", icon: BriefcaseBusiness },
    { label: "Messages", href: "/provider/dashboard", icon: MessageSquare },
    { label: "Earnings", href: "/provider/earnings-performance", icon: IndianRupee },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]">
      <div className="grid h-20 grid-cols-5 px-1 pb-[env(safe-area-inset-bottom)] text-[var(--on-surface-variant)]">
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
