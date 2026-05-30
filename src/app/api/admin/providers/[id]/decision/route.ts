import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminRequest } from "@/lib/admin-auth";

type DecisionAction =
  | "approve"
  | "request_fixes"
  | "reject"
  | "approve_document"
  | "reject_document";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown server error";
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Admin sign-in required." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json().catch(() => null);
    const action = body?.action as DecisionAction;
    const notes = String(body?.notes ?? "").trim();
    const docInputs = Array.isArray(body?.documents) ? body.documents : [];

    if (
      !["approve", "request_fixes", "reject", "approve_document", "reject_document"].includes(action)
    ) {
      return NextResponse.json({ error: "Unknown review action." }, { status: 400 });
    }

    const provider = await db.providerProfile.findUnique({
      where: { id },
      include: { documents: true },
    });

    if (!provider) {
      return NextResponse.json({ error: "Provider not found." }, { status: 404 });
    }

    const now = new Date();
    const submittedAt = provider.submittedAt ?? now;

    if (action === "approve_document" || action === "reject_document") {
      const documentId = String(body?.documentId ?? "");
      const doc = provider.documents.find((item) => item.id === documentId);

      if (!doc) {
        return NextResponse.json({ error: "Document not found for this provider." }, { status: 400 });
      }

      if (action === "approve_document") {
        await db.providerDocument.update({
          where: { id: doc.id },
          data: { status: "approved", requiredFix: null, adminNotes: notes || null, reviewedAt: now },
        });

        const refreshed = await db.providerProfile.findUniqueOrThrow({
          where: { id },
          include: { documents: true },
        });
        const allApproved =
          refreshed.documents.length > 0 &&
          refreshed.documents.every((item) => item.status === "approved");

        if (allApproved) {
          await db.$transaction(async (tx) => {
            await tx.providerProfile.update({
              where: { id },
              data: { onboardingStatus: "approved", approvedAt: now },
            });
            await tx.providerVerificationStatus.upsert({
              where: { providerId: id },
              update: { status: "approved", reviewedAt: now, missingItems: [] },
              create: { providerId: id, status: "approved", reviewedAt: now, missingItems: [], submittedAt },
            });
          });
        }

        return NextResponse.json({
          ok: true as const,
          status: allApproved ? "approved" : refreshed.onboardingStatus,
          documentId: doc.id,
          documentStatus: "approved",
        });
      }

      // reject_document
      const requiredFix = notes || "Please re-upload this document.";
      await db.providerDocument.update({
        where: { id: doc.id },
        data: { status: "needs_fix", requiredFix, adminNotes: notes || null, reviewedAt: now },
      });

      const refreshed = await db.providerProfile.findUniqueOrThrow({
        where: { id },
        include: { documents: true },
      });
      const missingItems = refreshed.documents
        .filter((item) => item.status === "needs_fix" || item.status === "rejected")
        .map((item) => item.label);

      await db.$transaction(async (tx) => {
        await tx.providerProfile.update({ where: { id }, data: { onboardingStatus: "needs_fix" } });
        await tx.providerVerificationStatus.upsert({
          where: { providerId: id },
          update: { status: "needs_fix", reviewedAt: now, missingItems },
          create: { providerId: id, status: "needs_fix", reviewedAt: now, missingItems, submittedAt },
        });
      });

      return NextResponse.json({
        ok: true as const,
        status: "needs_fix",
        documentId: doc.id,
        documentStatus: "needs_fix",
      });
    }

    if (action === "approve") {
      await db.$transaction(async (tx) => {
        await tx.providerProfile.update({
          where: { id },
          data: { onboardingStatus: "approved", approvedAt: now },
        });
        await tx.providerDocument.updateMany({
          where: { providerId: id },
          data: { status: "approved", requiredFix: null, reviewedAt: now },
        });
        await tx.providerVerificationStatus.upsert({
          where: { providerId: id },
          update: { status: "approved", reviewedAt: now, missingItems: [] },
          create: { providerId: id, status: "approved", reviewedAt: now, missingItems: [], submittedAt },
        });
      });

      return NextResponse.json({ ok: true as const, status: "approved" });
    }

    if (action === "reject") {
      const missingItems = notes ? [notes] : [];
      await db.$transaction(async (tx) => {
        await tx.providerProfile.update({
          where: { id },
          data: { onboardingStatus: "rejected", rejectedAt: now },
        });
        await tx.providerVerificationStatus.upsert({
          where: { providerId: id },
          update: { status: "rejected", reviewedAt: now, missingItems },
          create: { providerId: id, status: "rejected", reviewedAt: now, missingItems, submittedAt },
        });
      });

      return NextResponse.json({ ok: true as const, status: "rejected" });
    }

    // request_fixes
    const validIds = new Set(provider.documents.map((doc) => doc.id));
    const fixes = docInputs
      .map((item: unknown) => {
        const record = item as { id?: unknown; requiredFix?: unknown };
        return { id: String(record?.id ?? ""), requiredFix: String(record?.requiredFix ?? "").trim() };
      })
      .filter((fix: { id: string; requiredFix: string }) => validIds.has(fix.id) && fix.requiredFix);

    if (!fixes.length) {
      return NextResponse.json(
        { error: "Select at least one document and describe the required fix." },
        { status: 400 },
      );
    }

    const missingItems = fixes.map((fix: { id: string; requiredFix: string }) => {
      const doc = provider.documents.find((item) => item.id === fix.id);
      return doc?.label ?? "Document";
    });

    await db.$transaction(async (tx) => {
      for (const fix of fixes) {
        await tx.providerDocument.update({
          where: { id: fix.id },
          data: {
            status: "needs_fix",
            requiredFix: fix.requiredFix,
            adminNotes: notes || null,
            reviewedAt: now,
          },
        });
      }
      await tx.providerProfile.update({
        where: { id },
        data: { onboardingStatus: "needs_fix" },
      });
      await tx.providerVerificationStatus.upsert({
        where: { providerId: id },
        update: { status: "needs_fix", reviewedAt: now, missingItems },
        create: { providerId: id, status: "needs_fix", reviewedAt: now, missingItems, submittedAt },
      });
    });

    return NextResponse.json({ ok: true as const, status: "needs_fix" });
  } catch (error) {
    console.error("Admin provider decision failed", error);
    return NextResponse.json(
      {
        error: "Could not save review decision.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}
