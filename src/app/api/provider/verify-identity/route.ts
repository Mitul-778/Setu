import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { providerDocumentBucket, uploadSetuFile } from "@/lib/supabase-storage";

const documentFields = [
  { field: "documentFront", type: "id_front", labelSuffix: "front", purpose: "provider_id_document" },
  { field: "documentBack", type: "id_back", labelSuffix: "back", purpose: "provider_id_document" },
  { field: "selfie", type: "selfie", labelSuffix: "selfie", purpose: "provider_selfie" },
] as const;

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function asImageFile(value: FormDataEntryValue | null) {
  if (!(value instanceof File) || value.size === 0) return null;
  return value.type.startsWith("image/") ? value : "invalid";
}

function safeFileName(name: string) {
  const safeName = name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-|-$/g, "");
  return safeName || "upload.jpg";
}

function inferCityFromServiceArea(serviceArea: string) {
  const parts = serviceArea.split(",").map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 3) return parts[1];
  return parts[0];
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown server error";
}

export async function POST(request: NextRequest) {
  try {
    return await saveProviderIdentity(request);
  } catch (error) {
    const detail = getErrorMessage(error);
    console.error("Provider identity save failed", error);

    return NextResponse.json(
      {
        error: "Could not save identity details.",
        detail: process.env.NODE_ENV === "production" ? undefined : detail,
      },
      { status: 500 },
    );
  }
}

async function saveProviderIdentity(request: NextRequest) {
  const userId = request.cookies.get("setu_user_id")?.value;

  if (!userId) {
    return NextResponse.json({ error: "Login is required." }, { status: 401 });
  }

  const formData = await request.formData();
  const displayName = asString(formData.get("displayName"));
  const documentType = asString(formData.get("documentType")) || "Aadhaar Card";
  const serviceArea = asString(formData.get("serviceArea"));
  const serviceRadiusKm = Number(asString(formData.get("serviceRadiusKm")) || 10);
  const serviceLat = Number(asString(formData.get("serviceLat")));
  const serviceLng = Number(asString(formData.get("serviceLng")));

  if (!displayName) {
    return NextResponse.json({ error: "Provider name is required." }, { status: 400 });
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { providerProfile: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User session is invalid." }, { status: 401 });
  }

  const provider = user.providerProfile ?? await db.providerProfile.create({
    data: {
      userId: user.id,
      displayName,
      onboardingStatus: "draft",
      serviceIds: [],
      serviceNames: [],
      languages: [],
    },
  });

  await db.user.update({
    where: { id: user.id },
    data: { name: displayName },
  });

  await db.providerProfile.update({
    where: { id: provider.id },
    data: {
      displayName,
      area: serviceArea || provider.area,
      city: serviceArea ? inferCityFromServiceArea(serviceArea) : provider.city,
      serviceRadiusKm: Number.isFinite(serviceRadiusKm) ? serviceRadiusKm : provider.serviceRadiusKm,
      lat: Number.isFinite(serviceLat) ? serviceLat : provider.lat,
      lng: Number.isFinite(serviceLng) ? serviceLng : provider.lng,
    },
  });

  await db.providerDocument.deleteMany({
    where: {
      providerId: provider.id,
      type: { in: documentFields.map((item) => item.type) },
    },
  });

  for (const item of documentFields) {
    const file = asImageFile(formData.get(item.field));

    if (file === "invalid") {
      return NextResponse.json({ error: "Only image uploads are allowed." }, { status: 400 });
    }

    if (!file) continue;

    const uploaded = await uploadSetuFile({
      bucket: providerDocumentBucket,
      file,
      path: `providers/${provider.id}/identity/${Date.now()}-${item.type}-${safeFileName(file.name)}`,
      contentType: file.type || "image/jpeg",
    });

    const uploadedFile = await db.uploadedFile.create({
      data: {
        ownerUserId: user.id,
        providerId: provider.id,
        bucket: uploaded.bucket,
        path: uploaded.path,
        publicUrl: uploaded.publicUrl,
        mimeType: file.type || null,
        sizeBytes: file.size,
        purpose: item.purpose,
      },
    });

    await db.providerDocument.create({
      data: {
        providerId: provider.id,
        uploadedFileId: uploadedFile.id,
        type: item.type,
        label: item.type === "selfie" ? "Selfie Verification" : `${documentType} ${item.labelSuffix}`,
        status: "pending",
      },
    });
  }

  await db.providerVerificationStatus.upsert({
    where: { providerId: provider.id },
    update: {
      status: "draft",
      missingItems: [],
    },
    create: {
      providerId: provider.id,
      status: "draft",
      expectedReviewHours: 48,
      missingItems: [],
    },
  });

  return NextResponse.json({ ok: true, providerId: provider.id, nextPath: "/provider/services" });
}
