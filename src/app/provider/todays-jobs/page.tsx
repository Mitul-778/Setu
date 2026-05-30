"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, Clock, MapPin, ShieldCheck } from "lucide-react";
import {
  completeJob,
  loadProviderJobs,
  startJob,
  toggleJobChecklist,
  type ProviderJob,
} from "@/services/provider-jobs-service";
import { SetuLoader } from "@/components/setu-loader";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export default function ProviderTodaysJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<ProviderJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let cancelled = false;
    loadProviderJobs()
      .then((data) => {
        if (cancelled) return;
        setJobs(data.jobs);
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

  function replaceJob(updated: ProviderJob) {
    setJobs((current) => current.map((job) => (job.id === updated.id ? updated : job)));
  }

  async function handleStart(job: ProviderJob) {
    if (busyId) return;
    setBusyId(job.id);
    setActionError("");
    try {
      const result = await startJob(job.id, otpInputs[job.id] ?? "");
      replaceJob(result.job);
      setOtpInputs((current) => ({ ...current, [job.id]: "" }));
    } catch (startError) {
      setActionError(getErrorMessage(startError));
    } finally {
      setBusyId(null);
    }
  }

  async function handleToggle(job: ProviderJob, key: string, done: boolean) {
    if (busyId) return;
    setBusyId(job.id);
    setActionError("");
    try {
      const result = await toggleJobChecklist(job.id, key, done);
      replaceJob(result.job);
    } catch (toggleError) {
      setActionError(getErrorMessage(toggleError));
    } finally {
      setBusyId(null);
    }
  }

  async function handleComplete(job: ProviderJob) {
    if (busyId) return;
    setBusyId(job.id);
    setActionError("");
    try {
      await completeJob(job.id);
      setJobs((current) => current.filter((item) => item.id !== job.id));
    } catch (completeError) {
      setActionError(getErrorMessage(completeError));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)] pb-[calc(24px+env(safe-area-inset-bottom))]">
        <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
          <div className="grid h-14 grid-cols-[2.75rem_1fr_2.75rem] items-center px-3 min-[390px]:px-4">
            <button
              aria-label="Back to dashboard"
              className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--primary)]"
              onClick={() => router.push("/provider/dashboard")}
              type="button"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="truncate text-center text-headline-sm text-[var(--primary)]">Today&apos;s Jobs</h1>
            <div className="h-11 w-11" />
          </div>
        </header>

        <section className="flex min-w-0 flex-col gap-4 px-4 py-4 min-[390px]:px-5">
          {actionError ? (
            <p className="rounded-md border border-[var(--error)] bg-[var(--error-container)] px-3 py-2 text-body-sm text-[var(--on-error-container)]">
              {actionError}
            </p>
          ) : null}

          {isLoading ? (
            <SetuLoader label="Loading jobs..." />
          ) : error ? (
            <p className="rounded-md border border-[var(--error)] bg-[var(--error-container)] px-3 py-2 text-body-sm text-[var(--on-error-container)]">
              {error}
            </p>
          ) : jobs.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-6 text-center">
              <p className="text-body-md text-[var(--on-surface)]">No active jobs.</p>
              <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                Accepted bookings show up here to start and complete.
              </p>
            </div>
          ) : (
            jobs.map((job) => {
              const busy = busyId === job.id;
              const doneCount = job.checklist.filter((item) => item.done).length;

              return (
                <article
                  className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]"
                  key={job.id}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate text-headline-sm text-[var(--on-surface)]">{job.serviceTitle}</h2>
                      <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">{job.customerName}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[var(--surface-container)] px-2.5 py-1 text-label-sm">
                      {job.statusLabel}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-body-sm text-[var(--on-surface-variant)]">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {job.whenLabel}
                    </span>
                    {job.address ? (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.address}
                      </span>
                    ) : null}
                  </div>

                  {job.status === "accepted" ? (
                    <div className="mt-4 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-3">
                      <p className="flex items-center gap-1.5 text-label-md text-[var(--on-surface)]">
                        <ShieldCheck className="h-4 w-4" />
                        Start service
                      </p>
                      <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                        Ask the customer for their booking OTP and enter it to begin.
                      </p>
                      <div className="mt-3 flex gap-2">
                        <input
                          className="min-h-11 w-28 rounded-md border border-[var(--outline)] bg-[var(--surface-container-lowest)] px-3 text-center text-headline-sm tracking-[0.3em] outline-none focus:border-[var(--primary)]"
                          inputMode="numeric"
                          maxLength={4}
                          onChange={(event) =>
                            setOtpInputs((current) => ({
                              ...current,
                              [job.id]: event.target.value.replace(/\D/g, ""),
                            }))
                          }
                          placeholder="OTP"
                          value={otpInputs[job.id] ?? ""}
                        />
                        <button
                          className="flex min-h-11 flex-1 items-center justify-center rounded-md bg-[var(--primary)] px-4 text-label-md text-[var(--on-primary)] disabled:opacity-60"
                          disabled={busy || (otpInputs[job.id] ?? "").length < 4}
                          onClick={() => handleStart(job)}
                          type="button"
                        >
                          {busy ? "Verifying..." : "Verify & Start"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <p className="text-label-md text-[var(--on-surface)]">Service checklist</p>
                        <span className="text-label-sm text-[var(--on-surface-variant)]">
                          {doneCount}/{job.checklist.length} done
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {job.checklist.map((item) => (
                          <label
                            className="flex items-center gap-3 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-3 py-2 text-body-md"
                            key={item.key}
                          >
                            <input
                              checked={item.done}
                              className="h-4 w-4 rounded accent-[var(--primary)]"
                              disabled={busy}
                              onChange={(event) => handleToggle(job, item.key, event.target.checked)}
                              type="checkbox"
                            />
                            <span className={item.done ? "text-[var(--on-surface-variant)] line-through" : ""}>
                              {item.label}
                            </span>
                          </label>
                        ))}
                      </div>
                      <button
                        className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 text-label-md text-[var(--on-primary)] disabled:opacity-60"
                        disabled={busy}
                        onClick={() => handleComplete(job)}
                        type="button"
                      >
                        <Check className="h-4 w-4" />
                        {busy ? "Saving..." : "Mark service complete"}
                      </button>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
