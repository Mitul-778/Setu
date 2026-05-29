export type ProviderIdentityPayload = {
  displayName: string;
  documentType: string;
  documentFront: File | null;
  documentBack: File | null;
  selfie: File | null;
  serviceArea: string;
  serviceRadiusKm: number;
  serviceLat: number;
  serviceLng: number;
};

export async function submitProviderIdentity(payload: ProviderIdentityPayload) {
  const formData = new FormData();
  formData.set("displayName", payload.displayName);
  formData.set("documentType", payload.documentType);
  formData.set("serviceArea", payload.serviceArea);
  formData.set("serviceRadiusKm", String(payload.serviceRadiusKm));
  formData.set("serviceLat", String(payload.serviceLat));
  formData.set("serviceLng", String(payload.serviceLng));

  if (payload.documentFront) formData.set("documentFront", payload.documentFront);
  if (payload.documentBack) formData.set("documentBack", payload.documentBack);
  if (payload.selfie) formData.set("selfie", payload.selfie);

  const response = await fetch("/api/provider/verify-identity", {
    method: "POST",
    body: formData,
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = data?.detail ? ` ${data.detail}` : "";
    throw new Error(`${data?.error ?? "Could not save identity details."}${detail}`);
  }

  return data as { ok: true; providerId: string; nextPath: string };
}
