export type ProviderShowcaseFile = {
  id: string;
  label: string;
  type: string;
  url: string;
  fileName?: string | null;
};

export type ProviderShowcaseResponse = {
  ok: true;
  providerId: string;
  portfolio: ProviderShowcaseFile[];
  documents: ProviderShowcaseFile[];
  requiresFssai: boolean;
  nextPath: string;
};

export type ProviderShowcasePayload = {
  photos: File[];
  introVideos: File[];
  menuImages: File[];
  fssaiDocuments: File[];
  certificates: File[];
};

export async function loadProviderShowcase() {
  const response = await fetch("/api/provider/showcase", {
    method: "GET",
    cache: "no-store",
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = data?.detail ? ` ${data.detail}` : "";
    throw new Error(`${data?.error ?? "Could not load showcase details."}${detail}`);
  }

  return data as ProviderShowcaseResponse;
}

export async function saveProviderShowcase(payload: ProviderShowcasePayload) {
  const formData = new FormData();

  payload.photos.forEach((file) => formData.append("photos", file));
  payload.introVideos.forEach((file) => formData.append("introVideos", file));
  payload.menuImages.forEach((file) => formData.append("menuImages", file));
  payload.fssaiDocuments.forEach((file) => formData.append("fssaiDocuments", file));
  payload.certificates.forEach((file) => formData.append("certificates", file));

  const response = await fetch("/api/provider/showcase", {
    method: "POST",
    body: formData,
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = data?.detail ? ` ${data.detail}` : "";
    throw new Error(`${data?.error ?? "Could not save showcase details."}${detail}`);
  }

  return data as ProviderShowcaseResponse;
}
