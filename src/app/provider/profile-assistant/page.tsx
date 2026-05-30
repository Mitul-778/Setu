"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  Check,
  Edit3,
  Languages,
  Mic,
  Plus,
  RefreshCcw,
  Sparkles,
  User,
  X,
} from "lucide-react";
import {
  getExperienceLabel,
  getServiceLabels,
  getTranslationLanguage,
} from "@/lib/provider-profile-draft";
import { useProviderProfileDraft } from "@/lib/use-provider-profile-draft";

export default function ProviderProfileAssistantPage() {
  const { draft, updateDraft, updateStructuredDraft } = useProviderProfileDraft();
  const serviceLabels = getServiceLabels(draft.serviceIds);
  const experienceLabel = getExperienceLabel(draft.experienceLevel);
  const translationLanguage = getTranslationLanguage(draft.languages);

  function removeServiceName(name: string) {
    updateDraft({ serviceNames: draft.serviceNames.filter((item) => item !== name) });
  }

  function applyAiCommand(command: "simple" | "professional" | "trust") {
    const primaryService = serviceLabels[0].toLowerCase();
    const languages = draft.languages.join(", ");

    if (command === "simple") {
      updateDraft({
        bio: `I provide ${primaryService} services in Bangalore. I speak ${languages}, arrive on time, and explain my service clearly before every booking.`,
      });
      return;
    }

    if (command === "trust") {
      updateDraft({
        bio: `${draft.bio} Customers can expect clear communication, careful work, and reliable follow-up after the service.`,
      });
      return;
    }

    updateDraft({
      bio: `I am a verified ${primaryService} professional in Bangalore with ${experienceLabel} of experience. I provide dependable service, clear communication, and comfortable support in ${languages}.`,
    });
  }

  function regenerateAiDraft() {
    updateStructuredDraft({
      serviceIds: draft.serviceIds,
      languages: draft.languages,
      experienceLevel: draft.experienceLevel,
    });
  }

  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)] pb-[calc(188px+env(safe-area-inset-bottom))]">
        <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
          <div className="flex h-14 items-center justify-between gap-2 px-4 min-[390px]:px-5">
            <Link
              aria-label="Go back"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--on-surface)]"
              href="/provider/services"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="min-w-0 flex-1 truncate text-center text-headline-sm text-[var(--primary)]">
              Setu Provider AI
            </h1>
            <button
              aria-label="Provider profile"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]"
              type="button"
            >
              <User className="h-5 w-5" />
            </button>
          </div>
        </header>

        <section className="px-4 py-5 min-[390px]:px-5 min-[390px]:py-6">
          <h2 className="text-headline-lg text-[var(--on-surface)]">
            AI Profile Assistant
          </h2>

          <section className="mt-4 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3">
            <p className="text-label-md text-[var(--on-surface-variant)]">
              Synced from manual setup
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {serviceLabels.map((label) => (
                <span className="rounded-full bg-[var(--surface-container)] px-3 py-1 text-label-md" key={label}>
                  {label}
                </span>
              ))}
              <span className="rounded-full bg-[var(--surface-container)] px-3 py-1 text-label-md">
                {experienceLabel}
              </span>
              {draft.languages.map((language) => (
                <span className="rounded-full bg-[var(--surface-container)] px-3 py-1 text-label-md" key={language}>
                  {language}
                </span>
              ))}
            </div>
          </section>

          <div className="mt-4 flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--secondary-container)] text-[var(--on-secondary-container)]">
              <Sparkles className="h-4 w-4 fill-current" />
            </div>
            <div className="max-w-[86%] rounded-xl rounded-tl-sm border-2 border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-3 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]">
              <p className="text-body-md text-[var(--on-surface-variant)]">
                Namaste! I drafted a profile from your selected services, languages, and experience. Changes on the services page will update this draft.
              </p>
            </div>
          </div>

          <section className="mt-5 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-headline-sm text-[var(--on-surface)]">Profile Bio</h3>
              <EditWithAiButton label="Edit with AI" onClick={() => applyAiCommand("professional")} />
            </div>

            <p className="mt-3 text-body-md text-[var(--on-surface)]">
              {draft.bio}
            </p>

            <div className="mt-4 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-3">
              <div className="mb-2 flex items-center gap-2 text-label-sm text-[var(--on-surface-variant)]">
                <Languages className="h-4 w-4" />
                <span>Translated to {translationLanguage}</span>
              </div>
              <p className="text-body-sm text-[var(--on-surface-variant)]">
                {draft.translatedBio}
              </p>
            </div>
          </section>

          <section className="mt-4 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-headline-sm text-[var(--on-surface)]">
                Suggested Service Names
              </h3>
              <EditWithAiButton label="Refine" onClick={() => applyAiCommand("simple")} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {draft.serviceNames.map((tag) => (
                <button
                  className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-highest)] px-3 text-label-md text-[var(--on-surface)]"
                  key={tag}
                  onClick={() => removeServiceName(tag)}
                  type="button"
                >
                  {tag}
                  <X className="h-3.5 w-3.5" />
                </button>
              ))}
              <button className="inline-flex min-h-9 items-center gap-2 rounded-full border border-dashed border-[var(--outline)] bg-[var(--surface)] px-3 text-label-md text-[var(--secondary)]" type="button">
                <Plus className="h-3.5 w-3.5" />
                Add Tag
              </button>
            </div>
          </section>


          <section className="mt-4 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-4">
            <div className="flex items-start gap-3">
              <Bot className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary)]" />
              <div>
                <h3 className="text-label-lg text-[var(--on-surface)]">Edit with AI controls</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <AiCommand label="Make simpler" onClick={() => applyAiCommand("simple")} />
                  <AiCommand label="More professional" onClick={() => applyAiCommand("professional")} />
                  <AiCommand label="Add trust points" onClick={() => applyAiCommand("trust")} />
                </div>
              </div>
            </div>
          </section>
        </section>

        <footer className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4 shadow-[0_-4px_12px_rgb(0_0_0_/_0.05)]">
          <label className="relative block">
            <input
              className="min-h-12 w-full rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-4 pr-12 text-body-md outline-none placeholder:text-[var(--on-surface-variant)] focus:border-[var(--primary)]"
              placeholder="Type or speak to refine..."
              type="text"
            />
            <button
              aria-label="Speak to refine profile"
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[var(--primary)]"
              type="button"
            >
              <Mic className="h-5 w-5" />
            </button>
          </label>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button className="flex min-h-12 items-center justify-center gap-2 rounded-md border border-[var(--primary)] bg-[var(--surface-container-lowest)] px-4 text-label-lg text-[var(--primary)]" onClick={regenerateAiDraft} type="button">
              <RefreshCcw className="h-5 w-5" />
              Regenerate
            </button>
            <Link
              className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 text-label-lg text-[var(--on-primary)]"
              href="/provider/showcase"
            >
              <Check className="h-5 w-5" />
              Approve
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}

function EditWithAiButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      className="flex min-h-8 shrink-0 items-center gap-1.5 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-high)] px-2 text-label-sm text-[var(--primary)]"
      onClick={onClick}
      type="button"
    >
      <Edit3 className="h-3.5 w-3.5" />
      <span>{label}</span>
      <Sparkles className="h-3.5 w-3.5 fill-current" />
    </button>
  );
}

function AiCommand({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      className="min-h-8 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 text-label-md text-[var(--on-surface)]"
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
