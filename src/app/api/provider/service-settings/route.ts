import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const fallbackNeighborhoodsByCity: Record<string, string[]> = {
  mumbai: ["Borivali", "Kandivali", "Malad", "Goregaon", "Andheri", "Dahisar"],
  bangalore: ["Indiranagar", "Koramangala", "HSR Layout", "Whitefield", "Marathahalli", "Jayanagar"],
  bengaluru: ["Indiranagar", "Koramangala", "HSR Layout", "Whitefield", "Marathahalli", "Jayanagar"],
  pune: ["Kothrud", "Baner", "Viman Nagar", "Wakad", "Hinjewadi", "Aundh"],
  delhi: ["Saket", "Dwarka", "Rohini", "Lajpat Nagar", "Karol Bagh", "Vasant Kunj"],
};

const fallbackNeighborhoodsByArea: Record<string, string[]> = {
  borivali: ["Borivali West", "Borivali East", "IC Colony", "Eksar", "Dahisar East", "Kandivali West"],
  kandivali: ["Kandivali West", "Kandivali East", "Charkop", "Thakur Village", "Borivali East", "Malad West"],
  malad: ["Malad West", "Malad East", "Goregaon West", "Kandivali West", "Mindspace", "Orlem"],
  andheri: ["Andheri West", "Andheri East", "Versova", "Lokhandwala", "Jogeshwari", "Vile Parle"],
  goregaon: ["Goregaon West", "Goregaon East", "Aarey Colony", "Malad East", "Jogeshwari", "Oshiwara"],
};

const defaultAvailability = [
  { weekday: 0, active: true, startTime: "09:00", endTime: "18:00" },
  { weekday: 1, active: true, startTime: "09:00", endTime: "18:00" },
  { weekday: 2, active: true, startTime: "09:00", endTime: "18:00" },
  { weekday: 3, active: true, startTime: "09:00", endTime: "18:00" },
  { weekday: 4, active: true, startTime: "09:00", endTime: "18:00" },
  { weekday: 5, active: true, startTime: "10:00", endTime: "16:00" },
  { weekday: 6, active: false, startTime: "10:00", endTime: "16:00" },
];

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown server error";
}

function normalizeStringArray(value: unknown, limit = 12) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => String(item).trim())
    .filter(Boolean)
    .filter((item, index, array) => array.indexOf(item) === index)
    .slice(0, limit);
}

function normalizePackages(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => ({
      id: typeof item?.id === "string" ? item.id : undefined,
      name: String(item?.name ?? "").trim(),
      description: String(item?.description ?? "").trim(),
      priceInr: Number(item?.priceInr),
      durationMin: item?.durationMin ? Number(item.durationMin) : null,
    }))
    .filter((item) => item.name && Number.isFinite(item.priceInr) && item.priceInr > 0)
    .slice(0, 10);
}

function normalizeAvailability(value: unknown) {
  if (!Array.isArray(value)) return defaultAvailability;

  const slots = value
    .map((item) => ({
      weekday: Number(item?.weekday),
      active: Boolean(item?.active),
      startTime: String(item?.startTime ?? "").trim(),
      endTime: String(item?.endTime ?? "").trim(),
    }))
    .filter((item) => Number.isInteger(item.weekday) && item.weekday >= 0 && item.weekday <= 6)
    .map((item) => ({
      weekday: item.weekday,
      active: item.active,
      startTime: /^\d{2}:\d{2}$/.test(item.startTime) ? item.startTime : defaultAvailability[item.weekday].startTime,
      endTime: /^\d{2}:\d{2}$/.test(item.endTime) ? item.endTime : defaultAvailability[item.weekday].endTime,
    }));

  return defaultAvailability.map((fallback) => slots.find((slot) => slot.weekday === fallback.weekday) ?? fallback);
}

function normalizePct(value: unknown) {
  const nextValue = Number(value);
  if (!Number.isFinite(nextValue)) return 0;
  return Math.min(50, Math.max(0, Math.round(nextValue)));
}

function normalizeRadius(value: unknown) {
  const nextValue = Number(value);
  if (!Number.isFinite(nextValue)) return 10;
  return Math.min(50, Math.max(1, Math.round(nextValue)));
}

async function getCurrentProvider(request: NextRequest) {
  const userId = request.cookies.get("setu_user_id")?.value;

  if (!userId) {
    return { error: NextResponse.json({ error: "Login is required." }, { status: 401 }) };
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { providerProfile: { include: { settings: true, packages: true, availability: true } } },
  });

  if (!user) {
    return { error: NextResponse.json({ error: "User session is invalid." }, { status: 401 }) };
  }

  const provider = user.providerProfile ?? await db.providerProfile.create({
    data: {
      userId: user.id,
      onboardingStatus: "draft",
      serviceIds: [],
      serviceNames: [],
      languages: [],
    },
    include: { settings: true, packages: true, availability: true },
  });

  return { user, provider };
}

function fallbackNeighborhoods(provider: { city: string | null; area: string | null }) {
  const area = provider.area?.split(",")[0]?.trim();
  const source = `${provider.area ?? ""} ${provider.city ?? ""}`.toLowerCase();
  const areaMatch = Object.keys(fallbackNeighborhoodsByArea).find((item) => source.includes(item));

  if (areaMatch) {
    return [area, ...fallbackNeighborhoodsByArea[areaMatch]]
      .filter(Boolean)
      .filter((item, index, array) => array.indexOf(item) === index)
      .slice(0, 6) as string[];
  }

  const cityMatch = Object.keys(fallbackNeighborhoodsByCity).find((city) => source.includes(city));
  if (cityMatch) {
    return [area, ...fallbackNeighborhoodsByCity[cityMatch]]
      .filter(Boolean)
      .filter((item, index, array) => array.indexOf(item) === index)
      .slice(0, 6) as string[];
  }

  if (area) {
    return [area, `${area} East`, `${area} West`, `Near ${area}`, `${area} Market`, `${area} Station`].slice(0, 6);
  }

  return ["Nearby Area", "City Center", "Market Area", "Station Area", "Residential Area", "Main Road"];
}

async function getSuggestedNeighborhoods(provider: {
  city: string | null;
  area: string | null;
  lat: number | null;
  lng: number | null;
  serviceRadiusKm: number;
}) {
  const fallback = fallbackNeighborhoods(provider);
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey || provider.lat == null || provider.lng == null) {
    return fallback;
  }

  try {
    const response = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.displayName",
      },
      body: JSON.stringify({
        includedTypes: ["neighborhood", "sublocality", "locality"],
        maxResultCount: 6,
        locationRestriction: {
          circle: {
            center: { latitude: provider.lat, longitude: provider.lng },
            radius: Math.min(50000, Math.max(1000, provider.serviceRadiusKm * 1000)),
          },
        },
      }),
    });

    if (!response.ok) return fallback;

    const data = await response.json();
    const places = normalizeStringArray(
      data?.places?.map((place: { displayName?: { text?: string } }) => place.displayName?.text),
      6,
    );

    return places.length ? places : fallback;
  } catch {
    return fallback;
  }
}

function toResponse(provider: {
  id: string;
  serviceRadiusKm: number;
  settings: {
    customQuoteEnabled: boolean;
    travelRadiusKm: number;
    neighborhoods: unknown;
    blackoutDates: unknown;
    weekendSurchargePct: number;
    holidaySurchargePct: number;
  } | null;
  packages: Array<{
    id: string;
    name: string;
    description: string;
    priceInr: number;
    durationMin: number | null;
    active: boolean;
  }>;
  availability: Array<{
    weekday: number;
    active: boolean;
    startTime: string;
    endTime: string;
  }>;
}, suggestedNeighborhoods: string[]) {
  const settings = provider.settings;

  return {
    ok: true as const,
    providerId: provider.id,
    customQuoteEnabled: settings?.customQuoteEnabled ?? true,
    travelRadiusKm: settings?.travelRadiusKm ?? provider.serviceRadiusKm ?? 10,
    neighborhoods: normalizeStringArray(settings?.neighborhoods),
    blackoutDates: normalizeStringArray(settings?.blackoutDates),
    weekendSurchargePct: settings?.weekendSurchargePct ?? 0,
    holidaySurchargePct: settings?.holidaySurchargePct ?? 0,
    availability: normalizeAvailability(provider.availability),
    packages: provider.packages
      .filter((item) => item.active)
      .map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        priceInr: item.priceInr,
        durationMin: item.durationMin,
      })),
    suggestedNeighborhoods,
    nextPath: "/provider/profile-preview",
  };
}

export async function GET(request: NextRequest) {
  try {
    const result = await getCurrentProvider(request);
    if ("error" in result) return result.error;

    const suggestedNeighborhoods = await getSuggestedNeighborhoods(result.provider);
    return NextResponse.json(toResponse(result.provider, suggestedNeighborhoods));
  } catch (error) {
    console.error("Provider service settings load failed", error);
    return NextResponse.json(
      {
        error: "Could not load service settings.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const result = await getCurrentProvider(request);
    if ("error" in result) return result.error;

    const body = await request.json().catch(() => null);
    const packages = normalizePackages(body?.packages);
    const neighborhoods = normalizeStringArray(body?.neighborhoods, 8);
    const blackoutDates = normalizeStringArray(body?.blackoutDates, 20);
    const travelRadiusKm = normalizeRadius(body?.travelRadiusKm);
    const availability = normalizeAvailability(body?.availability);

    const provider = await db.$transaction(async (tx) => {
      await tx.providerPackage.deleteMany({ where: { providerId: result.provider.id } });

      if (packages.length) {
        await tx.providerPackage.createMany({
          data: packages.map((item) => ({
            providerId: result.provider.id,
            name: item.name,
            description: item.description,
            priceInr: Math.round(item.priceInr),
            durationMin: item.durationMin && Number.isFinite(item.durationMin) ? Math.round(item.durationMin) : null,
            active: true,
          })),
        });
      }

      await tx.providerServiceSettings.upsert({
        where: { providerId: result.provider.id },
        update: {
          customQuoteEnabled: Boolean(body?.customQuoteEnabled),
          travelRadiusKm,
          neighborhoods,
          blackoutDates,
          weekendSurchargePct: normalizePct(body?.weekendSurchargePct),
          holidaySurchargePct: normalizePct(body?.holidaySurchargePct),
        },
        create: {
          providerId: result.provider.id,
          customQuoteEnabled: Boolean(body?.customQuoteEnabled),
          travelRadiusKm,
          neighborhoods,
          blackoutDates,
          weekendSurchargePct: normalizePct(body?.weekendSurchargePct),
          holidaySurchargePct: normalizePct(body?.holidaySurchargePct),
        },
      });

      await tx.availabilitySlot.deleteMany({ where: { providerId: result.provider.id } });
      await tx.availabilitySlot.createMany({
        data: availability.map((slot) => ({
          providerId: result.provider.id,
          weekday: slot.weekday,
          active: slot.active,
          startTime: slot.startTime,
          endTime: slot.endTime,
        })),
      });

      await tx.providerProfile.update({
        where: { id: result.provider.id },
        data: { serviceRadiusKm: travelRadiusKm, onboardingStatus: "draft" },
      });

      return tx.providerProfile.findUniqueOrThrow({
        where: { id: result.provider.id },
        include: { settings: true, packages: true, availability: true },
      });
    });

    const suggestedNeighborhoods = await getSuggestedNeighborhoods(provider);
    return NextResponse.json(toResponse(provider, suggestedNeighborhoods));
  } catch (error) {
    console.error("Provider service settings save failed", error);
    return NextResponse.json(
      {
        error: "Could not save service settings.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}