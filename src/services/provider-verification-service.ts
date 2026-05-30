export type VerificationPendingAction = {
  id: string;
  type: string;
  title: string;
  fix: string;
  currentUrl: string | null;
};

export type VerificationStatusResponse = {
  ok: true;
  providerId: string;
  status: "draft" | "submitted" | "needs_fix" | "approved" | "rejected";
  expectedReviewHours: number;
  submittedAt: string | null;
  reviewedAt: string | null;
  resubmittedAt: string | null;
  missingItems: string[];
  pendingActions: VerificationPendingAction[];
};

export async function loadVerificationStatus() {
  const response = await fetch("/api/provider/verification-status", {
    method: "GET",
    cache: "no-store",
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = data?.detail ? ` ${data.detail}` : "";
    throw new Error(`${data?.error ?? "Could not load verification status."}${detail}`);
  }

  return data as VerificationStatusResponse;
}

export async function resubmitVerification(filesByDocId: Record<string, File>) {
  const formData = new FormData();

  for (const [docId, file] of Object.entries(filesByDocId)) {
    formData.append(docId, file);
  }

  const response = await fetch("/api/provider/verification-status", {
    method: "POST",
    body: formData,
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = data?.detail ? ` ${data.detail}` : "";
    throw new Error(`${data?.error ?? "Could not resubmit for review."}${detail}`);
  }

  return data as VerificationStatusResponse;
}
