import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  providerDocumentBucket,
  uploadSetuFile,
  type SetuStorageBucket,
} from "@/lib/supabase-storage";

const pendingDocStatuses = ["needs_fix", "rejected"] as const;

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown server error";
}

function readArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

function safeFileName(name: string) {
  const safeName = name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-|-$/g, "");
  return safeName || "upload.jpg";
}

function purposeForDocType(type: string) {
  if (type === "selfie") return "provider_selfie" as const;
  if (type === "certificate") return "provider_certificate" as const;
  if (type === "fssai") return "provider_fssai" as const;
  return "provider_id_document" as const;
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
          documents: { include: { uploadedFile: true }, orderBy: { createdAt: "asc" } },
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
        documents: { include: { uploadedFile: true }, orderBy: { createdAt: "asc" } },
        verification: true,
      },
    }));

  return { user, provider };
}

type ProviderWithStatus = Extract<
  Awaited<ReturnType<typeof getCurrentProvider>>,
  { provider: unknown }
>["provider"];

function isPending(status: string) {
  return (pendingDocStatuses as readonly string[]).includes(status);
}

function toStatusResponse(provider: ProviderWithStatus) {
  const verification = provider.verification;
  const pendingActions = provider.documents
    .filter((doc) => isPending(doc.status))
    .map((doc) => ({
      id: doc.id,
      type: doc.type,
      title: doc.label,
      fix: doc.requiredFix ?? "Please re-upload this document.",
      currentUrl: doc.uploadedFile?.publicUrl ?? null,
    }));

  return {
    ok: true as const,
    providerId: provider.id,
    status: verification?.status ?? provider.onboardingStatus,
    expectedReviewHours: verification?.expectedReviewHours ?? 48,
    submittedAt: (provider.submittedAt ?? verification?.submittedAt)?.toISOString() ?? null,
    reviewedAt: verification?.reviewedAt?.toISOString() ?? null,
    resubmittedAt: verification?.resubmittedAt?.toISOString() ?? null,
    missingItems: readArray(verification?.missingItems),
    pendingActions,
  };
}

export async function GET(request: NextRequest) {
  try {
    const result = await getCurrentProvider(request);
    if ("error" in result) return result.error;

    return NextResponse.json(toStatusResponse(result.provider));
  } catch (error) {
    console.error("Provider verification status load failed", error);
    return NextResponse.json(
      {
        error: "Could not load verification status.",
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
    const formData = await request.formData();
    const pendingDocs = provider.documents.filter((doc) => isPending(doc.status));

    for (const doc of pendingDocs) {
      const value = formData.get(doc.id);
      if (!(value instanceof File) || value.size === 0) continue;

      if (!value.type.startsWith("image/")) {
        return NextResponse.json({ error: "Only image uploads are allowed." }, { status: 400 });
      }

      const uploaded = await uploadSetuFile({
        bucket: providerDocumentBucket as SetuStorageBucket,
        file: value,
        path: `providers/${provider.id}/documents/${doc.type}/${Date.now()}-${safeFileName(value.name)}`,
        contentType: value.type || "image/jpeg",
      });

      const uploadedFile = await db.uploadedFile.create({
        data: {
          ownerUserId: user.id,
          providerId: provider.id,
          bucket: uploaded.bucket,
          path: uploaded.path,
          publicUrl: uploaded.publicUrl,
          mimeType: value.type || null,
          sizeBytes: value.size,
          purpose: purposeForDocType(doc.type),
        },
      });

      await db.providerDocument.update({
        where: { id: doc.id },
        data: {
          uploadedFileId: uploadedFile.id,
          status: "pending",
          requiredFix: null,
          reviewedAt: null,
        },
      });
    }

    const refreshed = await db.providerProfile.findUniqueOrThrow({
      where: { id: provider.id },
      include: { documents: true },
    });
    const remaining = refreshed.documents.filter((doc) => isPending(doc.status));

    if (remaining.length === 0) {
      const now = new Date();
      await db.$transaction(async (tx) => {
        await tx.providerProfile.update({
          where: { id: provider.id },
          data: { onboardingStatus: "submitted", submittedAt: provider.submittedAt ?? now },
        });
        await tx.providerVerificationStatus.upsert({
          where: { providerId: provider.id },
          update: { status: "submitted", resubmittedAt: now, missingItems: [] },
          create: {
            providerId: provider.id,
            status: "submitted",
            expectedReviewHours: 48,
            submittedAt: now,
            resubmittedAt: now,
            missingItems: [],
          },
        });
      });
    }

    const final = await db.providerProfile.findUniqueOrThrow({
      where: { id: provider.id },
      include: {
        documents: { include: { uploadedFile: true }, orderBy: { createdAt: "asc" } },
        verification: true,
      },
    });

    return NextResponse.json(toStatusResponse(final));
  } catch (error) {
    console.error("Provider verification resubmit failed", error);
    return NextResponse.json(
      {
        error: "Could not resubmit for review.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}
