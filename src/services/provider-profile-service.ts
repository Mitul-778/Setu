export type ProviderProfileTask = {
  key: string;
  label: string;
  detail: string;
  complete: boolean;
  href: string;
};

export type ProviderTrustBadge = {
  key: string;
  label: string;
  complete: boolean;
};

export type ProviderProfileResponse = {
  ok: true;
  providerId: string;
  displayName: string;
  serviceIds: string[];
  serviceNames: string[];
  languages: string[];
  experienceLevel: string;
  bio: string;
  translatedBio: string;
  onboardingStatus: "draft" | "submitted" | "needs_fix" | "approved" | "rejected";
  tasks: ProviderProfileTask[];
  trustBadges: ProviderTrustBadge[];
  missingItems: string[];
  canSubmit: boolean;
};

export type SubmitProviderProfileResponse = {
  ok: true;
  providerId: string;
  onboardingStatus: "submitted";
  nextPath: string;
};

export async function loadProviderProfile() {
  const response = await fetch("/api/provider/profile", {
    method: "GET",
    cache: "no-store",
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = data?.detail ? ` ${data.detail}` : "";
    throw new Error(`${data?.error ?? "Could not load profile details."}${detail}`);
  }

  return data as ProviderProfileResponse;
}

export async function submitProviderProfile() {
  const response = await fetch("/api/provider/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const missing = Array.isArray(data?.missingItems) && data.missingItems.length
      ? ` Missing: ${data.missingItems.join(", ")}.`
      : "";
    throw new Error(`${data?.error ?? "Could not submit profile for review."}${missing}`);
  }

  return data as SubmitProviderProfileResponse;
}
