"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  type ProviderExperienceId,
  type ProviderServiceId,
} from "@/lib/provider-profile-draft";
import {
  loadProviderProfile,
  submitProviderProfile,
  type ProviderProfileResponse,
} from "@/services/provider-profile-service";
import { SetuLoader } from "@/components/setu-loader";

const trustBadgeIcons: Record<string, typeof ShieldCheck> = {
  id_verified: ShieldCheck,
  phone_verified: Phone,
  work_photos: Camera,
  certificates: FileText,
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function getStatusCopy(profile: ProviderProfileResponse) {
  switch (profile.onboardingStatus) {
    case "submitted":
      return {
        title: "Status: In review",
        body: "Your profile is with the Setu review team. We will notify you once it is approved.",
        ok: true,
      };
    case "needs_fix":
      return {
        title: "Status: Needs fixes",
        body: "Some items need attention before your profile can go live. Open the status page to fix them.",
        ok: false,
      };
    case "approved":
      return {
        title: "Status: Approved",
        body: "Your profile is live. Customers can now find and book you.",
        ok: true,
      };
    case "rejected":
      return {
        title: "Status: Not approved",
        body: "Your profile was not approved. Review the feedback and resubmit.",
        ok: false,
      };
    default:
      return profile.canSubmit
        ? {
            title: "Status: Ready for review",
            body: "Submit your public profile for Setu review.",
            ok: true,
          }
        : {
            title: "Status: Incomplete",
            body: "Complete the checklist below to go live and start receiving leads.",
            ok: false,
          };
  }
}

export default function ProviderProfilePreviewPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProviderProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    loadProviderProfile()
      .then((data) => {
        if (cancelled) return;
        setProfile(data);
        setError("");
      })
      .catch((loadError) => {
        if (cancelled) return;
        setError(getErrorMessage(loadError));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit() {
    if (!profile?.canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    try {
      const result = await submitProviderProfile();
      router.push(result.nextPath);
    } catch (submitError) {
      setError(getErrorMessage(submitError));
      setIsSubmitting(false);
    }
  }

  const serviceLabels = profile ? getServiceLabels(profile.serviceIds as ProviderServiceId[]) : [];
  const experienceLabel = profile
    ? getExperienceLabel(profile.experienceLevel as ProviderExperienceId)
    : "";
  const tasks = profile?.tasks ?? [];
  const trustBadges = profile?.trustBadges ?? [];
  const firstIncompleteTask = tasks.find((task) => !task.complete);
  const statusCopy = profile ? getStatusCopy(profile) : null;
  const isDraft = profile?.onboardingStatus === "draft";

  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)] pb-[calc(92px+env(safe-area-inset-bottom))]">
        <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
          <div className="flex h-12 items-center justify-between gap-2 px-4 min-[390px]:px-5">
            <button
              aria-label="Go back"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--primary)]"
              onClick={() => router.back()}
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
          {isLoading ? <SetuLoader label="Loading your profile..." /> : null}

          {error ? (
            <div className="mb-4 rounded-md border border-[var(--error)] bg-[var(--error-container)] px-3 py-2 text-body-sm text-[var(--on-error-container)]">
              {error}
            </div>
          ) : null}

          {profile && statusCopy ? (
            <>
              <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface-container)] text-[var(--primary)]">
                    {statusCopy.ok ? <BadgeCheck className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                  </span>
                  <div>
                    <h2 className="text-label-lg text-[var(--on-surface)]">{statusCopy.title}</h2>
                    <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">{statusCopy.body}</p>
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
                        {profile.displayName || "Your Name"}
                      </h3>
                      <ShieldCheck className="h-4 w-4 shrink-0 fill-current text-[var(--primary)]" />
                    </div>
                    <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                      {serviceLabels.join(" + ")} • {experienceLabel}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {profile.languages.map((language) => (
                        <span className="rounded bg-[var(--surface-container-low)] px-2 py-1 text-label-sm" key={language}>
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-body-md text-[var(--on-surface)]">{profile.bio}</p>
              </section>

              <section className="mt-5">
                <h3 className="px-1 text-label-lg text-[var(--on-surface)]">Trust Badges</h3>
                <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-1 pb-1">
                  {trustBadges.map((badge) => {
                    const Icon = trustBadgeIcons[badge.key] ?? ShieldCheck;
                    return (
                      <div
                        className={
                          badge.complete
                            ? "flex min-w-20 shrink-0 flex-col items-center justify-center rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3 text-center"
                            : "flex min-w-20 shrink-0 flex-col items-center justify-center rounded-lg border border-dashed border-[var(--outline-variant)] bg-[var(--surface-container)] p-3 text-center opacity-75"
                        }
                        key={badge.key}
                      >
                        {badge.complete ? (
                          <Icon className="h-5 w-5 text-[var(--primary)]" />
                        ) : (
                          <Lock className="h-5 w-5 text-[var(--secondary)]" />
                        )}
                        <span className="mt-2 text-label-sm text-[var(--on-surface)]">{badge.label}</span>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="mt-5">
                <h3 className="px-1 text-label-lg text-[var(--on-surface)]">Onboarding Tasks</h3>
                <div className="mt-3 overflow-hidden rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]">
                  {tasks.map((task) => (
                    <Link
                      className={
                        task.complete
                          ? "flex min-h-16 items-center gap-3 border-b border-[var(--surface-variant)] p-3 last:border-b-0"
                          : "flex min-h-16 items-center gap-3 border-b border-[var(--surface-variant)] bg-[var(--surface-container-low)] p-3 last:border-b-0"
                      }
                      href={task.href}
                      key={task.key}
                    >
                      <span className="shrink-0 text-[var(--primary)]">
                        {task.complete ? <BadgeCheck className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-label-lg text-[var(--on-surface)]">{task.label}</span>
                        <span className="block text-body-sm text-[var(--on-surface-variant)]">{task.detail}</span>
                      </span>
                      <ChevronRight className="h-5 w-5 shrink-0 text-[var(--secondary)]" />
                    </Link>
                  ))}
                </div>
              </section>

              <section className="mt-5 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
                <h3 className="text-label-lg text-[var(--on-surface)]">Public Profile Preview</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.serviceNames.map((service) => (
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
                  <p className="mt-2 text-body-sm text-[var(--on-surface-variant)]">{profile.translatedBio}</p>
                </div>
              </section>

              <button className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[var(--primary)] bg-[var(--surface)] px-4 text-label-lg text-[var(--primary)]" type="button">
                <Eye className="h-5 w-5" />
                View Public Profile
              </button>
            </>
          ) : null}
        </section>

        {profile ? (
          <footer className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-[var(--outline-variant)] bg-[var(--surface)] px-4 py-3">
            <div className="grid grid-cols-[1fr_1.35fr] gap-3">
              <button
                className="min-h-12 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-4 text-label-lg text-[var(--on-surface-variant)] disabled:opacity-60"
                disabled={isSubmitting}
                onClick={() => router.push("/provider/dashboard")}
                type="button"
              >
                Save Draft
              </button>
              {!isDraft ? (
                <Link
                  className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 text-label-lg text-[var(--on-primary)]"
                  href="/provider/verification-status"
                >
                  View Status
                </Link>
              ) : profile.canSubmit ? (
                <button
                  className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 text-label-lg text-[var(--on-primary)] disabled:opacity-60"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  type="button"
                >
                  <Send className="h-5 w-5" />
                  {isSubmitting ? "Submitting..." : "Submit for Review"}
                </button>
              ) : (
                <Link
                  className="flex min-h-12 items-center justify-center rounded-md bg-[var(--primary)] px-4 text-label-lg text-[var(--on-primary)]"
                  href={firstIncompleteTask?.href ?? "/provider/showcase"}
                >
                  Fix Missing Items
                </Link>
              )}
            </div>
          </footer>
        ) : null}
      </div>
    </main>
  );
}
