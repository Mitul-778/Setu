"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  HelpCircle,
  IndianRupee,
  MapPin,
  MessageSquare,
  MoreVertical,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
  XCircle,
} from "lucide-react";
import { loadProviderLead, submitLeadDecision, type ProviderLead } from "@/services/provider-leads-service";

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function LeadDetailsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const leadId = params.get("leadId") ?? "";

  const [lead, setLead] = useState<ProviderLead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [acting, setActing] = useState<"accept" | "decline" | "quote" | null>(null);
  const [actionError, setActionError] = useState("");

  async function decide(action: "accept" | "decline" | "quote") {
    if (acting) return;
    setActing(action);
    setActionError("");
    try {
      const result = await submitLeadDecision(leadId, action);
      router.push(result.nextPath);
    } catch (decideError) {
      setActionError(decideError instanceof Error ? decideError.message : "Could not update the lead.");
      setActing(null);
    }
  }

  useEffect(() => {
    if (!leadId) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setError("No lead selected.");
      setIsLoading(false);
      /* eslint-enable react-hooks/set-state-in-effect */
      return;
    }

    let cancelled = false;
    loadProviderLead(leadId)
      .then((data) => {
        if (cancelled) return;
        setLead(data.lead);
        setError("");
      })
      .catch((loadError) => {
        if (cancelled) return;
        setError(loadError instanceof Error ? loadError.message : "Could not load this lead.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [leadId]);

  const leadFacts = lead
    ? [
        { label: "Budget", value: lead.budgetLabel, detail: "Customer budget", icon: IndianRupee },
        {
          label: "Location",
          value: lead.area || "Not specified",
          detail: "Service area",
          icon: MapPin,
        },
        { label: "Requested", value: lead.whenLabel, detail: "When the request came in", icon: CalendarClock },
      ]
    : [];

  const fitReasons = lead
    ? [lead.serviceTitle, lead.area, lead.preferredLanguage].filter(Boolean).map((item) => String(item))
    : [];

  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)] pb-[calc(180px+env(safe-area-inset-bottom))]">
        <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
          <div className="flex h-14 items-center justify-between gap-2 px-4 min-[390px]:px-5">
            <button
              aria-label="Back"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--primary)]"
              onClick={() => router.push("/provider/leads")}
              type="button"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="min-w-0 flex-1 truncate text-center text-headline-sm text-[var(--primary)]">
              Lead Details
            </h1>
            <button
              aria-label="More options"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--on-surface-variant)]"
              type="button"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </header>

        {isLoading ? (
          <p className="px-4 py-6 text-body-sm text-[var(--on-surface-variant)] min-[390px]:px-5">Loading lead...</p>
        ) : error || !lead ? (
          <section className="flex flex-col items-center gap-3 px-4 py-16 text-center">
            <p className="text-headline-sm text-[var(--on-surface)]">{error || "Lead not found"}</p>
            <button
              className="mt-2 inline-flex min-h-10 items-center justify-center rounded-md bg-[var(--primary)] px-4 text-label-md text-[var(--on-primary)]"
              onClick={() => router.push("/provider/leads")}
              type="button"
            >
              Back to leads
            </button>
          </section>
        ) : (
          <>
            <section className="px-4 py-4 min-[390px]:px-5">
              <article className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--surface-container-high)] text-label-lg text-[var(--on-surface)]">
                      {initialsOf(lead.customerName)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex min-w-0 items-center gap-2">
                        <h2 className="truncate text-headline-sm text-[var(--on-surface)]">{lead.customerName}</h2>
                        <ShieldCheck className="h-4 w-4 shrink-0 text-[var(--primary)]" fill="currentColor" />
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-label-md text-[var(--on-surface-variant)]">
                        <span className="rounded-full bg-[var(--surface-container)] px-2 py-0.5 text-label-sm text-[var(--on-surface)]">
                          {lead.urgent ? "Urgent" : lead.statusLabel}
                        </span>
                        <span>{lead.whenLabel}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    aria-label="Message customer"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--outline-variant)] text-[var(--primary)] disabled:opacity-50"
                    disabled={acting !== null}
                    onClick={() => decide("quote")}
                    type="button"
                  >
                    <MessageSquare className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-4 rounded-md bg-[var(--surface-container-low)] p-3">
                  <p className="text-label-md text-[var(--on-surface-variant)]">Requirement summary</p>
                  <h3 className="mt-1 text-headline-sm text-[var(--on-surface)]">{lead.serviceTitle}</h3>
                  {lead.note ? (
                    <p className="mt-2 text-body-md text-[var(--on-surface-variant)]">{lead.note}</p>
                  ) : null}
                </div>
              </article>

              {fitReasons.length ? (
                <article className="mt-4 overflow-hidden rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-low)]">
                  <div className="flex gap-3 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--primary)] text-[var(--on-primary)]">
                      <Sparkles className="h-5 w-5" fill="currentColor" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-label-lg text-[var(--on-surface)]">Why this could be a fit</p>
                      <p className="mt-1 text-body-md text-[var(--on-surface-variant)]">
                        This request matches your services{lead.area ? ` near ${lead.area}` : ""}.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 overflow-x-auto border-t border-[var(--outline-variant)] px-4 py-3 no-scrollbar">
                    {fitReasons.map((reason) => (
                      <span
                        className="shrink-0 rounded-full bg-[var(--surface-container-lowest)] px-3 py-1 text-label-sm text-[var(--on-surface)]"
                        key={reason}
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </article>
              ) : null}

              <section className="mt-4 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
                <h3 className="text-label-lg text-[var(--on-surface)]">Lead details</h3>
                <div className="mt-3 flex flex-col divide-y divide-[var(--surface-variant)]">
                  {leadFacts.map(({ detail, icon: Icon, label, value }) => (
                    <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0" key={label}>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--surface-container-low)] text-[var(--primary)]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-label-sm uppercase text-[var(--on-surface-variant)]">{label}</p>
                        <p className="mt-0.5 text-label-lg text-[var(--on-surface)]">{value}</p>
                        <p className="mt-0.5 text-body-sm text-[var(--on-surface-variant)]">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {lead.note ? (
                <section className="mt-4 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
                  <div className="flex items-start gap-3">
                    <UserRound className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]" />
                    <div>
                      <h3 className="text-label-lg text-[var(--on-surface)]">Customer note</h3>
                      <p className="mt-1 text-body-md text-[var(--on-surface-variant)]">{lead.note}</p>
                    </div>
                  </div>
                </section>
              ) : null}
            </section>

            <section className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4 pb-[calc(16px+env(safe-area-inset-bottom))] shadow-[0_-4px_12px_rgb(0_0_0_/_0.05)]">
              {actionError ? (
                <p className="mb-2 rounded-md border border-[var(--error)] bg-[var(--error-container)] px-3 py-2 text-body-sm text-[var(--on-error-container)]">
                  {actionError}
                </p>
              ) : null}
              <div className="grid grid-cols-2 gap-2">
                <button
                  className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-3 text-label-lg text-[var(--on-primary)] disabled:opacity-60"
                  disabled={acting !== null}
                  onClick={() => decide("accept")}
                  type="button"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  {acting === "accept" ? "Accepting..." : "Accept"}
                </button>
                <button
                  className="flex min-h-12 items-center justify-center gap-2 rounded-md border border-[var(--outline)] bg-[var(--surface-container-lowest)] px-3 text-label-lg text-[var(--on-surface)] disabled:opacity-60"
                  disabled={acting !== null}
                  onClick={() => decide("quote")}
                  type="button"
                >
                  <Send className="h-5 w-5" />
                  {acting === "quote" ? "Opening..." : "Custom Quote"}
                </button>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  className="flex min-h-11 items-center justify-center gap-2 rounded-md text-label-md text-[var(--on-surface-variant)] disabled:opacity-60"
                  disabled={acting !== null}
                  onClick={() => decide("decline")}
                  type="button"
                >
                  <XCircle className="h-4 w-4" />
                  {acting === "decline" ? "Declining..." : "Decline"}
                </button>
                <button
                  className="flex min-h-11 items-center justify-center gap-2 rounded-md text-label-md text-[var(--on-surface-variant)] disabled:opacity-60"
                  disabled={acting !== null}
                  onClick={() => decide("quote")}
                  type="button"
                >
                  <HelpCircle className="h-4 w-4" />
                  Ask Question
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default function ProviderLeadDetailsPage() {
  return (
    <Suspense fallback={null}>
      <LeadDetailsContent />
    </Suspense>
  );
}
