"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Languages, UserRound } from "lucide-react";
import { LANGUAGES } from "@/lib/categories";
import { saveProfile } from "@/services/profile-service";

export default function ProfileSetupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [lang, setLang] = useState("en");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleContinue() {
    if (saving || !name.trim()) return;
    setSaving(true);
    setError("");
    try {
      await saveProfile({ name: name.trim(), preferredLang: lang });
      router.push("/permissions");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save your profile.");
      setSaving(false);
    }
  }

  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col overflow-hidden bg-[var(--background)]">
        <section className="flex min-h-0 flex-1 flex-col px-4 pb-6 pt-10 min-[390px]:px-5">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--surface-container)] text-[var(--primary)]">
              <UserRound className="h-7 w-7" />
            </span>
            <h1 className="mt-4 text-headline-lg text-[var(--primary)]">Set up your profile</h1>
            <p className="mx-auto mt-2 max-w-[22rem] text-body-md text-[var(--on-surface-variant)]">
              We&apos;ll use these details across your bookings, chats, and matches.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-label-md text-[var(--on-surface)]">Full name</span>
              <input
                autoFocus
                className="min-h-12 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 text-body-md outline-none focus:border-[var(--primary)]"
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your full name"
                value={name}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="flex items-center gap-1.5 text-label-md text-[var(--on-surface)]">
                <Languages className="h-4 w-4" />
                Preferred language
              </span>
              <select
                className="min-h-12 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 text-body-md outline-none focus:border-[var(--primary)]"
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
          </div>

          <div className="mt-auto pt-8">
            <button
              className="flex min-h-12 w-full items-center justify-center rounded-md bg-[var(--primary)] text-label-lg text-[var(--on-primary)] disabled:opacity-60"
              disabled={saving || !name.trim()}
              onClick={handleContinue}
              type="button"
            >
              {saving ? "Saving..." : "Continue"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
