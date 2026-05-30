import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const minShowcasePhotos = 1;

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown server error";
}

function readArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

async function getCurrentProvider(request: NextRequest) {
  const userId = request.cookies.get("setu_user_id")?.value;

  if (!userId) {
    return { error: NextResponse.json({ error: "Login is required." }, { status: 401 }) };
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      providerProfile: {
        include: {
          documents: true,
          portfolio: true,
          packages: true,
          settings: true,
          availability: true,
          verification: true,
        },
      },
    },
  });

  if (!user) {
    return { error: NextResponse.json({ error: "User session is invalid." }, { status: 401 }) };
  }

  const provider =
    user.providerProfile ??
    (await db.providerProfile.create({
      data: {
        userId: user.id,
        onboardingStatus: "draft",
        serviceIds: [],
        serviceNames: [],
        languages: [],
      },
      include: {
        documents: true,
        portfolio: true,
        packages: true,
        settings: true,
        availability: true,
        verification: true,
      },
    }));

  return { user, provider };
}

type ProviderSuccess = Extract<
  Awaited<ReturnType<typeof getCurrentProvider>>,
  { provider: unknown }
>;
type ProviderWithRelations = ProviderSuccess["provider"];
type UserRecord = ProviderSuccess["user"];

function hasDocument(provider: ProviderWithRelations, type: string) {
  return provider.documents.some((doc) => doc.type === type);
}

function countPhotos(provider: ProviderWithRelations) {
  return provider.portfolio.filter((item) => item.type === "photo").length;
}

function countCertificates(provider: ProviderWithRelations) {
  return provider.documents.filter((doc) => doc.type === "certificate").length;
}

function computeStatus(user: UserRecord, provider: ProviderWithRelations) {
  const identityComplete =
    Boolean(provider.displayName) && hasDocument(provider, "id_front") && hasDocument(provider, "selfie");
  const servicesComplete = provider.bio.trim().length > 0 && readArray(provider.serviceIds).length > 0;
  const portfolioComplete = countPhotos(provider) >= minShowcasePhotos;
  const hasActiveAvailability = provider.availability.some((slot) => slot.active);
  const settingsComplete =
    Boolean(provider.settings) &&
    hasActiveAvailability &&
    (Boolean(provider.settings?.customQuoteEnabled) || provider.packages.some((item) => item.active));

  const tasks = [
    {
      key: "identity",
      label: "Identity Verification",
      detail: identityComplete ? "ID and phone completed" : "Upload your ID and selfie",
      complete: identityComplete,
      href: "/provider/verify-identity",
    },
    {
      key: "services",
      label: "Services and Bio",
      detail: servicesComplete ? "Profile details saved" : "Add your services and bio",
      complete: servicesComplete,
      href: "/provider/services",
    },
    {
      key: "portfolio",
      label: "Portfolio Photos",
      detail: portfolioComplete ? "Portfolio uploaded" : "Add at least one work photo",
      complete: portfolioComplete,
      href: "/provider/showcase",
    },
    {
      key: "settings",
      label: "Service Settings",
      detail: settingsComplete ? "Availability and packages completed" : "Set availability and pricing",
      complete: settingsComplete,
      href: "/provider/service-settings",
    },
  ];

  const trustBadges = [
    { key: "id_verified", label: "ID Verified", complete: identityComplete },
    { key: "phone_verified", label: "Phone Verified", complete: Boolean(user.phone) },
    { key: "work_photos", label: "Work Photos", complete: countPhotos(provider) > 0 },
    { key: "certificates", label: "Certificates", complete: countCertificates(provider) > 0 },
  ];

  const missingItems = tasks.filter((task) => !task.complete).map((task) => task.label);

  return { tasks, trustBadges, missingItems, canSubmit: missingItems.length === 0 };
}

function toResponse(user: UserRecord, provider: ProviderWithRelations) {
  const computed = computeStatus(user, provider);

  return {
    ok: true as const,
    providerId: provider.id,
    displayName: provider.displayName ?? user.name ?? "",
    serviceIds: readArray(provider.serviceIds),
    serviceNames: readArray(provider.serviceNames),
    languages: readArray(provider.languages),
    experienceLevel: provider.experienceLevel ?? "1-3",
    bio: provider.bio ?? "",
    translatedBio: provider.translatedBio ?? "",
    onboardingStatus: provider.onboardingStatus,
    ...computed,
  };
}

export async function GET(request: NextRequest) {
  try {
    const result = await getCurrentProvider(request);
    if ("error" in result) return result.error;

    return NextResponse.json(toResponse(result.user, result.provider));
  } catch (error) {
    console.error("Provider profile load failed", error);
    return NextResponse.json(
      {
        error: "Could not load profile details.",
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

    const { user, provider } = result;
    const computed = computeStatus(user, provider);

    if (!computed.canSubmit) {
      return NextResponse.json(
        {
          error: "Complete all onboarding steps before submitting for review.",
          missingItems: computed.missingItems,
        },
        { status: 400 },
      );
    }

    const now = new Date();
    const isResubmit = provider.onboardingStatus === "needs_fix" || Boolean(provider.submittedAt);

    await db.$transaction(async (tx) => {
      await tx.providerProfile.update({
        where: { id: provider.id },
        data: {
          onboardingStatus: "submitted",
          submittedAt: provider.submittedAt ?? now,
        },
      });

      await tx.providerVerificationStatus.upsert({
        where: { providerId: provider.id },
        update: {
          status: "submitted",
          missingItems: [],
          submittedAt: provider.submittedAt ?? now,
          ...(isResubmit ? { resubmittedAt: now } : {}),
        },
        create: {
          providerId: provider.id,
          status: "submitted",
          expectedReviewHours: 48,
          missingItems: [],
          submittedAt: now,
        },
      });
    });

    return NextResponse.json({
      ok: true as const,
      providerId: provider.id,
      onboardingStatus: "submitted",
      nextPath: "/provider/verification-status",
    });
  } catch (error) {
    console.error("Provider profile submit failed", error);
    return NextResponse.json(
      {
        error: "Could not submit profile for review.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}
