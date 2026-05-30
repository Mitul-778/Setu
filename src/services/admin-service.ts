export type AdminProviderStatus = "draft" | "submitted" | "needs_fix" | "approved" | "rejected";
export type AdminQueueFilter = "queue" | "submitted" | "needs_fix" | "approved" | "rejected" | "all";

export type AdminProviderRow = {
  id: string;
  displayName: string;
  category: string;
  city: string;
  area: string;
  phone: string;
  status: AdminProviderStatus;
  trustScore: number;
  submittedAt: string | null;
  pendingDocs: number;
  approvedDocs: number;
  totalDocs: number;
};

export type AdminProviderListResponse = {
  ok: true;
  filter: AdminQueueFilter;
  providers: AdminProviderRow[];
};

export type AdminProviderDocument = {
  id: string;
  type: string;
  label: string;
  status: string;
  requiredFix: string;
  adminNotes: string;
  url: string | null;
};

export type AdminProviderDetailResponse = {
  ok: true;
  provider: {
    id: string;
    displayName: string;
    headline: string;
    bio: string;
    translatedBio: string;
    category: string;
    serviceNames: string[];
    languages: string[];
    experienceLevel: string;
    city: string;
    area: string;
    phone: string;
    email: string;
    status: AdminProviderStatus;
    trustScore: number;
    submittedAt: string | null;
    approvedAt: string | null;
    rejectedAt: string | null;
  };
  documents: AdminProviderDocument[];
  portfolio: { id: string; type: string; title: string; url: string | null }[];
  packages: { id: string; name: string; description: string; priceInr: number; durationMin: number | null }[];
  verification: {
    status: AdminProviderStatus;
    expectedReviewHours: number;
    missingItems: string[];
    submittedAt: string | null;
    reviewedAt: string | null;
    resubmittedAt: string | null;
  } | null;
};

export type AdminDecision =
  | { action: "approve"; notes?: string }
  | { action: "reject"; notes?: string }
  | { action: "request_fixes"; notes?: string; documents: { id: string; requiredFix: string }[] }
  | { action: "approve_document"; documentId: string; notes?: string }
  | { action: "reject_document"; documentId: string; notes: string };

export type AdminDecisionResult = {
  ok: true;
  status: AdminProviderStatus;
  documentId?: string;
  documentStatus?: string;
};

async function parseResponse<T>(response: Response, fallback: string): Promise<T> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = data?.detail ? ` ${data.detail}` : "";
    throw new Error(`${data?.error ?? fallback}${detail}`);
  }

  return data as T;
}

export async function adminLogin(passcode: string) {
  const response = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ passcode }),
  });
  return parseResponse<{ ok: true; nextPath: string }>(response, "Could not sign in.");
}

export async function adminLogout() {
  const response = await fetch("/api/admin/logout", { method: "POST" });
  return parseResponse<{ ok: true; nextPath: string }>(response, "Could not sign out.");
}

export async function loadAdminProviders(filter: AdminQueueFilter) {
  const response = await fetch(`/api/admin/providers?status=${encodeURIComponent(filter)}`, {
    method: "GET",
    cache: "no-store",
  });
  return parseResponse<AdminProviderListResponse>(response, "Could not load providers.");
}

export async function loadAdminProvider(id: string) {
  const response = await fetch(`/api/admin/providers/${id}`, {
    method: "GET",
    cache: "no-store",
  });
  return parseResponse<AdminProviderDetailResponse>(response, "Could not load provider.");
}

export async function submitAdminDecision(id: string, decision: AdminDecision) {
  const response = await fetch(`/api/admin/providers/${id}/decision`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(decision),
  });
  return parseResponse<AdminDecisionResult>(response, "Could not save decision.");
}
