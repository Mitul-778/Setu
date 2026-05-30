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
      preferredLang: "en",
    },
    include: { providerProfile: true },
  });

  let providerStatus = user.providerProfile?.onboardingStatus ?? null;

  if (intent === "provider" && !user.providerProfile) {
    const created = await db.providerProfile.create({
      data: {
        userId: user.id,
        onboardingStatus: "draft",
        serviceIds: [],
        serviceNames: [],
        languages: [],
      },
    });
    providerStatus = created.onboardingStatus;
  }

  function providerNextPath() {
    // Already onboarded providers skip the onboarding flow.
    if (providerStatus === "approved" || providerStatus === "submitted") return "/provider/dashboard";
    if (providerStatus === "needs_fix" || providerStatus === "rejected") return "/provider/verification-status";
    return "/provider";
  }

  function customerNextPath() {
    // First-time customers (no name yet) complete their profile first.
    return user.name ? "/customer" : "/profile-setup";
  }

  const nextPath = intent === "provider" ? providerNextPath() : customerNextPath();
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
