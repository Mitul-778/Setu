"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  Camera,
  ChevronRight,
  Eye,
  FileText,
  HelpCircle,
  Languages,
  Lock,
  Phone,
  Send,
  ShieldCheck,
  User,
} from "lucide-react";
import {
  getExperienceLabel,
  getServiceLabels,
} from "@/lib/provider-profile-draft";
import { useProviderProfileDraft } from "@/lib/use-provider-profile-draft";

const trustBadges = [
  { label: "ID Verified", status: "complete", icon: ShieldCheck },
  { label: "Phone Verified", status: "complete", icon: Phone },
  { label: "Work Photos", status: "missing", icon: Camera },
  { label: "Certificates", status: "missing", icon: FileText },
];

const onboardingTasks = [
  { label: "Identity Verification", detail: "ID and phone completed", complete: true, href: "/provider/verify-identity" },
  { label: "Services and Bio", detail: "Profile details saved", complete: true, href: "/provider/services" },
  { label: "Portfolio Photos", detail: "Missing 2 more", complete: false, href: "/provider/showcase" },
  { label: "Service Settings", detail: "Availability and packages need review", complete: false, href: "/provider/service-settings" },
];

export default function ProviderProfilePreviewPage() {
  const { draft } = useProviderProfileDraft();
  const serviceLabels = getServiceLabels(draft.serviceIds);
  const experienceLabel = getExperienceLabel(draft.experienceLevel);
  const missingCount = onboardingTasks.filter((task) => !task.complete).length;
  const canSubmit = missingCount === 0;

  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)] pb-[calc(92px+env(safe-area-inset-bottom))]">
        <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
          <div className="flex h-12 items-center justify-between gap-2 px-4 min-[390px]:px-5">
            <button
              aria-label="Go back"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--primary)]"
              type="button"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="min-w-0 flex-1 truncate text-center text-headline-sm text-[var(--primary)]">
              Profile Preview
            </h1>
            <button
              aria-label="Help"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--primary)]"
              type="button"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          </div>
        </header>

        <section className="px-4 py-5 min-[390px]:px-5 min-[390px]:py-6">
          <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface-container)] text-[var(--primary)]">
                {canSubmit ? <BadgeCheck className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              </span>
              <div>
                <h2 className="text-label-lg text-[var(--on-surface)]">
                  Status: {canSubmit ? "Ready for review" : "Incomplete"}
                </h2>
                <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                  {canSubmit
                    ? "Submit your public profile for Setu review."
                    : "Complete the checklist below to go live and start receiving leads."}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-4 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]">
            <div className="flex items-start gap-3">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container)]">
                <User className="h-9 w-9 text-[var(--on-surface-variant)]" />
                <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--surface)]">
                  <ShieldCheck className="h-4 w-4 fill-current text-[var(--primary)]" />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <h3 className="truncate text-headline-sm text-[var(--on-surface)]">
                    Provider Name
                  </h3>
                  <ShieldCheck className="h-4 w-4 shrink-0 fill-current text-[var(--primary)]" />
                </div>
                <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                  {serviceLabels.join(" + ")} • {experienceLabel}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {draft.languages.map((language) => (
                    <span className="rounded bg-[var(--surface-container-low)] px-2 py-1 text-label-sm" key={language}>
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-4 text-body-md text-[var(--on-surface)]">
              {draft.bio}
            </p>
          </section>

          <section className="mt-5">
            <h3 className="px-1 text-label-lg text-[var(--on-surface)]">Trust Badges</h3>
            <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-1 pb-1">
              {trustBadges.map(({ icon: Icon, label, status }) => (
                <div
                  className={
                    status === "complete"
                      ? "flex min-w-20 shrink-0 flex-col items-center justify-center rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3 text-center"
                      : "flex min-w-20 shrink-0 flex-col items-center justify-center rounded-lg border border-dashed border-[var(--outline-variant)] bg-[var(--surface-container)] p-3 text-center opacity-75"
                  }
                  key={label}
                >
                  {status === "complete" ? <Icon className="h-5 w-5 text-[var(--primary)]" /> : <Lock className="h-5 w-5 text-[var(--secondary)]" />}
                  <span className="mt-2 text-label-sm text-[var(--on-surface)]">{label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5">
            <h3 className="px-1 text-label-lg text-[var(--on-surface)]">Onboarding Tasks</h3>
            <div className="mt-3 overflow-hidden rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]">
              {onboardingTasks.map(({ complete, detail, href, label }) => (
                <Link
                  className={
                    complete
                      ? "flex min-h-16 items-center gap-3 border-b border-[var(--surface-variant)] p-3 last:border-b-0"
                      : "flex min-h-16 items-center gap-3 border-b border-[var(--surface-variant)] bg-[var(--surface-container-low)] p-3 last:border-b-0"
                  }
                  href={href}
                  key={label}
                >
                  <span className="shrink-0 text-[var(--primary)]">
                    {complete ? <BadgeCheck className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-label-lg text-[var(--on-surface)]">{label}</span>
                    <span className="block text-body-sm text-[var(--on-surface-variant)]">{detail}</span>
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-[var(--secondary)]" />
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
            <h3 className="text-label-lg text-[var(--on-surface)]">Public Profile Preview</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {draft.serviceNames.map((service) => (
                <span className="rounded-full bg-[var(--surface-container)] px-3 py-1 text-label-md" key={service}>
                  {service}
                </span>
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-3">
              <div className="flex items-center gap-2 text-label-sm text-[var(--on-surface-variant)]">
                <Languages className="h-4 w-4" />
                <span>Local language preview</span>
              </div>
              <p className="mt-2 text-body-sm text-[var(--on-surface-variant)]">
                {draft.translatedBio}
              </p>
            </div>
          </section>

          <button className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[var(--primary)] bg-[var(--surface)] px-4 text-label-lg text-[var(--primary)]" type="button">
            <Eye className="h-5 w-5" />
            View Public Profile
          </button>
        </section>

        <footer className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-[var(--outline-variant)] bg-[var(--surface)] px-4 py-3">
          <div className="grid grid-cols-[1fr_1.35fr] gap-3">
            <button
              className="min-h-12 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-4 text-label-lg text-[var(--on-surface-variant)]"
              type="button"
            >
              Save Draft
            </button>
            {canSubmit ? (
              <button className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 text-label-lg text-[var(--on-primary)]" type="button">
                <Send className="h-5 w-5" />
                Submit for Review
              </button>
            ) : (
              <Link className="flex min-h-12 items-center justify-center rounded-md bg-[var(--primary)] px-4 text-label-lg text-[var(--on-primary)]" href="/provider/showcase">
                Fix Missing Items
              </Link>
            )}
          </div>
        </footer>
      </div>
    </main>
  );
}
