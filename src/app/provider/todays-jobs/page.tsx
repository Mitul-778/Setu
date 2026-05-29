"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  IndianRupee,
  LayoutDashboard,
  ListChecks,
  Map,
  MapPin,
  MessageSquare,
  Navigation,
  Sparkles,
} from "lucide-react";

const calendarDays = [
  { day: "Tue", date: "24" },
  { day: "Wed", date: "25" },
  { day: "Thu", date: "26", active: true },
  { day: "Fri", date: "27" },
  { day: "Sat", date: "28" },
  { day: "Sun", date: "29" },
];

const checklistItems = [
  "Arrive at location",
  "Confirm customer requirement",
  "Setup workstation",
  "Complete bridal mehendi",
  "Apply sealant and care instructions",
];

const upcomingJobs = [
  {
    title: "Makeup for guest",
    time: "5:30 PM",
    location: "Domlur, 2 km away",
    status: "Pending",
    price: "\u20B91,800",
  },
  {
    title: "Mehendi for bridesmaids",
    time: "7:00 PM",
    location: "Same location",
    status: "Ready",
    price: "\u20B92,200",
  },
];

export default function ProviderTodaysJobsPage() {
  const [started, setStarted] = useState(false);
  const [checkedItems, setCheckedItems] = useState<string[]>([checklistItems[0]]);
  const [otp, setOtp] = useState("");

  const allChecklistDone = checkedItems.length === checklistItems.length;
  const canComplete = started && allChecklistDone && otp.length === 4;
  const completedCount = checkedItems.length;

  const otpHelpText = useMemo(() => {
    if (!started) return "Start the service before collecting OTP.";
    if (!allChecklistDone) return "Finish the checklist before marking complete.";
    if (otp.length !== 4) return "Collect the 4-digit OTP from the customer.";
    return "OTP collected. You can mark the job complete.";
  }, [allChecklistDone, otp.length, started]);

  function toggleChecklist(item: string) {
    setCheckedItems((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
    );
  }

  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)] pb-[calc(92px+env(safe-area-inset-bottom))]">
        <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
          <div className="flex h-14 items-center justify-between gap-3 px-4 min-[390px]:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-container-high)] text-label-md text-[var(--on-surface)]">
                AS
              </div>
              <div className="min-w-0">
                <p className="truncate text-label-sm text-[var(--on-surface-variant)]">Provider jobs</p>
                <h1 className="truncate text-headline-sm text-[var(--primary)]">Today&apos;s Jobs</h1>
              </div>
            </div>
            <span className="rounded-full bg-[var(--surface-container-low)] px-3 py-1 text-label-sm text-[var(--on-surface)]">
              3 jobs
            </span>
          </div>
        </header>

        <section className="px-4 py-4 min-[390px]:px-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-headline-lg text-[var(--primary)]">Thursday, Oct 26</h2>
              <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                Stay on schedule, collect OTP, and report issues quickly.
              </p>
            </div>
            <div className="rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 py-2 text-right">
              <p className="text-label-sm text-[var(--on-surface-variant)]">Earn today</p>
              <p className="text-label-lg text-[var(--on-surface)]">{"\u20B97,500"}</p>
            </div>
          </div>

          <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 min-[390px]:-mx-5 min-[390px]:px-5">
            {calendarDays.map(({ active, date, day }) => (
              <button
                className={
                  active
                    ? "flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--on-primary)]"
                    : "flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] text-[var(--on-surface)]"
                }
                key={`${day}-${date}`}
                type="button"
              >
                <span className={active ? "text-label-sm text-[var(--on-primary)]/80" : "text-label-sm text-[var(--on-surface-variant)]"}>
                  {day}
                </span>
                <span className="mt-1 text-headline-sm">{date}</span>
              </button>
            ))}
          </div>

          <section className="mt-5">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h3 className="text-label-lg uppercase text-[var(--on-surface-variant)]">Current job</h3>
              <span className="rounded-full bg-[var(--secondary-container)] px-3 py-1 text-label-sm text-[var(--on-secondary-container)]">
                {started ? "In progress" : "Ready to start"}
              </span>
            </div>

            <article className="overflow-hidden rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-4 py-3">
                <div className="flex min-w-0 items-center gap-2 text-[var(--on-surface)]">
                  <Clock3 className="h-5 w-5 shrink-0" />
                  <span className="truncate text-label-lg">2:00 PM - 5:00 PM</span>
                </div>
                <span className="shrink-0 rounded bg-[var(--surface-container-lowest)] px-2 py-1 text-label-sm text-[var(--on-surface)]">
                  Confirmed
                </span>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-headline-sm text-[var(--on-surface)]">
                      Mehendi artist for engagement party
                    </h3>
                    <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                      Bridal design plus simple guest patterns for 25-30 people.
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-label-sm text-[var(--on-surface-variant)]">Payout</p>
                    <p className="text-headline-sm text-[var(--primary)]">{"\u20B93,500"}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-[var(--surface-variant)] bg-[var(--surface-container-low)] p-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--surface-container-lowest)] text-[var(--primary)]">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-label-lg text-[var(--on-surface)]">Indiranagar, Bangalore</p>
                      <p className="mt-0.5 text-body-sm text-[var(--on-surface-variant)]">
                        2.4 km away. Suggested route via 100 Feet Road.
                      </p>
                      <button
                        className="mt-2 inline-flex min-h-9 items-center gap-2 rounded-md border border-[var(--outline)] bg-[var(--surface-container-lowest)] px-3 text-label-md text-[var(--primary)]"
                        type="button"
                      >
                        <Navigation className="h-4 w-4" />
                        View Route
                      </button>
                    </div>
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]">
                      <Map className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                <section className="mt-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h4 className="text-label-lg text-[var(--on-surface)]">Job checklist</h4>
                    <span className="text-label-sm text-[var(--on-surface-variant)]">
                      {completedCount}/{checklistItems.length} done
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {checklistItems.map((item) => {
                      const checked = checkedItems.includes(item);
                      return (
                        <label
                          className="flex min-h-11 items-center gap-3 rounded-md border border-transparent bg-[var(--surface-container-low)] px-3 py-2"
                          key={item}
                        >
                          <input
                            checked={checked}
                            className="h-5 w-5 rounded border-[var(--outline)] text-[var(--primary)] focus:ring-[var(--primary)]"
                            onChange={() => toggleChecklist(item)}
                            type="checkbox"
                          />
                          <span
                            className={
                              checked
                                ? "text-body-md text-[var(--on-surface-variant)] line-through"
                                : "text-body-md text-[var(--on-surface)]"
                            }
                          >
                            {item}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </section>

                <section className="mt-4 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3">
                  <label className="text-label-lg text-[var(--on-surface)]" htmlFor="completion-otp">
                    Collect OTP confirmation
                  </label>
                  <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">{otpHelpText}</p>
                  <input
                    className="mt-3 h-12 w-full rounded-md border border-[var(--outline)] bg-[var(--surface)] px-4 text-center text-headline-sm tracking-[0.25em] text-[var(--on-surface)] outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                    id="completion-otp"
                    inputMode="numeric"
                    maxLength={4}
                    onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="0000"
                    value={otp}
                  />
                </section>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    className={
                      started
                        ? "flex min-h-12 items-center justify-center gap-2 rounded-md border border-[var(--outline)] bg-[var(--surface-container-lowest)] px-3 text-label-lg text-[var(--on-surface-variant)]"
                        : "flex min-h-12 items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-3 text-label-lg text-[var(--on-primary)]"
                    }
                    disabled={started}
                    onClick={() => setStarted(true)}
                    type="button"
                  >
                    <Sparkles className="h-5 w-5" />
                    {started ? "Started" : "Start Service"}
                  </button>
                  <button
                    className={
                      canComplete
                        ? "flex min-h-12 items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-3 text-label-lg text-[var(--on-primary)]"
                        : "flex min-h-12 items-center justify-center gap-2 rounded-md bg-[var(--surface-variant)] px-3 text-label-lg text-[var(--on-surface-variant)] opacity-70"
                    }
                    disabled={!canComplete}
                    type="button"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    Mark Complete
                  </button>
                </div>

                <button
                  className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-md text-label-md text-[var(--on-surface-variant)]"
                  type="button"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Report issue
                </button>
              </div>
            </article>
          </section>

          <section className="mt-5">
            <h3 className="mb-2 text-label-lg uppercase text-[var(--on-surface-variant)]">Upcoming today</h3>
            <div className="flex flex-col gap-3">
              {upcomingJobs.map(({ location, price, status, time, title }) => (
                <article
                  className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4"
                  key={title}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--surface-container-low)] text-[var(--primary)]">
                        <BriefcaseBusiness className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <h4 className="truncate text-label-lg text-[var(--on-surface)]">{title}</h4>
                        <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                          {time} - {location}
                        </p>
                        <p className="mt-1 text-label-md text-[var(--primary)]">{price}</p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded bg-[var(--surface-container)] px-2 py-1 text-label-sm text-[var(--on-surface-variant)]">
                      {status}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>

        <ProviderBottomNav />
      </div>
    </main>
  );
}

function ProviderBottomNav() {
  const items = [
    { label: "Home", icon: LayoutDashboard, active: true },
    { label: "Leads", icon: ListChecks },
    { label: "Jobs", icon: CalendarDays },
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
