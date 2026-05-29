import Link from "next/link";
import {
  ArrowLeft,
  ArrowUp,
  CalendarDays,
  Check,
  Clock,
  MapPin,
  Mic,
  Search,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

const extractedFields = [
  {
    label: "Service type",
    value: "Mehendi artist",
    icon: Search,
  },
  {
    label: "Date",
    value: "Sunday",
    icon: CalendarDays,
  },
  {
    label: "Time",
    value: "Evening, 5-8 PM",
    icon: Clock,
  },
  {
    label: "Budget",
    value: "\u20B91,000-\u20B91,500",
    icon: Wallet,
  },
  {
    label: "Location",
    value: "Indiranagar, Bangalore",
    icon: MapPin,
  },
  {
    label: "Language",
    value: "Hindi or English",
    icon: ShieldCheck,
  },
];

const waveformBars = [14, 22, 30, 18, 38, 26, 16, 34, 24, 12, 28, 20];

export default function CustomerAssistantPage() {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto flex min-h-dvh w-full min-w-0 max-w-[480px] flex-col overflow-x-hidden bg-[var(--surface)]">
        <AssistantHeader />

        <section className="flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 pb-[calc(150px+env(safe-area-inset-bottom))] min-[390px]:px-5">
          <div className="flex justify-center">
            <span className="rounded-full bg-[var(--surface-container)] px-3 py-1 text-label-sm text-[var(--secondary)]">
              Today, 2:14 PM
            </span>
          </div>

          <UserRequestBubble />
          <AssistantQuestionBubble />
          <ExtractedFieldsCard />
          <AssistantFollowUp />
        </section>

        <Composer />
      </div>
    </main>
  );
}

function AssistantHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
      <div className="grid h-12 grid-cols-[2.5rem_1fr_2.5rem] items-center px-3 min-[390px]:px-4">
        <Link
          aria-label="Back to customer home"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--primary)]"
          href="/customer"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="flex min-w-0 items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 shrink-0 fill-current text-[var(--primary)]" />
          <h1 className="truncate text-headline-sm text-[var(--primary)]">
            Setu Assistant
          </h1>
        </div>

        <div className="flex h-10 w-10 items-center justify-center">
          <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
        </div>
      </div>
    </header>
  );
}

function UserRequestBubble() {
  return (
    <div className="flex justify-end">
      <div className="max-w-[86%] rounded-xl rounded-tr-sm bg-[var(--primary)] px-4 py-3 text-[var(--on-primary)]">
        <p className="text-body-md">
          Need a mehendi artist for Sunday evening near Indiranagar. Budget
          around {"\u20B9"}1,500.
        </p>
        <div className="mt-3 flex items-center gap-2 rounded-md bg-white/12 px-3 py-2">
          <Mic className="h-4 w-4 shrink-0" />
          <div className="flex h-8 flex-1 items-center gap-1 overflow-hidden">
            {waveformBars.map((height, index) => (
              <span
                className="w-1 rounded-full bg-white/80"
                key={`${height}-${index}`}
                style={{ height }}
              />
            ))}
          </div>
          <span className="text-label-sm text-white/80">0:12</span>
        </div>
      </div>
    </div>
  );
}

function AssistantQuestionBubble() {
  return (
    <div className="flex max-w-[94%] flex-col gap-2">
      <div className="rounded-xl rounded-tl-sm border-2 border-[var(--outline-variant)] bg-[var(--surface-container)] px-4 py-3">
        <div className="flex gap-3">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 fill-current text-[var(--primary)]" />
          <div className="min-w-0">
            <p className="text-body-md">
              I understood most of your request. Please confirm these details so
              I can find verified providers.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-[var(--surface-container-lowest)] px-3 py-1.5 text-label-md">
                Home visit
              </span>
              <span className="rounded-full bg-[var(--surface-container-lowest)] px-3 py-1.5 text-label-md">
                Female preferred
              </span>
              <span className="rounded-full bg-[var(--surface-container-lowest)] px-3 py-1.5 text-label-md">
                Photos available
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExtractedFieldsCard() {
  return (
    <article className="ml-4 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)] min-[390px]:ml-8">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-headline-sm text-[var(--on-surface)]">
            Extracted details
          </h2>
          <p className="text-body-sm text-[var(--on-surface-variant)]">
            AI filled these from your voice and text request.
          </p>
        </div>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--surface-container)]">
          <Check className="h-4 w-4" />
        </span>
      </div>

      <div className="grid gap-2">
        {extractedFields.map(({ icon: Icon, label, value }) => (
          <div
            className="grid grid-cols-[2rem_1fr] gap-2 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-3"
            key={label}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded bg-[var(--surface-container-lowest)]">
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-label-sm text-[var(--on-surface-variant)]">
                {label}
              </p>
              <p className="truncate text-label-lg text-[var(--on-surface)]">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Link
        className="mt-4 flex min-h-12 w-full items-center justify-center rounded-md bg-[var(--primary)] px-4 text-label-lg text-[var(--on-primary)]"
        href="/customer/results"
      >
        Generate matches
      </Link>
    </article>
  );
}

function AssistantFollowUp() {
  return (
    <div className="ml-4 flex max-w-[92%] flex-col gap-2 min-[390px]:ml-8">
      <div className="rounded-xl rounded-tl-sm border-2 border-[var(--outline-variant)] bg-[var(--surface-container)] px-4 py-3">
        <p className="text-body-md">
          I can prioritize nearby artists who speak your preferred language and
          show starting prices before you book.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="min-h-9 rounded-full border border-[var(--outline)] bg-[var(--surface-container-lowest)] px-4 text-label-md">
          Change budget
        </button>
        <button className="min-h-9 rounded-full border border-[var(--outline)] bg-[var(--surface-container-lowest)] px-4 text-label-md">
          Add more details
        </button>
      </div>
    </div>
  );
}

function Composer() {
  return (
    <footer className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-[var(--outline-variant)] bg-[var(--surface)] px-4 py-3 shadow-[0_-4px_12px_rgb(0_0_0_/_0.02)]">
      <div className="mx-auto w-full max-w-[480px]">
        <div className="flex items-center gap-2 rounded-lg border border-[var(--outline)] bg-[var(--surface-container-lowest)] px-3 py-2 focus-within:border-[var(--primary)]">
          <button
            aria-label="Use voice input"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--secondary)]"
          >
            <Mic className="h-5 w-5" />
          </button>
          <input
            className="min-h-9 min-w-0 flex-1 border-0 bg-transparent p-0 text-body-md outline-none placeholder:text-[var(--on-surface-variant)]"
            placeholder="Type your message..."
            type="text"
          />
          <button
            aria-label="Send message"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--on-primary)]"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </footer>
  );
}
