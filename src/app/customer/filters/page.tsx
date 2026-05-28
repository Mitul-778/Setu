import Link from "next/link";
import type { ElementType, ReactNode } from "react";
import {
  ArrowLeft,
  CalendarDays,
  IndianRupee,
  Languages,
  MapPin,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Utensils,
  UserRound,
} from "lucide-react";

const sortOptions = ["Relevance", "Distance", "Price", "Rating"];
const distanceOptions = ["2 km", "5 km", "10 km", "Any"];
const dateOptions = ["Today", "Tomorrow", "Sunday", "Select date"];
const ratingOptions = ["4.5 & up", "4.0 & up", "3.5 & up"];
const languages = ["Hindi", "English", "Marathi", "Gujarati", "Tamil", "Telugu"];
const verificationBadges = [
  "Verified professionals",
  "Top rated",
  "Background checked",
  "Setu trust badge",
];
const genderOptions = ["No preference", "Female", "Male"];

export default function CustomerFiltersPage() {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto flex min-h-dvh w-full min-w-0 max-w-[480px] flex-col overflow-x-hidden bg-[var(--surface)]">
        <FiltersHeader />

        <section className="flex min-w-0 flex-1 flex-col gap-6 overflow-y-auto px-4 py-5 pb-[calc(104px+env(safe-area-inset-bottom))] min-[390px]:px-5">
          <SortSection />
          <PriceSection />
          <DistanceSection />
          <DateSection />
          <GenderSection />
          <RatingSection />
          <LanguagesSection />
          <VerificationSection />
          <FoodSafetySection />
        </section>

        <FiltersFooter />
      </div>
    </main>
  );
}

function FiltersHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
      <div className="grid h-12 grid-cols-[2.5rem_1fr_4.5rem] items-center px-3 min-[390px]:px-4">
        <Link
          aria-label="Back to results"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--primary)]"
          href="/customer/results"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="flex min-w-0 items-center justify-center gap-2">
          <SlidersHorizontal className="h-5 w-5 shrink-0" />
          <h1 className="truncate text-headline-sm text-[var(--primary)]">
            Filters
          </h1>
        </div>

        <button className="flex min-h-9 items-center justify-end gap-1 text-label-md text-[var(--primary)]">
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
    </header>
  );
}

function Section({
  children,
  icon: Icon,
  title,
}: {
  children: ReactNode;
  icon: ElementType;
  title: string;
}) {
  return (
    <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
      <div className="mb-3 flex items-center gap-2 border-b border-[var(--surface-variant)] pb-3">
        <Icon className="h-4 w-4 shrink-0" />
        <h2 className="text-headline-sm">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function SortSection() {
  return (
    <Section icon={SlidersHorizontal} title="Sort by">
      <div className="grid grid-cols-2 gap-2">
        {sortOptions.map((option, index) => (
          <RadioTile
            checked={index === 0}
            key={option}
            name="sort"
            value={option}
          />
        ))}
      </div>
    </Section>
  );
}

function PriceSection() {
  return (
    <Section icon={IndianRupee} title="Price range">
      <div className="space-y-4">
        <div className="flex items-center justify-between text-label-md text-[var(--on-surface-variant)]">
          <span>{"\u20B9"}0</span>
          <span className="rounded-full bg-[var(--surface-container)] px-3 py-1 text-[var(--on-surface)]">
            Up to {"\u20B9"}5,000
          </span>
          <span>{"\u20B9"}10,000+</span>
        </div>
        <input
          aria-label="Maximum price"
          className="w-full accent-[var(--primary)]"
          defaultValue="5000"
          max="10000"
          min="0"
          type="range"
        />
      </div>
    </Section>
  );
}

function DistanceSection() {
  return (
    <Section icon={MapPin} title="Distance">
      <ChipGroup activeIndex={0} items={distanceOptions} />
    </Section>
  );
}

function DateSection() {
  return (
    <Section icon={CalendarDays} title="Date">
      <ChipGroup activeIndex={2} items={dateOptions} />
    </Section>
  );
}

function GenderSection() {
  return (
    <Section icon={UserRound} title="Gender preference">
      <div className="grid gap-2">
        {genderOptions.map((option, index) => (
          <RadioRow
            checked={index === 0}
            key={option}
            name="gender"
            value={option}
          />
        ))}
      </div>
    </Section>
  );
}

function RatingSection() {
  return (
    <Section icon={Star} title="Rating">
      <div className="grid gap-2">
        {ratingOptions.map((option, index) => (
          <CheckboxRow checked={index === 0} key={option} value={option} />
        ))}
      </div>
    </Section>
  );
}

function LanguagesSection() {
  return (
    <Section icon={Languages} title="Languages">
      <ChipGroup activeIndexes={[0, 2]} items={languages} />
    </Section>
  );
}

function VerificationSection() {
  return (
    <Section icon={ShieldCheck} title="Verification badges">
      <div className="grid gap-2">
        {verificationBadges.map((badge, index) => (
          <CheckboxRow checked={index < 2} key={badge} value={badge} />
        ))}
      </div>
    </Section>
  );
}

function FoodSafetySection() {
  return (
    <Section icon={Utensils} title="Food safety">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-label-lg">FSSAI certified only</p>
          <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
            Applies when the selected service involves cooking, catering, or
            food handling.
          </p>
        </div>
        <label className="relative inline-flex h-7 w-12 shrink-0 items-center">
          <input
            aria-label="FSSAI certified only"
            className="peer sr-only"
            defaultChecked
            type="checkbox"
          />
          <span className="absolute inset-0 rounded-full bg-[var(--surface-variant)] transition peer-checked:bg-[var(--primary)]" />
          <span className="absolute left-1 h-5 w-5 rounded-full bg-[var(--surface)] shadow-[0_1px_3px_rgb(0_0_0_/_0.24)] transition peer-checked:translate-x-5" />
        </label>
      </div>
    </Section>
  );
}

function ChipGroup({
  activeIndex,
  activeIndexes,
  items,
}: {
  activeIndex?: number;
  activeIndexes?: number[];
  items: string[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => {
        const active = activeIndexes
          ? activeIndexes.includes(index)
          : activeIndex === index;

        return (
          <button
            className={
              active
                ? "min-h-10 rounded-full border border-[var(--primary)] bg-[var(--primary)] px-4 text-label-md text-[var(--on-primary)]"
                : "min-h-10 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-4 text-label-md text-[var(--on-surface)]"
            }
            key={item}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}

function RadioTile({
  checked,
  name,
  value,
}: {
  checked?: boolean;
  name: string;
  value: string;
}) {
  return (
    <label className="flex min-h-11 items-center gap-2 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-3 text-label-md">
      <input
        className="h-4 w-4 accent-[var(--primary)]"
        defaultChecked={checked}
        name={name}
        type="radio"
      />
      <span>{value}</span>
    </label>
  );
}

function RadioRow({
  checked,
  name,
  value,
}: {
  checked?: boolean;
  name: string;
  value: string;
}) {
  return (
    <label className="flex min-h-11 items-center gap-3 rounded-md bg-[var(--surface-container-low)] px-3 text-body-md">
      <input
        className="h-4 w-4 accent-[var(--primary)]"
        defaultChecked={checked}
        name={name}
        type="radio"
      />
      <span>{value}</span>
    </label>
  );
}

function CheckboxRow({
  checked,
  value,
}: {
  checked?: boolean;
  value: string;
}) {
  return (
    <label className="flex min-h-11 items-center gap-3 rounded-md bg-[var(--surface-container-low)] px-3 text-body-md">
      <input
        className="h-4 w-4 rounded accent-[var(--primary)]"
        defaultChecked={checked}
        type="checkbox"
      />
      <span>{value}</span>
    </label>
  );
}

function FiltersFooter() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--outline-variant)] bg-[var(--surface)] px-4 py-3">
      <div className="mx-auto grid w-full max-w-[480px] grid-cols-[1fr_1.4fr] gap-3">
        <Link
          className="flex min-h-12 items-center justify-center rounded-md border border-[var(--outline)] bg-[var(--surface-container-lowest)] px-4 text-label-lg"
          href="/customer/results"
        >
          Clear
        </Link>
        <Link
          className="flex min-h-12 items-center justify-center rounded-md bg-[var(--primary)] px-4 text-label-lg text-[var(--on-primary)]"
          href="/customer/results"
        >
          Apply filters
        </Link>
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </footer>
  );
}
