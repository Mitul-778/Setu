import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  providerDocumentBucket,
  providerPortfolioBucket,
  uploadSetuFile,
  type SetuStorageBucket,
} from "@/lib/supabase-storage";

const maxShowcasePhotos = 5;

const portfolioFields = [
  { field: "photos", type: "photo", purpose: "provider_portfolio", title: "Work photo", allowedPrefix: "image/" },
  { field: "introVideos", type: "intro_video", purpose: "provider_portfolio", title: "Intro video", allowedPrefix: "video/" },
  { field: "menuImages", type: "service_menu", purpose: "provider_portfolio", title: "Service menu", allowedPrefix: "image/" },
] as const;

const documentFields = [
  { field: "fssaiDocuments", type: "fssai", purpose: "provider_fssai", label: "FSSAI Document" },
  { field: "certificates", type: "certificate", purpose: "provider_certificate", label: "License or Certificate" },
] as const;

type UploadPurpose =
  | "provider_portfolio"
  | "provider_certificate"
  | "provider_fssai";

function asAllowedFiles(formData: FormData, field: string, allowedPrefix: string) {
  const values = formData.getAll(field);
  const files: File[] = [];

  for (const value of values) {
    if (!(value instanceof File) || value.size === 0) continue;
    if (!value.type.startsWith(allowedPrefix)) return "invalid" as const;
    files.push(value);
  }

  return files;
}

function safeFileName(name: string) {
  const safeName = name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-|-$/g, "");
  return safeName || "upload.jpg";
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown server error";
}

function requiresFssaiForServices(serviceIds: unknown) {
  if (!Array.isArray(serviceIds)) return false;

  return serviceIds.some((serviceId) => {
    const normalized = String(serviceId).toLowerCase();
    return normalized.includes("chef") || normalized.includes("food") || normalized.includes("cater");
  });
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

function toResponse(providerId: string, portfolio: Array<{
  id: string;
  title: string | null;
  type: string;
  mediaUrl: string | null;
  uploadedFile?: { path: string; publicUrl: string | null } | null;
}>, documents: Array<{
  id: string;
  label: string;
  type: string;
  uploadedFile?: { path: string; publicUrl: string | null } | null;
}>, requiresFssai: boolean) {
  return {
    ok: true as const,
    providerId,
    portfolio: portfolio.map((item) => ({
      id: item.id,
      label: item.title ?? item.type,
      type: item.type,
      url: item.mediaUrl ?? item.uploadedFile?.publicUrl ?? "",
      fileName: item.uploadedFile?.path.split("/").pop() ?? null,
    })).filter((item) => item.url),
    documents: documents.map((item) => ({
      id: item.id,
      label: item.label,
      type: item.type,
      url: item.uploadedFile?.publicUrl ?? "",
      fileName: item.uploadedFile?.path.split("/").pop() ?? null,
    })).filter((item) => item.url),
    requiresFssai,
    nextPath: "/provider/service-settings",
  };
}

async function uploadProviderFile({
  bucket,
  file,
  path,
}: {
  bucket: SetuStorageBucket;
  file: File;
  path: string;
}) {
  return uploadSetuFile({
    bucket,
    file,
    path,
    contentType: file.type || "image/jpeg",
  });
}

export async function GET(request: NextRequest) {
  try {
    const result = await getCurrentProvider(request);
    if ("error" in result) return result.error;

    const [portfolio, documents] = await Promise.all([
      db.portfolioItem.findMany({
        where: { providerId: result.provider.id },
        include: { uploadedFile: true },
        orderBy: { createdAt: "desc" },
      }),
      db.providerDocument.findMany({
        where: {
          providerId: result.provider.id,
          type: { in: documentFields.map((item) => item.type) },
        },
        include: { uploadedFile: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json(toResponse(result.provider.id, portfolio, documents, requiresFssaiForServices(result.provider.serviceIds)));
  } catch (error) {
    console.error("Provider showcase load failed", error);
    return NextResponse.json(
      {
        error: "Could not load showcase details.",
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

    const formData = await request.formData();
    const requiresFssai = requiresFssaiForServices(result.provider.serviceIds);

    for (const item of portfolioFields) {
      const files = asAllowedFiles(formData, item.field, item.allowedPrefix);
      if (files === "invalid") {
        return NextResponse.json({ error: "Only supported media uploads are allowed." }, { status: 400 });
      }

      let uploadFiles = files;

      if (item.type === "photo") {
        const existingPhotoCount = await db.portfolioItem.count({
          where: { providerId: result.provider.id, type: "photo" },
        });
        uploadFiles = files.slice(0, Math.max(0, maxShowcasePhotos - existingPhotoCount));
      }

      for (const file of uploadFiles) {
        const uploaded = await uploadProviderFile({
          bucket: providerPortfolioBucket,
          file,
          path: `providers/${result.provider.id}/showcase/${item.type}/${Date.now()}-${safeFileName(file.name)}`,
        });

        const uploadedFile = await db.uploadedFile.create({
          data: {
            ownerUserId: result.user.id,
            providerId: result.provider.id,
            bucket: uploaded.bucket,
            path: uploaded.path,
            publicUrl: uploaded.publicUrl,
            mimeType: file.type || null,
            sizeBytes: file.size,
            purpose: item.purpose as UploadPurpose,
          },
        });

        await db.portfolioItem.create({
          data: {
            providerId: result.provider.id,
            uploadedFileId: uploadedFile.id,
            type: item.type,
            title: item.title,
            mediaUrl: uploaded.publicUrl,
          },
        });
      }
    }

    for (const item of documentFields.filter((field) => requiresFssai || field.type !== "fssai")) {
      const files = asAllowedFiles(formData, item.field, "image/");
      if (files === "invalid") {
        return NextResponse.json({ error: "Only supported media uploads are allowed." }, { status: 400 });
      }

      for (const file of files) {
        const uploaded = await uploadProviderFile({
          bucket: providerDocumentBucket,
          file,
          path: `providers/${result.provider.id}/documents/${item.type}/${Date.now()}-${safeFileName(file.name)}`,
        });

        const uploadedFile = await db.uploadedFile.create({
          data: {
            ownerUserId: result.user.id,
            providerId: result.provider.id,
            bucket: uploaded.bucket,
            path: uploaded.path,
            publicUrl: uploaded.publicUrl,
            mimeType: file.type || null,
            sizeBytes: file.size,
            purpose: item.purpose as UploadPurpose,
          },
        });

        await db.providerDocument.create({
          data: {
            providerId: result.provider.id,
            uploadedFileId: uploadedFile.id,
            type: item.type,
            label: item.label,
            status: "pending",
          },
        });
      }
    }


    await db.providerProfile.update({
      where: { id: result.provider.id },
      data: { onboardingStatus: "draft" },
    });

    const [portfolio, documents] = await Promise.all([
      db.portfolioItem.findMany({
        where: { providerId: result.provider.id },
        include: { uploadedFile: true },
        orderBy: { createdAt: "desc" },
      }),
      db.providerDocument.findMany({
        where: {
          providerId: result.provider.id,
          type: { in: documentFields.map((item) => item.type) },
        },
        include: { uploadedFile: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json(toResponse(result.provider.id, portfolio, documents, requiresFssaiForServices(result.provider.serviceIds)));
  } catch (error) {
    console.error("Provider showcase save failed", error);
    return NextResponse.json(
      {
        error: "Could not save showcase details.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}
