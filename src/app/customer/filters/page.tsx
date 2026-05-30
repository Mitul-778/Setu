"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type ElementType, type ReactNode } from "react";
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
const languageOptions = ["Hindi", "English", "Marathi", "Gujarati", "Tamil", "Telugu"];
const verificationBadges = [
  "Verified professionals",
  "Top rated",
  "Background checked",
  "Setu trust badge",
];
const genderOptions = ["No preference", "Female", "Male"];

export default function CustomerFiltersPage() {
  return (
    <Suspense fallback={null}>
      <FiltersContent />
    </Suspense>
  );
}

function FiltersContent() {
  const router = useRouter();
  const params = useSearchParams();

  const [sort, setSort] = useState(() => {
    const value = params.get("sort");
    return sortOptions.find((option) => option.toLowerCase() === value) ?? "Relevance";
  });
  const [maxPrice, setMaxPrice] = useState(() => {
    const value = Number(params.get("maxPrice"));
    return Number.isFinite(value) && value > 0 ? value : 10000;
  });
  const [distance, setDistance] = useState(() => {
    const value = params.get("distance");
    if (value && ["2", "5", "10"].includes(value)) return `${value} km`;
    return "Any";
  });
  const [date, setDate] = useState("Sunday");
  const [gender, setGender] = useState("No preference");
  const [minRating, setMinRating] = useState<string | null>(() => {
    const value = Number(params.get("minRating"));
    return ratingOptions.find((option) => Number.parseFloat(option) === value) ?? null;
  });
  const [langs, setLangs] = useState<string[]>(() =>
    (params.get("langs") ?? "").split(",").map((item) => item.trim()).filter(Boolean),
  );
  const [verif, setVerif] = useState<string[]>([]);
  const [fssai, setFssai] = useState(() => params.get("fssai") === "1");

  function reset() {
    setSort("Relevance");
    setMaxPrice(10000);
    setDistance("Any");
    setDate("Sunday");
    setGender("No preference");
    setMinRating(null);
    setLangs([]);
    setVerif([]);
    setFssai(false);
  }

  function applyFilters() {
    const next = new URLSearchParams();
    if (sort !== "Relevance") next.set("sort", sort.toLowerCase());
    if (maxPrice < 10000) next.set("maxPrice", String(maxPrice));
    if (distance !== "Any") next.set("distance", distance.replace(" km", ""));
    if (minRating) next.set("minRating", String(Number.parseFloat(minRating)));
    if (langs.length) next.set("langs", langs.join(","));
    if (fssai) next.set("fssai", "1");

    const query = next.toString();
    router.push(query ? `/customer/results?${query}` : "/customer/results");
  }

  function toggleLang(language: string) {
    setLangs((current) =>
      current.includes(language) ? current.filter((item) => item !== language) : [...current, language],
    );
  }

  function toggleVerif(badge: string) {
    setVerif((current) =>
      current.includes(badge) ? current.filter((item) => item !== badge) : [...current, badge],
    );
  }

  const priceLabel = maxPrice >= 10000 ? "Any price" : `Up to ₹${maxPrice.toLocaleString("en-IN")}`;

  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto flex min-h-dvh w-full min-w-0 max-w-[480px] flex-col overflow-x-hidden bg-[var(--surface)]">
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
              <h1 className="truncate text-headline-sm text-[var(--primary)]">Filters</h1>
            </div>

            <button
              className="flex min-h-9 items-center justify-end gap-1 text-label-md text-[var(--primary)]"
              onClick={reset}
              type="button"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </header>

        <section className="flex min-w-0 flex-1 flex-col gap-6 overflow-y-auto px-4 py-5 pb-[calc(104px+env(safe-area-inset-bottom))] min-[390px]:px-5">
          <Section icon={SlidersHorizontal} title="Sort by">
            <div className="grid grid-cols-2 gap-2">
              {sortOptions.map((option) => (
                <label
                  className="flex min-h-11 items-center gap-2 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-3 text-label-md"
                  key={option}
                >
                  <input
                    checked={sort === option}
                    className="h-4 w-4 accent-[var(--primary)]"
                    name="sort"
                    onChange={() => setSort(option)}
                    type="radio"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </Section>

          <Section icon={IndianRupee} title="Price range">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-label-md text-[var(--on-surface-variant)]">
                <span>₹0</span>
                <span className="rounded-full bg-[var(--surface-container)] px-3 py-1 text-[var(--on-surface)]">
                  {priceLabel}
                </span>
                <span>₹10,000+</span>
              </div>
              <input
                aria-label="Maximum price"
                className="w-full accent-[var(--primary)]"
                max="10000"
                min="0"
                onChange={(event) => setMaxPrice(Number(event.target.value))}
                step="500"
                type="range"
                value={maxPrice}
              />
            </div>
          </Section>

          <Section icon={MapPin} title="Distance">
            <ChipGroup items={distanceOptions} selected={[distance]} onSelect={setDistance} />
          </Section>

          <Section icon={CalendarDays} title="Date">
            <ChipGroup items={dateOptions} selected={[date]} onSelect={setDate} />
          </Section>

          <Section icon={UserRound} title="Gender preference">
            <div className="grid gap-2">
              {genderOptions.map((option) => (
                <label
                  className="flex min-h-11 items-center gap-3 rounded-md bg-[var(--surface-container-low)] px-3 text-body-md"
                  key={option}
                >
                  <input
                    checked={gender === option}
                    className="h-4 w-4 accent-[var(--primary)]"
                    name="gender"
                    onChange={() => setGender(option)}
                    type="radio"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </Section>

          <Section icon={Star} title="Rating">
            <div className="grid gap-2">
              {ratingOptions.map((option) => (
                <label
                  className="flex min-h-11 items-center gap-3 rounded-md bg-[var(--surface-container-low)] px-3 text-body-md"
                  key={option}
                >
                  <input
                    checked={minRating === option}
                    className="h-4 w-4 rounded accent-[var(--primary)]"
                    onChange={() => setMinRating((current) => (current === option ? null : option))}
                    type="checkbox"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </Section>

          <Section icon={Languages} title="Languages">
            <ChipGroup items={languageOptions} multi onSelect={toggleLang} selected={langs} />
          </Section>

          <Section icon={ShieldCheck} title="Verification badges">
            <div className="grid gap-2">
              {verificationBadges.map((badge) => (
                <label
                  className="flex min-h-11 items-center gap-3 rounded-md bg-[var(--surface-container-low)] px-3 text-body-md"
                  key={badge}
                >
                  <input
                    checked={verif.includes(badge)}
                    className="h-4 w-4 rounded accent-[var(--primary)]"
                    onChange={() => toggleVerif(badge)}
                    type="checkbox"
                  />
                  <span>{badge}</span>
                </label>
              ))}
            </div>
          </Section>

          <Section icon={Utensils} title="Food safety">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-label-lg">FSSAI certified only</p>
                <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                  Applies when the selected service involves cooking, catering, or food handling.
                </p>
              </div>
              <label className="relative inline-flex h-7 w-12 shrink-0 items-center">
                <input
                  aria-label="FSSAI certified only"
                  checked={fssai}
                  className="peer sr-only"
                  onChange={(event) => setFssai(event.target.checked)}
                  type="checkbox"
                />
                <span className="absolute inset-0 rounded-full bg-[var(--surface-variant)] transition peer-checked:bg-[var(--primary)]" />
                <span className="absolute left-1 h-5 w-5 rounded-full bg-[var(--surface)] shadow-[0_1px_3px_rgb(0_0_0_/_0.24)] transition peer-checked:translate-x-5" />
              </label>
            </div>
          </Section>
        </section>

        <footer className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-[var(--outline-variant)] bg-[var(--surface)] px-4 py-3">
          <div className="mx-auto grid w-full max-w-[480px] grid-cols-[1fr_1.4fr] gap-3">
            <Link
              className="flex min-h-12 items-center justify-center rounded-md border border-[var(--outline)] bg-[var(--surface-container-lowest)] px-4 text-label-lg"
              href="/customer/results"
            >
              Clear
            </Link>
            <button
              className="flex min-h-12 items-center justify-center rounded-md bg-[var(--primary)] px-4 text-label-lg text-[var(--on-primary)]"
              onClick={applyFilters}
              type="button"
            >
              Apply filters
            </button>
          </div>
          <div className="h-[env(safe-area-inset-bottom)]" />
        </footer>
      </div>
    </main>
  );
}

function Section({ children, icon: Icon, title }: { children: ReactNode; icon: ElementType; title: string }) {
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

function ChipGroup({
  items,
  selected,
  onSelect,
  multi,
}: {
  items: string[];
  selected: string[];
  onSelect: (item: string) => void;
  multi?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = selected.includes(item);
        return (
          <button
            aria-pressed={multi ? active : undefined}
            className={
              active
                ? "min-h-10 rounded-full border border-[var(--primary)] bg-[var(--primary)] px-4 text-label-md text-[var(--on-primary)]"
                : "min-h-10 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-4 text-label-md text-[var(--on-surface)]"
            }
            key={item}
            onClick={() => onSelect(item)}
            type="button"
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
