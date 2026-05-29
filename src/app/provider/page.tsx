import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  CalendarClock,
  HelpCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const valueBullets = [
  {
    icon: CalendarClock,
    title: "Work on your terms and schedule",
    copy: "Choose when you are available and accept jobs that fit your day.",
  },
  {
    icon: BadgeCheck,
    title: "Get matched with verified local customers",
    copy: "Setu brings nearby customer requests that match your skills and area.",
  },
  {
    icon: ShieldCheck,
    title: "Build your digital Trust Passport",
    copy: "Show verification, languages, reviews, experience, and service proof in one place.",
  },
  {
    icon: Banknote,
    title: "Secure payments directly to your bank",
    copy: "Keep pricing clear for customers and track payment status with confidence.",
  },
];

export default function ProviderOnboardingPage() {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto flex min-h-dvh w-full min-w-0 max-w-[480px] flex-col overflow-x-hidden bg-[var(--surface)] px-4 pb-[calc(24px+env(safe-area-inset-bottom))] pt-6 min-[390px]:px-5 min-[390px]:pt-7">
        <header className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--primary)] text-[var(--on-primary)]">
              <Sparkles className="h-5 w-5 fill-current" />
            </div>
            <div className="min-w-0">
              <p className="text-label-sm uppercase text-[var(--on-surface-variant)]">
                Setu Provider
              </p>
              <p className="truncate text-label-lg text-[var(--on-surface)]">
                Local work network
              </p>
            </div>
          </div>
          <button className="min-h-9 shrink-0 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 text-label-md text-[var(--on-surface)]">
            Help
          </button>
        </header>

        <section className="mt-8 min-[390px]:mt-10">
          <div className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-5 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)] min-[390px]:p-6">
            <p className="mb-3 w-fit rounded-full bg-[var(--surface-container)] px-3 py-1 text-label-sm uppercase text-[var(--on-surface-variant)]">
              Earn with trust
            </p>
            <h1 className="max-w-[21rem] text-headline-lg text-[var(--primary)]">
              Turn your skill into trusted local work
            </h1>
            <p className="mt-3 max-w-[22rem] text-body-md text-[var(--on-surface-variant)]">
              Join the Setu network and connect with customers looking for your expertise in a new city.
            </p>
          </div>
        </section>

        <section className="mt-6 flex flex-col gap-3" aria-label="Provider benefits">
          {valueBullets.map(({ copy, icon: Icon, title }) => (
            <article
              className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4"
              key={title}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--surface-container)] text-[var(--primary)]">
                  <Icon className="h-5 w-5" strokeWidth={2.25} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-headline-sm text-[var(--on-surface)]">
                    {title}
                  </h2>
                  <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                    {copy}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-4">
          <div className="flex items-start gap-3">
            <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]" />
            <div>
              <h2 className="text-label-lg text-[var(--on-surface)]">
                What you will set up
              </h2>
              <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                Basic details, skills, service area, documents, languages, availability, and payout information.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-auto flex flex-col gap-3 pt-8">
          <Link
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 text-label-lg text-[var(--on-primary)]"
            href="/provider/verify-identity"
          >
            <span>Start Onboarding</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <button className="min-h-12 w-full rounded-md border border-[var(--primary)] bg-transparent px-4 text-label-lg text-[var(--primary)]">
            Learn how it works
          </button>
        </div>
      </div>
    </main>
  );
}
