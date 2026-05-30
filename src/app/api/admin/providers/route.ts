import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminRequest } from "@/lib/admin-auth";

type StatusFilter = "queue" | "submitted" | "needs_fix" | "approved" | "rejected" | "all";

const queueStatuses = ["submitted", "needs_fix"] as const;

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown server error";
}

function resolveWhere(filter: StatusFilter) {
  if (filter === "all") return {};
  if (filter === "queue") return { onboardingStatus: { in: [...queueStatuses] } };
  return { onboardingStatus: filter };
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Admin sign-in required." }, { status: 401 });
  }

  try {
    const requested = request.nextUrl.searchParams.get("status") ?? "queue";
    const filter = (
      ["queue", "submitted", "needs_fix", "approved", "rejected", "all"].includes(requested)
        ? requested
        : "queue"
    ) as StatusFilter;

    const providers = await db.providerProfile.findMany({
      where: resolveWhere(filter),
      orderBy: [{ submittedAt: "desc" }, { updatedAt: "desc" }],
      include: {
        user: { select: { phone: true } },
        documents: { select: { status: true } },
      },
    });

    return NextResponse.json({
      ok: true as const,
      filter,
      providers: providers.map((provider) => ({
        id: provider.id,
        displayName: provider.displayName ?? "Unnamed provider",
        category: provider.category ?? "",
        city: provider.city ?? "",
        area: provider.area ?? "",
        phone: provider.user.phone,
        status: provider.onboardingStatus,
        trustScore: provider.trustScore,
        submittedAt: provider.submittedAt?.toISOString() ?? null,
        pendingDocs: provider.documents.filter(
          (doc) => doc.status === "needs_fix" || doc.status === "rejected",
        ).length,
        approvedDocs: provider.documents.filter((doc) => doc.status === "approved").length,
        totalDocs: provider.documents.length,
      })),
    });
  } catch (error) {
    console.error("Admin provider list failed", error);
    return NextResponse.json(
      {
        error: "Could not load providers.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}
