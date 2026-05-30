export type Profile = {
  id: string;
  role: "customer" | "provider" | "admin";
  name: string | null;
  email: string | null;
  phone: string;
  preferredLang: string;
  city: string | null;
  area: string | null;
};

export type SaveProfilePayload = {
  name: string;
  email?: string | null;
  preferredLang: string;
};

export async function loadProfile() {
  const response = await fetch("/api/profile", { method: "GET", cache: "no-store" });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error ?? "Could not load your profile.");
  return data as { ok: true; profile: Profile };
}

export async function saveProfile(payload: SaveProfilePayload) {
  const response = await fetch("/api/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = data?.detail ? ` ${data.detail}` : "";
    throw new Error(`${data?.error ?? "Could not save your profile."}${detail}`);
  }
  return data as { ok: true; profile: Profile };
}

export async function logout() {
  const response = await fetch("/api/auth/logout", { method: "POST" });
  const data = await response.json().catch(() => null);
  return data as { ok: true; nextPath: string };
}
