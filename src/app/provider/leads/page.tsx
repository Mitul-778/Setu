"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight, IndianRupee, MapPin } from "lucide-react";
import { loadProviderLeads, type ProviderLead } from "@/services/provider-leads-service";
import { SetuLoader } from "@/components/setu-loader";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export default function ProviderLeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<ProviderLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    loadProviderLeads()
      .then((data) => {
        if (cancelled) return;
        setLeads(data.leads);
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
            <h1 className="truncate text-center text-headline-sm text-[var(--primary)]">Leads</h1>
            <div className="h-11 w-11" />
          </div>
        </header>

        <section className="flex min-w-0 flex-col gap-3 px-4 py-4 min-[390px]:px-5">
          {isLoading ? (
            <SetuLoader label="Loading leads..." />
          ) : error ? (
            <p className="rounded-md border border-[var(--error)] bg-[var(--error-container)] px-3 py-2 text-body-sm text-[var(--on-error-container)]">
              {error}
            </p>
          ) : leads.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-6 text-center">
              <p className="text-body-md text-[var(--on-surface)]">No leads yet.</p>
              <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                New customer requests will appear here.
              </p>
            </div>
          ) : (
            leads.map((lead) => (
              <Link
                className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]"
                href={`/provider/lead-details?leadId=${lead.id}`}
                key={lead.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-label-lg text-[var(--on-surface)]">{lead.serviceTitle}</h2>
                    <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                      {lead.customerName}
                      {lead.whenLabel ? ` · ${lead.whenLabel}` : ""}
                    </p>
                  </div>
                  <span
                    className={
                      lead.urgent
                        ? "shrink-0 rounded-full bg-[var(--tertiary)] px-2.5 py-1 text-label-sm text-[var(--on-tertiary)]"
                        : "shrink-0 rounded-full bg-[var(--surface-container)] px-2.5 py-1 text-label-sm text-[var(--on-surface)]"
                    }
                  >
                    {lead.urgent ? "Urgent" : lead.statusLabel}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-body-sm text-[var(--on-surface-variant)]">
                  {lead.area ? (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {lead.area}
                    </span>
                  ) : null}
                  <span className="flex items-center gap-1">
                    <IndianRupee className="h-3.5 w-3.5" />
                    {lead.budgetLabel}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 border-t border-[var(--surface-variant)] pt-3">
                  <span className="text-label-md text-[var(--on-surface-variant)]">View lead details</span>
                  <ChevronRight className="h-4 w-4 text-[var(--secondary)]" />
                </div>
              </Link>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
