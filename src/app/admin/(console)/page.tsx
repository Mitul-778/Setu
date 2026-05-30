"use client";

import { useCallback, useEffect, useState } from "react";
import { OpsIcon } from "@/components/ops-icon";
import {
  loadAdminProvider,
  loadAdminProviders,
  submitAdminDecision,
  type AdminProviderDetailResponse,
  type AdminProviderRow,
  type AdminProviderStatus,
  type AdminQueueFilter,
} from "@/services/admin-service";

const PAGE_SIZE = 8;

const filterOptions: { key: AdminQueueFilter; label: string }[] = [
  { key: "queue", label: "Review Queue" },
  { key: "submitted", label: "Submitted" },
  { key: "needs_fix", label: "Needs Fix" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "all", label: "All Applicants" },
];

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function shortId(id: string) {
  return `APP-${id.slice(-6).toUpperCase()}`;
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function formatShortDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

function docStatusChip(status: string): { label: string; className: string; icon: string } {
  switch (status) {
    case "approved":
      return {
        label: "Approved",
        className: "border border-[var(--outline-variant)] bg-[var(--surface-container)] text-[var(--on-surface)]",
        icon: "check_circle",
      };
    case "needs_fix":
      return { label: "Flagged", className: "bg-[var(--tertiary)] text-[var(--on-tertiary)]", icon: "flag" };
    case "rejected":
      return { label: "Rejected", className: "bg-[var(--danger)] text-[var(--on-error)]", icon: "block" };
    default:
      return {
        label: "Pending",
        className: "border border-dashed border-[var(--outline)] bg-[var(--surface-container)] text-[var(--on-surface-variant)]",
        icon: "schedule",
      };
  }
}

function statusBadge(status: AdminProviderStatus): { label: string; className: string } {
  switch (status) {
    case "submitted":
      return {
        label: "Pending Review",
        className: "border border-dashed border-[var(--outline)] bg-[var(--surface-container)] text-[var(--on-surface)]",
      };
    case "approved":
      return {
        label: "Verified",
        className: "border border-[var(--outline-variant)] bg-[var(--surface-container-low)] text-[var(--on-surface)]",
      };
    case "needs_fix":
      return { label: "Flagged", className: "bg-[var(--tertiary)] text-[var(--on-tertiary)]" };
    case "rejected":
      return { label: "Rejected", className: "bg-[var(--danger)] text-[var(--on-error)]" };
    default:
      return {
        label: "Draft",
        className: "border border-dashed border-[var(--outline-variant)] bg-[var(--surface-container)] text-[var(--on-surface-variant)]",
      };
  }
}

export default function AdminApplicantsPage() {
  const [providers, setProviders] = useState<AdminProviderRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<AdminQueueFilter>("queue");
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdminProviderDetailResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [docIndex, setDocIndex] = useState(0);
  const [notes, setNotes] = useState("");
  const [activeAction, setActiveAction] = useState<"approve" | "reject" | null>(null);
  const [actionError, setActionError] = useState("");
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" } | null>(null);

  const loadList = useCallback(
    async (autoSelect: boolean) => {
      const data = await loadAdminProviders(filter);
      setProviders(data.providers);
      if (autoSelect) {
        setSelectedId((current) => current ?? data.providers[0]?.id ?? null);
      }
      return data.providers;
    },
    [filter],
  );

  useEffect(() => {
    let cancelled = false;
    // Reset list UI whenever the status filter changes.
    /* eslint-disable react-hooks/set-state-in-effect */
    setIsLoading(true);
    setPage(1);
    /* eslint-enable react-hooks/set-state-in-effect */

    loadAdminProviders(filter)
      .then((data) => {
        if (cancelled) return;
        setProviders(data.providers);
        setSelectedId(data.providers[0]?.id ?? null);
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
  }, [filter]);

  useEffect(() => {
    if (!selectedId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDetail(null);
      return;
    }

    let cancelled = false;
    // Reset drawer state when a different applicant is selected.
    setDetailLoading(true);
    setDocIndex(0);
    setNotes("");
    setActionError("");

    loadAdminProvider(selectedId)
      .then((data) => {
        if (cancelled) return;
        setDetail(data);
      })
      .catch(() => {
        if (cancelled) return;
        setDetail(null);
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const totalPages = Math.max(1, Math.ceil(providers.length / PAGE_SIZE));
  const pageProviders = providers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const rangeStart = providers.length ? (page - 1) * PAGE_SIZE + 1 : 0;
  const rangeEnd = Math.min(page * PAGE_SIZE, providers.length);

  const documents = detail?.documents ?? [];
  const currentDoc = documents[docIndex];
  const docChip = currentDoc ? docStatusChip(currentDoc.status) : null;
  const approvedDocCount = documents.filter((doc) => doc.status === "approved").length;

  async function refreshAfterDecision() {
    const list = await loadList(false);
    if (!list.some((row) => row.id === selectedId)) {
      setSelectedId(list[0]?.id ?? null);
    } else if (selectedId) {
      const data = await loadAdminProvider(selectedId);
      setDetail(data);
    }
  }

  async function runDecision(action: "approve" | "reject") {
    if (!selectedId || !currentDoc || activeAction) return;
    if (action === "reject" && !notes.trim()) {
      setActionError("Add a note describing the required fix before rejecting.");
      return;
    }

    setActiveAction(action);
    setActionError("");
    try {
      const result = await submitAdminDecision(
        selectedId,
        action === "approve"
          ? { action: "approve_document", documentId: currentDoc.id, notes: notes.trim() || undefined }
          : { action: "reject_document", documentId: currentDoc.id, notes: notes.trim() },
      );
      setNotes("");
      await refreshAfterDecision();
      setDocIndex((index) => Math.min(index + 1, Math.max(0, documents.length - 1)));
      setToast({
        tone: "success",
        message:
          action === "approve"
            ? result.status === "approved"
              ? "Application approved — moved to Approved."
              : "Document approved."
            : "Fix requested — applicant moved to Flagged.",
      });
    } catch (decisionError) {
      setActionError(getErrorMessage(decisionError));
    } finally {
      setActiveAction(null);
    }
  }

  const provider = detail?.provider;
  const [firstName, ...restName] = (provider?.displayName ?? "").split(" ");

  return (
    <div className="flex h-full w-full min-w-0">
      {/* Left data area */}
      <div className="flex min-w-0 flex-1 flex-col pr-6">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <h2 className="mb-1 text-2xl font-semibold tracking-tight text-[var(--primary)]">Applicants</h2>
            <p className="text-sm text-[var(--on-surface-variant)]">
              {providers.length.toLocaleString("en-US")} Total Applicants
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                className="flex items-center gap-2 rounded border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-4 py-2 text-xs font-medium text-[var(--on-surface)] transition-colors hover:bg-[var(--surface-container-low)]"
                onClick={() => setFilterOpen((open) => !open)}
                type="button"
              >
                <OpsIcon className="text-[16px]" name="filter_list" />
                {filterOptions.find((option) => option.key === filter)?.label ?? "Filter by Status"}
              </button>
              {filterOpen ? (
                <div className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] shadow-[0_8px_30px_rgb(0_0_0_/_0.12)]">
                  {filterOptions.map((option) => (
                    <button
                      className={
                        option.key === filter
                          ? "block w-full px-3 py-2 text-left text-xs font-medium text-[var(--primary)] bg-[var(--surface-container-high)]"
                          : "block w-full px-3 py-2 text-left text-xs text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)]"
                      }
                      key={option.key}
                      onClick={() => {
                        setFilter(option.key);
                        setFilterOpen(false);
                      }}
                      type="button"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <button
              className="flex items-center gap-2 rounded border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-4 py-2 text-xs font-medium text-[var(--on-surface)] transition-colors hover:bg-[var(--surface-container-low)]"
              type="button"
            >
              <OpsIcon className="text-[16px]" name="date_range" />
              Date Range
            </button>
            <button
              className="ml-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-xs font-medium text-[var(--on-primary)] transition-colors hover:bg-[var(--primary-container)]"
              type="button"
            >
              Export Data
            </button>
          </div>
        </div>

        {/* Data table card */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]">
          <div className="min-h-0 flex-1 overflow-auto">
            {isLoading ? (
              <p className="p-6 text-sm text-[var(--on-surface-variant)]">Loading applicants...</p>
            ) : error ? (
              <p className="m-4 rounded-md border border-[var(--error)] bg-[var(--error-container)] p-3 text-sm text-[var(--on-error-container)]">
                {error}
              </p>
            ) : providers.length === 0 ? (
              <p className="p-6 text-sm text-[var(--on-surface-variant)]">No applicants in this view.</p>
            ) : (
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--outline-variant)] bg-[var(--surface-container-low)]">
                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--on-surface-variant)]">Applicant</th>
                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--on-surface-variant)]">Status</th>
                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--on-surface-variant)]">Documents</th>
                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--on-surface-variant)]">Date Submitted</th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[var(--on-surface-variant)]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--outline-variant)] text-xs">
                  {pageProviders.map((row) => {
                    const badge = statusBadge(row.status);
                    const isSelected = row.id === selectedId;
                    return (
                      <tr
                        className={
                          isSelected
                            ? "group cursor-pointer border-l-2 border-l-[var(--primary)] bg-[var(--surface-container-highest)]"
                            : "group cursor-pointer transition-colors hover:bg-[var(--surface-container-low)]"
                        }
                        key={row.id}
                        onClick={() => setSelectedId(row.id)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-[var(--outline-variant)] bg-[var(--surface-variant)]">
                              <OpsIcon className="text-[16px] text-[var(--on-surface-variant)]" name="person" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-medium text-[var(--on-surface)] group-hover:text-[var(--primary)]">
                                {row.displayName}
                              </span>
                              <span className="text-[11px] text-[var(--on-surface-variant)]">{shortId(row.id)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-sm px-2 py-1 text-[11px] font-semibold ${badge.className}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[var(--on-surface-variant)]">
                          {row.approvedDocs}/{row.totalDocs} approved
                        </td>
                        <td className="px-4 py-3 text-[var(--on-surface-variant)]">{formatDate(row.submittedAt)}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            className="rounded-sm p-1 text-[var(--on-surface-variant)] transition-colors hover:bg-[var(--surface-container-high)] hover:text-[var(--primary)]"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedId(row.id);
                            }}
                            type="button"
                          >
                            <OpsIcon className="text-[18px]" name="more_vert" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
            <span className="text-xs text-[var(--on-surface-variant)]">
              Showing {rangeStart} to {rangeEnd} of {providers.length.toLocaleString("en-US")} results
            </span>
            <div className="flex gap-2">
              <button
                className="rounded-sm border border-[var(--outline-variant)] px-3 py-1 text-[11px] font-semibold text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-low)] disabled:opacity-50"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                type="button"
              >
                Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 3) }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  className={
                    pageNumber === page
                      ? "rounded-sm bg-[var(--primary)] px-3 py-1 text-[11px] font-semibold text-[var(--on-primary)]"
                      : "rounded-sm border border-[var(--outline-variant)] px-3 py-1 text-[11px] font-semibold text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-low)]"
                  }
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  type="button"
                >
                  {pageNumber}
                </button>
              ))}
              <button
                className="rounded-sm border border-[var(--outline-variant)] px-3 py-1 text-[11px] font-semibold text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-low)] disabled:opacity-50"
                disabled={page >= totalPages}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                type="button"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right drawer */}
      {selectedId ? (
        <aside className="ml-6 flex h-full w-[380px] shrink-0 flex-col overflow-hidden rounded border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] shadow-sm">
          <div className="flex items-center justify-between border-b border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-4">
            <h3 className="text-base font-semibold text-[var(--on-surface)]">Review Application</h3>
            <button
              aria-label="Close"
              className="text-[var(--on-surface-variant)] hover:text-[var(--primary)]"
              onClick={() => setSelectedId(null)}
              type="button"
            >
              <OpsIcon className="text-[20px]" name="close" />
            </button>
          </div>

          {detailLoading ? (
            <p className="p-6 text-sm text-[var(--on-surface-variant)]">Loading application...</p>
          ) : provider ? (
            <>
              <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-[var(--outline-variant)] bg-[var(--surface-variant)]">
                    <OpsIcon className="text-[24px] text-[var(--on-surface-variant)]" name="person" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-[var(--primary)]">{provider.displayName}</h4>
                    <p className="text-xs text-[var(--on-surface-variant)]">
                      {shortId(provider.id)} • Submitted {formatShortDate(provider.submittedAt)}
                    </p>
                  </div>
                </div>

                <div className="border-t border-[var(--outline-variant)]" />

                {currentDoc ? (
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <h5 className="text-xs font-medium text-[var(--on-surface)]">{currentDoc.label}</h5>
                      <div className="flex items-center gap-1">
                        <button
                          aria-label="Previous document"
                          className="flex h-6 w-6 items-center justify-center rounded-sm text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-high)] disabled:opacity-40"
                          disabled={docIndex <= 0}
                          onClick={() => setDocIndex((index) => Math.max(0, index - 1))}
                          type="button"
                        >
                          <OpsIcon className="text-[16px]" name="chevron_left" />
                        </button>
                        <span className="rounded-sm border border-[var(--outline-variant)] bg-[var(--surface-container-highest)] px-2 py-0.5 text-[11px] font-semibold text-[var(--on-surface)]">
                          Doc {docIndex + 1} of {documents.length}
                        </span>
                        <button
                          aria-label="Next document"
                          className="flex h-6 w-6 items-center justify-center rounded-sm text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-high)] disabled:opacity-40"
                          disabled={docIndex >= documents.length - 1}
                          onClick={() => setDocIndex((index) => Math.min(documents.length - 1, index + 1))}
                          type="button"
                        >
                          <OpsIcon className="text-[16px]" name="chevron_right" />
                        </button>
                      </div>
                    </div>

                    <div className="group relative flex h-48 w-full items-center justify-center overflow-hidden rounded-sm border border-dashed border-[var(--outline-variant)] bg-[var(--surface-variant)]">
                      {currentDoc.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img alt={currentDoc.label} className="h-full w-full object-contain" src={currentDoc.url} />
                      ) : (
                        <OpsIcon className="text-[48px] text-[var(--outline-variant)] opacity-50" name="description" />
                      )}
                      {currentDoc.url ? (
                        <a
                          className="absolute bottom-2 right-2 rounded-sm bg-[var(--primary)] p-1.5 text-[var(--on-primary)] opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                          href={currentDoc.url}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <OpsIcon className="text-[16px]" name="zoom_in" />
                        </a>
                      ) : null}
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <span className="min-w-0 truncate text-xs text-[var(--on-surface-variant)]">
                        {currentDoc.url ? currentDoc.url.split("/").pop() : `${currentDoc.type}.file`}
                      </span>
                      {docChip ? (
                        <span className={`inline-flex shrink-0 items-center gap-1 rounded-sm px-2 py-0.5 text-[11px] font-semibold ${docChip.className}`}>
                          <OpsIcon className="text-[14px]" name={docChip.icon} />
                          {docChip.label}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-[11px] text-[var(--on-surface-variant)]">
                      {approvedDocCount} of {documents.length} document{documents.length === 1 ? "" : "s"} approved —
                      the application is verified once all are approved.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-[var(--on-surface-variant)]">No documents uploaded.</p>
                )}

                {/* Extracted data (no OCR in schema yet — derived/placeholder) */}
                <div className="rounded-sm border border-[var(--outline-variant)] bg-[var(--surface-container)] p-2">
                  <h6 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--on-surface-variant)]">
                    Extracted Data
                  </h6>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <div className="text-[var(--on-surface-variant)]">First Name</div>
                    <div className="font-medium text-[var(--on-surface)]">{firstName || "—"}</div>
                    <div className="text-[var(--on-surface-variant)]">Last Name</div>
                    <div className="font-medium text-[var(--on-surface)]">{restName.join(" ") || "—"}</div>
                    <div className="text-[var(--on-surface-variant)]">Phone</div>
                    <div className="font-medium text-[var(--on-surface)]">{provider.phone || "—"}</div>
                    <div className="text-[var(--on-surface-variant)]">City</div>
                    <div className="font-medium text-[var(--on-surface)]">{provider.city || "—"}</div>
                  </div>
                </div>

                <div className="border-t border-[var(--outline-variant)]" />

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-[var(--on-surface)]">Review Notes (Internal)</label>
                  <textarea
                    className="w-full resize-none rounded-sm border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-2 text-xs text-[var(--on-surface)] outline-none placeholder:text-[var(--on-surface-variant)] focus:border-[var(--primary)]"
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Add notes regarding this verification..."
                    rows={3}
                    value={notes}
                  />
                  {actionError ? (
                    <p className="rounded-sm border border-[var(--error)] bg-[var(--error-container)] p-2 text-xs text-[var(--on-error-container)]">
                      {actionError}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex gap-2 border-t border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
                <button
                  className="flex-1 rounded-lg border border-[var(--outline-variant)] py-2 text-center text-xs font-medium text-[var(--on-surface)] transition-colors hover:bg-[var(--surface-container-low)] disabled:opacity-50"
                  disabled={!currentDoc || activeAction !== null}
                  onClick={() => runDecision("reject")}
                  type="button"
                >
                  {activeAction === "reject" ? "Rejecting..." : "Reject"}
                </button>
                <button
                  className="flex-1 rounded-lg bg-[var(--primary)] py-2 text-center text-xs font-medium text-[var(--on-primary)] transition-colors hover:bg-[var(--primary-container)] disabled:opacity-50"
                  disabled={!currentDoc || activeAction !== null}
                  onClick={() => runDecision("approve")}
                  type="button"
                >
                  {activeAction === "approve" ? "Approving..." : "Approve Document"}
                </button>
              </div>
            </>
          ) : (
            <p className="p-6 text-sm text-[var(--on-surface-variant)]">Select an applicant to review.</p>
          )}
        </aside>
      ) : null}

      {toast ? (
        <div
          className={
            toast.tone === "success"
              ? "fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-[var(--inverse-surface)] px-4 py-3 text-[var(--inverse-on-surface)] shadow-[0_8px_30px_rgb(0_0_0_/_0.18)]"
              : "fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-[var(--danger)] px-4 py-3 text-[var(--on-error)] shadow-[0_8px_30px_rgb(0_0_0_/_0.18)]"
          }
          role="status"
        >
          <OpsIcon className="text-[18px]" name={toast.tone === "success" ? "check_circle" : "error"} />
          <span className="text-sm">{toast.message}</span>
          <button
            aria-label="Dismiss"
            className="ml-2 opacity-70 hover:opacity-100"
            onClick={() => setToast(null)}
            type="button"
          >
            <OpsIcon className="text-[16px]" name="close" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
