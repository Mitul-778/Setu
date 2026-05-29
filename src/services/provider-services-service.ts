import type { ProviderExperienceId, ProviderProfileDraft, ProviderServiceId } from "@/lib/provider-profile-draft";

export type ProviderServicesPayload = Pick<
  ProviderProfileDraft,
  "serviceIds" | "languages" | "experienceLevel" | "bio" | "translatedBio" | "serviceNames"
>;

export type ProviderServicesResponse = ProviderServicesPayload & {
  ok: true;
  providerId: string;
};

export async function loadProviderServices() {
  const response = await fetch("/api/provider/services", {
    method: "GET",
    cache: "no-store",
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = data?.detail ? ` ${data.detail}` : "";
    throw new Error(`${data?.error ?? "Could not load provider services."}${detail}`);
  }

  return data as ProviderServicesResponse;
}

export async function saveProviderServices(payload: ProviderServicesPayload) {
  const response = await fetch("/api/provider/services", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = data?.detail ? ` ${data.detail}` : "";
    throw new Error(`${data?.error ?? "Could not save provider services."}${detail}`);
  }

  return data as ProviderServicesResponse;
}

export function isProviderServiceId(value: string): value is ProviderServiceId {
  return ["mehendi", "chef", "makeup", "photo", "electrician", "tutor"].includes(value);
}

export function isProviderExperienceId(value: string): value is ProviderExperienceId {
  return ["beginner", "1-3", "3-5", "5-plus"].includes(value);
}
