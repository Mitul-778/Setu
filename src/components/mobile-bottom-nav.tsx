import Link from "next/link";
import { CalendarDays, Home, User, Wrench } from "lucide-react";

type ActiveTab = "home" | "search" | "bookings" | "profile" | "services";

const items = [
  { label: "Home", href: "/customer", icon: Home, key: "home" },
  { label: "Services", href: "/customer", icon: Wrench, key: "services" },
  { label: "Bookings", href: "/customer/bookings", icon: CalendarDays, key: "bookings" },
  { label: "Profile", href: "/profile", icon: User, key: "profile" },
] satisfies Array<{
  label: string;
  href: string;
  icon: typeof Home;
  key: ActiveTab;
}>;

export function MobileBottomNav({ active }: { active: ActiveTab }) {
  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]">
      <div className="mx-auto grid h-20 w-full max-w-[480px] grid-cols-4 px-1 pb-[env(safe-area-inset-bottom)] text-[var(--on-surface-variant)] min-[390px]:px-2">
        {items.map(({ label, href, icon: Icon, key }) => {
          const isActive = active === key;
          return (
            <Link
              className="flex min-h-16 flex-col items-center justify-center gap-1 text-label-md"
              href={href}
              key={key}
            >
              <span
                className={
                  isActive
                    ? "flex h-8 w-14 items-center justify-center rounded-full bg-[var(--secondary-container)] text-[var(--on-secondary-container)] min-[390px]:w-16"
                    : "flex h-8 w-14 items-center justify-center rounded-full min-[390px]:w-16"
                }
              >
                <Icon className="h-5 w-5" fill={isActive ? "currentColor" : "none"} />
              </span>
              <span className={isActive ? "text-[var(--primary)]" : undefined}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
