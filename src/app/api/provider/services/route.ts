import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  providerExperienceLevels,
  providerLanguageOptions,
  providerServiceOptions,
  type ProviderExperienceId,
  type ProviderServiceId,
} from "@/lib/provider-profile-draft";

const validServiceIds = providerServiceOptions.map((service) => service.id);
const validLanguages = providerLanguageOptions;
const validExperienceLevels = providerExperienceLevels.map((level) => level.id);

function isProviderServiceId(value: string): value is ProviderServiceId {
  return validServiceIds.includes(value as ProviderServiceId);
}

function isProviderExperienceId(value: string): value is ProviderExperienceId {
  return validExperienceLevels.includes(value as ProviderExperienceId);
}

function getServiceLabel(serviceId: ProviderServiceId) {
  return providerServiceOptions.find((service) => service.id === serviceId)?.label ?? serviceId;
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).trim()).filter(Boolean);
}

function normalizeServiceIds(value: unknown) {
  const services = normalizeStringArray(value)
    .filter(isProviderServiceId)
    .filter((item, index, array) => array.indexOf(item) === index);

  return services.length ? services : ["chef"] satisfies ProviderServiceId[];
}

function normalizeLanguages(value: unknown) {
  const languages = normalizeStringArray(value)
    .filter((language) => validLanguages.includes(language))
    .filter((item, index, array) => array.indexOf(item) === index);

  return languages.length ? languages : ["English", "Hindi"];
}

function normalizeExperienceLevel(value: unknown) {
  const experienceLevel = String(value ?? "").trim();
  return isProviderExperienceId(experienceLevel) ? experienceLevel : "1-3";
}

function normalizeServiceNames(value: unknown, serviceIds: ProviderServiceId[]) {
  const serviceNames = normalizeStringArray(value).slice(0, 12);
  if (serviceNames.length) return serviceNames;

  return serviceIds.map(getServiceLabel);
}

function getPrimaryCategory(serviceIds: ProviderServiceId[]) {
  return getServiceLabel(serviceIds[0] ?? "chef");
}

function readJsonArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown server error";
}

function toResponse(provider: {
  id: string;
  serviceIds: unknown;
  languages: unknown;
  experienceLevel: string | null;
  bio: string;
  translatedBio: string | null;
  serviceNames: unknown;
}) {
  return {
    ok: true as const,
    providerId: provider.id,
    serviceIds: normalizeServiceIds(readJsonArray(provider.serviceIds)),
    languages: normalizeLanguages(readJsonArray(provider.languages)),
    experienceLevel: normalizeExperienceLevel(provider.experienceLevel),
    bio: provider.bio,
    translatedBio: provider.translatedBio ?? "",
    serviceNames: normalizeServiceNames(readJsonArray(provider.serviceNames), normalizeServiceIds(readJsonArray(provider.serviceIds))),
  };
}

async function getCurrentProvider(request: NextRequest) {
  const userId = request.cookies.get("setu_user_id")?.value;

  if (!userId) {
    return { error: NextResponse.json({ error: "Login is required." }, { status: 401 }) };
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { providerProfile: true },
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
  });

  return { user, provider };
}

export async function GET(request: NextRequest) {
  try {
    const result = await getCurrentProvider(request);
    if ("error" in result) return result.error;

    return NextResponse.json(toResponse(result.provider));
  } catch (error) {
    console.error("Provider services load failed", error);
    return NextResponse.json(
      {
        error: "Could not load provider services.",
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
    const serviceIds = normalizeServiceIds(body?.serviceIds);
    const languages = normalizeLanguages(body?.languages);
    const experienceLevel = normalizeExperienceLevel(body?.experienceLevel);
    const bio = String(body?.bio ?? "").trim();
    const translatedBio = String(body?.translatedBio ?? "").trim();
    const serviceNames = normalizeServiceNames(body?.serviceNames, serviceIds);

    if (!bio) {
      return NextResponse.json({ error: "Profile bio is required." }, { status: 400 });
    }

    const provider = await db.$transaction(async (tx) => {
      const updatedProvider = await tx.providerProfile.update({
        where: { id: result.provider.id },
        data: {
          serviceIds,
          languages,
          experienceLevel,
          bio,
          translatedBio,
          serviceNames,
          category: getPrimaryCategory(serviceIds),
          onboardingStatus: "draft",
        },
      });

      await tx.providerService.deleteMany({
        where: { providerId: result.provider.id },
      });

      await tx.providerService.createMany({
        data: serviceIds.map((serviceId) => ({
          providerId: result.provider.id,
          categoryId: serviceId,
          name: getServiceLabel(serviceId),
          description: serviceNames.join(", "),
          active: true,
        })),
      });

      return updatedProvider;
    });

    return NextResponse.json(toResponse(provider));
  } catch (error) {
    console.error("Provider services save failed", error);
    return NextResponse.json(
      {
        error: "Could not save provider services.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}
