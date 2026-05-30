import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminRequest } from "@/lib/admin-auth";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown server error";
}

function readArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Admin sign-in required." }, { status: 401 });
  }

  try {
    const { id } = await params;

    const provider = await db.providerProfile.findUnique({
      where: { id },
      include: {
        user: { select: { phone: true, email: true } },
        documents: { include: { uploadedFile: true }, orderBy: { createdAt: "asc" } },
        portfolio: { include: { uploadedFile: true }, orderBy: { createdAt: "desc" } },
        packages: { where: { active: true }, orderBy: { priceInr: "asc" } },
        verification: true,
      },
    });

    if (!provider) {
      return NextResponse.json({ error: "Provider not found." }, { status: 404 });
    }

    return NextResponse.json({
      ok: true as const,
      provider: {
        id: provider.id,
        displayName: provider.displayName ?? "Unnamed provider",
        headline: provider.headline ?? "",
        bio: provider.bio ?? "",
        translatedBio: provider.translatedBio ?? "",
        category: provider.category ?? "",
        serviceNames: readArray(provider.serviceNames),
        languages: readArray(provider.languages),
        experienceLevel: provider.experienceLevel ?? "",
        city: provider.city ?? "",
        area: provider.area ?? "",
        phone: provider.user.phone,
        email: provider.user.email ?? "",
        status: provider.onboardingStatus,
        trustScore: provider.trustScore,
        submittedAt: provider.submittedAt?.toISOString() ?? null,
        approvedAt: provider.approvedAt?.toISOString() ?? null,
        rejectedAt: provider.rejectedAt?.toISOString() ?? null,
      },
      documents: provider.documents.map((doc) => ({
        id: doc.id,
        type: doc.type,
        label: doc.label,
        status: doc.status,
        requiredFix: doc.requiredFix ?? "",
        adminNotes: doc.adminNotes ?? "",
        url: doc.uploadedFile?.publicUrl ?? null,
      })),
      portfolio: provider.portfolio.map((item) => ({
        id: item.id,
        type: item.type,
        title: item.title ?? item.type,
        url: item.mediaUrl ?? item.uploadedFile?.publicUrl ?? null,
      })),
      packages: provider.packages.map((pkg) => ({
        id: pkg.id,
        name: pkg.name,
        description: pkg.description,
        priceInr: pkg.priceInr,
        durationMin: pkg.durationMin,
      })),
      verification: provider.verification
        ? {
            status: provider.verification.status,
            expectedReviewHours: provider.verification.expectedReviewHours,
            missingItems: readArray(provider.verification.missingItems),
            submittedAt: provider.verification.submittedAt?.toISOString() ?? null,
            reviewedAt: provider.verification.reviewedAt?.toISOString() ?? null,
            resubmittedAt: provider.verification.resubmittedAt?.toISOString() ?? null,
          }
        : null,
    });
  } catch (error) {
    console.error("Admin provider detail failed", error);
    return NextResponse.json(
      {
        error: "Could not load provider.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}
