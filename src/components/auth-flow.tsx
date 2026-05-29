"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Lock,
  MessageSquare,
  Smartphone,
  Timer,
  Verified,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sendLoginOtp, verifyLoginOtp, type AuthIntent, type OtpChannel } from "@/services/auth-service";

type AuthMode = "login" | "otp";

export function AuthFlow({ mode }: { mode: AuthMode }) {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col overflow-hidden bg-[var(--background)]">
        <AuthHeader />
        {mode === "login" ? <LoginScreen /> : <VerifyOtpScreen />}
      </div>
    </main>
  );
}

function AuthHeader() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between px-4 min-[390px]:px-5">
      <Link
        aria-label="Go back"
        className="flex min-h-12 min-w-12 items-center justify-center rounded-full text-[var(--primary)]"
        href="/"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <Link
        className="flex min-h-12 items-center px-1 text-label-lg text-[var(--primary)]"
        href="/"
      >
        Skip
      </Link>
    </header>
  );
}

function LoginScreen() {
  const router = useRouter();
  const [whatsAppUpdates, setWhatsAppUpdates] = useState(true);
  const [intent] = useState<AuthIntent>(() => readAuthIntent());
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.sessionStorage.setItem("setu.authIntent", intent);
  }, [intent]);

  async function requestOtp() {
    setSubmitting(true);
    setError("");

    try {
      const data = await sendLoginOtp({ phone, intent, channel: whatsAppUpdates ? "whatsapp" : "sms" });

      window.sessionStorage.setItem("setu.authIntent", intent);
      window.sessionStorage.setItem("setu.pendingPhone", data.maskedPhone);
      router.push(`/verify-otp?intent=${intent}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not send OTP.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col px-4 pb-6 pt-10 min-[390px]:px-5">
      <div>
        <h1 className="text-headline-lg text-[var(--primary)]">
          Welcome to Setu
        </h1>
        <p className="mt-2 text-body-md text-[var(--on-surface-variant)]">
          Login to find trusted local help.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <label className="sr-only" htmlFor="phone">
          Enter your mobile number
        </label>
        <div className="flex min-h-12 overflow-hidden rounded-md border border-[var(--outline)] bg-[var(--surface-container-lowest)] focus-within:border-[var(--primary)] focus-within:outline-1 focus-within:outline-[var(--primary)]">
          <button
            className="flex shrink-0 items-center gap-1 border-r border-[var(--outline)] bg-[var(--surface-container-low)] px-3 text-body-md"
            type="button"
          >
            <span>+91</span>
            <ChevronDown className="h-4 w-4 text-[var(--on-surface-variant)]" />
          </button>
          <input
            className="min-w-0 flex-1 bg-transparent px-3 text-body-md outline-none placeholder:text-[var(--on-surface-variant)]"
            id="phone"
            inputMode="tel"
            maxLength={10}
            onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="Enter your mobile number"
            type="tel"
            value={phone}
          />
        </div>

        <label className="flex min-h-10 cursor-pointer items-center gap-2 text-body-md text-[var(--on-surface-variant)]">
          <span
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-sm border-2",
              whatsAppUpdates
                ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--on-primary)]"
                : "border-[var(--outline)]",
            )}
          >
            {whatsAppUpdates && <Check className="h-3.5 w-3.5" />}
          </span>
          <input
            checked={whatsAppUpdates}
            className="sr-only"
            onChange={(event) => setWhatsAppUpdates(event.target.checked)}
            type="checkbox"
          />
          <span>Receive updates on WhatsApp</span>
        </label>

        {error ? <p className="text-body-sm text-[var(--error)]">{error}</p> : null}
      </div>

      <div className="mt-auto flex flex-col gap-4">
        <button
          className="flex min-h-12 items-center justify-center rounded-md bg-[var(--primary)] text-label-lg text-[var(--on-primary)] disabled:opacity-60"
          disabled={submitting}
          onClick={requestOtp}
          type="button"
        >
          {submitting ? "Sending..." : "Get OTP"}
        </button>

        <TrustNote text="Your number is safe with us. We use secure encrypted login." />
      </div>
    </section>
  );
}

function VerifyOtpScreen() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(29);
  const [intent] = useState<AuthIntent>(() => readAuthIntent());
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [pendingPhone] = useState(() => readPendingPhone());
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    window.sessionStorage.setItem("setu.authIntent", intent);
  }, [intent]);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  function setDigit(index: number, rawValue: string) {
    const value = rawValue.replace(/\D/g, "").slice(-1);
    setOtp((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, key: string) {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(text: string) {
    const digits = text.replace(/\D/g, "").slice(0, 6).split("");
    if (digits.length === 0) return;

    setOtp((current) => current.map((_, index) => digits[index] ?? ""));
    inputRefs.current[Math.min(digits.length, 6) - 1]?.focus();
  }

  async function verifyOtp() {
    setSubmitting(true);
    setError("");

    try {
      const data = await verifyLoginOtp(otp.join(""));

      window.sessionStorage.setItem("setu.userRole", data.role);
      router.push(data.nextPath);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not verify OTP.");
    } finally {
      setSubmitting(false);
    }
  }

  async function resendOtp(channel: OtpChannel) {
    setError("");
    setSecondsLeft(29);
    const phone = window.sessionStorage.getItem("setu.pendingPhone") ?? pendingPhone;

    try {
      await sendLoginOtp({ phone, intent, channel });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not send OTP.");
    }
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col px-4 pb-6 pt-10 min-[390px]:px-5">
      <div>
        <h1 className="text-headline-lg text-[var(--primary)]">
          Verify Phone
        </h1>
        <p className="mt-2 max-w-[20rem] text-body-md text-[var(--on-surface-variant)]">
          Enter the 6-digit code sent to:{" "}
          <span className="font-semibold text-[var(--on-surface)]">
            {pendingPhone}
          </span>
        </p>
      </div>

      <div className="mt-8 grid grid-cols-6 gap-2 min-[390px]:gap-3">
        {otp.map((digit, index) => (
          <input
            aria-label={`Digit ${index + 1}`}
            className="h-14 min-w-0 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] text-center text-headline-md outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
            inputMode="numeric"
            key={index}
            maxLength={1}
            onChange={(event) => setDigit(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event.key)}
            onPaste={(event) => {
              event.preventDefault();
              handlePaste(event.clipboardData.getData("text"));
            }}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            type="text"
            value={digit}
          />
        ))}
      </div>

      {error ? <p className="mt-4 text-body-sm text-[var(--error)]">{error}</p> : null}

      <div className="mt-5 flex justify-center">
        <div className="flex items-center gap-1.5 text-body-sm text-[var(--on-surface-variant)]">
          <Timer className="h-4 w-4" />
          <span>
            Resend in{" "}
            <span className="font-medium text-[var(--on-surface)]">
              0:{secondsLeft.toString().padStart(2, "0")}
            </span>
          </span>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <button
          className="flex min-h-12 items-center justify-center gap-2 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] text-label-lg"
          onClick={() => resendOtp("sms")}
          type="button"
        >
          <MessageSquare className="h-5 w-5 text-[var(--on-surface-variant)]" />
          <span>Resend via SMS</span>
        </button>
        <button
          className="flex min-h-12 items-center justify-center gap-2 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] text-label-lg"
          onClick={() => resendOtp("whatsapp")}
          type="button"
        >
          <Smartphone className="h-5 w-5 text-[var(--on-surface-variant)]" />
          <span>Get code on WhatsApp</span>
        </button>
      </div>

      <div className="mt-auto flex flex-col gap-4">
        <div className="mx-auto flex w-fit items-center gap-1.5 rounded-full bg-[var(--surface-container-low)] px-4 py-2 text-label-sm uppercase tracking-wide text-[var(--on-surface-variant)]">
          <Verified className="h-4 w-4" />
          <span>Secure Login</span>
        </div>

        <button
          className="flex min-h-12 items-center justify-center rounded-md bg-[var(--primary)] text-label-lg text-[var(--on-primary)] disabled:opacity-60"
          disabled={submitting || otp.some((digit) => !digit)}
          onClick={verifyOtp}
          type="button"
        >
          {submitting ? "Verifying..." : "Verify & Continue"}
        </button>
      </div>
    </section>
  );
}

function TrustNote({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center gap-1.5 text-center text-body-sm text-[var(--on-surface-variant)]">
      <Lock className="h-3.5 w-3.5 shrink-0" />
      <p>{text}</p>
    </div>
  );
}

function readAuthIntent(): AuthIntent {
  if (typeof window === "undefined") {
    return "customer";
  }

  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("intent");

  if (fromUrl === "provider" || fromUrl === "customer") {
    return fromUrl;
  }

  return window.sessionStorage.getItem("setu.authIntent") === "provider" ? "provider" : "customer";
}

function readPendingPhone() {
  if (typeof window === "undefined") {
    return "+91 98765 43210";
  }

  return window.sessionStorage.getItem("setu.pendingPhone") ?? "+91 98765 43210";
}