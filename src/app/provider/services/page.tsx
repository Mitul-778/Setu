"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Brush,
  Camera,
  Check,
  ChefHat,
  GraduationCap,
  Info,
  Plus,
  PlugZap,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";
import {
  providerExperienceLevels,
  providerLanguageOptions,
  providerServiceOptions,
  type ProviderExperienceId,
  type ProviderServiceId,
} from "@/lib/provider-profile-draft";
import { useProviderProfileDraft } from "@/lib/use-provider-profile-draft";

const serviceIcons = {
  mehendi: Brush,
  chef: ChefHat,
  makeup: WandSparkles,
  photo: Camera,
  electrician: PlugZap,
  tutor: GraduationCap,
} satisfies Record<ProviderServiceId, typeof Brush>;

export default function ProviderServicesPage() {
  const { draft, updateDraft, updateStructuredDraft } = useProviderProfileDraft();
  const selectedServices = draft.serviceIds;
  const selectedLanguages = draft.languages;
  const experience = draft.experienceLevel;

  function toggleService(id: ProviderServiceId) {
    const nextServices = selectedServices.includes(id)
      ? selectedServices.filter((item) => item !== id)
      : [...selectedServices, id];

    if (!nextServices.length) {
      return;
    }

    updateStructuredDraft({ serviceIds: nextServices });
  }

  function toggleLanguage(language: string) {
    const nextLanguages = selectedLanguages.includes(language)
      ? selectedLanguages.filter((item) => item !== language)
      : [...selectedLanguages, language];

    if (!nextLanguages.length) {
      return;
    }

    updateStructuredDraft({ languages: nextLanguages });
  }

  function selectExperience(experienceLevel: ProviderExperienceId) {
    updateStructuredDraft({ experienceLevel });
  }

  function updateServiceName(index: number, value: string) {
    updateDraft({
      serviceNames: draft.serviceNames.map((name, itemIndex) =>
        itemIndex === index ? value : name
      ),
    });
  }

  function addServiceName() {
    updateDraft({ serviceNames: [...draft.serviceNames, "New service"] });
  }

  function removeServiceName(index: number) {
    const nextNames = draft.serviceNames.filter((_, itemIndex) => itemIndex !== index);
    updateDraft({ serviceNames: nextNames.length ? nextNames : ["New service"] });
  }


  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)] pb-[calc(92px+env(safe-area-inset-bottom))]">
        <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
          <div className="flex h-12 items-center justify-between gap-2 px-4 min-[390px]:px-5">
            <button
              aria-label="Go back"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--on-surface)]"
              type="button"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="min-w-0 flex-1 truncate text-center text-headline-sm text-[var(--primary)]">
              Register as Provider
            </h1>
            <Link
              aria-label="Open AI profile assistant"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--on-surface-variant)]"
              href="/provider/profile-assistant"
            >
              <Sparkles className="h-5 w-5 fill-current" />
            </Link>
          </div>
        </header>

        <section className="px-4 py-5 min-[390px]:px-5 min-[390px]:py-6">
          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-label-md text-[var(--on-surface-variant)]">
                Step 2 of 4
              </span>
              <span className="text-label-md text-[var(--on-surface-variant)]">
                Services
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              <div className="h-1.5 rounded-full bg-[var(--primary)]" />
              <div className="h-1.5 rounded-full bg-[var(--primary)]" />
              <div className="h-1.5 rounded-full bg-[var(--surface-container-highest)]" />
              <div className="h-1.5 rounded-full bg-[var(--surface-container-highest)]" />
            </div>
          </div>

          <div>
            <h2 className="text-headline-lg text-[var(--on-surface)]">
              What services do you offer?
            </h2>
            <p className="mt-2 text-body-md text-[var(--on-surface-variant)]">
              Select all that apply. You can add more later, or use Setu AI from the top-right icon.
            </p>
          </div>

          <section className="mt-6 grid grid-cols-2 gap-3" aria-label="Service categories">
            {providerServiceOptions.map(({ id, label }) => {
              const selected = selectedServices.includes(id);
              const Icon = serviceIcons[id];

              return (
                <button
                  className={
                    selected
                      ? "relative flex min-h-28 flex-col items-center justify-center gap-2 rounded-lg border-2 border-[var(--primary)] bg-[var(--surface-container-lowest)] p-3 text-center text-[var(--on-surface)]"
                      : "relative flex min-h-28 flex-col items-center justify-center gap-2 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3 text-center text-[var(--on-surface)]"
                  }
                  key={id}
                  onClick={() => toggleService(id)}
                  type="button"
                >
                  {selected ? (
                    <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--on-primary)]">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  ) : null}
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[var(--surface-container)] text-[var(--primary)]">
                    <Icon className="h-6 w-6" strokeWidth={2.25} />
                  </span>
                  <span className="text-label-lg text-[var(--on-surface)]">{label}</span>
                </button>
              );
            })}
          </section>

          <section className="mt-7">
            <h3 className="text-headline-sm text-[var(--on-surface)]">
              Languages Spoken
            </h3>
            <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
              Select languages you are fluent in.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {providerLanguageOptions.map((language) => {
                const selected = selectedLanguages.includes(language);

                return (
                  <button
                    className={
                      selected
                        ? "min-h-9 rounded-full border border-[var(--primary)] bg-[var(--primary)] px-4 text-label-md text-[var(--on-primary)]"
                        : "min-h-9 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-4 text-label-md text-[var(--on-surface)]"
                    }
                    key={language}
                    onClick={() => toggleLanguage(language)}
                    type="button"
                  >
                    {language}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-7">
            <h3 className="text-headline-sm text-[var(--on-surface)]">
              Experience Level
            </h3>
            <div className="mt-3 flex flex-col gap-2">
              {providerExperienceLevels.map(({ copy, id, title }) => {
                const selected = experience === id;

                return (
                  <button
                    className={
                      selected
                        ? "flex min-h-16 items-center gap-3 rounded-lg border-2 border-[var(--primary)] bg-[var(--surface-container-lowest)] p-3 text-left"
                        : "flex min-h-16 items-center gap-3 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3 text-left"
                    }
                    key={id}
                    onClick={() => selectExperience(id)}
                    type="button"
                  >
                    <span
                      className={
                        selected
                          ? "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[var(--primary)]"
                          : "flex h-5 w-5 shrink-0 rounded-full border-2 border-[var(--outline)]"
                      }
                    >
                      {selected ? <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" /> : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-label-lg text-[var(--on-surface)]">
                        {title}
                      </span>
                      <span className="block text-body-sm text-[var(--on-surface-variant)]">
                        {copy}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-7">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-headline-sm text-[var(--on-surface)]">
                  Profile Details
                </h3>
                <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
Fill manually here, or use Setu AI to draft the same profile details.
                </p>
              </div>
              <Link
                className="flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container)] px-3 text-label-md text-[var(--primary)]"
                href="/provider/profile-assistant"
              >
                <Sparkles className="h-4 w-4 fill-current" />
                AI
              </Link>
            </div>

            <label className="block">
              <span className="text-label-md text-[var(--on-surface)]">Profile Bio</span>
              <textarea
                className="mt-1 min-h-28 w-full resize-none rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3 text-body-md outline-none placeholder:text-[var(--on-surface-variant)] focus:border-[var(--primary)]"
                onChange={(event) => updateDraft({ bio: event.target.value })}
                value={draft.bio}
              />
            </label>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <h4 className="text-label-lg text-[var(--on-surface)]">Service Names</h4>
                <button
                  className="flex min-h-8 items-center gap-1 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 text-label-md"
                  onClick={addServiceName}
                  type="button"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {draft.serviceNames.map((name, index) => (
                  <div className="flex gap-2" key={`${name}-${index}`}>
                    <input
                      className="min-h-11 min-w-0 flex-1 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 text-body-md outline-none focus:border-[var(--primary)]"
                      onChange={(event) => updateServiceName(index, event.target.value)}
                      value={name}
                    />
                    <button
                      aria-label="Remove service name"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]"
                      onClick={() => removeServiceName(index)}
                      type="button"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </section>

          <section className="mt-6 rounded-lg border border-[var(--surface-variant)] bg-[var(--surface-container-low)] p-3">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-[var(--on-surface-variant)]" />
              <p className="text-body-sm text-[var(--on-surface-variant)]">
Manual and AI flows save profile details here. Pricing and packages are handled in Service Settings.
              </p>
            </div>
          </section>
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
              type="button"
            >
              <span>Continue</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}
