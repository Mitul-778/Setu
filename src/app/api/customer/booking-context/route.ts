import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serviceLabel } from "@/lib/services";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown server error";
}

export async function GET(request: NextRequest) {
  const providerId = request.nextUrl.searchParams.get("providerId");

  if (!providerId) {
    return NextResponse.json({ error: "A provider is required to book." }, { status: 400 });
  }

  try {
    const provider = await db.providerProfile.findUnique({
      where: { id: providerId },
      select: {
        id: true,
        displayName: true,
        category: true,
        serviceRadiusKm: true,
        area: true,
        city: true,
        packages: {
          where: { active: true },
          orderBy: { priceInr: "asc" },
          select: { id: true, name: true, description: true, priceInr: true, durationMin: true },
        },
      },
    });

    if (!provider) {
      return NextResponse.json({ error: "Provider not found." }, { status: 404 });
    }

    const userId = request.cookies.get("setu_user_id")?.value;
    const user = userId
      ? await db.user.findUnique({ where: { id: userId }, select: { name: true, area: true, city: true } })
      : null;

    return NextResponse.json({
      ok: true as const,
      provider: {
        id: provider.id,
        name: provider.displayName ?? "Provider",
        service: provider.category ? serviceLabel(provider.category) : "Service",
        serviceRadiusKm: provider.serviceRadiusKm,
        area: provider.area,
        city: provider.city,
        packages: provider.packages,
      },
      customer: {
        name: user?.name ?? null,
        addressLabel: [user?.area, user?.city].filter(Boolean).join(", ") || null,
      },
    });
  } catch (error) {
    console.error("Booking context load failed", error);
    return NextResponse.json(
      {
        error: "Could not load booking details.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}
