import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown server error";
}

export async function POST(request: NextRequest) {
  const userId = request.cookies.get("setu_user_id")?.value;

  if (!userId) {
    return NextResponse.json({ error: "Login is required." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const city = String(body?.city ?? "").trim();
  const area = body?.area ? String(body.area).trim() : null;
  const lat = Number(body?.lat);
  const lng = Number(body?.lng);

  if (!city) {
    return NextResponse.json({ error: "Please select a location." }, { status: 400 });
  }
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "Valid coordinates are required." }, { status: 400 });
  }

  try {
    const user = await db.user.update({
      where: { id: userId },
      data: { city, area, lat, lng },
      select: { id: true, city: true, area: true, lat: true, lng: true },
    });

    return NextResponse.json({ ok: true as const, ...user, nextPath: "/interests" });
  } catch (error) {
    console.error("Customer location save failed", error);
    return NextResponse.json(
      {
        error: "Could not save your location.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}
