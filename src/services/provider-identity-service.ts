export type ProviderIdentityPayload = {
  displayName: string;
  documentType: string;
  documentFront: File | null;
  documentBack: File | null;
  selfie: File | null;
  phoneNumber: string;
  serviceArea: string;
  serviceRadiusKm: number;
};

export async function submitProviderIdentity(payload: ProviderIdentityPayload) {
  const formData = new FormData();
  formData.set("displayName", payload.displayName);
  formData.set("documentType", payload.documentType);
  formData.set("phoneNumber", payload.phoneNumber);
  formData.set("serviceArea", payload.serviceArea);
  formData.set("serviceRadiusKm", String(payload.serviceRadiusKm));

  if (payload.documentFront) formData.set("documentFront", payload.documentFront);
  if (payload.documentBack) formData.set("documentBack", payload.documentBack);
  if (payload.selfie) formData.set("selfie", payload.selfie);

  const response = await fetch("/api/provider/verify-identity", {
    method: "POST",
    body: formData,
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error ?? "Could not save identity details.");
  }

  return data as { ok: true; providerId: string; nextPath: string };
}
