"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Flag,
  Info,
  Languages,
  LogOut,
  MapPin,
  Phone,
  Shield,
  User,
  Verified,
} from "lucide-react";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { LANGUAGES } from "@/lib/categories";
import { loadProfile, logout, saveProfile, type Profile } from "@/services/profile-service";

const privacyItems = [
  { label: "Privacy Policy", icon: Shield },
  { label: "Trust Center", icon: Verified },
];

const supportItems = [
  { label: "Report an Issue", icon: Flag },
  { label: "About Setu", icon: Info },
];

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [lang, setLang] = useState("en");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadProfile()
      .then((data) => {
        if (cancelled) return;
        setProfile(data.profile);
        setName(data.profile.name ?? "");
        setEmail(data.profile.email ?? "");
        setLang(data.profile.preferredLang || "en");
        setError("");
      })
      .catch((loadError) => {
        if (cancelled) return;
        setError(getErrorMessage(loadError));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const result = await saveProfile({ name, email: email.trim() || null, preferredLang: lang });
      setProfile(result.profile);
      setSaved(true);
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  const location = [profile?.area, profile?.city].filter(Boolean).join(", ");

  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full max-w-[480px] overflow-x-hidden bg-[var(--surface-container-low)] pb-[calc(96px+env(safe-area-inset-bottom))]">
        <header className="sticky top-0 z-40 border-b border-[var(--surface-variant)] bg-[var(--surface)]">
          <div className="flex h-12 items-center justify-center px-4 min-[390px]:px-5">
            <h1 className="text-headline-sm text-[var(--on-surface)]">Profile</h1>
          </div>
        </header>

        <div className="px-4 pt-6 min-[390px]:px-5">
          {isLoading ? (
            <p className="text-body-sm text-[var(--on-surface-variant)]">Loading profile...</p>
          ) : (
            <>
              <section className="flex flex-col items-center pb-6 pt-1">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-highest)] shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]">
                  <User className="h-12 w-12 text-[var(--on-surface-variant)]" />
                </div>
                <h2 className="mt-4 text-headline-sm text-[var(--on-surface)]">{profile?.name || "Your profile"}</h2>
                <p className="mt-1 flex items-center gap-1 text-body-sm text-[var(--on-surface-variant)]">
                  <Phone className="h-3.5 w-3.5" />
                  {profile?.phone}
                </p>
              </section>

              <section className="mb-6">
                <h3 className="mb-2 ml-2 text-label-md uppercase tracking-wide text-[var(--on-surface-variant)]">
                  Your details
                </h3>
                <div className="flex flex-col gap-4 rounded-lg border border-[var(--surface-variant)] bg-[var(--surface)] p-4 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-label-md text-[var(--on-surface)]">Full name</span>
                    <input
                      className="min-h-11 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 text-body-md outline-none focus:border-[var(--primary)]"
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Your name"
                      value={name}
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-label-md text-[var(--on-surface)]">Email (optional)</span>
                    <input
                      className="min-h-11 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 text-body-md outline-none focus:border-[var(--primary)]"
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      type="email"
                      value={email}
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="flex items-center gap-1.5 text-label-md text-[var(--on-surface)]">
                      <Languages className="h-4 w-4" />
                      Language preference
                    </span>
                    <select
                      className="min-h-11 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 text-body-md outline-none focus:border-[var(--primary)]"
                      onChange={(event) => setLang(event.target.value)}
                      value={lang}
                    >
                      {LANGUAGES.map((language) => (
                        <option key={language.code} value={language.code}>
                          {language.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  {error ? (
                    <p className="rounded-md border border-[var(--error)] bg-[var(--error-container)] px-3 py-2 text-body-sm text-[var(--on-error-container)]">
                      {error}
                    </p>
                  ) : null}
                  {saved ? (
                    <p className="text-body-sm text-[var(--primary)]">Profile saved.</p>
                  ) : null}

                  <button
                    className="min-h-11 rounded-md bg-[var(--primary)] px-4 text-label-lg text-[var(--on-primary)] disabled:opacity-60"
                    disabled={saving || !name.trim()}
                    onClick={handleSave}
                    type="button"
                  >
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </section>

              <section className="mb-6">
                <h3 className="mb-2 ml-2 text-label-md uppercase tracking-wide text-[var(--on-surface-variant)]">
                  Location
                </h3>
                <Link
                  className="flex min-h-14 items-center justify-between gap-3 rounded-lg border border-[var(--surface-variant)] bg-[var(--surface)] p-4 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]"
                  href="/select-location"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <MapPin className="h-5 w-5 shrink-0 text-[var(--on-surface-variant)]" />
                    <div className="min-w-0">
                      <p className="truncate text-body-md text-[var(--on-surface)]">
                        {location || "Set your location"}
                      </p>
                      <p className="text-body-sm text-[var(--on-surface-variant)]">Tap to change</p>
                    </div>
                  </div>
                </Link>
              </section>

              <SettingsSection items={privacyItems} title="Security & Privacy" />
              <SettingsSection items={supportItems} title="Support & Legal" />

              <button
                className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface)] text-label-lg text-[var(--error)] shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]"
                onClick={handleLogout}
                type="button"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>

        <MobileBottomNav active="profile" />
      </div>
    </main>
  );
}

function SettingsSection({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; icon: typeof Languages }>;
}) {
  return (
    <section className="mb-6">
      <h3 className="mb-2 ml-2 text-label-md uppercase tracking-wide text-[var(--on-surface-variant)]">{title}</h3>
      <div className="overflow-hidden rounded-lg border border-[var(--surface-variant)] bg-[var(--surface)] shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]">
        {items.map(({ label, icon: Icon }) => (
          <div
            className="flex min-h-14 w-full items-center gap-4 border-[var(--surface-variant)] p-4 text-left last:border-b-0 [&:not(:last-child)]:border-b"
            key={label}
          >
            <Icon className="h-5 w-5 shrink-0 text-[var(--on-surface-variant)]" />
            <p className="truncate text-body-md text-[var(--on-surface)]">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
