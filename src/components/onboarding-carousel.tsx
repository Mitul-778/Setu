"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Hammer,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Star,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
  {
    title: "Describe your need in your own words.",
    description:
      "Our AI understands natural language. Just type what you need, and we'll match you with the right professionals instantly.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAjTNVR4wOqIyCNo8DbHvN7DiPE7RO08DSjnd2OM8M3LFfyN2guL4tK6govMlgAgg-3rXM30MAj0SrrZr0DpJ2dkclamsRxW7XYgM3WYq4637c7HNc6bteC63Y5B3mU2kIvG0C7MM7-rBtO7W_ZoszX0eZCNdCEdGyyyS_s69RLg20JZ44Pl6HGjHNi3EbeE4EItEncu-dduFRiRPgKGsU8I5CZQkhyys_G-addhoNlcqQyCappSO2K9R4MYtI4kh7MIFbr-YA8-u0",
    alt: "Abstract grayscale AI communication illustration",
    badgeTop: { icon: MessageSquareText, label: "I need a plumber" },
    badgeBottom: { icon: Sparkles, label: "Finding trusted pros" },
  },
  {
    title: "Get matched with verified local experts.",
    description:
      "Every service provider undergoes background checks and maintains high community ratings to ensure your peace of mind.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBOIZ1gqtQFNMf1OgBtLcbs38l7ASpKsz8qiFKVE5MYqSycrf1jU1tu6BXAPf43bgCr_9Zrnd4PPc3oPH-BYSpgXBfQ1I-k3ksTr1xHUsjgao61s8Unnwi6GffZKE9f0GrdNsMaI_Jf0wA7WdB7cBrqrob79b4JY0RQWo0naGXXHZ08bU2jtx2_PLV5g7E0AR7Xs4JBySJqNc9jg-K1E2IFgUSUvlYIpQQhDSzi9vUJD7_XqiQTuu3pNDwrn4hxR4mU2IyhgX2hDkc",
    alt: "Grayscale verified expert illustration",
    badgeTop: { icon: Star, label: "4.9/5 Average" },
    badgeBottom: { icon: BadgeCheck, label: "ID Checked" },
  },
  {
    title: "Earn with your skill even in a new city.",
    description:
      "Find reliable service opportunities and start working immediately, anywhere across India.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCwucFrByAfOO9uJqWsrVIanMY3SR5pEoS7N49kgC0fJWQcVZUBFOLuQp73TtYZ0YP32xJPztbjS_cN37Djbxk15_sj7a6TKCNtQySA6raOneLGQF4GIGt0MWyHofQUbnEqRJZ_nS7mf8DjuZnkgH9SyB0lKaqf5ezpfrDSSdYtsyMxVLG3ImQKpd1pJHi5VIRkLil5ezXGvqxuVRfICMwp7Z3ha0i4ssHETc-Kwa1-QUURhn4f2nwtsQCIHT_x99FwZuErY3hn2GM",
    alt: "Grayscale professional tools arranged on a workbench",
    badgeTop: { icon: Hammer, label: "Skilled work" },
    badgeBottom: { icon: Wrench, label: "Start earning" },
  },
];

export function OnboardingCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];
  const isLastSlide = activeIndex === slides.length - 1;

  function goBack() {
    setActiveIndex((current) => Math.max(0, current - 1));
  }

  function continueOnboarding() {
    setActiveIndex((current) => Math.min(slides.length - 1, current + 1));
  }

  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col overflow-hidden bg-[var(--background)]">
        <header className="flex h-12 shrink-0 items-center justify-between px-4 min-[390px]:px-5">
          <button
            aria-label="Go back"
            className="flex min-h-12 min-w-12 items-center justify-center rounded-full text-[var(--primary)] disabled:opacity-0"
            disabled={activeIndex === 0}
            onClick={goBack}
            type="button"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <Link
            className="flex min-h-12 items-center px-1 text-label-lg text-[var(--primary)]"
            href="/"
          >
            Skip
          </Link>
        </header>

        <section className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 pb-28 pt-4 min-[390px]:px-5">
          <div className="w-full max-w-[22rem]">
            <IllustrationCard slide={activeSlide} />
          </div>

          <div className="mt-7 w-full max-w-[22rem] text-center min-[390px]:mt-8">
            <h1 className="mx-auto max-w-[20rem] text-headline-lg text-[var(--on-surface)]">
              {activeSlide.title}
            </h1>
            <p className="mx-auto mt-3 max-w-[18.5rem] text-body-md text-[var(--on-surface-variant)]">
              {activeSlide.description}
            </p>
          </div>
        </section>

        <footer className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 bg-[var(--background)] px-4 pb-8 pt-4 min-[390px]:px-5">
          <div className="mx-auto flex w-full max-w-[480px] flex-col items-center gap-5">
            <Dots activeIndex={activeIndex} />

            {isLastSlide ? (
              <Link
                className="flex min-h-12 w-full max-w-[22rem] items-center justify-center rounded-md bg-[var(--primary)] text-label-lg text-[var(--on-primary)]"
                href="/login"
              >
                Get Started
              </Link>
            ) : (
              <button
                className="min-h-12 w-full max-w-[22rem] rounded-md bg-[var(--primary)] text-label-lg text-[var(--on-primary)]"
                onClick={continueOnboarding}
                type="button"
              >
                Continue
              </button>
            )}
          </div>
        </footer>
      </div>
    </main>
  );
}

function IllustrationCard({ slide }: { slide: (typeof slides)[number] }) {
  const TopIcon = slide.badgeTop.icon;
  const BottomIcon = slide.badgeBottom.icon;

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-[var(--surface-variant)] bg-[var(--surface-container)] shadow-[0_4px_12px_rgb(0_0_0_/_0.05)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={slide.alt}
        className="h-full w-full object-cover grayscale"
        src={slide.image}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-container)]/35 to-transparent" />

      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 py-2 text-label-sm text-[var(--on-surface)] shadow-[0_1px_2px_rgb(0_0_0_/_0.06)]">
        <TopIcon className="h-4 w-4" />
        <span>{slide.badgeTop.label}</span>
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 py-2 text-label-sm text-[var(--on-surface)] shadow-[0_1px_2px_rgb(0_0_0_/_0.06)]">
        <BottomIcon className="h-4 w-4" />
        <span>{slide.badgeBottom.label}</span>
      </div>

      <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 py-2 text-label-sm text-[var(--on-surface)] shadow-[0_1px_2px_rgb(0_0_0_/_0.06)]">
        <ShieldCheck className="h-4 w-4" />
        <span>Trusted match</span>
      </div>
    </div>
  );
}

function Dots({ activeIndex }: { activeIndex: number }) {
  return (
    <div aria-label={`Onboarding step ${activeIndex + 1} of ${slides.length}`} className="flex items-center gap-2">
      {slides.map((slide, index) => (
        <span
          aria-hidden
          className={cn(
            "h-2 rounded-full transition-all",
            index === activeIndex
              ? "w-6 bg-[var(--primary)]"
              : "w-2 bg-[var(--outline-variant)]"
          )}
          key={slide.title}
        />
      ))}
    </div>
  );
}
