"use client";

import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Camera,
  Check,
  ChevronDown,
  CircleHelp,
  FileImage,
  Info,
  Lock,
  MapPin,
  Phone,
  RotateCcw,
  Search,
  ShieldCheck,
  Upload,
  User,
} from "lucide-react";
import { useRef, useState } from "react";

const steps = [
  { id: "id", label: "ID", title: "Upload ID", icon: FileImage },
  { id: "selfie", label: "Selfie", title: "Verify face", icon: Camera },
  { id: "phone", label: "Phone", title: "Confirm phone", icon: Phone },
  { id: "area", label: "Area", title: "Service area", icon: MapPin },
] as const;

type StepId = (typeof steps)[number]["id"];

const stepCopy: Record<StepId, { heading: string; body: string; cta: string }> = {
  id: {
    heading: "Verify your identity",
    body: "Secure your account and build trust with customers by verifying your ID.",
    cta: "Continue",
  },
  selfie: {
    heading: "Take a selfie",
    body: "We use this to match your face with your ID document.",
    cta: "Verify Face",
  },
  phone: {
    heading: "Verify phone number",
    body: "Confirm the number you will use for customer calls.",
    cta: "Verify OTP",
  },
  area: {
    heading: "Set your service area",
    body: "Tell us where you can provide services so we can match you with local customers.",
    cta: "Finish Registration",
  },
};

export default function ProviderVerifyIdentityPage() {
  const [activeStep, setActiveStep] = useState<StepId>("id");
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const activeIndex = steps.findIndex((step) => step.id === activeStep);
  const progress = ((activeIndex + 1) / steps.length) * 100;
  const current = stepCopy[activeStep];
  const primaryCta = activeStep === "phone" && !phoneOtpSent ? "Send OTP" : current.cta;

  function goNext() {
    if (activeStep === "phone" && !phoneOtpSent) {
      setPhoneOtpSent(true);
      return;
    }

    const nextStep = steps[Math.min(activeIndex + 1, steps.length - 1)];
    setActiveStep(nextStep.id);
  }

  function goBack() {
    const previousStep = steps[Math.max(activeIndex - 1, 0)];
    setActiveStep(previousStep.id);
  }

  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto flex min-h-dvh w-full min-w-0 max-w-[480px] flex-col overflow-x-hidden bg-[var(--surface)] pb-[calc(92px+env(safe-area-inset-bottom))]">
        <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
          <div className="flex h-12 items-center justify-between gap-2 px-4 min-[390px]:px-5">
            <button
              aria-label="Go back"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--on-surface)]"
              onClick={goBack}
              type="button"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="min-w-0 flex-1 truncate text-center text-headline-sm text-[var(--primary)]">
              Register as Provider
            </h1>
            <button
              aria-label="Help"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--on-surface-variant)]"
              type="button"
            >
              <CircleHelp className="h-5 w-5" />
            </button>
          </div>
        </header>

        <section className="px-4 py-5 min-[390px]:px-5 min-[390px]:py-6">
          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-label-md text-[var(--on-surface-variant)]">
                Step {activeIndex + 1} of {steps.length}
              </p>
              <p className="text-label-md text-[var(--on-surface-variant)]">
                {Math.round(progress)}% complete
              </p>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-container-highest)]">
              <div
                className="h-full rounded-full bg-[var(--primary)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Stepper activeIndex={activeIndex} setActiveStep={setActiveStep} />

          <div className="mt-7">
            <h2 className="text-headline-lg text-[var(--on-surface)]">
              {current.heading}
            </h2>
            <p className="mt-2 max-w-[22rem] text-body-md text-[var(--on-surface-variant)]">
              {current.body}
            </p>
          </div>

          <div className="mt-6">
            {activeStep === "id" ? <IdUploadStep /> : null}
            {activeStep === "selfie" ? <SelfieStep /> : null}
            {activeStep === "phone" ? (
              <PhoneStep otpSent={phoneOtpSent} setOtpSent={setPhoneOtpSent} />
            ) : null}
            {activeStep === "area" ? <ServiceAreaStep /> : null}
          </div>
        </section>

        <footer className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-[var(--outline-variant)] bg-[var(--surface)] px-4 py-3">
          <div className="grid grid-cols-[1fr_1.35fr] gap-3">
            <button
              className="min-h-12 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-4 text-label-lg text-[var(--on-surface-variant)]"
              type="button"
            >
              Save Draft
            </button>
            <button
              className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 text-label-lg text-[var(--on-primary)]"
              onClick={goNext}
              type="button"
            >
              <span>{primaryCta}</span>
              {activeStep === "area" ? <Check className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}

function Stepper({
  activeIndex,
  setActiveStep,
}: {
  activeIndex: number;
  setActiveStep: (step: StepId) => void;
}) {
  return (
    <div className="relative">
      <div className="absolute left-4 right-4 top-4 h-px bg-[var(--surface-container-highest)]" />
      <div className="relative grid grid-cols-4 gap-1">
        {steps.map(({ id, icon: Icon, label }, index) => {
          const isDone = index < activeIndex;
          const isActive = index === activeIndex;

          return (
            <button
              className="flex min-w-0 flex-col items-center gap-2 bg-[var(--surface)] text-center"
              key={id}
              onClick={() => setActiveStep(id)}
              type="button"
            >
              <span
                className={
                  isDone
                    ? "z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--on-primary)]"
                    : isActive
                      ? "z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--primary)] bg-[var(--surface)] text-[var(--primary)] shadow-[0_0_0_4px_rgb(0_0_0_/_0.08)]"
                      : "z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] text-[var(--on-surface-variant)]"
                }
              >
                {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </span>
              <span
                className={
                  isActive
                    ? "max-w-full truncate text-label-sm text-[var(--primary)]"
                    : "max-w-full truncate text-label-sm text-[var(--on-surface-variant)]"
                }
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function IdUploadStep() {
  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-label-md text-[var(--on-surface)]">Document Type</span>
        <span className="relative block">
          <select className="min-h-12 w-full appearance-none rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 pr-10 text-body-md outline-none focus:border-[var(--primary)]">
            <option>Aadhaar Card</option>
            <option>PAN Card</option>
            <option>Voter ID</option>
            <option>Driving License</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--on-surface-variant)]" />
        </span>
      </label>

      <UploadBox title="Upload Front" />
      <UploadBox title="Upload Back" />

      <TrustNote icon={Lock}>
        Your data is encrypted and used only for verification. We do not share ID documents with customers.
      </TrustNote>
    </div>
  );
}

function UploadBox({ title }: { title: string }) {
  return (
    <button
      className="flex h-36 flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4 text-center"
      type="button"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-container)] text-[var(--on-surface-variant)]">
        <Upload className="h-6 w-6" />
      </span>
      <span>
        <span className="block text-label-lg text-[var(--on-surface)]">{title}</span>
        <span className="block text-body-sm text-[var(--on-surface-variant)]">JPEG, PNG up to 5MB</span>
      </span>
    </button>
  );
}

function SelfieStep() {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative mx-auto flex aspect-square w-full max-w-[18rem] items-center justify-center overflow-hidden rounded-full border-2 border-[var(--outline-variant)] bg-[var(--surface-container-low)]">
        <User className="h-32 w-32 text-[var(--surface-container-highest)]" />
        <div className="absolute left-6 right-6 top-1/2 h-0.5 rounded-full bg-[var(--primary)] shadow-[0_0_12px_rgb(0_0_0_/_0.35)]" />
        <div className="absolute inset-5 rounded-full border border-[var(--outline-variant)]" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="flex min-h-12 items-center justify-center gap-2 rounded-md border border-[var(--outline)] bg-[var(--surface-container-lowest)] text-label-lg" type="button">
          <RotateCcw className="h-5 w-5" />
          Retake
        </button>
        <button className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-[var(--primary)] text-label-lg text-[var(--on-primary)]" type="button">
          <Camera className="h-5 w-5" />
          Verify Face
        </button>
      </div>

      <div className="rounded-lg bg-[var(--surface-container-low)] p-4">
        <h3 className="text-label-lg text-[var(--on-surface)]">Tips for a good selfie</h3>
        <ul className="mt-3 space-y-2 text-body-sm text-[var(--on-surface-variant)]">
          <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0" />Keep your face inside the frame.</li>
          <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0" />Remove sunglasses, masks, or caps.</li>
          <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0" />Use clear, even lighting.</li>
        </ul>
      </div>
    </div>
  );
}

function PhoneStep({
  otpSent,
  setOtpSent,
}: {
  otpSent: boolean;
  setOtpSent: (sent: boolean) => void;
}) {
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const input = otpRefs.current[index];

    if (input) {
      input.value = digit;
    }

    if (digit && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index: number, key: string) {
    if (key === "Backspace" && !otpRefs.current[index]?.value && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4).split("");

    digits.forEach((digit, index) => {
      const input = otpRefs.current[index];

      if (input) {
        input.value = digit;
      }
    });

    otpRefs.current[Math.min(digits.length, 3)]?.focus();
  }

  return (
    <div className="flex flex-col gap-5">
      <label className="flex flex-col gap-1.5">
        <span className="text-label-md text-[var(--on-surface-variant)]">Mobile Number</span>
        <div className="flex min-h-12 overflow-hidden rounded-md border border-[var(--outline)] bg-[var(--surface-container-lowest)] focus-within:border-[var(--primary)]">
          <span className="flex shrink-0 items-center border-r border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-3 text-body-md text-[var(--on-surface)]">
            +91
          </span>
          <input
            className="min-w-0 flex-1 bg-transparent px-3 text-body-lg outline-none placeholder:text-[var(--on-surface-variant)]"
            defaultValue="98765 43210"
            inputMode="tel"
            placeholder="Enter mobile number"
            type="tel"
          />
        </div>
      </label>

      {!otpSent ? (
        <div className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]" />
            <div>
              <h3 className="text-label-lg text-[var(--on-surface)]">Send OTP to verify</h3>
              <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                We will send a 4-digit OTP only after you confirm this mobile number.
              </p>
            </div>
          </div>
          <button
            className="mt-4 min-h-11 w-full rounded-md bg-[var(--primary)] px-4 text-label-lg text-[var(--on-primary)]"
            onClick={() => setOtpSent(true)}
            type="button"
          >
            Send OTP
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-label-md text-[var(--on-surface-variant)]">Enter 4-digit OTP</span>
            <button
              className="text-label-md text-[var(--primary)]"
              onClick={() => setOtpSent(false)}
              type="button"
            >
              Change number
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {["", "", "", ""].map((_, index) => (
              <input
                aria-label={`OTP digit ${index + 1}`}
                autoComplete={index === 0 ? "one-time-code" : "off"}
                className="h-14 rounded-md border border-[var(--outline)] bg-[var(--surface-container-lowest)] text-center text-headline-md outline-none focus:border-[var(--primary)]"
                inputMode="numeric"
                key={index}
                maxLength={1}
                onChange={(event) => handleOtpChange(index, event.target.value)}
                onKeyDown={(event) => handleOtpKeyDown(index, event.key)}
                onPaste={(event) => {
                  event.preventDefault();
                  handleOtpPaste(event.clipboardData.getData("text"));
                }}
                placeholder="0"
                ref={(input) => {
                  otpRefs.current[index] = input;
                }}
                type="text"
              />
            ))}
          </div>
          <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
            OTP sent. Resend in <span className="text-label-md text-[var(--on-surface)]">0:45</span>
          </p>
        </div>
      )}

      <TrustNote icon={ShieldCheck}>
        Verified phone numbers help customers call or message you confidently after booking.
      </TrustNote>
    </div>
  );
}
function ServiceAreaStep() {
  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]">
        <div className="relative h-56 overflow-hidden bg-[var(--surface-container)]">
          <div className="absolute inset-0 opacity-70">
            <div className="grid h-full grid-cols-6 grid-rows-6 gap-px p-4">
              {Array.from({ length: 36 }).map((_, index) => (
                <div className="rounded-sm bg-[var(--surface-container-lowest)]" key={index} />
              ))}
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-36 w-36 items-center justify-center rounded-full border border-[var(--primary)] bg-black/5">
              <MapPin className="h-8 w-8 fill-current text-[var(--primary)]" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-4">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--on-surface-variant)]" />
            <input
              className="min-h-12 w-full rounded-md border border-[var(--outline-variant)] bg-[var(--surface)] px-10 text-body-md outline-none focus:border-[var(--primary)]"
              defaultValue="Indiranagar, Bangalore"
              type="text"
            />
          </label>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="text-label-lg text-[var(--on-surface)]">Service Radius</label>
              <span className="rounded bg-[var(--surface-container)] px-2 py-1 text-label-md text-[var(--on-surface-variant)]">10 km</span>
            </div>
            <input className="w-full accent-[var(--primary)]" max="50" min="1" type="range" defaultValue="10" />
            <div className="mt-1 flex justify-between text-label-sm text-[var(--on-surface-variant)]">
              <span>1 km</span>
              <span>50 km</span>
            </div>
          </div>
        </div>
      </div>

      <TrustNote icon={Info}>
        Showing matches for Indiranagar, Bangalore within a 10 km radius. You can update this later.
      </TrustNote>
    </div>
  );
}

function TrustNote({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon: typeof Lock;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-[var(--surface-variant)] bg-[var(--surface-container-low)] p-3">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--on-surface-variant)]" />
      <p className="text-body-sm text-[var(--on-surface-variant)]">{children}</p>
    </div>
  );
}
