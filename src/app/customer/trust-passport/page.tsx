import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  BriefcaseBusiness,
  CheckCircle2,
  Languages,
  MapPin,
  MessageSquare,
  Navigation,
  ShieldCheck,
  Share2,
  Star,
  User,
} from "lucide-react";
import { db } from "@/lib/db";
import { serviceLabel } from "@/lib/services";

type SearchParams = Record<string, string | string[] | undefined>;

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function readArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

async function getProvider(providerId?: string) {
  if (!providerId) return null;

  const provider = await db.providerProfile.findUnique({
    where: { id: providerId },
    select: {
      id: true,
      displayName: true,
      bio: true,
      category: true,
      languages: true,
      area: true,
      city: true,
      serviceRadiusKm: true,
      yearsExperience: true,
      trustScore: true,
      onboardingStatus: true,
      packages: {
        where: { active: true },
        orderBy: { priceInr: "asc" },
        select: { id: true, name: true, description: true, priceInr: true },
      },
      reviews: { select: { rating: true } },
      portfolio: {
        where: { type: "photo" },
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, mediaUrl: true, uploadedFile: { select: { publicUrl: true } } },
      },
      documents: { select: { type: true } },
      settings: { select: { neighborhoods: true } },
    },
  });

  if (!provider) return null;

  const ratings = provider.reviews.map((review) => review.rating);
  const avgRating = ratings.length ? ratings.reduce((sum, value) => sum + value, 0) / ratings.length : null;
  const languages = readArray(provider.languages);
  const hasFssai = provider.documents.some((doc) => doc.type === "fssai");
  const hasIdentity =
    provider.documents.some((doc) => doc.type === "id_front") &&
    provider.documents.some((doc) => doc.type === "selfie");

  const badges = ["Verified"];
  if (avgRating != null && avgRating >= 4.5) badges.push("Top Pro");
  if (hasIdentity) badges.push("Background checked");
  if (hasFssai) badges.push("FSSAI certified");

  const portfolio = provider.portfolio.map((item) => ({
    id: item.id,
    title: item.title ?? "Work sample",
    url: item.mediaUrl ?? item.uploadedFile?.publicUrl ?? null,
  }));

  const name = provider.displayName ?? "Provider";

  return {
    id: provider.id,
    name,
    initials: initialsOf(name),
    service: provider.category ? serviceLabel(provider.category) : "Service Pro",
    location: [provider.area, provider.city].filter(Boolean).join(", ") || "Location not set",
    area: provider.area ?? provider.city ?? "their area",
    bio: provider.bio ?? "",
    languages,
    badges,
    avgRating,
    reviewCount: ratings.length,
    yearsExperience: provider.yearsExperience,
    trustScore: provider.trustScore,
    serviceRadiusKm: provider.serviceRadiusKm,
    neighborhoods: readArray(provider.settings?.neighborhoods),
    portfolio,
    packages: provider.packages,
  };
}

type ProviderView = NonNullable<Awaited<ReturnType<typeof getProvider>>>;

export default async function TrustPassportPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const provider = await getProvider(single(params.providerId));

  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)] pb-[calc(88px+env(safe-area-inset-bottom))]">
        <TrustPassportHeader />

        {provider ? (
          <>
            <section className="flex min-w-0 flex-col gap-4 px-4 py-4 min-[390px]:px-5">
              <HeroProfile provider={provider} />
              <StatsGrid provider={provider} />
              <AboutSection provider={provider} />
              <PortfolioGallery provider={provider} />
              <ServiceDetails provider={provider} />
              <Packages provider={provider} />
            </section>

            <ActionFooter providerId={provider.id} />
          </>
        ) : (
          <section className="flex flex-col items-center gap-3 px-4 py-16 text-center">
            <p className="text-headline-sm text-[var(--on-surface)]">Provider not found</p>
            <p className="max-w-[18rem] text-body-sm text-[var(--on-surface-variant)]">
              This profile is unavailable or the link is invalid.
            </p>
            <Link
              className="mt-2 inline-flex min-h-10 items-center justify-center rounded-md bg-[var(--primary)] px-4 text-label-md text-[var(--on-primary)]"
              href="/customer/results"
            >
              Back to results
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}

function TrustPassportHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]">
      <div className="grid h-12 grid-cols-[2.5rem_1fr_2.5rem] items-center px-3 min-[390px]:px-4">
        <Link
          aria-label="Go back"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--primary)]"
          href="/customer/results"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="truncate text-center text-headline-sm text-[var(--primary)]">Trust Passport</h1>
        <button
          aria-label="Share trust passport"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--primary)]"
          type="button"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

function HeroProfile({ provider }: { provider: ProviderView }) {
  const photo = provider.portfolio.find((item) => item.url)?.url ?? null;

  return (
    <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
      <div className="flex items-start gap-4">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-high)]">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt={provider.name} className="h-full w-full object-cover grayscale" src={photo} />
          ) : (
            <>
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#ffffff_0%,#dadada_100%)]" />
              <User className="absolute bottom-1 h-11 w-11 text-[var(--on-surface-variant)] opacity-45" />
              <span className="relative z-10 text-headline-sm">{provider.initials}</span>
            </>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-label-sm uppercase text-[var(--on-surface-variant)]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Trust Passport
          </div>
          <h2 className="mt-1 truncate text-headline-lg">{provider.name}</h2>
          <p className="mt-1 text-body-md text-[var(--on-surface-variant)]">{provider.service}</p>
          <p className="mt-1 flex items-center gap-1 text-body-sm text-[var(--on-surface-variant)]">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {provider.location}
          </p>
        </div>
      </div>

      {provider.badges.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {provider.badges.map((badge) => (
            <span
              className="flex items-center gap-1 rounded bg-[var(--surface-container-low)] px-2 py-1 text-label-sm"
              key={badge}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {badge}
            </span>
          ))}
        </div>
      ) : null}

      {provider.languages.length ? (
        <div className="mt-3 flex items-center gap-2 text-label-md text-[var(--on-surface-variant)]">
          <Languages className="h-4 w-4" />
          <span>{provider.languages.join(", ")}</span>
        </div>
      ) : null}
    </section>
  );
}

function StatsGrid({ provider }: { provider: ProviderView }) {
  const stats = [
    {
      label: "Reviews",
      value: provider.avgRating != null ? provider.avgRating.toFixed(1) : "New",
      helper: `${provider.reviewCount} review${provider.reviewCount === 1 ? "" : "s"}`,
      icon: Star,
    },
    {
      label: "Experience",
      value: provider.yearsExperience ? `${provider.yearsExperience}+ yrs` : "New",
      helper: `${provider.service}`,
      icon: BriefcaseBusiness,
    },
    {
      label: "Trust",
      value: String(provider.trustScore),
      helper: "Setu trust score",
      icon: ShieldCheck,
    },
    {
      label: "Radius",
      value: `${provider.serviceRadiusKm} km`,
      helper: `Around ${provider.area}`,
      icon: Navigation,
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3">
      {stats.map(({ helper, icon: Icon, label, value }) => (
        <div
          className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4"
          key={label}
        >
          <div className="flex items-center gap-2 text-[var(--on-surface-variant)]">
            <Icon className="h-4 w-4" fill={label === "Reviews" ? "currentColor" : "none"} />
            <span className="text-label-sm">{label}</span>
          </div>
          <p className="mt-2 text-headline-sm">{value}</p>
          <p className="mt-1 truncate text-body-sm text-[var(--on-surface-variant)]">{helper}</p>
        </div>
      ))}
    </section>
  );
}

function AboutSection({ provider }: { provider: ProviderView }) {
  if (!provider.bio) return null;
  return (
    <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
      <h2 className="text-headline-sm">About</h2>
      <p className="mt-2 text-body-md text-[var(--on-surface-variant)]">{provider.bio}</p>
    </section>
  );
}

function PortfolioGallery({ provider }: { provider: ProviderView }) {
  if (provider.portfolio.length === 0) return null;

  return (
    <section className="min-w-0">
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <h2 className="text-headline-sm">Portfolio gallery</h2>
        <span className="text-label-md text-[var(--on-surface-variant)]">
          {provider.portfolio.length} photo{provider.portfolio.length === 1 ? "" : "s"}
        </span>
      </div>
      <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto overscroll-x-contain px-1 pb-1">
        {provider.portfolio.map((item, index) => (
          <div
            className="relative flex h-36 w-36 shrink-0 flex-col justify-end overflow-hidden rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-high)] p-3"
            key={item.id}
          >
            {item.url ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={item.title} className="absolute inset-0 h-full w-full object-cover grayscale" src={item.url} />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgb(0_0_0/0.55),transparent)]" />
              </>
            ) : (
              <div
                className={
                  index % 2 === 0
                    ? "mb-auto h-16 rounded bg-[linear-gradient(135deg,#ffffff_0%,#dadada_100%)]"
                    : "mb-auto h-16 rounded bg-[linear-gradient(135deg,#f4f3f3_0%,#e3e2e2_100%)]"
                }
              />
            )}
            <span className={item.url ? "relative z-10 mt-3 text-label-md text-white" : "mt-3 text-label-md"}>
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ServiceDetails({ provider }: { provider: ProviderView }) {
  const neighborhoods = provider.neighborhoods.length
    ? provider.neighborhoods.join(", ")
    : `${provider.area} and nearby neighborhoods`;

  return (
    <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
      <h2 className="text-headline-sm">Service radius</h2>
      <div className="mt-3 flex items-start gap-3 rounded-md bg-[var(--surface-container-low)] p-3">
        <Navigation className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="min-w-0">
          <p className="text-label-lg">
            Serves up to {provider.serviceRadiusKm} km around {provider.area}
          </p>
          <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">Covers {neighborhoods}.</p>
        </div>
      </div>
    </section>
  );
}

function Packages({ provider }: { provider: ProviderView }) {
  if (provider.packages.length === 0) return null;

  return (
    <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]">
      <div className="border-b border-[var(--surface-variant)] p-4">
        <h2 className="text-headline-sm">Packages</h2>
      </div>
      {provider.packages.map((item, index) => (
        <div
          className={
            index === provider.packages.length - 1 ? "p-4" : "border-b border-[var(--surface-variant)] p-4"
          }
          key={item.id}
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-label-lg">{item.name}</h3>
            <span className="shrink-0 text-headline-sm">₹{item.priceInr.toLocaleString("en-IN")}</span>
          </div>
          {item.description ? (
            <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">{item.description}</p>
          ) : null}
        </div>
      ))}
    </section>
  );
}

function ActionFooter({ providerId }: { providerId: string }) {
  return (
    <footer className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-4 py-3">
      <div className="mx-auto grid w-full max-w-[480px] grid-cols-[3rem_1fr_1fr] gap-3">
        <button
          aria-label="Save provider"
          className="flex min-h-12 items-center justify-center rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]"
          type="button"
        >
          <Bookmark className="h-5 w-5" />
        </button>
        <Link
          className="flex min-h-12 items-center justify-center gap-2 rounded-md border border-[var(--primary)] bg-[var(--surface-container-lowest)] px-4 text-label-lg"
          href="/customer/chat-thread"
        >
          <MessageSquare className="h-4 w-4" />
          Chat
        </Link>
        <Link
          className="flex min-h-12 items-center justify-center rounded-md bg-[var(--primary)] px-4 text-label-lg text-[var(--on-primary)]"
          href={`/customer/booking?providerId=${providerId}`}
        >
          Book
        </Link>
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </footer>
  );
}
