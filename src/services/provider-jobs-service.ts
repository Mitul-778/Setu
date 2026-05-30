export type JobChecklistItem = { key: string; label: string; done: boolean };

export type ProviderJob = {
  id: string;
  customerName: string;
  serviceTitle: string;
  whenLabel: string;
  address: string | null;
  amountInr: number;
  status: "accepted" | "in_progress" | string;
  statusLabel: string;
  otp: string | null;
  checklist: JobChecklistItem[];
};

export async function loadProviderJobs() {
  const response = await fetch("/api/provider/jobs", { method: "GET", cache: "no-store" });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error ?? "Could not load jobs.");
  return data as { ok: true; jobs: ProviderJob[] };
}

async function postJobAction(payload: Record<string, unknown>) {
  const response = await fetch("/api/provider/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = data?.detail ? ` ${data.detail}` : "";
    throw new Error(`${data?.error ?? "Could not update the job."}${detail}`);
  }
  return data as { ok: true; job: ProviderJob };
}

export function startJob(bookingId: string, otp: string) {
  return postJobAction({ action: "start", bookingId, otp });
}

export function toggleJobChecklist(bookingId: string, key: string, done: boolean) {
  return postJobAction({ action: "toggle", bookingId, key, done });
}

export function completeJob(bookingId: string) {
  return postJobAction({ action: "complete", bookingId });
}
