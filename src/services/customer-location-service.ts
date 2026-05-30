export type CustomerLocationPayload = {
  city: string;
  area?: string | null;
  lat: number;
  lng: number;
};

export type CustomerLocationResponse = {
  ok: true;
  id: string;
  city: string | null;
  area: string | null;
  lat: number | null;
  lng: number | null;
  nextPath: string;
};

export async function saveCustomerLocation(payload: CustomerLocationPayload) {
  const response = await fetch("/api/customer/location", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = data?.detail ? ` ${data.detail}` : "";
    throw new Error(`${data?.error ?? "Could not save your location."}${detail}`);
  }

  return data as CustomerLocationResponse;
}
