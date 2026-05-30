"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  CreditCard,
  Lock,
  ShieldCheck,
  Smartphone,
  User,
} from "lucide-react";
import { loadCheckout, payForBooking, type CheckoutContext } from "@/services/customer-checkout-service";

const paymentOptions = [
  { value: "UPI", label: "UPI", detail: "GPay, PhonePe, Paytm, BHIM", icon: Smartphone },
  { value: "Card", label: "Credit / Debit Card", detail: "Visa, Mastercard, RuPay", icon: CreditCard },
  { value: "Cash", label: "Cash to provider", detail: "Pay the provider directly", icon: Banknote },
];

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function CheckoutContent() {
  const router = useRouter();
  const params = useSearchParams();
  const bookingId = params.get("bookingId") ?? "";

  const [checkout, setCheckout] = useState<CheckoutContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [method, setMethod] = useState("UPI");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  useEffect(() => {
    if (!bookingId) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setError("No booking selected.");
      setIsLoading(false);
      /* eslint-enable react-hooks/set-state-in-effect */
      return;
    }
    let cancelled = false;
    loadCheckout(bookingId)
      .then((data) => {
        if (cancelled) return;
        setCheckout(data.checkout);
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
  }, [bookingId]);

  async function handlePay() {
    if (paying || !checkout) return;
    setPaying(true);
    setPayError("");
    try {
      const result = await payForBooking(checkout.id, method);
      router.push(result.nextPath);
    } catch (payErr) {
      setPayError(getErrorMessage(payErr));
      setPaying(false);
    }
  }

  const canPay = checkout?.status === "completed" && !checkout.paid;

  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)] pb-[calc(96px+env(safe-area-inset-bottom))]">
        <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
          <div className="grid h-12 grid-cols-[2.5rem_1fr_2.5rem] items-center px-3 min-[390px]:px-4">
            <button
              aria-label="Go back"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--primary)]"
              onClick={() => router.push("/customer/bookings")}
              type="button"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="truncate text-center text-headline-sm text-[var(--primary)]">Checkout</h1>
            <div className="h-10 w-10" />
          </div>
        </header>

        <section className="flex min-w-0 flex-col gap-4 px-4 py-4 min-[390px]:px-5">
          {isLoading ? (
            <p className="text-body-sm text-[var(--on-surface-variant)]">Loading checkout...</p>
          ) : error || !checkout ? (
            <div className="rounded-lg border border-dashed border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-6 text-center">
              <p className="text-body-md text-[var(--on-surface)]">{error || "Booking not found"}</p>
              <Link
                className="mt-4 inline-flex min-h-10 items-center justify-center rounded-md bg-[var(--primary)] px-4 text-label-md text-[var(--on-primary)]"
                href="/customer/bookings"
              >
                Back to bookings
              </Link>
            </div>
          ) : (
            <>
              <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-high)]">
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,#ffffff_0%,#dadada_100%)]" />
                    <User className="absolute bottom-1 h-8 w-8 text-[var(--on-surface-variant)] opacity-45" />
                    <span className="relative z-10 text-label-lg">{checkout.providerInitials}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-1">
                      <h2 className="truncate text-headline-sm">{checkout.providerName}</h2>
                      <BadgeCheck className="h-4 w-4 shrink-0 fill-current" />
                    </div>
                    <p className="text-body-sm text-[var(--on-surface-variant)]">{checkout.service}</p>
                    <span className="mt-2 inline-flex items-center gap-1 rounded bg-[var(--surface-container-low)] px-2 py-1 text-label-sm">
                      <ShieldCheck className="h-3 w-3" />
                      Verified provider
                    </span>
                  </div>
                </div>
              </section>

              {checkout.paid ? (
                <div className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-4 text-center">
                  <BadgeCheck className="mx-auto h-6 w-6 text-[var(--primary)]" />
                  <p className="mt-2 text-label-lg text-[var(--on-surface)]">Payment complete</p>
                  <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                    You paid for this service{checkout.paymentMethod ? ` via ${checkout.paymentMethod}` : ""}.
                  </p>
                  <Link
                    className="mt-4 inline-flex min-h-10 items-center justify-center rounded-md bg-[var(--primary)] px-4 text-label-md text-[var(--on-primary)]"
                    href={`/customer/rating-review?bookingId=${checkout.id}`}
                  >
                    Rate the service
                  </Link>
                </div>
              ) : checkout.status !== "completed" ? (
                <div className="rounded-lg border border-dashed border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-4 text-center text-body-sm text-[var(--on-surface-variant)]">
                  Payment opens once the provider marks this service complete.
                </div>
              ) : null}

              <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
                <h2 className="text-headline-sm">Payment summary</h2>
                <div className="mt-3 grid gap-2 text-body-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[var(--on-surface-variant)]">{checkout.serviceTitle}</span>
                    <span>₹{checkout.amountInr.toLocaleString("en-IN")}</span>
                  </div>
                  {checkout.platformFee > 0 ? (
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[var(--on-surface-variant)]">Platform fee</span>
                      <span>₹{checkout.platformFee}</span>
                    </div>
                  ) : null}
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 border-t border-[var(--surface-variant)] pt-3 text-body-md">
                  <span>Total amount</span>
                  <span className="text-label-lg">₹{checkout.totalInr.toLocaleString("en-IN")}</span>
                </div>
              </section>

              {canPay ? (
                <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
                  <h2 className="text-headline-sm">Payment options</h2>
                  <div className="mt-3 grid gap-2">
                    {paymentOptions.map(({ detail, icon: Icon, label, value }) => {
                      const active = method === value;
                      return (
                        <label
                          className={
                            active
                              ? "flex min-h-14 items-center gap-3 rounded-md border border-[var(--primary)] bg-[var(--surface-container-low)] p-3"
                              : "flex min-h-14 items-center gap-3 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3"
                          }
                          key={value}
                        >
                          <input
                            checked={active}
                            className="h-4 w-4 accent-[var(--primary)]"
                            name="payment-method"
                            onChange={() => setMethod(value)}
                            type="radio"
                          />
                          <Icon className="h-5 w-5 shrink-0 text-[var(--on-surface-variant)]" />
                          <span className="min-w-0">
                            <span className="block text-label-lg">{label}</span>
                            <span className="block text-body-sm text-[var(--on-surface-variant)]">{detail}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </section>
              ) : null}

              <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-container-lowest)]">
                    <Lock className="h-4 w-4" />
                  </span>
                  <p className="text-body-sm text-[var(--on-surface-variant)]">
                    Pay only after your service is complete. Setu keeps your payment secure and shares details only
                    with verified providers.
                  </p>
                </div>
              </section>

              {payError ? (
                <p className="rounded-md border border-[var(--error)] bg-[var(--error-container)] px-3 py-2 text-body-sm text-[var(--on-error-container)]">
                  {payError}
                </p>
              ) : null}
            </>
          )}
        </section>

        {checkout && canPay ? (
          <footer className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-[var(--outline-variant)] bg-[var(--surface)] px-4 py-3">
            <div className="mx-auto flex w-full max-w-[480px] items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-label-sm text-[var(--on-surface-variant)]">Pay now</p>
                <p className="text-headline-md">₹{checkout.totalInr.toLocaleString("en-IN")}</p>
              </div>
              <button
                className="flex min-h-12 shrink-0 items-center gap-2 rounded-md bg-[var(--primary)] px-5 text-label-lg text-[var(--on-primary)] disabled:opacity-60"
                disabled={paying}
                onClick={handlePay}
                type="button"
              >
                {paying ? "Paying..." : "Pay Now"}
                <Lock className="h-4 w-4" />
              </button>
            </div>
            <div className="h-[env(safe-area-inset-bottom)]" />
          </footer>
        ) : null}
      </div>
    </main>
  );
}

export default function CustomerCheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  );
}
