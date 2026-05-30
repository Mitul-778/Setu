export type BookingPackage = {
  id: string;
  name: string;
  description: string;
  priceInr: number;
  durationMin: number | null;
};

export type BookingContext = {
  ok: true;
  provider: {
    id: string;
    name: string;
    service: string;
    serviceRadiusKm: number;
    area: string | null;
    city: string | null;
    packages: BookingPackage[];
  };
  customer: {
    name: string | null;
    addressLabel: string | null;
  };
};

export type CreateBookingPayload = {
  providerId: string;
  packageId?: string;
  scheduledAt: string;
  address?: string;
  notes?: string;
};

export type CreateBookingResponse = {
  ok: true;
  bookingId: string;
  nextPath: string;
};

export type CustomerBooking = {
  id: string;
  providerId: string;
  providerName: string;
  providerInitials: string;
  service: string;
  packageTitle: string;
  whenLabel: string;
  amountInr: number;
  address: string | null;
  status: "accepted" | "confirmed" | "in_progress" | "completed" | "cancelled";
  statusLabel: string;
  bucket: "upcoming" | "active" | "completed";
  otp: string | null;
  checklist: { key: string; label: string; done: boolean }[];
  paid: boolean;
};

export type CustomerBookingsResponse = {
  ok: true;
  bookings: CustomerBooking[];
};

export async function loadCustomerBookings() {
  const response = await fetch("/api/customer/bookings", { method: "GET", cache: "no-store" });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error ?? "Could not load your bookings.");
  }

  return data as CustomerBookingsResponse;
}

export async function loadBookingContext(providerId: string) {
  const response = await fetch(`/api/customer/booking-context?providerId=${encodeURIComponent(providerId)}`, {
    method: "GET",
    cache: "no-store",
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error ?? "Could not load booking details.");
  }

  return data as BookingContext;
}

export async function createBooking(payload: CreateBookingPayload) {
  const response = await fetch("/api/customer/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = data?.detail ? ` ${data.detail}` : "";
    throw new Error(`${data?.error ?? "Could not create your booking."}${detail}`);
  }

  return data as CreateBookingResponse;
}
