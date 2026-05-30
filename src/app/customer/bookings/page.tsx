"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Check, IndianRupee, MapPin, Menu, Search, ShieldCheck, Star, User } from "lucide-react";
import { loadCustomerBookings, type CustomerBooking } from "@/services/customer-booking-service";
import { SetuLoader } from "@/components/setu-loader";

const tabs = ["Upcoming", "Active", "Completed"] as const;
type BookingTab = (typeof tabs)[number];
const tabBucket: Record<BookingTab, CustomerBooking["bucket"]> = {
  Upcoming: "upcoming",
  Active: "active",
  Completed: "completed",
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export default function CustomerBookingsPage() {
  const [activeTab, setActiveTab] = useState<BookingTab>("Upcoming");
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    loadCustomerBookings()
      .then((data) => {
        if (cancelled) return;
        setBookings(data.bookings);
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

  const visible = useMemo(
    () => bookings.filter((booking) => booking.bucket === tabBucket[activeTab]),
    [bookings, activeTab],
  );

  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)]">
        <BookingsHeader />
        <BookingTabs activeTab={activeTab} onChange={setActiveTab} />

        <section className="flex min-w-0 flex-col gap-4 px-4 py-4 min-[390px]:px-5">
          {isLoading ? (
            <SetuLoader label="Loading your bookings..." />
          ) : error ? (
            <p className="rounded-md border border-[var(--error)] bg-[var(--error-container)] px-3 py-2 text-body-sm text-[var(--on-error-container)]">
              {error}
            </p>
          ) : visible.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-6 text-center">
              <p className="text-body-md text-[var(--on-surface)]">No {activeTab.toLowerCase()} bookings.</p>
              <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                {activeTab === "Upcoming"
                  ? "Book a trusted provider to see it here."
                  : "Bookings will appear here as they progress."}
              </p>
              {activeTab === "Upcoming" ? (
                <Link
                  className="mt-4 inline-flex min-h-10 items-center justify-center rounded-md bg-[var(--primary)] px-4 text-label-md text-[var(--on-primary)]"
                  href="/customer"
                >
                  Find providers
                </Link>
              ) : null}
            </div>
          ) : (
            visible.map((booking) => <BookingCard booking={booking} key={booking.id} />)
          )}

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
          type="button"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="truncate text-center text-headline-sm text-[var(--primary)]">Bookings</h1>
        <button
          aria-label="Search bookings"
          className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--on-surface-variant)]"
          type="button"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

function BookingTabs({ activeTab, onChange }: { activeTab: BookingTab; onChange: (tab: BookingTab) => void }) {
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

function BookingCard({ booking }: { booking: CustomerBooking }) {
  return (
    <article className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-high)]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#ffffff_0%,#dadada_100%)]" />
            <User className="absolute bottom-0.5 h-7 w-7 text-[var(--on-surface-variant)] opacity-45" />
            <span className="relative z-10 text-label-md">{booking.providerInitials}</span>
          </div>
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-1">
              <h2 className="truncate text-headline-sm">{booking.providerName}</h2>
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 fill-current" />
            </div>
            <p className="truncate text-body-sm text-[var(--on-surface-variant)]">{booking.service}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-[var(--surface-container-low)] px-3 py-1 text-label-sm">
          {booking.statusLabel}
        </span>
      </div>

      <div className="mt-4 grid gap-2 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-3">
        <p className="text-label-lg">{booking.whenLabel}</p>
        <p className="text-body-sm text-[var(--on-surface-variant)]">
          {booking.packageTitle}
          {booking.amountInr > 0 ? ` · ₹${booking.amountInr.toLocaleString("en-IN")}` : " · Custom quote"}
        </p>
        {booking.address ? (
          <p className="flex items-start gap-1 text-body-sm text-[var(--on-surface-variant)]">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span className="min-w-0">{booking.address}</span>
          </p>
        ) : null}
      </div>

      {booking.otp ? (
        <div className="mt-3 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-3">
          <p className="text-label-sm uppercase text-[var(--on-surface-variant)]">Booking OTP</p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <span className="rounded-md bg-[var(--surface-container)] px-3 py-1.5 text-headline-sm tracking-[0.3em]">
              {booking.otp}
            </span>
            <span className="text-body-sm text-[var(--on-surface-variant)]">Share with your provider to start.</span>
          </div>
        </div>
      ) : null}

      {booking.checklist.length ? (
        <div className="mt-3 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-3">
          <p className="text-label-sm uppercase text-[var(--on-surface-variant)]">Service progress</p>
          <div className="mt-2 flex flex-col gap-1.5">
            {booking.checklist.map((item) => (
              <div className="flex items-center gap-2 text-body-sm" key={item.key}>
                <span
                  className={
                    item.done
                      ? "flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--on-primary)]"
                      : "flex h-4 w-4 items-center justify-center rounded-full border border-[var(--outline)]"
                  }
                >
                  {item.done ? <Check className="h-3 w-3" /> : null}
                </span>
                <span className={item.done ? "text-[var(--on-surface)]" : "text-[var(--on-surface-variant)]"}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link
          className="flex min-h-11 items-center justify-center rounded-md border border-[var(--outline)] bg-[var(--surface-container-lowest)] px-4 text-label-md"
          href={`/customer/chat-thread?providerId=${booking.providerId}`}
        >
          Message
        </Link>
        {booking.bucket === "completed" && !booking.paid ? (
          <Link
            className="flex min-h-11 items-center justify-center gap-1 rounded-md bg-[var(--primary)] px-4 text-label-md text-[var(--on-primary)]"
            href={`/customer/checkout?bookingId=${booking.id}`}
          >
            <IndianRupee className="h-4 w-4" />
            Pay now
          </Link>
        ) : booking.bucket === "completed" && booking.reviewed ? (
          <span className="flex min-h-11 items-center justify-center gap-1 rounded-md bg-[var(--surface-container)] px-4 text-label-md text-[var(--on-surface)]">
            <Star className="h-4 w-4 fill-current" />
            Reviewed
          </span>
        ) : booking.bucket === "completed" ? (
          <Link
            className="flex min-h-11 items-center justify-center rounded-md bg-[var(--primary)] px-4 text-label-md text-[var(--on-primary)]"
            href={`/customer/rating-review?bookingId=${booking.id}`}
          >
            Rate Service
          </Link>
        ) : (
          <span className="flex min-h-11 items-center justify-center gap-1 rounded-md bg-[var(--surface-container)] px-4 text-label-md text-[var(--on-surface)]">
            <IndianRupee className="h-4 w-4" />
            {booking.amountInr > 0 ? booking.amountInr.toLocaleString("en-IN") : "Quote"}
          </span>
        )}
      </div>
    </article>
  );
}

function SupportNote() {
  return (
    <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-4 text-center">
      <p className="text-body-sm text-[var(--on-surface-variant)]">
        Need assistance with a booking? Use Help for cancellation, provider delay, payment, or safety support.
      </p>
    </section>
  );
}
