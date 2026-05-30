import type { NextRequest } from "next/server";

export const adminCookieName = "setu_admin";
export const adminSessionValue = "1";

export function getAdminPasscode() {
  return process.env.ADMIN_PASSCODE ?? "setu-admin";
}

export function isAdminRequest(request: NextRequest) {
  return request.cookies.get(adminCookieName)?.value === adminSessionValue;
}
