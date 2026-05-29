import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CalendarClock,
  Home,
  IndianRupee,
  MessageSquare,
  Mic,
  Paperclip,
  Send,
  ShieldCheck,
  User,
} from "lucide-react";
import { FileUploadPreview } from "@/components/file-upload-preview";

const categories = ["Mehendi", "Makeup", "Plumbing", "Cleaning", "Food", "Other"];
const waveformBars = [18, 28, 14, 34, 22, 12, 30, 18, 26, 10, 24, 16];

const navItems = [
  { label: "Home", icon: Home, href: "/customer" },
  { label: "Requests", icon: Send, href: "/customer/request", active: true },
  { label: "Bookings", icon: CalendarDays, href: "/customer/results" },
  { label: "Messages", icon: MessageSquare, href: "/customer/assistant" },
  { label: "Profile", icon: User, href: "/profile" },
];

export default function CustomerRequestPage() {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)] pb-[calc(96px+env(safe-area-inset-bottom))]">
        <RequestHeader />

        <form className="flex min-w-0 flex-col gap-5 px-4 py-5 min-[390px]:px-5">
          <Intro />
          <TextField
            label="Request title"
            placeholder="Need a mehendi artist for Sunday evening"
          />
          <DescriptionField />
          <CategorySelector />
          <DateTimeFields />
          <BudgetField />
          <PhotoUpload />
          <VoiceNote />
          <DirectCallToggle />
          <TrustNote />
          <button
            className="min-h-12 rounded-md bg-[var(--primary)] px-4 text-label-lg text-[var(--on-primary)]"
            type="button"
          >
            Post request
          </button>
        </form>

        <CustomerBottomNav />
      </div>
    </main>
  );
}

function RequestHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
      <div className="grid h-12 grid-cols-[2.5rem_1fr_2.5rem] items-center px-3 min-[390px]:px-4">
        <Link
          aria-label="Back to results"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--primary)]"
          href="/customer/results"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="truncate text-center text-headline-sm text-[var(--primary)]">
          Matches
        </h1>
        <div className="h-10 w-10" />
      </div>
    </header>
  );
}

function Intro() {
  return (
    <section>
      <h2 className="text-headline-lg text-[var(--on-surface)]">
        Post a Request
      </h2>
      <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
        Describe what you need, and available providers will contact you.
      </p>
    </section>
  );
}

function TextField({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-label-md">{label}</span>
      <input
        className="min-h-12 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 text-body-md outline-none placeholder:text-[var(--on-surface-variant)] focus:border-[var(--primary)]"
        placeholder={placeholder}
        type="text"
      />
    </label>
  );
}

function DescriptionField() {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-label-md">Description</span>
      <textarea
        className="min-h-28 resize-none rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3 text-body-md outline-none placeholder:text-[var(--on-surface-variant)] focus:border-[var(--primary)]"
        placeholder="Add details, preferred style, number of people, access instructions, or any constraints."
      />
    </label>
  );
}

function CategorySelector() {
  return (
    <section className="min-w-0">
      <label className="mb-2 block text-label-md">Category</label>
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto overscroll-x-contain px-1 pb-1">
        {categories.map((category, index) => (
          <button
            className={
              index === 0
                ? "min-h-9 shrink-0 rounded-full border border-[var(--primary)] bg-[var(--primary)] px-4 text-label-md text-[var(--on-primary)]"
                : "min-h-9 shrink-0 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-4 text-label-md"
            }
            key={category}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  );
}

function DateTimeFields() {
  return (
    <section className="grid grid-cols-2 gap-3">
      <label className="flex min-w-0 flex-col gap-2">
        <span className="text-label-md">Date</span>
        <span className="relative">
          <CalendarClock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--on-surface-variant)]" />
          <input
            className="min-h-12 w-full rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 pl-9 text-body-md outline-none focus:border-[var(--primary)]"
            type="date"
          />
        </span>
      </label>

      <label className="flex min-w-0 flex-col gap-2">
        <span className="text-label-md">Time</span>
        <span className="relative">
          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--on-surface-variant)]" />
          <input
            className="min-h-12 w-full rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 pl-9 text-body-md outline-none focus:border-[var(--primary)]"
            type="time"
          />
        </span>
      </label>
    </section>
  );
}

function BudgetField() {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-label-md">Budget</span>
      <span className="relative">
        <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--on-surface-variant)]" />
        <input
          className="min-h-12 w-full rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 pl-9 text-body-md outline-none placeholder:text-[var(--on-surface-variant)] focus:border-[var(--primary)]"
          placeholder="1,500"
          type="number"
        />
      </span>
    </label>
  );
}

function PhotoUpload() {
  return (
    <section className="flex flex-col gap-2">
      <span className="text-label-md">Photo upload</span>
      <FileUploadPreview
        accept="image/*"
        hint="Add references, damaged area, location entrance, or style examples."
        icon={Paperclip}
        label="Upload photos"
        multiple
      />
    </section>
  );
}

function VoiceNote() {
  return (
    <section className="flex flex-col gap-2">
      <span className="text-label-md">Voice note</span>
      <div className="flex min-h-16 items-center gap-3 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3">
        <button
          aria-label="Record voice note"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--on-primary)]"
          type="button"
        >
          <Mic className="h-5 w-5" />
        </button>
        <div className="flex h-8 min-w-0 flex-1 items-center gap-1 overflow-hidden opacity-55">
          {waveformBars.map((height, index) => (
            <span
              className="w-1 rounded-full bg-[var(--outline)]"
              key={`${height}-${index}`}
              style={{ height }}
            />
          ))}
        </div>
        <span className="shrink-0 text-label-md text-[var(--on-surface-variant)]">
          0:00
        </span>
      </div>
    </section>
  );
}

function DirectCallToggle() {
  return (
    <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-label-lg">Allow providers to call directly</p>
          <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
            Useful for urgent requests and faster clarification.
          </p>
        </div>
        <label className="relative inline-flex h-7 w-12 shrink-0 items-center">
          <input
            aria-label="Allow providers to call directly"
            className="peer sr-only"
            defaultChecked
            type="checkbox"
          />
          <span className="absolute inset-0 rounded-full bg-[var(--surface-variant)] transition peer-checked:bg-[var(--primary)]" />
          <span className="absolute left-1 h-5 w-5 rounded-full bg-[var(--surface)] shadow-[0_1px_3px_rgb(0_0_0_/_0.24)] transition peer-checked:translate-x-5" />
        </label>
      </div>
    </section>
  );
}

function TrustNote() {
  return (
    <section className="flex gap-2 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-3">
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="text-body-sm text-[var(--on-surface-variant)]">
        Your contact details stay hidden until you accept a provider response.
      </p>
    </section>
  );
}

function CustomerBottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]">
      <div className="mx-auto grid h-20 w-full max-w-[480px] grid-cols-5 px-1 pb-[env(safe-area-inset-bottom)] text-[var(--on-surface-variant)]">
        {navItems.map(({ active, href, icon: Icon, label }) => (
          <Link
            className="flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 text-label-md"
            href={href}
            key={label}
          >
            <span
              className={
                active
                  ? "flex h-8 w-12 items-center justify-center rounded-full bg-[var(--primary-container)] text-[var(--on-primary)] min-[390px]:w-14"
                  : "flex h-8 w-12 items-center justify-center rounded-full min-[390px]:w-14"
              }
            >
              <Icon
                className="h-5 w-5"
                fill={active ? "currentColor" : "none"}
              />
            </span>
            <span
              className={
                active
                  ? "max-w-full truncate text-[var(--primary)]"
                  : "max-w-full truncate"
              }
            >
              {label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
