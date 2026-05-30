import Link from "next/link";
import { cookies } from "next/headers";
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
import { db } from "@/lib/db";
import { serviceLabel } from "@/lib/services";

const categories = ["All", "Mehendi", "Makeup", "Plumbing", "Cleaning"];

const nearbyRadiusKm = 60;

const cityAliases: Record<string, string> = {
  bengaluru: "bangalore",
  bangalore: "bangalore",
  "delhi ncr": "delhi",
  delhi: "delhi",
  mumbai: "mumbai",
  hyderabad: "hyderabad",
  chennai: "chennai",
  kolkata: "kolkata",
  pune: "pune",
};

function cityKey(value?: string | null) {
  if (!value) return "";
  const lower = value.toLowerCase();
  for (const alias of Object.keys(cityAliases)) {
    if (lower.includes(alias)) return cityAliases[alias];
  }
  return lower.trim();
}

function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return earthRadiusKm * 2 * Math.asin(Math.sqrt(h));
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type CustomerLocation = { city: string | null; area: string | null; lat: number | null; lng: number | null };

async function getCustomerHome() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("setu_user_id")?.value;

  let user: CustomerLocation | null = null;
  if (userId) {
    user = await db.user.findUnique({
      where: { id: userId },
      select: { city: true, area: true, lat: true, lng: true },
    });
  }

  const providers = await db.providerProfile.findMany({
    where: { onboardingStatus: "approved" },
    select: {
      id: true,
      displayName: true,
      category: true,
      yearsExperience: true,
      languages: true,
      city: true,
      lat: true,
      lng: true,
      trustScore: true,
      packages: { where: { active: true }, select: { priceInr: true }, orderBy: { priceInr: "asc" }, take: 1 },
      reviews: { select: { rating: true } },
      portfolio: {
        where: { type: "photo" },
        select: { mediaUrl: true, uploadedFile: { select: { publicUrl: true } } },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { trustScore: "desc" },
    take: 50,
  });

  const hasUserCoords = user?.lat != null && user?.lng != null;

  const trustedProviders: Provider[] = providers
    .filter((provider) => {
      if (hasUserCoords && provider.lat != null && provider.lng != null) {
        return (
          distanceKm({ lat: user!.lat!, lng: user!.lng! }, { lat: provider.lat, lng: provider.lng }) <=
          nearbyRadiusKm
        );
      }
      const userCity = cityKey(user?.city);
      return Boolean(userCity) && userCity === cityKey(provider.city);
    })
    .map((provider) => {
      const ratings = provider.reviews.map((review) => review.rating);
      const avgRating = ratings.length ? ratings.reduce((sum, value) => sum + value, 0) / ratings.length : null;
      const languages = Array.isArray(provider.languages) ? provider.languages.map(String) : [];
      const price = provider.packages[0]?.priceInr;
      const photo = provider.portfolio[0]?.mediaUrl ?? provider.portfolio[0]?.uploadedFile?.publicUrl ?? undefined;
      const name = provider.displayName ?? "Provider";

      return {
        id: provider.id,
        name,
        service: provider.category ? serviceLabel(provider.category) : "Service Pro",
        exp: provider.yearsExperience ? `${provider.yearsExperience} yrs` : "New",
        tags: languages.slice(0, 3),
        price: price != null ? String(price) : "—",
        image: photo,
        initials: initialsOf(name),
        rating: avgRating != null ? avgRating.toFixed(1) : undefined,
        badge: avgRating != null ? undefined : "Verified",
      } satisfies Provider;
    });

  const locationLabel =
    user?.area && user?.city ? `${user.area}, ${user.city}` : user?.city || "Set your location";

  return { locationLabel, trustedProviders };
}

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
  { label: "Home", icon: Home, href: "/customer", active: true },
  { label: "Bookings", icon: CalendarDays, href: "/customer/bookings" },
  { label: "Messages", icon: MessageSquare, href: "/customer/messages" },
  { label: "Profile", icon: User, href: "/profile" },
];

export default async function HomePage() {
  const { locationLabel, trustedProviders } = await getCustomerHome();

  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)] pb-[calc(92px+env(safe-area-inset-bottom))]">
        <TopBar locationLabel={locationLabel} />

        <div className="flex min-w-0 flex-col gap-5 px-4 pt-5 min-[390px]:gap-6 min-[390px]:px-5 min-[390px]:pt-6">
          <SearchBar />
          <CategoryChips />
          <ProviderRail
            title="Trusted near you"
            providers={trustedProviders}
            emptyMessage={`No verified providers near ${locationLabel} yet. Check back soon.`}
          />
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

function TopBar({ locationLabel }: { locationLabel: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
      <div className="flex h-12 items-center justify-between gap-2 px-4 min-[390px]:px-5">
        <Link className="flex min-h-12 min-w-0 items-center gap-1.5 text-label-lg" href="/select-location">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate">{locationLabel}</span>
          <ChevronDown className="h-4 w-4 shrink-0" />
        </Link>

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
  id?: string;
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
  emptyMessage,
}: {
  compact?: boolean;
  providers: Provider[];
  title: string;
  emptyMessage?: string;
}) {
  return (
    <section className="min-w-0">
      <div className="mb-3 flex items-end justify-between gap-3 px-1">
        <h2 className="text-headline-sm text-[var(--on-surface)]">{title}</h2>
        <button className="min-h-10 shrink-0 px-1 text-label-md text-[var(--secondary)]">
          View All
        </button>
      </div>

      {providers.length === 0 && emptyMessage ? (
        <p className="rounded-lg border border-dashed border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-4 text-body-sm text-[var(--on-surface-variant)]">
          {emptyMessage}
        </p>
      ) : (
        <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto overscroll-x-contain px-1 pb-1">
          {providers.map((provider, index) => (
            <ProviderCard
              compact={compact}
              key={`${title}-${provider.name}-${index}`}
              provider={provider}
            />
          ))}
        </div>
      )}
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
            <div className="flex shrink-0 items-center gap-2">
              <Link
                className="flex min-h-10 items-center justify-center rounded-md border border-[var(--outline)] bg-[var(--surface-container-lowest)] px-4 text-label-md text-[var(--on-surface)]"
                href={`/customer/trust-passport?providerId=${provider.id ?? ""}`}
              >
                View
              </Link>
              <Link
                className="flex min-h-10 items-center justify-center rounded-md bg-[var(--primary)] px-4 text-label-md text-[var(--on-primary)]"
                href={`/customer/booking?providerId=${provider.id ?? ""}`}
              >
                Book Now
              </Link>
            </div>
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
      <div className="mx-auto grid h-20 w-full max-w-[480px] grid-cols-4 px-1 pb-[env(safe-area-inset-bottom)] text-[var(--on-surface-variant)]">
        {navItems.map(({ active, href, icon: Icon, label }) => {
          const inner = (
            <>
              <span
                className={
                  active
                    ? "flex h-8 w-12 items-center justify-center rounded-full bg-[var(--primary-container)] text-[var(--on-primary)] min-[390px]:w-14"
                    : "flex h-8 w-12 items-center justify-center rounded-full min-[390px]:w-14"
                }
              >
                <Icon className="h-5 w-5" fill={active ? "currentColor" : "none"} />
              </span>
              <span
                className={
                  active ? "max-w-full truncate text-[var(--primary)]" : "max-w-full truncate"
                }
              >
                {label}
              </span>
            </>
          );

          const className = "flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 text-label-md";

          return href ? (
            <Link className={className} href={href} key={label}>
              {inner}
            </Link>
          ) : (
            <button className={className} key={label} type="button">
              {inner}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
