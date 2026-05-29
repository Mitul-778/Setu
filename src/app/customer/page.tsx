import Link from "next/link";
import {
  CalendarDays,
  ChevronDown,
  Home,
  MapPin,
  MessageSquare,
  Mic,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  User,
} from "lucide-react";

const categories = ["All", "Mehendi", "Makeup", "Plumbing", "Cleaning"];

const trustedProviders = [
  {
    name: "Ramesh Kumar",
    service: "Expert Plumber",
    exp: "5 yrs",
    rating: "4.8",
    tags: ["Hindi", "Kannada", "Available Now"],
    price: "299",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCTPsdCc7TJwWFI3k97TZfw6gSeorTbHt_m8f_cnaLzZ6lmoSrNBagPdnYbIbL03BZdn9dZaKYpwnhVEaTxHuCzBU6mVjS21bty6Gtu9mBo8hHsGDtksgd7PGO2hFmwP2RkELUMzxNGogt925AbGUba_nBzJCJ1qxJ6PzHnGDxM8rQgHxHEoXDPb9jilGrfIiIbT1iP5qcCILOHNWEkYGyQVWnW5enbrVPAdW-5up3I4wZq38AnlYtzSCaqWOLGYPJDlCPvgy_Cqr0",
  },
  {
    name: "Asha Khan",
    service: "Mehendi Artist",
    exp: "4 yrs",
    rating: "4.9",
    tags: ["Hindi", "English", "Available Now"],
    price: "799",
    initials: "AK",
  },
  {
    name: "Imran Shaikh",
    service: "AC Technician",
    exp: "6 yrs",
    rating: "4.7",
    tags: ["Hindi", "Marathi"],
    price: "399",
    initials: "IS",
  },
];

const newcomerProviders = [
  {
    name: "Priya Sharma",
    service: "Mehendi Artist",
    exp: "2 yrs",
    badge: "New",
    tags: ["Hindi", "Special Offers"],
    price: "699",
    initials: "PS",
  },
  {
    name: "Meera Iyer",
    service: "Makeup Artist",
    exp: "1 yr",
    badge: "New",
    tags: ["English", "Tamil"],
    price: "1,499",
    initials: "MI",
  },
  {
    name: "Nikhil Patel",
    service: "Home Cleaner",
    exp: "2 yrs",
    badge: "Verified",
    tags: ["Gujarati", "Hindi"],
    price: "249",
    initials: "NP",
  },
];

const navItems = [
  { label: "Home", icon: Home, active: true },
  { label: "Requests", icon: ShieldCheck },
  { label: "Bookings", icon: CalendarDays },
  { label: "Messages", icon: MessageSquare },
  { label: "Profile", icon: User },
];

export default function HomePage() {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)] pb-[calc(92px+env(safe-area-inset-bottom))]">
        <TopBar />

        <div className="flex min-w-0 flex-col gap-5 px-4 pt-5 min-[390px]:gap-6 min-[390px]:px-5 min-[390px]:pt-6">
          <SearchBar />
          <CategoryChips />
          <ProviderRail title="Trusted near you" providers={trustedProviders} />
          <ProviderRail
            compact
            title="Good for newcomers"
            providers={newcomerProviders}
          />
        </div>

        <CustomerBottomNav />
      </div>
    </main>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
      <div className="flex h-12 items-center justify-between gap-2 px-4 min-[390px]:px-5">
        <button className="flex min-h-12 min-w-0 items-center gap-1.5 text-label-lg">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate">Bangalore, KA</span>
          <ChevronDown className="h-4 w-4 shrink-0" />
        </button>

        <Link
          className="flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container)] px-2.5 text-label-md shadow-[0_1px_2px_rgb(0_0_0_/_0.05)] min-[390px]:px-3"
          href="/customer/assistant"
        >
          <Sparkles className="h-4 w-4 fill-current" />
          <span>Setu AI</span>
        </Link>
      </div>
    </header>
  );
}

function SearchBar() {
  return (
    <section>
      <div className="flex gap-2">
        <label className="relative block min-w-0 flex-1">
          <span className="sr-only">Search local services</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--on-surface-variant)]" />
          <input
            className="min-h-13 w-full rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-10 text-body-md text-[var(--on-surface)] outline-none placeholder:text-[var(--on-surface-variant)] focus:border-[var(--primary)] min-[390px]:min-h-14"
            placeholder="Need a mehendi artist for Sunday evening"
            type="search"
          />
          <Mic className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--secondary)]" />
        </label>
        <Link
          aria-label="Open filters"
          className="flex min-h-13 w-13 shrink-0 items-center justify-center rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] text-[var(--on-surface)] min-[390px]:min-h-14 min-[390px]:w-14"
          href="/customer/filters"
        >
          <SlidersHorizontal className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}

function CategoryChips() {
  return (
    <section className="min-w-0">
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto overscroll-x-contain px-1 pb-1">
        {categories.map((category, index) => (
          <button
            className={
              index === 0
                ? "min-h-9 shrink-0 rounded-full border border-[var(--primary)] bg-[var(--primary)] px-4 text-label-md text-[var(--on-primary)] min-[390px]:px-5"
                : "min-h-9 shrink-0 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-4 text-label-md text-[var(--on-surface)] min-[390px]:px-5"
            }
            key={category}
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  );
}

type Provider = {
  name: string;
  service: string;
  exp: string;
  tags: string[];
  price: string;
  image?: string;
  initials?: string;
  rating?: string;
  badge?: string;
};

function ProviderRail({
  compact,
  providers,
  title,
}: {
  compact?: boolean;
  providers: Provider[];
  title: string;
}) {
  return (
    <section className="min-w-0">
      <div className="mb-3 flex items-end justify-between gap-3 px-1">
        <h2 className="text-headline-sm text-[var(--on-surface)]">{title}</h2>
        <button className="min-h-10 shrink-0 px-1 text-label-md text-[var(--secondary)]">
          View All
        </button>
      </div>

      <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto overscroll-x-contain px-1 pb-1">
        {providers.map((provider) => (
          <ProviderCard
            compact={compact}
            key={`${title}-${provider.name}`}
            provider={provider}
          />
        ))}
      </div>
    </section>
  );
}

function ProviderCard({
  compact,
  provider,
}: {
  compact?: boolean;
  provider: Provider;
}) {
  return (
    <article
      className={
        compact
          ? "w-[18.5rem] shrink-0 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4 text-[var(--on-surface)] shadow-[0_1px_2px_rgb(0_0_0_/_0.04)] min-[390px]:w-[20rem]"
          : "w-[19.5rem] shrink-0 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4 text-[var(--on-surface)] shadow-[0_1px_2px_rgb(0_0_0_/_0.04)] min-[390px]:w-[21rem]"
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <Avatar provider={provider} />
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="truncate text-label-lg">{provider.name}</h3>
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 fill-current" />
            </div>
            <p className="truncate text-body-sm text-[var(--on-surface-variant)]">
              {provider.service} Â· {provider.exp}
            </p>
          </div>
        </div>

        {provider.rating ? (
          <div className="flex shrink-0 items-center gap-1 rounded bg-[var(--surface-container)] px-2 py-1">
            <span className="text-label-md">{provider.rating}</span>
            <Star className="h-3 w-3 fill-current" />
          </div>
        ) : (
          <span className="shrink-0 rounded bg-[var(--surface-container)] px-2 py-1 text-label-md">
            {provider.badge}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {provider.tags.map((tag) => (
          <span
            className="rounded bg-[var(--surface-container-low)] px-2 py-1 text-label-sm"
            key={`${provider.name}-${tag}`}
          >
            {tag}
          </span>
        ))}
      </div>

      {!compact ? (
        <>
          <div className="my-3 h-px bg-[var(--surface-variant)]" />

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-label-sm text-[var(--on-surface-variant)]">
                Starting from
              </p>
              <p className="text-label-lg">{"\u20B9"}{provider.price}</p>
            </div>
            <button className="min-h-10 shrink-0 rounded-md bg-[var(--primary)] px-4 text-label-md text-[var(--on-primary)]">
              Book Now
            </button>
          </div>
        </>
      ) : (
        <p className="mt-3 text-label-md text-[var(--on-surface-variant)]">
          Starts at <span className="text-[var(--on-surface)]">{"\u20B9"}{provider.price}</span>
        </p>
      )}
    </article>
  );
}

function Avatar({ provider }: { provider: Provider }) {
  if (provider.image) {
    return (
      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-md bg-[var(--surface-container-high)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={`Profile picture of ${provider.name}`}
          className="h-full w-full object-cover grayscale"
          src={provider.image}
        />
      </div>
    );
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[var(--surface-container-high)] text-label-lg text-[var(--on-surface)]">
      {provider.initials}
    </div>
  );
}

function CustomerBottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]">
      <div className="mx-auto grid h-20 w-full max-w-[480px] grid-cols-5 px-1 pb-[env(safe-area-inset-bottom)] text-[var(--on-surface-variant)]">
        {navItems.map(({ active, icon: Icon, label }) => (
          <button
            className="flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 text-label-md"
            key={label}
          >
            <span
              className={
                active
                  ? "flex h-8 w-12 items-center justify-center rounded-full bg-[var(--primary-container)] text-[var(--on-primary)] min-[390px]:w-14"
                  : "flex h-8 w-12 items-center justify-center rounded-full min-[390px]:w-14"
              }
            >
              <Icon
                className="h-5 w-5"
                fill={active ? "currentColor" : "none"}
              />
            </span>
            <span
              className={
                active
                  ? "max-w-full truncate text-[var(--primary)]"
                  : "max-w-full truncate"
              }
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
