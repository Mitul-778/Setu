"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Home,
  IndianRupee,
  NotebookPen,
} from "lucide-react";
import { createBooking, loadBookingContext, type BookingContext } from "@/services/customer-booking-service";

const times = ["09:00 AM", "10:30 AM", "02:00 PM", "04:30 PM"];
const platformFee = 49;

type DayOption = { iso: string; day: string; dateNum: string; month: string };

function buildDates(offset: number): DayOption[] {
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  base.setDate(base.getDate() + offset * 5);

  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date(base);
    date.setDate(base.getDate() + index);
    return {
      iso: date.toISOString(),
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      dateNum: String(date.getDate()),
      month: date.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    };
  });
}

function toScheduledIso(dateIso: string, timeLabel: string) {
  const date = new Date(dateIso);
  const match = timeLabel.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (match) {
    let hours = Number(match[1]) % 12;
    if (/PM/i.test(match[3])) hours += 12;
    date.setHours(hours, Number(match[2]), 0, 0);
  }
  return date.toISOString();
}

function CustomerBookingPage() {
  const router = useRouter();
  const params = useSearchParams();
  const providerId = params.get("providerId") ?? "";

  const [context, setContext] = useState<BookingContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDateIso, setSelectedDateIso] = useState(() => buildDates(0)[0].iso);
  const [selectedTime, setSelectedTime] = useState(times[0]);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const dates = useMemo(() => buildDates(weekOffset), [weekOffset]);

  useEffect(() => {
    if (!providerId) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setLoadError("No provider selected.");
      setIsLoading(false);
      /* eslint-enable react-hooks/set-state-in-effect */
      return;
    }

    let cancelled = false;
    loadBookingContext(providerId)
      .then((data) => {
        if (cancelled) return;
        setContext(data);
        setSelectedPackageId(data.provider.packages[0]?.id ?? null);
        setAddress(data.customer.addressLabel ?? "");
      })
      .catch((error) => {
        if (cancelled) return;
        setLoadError(error instanceof Error ? error.message : "Could not load booking details.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [providerId]);

  const provider = context?.provider;
  const selectedPackage = provider?.packages.find((pkg) => pkg.id === selectedPackageId) ?? null;
  const total = selectedPackage ? selectedPackage.priceInr + platformFee : null;
  const monthLabel = dates[0]?.month ?? "";

  async function handleConfirm() {
    if (!providerId || submitting) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const result = await createBooking({
        providerId,
        packageId: selectedPackageId ?? undefined,
        scheduledAt: toScheduledIso(selectedDateIso, selectedTime),
        address: address.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      router.push(result.nextPath);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not create your booking.");
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)] pb-[calc(112px+env(safe-area-inset-bottom))]">
        <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
          <div className="grid h-12 grid-cols-[2.5rem_1fr_2.5rem] items-center px-3 min-[390px]:px-4">
            <Link
              aria-label="Go back"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--primary)]"
              href={providerId ? `/customer/trust-passport?providerId=${providerId}` : "/customer/results"}
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="truncate text-center text-headline-sm text-[var(--primary)]">Book Service</h1>
            <div className="h-10 w-10" />
          </div>
        </header>

        {isLoading ? (
          <p className="px-4 py-6 text-body-sm text-[var(--on-surface-variant)]">Loading booking details...</p>
        ) : loadError || !provider ? (
          <section className="flex flex-col items-center gap-3 px-4 py-16 text-center">
            <p className="text-headline-sm text-[var(--on-surface)]">{loadError || "Provider not found"}</p>
            <Link
              className="mt-2 inline-flex min-h-10 items-center justify-center rounded-md bg-[var(--primary)] px-4 text-label-md text-[var(--on-primary)]"
              href="/customer/results"
            >
              Back to results
            </Link>
          </section>
        ) : (
          <>
            <section className="flex min-w-0 flex-col gap-5 px-4 py-5 min-[390px]:px-5">
              <div className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
                <p className="text-label-sm uppercase text-[var(--on-surface-variant)]">Booking with</p>
                <p className="mt-1 text-headline-sm text-[var(--on-surface)]">{provider.name}</p>
                <p className="text-body-sm text-[var(--on-surface-variant)]">{provider.service}</p>
              </div>

              <BookingTabs />

              <Section title="Date and time">
                <div className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
                  <div className="flex items-center justify-between border-b border-[var(--surface-variant)] pb-4">
                    <button
                      aria-label="Previous days"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--on-surface-variant)] disabled:opacity-40"
                      disabled={weekOffset <= 0}
                      onClick={() => setWeekOffset((offset) => Math.max(0, offset - 1))}
                      type="button"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-label-lg">{monthLabel}</span>
                    <button
                      aria-label="Next days"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--on-surface-variant)]"
                      onClick={() => setWeekOffset((offset) => offset + 1)}
                      type="button"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-5 gap-2">
                    {dates.map(({ dateNum, day, iso }) => {
                      const active = iso === selectedDateIso;
                      return (
                        <button
                          className={
                            active
                              ? "flex min-h-14 flex-col items-center justify-center gap-1 rounded-md bg-[var(--primary)] text-[var(--on-primary)]"
                              : "flex min-h-14 flex-col items-center justify-center gap-1 rounded-md bg-[var(--surface-container-low)] text-[var(--on-surface)]"
                          }
                          key={iso}
                          onClick={() => setSelectedDateIso(iso)}
                          type="button"
                        >
                          <span className="text-label-sm">{day}</span>
                          <span className="text-label-lg">{dateNum}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 border-t border-[var(--surface-variant)] pt-4">
                    <div className="mb-2 flex items-center gap-2 text-label-sm text-[var(--on-surface-variant)]">
                      <Clock className="h-4 w-4" />
                      Available times
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {times.map((time) => {
                        const active = time === selectedTime;
                        return (
                          <button
                            className={
                              active
                                ? "min-h-9 rounded-full border border-[var(--primary)] bg-[var(--primary)] px-3 text-label-md text-[var(--on-primary)]"
                                : "min-h-9 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 text-label-md"
                            }
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            type="button"
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Section>

              <Section title="Address">
                <div className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--surface-container-low)]">
                      <Home className="h-4 w-4" />
                    </span>
                    <label className="min-w-0 flex-1">
                      <span className="text-label-sm uppercase text-[var(--on-surface-variant)]">Service address</span>
                      <textarea
                        className="mt-2 min-h-20 w-full resize-none rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3 text-body-md outline-none placeholder:text-[var(--on-surface-variant)] focus:border-[var(--primary)]"
                        onChange={(event) => setAddress(event.target.value)}
                        placeholder="House / flat no., street, area, city, pincode"
                        value={address}
                      />
                    </label>
                  </div>
                </div>
              </Section>

              <Section title="Choose a package">
                {provider.packages.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-4 text-body-sm text-[var(--on-surface-variant)]">
                    This provider works on custom quotes. Confirm to request a booking and they will share pricing.
                  </p>
                ) : (
                  <div className="grid gap-2">
                    {provider.packages.map((pkg) => {
                      const active = pkg.id === selectedPackageId;
                      return (
                        <button
                          className={
                            active
                              ? "flex items-start justify-between gap-3 rounded-lg border-2 border-[var(--primary)] bg-[var(--surface-container-lowest)] p-4 text-left"
                              : "flex items-start justify-between gap-3 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4 text-left"
                          }
                          key={pkg.id}
                          onClick={() => setSelectedPackageId(pkg.id)}
                          type="button"
                        >
                          <span className="min-w-0">
                            <span className="flex items-center gap-2 text-label-lg text-[var(--on-surface)]">
                              {active ? <Check className="h-4 w-4 shrink-0 text-[var(--primary)]" /> : null}
                              {pkg.name}
                            </span>
                            {pkg.description ? (
                              <span className="mt-1 block text-body-sm text-[var(--on-surface-variant)]">
                                {pkg.description}
                              </span>
                            ) : null}
                          </span>
                          <span className="shrink-0 text-headline-sm">₹{pkg.priceInr.toLocaleString("en-IN")}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </Section>

              <Section title="Add notes">
                <label className="relative block">
                  <NotebookPen className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[var(--on-surface-variant)]" />
                  <textarea
                    className="min-h-24 w-full resize-none rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3 pl-10 text-body-md outline-none placeholder:text-[var(--on-surface-variant)] focus:border-[var(--primary)]"
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Add access instructions, preferred design, event details, or anything the provider should know."
                    value={notes}
                  />
                </label>
              </Section>

              <Section title="Price estimate">
                <div className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
                  {selectedPackage ? (
                    <div className="grid gap-2 text-body-sm">
                      <Row label={selectedPackage.name} value={`₹${selectedPackage.priceInr.toLocaleString("en-IN")}`} />
                      <Row label="Platform protection" value={`₹${platformFee}`} />
                      <Row label={`Travel within ${provider.serviceRadiusKm} km`} value="Included" />
                    </div>
                  ) : (
                    <p className="text-body-sm text-[var(--on-surface-variant)]">
                      Pricing will be confirmed by the provider as a custom quote.
                    </p>
                  )}
                  <div className="mt-3 border-t border-[var(--surface-variant)] pt-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-label-lg">Estimated total</span>
                      <span className="flex items-center text-headline-md">
                        {total != null ? (
                          <>
                            <IndianRupee className="h-5 w-5" />
                            {total.toLocaleString("en-IN")}
                          </>
                        ) : (
                          "Custom quote"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </Section>

              {submitError ? (
                <p className="rounded-md border border-[var(--error)] bg-[var(--error-container)] px-3 py-2 text-body-sm text-[var(--on-error-container)]">
                  {submitError}
                </p>
              ) : null}
            </section>

            <footer className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-[var(--outline-variant)] bg-[var(--surface)] px-4 py-3">
              <div className="mx-auto flex w-full max-w-[480px] items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-label-sm text-[var(--on-surface-variant)]">Estimated total</p>
                  <p className="text-headline-md">
                    {total != null ? `₹${total.toLocaleString("en-IN")}` : "Custom quote"}
                  </p>
                </div>
                <button
                  className="flex min-h-12 shrink-0 items-center justify-center rounded-md bg-[var(--primary)] px-5 text-label-lg text-[var(--on-primary)] disabled:opacity-60"
                  disabled={submitting}
                  onClick={handleConfirm}
                  type="button"
                >
                  {submitting ? "Confirming..." : "Confirm Booking"}
                </button>
              </div>
              <div className="h-[env(safe-area-inset-bottom)]" />
            </footer>
          </>
        )}
      </div>
    </main>
  );
}

export default function CustomerBookingPageWrapper() {
  return (
    <Suspense fallback={null}>
      <CustomerBookingPage />
    </Suspense>
  );
}

function BookingTabs() {
  return (
    <div className="grid grid-cols-2 rounded-lg bg-[var(--surface-container-low)] p-1">
      <button
        className="min-h-10 rounded-md bg-[var(--surface-container-lowest)] px-3 text-label-md text-[var(--primary)] shadow-[0_1px_2px_rgb(0_0_0_/_0.05)]"
        type="button"
      >
        One-time service
      </button>
      <button className="min-h-10 rounded-md px-3 text-label-md text-[var(--on-surface-variant)]" type="button">
        Recurring plan
      </button>
    </div>
  );
}

function Section({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-headline-sm">{title}</h2>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[var(--on-surface-variant)]">{label}</span>
      <span className="text-[var(--on-surface)]">{value}</span>
    </div>
  );
}
