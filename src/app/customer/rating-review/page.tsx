"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ArrowLeft, BadgeCheck, Star, User } from "lucide-react";
import { loadReviewContext, submitReview, type ReviewContext } from "@/services/customer-review-service";

const reviewTags = [
  "Professional",
  "Punctual",
  "Good value",
  "Skilled",
  "Polite",
  "Fast",
  "Clean work",
  "Easy communication",
];

const ratingLabels = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function RatingReviewContent() {
  const router = useRouter();
  const params = useSearchParams();
  const bookingId = params.get("bookingId") ?? "";

  const [context, setContext] = useState<ReviewContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!bookingId) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setLoadError("No booking selected to review.");
      setIsLoading(false);
      /* eslint-enable react-hooks/set-state-in-effect */
      return;
    }
    let cancelled = false;
    loadReviewContext(bookingId)
      .then((data) => {
        if (cancelled) return;
        setContext(data.context);
        setLoadError("");
      })
      .catch((error) => {
        if (cancelled) return;
        setLoadError(getErrorMessage(error));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  function toggleTag(tag: string) {
    setTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
  }

  async function handleSubmit() {
    if (submitting || !context || rating < 1) return;
    setSubmitting(true);
    setSubmitError("");
    const composed = [tags.join(", "), comment.trim()].filter(Boolean).join(" — ");
    try {
      const result = await submitReview({ bookingId: context.bookingId, rating, comment: composed });
      router.push(result.nextPath);
    } catch (error) {
      setSubmitError(getErrorMessage(error));
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)]">
        <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
          <div className="grid h-12 grid-cols-[2.5rem_1fr_2.5rem] items-center px-3 min-[390px]:px-4">
            <button
              aria-label="Go back"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--primary)]"
              onClick={() => router.push("/customer/bookings")}
              type="button"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="truncate text-center text-headline-sm text-[var(--primary)]">Rate Service</h1>
            <div className="h-10 w-10" />
          </div>
        </header>

        <section className="flex min-w-0 flex-col gap-6 px-4 py-5 min-[390px]:px-5">
          {isLoading ? (
            <p className="text-body-sm text-[var(--on-surface-variant)]">Loading...</p>
          ) : loadError || !context ? (
            <div className="rounded-lg border border-dashed border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-6 text-center">
              <p className="text-body-md text-[var(--on-surface)]">{loadError || "Booking not found"}</p>
              <Link
                className="mt-4 inline-flex min-h-10 items-center justify-center rounded-md bg-[var(--primary)] px-4 text-label-md text-[var(--on-primary)]"
                href="/customer/bookings"
              >
                Back to bookings
              </Link>
            </div>
          ) : context.alreadyReviewed ? (
            <div className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-6 text-center">
              <BadgeCheck className="mx-auto h-7 w-7 text-[var(--primary)]" />
              <p className="mt-2 text-label-lg text-[var(--on-surface)]">You&apos;ve already reviewed this service</p>
              <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                Thanks for helping {context.providerName} build trust.
              </p>
              <Link
                className="mt-4 inline-flex min-h-10 items-center justify-center rounded-md bg-[var(--primary)] px-4 text-label-md text-[var(--on-primary)]"
                href="/customer/bookings"
              >
                Back to bookings
              </Link>
            </div>
          ) : (
            <>
              <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-high)]">
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,#ffffff_0%,#dadada_100%)]" />
                    <User className="absolute bottom-1 h-8 w-8 text-[var(--on-surface-variant)] opacity-45" />
                    <span className="relative z-10 text-label-lg">{context.providerInitials}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-1">
                      <h2 className="truncate text-headline-sm">{context.providerName}</h2>
                      <BadgeCheck className="h-4 w-4 shrink-0 fill-current" />
                    </div>
                    <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">{context.serviceTitle}</p>
                  </div>
                </div>
              </section>

              <section className="flex flex-col items-center gap-3 text-center">
                <h2 className="text-headline-md">How was your experience?</h2>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      aria-label={`${star} star rating`}
                      className="flex h-11 w-11 items-center justify-center"
                      key={star}
                      onClick={() => setRating(star)}
                      type="button"
                    >
                      <Star
                        className={
                          star <= rating
                            ? "h-9 w-9 fill-current text-[var(--primary)]"
                            : "h-9 w-9 text-[var(--outline-variant)]"
                        }
                      />
                    </button>
                  ))}
                </div>
                <p className="text-body-sm text-[var(--on-surface-variant)]">
                  {rating ? ratingLabels[rating] : "Tap a star to rate"}
                </p>
              </section>

              <section className="flex flex-col gap-3">
                <h2 className="text-label-lg">What did they do well?</h2>
                <div className="flex flex-wrap gap-2">
                  {reviewTags.map((tag) => {
                    const selected = tags.includes(tag);
                    return (
                      <button
                        className={
                          selected
                            ? "min-h-9 rounded-full border border-[var(--primary)] bg-[var(--primary)] px-3 text-label-md text-[var(--on-primary)]"
                            : "min-h-9 rounded-full border border-[var(--outline)] bg-[var(--surface)] px-3 text-label-md text-[var(--on-surface)]"
                        }
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        type="button"
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="flex flex-col gap-2">
                <h2 className="text-label-lg">Additional comments</h2>
                <textarea
                  className="min-h-28 resize-none rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3 text-body-md outline-none placeholder:text-[var(--on-surface-variant)] focus:border-[var(--primary)]"
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Share more details about your experience..."
                  value={comment}
                />
              </section>

              {submitError ? (
                <p className="rounded-md border border-[var(--error)] bg-[var(--error-container)] px-3 py-2 text-body-sm text-[var(--on-error-container)]">
                  {submitError}
                </p>
              ) : null}

              <button
                className="flex min-h-12 items-center justify-center rounded-md bg-[var(--primary)] px-4 text-label-lg text-[var(--on-primary)] disabled:opacity-60"
                disabled={submitting || rating < 1}
                onClick={handleSubmit}
                type="button"
              >
                {submitting ? "Submitting..." : "Submit review"}
              </button>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default function CustomerRatingReviewPage() {
  return (
    <Suspense fallback={null}>
      <RatingReviewContent />
    </Suspense>
  );
}
