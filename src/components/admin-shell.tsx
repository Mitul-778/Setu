"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { OpsIcon } from "@/components/ops-icon";
import { adminLogout } from "@/services/admin-service";

const navItems = [
  { label: "Dashboard", icon: "dashboard", href: "#", active: false },
  { label: "Applicants", icon: "group", href: "/admin", active: true },
  { label: "Verification", icon: "fact_check", href: "#", active: false },
  { label: "Documents", icon: "description", href: "#", active: false },
  { label: "Settings", icon: "settings", href: "#", active: false },
  { label: "Audit Logs", icon: "history", href: "#", active: false },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await adminLogout();
    } finally {
      router.push("/admin/login");
    }
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-[var(--background)] text-[var(--on-surface)]">
      {/* SideNavBar */}
      <nav className="fixed left-0 top-0 z-20 flex h-dvh w-[260px] flex-col border-r border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-4 py-6">
        <div className="mb-12 flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-[var(--outline-variant)] bg-[var(--surface-variant)]">
            <OpsIcon className="text-[20px] text-[var(--primary)]" name="layers" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[var(--primary)]">Setu Ops</h1>
            <p className="text-[11px] font-semibold text-[var(--on-surface-variant)]">Operations Console</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => (
            <Link
              className={
                item.active
                  ? "flex items-center gap-2 rounded-r border-l-4 border-[var(--primary)] bg-[var(--surface-container-highest)] px-2 py-2 text-sm font-medium text-[var(--primary)]"
                  : "flex items-center gap-2 rounded px-2 py-2 text-sm text-[var(--on-surface-variant)] transition-colors hover:bg-[var(--surface-container-high)]"
              }
              href={item.href}
              key={item.label}
            >
              <OpsIcon className="text-[20px]" filled={item.active} name={item.icon} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="mt-auto border-t border-[var(--outline-variant)] pt-4">
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-[var(--outline-variant)] bg-[var(--surface-variant)]">
              <OpsIcon className="text-[16px] text-[var(--on-surface-variant)]" name="person" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-xs font-medium text-[var(--on-surface)]">Admin User</span>
              <span className="truncate text-[11px] text-[var(--on-surface-variant)]">admin@setu.ops</span>
            </div>
            <button
              aria-label="Sign out"
              className="flex h-8 w-8 items-center justify-center rounded text-[var(--on-surface-variant)] transition-colors hover:bg-[var(--surface-container-high)] hover:text-[var(--primary)]"
              onClick={handleLogout}
              type="button"
            >
              <OpsIcon className="text-[18px]" name="logout" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main container */}
      <div className="ml-[260px] flex h-dvh flex-1 flex-col overflow-hidden">
        {/* TopNavBar */}
        <header className="fixed right-0 top-0 z-10 flex h-16 w-[calc(100%-260px)] items-center justify-between border-b border-[var(--outline-variant)] bg-[var(--surface)] px-6">
          <div className="flex w-full max-w-md items-center">
            <div className="relative w-full">
              <OpsIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[var(--on-surface-variant)]"
                name="search"
              />
              <input
                className="w-full rounded border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] py-2 pl-10 pr-4 text-xs text-[var(--on-surface)] outline-none transition-colors placeholder:text-[var(--on-surface-variant)] focus:border-[var(--primary)]"
                placeholder="Search applicants, ID, or documents..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              aria-label="Notifications"
              className="flex h-8 w-8 items-center justify-center rounded text-[var(--on-surface-variant)] transition-colors hover:bg-[var(--surface-container-high)] hover:text-[var(--primary)]"
              type="button"
            >
              <OpsIcon className="text-[20px]" name="notifications" />
            </button>
          </div>
        </header>

        {/* Main content canvas */}
        <main className="mt-16 flex h-[calc(100dvh-4rem)] flex-1 overflow-hidden p-6">{children}</main>
      </div>
    </div>
  );
}
