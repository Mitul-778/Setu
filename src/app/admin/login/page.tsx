"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { adminLogin } from "@/services/admin-service";

export default function AdminLoginPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    try {
      const result = await adminLogin(passcode);
      router.push(result.nextPath);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Could not sign in.");
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-8 shadow-[0_8px_30px_rgb(0_0_0_/_0.08)]">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--on-primary)]">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-headline-md text-[var(--on-surface)]">Setu Admin</h1>
          <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
            Enter the admin passcode to access the review console.
          </p>
        </div>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1.5">
            <span className="text-label-md text-[var(--on-surface)]">Passcode</span>
            <input
              autoFocus
              className="min-h-11 w-full rounded-md border border-[var(--outline)] bg-[var(--card)] px-3 text-body-md outline-none focus:border-[var(--primary)]"
              onChange={(event) => setPasscode(event.target.value)}
              type="password"
              value={passcode}
            />
          </label>

          {error ? (
            <div className="rounded-md border border-[var(--error)] bg-[var(--error-container)] px-3 py-2 text-body-sm text-[var(--on-error-container)]">
              {error}
            </div>
          ) : null}

          <button
            className="min-h-11 rounded-md bg-[var(--primary)] px-4 text-label-lg text-[var(--on-primary)] disabled:opacity-60"
            disabled={isSubmitting || !passcode}
            type="submit"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
