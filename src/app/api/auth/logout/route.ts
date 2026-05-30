import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true, nextPath: "/" });
  response.cookies.delete("setu_user_id");
  response.cookies.delete("setu_role");
  return response;
}
