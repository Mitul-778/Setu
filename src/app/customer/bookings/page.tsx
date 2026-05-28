 "use client";

import Link from "next/link";
import { useState } from "react";
import {
  CalendarClock,
  Check,
  CircleHelp,
  Clock,
  Menu,
  MessageSquare,
  Phone,
  Search,
  ShieldCheck,
  Star,
  User,
  XCircle,
} from "lucide-react";

const tabs = ["Upcoming", "Active", "Completed"];
type BookingTab = (typeof tabs)[number];

const timeline = [
  {
    title: "Booking confirmed",
    description: "Today, 09:30 AM",
    state: "done",
  },
  {
    title: "En route",
    description: "Arjun has started the journey.",
    state: "current",
  },
  {
    title: "Service started",
    description: "Pending OTP verification.",
    state: "pending",
  },
  {
    title: "Complete",
    description: "Payment and review after service.",
    state: "pending",
  },
];

const quickActions = [
  { label: "Call", icon: Phone },
  { label: "Chat", icon: MessageSquare, href: "/customer/chat-thread" },
  { label: "Reschedule", icon: CalendarClock },
  { label: "Cancel", icon: XCircle },
  { label: "Help", icon: CircleHelp },
];

export default function CustomerBookingsPage() {
  const [activeTab, setActiveTab] = useState<BookingTab>("Active");

  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)]">
        <BookingsHeader />
        <BookingTabs activeTab={activeTab} onChange={setActiveTab} />

        <section className="flex min-w-0 flex-col gap-4 px-4 py-4 min-[390px]:px-5">
          {activeTab === "Upcoming" ? <UpcomingBookings /> : null}
          {activeTab === "Active" ? <ActiveBookingCard /> : null}
          {activeTab === "Completed" ? <CompletedBookings /> : null}
          <SupportNote />
        </section>
      </div>
    </main>
  );
}

function BookingsHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
      <div className="grid h-14 grid-cols-[2.75rem_1fr_2.75rem] items-center px-3 min-[390px]:px-4">
        <button
          aria-label="Menu"
          className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--on-surface-variant)]"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="truncate text-center text-headline-sm text-[var(--primary)]">
          Bookings
        </h1>
        <button
          aria-label="Search bookings"
          className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--on-surface-variant)]"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

function BookingTabs({
  activeTab,
  onChange,
}: {
  activeTab: BookingTab;
  onChange: (tab: BookingTab) => void;
}) {
  return (
    <div className="sticky top-14 z-30 grid grid-cols-3 border-b border-[var(--outline-variant)] bg-[var(--surface)] px-4 min-[390px]:px-5">
      {tabs.map((tab) => {
        const active = tab === activeTab;

        return (
          <button
            className={
              active
                ? "min-h-12 border-b-2 border-[var(--primary)] text-label-lg text-[var(--primary)]"
                : "min-h-12 border-b-2 border-transparent text-label-lg text-[var(--on-surface-variant)]"
            }
            key={tab}
            onClick={() => onChange(tab)}
            type="button"
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}

function UpcomingBookings() {
  return (
    <article className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-headline-sm">Priya Sharma</h2>
          <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
            Bridal Makeup
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-[var(--surface-container-low)] px-3 py-1 text-label-sm">
          Upcoming
        </span>
      </div>

      <div className="mt-4 grid gap-2 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-3">
        <p className="text-label-lg">Tomorrow, 10:00 AM</p>
        <p className="text-body-sm text-[var(--on-surface-variant)]">
          Indiranagar, Bangalore · Token paid {"\u20B9"}300
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button className="min-h-11 rounded-md border border-[var(--outline)] bg-[var(--surface-container-lowest)] px-4 text-label-md">
          Reschedule
        </button>
        <button className="min-h-11 rounded-md bg-[var(--primary)] px-4 text-label-md text-[var(--on-primary)]">
          View details
        </button>
      </div>
    </article>
  );
}

function ActiveBookingCard() {
  return (
    <article className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]">
      <ProviderHeader />
      <div className="my-4 h-px bg-[var(--surface-variant)]" />
      <OtpArrivalBlock />
      <Timeline />
      <div className="my-4 h-px bg-[var(--surface-variant)]" />
      <QuickActions />
    </article>
  );
}

function CompletedBookings() {
  return (
    <article className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-headline-sm">Arjun Singh</h2>
          <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
            Mehendi Artist
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-[var(--surface-container-low)] px-3 py-1 text-label-sm">
          Completed
        </span>
      </div>

      <div className="mt-4 grid gap-2 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-3">
        <p className="text-label-lg">Completed today, 6:15 PM</p>
        <p className="text-body-sm text-[var(--on-surface-variant)]">
          Basic Bridal package · Total paid {"\u20B9"}1,550
        </p>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-3">
        <p className="text-body-sm text-[var(--on-surface-variant)]">
          Help the community by sharing your experience.
        </p>
        <Link
          className="flex min-h-11 shrink-0 items-center justify-center rounded-md bg-[var(--primary)] px-4 text-label-md text-[var(--on-primary)]"
          href="/customer/rating-review"
        >
          Rate Service
        </Link>
      </div>
    </article>
  );
}

function ProviderHeader() {
  return (
    <section className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-high)]">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#ffffff_0%,#dadada_100%)]" />
          <User className="absolute bottom-0.5 h-7 w-7 text-[var(--on-surface-variant)] opacity-45" />
          <span className="relative z-10 text-label-md">AS</span>
        </div>

        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-1">
            <h2 className="truncate text-headline-sm">Arjun Singh</h2>
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 fill-current" />
          </div>
          <p className="text-body-sm text-[var(--on-surface-variant)]">
            Mehendi Artist
          </p>
          <p className="mt-1 flex items-center gap-1 text-label-sm text-[var(--on-surface-variant)]">
            <Star className="h-3 w-3 fill-current" />
            4.8 (120 reviews)
          </p>
        </div>
      </div>

      <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--secondary-container)] px-3 py-1 text-label-sm text-[var(--on-secondary-container)]">
        <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
        On the way
      </span>
    </section>
  );
}

function OtpArrivalBlock() {
  return (
    <section className="grid gap-3 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
      <div className="border-b border-[var(--surface-variant)] pb-3">
        <p className="text-label-sm uppercase text-[var(--on-surface-variant)]">
          Booking OTP
        </p>
        <div className="mt-2 flex items-center gap-3">
          <span className="rounded-md bg-[var(--surface-container-low)] px-3 py-2 text-headline-lg tracking-[0.2em]">
            4821
          </span>
        </div>
        <p className="mt-2 text-body-sm text-[var(--on-surface-variant)]">
          Share this with Arjun when he arrives.
        </p>
      </div>

      <div>
        <p className="text-label-sm uppercase text-[var(--on-surface-variant)]">
          Estimated arrival
        </p>
        <div className="mt-2 flex items-center gap-2">
          <Clock className="h-5 w-5 text-[var(--on-surface-variant)]" />
          <span className="text-headline-md">15 mins</span>
        </div>
      </div>
    </section>
  );
}

function Timeline() {
  return (
    <section className="mt-5">
      <h3 className="mb-3 text-headline-sm">Timeline</h3>
      <div className="grid gap-0">
        {timeline.map((step, index) => (
          <TimelineStep
            isLast={index === timeline.length - 1}
            key={step.title}
            step={step}
          />
        ))}
      </div>
    </section>
  );
}

function TimelineStep({
  isLast,
  step,
}: {
  isLast: boolean;
  step: (typeof timeline)[number];
}) {
  const done = step.state === "done";
  const current = step.state === "current";

  return (
    <div className="grid grid-cols-[1.5rem_1fr] gap-3">
      <div className="relative flex justify-center">
        <span
          className={
            done
              ? "z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--on-primary)]"
              : current
                ? "z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--primary)] bg-[var(--surface)]"
                : "z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--outline-variant)] bg-[var(--surface)]"
          }
        >
          {done ? (
            <Check className="h-3.5 w-3.5" />
          ) : current ? (
            <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
          ) : null}
        </span>
        {!isLast ? (
          <span
            className={
              done
                ? "absolute top-6 h-full w-px bg-[var(--primary)]"
                : "absolute top-6 h-full w-px bg-[var(--outline-variant)]"
            }
          />
        ) : null}
      </div>

      <div className={isLast ? "pb-0" : "pb-5"}>
        <h4
          className={
            done || current
              ? "text-label-lg text-[var(--primary)]"
              : "text-label-lg text-[var(--on-surface-variant)]"
          }
        >
          {step.title}
        </h4>
        <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
          {step.description}
        </p>
      </div>
    </div>
  );
}

function QuickActions() {
  return (
    <section>
      <h3 className="mb-3 text-headline-sm">Quick actions</h3>
      <div className="grid grid-cols-5 gap-2">
        {quickActions.map(({ href, icon: Icon, label }) => {
          const content = (
            <>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]">
                <Icon className="h-5 w-5" />
              </span>
              <span className="max-w-full truncate text-label-sm text-[var(--on-surface-variant)]">
                {label}
              </span>
            </>
          );

          return href ? (
            <Link
              className="flex min-w-0 flex-col items-center gap-1.5 rounded-lg p-1 text-center"
              href={href}
              key={label}
            >
              {content}
            </Link>
          ) : (
            <button
              className="flex min-w-0 flex-col items-center gap-1.5 rounded-lg p-1 text-center"
              key={label}
            >
              {content}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function SupportNote() {
  return (
    <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-4 text-center">
      <p className="text-body-sm text-[var(--on-surface-variant)]">
        Need assistance with this booking? Use Help for cancellation, provider
        delay, payment, or safety support.
      </p>
    </section>
  );
}
