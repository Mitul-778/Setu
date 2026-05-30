export type ProviderPackageInput = {
  id?: string;
  name: string;
  description: string;
  priceInr: number;
  durationMin: number | null;
};

export type AvailabilitySlotInput = {
  weekday: number;
  active: boolean;
  startTime: string;
  endTime: string;
};

export type ProviderServiceSettingsPayload = {
  customQuoteEnabled: boolean;
  travelRadiusKm: number;
  neighborhoods: string[];
  blackoutDates: string[];
  weekendSurchargePct: number;
  holidaySurchargePct: number;
  packages: ProviderPackageInput[];
  availability: AvailabilitySlotInput[];
};

export type ProviderServiceSettingsResponse = ProviderServiceSettingsPayload & {
  ok: true;
  providerId: string;
  suggestedNeighborhoods: string[];
  nextPath: string;
};

export async function loadProviderServiceSettings() {
  const response = await fetch("/api/provider/service-settings", {
    method: "GET",
    cache: "no-store",
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = data?.detail ? ` ${data.detail}` : "";
    throw new Error(`${data?.error ?? "Could not load service settings."}${detail}`);
  }

  return data as ProviderServiceSettingsResponse;
}

export async function saveProviderServiceSettings(payload: ProviderServiceSettingsPayload) {
  const response = await fetch("/api/provider/service-settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = data?.detail ? ` ${data.detail}` : "";
    throw new Error(`${data?.error ?? "Could not save service settings."}${detail}`);
  }

  return data as ProviderServiceSettingsResponse;
}
