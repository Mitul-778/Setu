import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  BriefcaseBusiness,
  CheckCircle2,
  Clock,
  Languages,
  MapPin,
  MessageSquare,
  Navigation,
  Share2,
  ShieldCheck,
  Star,
  User,
} from "lucide-react";

const badges = ["Verified", "Top Pro", "Background checked"];
const languages = ["Hindi", "English", "Marathi"];

const stats = [
  { label: "Reviews", value: "4.9", helper: "120 reviews", icon: Star },
  { label: "Experience", value: "5+ yrs", helper: "Mehendi specialist", icon: BriefcaseBusiness },
  { label: "Response", value: "30 min", helper: "Avg. response time", icon: Clock },
  { label: "Radius", value: "10 km", helper: "Around Indiranagar", icon: Navigation },
];

const portfolio = [
  "Bridal hands",
  "Minimal design",
  "Arabic style",
  "Party mehendi",
];

const packages = [
  {
    name: "Basic Bridal",
    price: "\u20B91,500",
    description: "Both hands till wrist with simple feet design. Organic henna included.",
  },
  {
    name: "Premium Bridal",
    price: "\u20B93,500",
    description: "Full hands till elbow, detailed feet design, and a short trial session.",
  },
  {
    name: "Family Event Pack",
    price: "\u20B95,000",
    description: "Mehendi for up to 6 guests with coordinated simple designs.",
  },
];

export default function TrustPassportPage() {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)] pb-[calc(88px+env(safe-area-inset-bottom))]">
        <TrustPassportHeader />

        <section className="flex min-w-0 flex-col gap-4 px-4 py-4 min-[390px]:px-5">
          <HeroProfile />
          <StatsGrid />
          <AboutSection />
          <PortfolioGallery />
          <ServiceDetails />
          <Packages />
        </section>

        <ActionFooter />
      </div>
    </main>
  );
}

function TrustPassportHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]">
      <div className="grid h-12 grid-cols-[2.5rem_1fr_2.5rem] items-center px-3 min-[390px]:px-4">
        <button
          aria-label="Go back"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--primary)]"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="truncate text-center text-headline-sm text-[var(--primary)]">
          Trust Passport
        </h1>
        <button
          aria-label="Share trust passport"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--primary)]"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

function HeroProfile() {
  return (
    <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
      <div className="flex items-start gap-4">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-high)]">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#ffffff_0%,#dadada_100%)]" />
          <User className="absolute bottom-1 h-11 w-11 text-[var(--on-surface-variant)] opacity-45" />
          <span className="relative z-10 text-headline-sm">AS</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-label-sm uppercase text-[var(--on-surface-variant)]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Trust Passport
          </div>
          <h2 className="mt-1 truncate text-headline-lg">Arjun Singh</h2>
          <p className="mt-1 text-body-md text-[var(--on-surface-variant)]">
            Mehendi Artist
          </p>
          <p className="mt-1 flex items-center gap-1 text-body-sm text-[var(--on-surface-variant)]">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            Indiranagar, Bangalore
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {badges.map((badge) => (
          <span
            className="flex items-center gap-1 rounded bg-[var(--surface-container-low)] px-2 py-1 text-label-sm"
            key={badge}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {badge}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2 text-label-md text-[var(--on-surface-variant)]">
        <Languages className="h-4 w-4" />
        <span>{languages.join(", ")}</span>
      </div>
    </section>
  );
}

function StatsGrid() {
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
          <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
            {helper}
          </p>
        </div>
      ))}
    </section>
  );
}

function AboutSection() {
  return (
    <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
      <h2 className="text-headline-sm">About</h2>
      <p className="mt-2 text-body-md text-[var(--on-surface-variant)]">
        Specializes in traditional Rajasthani and contemporary minimalist
        mehendi designs. Uses organic henna and focuses on clean, detailed work
        for weddings, family functions, and small events.
      </p>
    </section>
  );
}

function PortfolioGallery() {
  return (
    <section className="min-w-0">
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <h2 className="text-headline-sm">Portfolio gallery</h2>
        <span className="text-label-md text-[var(--on-surface-variant)]">
          24 photos
        </span>
      </div>
      <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto overscroll-x-contain px-1 pb-1">
        {portfolio.map((item, index) => (
          <div
            className="flex h-36 w-36 shrink-0 flex-col justify-end overflow-hidden rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-high)] p-3"
            key={item}
          >
            <div
              className={
                index % 2 === 0
                  ? "mb-auto h-16 rounded bg-[linear-gradient(135deg,#ffffff_0%,#dadada_100%)]"
                  : "mb-auto h-16 rounded bg-[linear-gradient(135deg,#f4f3f3_0%,#e3e2e2_100%)]"
              }
            />
            <span className="mt-3 text-label-md">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ServiceDetails() {
  return (
    <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
      <h2 className="text-headline-sm">Service radius</h2>
      <div className="mt-3 flex items-start gap-3 rounded-md bg-[var(--surface-container-low)] p-3">
        <Navigation className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <p className="text-label-lg">Serves up to 10 km around Indiranagar</p>
          <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
            Covers Koramangala, Domlur, Old Airport Road, HAL, and nearby
            neighborhoods.
          </p>
        </div>
      </div>
    </section>
  );
}

function Packages() {
  return (
    <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]">
      <div className="border-b border-[var(--surface-variant)] p-4">
        <h2 className="text-headline-sm">Packages</h2>
      </div>
      {packages.map((item, index) => (
        <div
          className={
            index === packages.length - 1
              ? "p-4"
              : "border-b border-[var(--surface-variant)] p-4"
          }
          key={item.name}
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-label-lg">{item.name}</h3>
            <span className="shrink-0 text-headline-sm">{item.price}</span>
          </div>
          <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
            {item.description}
          </p>
        </div>
      ))}
    </section>
  );
}

function ActionFooter() {
  return (
    <footer className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-4 py-3">
      <div className="mx-auto grid w-full max-w-[480px] grid-cols-[3rem_1fr_1fr] gap-3">
        <button
          aria-label="Save provider"
          className="flex min-h-12 items-center justify-center rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]"
        >
          <Bookmark className="h-5 w-5" />
        </button>
        <button className="flex min-h-12 items-center justify-center gap-2 rounded-md border border-[var(--primary)] bg-[var(--surface-container-lowest)] px-4 text-label-lg">
          <MessageSquare className="h-4 w-4" />
          Chat
        </button>
        <Link
          className="flex min-h-12 items-center justify-center rounded-md bg-[var(--primary)] px-4 text-label-lg text-[var(--on-primary)]"
          href="/customer/booking"
        >
          Book
        </Link>
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </footer>
  );
}
