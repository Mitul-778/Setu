import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Home,
  IndianRupee,
  NotebookPen,
  Users,
  Utensils,
} from "lucide-react";

const dates = [
  { day: "Mon", date: "16" },
  { day: "Tue", date: "17" },
  { day: "Wed", date: "18", active: true },
  { day: "Thu", date: "19" },
  { day: "Fri", date: "20" },
];

const times = ["09:00 AM", "10:30 AM", "02:00 PM", "04:30 PM"];

const estimateRows = [
  ["Premium Bridal package", "\u20B91,500"],
  ["Platform protection", "\u20B949"],
  ["Travel within 10 km", "Included"],
];

export default function CustomerBookingPage() {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)] pb-[calc(112px+env(safe-area-inset-bottom))]">
        <BookingHeader />

        <section className="flex min-w-0 flex-col gap-5 px-4 py-5 min-[390px]:px-5">
          <BookingTabs />
          <DateTimePicker />
          <AddressCard />
          <ServiceDetails />
          <NotesField />
          <PriceEstimate />
        </section>

        <BookingFooter />
      </div>
    </main>
  );
}

function BookingHeader() {
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
          Book Service
        </h1>
        <div className="h-10 w-10" />
      </div>
    </header>
  );
}

function BookingTabs() {
  return (
    <div className="grid grid-cols-2 rounded-lg bg-[var(--surface-container-low)] p-1">
      <button className="min-h-10 rounded-md bg-[var(--surface-container-lowest)] px-3 text-label-md text-[var(--primary)] shadow-[0_1px_2px_rgb(0_0_0_/_0.05)]">
        One-time service
      </button>
      <button className="min-h-10 rounded-md px-3 text-label-md text-[var(--on-surface-variant)]">
        Recurring plan
      </button>
    </div>
  );
}

function Section({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-headline-sm">{title}</h2>
      {children}
    </section>
  );
}

function DateTimePicker() {
  return (
    <Section title="Date and time">
      <div className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
        <div className="flex items-center justify-between border-b border-[var(--surface-variant)] pb-4">
          <button
            aria-label="Previous week"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--on-surface-variant)]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-label-lg">October 2026</span>
          <button
            aria-label="Next week"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--on-surface-variant)]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-5 gap-2">
          {dates.map(({ active, date, day }) => (
            <button
              className={
                active
                  ? "flex min-h-14 flex-col items-center justify-center gap-1 rounded-md bg-[var(--primary)] text-[var(--on-primary)]"
                  : "flex min-h-14 flex-col items-center justify-center gap-1 rounded-md bg-[var(--surface-container-low)] text-[var(--on-surface)]"
              }
              key={`${day}-${date}`}
            >
              <span className="text-label-sm">{day}</span>
              <span className="text-label-lg">{date}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 border-t border-[var(--surface-variant)] pt-4">
          <div className="mb-2 flex items-center gap-2 text-label-sm text-[var(--on-surface-variant)]">
            <Clock className="h-4 w-4" />
            Available times
          </div>
          <div className="flex flex-wrap gap-2">
            {times.map((time, index) => (
              <button
                className={
                  index === 1
                    ? "min-h-9 rounded-full border border-[var(--primary)] bg-[var(--primary)] px-3 text-label-md text-[var(--on-primary)]"
                    : "min-h-9 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 text-label-md"
                }
                key={time}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function AddressCard() {
  return (
    <Section title="Address">
      <div className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--surface-container-low)]">
            <Home className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-label-lg">Home</p>
              <button className="text-label-md text-[var(--primary)]">
                Edit
              </button>
            </div>
            <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
              123 Market Street, Block B, Floor 4
            </p>
            <p className="text-body-sm text-[var(--on-surface-variant)]">
              Indiranagar, Bangalore 560038
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

function ServiceDetails() {
  return (
    <Section title="Service details">
      <div className="grid gap-3 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
        <label className="grid gap-2">
          <span className="text-label-sm uppercase text-[var(--on-surface-variant)]">
            Duration
          </span>
          <select className="min-h-11 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 text-body-md outline-none focus:border-[var(--primary)]">
            <option>2 hours standard</option>
            <option>4 hours extended</option>
            <option>Full day event</option>
          </select>
        </label>

        <label className="grid gap-2">
          <span className="flex items-center gap-1 text-label-sm uppercase text-[var(--on-surface-variant)]">
            <Users className="h-3.5 w-3.5" />
            Attendees
          </span>
          <input
            className="min-h-11 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 text-body-md outline-none placeholder:text-[var(--on-surface-variant)] focus:border-[var(--primary)]"
            placeholder="e.g., 50 guests"
            type="number"
          />
        </label>

        <label className="grid gap-2">
          <span className="flex items-center gap-1 text-label-sm uppercase text-[var(--on-surface-variant)]">
            <Utensils className="h-3.5 w-3.5" />
            Dietary preferences
          </span>
          <input
            className="min-h-11 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 text-body-md outline-none placeholder:text-[var(--on-surface-variant)] focus:border-[var(--primary)]"
            placeholder="Vegetarian, no nuts, Jain food"
            type="text"
          />
          <p className="text-body-sm text-[var(--on-surface-variant)]">
            Optional for food-related bookings.
          </p>
        </label>
      </div>
    </Section>
  );
}

function NotesField() {
  return (
    <Section title="Add notes">
      <label className="relative block">
        <NotebookPen className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[var(--on-surface-variant)]" />
        <textarea
          className="min-h-24 w-full resize-none rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3 pl-10 text-body-md outline-none placeholder:text-[var(--on-surface-variant)] focus:border-[var(--primary)]"
          placeholder="Add access instructions, preferred design, event details, or anything the provider should know."
        />
      </label>
    </Section>
  );
}

function PriceEstimate() {
  return (
    <Section title="Price estimate">
      <div className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
        <div className="grid gap-2">
          {estimateRows.map(([label, value]) => (
            <div
              className="flex items-center justify-between gap-3 text-body-sm"
              key={label}
            >
              <span className="text-[var(--on-surface-variant)]">{label}</span>
              <span className="text-[var(--on-surface)]">{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 border-t border-[var(--surface-variant)] pt-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-label-lg">Estimated total</span>
            <span className="flex items-center text-headline-md">
              <IndianRupee className="h-5 w-5" />
              1,549
            </span>
          </div>
        </div>
      </div>
    </Section>
  );
}

function BookingFooter() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--outline-variant)] bg-[var(--surface)] px-4 py-3">
      <div className="mx-auto flex w-full max-w-[480px] items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-label-sm text-[var(--on-surface-variant)]">
            Estimated total
          </p>
          <p className="text-headline-md">{"\u20B9"}1,549</p>
        </div>
        <Link
          className="flex min-h-12 shrink-0 items-center justify-center rounded-md bg-[var(--primary)] px-5 text-label-lg text-[var(--on-primary)]"
          href="/customer/checkout"
        >
          Confirm Booking
        </Link>
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </footer>
  );
}
