import Link from "next/link";
import { cookies } from "next/headers";
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
import { db } from "@/lib/db";
import {
  parseProviderFilters,
  searchProviders,
  type ProviderResult,
} from "@/lib/provider-search";

type SearchParams = Record<string, string | string[] | undefined>;

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

const sortLabels: Record<string, string> = {
  distance: "Sorted by distance",
  price: "Sorted by price",
  rating: "Sorted by rating",
};

function buildChips(params: SearchParams) {
  const chips: string[] = [];
  const sort = single(params.sort);
  if (sort && sortLabels[sort]) chips.push(sortLabels[sort]);

  const maxPrice = Number(single(params.maxPrice));
  if (Number.isFinite(maxPrice) && maxPrice > 0 && maxPrice < 10000) {
    chips.push(`Under ₹${maxPrice.toLocaleString("en-IN")}`);
  }

  const distance = single(params.distance);
  if (distance && distance !== "any") chips.push(`Within ${distance} km`);

  const minRating = Number(single(params.minRating));
  if (Number.isFinite(minRating) && minRating > 0) chips.push(`${minRating}★ & up`);

  const langs = (single(params.langs) ?? "").split(",").map((l) => l.trim()).filter(Boolean);
  langs.forEach((language) => chips.push(language));

  if (single(params.fssai) === "1") chips.push("FSSAI certified");

  return chips;
}

export default async function CustomerResultsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const filters = parseProviderFilters(params);

  const cookieStore = await cookies();
  const userId = cookieStore.get("setu_user_id")?.value;
  const user = userId
    ? await db.user.findUnique({
        where: { id: userId },
        select: { city: true, area: true, lat: true, lng: true },
      })
    : null;

  const providers = await searchProviders(filters, user);
  const chips = buildChips(params);
  const filtersQuery = new URLSearchParams(
    Object.entries(params).flatMap(([key, value]) => {
      const resolved = single(value);
      return resolved ? [[key, resolved] as [string, string]] : [];
    }),
  ).toString();
  const filtersHref = filtersQuery ? `/customer/filters?${filtersQuery}` : "/customer/filters";
  const locationLabel = user?.area && user?.city ? `${user.area}, ${user.city}` : user?.city || "your area";

  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)] pb-[calc(24px+env(safe-area-inset-bottom))]">
        <ResultsHeader />

        <section className="flex min-w-0 flex-col gap-4 px-4 py-4 min-[390px]:px-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-headline-sm text-[var(--on-surface)]">Matching results</h1>
              <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                {providers.length === 0
                  ? `No trusted professionals found near ${locationLabel}`
                  : `Showing ${providers.length} trusted professional${providers.length === 1 ? "" : "s"} near ${locationLabel}`}
              </p>
            </div>
            <Link
              className="flex min-h-10 shrink-0 items-center gap-2 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 text-label-md"
              href={filtersHref}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filter
            </Link>
          </div>

          {chips.length ? <FilterChips chips={chips} /> : null}

          {providers.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-6 text-center">
              <p className="text-body-md text-[var(--on-surface)]">No matches with these filters.</p>
              <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                Try widening the distance, raising the budget, or clearing some filters.
              </p>
              <Link
                className="mt-4 inline-flex min-h-10 items-center justify-center rounded-md bg-[var(--primary)] px-4 text-label-md text-[var(--on-primary)]"
                href="/customer/results"
              >
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {providers.map((provider, index) => (
                <ProviderCard index={index} key={provider.id} provider={provider} />
              ))}
            </div>
          )}
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
          aria-label="Back to home"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--primary)]"
          href="/customer"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="truncate text-center text-headline-sm text-[var(--primary)]">Matches</h2>
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

function FilterChips({ chips }: { chips: string[] }) {
  return (
    <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto overscroll-x-contain px-1 pb-1">
      {chips.map((chip, index) => (
        <span
          className="shrink-0 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 py-2 text-label-md text-[var(--on-surface)]"
          key={`${chip}-${index}`}
        >
          {chip}
        </span>
      ))}
    </div>
  );
}

function ProviderCard({ index, provider }: { index: number; provider: ProviderResult }) {
  return (
    <article className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]">
      <div className="flex gap-3">
        <PhotoPlaceholder image={provider.image} initials={provider.initials} index={index} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-headline-sm text-[var(--on-surface)]">{provider.name}</h3>
              <p className="truncate text-body-sm text-[var(--on-surface-variant)]">{provider.service}</p>
            </div>
            {provider.rating ? (
              <div className="flex shrink-0 items-center gap-1 rounded bg-[var(--surface-container)] px-2 py-1">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="text-label-md">{provider.rating}</span>
              </div>
            ) : (
              <span className="shrink-0 rounded bg-[var(--surface-container)] px-2 py-1 text-label-md">New</span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-body-sm text-[var(--on-surface-variant)]">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {provider.distanceLabel}
            </span>
            <span className="flex items-center gap-1">
              <IndianRupee className="h-3.5 w-3.5" />
              {provider.priceLabel}
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
        <span>{provider.languagesLabel}</span>
      </div>

      <div className="mt-3 border-t border-[var(--surface-variant)] pt-3">
        <p className="mb-2 text-label-sm text-[var(--on-surface-variant)]">Why matched</p>
        <div className="flex flex-wrap gap-2">
          {provider.matchReasons.map((reason) => (
            <span
              className="rounded bg-[var(--surface-container-high)] px-2 py-1 text-label-md text-[var(--on-surface)]"
              key={`${provider.id}-${reason}`}
            >
              {reason}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-3">
        <Link
          className="flex min-h-11 items-center justify-center rounded-md border border-[var(--outline)] bg-[var(--surface-container-lowest)] px-4 text-label-md"
          href={`/customer/trust-passport?providerId=${provider.id}`}
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
  image,
  index,
  initials,
}: {
  image?: string;
  index: number;
  initials: string;
}) {
  if (image) {
    return (
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-high)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={`Profile of ${initials}`} className="h-full w-full object-cover grayscale" src={image} />
      </div>
    );
  }

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
      <span className="relative z-10 text-label-lg text-[var(--on-surface)]">{initials}</span>
    </div>
  );
}
