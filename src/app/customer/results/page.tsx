import Link from "next/link";
import {
  ArrowLeft,
  IndianRupee,
  Languages,
  Map,
  MapPin,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  User,
} from "lucide-react";

const providers = [
  {
    name: "Arjun Singh",
    service: "Mehendi Artist",
    rating: "4.9",
    distance: "1.2 km away",
    priceRange: "\u20B91,500-\u20B92,500",
    languages: "Hindi, Marathi, English",
    badges: ["Verified", "Top Pro"],
    matchReasons: ["Nearby", "Available", "Hindi + Marathi", "Strong reviews"],
    initials: "AS",
  },
  {
    name: "Priya Sharma",
    service: "Bridal Mehendi",
    rating: "4.8",
    distance: "2.5 km away",
    priceRange: "\u20B91,200-\u20B93,000",
    languages: "Hindi, English",
    badges: ["Verified", "Popular"],
    matchReasons: ["Available Sunday", "Strong reviews", "Within budget"],
    initials: "PS",
  },
  {
    name: "Farah Khan",
    service: "Party Mehendi",
    rating: "4.7",
    distance: "3.1 km away",
    priceRange: "\u20B1800-\u20B91,800",
    languages: "Hindi, Marathi",
    badges: ["Verified"],
    matchReasons: ["Nearby", "Hindi + Marathi", "Fast response"],
    initials: "FK",
  },
  {
    name: "Nisha Patel",
    service: "Arabic Mehendi",
    rating: "4.6",
    distance: "4.0 km away",
    priceRange: "\u20B91,000-\u20B92,200",
    languages: "Gujarati, Hindi, English",
    badges: ["New city expert"],
    matchReasons: ["Good for newcomers", "Home visit", "Budget match"],
    initials: "NP",
  },
];

const filters = ["Sunday evening", "Indiranagar", "Under \u20B91,500", "Hindi + Marathi"];

export default function CustomerResultsPage() {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)] pb-[calc(24px+env(safe-area-inset-bottom))]">
        <ResultsHeader />

        <section className="flex min-w-0 flex-col gap-4 px-4 py-4 min-[390px]:px-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-headline-sm text-[var(--on-surface)]">
                Matching results
              </h1>
              <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                Showing 12 trusted professionals near you
              </p>
            </div>
            <Link
              className="flex min-h-10 shrink-0 items-center gap-2 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 text-label-md"
              href="/customer/filters"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filter
            </Link>
          </div>

          <FilterChips />


          <div className="flex flex-col gap-3">
            {providers.map((provider, index) => (
              <ProviderCard index={index} key={provider.name} provider={provider} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function ResultsHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
      <div className="grid h-12 grid-cols-[2.5rem_1fr_2.5rem] items-center px-3 min-[390px]:px-4">
        <Link
          aria-label="Back to assistant"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--primary)]"
          href="/customer/assistant"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="truncate text-center text-headline-sm text-[var(--primary)]">
          Matches
        </h2>
        <button
          aria-label="Open map view"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--on-surface-variant)]"
        >
          <Map className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}


function FilterChips() {
  return (
    <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto overscroll-x-contain px-1 pb-1">
      {filters.map((filter) => (
        <span
          className="shrink-0 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 py-2 text-label-md text-[var(--on-surface)]"
          key={filter}
        >
          {filter}
        </span>
      ))}
    </div>
  );
}

type Provider = (typeof providers)[number];

function ProviderCard({
  index,
  provider,
}: {
  index: number;
  provider: Provider;
}) {
  return (
    <article className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]">
      <div className="flex gap-3">
        <PhotoPlaceholder initials={provider.initials} index={index} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-headline-sm text-[var(--on-surface)]">
                {provider.name}
              </h3>
              <p className="truncate text-body-sm text-[var(--on-surface-variant)]">
                {provider.service}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1 rounded bg-[var(--surface-container)] px-2 py-1">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="text-label-md">{provider.rating}</span>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-body-sm text-[var(--on-surface-variant)]">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {provider.distance}
            </span>
            <span className="flex items-center gap-1">
              <IndianRupee className="h-3.5 w-3.5" />
              {provider.priceRange}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {provider.badges.map((badge) => (
          <span className="flex items-center gap-1 text-label-sm" key={badge}>
            <ShieldCheck className="h-3.5 w-3.5 fill-current" />
            {badge}
          </span>
        ))}
      </div>

      <div className="mt-2 flex items-start gap-1.5 text-label-sm text-[var(--on-surface-variant)]">
        <Languages className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>{provider.languages}</span>
      </div>

      <div className="mt-3 border-t border-[var(--surface-variant)] pt-3">
        <p className="mb-2 text-label-sm text-[var(--on-surface-variant)]">
          Why matched
        </p>
        <div className="flex flex-wrap gap-2">
          {provider.matchReasons.map((reason) => (
            <span
              className="rounded bg-[var(--surface-container-high)] px-2 py-1 text-label-md text-[var(--on-surface)]"
              key={`${provider.name}-${reason}`}
            >
              {reason}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-3">
        <Link
          className="flex min-h-11 items-center justify-center rounded-md border border-[var(--outline)] bg-[var(--surface-container-lowest)] px-4 text-label-md"
          href="/customer/trust-passport"
        >
          View profile
        </Link>
        <Link
          className="flex min-h-11 items-center justify-center rounded-md bg-[var(--primary)] px-5 text-label-md text-[var(--on-primary)]"
          href="/customer/bookings"
        >
          Book
        </Link>
      </div>
    </article>
  );
}

function PhotoPlaceholder({
  index,
  initials,
}: {
  index: number;
  initials: string;
}) {
  return (
    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-high)]">
      <div className="absolute inset-0 opacity-60">
        <div
          className={
            index % 2 === 0
              ? "h-full w-full bg-[linear-gradient(135deg,#f4f3f3_0%,#dadada_100%)]"
              : "h-full w-full bg-[linear-gradient(135deg,#ffffff_0%,#e3e2e2_100%)]"
          }
        />
      </div>
      <User className="absolute bottom-1 h-8 w-8 text-[var(--on-surface-variant)] opacity-45" />
      <span className="relative z-10 text-label-lg text-[var(--on-surface)]">
        {initials}
      </span>
    </div>
  );
}
