import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Camera,
  Heart,
  Pencil,
  Share2,
  Sparkles,
  Star,
  User,
  Users,
} from "lucide-react";
import { FileUploadPreview } from "@/components/file-upload-preview";

const reviewTags = [
  { label: "Professional", selected: true },
  { label: "Punctual", selected: true },
  { label: "Good value" },
  { label: "Skilled", selected: true },
  { label: "Polite" },
  { label: "Fast" },
  { label: "Clean work" },
  { label: "Easy communication" },
];

export default function CustomerRatingReviewPage() {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)]">
        <ReviewHeader />

        <section className="flex min-w-0 flex-col gap-6 px-4 py-5 min-[390px]:px-5">
          <ProviderSummary />
          <RatingStars />
          <ReviewTags />
          <CommentField />
          <PhotoUpload />
          <HireAgainToggle />
          <NextActions />
          <SubmitButton />
          <ReferralCard />
        </section>
      </div>
    </main>
  );
}

function ReviewHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
      <div className="grid h-12 grid-cols-[2.5rem_1fr_2.5rem] items-center px-3 min-[390px]:px-4">
        <Link
          aria-label="Go back"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--primary)]"
          href="/customer/bookings"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="truncate text-center text-headline-sm text-[var(--primary)]">
          Rate Service
        </h1>
        <div className="h-10 w-10" />
      </div>
    </header>
  );
}

function ProviderSummary() {
  return (
    <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
      <div className="flex items-center gap-3">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-high)]">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#ffffff_0%,#dadada_100%)]" />
          <User className="absolute bottom-1 h-8 w-8 text-[var(--on-surface-variant)] opacity-45" />
          <span className="relative z-10 text-label-lg">AS</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-1">
            <h2 className="truncate text-headline-sm">Arjun Singh</h2>
            <BadgeCheck className="h-4 w-4 shrink-0 fill-current" />
          </div>
          <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
            Mehendi Artist
          </p>
          <span className="mt-2 inline-flex items-center gap-1 rounded bg-[var(--surface-container-low)] px-2 py-1 text-label-sm">
            <BadgeCheck className="h-3 w-3" />
            Background verified
          </span>
        </div>
      </div>
    </section>
  );
}

function RatingStars() {
  return (
    <section className="flex flex-col items-center gap-3 text-center">
      <h2 className="text-headline-md">How was your experience?</h2>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            aria-label={`${star} star rating`}
            className="flex h-11 w-11 items-center justify-center"
            key={star}
          >
            <Star
              className={
                star <= 4
                  ? "h-9 w-9 fill-current text-[var(--primary)]"
                  : "h-9 w-9 text-[var(--outline-variant)]"
              }
            />
          </button>
        ))}
      </div>
      <p className="text-body-sm text-[var(--on-surface-variant)]">
        Very good
      </p>
    </section>
  );
}

function ReviewTags() {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-label-lg">What did they do well?</h2>
      <div className="flex flex-wrap gap-2">
        {reviewTags.map(({ label, selected }) => (
          <button
            className={
              selected
                ? "min-h-9 rounded-full border border-[var(--primary)] bg-[var(--primary)] px-3 text-label-md text-[var(--on-primary)]"
                : "min-h-9 rounded-full border border-[var(--outline)] bg-[var(--surface)] px-3 text-label-md text-[var(--on-surface)]"
            }
            key={label}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}

function CommentField() {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-label-lg">Additional comments</h2>
        <Pencil className="h-4 w-4 text-[var(--on-surface-variant)]" />
      </div>
      <textarea
        className="min-h-28 resize-none rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3 text-body-md outline-none placeholder:text-[var(--on-surface-variant)] focus:border-[var(--primary)]"
        placeholder="Share more details about your experience..."
      />
    </section>
  );
}

function PhotoUpload() {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-label-lg">Photo upload</h2>
      <FileUploadPreview
        accept="image/*"
        emptyClassName="flex h-24 w-24 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] text-[var(--on-surface-variant)]"
        icon={Camera}
        label="Upload"
        multiple
        previewClassName="no-scrollbar flex gap-3 overflow-x-auto overscroll-x-contain pb-1"
      />
    </section>
  );
}

function HireAgainToggle() {
  return (
    <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-label-lg">
            Would you hire Arjun again?
            <Sparkles className="h-4 w-4" />
          </h2>
          <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
            This helps Setu recommend better providers next time.
          </p>
        </div>
        <label className="relative inline-flex h-7 w-12 shrink-0 items-center">
          <input
            aria-label="Would hire again"
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

function NextActions() {
  return (
    <section className="grid grid-cols-2 gap-3">
      <button className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4 text-center">
        <Heart className="h-6 w-6" />
        <span className="text-label-md">Save provider</span>
      </button>
      <button className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4 text-center">
        <CalendarDays className="h-6 w-6" />
        <span className="text-label-md">Book again</span>
      </button>
    </section>
  );
}

function SubmitButton() {
  return (
    <Link
      className="flex min-h-12 items-center justify-center rounded-md bg-[var(--primary)] px-4 text-label-lg text-[var(--on-primary)]"
      href="/customer"
    >
      Submit review
    </Link>
  );
}

function ReferralCard() {
  return (
    <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-headline-sm">Invite a friend to Setu</h2>
          <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
            Help someone settle into a new city. You both get {"\u20B9"}100 after
            their first booking.
          </p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface-container)]">
          <Users className="h-5 w-5" />
        </span>
      </div>
      <button className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-[var(--primary)] px-4 text-label-md">
        <Share2 className="h-4 w-4" />
        Refer now
      </button>
    </section>
  );
}
