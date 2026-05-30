export type CheckoutContext = {
  id: string;
  providerName: string;
  providerInitials: string;
  service: string;
  serviceTitle: string;
  amountInr: number;
  platformFee: number;
  totalInr: number;
  address: string | null;
  status: string;
  paid: boolean;
  paymentMethod: string | null;
};

export async function loadCheckout(bookingId: string) {
  const response = await fetch(`/api/customer/checkout?bookingId=${encodeURIComponent(bookingId)}`, {
    method: "GET",
    cache: "no-store",
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error ?? "Could not load checkout.");
  return data as { ok: true; checkout: CheckoutContext };
}

export async function payForBooking(bookingId: string, method: string) {
  const response = await fetch("/api/customer/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingId, method }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = data?.detail ? ` ${data.detail}` : "";
    throw new Error(`${data?.error ?? "Could not complete the payment."}${detail}`);
  }
  return data as { ok: true; nextPath: string; alreadyPaid?: boolean };
}
