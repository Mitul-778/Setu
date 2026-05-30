import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isServiceId } from "@/lib/services";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown server error";
}

function normalizeInterests(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item))
    .filter(isServiceId)
    .filter((item, index, array) => array.indexOf(item) === index);
}

async function getCurrentUser(request: NextRequest) {
  const userId = request.cookies.get("setu_user_id")?.value;

  if (!userId) {
    return { error: NextResponse.json({ error: "Login is required." }, { status: 401 }) };
  }

  const user = await db.user.findUnique({ where: { id: userId }, select: { id: true, interests: true } });

  if (!user) {
    return { error: NextResponse.json({ error: "User session is invalid." }, { status: 401 }) };
  }

  return { user };
}

export async function GET(request: NextRequest) {
  try {
    const result = await getCurrentUser(request);
    if ("error" in result) return result.error;

    return NextResponse.json({ ok: true as const, interests: normalizeInterests(result.user.interests) });
  } catch (error) {
    console.error("Customer interests load failed", error);
    return NextResponse.json(
      {
        error: "Could not load your interests.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const result = await getCurrentUser(request);
    if ("error" in result) return result.error;

    const body = await request.json().catch(() => null);
    const interests = normalizeInterests(body?.serviceIds ?? body?.interests);

    await db.user.update({
      where: { id: result.user.id },
      data: { interests },
    });

    return NextResponse.json({ ok: true as const, interests, nextPath: "/customer" });
  } catch (error) {
    console.error("Customer interests save failed", error);
    return NextResponse.json(
      {
        error: "Could not save your interests.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}
