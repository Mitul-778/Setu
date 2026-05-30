import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { adminCookieName, adminSessionValue } from "@/lib/admin-auth";

export default async function AdminConsoleLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();

  if (cookieStore.get(adminCookieName)?.value !== adminSessionValue) {
    redirect("/admin/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
