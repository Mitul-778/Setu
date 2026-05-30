import { db } from "@/lib/db";
import { serviceLabel } from "@/lib/services";

export type SortKey = "relevance" | "distance" | "price" | "rating";

export type ProviderSearchFilters = {
  sort: SortKey;
  maxPrice?: number; // undefined = no cap
  distanceCapKm: number; // Infinity = any distance
  minRating?: number;
  languages: string[];
  fssaiOnly: boolean;
  serviceId?: string;
};

export type ProviderResult = {
  id: string;
  name: string;
  service: string;
  rating: string | null;
  distanceLabel: string;
  priceLabel: string;
  languagesLabel: string;
  badges: string[];
  matchReasons: string[];
  initials: string;
  image?: string;
};

type UserLocation = { city: string | null; area: string | null; lat: number | null; lng: number | null } | null;

const defaultScopeKm = 60;

const cityAliases: Record<string, string> = {
  bengaluru: "bangalore",
  bangalore: "bangalore",
  "delhi ncr": "delhi",
  delhi: "delhi",
  mumbai: "mumbai",
  hyderabad: "hyderabad",
  chennai: "chennai",
  kolkata: "kolkata",
  pune: "pune",
};

function cityKey(value?: string | null) {
  if (!value) return "";
  const lower = value.toLowerCase();
  for (const alias of Object.keys(cityAliases)) {
    if (lower.includes(alias)) return cityAliases[alias];
  }
  return lower.trim();
}

function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return earthRadiusKm * 2 * Math.asin(Math.sqrt(h));
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseProviderFilters(
  params: Record<string, string | string[] | undefined>,
): ProviderSearchFilters {
  const sortRaw = single(params.sort);
  const sort: SortKey = (["distance", "price", "rating", "relevance"] as const).includes(sortRaw as SortKey)
    ? (sortRaw as SortKey)
    : "relevance";

  const maxPriceRaw = Number(single(params.maxPrice));
  const maxPrice =
    Number.isFinite(maxPriceRaw) && maxPriceRaw > 0 && maxPriceRaw < 10000 ? maxPriceRaw : undefined;

  const distanceRaw = single(params.distance);
  // "any" stays metro-scoped (defaultScopeKm) so results remain "near you".
  let distanceCapKm = defaultScopeKm;
  if (Number.isFinite(Number(distanceRaw)) && Number(distanceRaw) > 0) distanceCapKm = Number(distanceRaw);

  const minRatingRaw = Number(single(params.minRating));
  const minRating = Number.isFinite(minRatingRaw) && minRatingRaw > 0 ? minRatingRaw : undefined;

  const languages = (single(params.langs) ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const fssaiOnly = single(params.fssai) === "1";
  const serviceId = single(params.service) || undefined;

  return { sort, maxPrice, distanceCapKm, minRating, languages, fssaiOnly, serviceId };
}

export async function searchProviders(
  filters: ProviderSearchFilters,
  user: UserLocation,
): Promise<ProviderResult[]> {
  const providers = await db.providerProfile.findMany({
    where: {
      onboardingStatus: "approved",
      ...(filters.serviceId ? { category: filters.serviceId } : {}),
    },
    select: {
      id: true,
      displayName: true,
      category: true,
      yearsExperience: true,
      languages: true,
      city: true,
      lat: true,
      lng: true,
      trustScore: true,
      packages: { where: { active: true }, select: { priceInr: true }, orderBy: { priceInr: "asc" }, take: 1 },
      reviews: { select: { rating: true } },
      portfolio: {
        where: { type: "photo" },
        select: { mediaUrl: true, uploadedFile: { select: { publicUrl: true } } },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      documents: { select: { type: true } },
    },
    take: 100,
  });

  const userHasCoords = user?.lat != null && user?.lng != null;

  const enriched = providers.map((provider) => {
    const ratings = provider.reviews.map((review) => review.rating);
    const avgRating = ratings.length ? ratings.reduce((sum, value) => sum + value, 0) / ratings.length : null;
    const languages = Array.isArray(provider.languages) ? provider.languages.map(String) : [];
    const minPrice = provider.packages[0]?.priceInr ?? null;
    const photo = provider.portfolio[0]?.mediaUrl ?? provider.portfolio[0]?.uploadedFile?.publicUrl ?? undefined;
    const hasFssai = provider.documents.some((doc) => doc.type === "fssai");
    const distance =
      userHasCoords && provider.lat != null && provider.lng != null
        ? distanceKm({ lat: user!.lat!, lng: user!.lng! }, { lat: provider.lat, lng: provider.lng })
        : null;

    return { provider, avgRating, languages, minPrice, photo, hasFssai, distance };
  });

  const filtered = enriched.filter(({ provider, avgRating, languages, minPrice, hasFssai, distance }) => {
    if (userHasCoords) {
      if (provider.lat != null && provider.lng != null) {
        if ((distance ?? Infinity) > filters.distanceCapKm) return false;
      } else if (cityKey(user!.city) !== cityKey(provider.city)) {
        return false;
      }
    } else {
      const key = cityKey(user?.city);
      if (!key || key !== cityKey(provider.city)) return false;
    }

    if (filters.minRating != null && !(avgRating != null && avgRating >= filters.minRating)) return false;
    if (filters.maxPrice != null && !(minPrice != null && minPrice <= filters.maxPrice)) return false;
    if (filters.languages.length && !filters.languages.some((language) => languages.includes(language))) {
      return false;
    }
    if (filters.fssaiOnly && !hasFssai) return false;

    return true;
  });

  filtered.sort((a, b) => {
    switch (filters.sort) {
      case "distance":
        return (a.distance ?? Infinity) - (b.distance ?? Infinity);
      case "price":
        return (a.minPrice ?? Infinity) - (b.minPrice ?? Infinity);
      case "rating":
        return (b.avgRating ?? 0) - (a.avgRating ?? 0);
      default:
        return b.provider.trustScore - a.provider.trustScore;
    }
  });

  return filtered.map(({ provider, avgRating, languages, minPrice, photo, distance }) => {
    const name = provider.displayName ?? "Provider";
    const matchReasons: string[] = [];
    if (distance != null && distance <= 5) matchReasons.push("Nearby");
    if (filters.languages.length && filters.languages.some((language) => languages.includes(language))) {
      matchReasons.push("Speaks your language");
    }
    if (minPrice != null && filters.maxPrice != null && minPrice <= filters.maxPrice) {
      matchReasons.push("Within budget");
    }
    if (avgRating != null && avgRating >= 4.5) matchReasons.push("Strong reviews");
    if (!matchReasons.length) matchReasons.push("Verified pro");

    return {
      id: provider.id,
      name,
      service: provider.category ? serviceLabel(provider.category) : "Service Pro",
      rating: avgRating != null ? avgRating.toFixed(1) : null,
      distanceLabel: distance != null ? `${distance.toFixed(1)} km away` : provider.city ?? "Nearby",
      priceLabel: minPrice != null ? `From ₹${minPrice.toLocaleString("en-IN")}` : "Custom quote",
      languagesLabel: languages.length ? languages.join(", ") : "—",
      badges: ["Verified", ...(avgRating != null && avgRating >= 4.5 ? ["Top Pro"] : [])],
      matchReasons: matchReasons.slice(0, 4),
      initials: initialsOf(name),
      image: photo,
    } satisfies ProviderResult;
  });
}
