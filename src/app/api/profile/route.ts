import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { LANGUAGES } from "@/lib/categories";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown server error";
}

const validLangCodes: string[] = LANGUAGES.map((language) => language.code);

function normalizeLang(value: unknown) {
  const code = String(value ?? "").trim();
  return validLangCodes.includes(code) ? code : "en";
}

async function getUser(request: NextRequest) {
  const userId = request.cookies.get("setu_user_id")?.value;
  if (!userId) return { error: NextResponse.json({ error: "Login is required." }, { status: 401 }) };

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      name: true,
      email: true,
      phone: true,
      preferredLang: true,
      city: true,
      area: true,
    },
  });

  if (!user) return { error: NextResponse.json({ error: "User session is invalid." }, { status: 401 }) };
  return { user };
}

export async function GET(request: NextRequest) {
  try {
    const result = await getUser(request);
    if ("error" in result) return result.error;

    return NextResponse.json({ ok: true as const, profile: result.user });
  } catch (error) {
    console.error("Profile load failed", error);
    return NextResponse.json(
      {
        error: "Could not load your profile.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const result = await getUser(request);
    if ("error" in result) return result.error;

    const body = await request.json().catch(() => null);
    const name = String(body?.name ?? "").trim();
    const email = body?.email ? String(body.email).trim() : null;
    const preferredLang = normalizeLang(body?.preferredLang);

    if (!name) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }

    const user = await db.user.update({
      where: { id: result.user.id },
      data: { name, email, preferredLang },
      select: {
        id: true,
        role: true,
        name: true,
        email: true,
        phone: true,
        preferredLang: true,
        city: true,
        area: true,
      },
    });

    return NextResponse.json({ ok: true as const, profile: user });
  } catch (error) {
    console.error("Profile save failed", error);
    return NextResponse.json(
      {
        error: "Could not save your profile.",
        detail: process.env.NODE_ENV === "production" ? undefined : getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}
