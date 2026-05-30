"use client";

import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  Camera,
  Check,
  CircleHelp,
  Clock,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  Upload,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FileUploadPreview } from "@/components/file-upload-preview";
import {
  loadVerificationStatus,
  resubmitVerification,
  type VerificationStatusResponse,
} from "@/services/provider-verification-service";

type TimelineStep = {
  title: string;
  body: string;
  state: "done" | "current" | "upcoming";
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function iconForDocType(type: string) {
  if (type.includes("photo") || type.includes("selfie") || type.includes("front") || type.includes("back")) {
    return Camera;
  }
  return Upload;
}

function getHeaderCopy(status: VerificationStatusResponse["status"]) {
  switch (status) {
    case "needs_fix":
    case "rejected":
      return {
        icon: AlertCircle,
        title: "Action Needed",
        body: "We found a few items that need fixing. Complete the exact fixes below and resubmit to continue.",
      };
    case "approved":
      return {
        icon: BadgeCheck,
        title: "Approved",
        body: "Your profile is verified and live. You can start accepting jobs.",
      };
    case "draft":
      return {
        icon: Clock,
        title: "Not Submitted",
        body: "Your profile has not been submitted for review yet.",
      };
    default:
      return {
        icon: Clock,
        title: "Pending Review",
        body: "We are verifying your details. Reviews usually take 24-48 hours after submission.",
      };
  }
}

function buildTimeline(status: VerificationStatusResponse["status"]): TimelineStep[] {
  const submitted = status !== "draft";
  const approved = status === "approved";

  return [
    {
      title: "Documents Submitted",
      body: "We have received your application.",
      state: submitted ? "done" : "current",
    },
    {
      title: "Verification Review",
      body: approved
        ? "Your documents have been verified."
        : status === "needs_fix"
          ? "We need a few fixes before approval."
          : "Our team is reviewing your documents.",
      state: approved ? "done" : submitted ? "current" : "upcoming",
    },
    {
      title: "Start Earning",
      body: approved
        ? "Your profile is live — start accepting jobs now."
        : "Once approved, you can start accepting jobs.",
      state: approved ? "done" : "upcoming",
    },
  ];
}

export default function ProviderVerificationStatusPage() {
  const router = useRouter();
  const [status, setStatus] = useState<VerificationStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [filesByDocId, setFilesByDocId] = useState<Record<string, File>>({});

  useEffect(() => {
    let cancelled = false;

    loadVerificationStatus()
      .then((data) => {
        if (cancelled) return;
        setStatus(data);
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

  const pendingActions = useMemo(() => status?.pendingActions ?? [], [status]);
  const remaining = useMemo(
    () => pendingActions.filter((action) => !filesByDocId[action.id]).length,
    [pendingActions, filesByDocId],
  );
  const canResubmit = pendingActions.length > 0 && remaining === 0;
  const headerCopy = status ? getHeaderCopy(status.status) : null;
  const timeline = status ? buildTimeline(status.status) : [];
  const HeaderIcon = headerCopy?.icon ?? Clock;

  async function handleResubmit() {
    if (!canResubmit || isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    try {
      const updated = await resubmitVerification(filesByDocId);
      setStatus(updated);
      setFilesByDocId({});

      if (updated.pendingActions.length === 0) {
        router.push("/provider/dashboard");
      }
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto flex min-h-dvh w-full min-w-0 max-w-[480px] flex-col overflow-x-hidden bg-[var(--surface)] pb-[calc(156px+env(safe-area-inset-bottom))]">
        <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
          <div className="flex h-12 items-center justify-between gap-2 px-4 min-[390px]:px-5">
            <button
              aria-label="Go back"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--on-surface)]"
              onClick={() => router.back()}
              type="button"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="min-w-0 flex-1 truncate text-center text-headline-sm text-[var(--primary)]">
              Verification Status
            </h1>
            <button
              aria-label="Help"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--on-surface-variant)]"
              type="button"
            >
              <CircleHelp className="h-5 w-5" />
            </button>
          </div>
        </header>

        <section className="flex flex-col gap-6 px-4 py-5 min-[390px]:px-5 min-[390px]:py-6">
          {isLoading ? (
            <div className="rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-3 py-2 text-body-sm text-[var(--on-surface-variant)]">
              Loading verification status...
            </div>
          ) : null}

          {error ? (
            <div className="rounded-md border border-[var(--error)] bg-[var(--error-container)] px-3 py-2 text-body-sm text-[var(--on-error-container)]">
              {error}
            </div>
          ) : null}

          {status && headerCopy ? (
            <>
              <div className="flex flex-col items-center rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-6 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]">
                  <HeaderIcon className="h-7 w-7" />
                </span>
                <h2 className="mt-3 text-headline-md text-[var(--on-surface)]">{headerCopy.title}</h2>
                <p className="mt-1.5 max-w-[20rem] text-body-sm text-[var(--on-surface-variant)]">{headerCopy.body}</p>
                {status.status === "submitted" || status.status === "needs_fix" ? (
                  <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--secondary-container)] px-3 py-1 text-label-sm text-[var(--on-secondary-container)]">
                    <Clock className="h-3.5 w-3.5" />
                    Expected review time: {status.expectedReviewHours} hours
                  </span>
                ) : status.status === "approved" ? (
                  <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)] px-3 py-1 text-label-sm text-[var(--on-primary)]">
                    <Check className="h-3.5 w-3.5" />
                    Verified profile
                  </span>
                ) : null}
              </div>

              {pendingActions.length > 0 ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-label-lg uppercase tracking-wider text-[var(--on-surface)]">
                      Missing Documents &amp; Fixes
                    </h3>
                    <span className="text-label-md text-[var(--on-surface-variant)]">
                      {remaining} of {pendingActions.length} pending
                    </span>
                  </div>

                  {pendingActions.map((action) => {
                    const isResolved = Boolean(filesByDocId[action.id]);
                    const Icon = iconForDocType(action.type);

                    return (
                      <div
                        className="flex items-start gap-3 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4"
                        key={action.id}
                      >
                        <span
                          className={
                            isResolved
                              ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--on-primary)]"
                              : "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--error-container)] text-[var(--on-error-container)]"
                          }
                        >
                          {isResolved ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                        </span>

                        <div className="min-w-0 flex-1">
                          <h4 className="text-label-lg text-[var(--on-surface)]">{action.title}</h4>
                          <p className="mt-0.5 text-body-sm text-[var(--on-surface-variant)]">
                            {isResolved ? "New file ready. Resubmit to send for review." : action.fix}
                          </p>
                          <FileUploadPreview
                            accept="image/*"
                            className="mt-3 flex flex-col gap-3"
                            emptyClassName="inline-flex min-h-9 w-fit cursor-pointer items-center gap-2 rounded-md border border-[var(--primary)] px-3 text-label-md text-[var(--primary)]"
                            icon={Icon}
                            label="Upload File"
                            onFilesChange={(files) =>
                              setFilesByDocId((current) => {
                                const next = { ...current };
                                if (files.length > 0) {
                                  next[action.id] = files[0];
                                } else {
                                  delete next[action.id];
                                }
                                return next;
                              })
                            }
                            previewClassName="grid grid-cols-2 gap-2"
                            previewItemClassName="relative min-h-24 overflow-hidden rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              <div className="flex flex-col gap-3">
                <h3 className="text-label-lg uppercase tracking-wider text-[var(--on-surface)]">What to Expect</h3>
                <ol className="flex flex-col">
                  {timeline.map((step, index) => {
                    const isLast = index === timeline.length - 1;

                    return (
                      <li className="relative flex gap-3 pb-5 last:pb-0" key={step.title}>
                        {!isLast ? (
                          <span
                            aria-hidden
                            className={
                              step.state === "done"
                                ? "absolute left-[11px] top-6 h-[calc(100%-1.25rem)] w-px bg-[var(--primary)]"
                                : "absolute left-[11px] top-6 h-[calc(100%-1.25rem)] w-px bg-[var(--outline-variant)]"
                            }
                          />
                        ) : null}

                        <span
                          className={
                            step.state === "done"
                              ? "z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--on-primary)]"
                              : step.state === "current"
                                ? "z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[var(--primary)] bg-[var(--surface)]"
                                : "z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[var(--outline-variant)] bg-[var(--surface)]"
                          }
                        >
                          {step.state === "done" ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : step.state === "current" ? (
                            <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                          ) : null}
                        </span>

                        <div className="-mt-0.5 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4
                              className={
                                step.state === "upcoming"
                                  ? "text-label-lg text-[var(--on-surface-variant)]"
                                  : "text-label-lg text-[var(--on-surface)]"
                              }
                            >
                              {step.title}
                            </h4>
                            {step.state === "current" ? (
                              <span className="rounded-full bg-[var(--secondary-container)] px-2 py-0.5 text-label-sm text-[var(--on-secondary-container)]">
                                Current
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-0.5 text-body-sm text-[var(--on-surface-variant)]">{step.body}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </>
          ) : null}
        </section>

        <footer className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]">
          {pendingActions.length > 0 ? (
            <div className="border-b border-[var(--surface-variant)] px-4 py-2">
              <button
                className={
                  canResubmit && !isSubmitting
                    ? "mx-auto flex min-h-10 w-full max-w-[18rem] items-center justify-center rounded-md bg-[var(--primary)] px-4 text-label-md text-[var(--on-primary)]"
                    : "mx-auto flex min-h-10 w-full max-w-[18rem] cursor-not-allowed items-center justify-center rounded-md bg-[var(--surface-container-highest)] px-4 text-label-md text-[var(--on-surface-variant)] opacity-60"
                }
                disabled={!canResubmit || isSubmitting}
                onClick={handleResubmit}
                type="button"
              >
                {isSubmitting ? "Resubmitting..." : "Resubmit for Review"}
              </button>
            </div>
          ) : null}
          <ProviderBottomNav onNavigate={(href) => router.push(href)} />
        </footer>
      </div>
    </main>
  );
}

function ProviderBottomNav({ onNavigate }: { onNavigate: (href: string) => void }) {
  const items = [
    { label: "Dashboard", href: "/provider/dashboard", icon: LayoutDashboard },
    { label: "Leads", href: "/provider/lead-details", icon: ListChecks },
    { label: "Messages", href: "/provider/dashboard", icon: MessageSquare },
    { label: "Profile", href: "/provider/profile-preview", icon: User },
  ];

  return (
    <nav aria-label="Provider navigation">
      <div className="grid h-20 grid-cols-4 px-2 pb-[env(safe-area-inset-bottom)] text-[var(--on-surface-variant)]">
        {items.map(({ href, icon: Icon, label }) => (
          <button
            className="flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 text-label-sm"
            key={label}
            onClick={() => onNavigate(href)}
            type="button"
          >
            <span className="flex h-8 w-12 items-center justify-center rounded-full">
              <Icon className="h-5 w-5" />
            </span>
            <span className="max-w-full truncate">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
