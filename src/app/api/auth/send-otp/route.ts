import { NextRequest, NextResponse } from "next/server";

function normalizeIndianPhone(rawPhone: unknown) {
  const digits = String(rawPhone ?? "").replace(/\D/g, "");
  const lastTen = digits.slice(-10);

  if (lastTen.length !== 10) {
    return null;
  }

  return `+91${lastTen}`;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const phone = normalizeIndianPhone(body?.phone);
  const intent = body?.intent === "provider" ? "provider" : "customer";

  if (!phone) {
    return NextResponse.json({ error: "Enter a valid 10-digit mobile number." }, { status: 400 });
  }

  const response = NextResponse.json({
    ok: true,
    maskedPhone: `${phone.slice(0, 3)} ${phone.slice(3, 8)} ${phone.slice(8)}`,
  });

  response.cookies.set("setu_pending_phone", phone, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 10 * 60,
    path: "/",
  });
  response.cookies.set("setu_auth_intent", intent, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 10 * 60,
    path: "/",
  });

  return response;
}
