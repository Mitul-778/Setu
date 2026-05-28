import {
  Bell,
  ChevronRight,
  CreditCard,
  Flag,
  Grid2X2,
  Info,
  Languages,
  LogOut,
  MapPin,
  Pencil,
  Shield,
  User,
  Verified,
} from "lucide-react";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

const preferenceItems = [
  {
    label: "Language Preference",
    detail: "English",
    icon: Languages,
  },
  {
    label: "Saved Addresses",
    icon: MapPin,
  },
  {
    label: "Payment Methods",
    icon: CreditCard,
  },
  {
    label: "Notification Settings",
    icon: Bell,
  },
];

const privacyItems = [
  {
    label: "Privacy Policy",
    icon: Shield,
  },
  {
    label: "Trust Center",
    icon: Verified,
  },
];

const supportItems = [
  {
    label: "Report an Issue",
    icon: Flag,
  },
  {
    label: "About Setu",
    icon: Info,
  },
];

export default function ProfilePage() {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full max-w-[480px] overflow-x-hidden bg-[var(--surface-container-low)] pb-[calc(96px+env(safe-area-inset-bottom))]">
        <header className="sticky top-0 z-40 border-b border-[var(--surface-variant)] bg-[var(--surface)]">
          <div className="flex h-12 items-center justify-between px-4 min-[390px]:px-5">
            <button
              aria-label="Open menu"
              className="flex min-h-10 min-w-10 items-center justify-center rounded-md text-[var(--on-surface-variant)]"
              type="button"
            >
              <Grid2X2 className="h-5 w-5" />
            </button>
            <h1 className="text-headline-sm text-[var(--on-surface)]">Setu</h1>
            <button
              aria-label="Profile"
              className="flex min-h-10 min-w-10 items-center justify-center rounded-md text-[var(--on-surface-variant)]"
              type="button"
            >
              <User className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="px-4 pt-6 min-[390px]:px-5">
          <ProfileHeader />

          <SettingsSection
            items={preferenceItems}
            title="Settings & Preferences"
          />
          <SettingsSection items={privacyItems} title="Security & Privacy" />
          <SettingsSection items={supportItems} title="Support & Legal" />

          <button className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface)] text-label-lg text-[var(--error)] shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>

        <MobileBottomNav active="profile" />
      </div>
    </main>
  );
}

function ProfileHeader() {
  return (
    <section className="flex flex-col items-center pb-8 pt-3">
      <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-highest)] shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]">
        <User className="h-12 w-12 text-[var(--on-surface-variant)]" />
      </div>
      <h2 className="mt-4 text-headline-sm text-[var(--on-surface)]">
        Rohan Sharma
      </h2>
      <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
        Member since Jan 2024
      </p>
      <button className="mt-5 flex min-h-10 items-center gap-2 rounded-full border border-[var(--primary)] bg-transparent px-5 text-label-lg text-[var(--primary)]">
        <Pencil className="h-4 w-4" />
        <span>Edit Profile</span>
      </button>
    </section>
  );
}

function SettingsSection({
  title,
  items,
}: {
  title: string;
  items: Array<{
    label: string;
    detail?: string;
    icon: typeof Languages;
  }>;
}) {
  return (
    <section className="mb-6">
      <h3 className="mb-2 ml-2 text-label-md uppercase tracking-wide text-[var(--on-surface-variant)]">
        {title}
      </h3>
      <div className="overflow-hidden rounded-lg border border-[var(--surface-variant)] bg-[var(--surface)] shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]">
        {items.map(({ label, detail, icon: Icon }) => (
          <button
            className="flex min-h-14 w-full items-center justify-between gap-3 border-[var(--surface-variant)] p-4 text-left last:border-b-0 [&:not(:last-child)]:border-b"
            key={label}
            type="button"
          >
            <div className="flex min-w-0 items-center gap-4">
              <Icon className="h-5 w-5 shrink-0 text-[var(--on-surface-variant)]" />
              <div className="min-w-0">
                <p className="truncate text-body-md text-[var(--on-surface)]">
                  {label}
                </p>
                {detail && (
                  <p className="truncate text-body-sm text-[var(--on-surface-variant)]">
                    {detail}
                  </p>
                )}
              </div>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-[var(--outline-variant)]" />
          </button>
        ))}
      </div>
    </section>
  );
}
