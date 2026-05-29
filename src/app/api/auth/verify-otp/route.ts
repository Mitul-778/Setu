import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const otp = String(body?.otp ?? "").replace(/\D/g, "");
  const phone = request.cookies.get("setu_pending_phone")?.value;
  const intent = request.cookies.get("setu_auth_intent")?.value === "provider" ? "provider" : "customer";

  if (!phone) {
    return NextResponse.json({ error: "OTP session expired. Please request a new OTP." }, { status: 400 });
  }

  if (otp !== "123456") {
    return NextResponse.json({ error: "Invalid OTP." }, { status: 400 });
  }

  const user = await db.user.upsert({
    where: { phone },
    update: { role: intent },
    create: {
      phone,
      role: intent,
      name: intent === "provider" ? "Setu Provider" : "Setu Customer",
      preferredLang: "en",
    },
    include: { providerProfile: true },
  });

  if (intent === "provider" && !user.providerProfile) {
    await db.providerProfile.create({
      data: {
        userId: user.id,
        displayName: user.name,
        onboardingStatus: "draft",
        serviceIds: [],
        serviceNames: [],
        languages: [],
      },
    });
  }

  const nextPath = intent === "provider" ? "/provider" : "/permissions";
  const response = NextResponse.json({ ok: true, nextPath, userId: user.id, role: intent });

  response.cookies.set("setu_user_id", user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  response.cookies.set("setu_role", intent, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  response.cookies.delete("setu_pending_phone");
  response.cookies.delete("setu_auth_intent");

  return response;
}
