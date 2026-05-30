export type CustomerInterestsResponse = {
  ok: true;
  interests: string[];
  nextPath?: string;
};

export async function loadCustomerInterests() {
  const response = await fetch("/api/customer/interests", {
    method: "GET",
    cache: "no-store",
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error ?? "Could not load your interests.");
  }

  return data as CustomerInterestsResponse;
}

export async function saveCustomerInterests(serviceIds: string[]) {
  const response = await fetch("/api/customer/interests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ serviceIds }),
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = data?.detail ? ` ${data.detail}` : "";
    throw new Error(`${data?.error ?? "Could not save your interests."}${detail}`);
  }

  return data as CustomerInterestsResponse;
}
