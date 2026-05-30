import { NextRequest, NextResponse } from "next/server";
import { adminCookieName, adminSessionValue, getAdminPasscode } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const passcode = String(body?.passcode ?? "");

  if (!passcode || passcode !== getAdminPasscode()) {
    return NextResponse.json({ error: "Incorrect admin passcode." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, nextPath: "/admin" });

  response.cookies.set(adminCookieName, adminSessionValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 12,
    path: "/",
  });

  return response;
}
