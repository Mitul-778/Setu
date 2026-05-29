import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Edit3,
  MapPin,
  Plus,
  Save,
  Settings2,
  X,
} from "lucide-react";

const packages = [
  {
    name: "Standard Package",
    description: "Basic service with clear inclusions and travel within radius.",
    price: "₹799",
    duration: "90 min",
  },
  {
    name: "Premium Package",
    description: "Priority slot, extended service time, and materials included.",
    price: "₹2,000",
    duration: "3 hrs",
  },
];

const neighborhoods = ["Indiranagar", "Koramangala", "HSR", "Whitefield", "Marathahalli"];
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const calendarDays = [
  { day: "12", label: "Open" },
  { day: "13", label: "Open" },
  { day: "14", label: "Busy" },
  { day: "15", label: "Open" },
  { day: "16", label: "Open" },
  { day: "17", label: "Weekend" },
  { day: "18", label: "Weekend" },
];
const blackoutDates = ["21 Jun", "28 Jun", "02 Jul"];

export default function ProviderServiceSettingsPage() {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)] pb-[calc(92px+env(safe-area-inset-bottom))]">
        <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
          <div className="flex h-12 items-center justify-between gap-2 px-4 min-[390px]:px-5">
            <button
              aria-label="Go back"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--on-surface)]"
              type="button"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="min-w-0 flex-1 truncate text-center text-headline-sm text-[var(--primary)]">
              Service Settings
            </h1>
            <button
              aria-label="Save settings"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--primary)]"
              type="button"
            >
              <Save className="h-5 w-5" />
            </button>
          </div>
        </header>

        <section className="px-4 py-5 min-[390px]:px-5 min-[390px]:py-6">
          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-label-md text-[var(--on-surface-variant)]">
                Step 4 of 4
              </span>
              <span className="text-label-md text-[var(--on-surface)]">
                Settings
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              <div className="h-1.5 rounded-full bg-[var(--primary)]" />
              <div className="h-1.5 rounded-full bg-[var(--primary)]" />
              <div className="h-1.5 rounded-full bg-[var(--primary)]" />
              <div className="h-1.5 rounded-full bg-[var(--primary)]" />
            </div>
          </div>

          <section>
            <h2 className="text-headline-md text-[var(--on-surface)]">Package Builder</h2>
            <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
              Define offerings, pricing tiers, duration, and what customers get.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {packages.map(({ description, duration, name, price }) => (
                <article
                  className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4"
                  key={name}
                >
                  <div className="flex items-start justify-between gap-3 border-b border-[var(--surface-variant)] pb-3">
                    <div>
                      <h3 className="text-label-lg text-[var(--on-surface)]">{name}</h3>
                      <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">{description}</p>
                    </div>
                    <button aria-label={`Edit ${name}`} className="shrink-0 text-[var(--on-surface-variant)]" type="button">
                      <Edit3 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <FieldValue label="Price" value={price} />
                    <FieldValue label="Duration" value={duration} />
                  </div>
                </article>
              ))}
            </div>
            <button className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[var(--primary)] bg-[var(--surface)] text-label-lg text-[var(--primary)]" type="button">
              <Plus className="h-5 w-5" />
              Add New Package
            </button>
          </section>

          <Divider />

          <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-label-lg text-[var(--on-surface)]">Accept Custom Quotes</h3>
                <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                  Allow customers to request personalized pricing for unique jobs.
                </p>
              </div>
              <button aria-label="Accept custom quotes enabled" className="relative h-8 w-14 shrink-0 rounded-full bg-[var(--primary)]" type="button">
                <span className="absolute right-1 top-1 h-6 w-6 rounded-full bg-[var(--on-primary)]" />
              </button>
            </div>
          </section>

          <Divider />

          <section>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[var(--primary)]" />
              <h2 className="text-headline-md text-[var(--on-surface)]">Travel Area</h2>
            </div>

            <div className="mt-4 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
              <div className="flex items-center justify-between gap-3">
                <label className="text-label-lg text-[var(--on-surface)]">Travel Radius</label>
                <span className="rounded bg-[var(--surface-container)] px-2 py-1 text-label-md text-[var(--on-surface-variant)]">15 km</span>
              </div>
              <input className="mt-4 w-full accent-[var(--primary)]" defaultValue="15" max="50" min="1" type="range" />
              <div className="mt-1 flex justify-between text-label-sm text-[var(--on-surface-variant)]">
                <span>1 km</span>
                <span>50 km</span>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-label-lg text-[var(--on-surface)]">Neighborhoods</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {neighborhoods.map((neighborhood, index) => (
                  <button
                    className={
                      index < 3
                        ? "inline-flex min-h-9 items-center gap-2 rounded-full bg-[var(--primary)] px-3 text-label-md text-[var(--on-primary)]"
                        : "inline-flex min-h-9 items-center gap-2 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 text-label-md text-[var(--on-surface)]"
                    }
                    key={neighborhood}
                    type="button"
                  >
                    {neighborhood}
                    {index < 3 ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <Divider />

          <section>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-[var(--primary)]" />
              <h2 className="text-headline-md text-[var(--on-surface)]">Availability & Pricing</h2>
            </div>
            <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
              Manage calendar availability, blackout dates, and special rates.
            </p>

            <div className="mt-4 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-label-lg text-[var(--on-surface)]">Calendar Availability</h3>
                <button className="text-label-md text-[var(--primary)]" type="button">Edit</button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {weekDays.map((day) => (
                  <span className="py-1 text-label-sm text-[var(--on-surface-variant)]" key={day}>{day}</span>
                ))}
                {calendarDays.map(({ day, label }) => (
                  <button
                    className={
                      label === "Busy"
                        ? "min-h-14 rounded-md bg-[var(--surface-container-highest)] px-1 text-label-sm text-[var(--on-surface-variant)]"
                        : "min-h-14 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-1 text-label-sm text-[var(--on-surface)]"
                    }
                    key={day}
                    type="button"
                  >
                    <span className="block text-label-md">{day}</span>
                    <span className="block truncate text-[10px] leading-3">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-label-lg text-[var(--on-surface)]">Blackout Dates</h3>
                <button className="flex min-h-9 items-center gap-1 rounded-md border border-[var(--outline-variant)] px-3 text-label-md" type="button">
                  <CalendarDays className="h-4 w-4" />
                  Select Dates
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {blackoutDates.map((date) => (
                  <span className="inline-flex min-h-8 items-center gap-2 rounded-full bg-[var(--surface-container)] px-3 text-label-md" key={date}>
                    {date}
                    <X className="h-3.5 w-3.5" />
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-label-lg text-[var(--on-surface)]">Weekend/Holiday Surcharge</h3>
                  <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                    Apply a premium on weekends, festivals, and holidays.
                  </p>
                </div>
                <button aria-label="Weekend surcharge enabled" className="relative h-8 w-14 shrink-0 rounded-full bg-[var(--primary)]" type="button">
                  <span className="absolute right-1 top-1 h-6 w-6 rounded-full bg-[var(--on-primary)]" />
                </button>
              </div>
              <div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-3">
                <input className="w-full accent-[var(--primary)]" defaultValue="15" max="50" min="0" type="range" />
                <span className="rounded bg-[var(--surface-container)] px-2 py-1 text-label-md text-[var(--on-surface)]">15%</span>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-lg border border-[var(--surface-variant)] bg-[var(--surface-container-low)] p-3">
            <div className="flex items-start gap-3">
              <Settings2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--on-surface-variant)]" />
              <p className="text-body-sm text-[var(--on-surface-variant)]">
                These settings control what customers can book, where you travel, and when special pricing applies.
              </p>
            </div>
          </section>
        </section>

        <footer className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-[var(--outline-variant)] bg-[var(--surface)] px-4 py-3">
          <div className="grid grid-cols-[1fr_1.35fr] gap-3">
            <button
              className="min-h-12 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-4 text-label-lg text-[var(--on-surface-variant)]"
              type="button"
            >
              Save Draft
            </button>
            <button
              className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 text-label-lg text-[var(--on-primary)]"
              type="button"
            >
              <span>Finish Setup</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}

function FieldValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-[var(--surface-container-low)] px-3 py-2">
      <p className="text-label-sm text-[var(--on-surface-variant)]">{label}</p>
      <p className="mt-1 text-label-lg text-[var(--on-surface)]">{value}</p>
    </div>
  );
}

function Divider() {
  return <div className="my-6 h-px bg-[var(--surface-container-highest)]" />;
}
