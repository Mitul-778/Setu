import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  HelpCircle,
  IndianRupee,
  MapPin,
  MessageSquare,
  MoreVertical,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  XCircle,
} from "lucide-react";

const leadFacts = [
  {
    label: "Budget",
    value: "\u20B93,500 - \u20B95,000",
    detail: "Client budget range",
    icon: IndianRupee,
  },
  {
    label: "Location",
    value: "Indiranagar, Bangalore",
    detail: "2.4 km from your service area",
    icon: MapPin,
  },
  {
    label: "Date & time",
    value: "Sunday, 24 Oct",
    detail: "2:00 PM - 5:00 PM",
    icon: CalendarClock,
  },
];

const fitReasons = ["Rajasthani patterns", "Sunday available", "Hindi + English", "Nearby"];

export default function ProviderLeadDetailsPage() {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)] pb-[calc(180px+env(safe-area-inset-bottom))]">
        <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
          <div className="flex h-14 items-center justify-between gap-2 px-4 min-[390px]:px-5">
            <button
              aria-label="Back"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--primary)]"
              type="button"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="min-w-0 flex-1 truncate text-center text-headline-sm text-[var(--primary)]">
              Lead Details
            </h1>
            <button
              aria-label="More options"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--on-surface-variant)]"
              type="button"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </header>

        <section className="px-4 py-4 min-[390px]:px-5">
          <article className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--surface-container-high)] text-label-lg text-[var(--on-surface)]">
                  AS
                </div>
                <div className="min-w-0">
                  <div className="flex min-w-0 items-center gap-2">
                    <h2 className="truncate text-headline-sm text-[var(--on-surface)]">Anita S.</h2>
                    <ShieldCheck className="h-4 w-4 shrink-0 text-[var(--primary)]" fill="currentColor" />
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-label-md text-[var(--on-surface-variant)]">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5" fill="currentColor" />
                      4.8 user rating
                    </span>
                    <span className="rounded-full bg-[var(--surface-container)] px-2 py-0.5 text-label-sm text-[var(--on-surface)]">
                      Trusted User
                    </span>
                  </div>
                </div>
              </div>
              <button
                aria-label="Message customer"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--outline-variant)] text-[var(--primary)]"
                type="button"
              >
                <MessageSquare className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 rounded-md bg-[var(--surface-container-low)] p-3">
              <p className="text-label-md text-[var(--on-surface-variant)]">Requirement summary</p>
              <h3 className="mt-1 text-headline-sm text-[var(--on-surface)]">
                Bridal mehendi for engagement party
              </h3>
              <p className="mt-2 text-body-md text-[var(--on-surface-variant)]">
                Mehendi artist needed for 25-30 guests. The bride wants traditional Rajasthani
                patterns, with simpler designs for guests during a small home event.
              </p>
            </div>
          </article>

          <article className="mt-4 overflow-hidden rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-low)]">
            <div className="flex gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--primary)] text-[var(--on-primary)]">
                <Sparkles className="h-5 w-5" fill="currentColor" />
              </div>
              <div className="min-w-0">
                <p className="text-label-lg text-[var(--on-surface)]">AI-generated fit explanation</p>
                <p className="mt-1 text-body-md text-[var(--on-surface-variant)]">
                  High fit because your profile lists bridal mehendi, 5+ years of experience,
                  Rajasthani designs, and Sunday afternoon availability near Indiranagar.
                </p>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto border-t border-[var(--outline-variant)] px-4 py-3 no-scrollbar">
              {fitReasons.map((reason) => (
                <span
                  className="shrink-0 rounded-full bg-[var(--surface-container-lowest)] px-3 py-1 text-label-sm text-[var(--on-surface)]"
                  key={reason}
                >
                  {reason}
                </span>
              ))}
            </div>
          </article>

          <section className="mt-4 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
            <h3 className="text-label-lg text-[var(--on-surface)]">Lead details</h3>
            <div className="mt-3 flex flex-col divide-y divide-[var(--surface-variant)]">
              {leadFacts.map(({ detail, icon: Icon, label, value }) => (
                <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0" key={label}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--surface-container-low)] text-[var(--primary)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-label-sm uppercase text-[var(--on-surface-variant)]">{label}</p>
                    <p className="mt-0.5 text-label-lg text-[var(--on-surface)]">{value}</p>
                    <p className="mt-0.5 text-body-sm text-[var(--on-surface-variant)]">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-4 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
            <div className="flex items-start gap-3">
              <UserRound className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]" />
              <div>
                <h3 className="text-label-lg text-[var(--on-surface)]">Customer note</h3>
                <p className="mt-1 text-body-md text-[var(--on-surface-variant)]">
                  We are new to Bangalore and need someone who can explain the design options
                  clearly. Please confirm if you can bring cones and arrive before 1:45 PM.
                </p>
              </div>
            </div>
          </section>
        </section>

        <section className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4 pb-[calc(16px+env(safe-area-inset-bottom))] shadow-[0_-4px_12px_rgb(0_0_0_/_0.05)]">
          <div className="grid grid-cols-2 gap-2">
            <button
              className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-3 text-label-lg text-[var(--on-primary)]"
              type="button"
            >
              <CheckCircle2 className="h-5 w-5" />
              Accept
            </button>
            <button
              className="flex min-h-12 items-center justify-center gap-2 rounded-md border border-[var(--outline)] bg-[var(--surface-container-lowest)] px-3 text-label-lg text-[var(--on-surface)]"
              type="button"
            >
              <Send className="h-5 w-5" />
              Custom Quote
            </button>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              className="flex min-h-11 items-center justify-center gap-2 rounded-md text-label-md text-[var(--on-surface-variant)]"
              type="button"
            >
              <XCircle className="h-4 w-4" />
              Decline
            </button>
            <button
              className="flex min-h-11 items-center justify-center gap-2 rounded-md text-label-md text-[var(--on-surface-variant)]"
              type="button"
            >
              <HelpCircle className="h-4 w-4" />
              Ask Question
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
