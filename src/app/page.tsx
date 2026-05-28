import Link from "next/link";
import {
  ArrowRight,
  Bug,
  CalendarDays,
  ChevronDown,
  Hammer,
  Home,
  MapPin,
  Mic,
  PlugZap,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  User,
  Wrench,
} from "lucide-react";

const languages = [
  "English",
  "Hindi",
  "Marathi",
  "Gujarati",
  "Tamil",
  "Telugu",
];

const categories = [
  { label: "Cleaning", icon: ShieldCheck },
  { label: "Electrician", icon: PlugZap },
  { label: "Plumbing", icon: Wrench },
  { label: "Pest Control", icon: Bug },
  { label: "Carpentry", icon: Hammer },
];

const providers = [
  {
    name: "Ramesh Kumar",
    role: "Expert Plumber",
    exp: "5 yrs exp",
    rating: "4.8",
    tags: ["Hindi", "Kannada", "Available Now"],
    price: "299",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCTPsdCc7TJwWFI3k97TZfw6gSeorTbHt_m8f_cnaLzZ6lmoSrNBagPdnYbIbL03BZdn9dZaKYpwnhVEaTxHuCzBU6mVjS21bty6Gtu9mBo8hHsGDtksgd7PGO2hFmwP2RkELUMzxNGogt925AbGUba_nBzJCJ1qxJ6PzHnGDxM8rQgHxHEoXDPb9jilGrfIiIbT1iP5qcCILOHNWEkYGyQVWnW5enbrVPAdW-5up3I4wZq38AnlYtzSCaqWOLGYPJDlCPvgy_Cqr0",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)] pb-[calc(88px+env(safe-area-inset-bottom))]">
        <TopBar />

        <div className="flex flex-col gap-5 px-4 pt-5 min-[390px]:gap-6 min-[390px]:px-5 min-[390px]:pt-6">
          <SearchBar />
          <LanguageSelector />
          <CategoryScroller />
          <ActionCards />
          <RecommendedProviders />
        </div>

        <BottomNav />
      </div>
    </main>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
      <div className="flex h-12 items-center justify-between gap-2 px-4 min-[390px]:px-5">
        <button className="flex min-h-12 min-w-0 items-center gap-1.5 text-label-lg">
          <MapPin className="h-4 w-4" />
          <span className="truncate">Bangalore, KA</span>
          <ChevronDown className="h-4 w-4" />
        </button>

        <button className="flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container)] px-2.5 text-label-md shadow-[0_1px_2px_rgb(0_0_0_/_0.05)] min-[390px]:px-3">
          <Sparkles className="h-4 w-4 fill-current" />
          <span>Setu AI</span>
        </button>
      </div>
    </header>
  );
}

function SearchBar() {
  return (
    <section>
      <label className="relative block">
        <span className="sr-only">Search local services</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--on-surface-variant)]" />
        <input
          className="min-h-13 w-full rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-10 text-body-md text-[var(--on-surface)] outline-none placeholder:text-[var(--on-surface-variant)] focus:border-[var(--primary)] min-[390px]:min-h-14 min-[390px]:text-body-lg"
          placeholder="Find a plumber, cleaner..."
          type="search"
        />
        <Mic className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--secondary)]" />
      </label>
    </section>
  );
}

function LanguageSelector() {
  return (
    <section className="min-w-0">
      <h2 className="mb-2 px-1 text-label-lg text-[var(--on-surface)]">
        Select Language
      </h2>
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto overscroll-x-contain px-1 pb-1">
        {languages.map((language, index) => (
          <button
            className={
              index === 0
                ? "min-h-9 shrink-0 rounded-full border border-[var(--primary)] bg-[var(--primary)] px-4 text-label-md text-[var(--on-primary)] min-[390px]:px-5"
                : "min-h-9 shrink-0 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-4 text-label-md text-[var(--on-surface)] min-[390px]:px-5"
            }
            key={language}
          >
            {language}
          </button>
        ))}
      </div>
    </section>
  );
}

function CategoryScroller() {
  return (
    <section className="min-w-0">
      <h2 className="mb-2 px-1 text-headline-sm text-[var(--on-surface)]">
        Categories
      </h2>
      <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto overscroll-x-contain px-1 pb-1 min-[390px]:gap-4">
        {categories.map(({ label, icon: Icon }) => (
          <button
            className="flex w-[4.25rem] shrink-0 flex-col items-center gap-2 min-[390px]:w-[4.5rem]"
            key={label}
          >
            <span className="flex h-13 w-13 items-center justify-center rounded-lg bg-[var(--surface-container)] text-[var(--primary)] min-[390px]:h-14 min-[390px]:w-14">
              <Icon className="h-6 w-6" strokeWidth={2.25} />
            </span>
            <span className="w-full truncate text-center text-label-sm text-[var(--on-surface)]">
              {label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function ActionCards() {
  return (
    <section className="flex flex-col gap-3">
      <Link
        className="block min-h-28 rounded-lg bg-[var(--primary)] p-5 text-left text-[var(--on-primary)] min-[390px]:p-6"
        href="/onboarding"
      >
        <div className="flex items-start justify-between gap-3 min-[390px]:gap-4">
          <div>
            <h2 className="text-headline-sm">Hire a service</h2>
            <p className="mt-2 max-w-[280px] text-body-sm text-white/80">
              Verified local experts matched to your needs. Fast, reliable, and
              trusted.
            </p>
          </div>
          <ArrowRight className="mt-1 h-6 w-6 shrink-0" />
        </div>
      </Link>

      <button className="min-h-28 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-highest)] p-5 text-left text-[var(--on-surface)] min-[390px]:p-6">
        <div className="flex items-start justify-between gap-3 min-[390px]:gap-4">
          <div>
            <h2 className="text-headline-sm">Offer a service</h2>
            <p className="mt-2 max-w-[285px] text-body-sm text-[var(--on-surface-variant)]">
              Join our community of trusted professionals and grow your
              business.
            </p>
          </div>
          <ArrowRight className="mt-1 h-6 w-6 shrink-0" />
        </div>
      </button>

      <div className="rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3.5 text-[var(--on-surface)]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 shrink-0" />
          <span className="text-label-md">
            Trust and local matching guaranteed
          </span>
        </div>
      </div>
    </section>
  );
}

function RecommendedProviders() {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-3 px-1">
        <h2 className="min-w-0 text-headline-sm text-[var(--on-surface)]">
          Recommended for You
        </h2>
        <button className="min-h-10 shrink-0 px-1 text-label-md text-[var(--secondary)]">
          View All
        </button>
      </div>

      {providers.map((provider) => (
        <article
          className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4 text-[var(--on-surface)] shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]"
          key={provider.name}
        >
          <div className="flex items-start justify-between gap-2 min-[390px]:gap-3">
            <div className="flex min-w-0 gap-3">
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-md bg-[var(--surface-container-high)] min-[390px]:h-12 min-[390px]:w-12">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={`Profile picture of ${provider.name}`}
                  className="h-full w-full object-cover grayscale"
                  src={provider.image}
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <h3 className="truncate text-label-lg">{provider.name}</h3>
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 fill-current" />
                </div>
                <p className="truncate text-body-sm text-[var(--on-surface-variant)]">
                  {provider.role} {"\u00B7"} {provider.exp}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1 rounded bg-[var(--surface-container)] px-2 py-1">
              <span className="text-label-md">{provider.rating}</span>
              <Star className="h-3 w-3 fill-current" />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {provider.tags.map((tag) => (
              <span
                className="rounded bg-[var(--surface-container-low)] px-2 py-1 text-label-sm"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="my-3 h-px bg-[var(--surface-variant)]" />

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-label-sm text-[var(--on-surface-variant)]">
                Starting from
              </p>
              <p className="text-label-lg">{"\u20B9"}{provider.price}</p>
            </div>
            <button className="min-h-10 shrink-0 rounded-md bg-[var(--primary)] px-4 text-label-md text-[var(--on-primary)] min-[390px]:px-5">
              Book Now
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}

function BottomNav() {
  const items = [
    { label: "Home", icon: Home, active: true },
    { label: "Search", icon: Search },
    { label: "Bookings", icon: CalendarDays },
    { label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]">
      <div className="mx-auto grid h-20 w-full max-w-[480px] grid-cols-4 px-1 pb-[env(safe-area-inset-bottom)] text-[var(--on-surface-variant)] min-[390px]:px-2">
        {items.map(({ label, icon: Icon, active }) => (
          <button
            className="flex min-h-16 flex-col items-center justify-center gap-1 text-label-md"
            key={label}
          >
            <span
              className={
                active
                  ? "flex h-8 w-14 items-center justify-center rounded-full bg-[var(--primary-container)] text-[var(--on-primary)] min-[390px]:w-16"
                  : "flex h-8 w-14 items-center justify-center rounded-full min-[390px]:w-16"
              }
            >
              <Icon className="h-5 w-5" fill={active ? "currentColor" : "none"} />
            </span>
            <span className={active ? "text-[var(--primary)]" : undefined}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
