export type ReviewContext = {
  bookingId: string;
  providerName: string;
  providerInitials: string;
  service: string;
  serviceTitle: string;
  alreadyReviewed: boolean;
};

export async function loadReviewContext(bookingId: string) {
  const response = await fetch(`/api/customer/review?bookingId=${encodeURIComponent(bookingId)}`, {
    method: "GET",
    cache: "no-store",
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error ?? "Could not load review details.");
  return data as { ok: true; context: ReviewContext };
}

export async function submitReview(payload: { bookingId: string; rating: number; comment: string }) {
  const response = await fetch("/api/customer/review", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = data?.detail ? ` ${data.detail}` : "";
    throw new Error(`${data?.error ?? "Could not submit your review."}${detail}`);
  }
  return data as { ok: true; nextPath: string; alreadyReviewed?: boolean };
}
