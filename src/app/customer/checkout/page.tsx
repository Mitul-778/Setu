import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  CreditCard,
  IndianRupee,
  Lock,
  Percent,
  ShieldCheck,
  Smartphone,
  Star,
  User,
} from "lucide-react";

const lineItems = [
  { label: "Basic Bridal Package", value: "\u20B91,500" },
  { label: "Platform fee", value: "\u20B950" },
  { label: "Travel within service radius", value: "Included" },
];

const paymentOptions = [
  {
    label: "UPI",
    detail: "GPay, PhonePe, Paytm, BHIM",
    icon: Smartphone,
    active: true,
  },
  {
    label: "Credit / Debit Card",
    detail: "Visa, Mastercard, RuPay",
    icon: CreditCard,
  },
  {
    label: "Pay later at service",
    detail: "Token advance now, balance after work",
    icon: Banknote,
  },
];

export default function CustomerCheckoutPage() {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)] pb-[calc(96px+env(safe-area-inset-bottom))]">
        <CheckoutHeader />

        <section className="flex min-w-0 flex-col gap-4 px-4 py-4 min-[390px]:px-5">
          <ProviderSummary />
          <ServiceLineItems />
          <CouponField />
          <PaymentMethods />
          <ReassuranceBlock />
          <CancellationPolicy />
        </section>

        <CheckoutFooter />
      </div>
    </main>
  );
}

function CheckoutHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
      <div className="grid h-12 grid-cols-[2.5rem_1fr_2.5rem] items-center px-3 min-[390px]:px-4">
        <button
          aria-label="Go back"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--primary)]"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="truncate text-center text-headline-sm text-[var(--primary)]">
          Checkout
        </h1>
        <div className="h-10 w-10" />
      </div>
    </header>
  );
}

function ProviderSummary() {
  return (
    <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
      <div className="flex items-center gap-3">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-high)]">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#ffffff_0%,#dadada_100%)]" />
          <User className="absolute bottom-1 h-8 w-8 text-[var(--on-surface-variant)] opacity-45" />
          <span className="relative z-10 text-label-lg">AS</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-1">
            <h2 className="truncate text-headline-sm">Arjun Singh</h2>
            <BadgeCheck className="h-4 w-4 shrink-0 fill-current" />
          </div>
          <p className="text-body-sm text-[var(--on-surface-variant)]">
            Mehendi Artist
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="flex items-center gap-1 rounded bg-[var(--surface-container-low)] px-2 py-1 text-label-sm">
              <Star className="h-3 w-3 fill-current" />
              4.8
            </span>
            <span className="flex items-center gap-1 rounded bg-[var(--surface-container-low)] px-2 py-1 text-label-sm">
              <ShieldCheck className="h-3 w-3" />
              Verified provider
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceLineItems() {
  return (
    <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
      <h2 className="text-headline-sm">Service line items</h2>
      <div className="mt-3 grid gap-2">
        {lineItems.map(({ label, value }) => (
          <div
            className="flex items-center justify-between gap-3 text-body-sm"
            key={label}
          >
            <span className="text-[var(--on-surface-variant)]">{label}</span>
            <span>{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 border-t border-[var(--surface-variant)] pt-3">
        <div className="flex items-center justify-between gap-3 text-body-md">
          <span>Total amount</span>
          <span className="text-label-lg">{"\u20B9"}1,550</span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 rounded-md bg-[var(--surface-container-low)] p-3">
          <div>
            <p className="text-label-md">Token advance</p>
            <p className="text-body-sm text-[var(--on-surface-variant)]">
              Pay now to confirm the booking
            </p>
          </div>
          <span className="text-headline-sm">{"\u20B9"}300</span>
        </div>
      </div>
    </section>
  );
}

function CouponField() {
  return (
    <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
      <label className="mb-2 block text-label-md">Coupon code</label>
      <div className="flex gap-2">
        <span className="relative min-w-0 flex-1">
          <Percent className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--on-surface-variant)]" />
          <input
            className="min-h-11 w-full rounded-md border border-[var(--outline-variant)] bg-[var(--surface-bright)] px-3 pl-9 text-body-md outline-none placeholder:text-[var(--on-surface-variant)] focus:border-[var(--primary)]"
            placeholder="SETU50"
            type="text"
          />
        </span>
        <button className="min-h-11 shrink-0 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-high)] px-4 text-label-md">
          Apply
        </button>
      </div>
    </section>
  );
}

function PaymentMethods() {
  return (
    <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
      <h2 className="text-headline-sm">Payment options</h2>
      <div className="mt-3 grid gap-2">
        {paymentOptions.map(({ active, detail, icon: Icon, label }) => (
          <label
            className={
              active
                ? "flex min-h-14 items-center gap-3 rounded-md border border-[var(--primary)] bg-[var(--surface-container-low)] p-3"
                : "flex min-h-14 items-center gap-3 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3"
            }
            key={label}
          >
            <input
              className="h-4 w-4 accent-[var(--primary)]"
              defaultChecked={active}
              name="payment-method"
              type="radio"
            />
            <Icon className="h-5 w-5 shrink-0 text-[var(--on-surface-variant)]" />
            <span className="min-w-0">
              <span className="block text-label-lg">{label}</span>
              <span className="block text-body-sm text-[var(--on-surface-variant)]">
                {detail}
              </span>
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}

function ReassuranceBlock() {
  return (
    <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-container-lowest)]">
          <Lock className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-label-lg">Verified providers. Secure payments.</h2>
          <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
            Setu protects your token advance with encrypted payments and releases
            booking details only to verified professionals.
          </p>
        </div>
      </div>
    </section>
  );
}

function CancellationPolicy() {
  return (
    <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
      <h2 className="text-headline-sm">Cancellation policy</h2>
      <p className="mt-2 text-body-sm text-[var(--on-surface-variant)]">
        Free cancellation up to 24 hours before the service. After that, the
        token advance may be used to compensate the provider for blocked time.
      </p>
    </section>
  );
}

function CheckoutFooter() {
  return (
    <footer className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-[var(--outline-variant)] bg-[var(--surface)] px-4 py-3">
      <div className="mx-auto flex w-full max-w-[480px] items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-label-sm text-[var(--on-surface-variant)]">
            Pay now
          </p>
          <p className="flex items-center text-headline-md">
            <IndianRupee className="h-5 w-5" />
            300
          </p>
        </div>
        <Link
          className="flex min-h-12 shrink-0 items-center gap-2 rounded-md bg-[var(--primary)] px-5 text-label-lg text-[var(--on-primary)]"
          href="/customer/bookings"
        >
          Pay to Confirm
          <Lock className="h-4 w-4" />
        </Link>
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </footer>
  );
}
