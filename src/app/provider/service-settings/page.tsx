"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Edit3,
  MapPin,
  Plus,
  Save,
  Settings2,
  X,
} from "lucide-react";
import {
  loadProviderServiceSettings,
  saveProviderServiceSettings,
  type AvailabilitySlotInput,
  type ProviderPackageInput,
} from "@/services/provider-service-settings-service";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
type SavingAction = "draft" | "finish" | null;

type PackageDraft = {
  editIndex: number | null;
  name: string;
  description: string;
  priceInr: string;
  durationMin: string;
};

const emptyPackageDraft: PackageDraft = {
  editIndex: null,
  name: "",
  description: "",
  priceInr: "",
  durationMin: "",
};

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toMonthLabel(date: Date) {
  return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function getCurrentMonthDateBounds() {
  const today = new Date();
  const firstDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return {
    label: toMonthLabel(firstDate),
    max: toDateKey(lastDate),
    min: toDateKey(firstDate),
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function toDateLabel(value: string) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

export default function ProviderServiceSettingsPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<ProviderPackageInput[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlotInput[]>([]);
  const [packageDraft, setPackageDraft] = useState<PackageDraft>(emptyPackageDraft);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [customQuoteEnabled, setCustomQuoteEnabled] = useState(true);
  const [travelRadiusKm, setTravelRadiusKm] = useState(10);
  const [suggestedNeighborhoods, setSuggestedNeighborhoods] = useState<string[]>([]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [blackoutDates, setBlackoutDates] = useState<string[]>([]);
  const [blackoutDateInput, setBlackoutDateInput] = useState("");
  const [weekendSurchargePct, setWeekendSurchargePct] = useState(0);
  const [holidaySurchargePct, setHolidaySurchargePct] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [savingAction, setSavingAction] = useState<SavingAction>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    loadProviderServiceSettings()
      .then((data) => {
        if (cancelled) return;
        setPackages(data.packages);
        setAvailability(data.availability);
        setCustomQuoteEnabled(data.customQuoteEnabled);
        setTravelRadiusKm(data.travelRadiusKm);
        setSuggestedNeighborhoods(data.suggestedNeighborhoods);
        setSelectedNeighborhoods(data.neighborhoods);
        setBlackoutDates(data.blackoutDates);
        setWeekendSurchargePct(data.weekendSurchargePct);
        setHolidaySurchargePct(data.holidaySurchargePct);
        setError("");
      })
      .catch((loadError) => {
        if (cancelled) return;
        setError(getErrorMessage(loadError));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function updatePackageDraft(patch: Partial<PackageDraft>) {
    setPackageDraft((current) => ({ ...current, ...patch }));
  }

  function openPackageForm(index: number | null = null) {
    if (index == null) {
      setPackageDraft(emptyPackageDraft);
    } else {
      const item = packages[index];
      setPackageDraft({
        editIndex: index,
        name: item.name,
        description: item.description,
        priceInr: String(item.priceInr),
        durationMin: item.durationMin ? String(item.durationMin) : "",
      });
    }
    setShowPackageForm(true);
  }

  function savePackageDraft() {
    const name = packageDraft.name.trim();
    const description = packageDraft.description.trim();
    const priceInr = Number(packageDraft.priceInr);
    const durationMin = packageDraft.durationMin ? Number(packageDraft.durationMin) : null;

    if (!name || !Number.isFinite(priceInr) || priceInr <= 0) {
      setError("Enter package name and valid price.");
      return;
    }

    const nextPackage: ProviderPackageInput = {
      name,
      description,
      priceInr: Math.round(priceInr),
      durationMin: durationMin && Number.isFinite(durationMin) ? Math.round(durationMin) : null,
    };

    setPackages((current) => {
      if (packageDraft.editIndex == null) return [...current, nextPackage];
      return current.map((item, index) => index === packageDraft.editIndex ? { ...nextPackage, id: item.id } : item);
    });
    setPackageDraft(emptyPackageDraft);
    setShowPackageForm(false);
    setError("");
  }

  function removePackage(index: number) {
    setPackages((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function updateAvailability(weekday: number, patch: Partial<AvailabilitySlotInput>) {
    setAvailability((current) =>
      current.map((slot) => slot.weekday === weekday ? { ...slot, ...patch } : slot)
    );
  }

  function toggleNeighborhood(neighborhood: string) {
    setSelectedNeighborhoods((current) =>
      current.includes(neighborhood)
        ? current.filter((item) => item !== neighborhood)
        : [...current, neighborhood]
    );
  }


  function removeBlackoutDate(date: string) {
    setBlackoutDates((current) => current.filter((item) => item !== date));
  }

  async function persistSettings(action: Exclude<SavingAction, null>) {
    setSavingAction(action);
    setError("");

    try {
      const saved = await saveProviderServiceSettings({
        packages,
        customQuoteEnabled,
        travelRadiusKm,
        neighborhoods: selectedNeighborhoods,
        blackoutDates,
        weekendSurchargePct,
        holidaySurchargePct,
        availability,
      });

      setPackages(saved.packages);
      setAvailability(saved.availability);
      setCustomQuoteEnabled(saved.customQuoteEnabled);
      setTravelRadiusKm(saved.travelRadiusKm);
      setSuggestedNeighborhoods(saved.suggestedNeighborhoods);
      setSelectedNeighborhoods(saved.neighborhoods);
      setBlackoutDates(saved.blackoutDates);
      setWeekendSurchargePct(saved.weekendSurchargePct);
      setHolidaySurchargePct(saved.holidaySurchargePct);

      if (action === "finish") router.push(saved.nextPath);
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setSavingAction(null);
    }
  }

  const isBusy = isLoading || savingAction !== null;
  const displayedNeighborhoods = [...suggestedNeighborhoods, ...selectedNeighborhoods]
    .filter((item, index, array) => array.indexOf(item) === index);
  const currentMonthDateBounds = getCurrentMonthDateBounds();

  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)] pb-[calc(92px+env(safe-area-inset-bottom))]">
        <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
          <div className="flex h-12 items-center justify-between gap-2 px-4 min-[390px]:px-5">
            <button
              aria-label="Go back"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--on-surface)]"
              onClick={() => router.back()}
              type="button"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="min-w-0 flex-1 truncate text-center text-headline-sm text-[var(--primary)]">
              Service Settings
            </h1>
            <button
              aria-label="Save settings"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--primary)] disabled:opacity-60"
              disabled={isBusy}
              onClick={() => persistSettings("draft")}
              type="button"
            >
              <Save className="h-5 w-5" />
            </button>
          </div>
        </header>

        <section className="px-4 py-5 min-[390px]:px-5 min-[390px]:py-6">
          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-label-md text-[var(--on-surface-variant)]">Step 4 of 4</span>
              <span className="text-label-md text-[var(--on-surface)]">Settings</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              <div className="h-1.5 rounded-full bg-[var(--primary)]" />
              <div className="h-1.5 rounded-full bg-[var(--primary)]" />
              <div className="h-1.5 rounded-full bg-[var(--primary)]" />
              <div className="h-1.5 rounded-full bg-[var(--primary)]" />
            </div>
          </div>

          {isLoading ? (
            <div className="mb-4 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-3 py-2 text-body-sm text-[var(--on-surface-variant)]">
              Loading saved service settings...
            </div>
          ) : null}

          {error ? (
            <div className="mb-4 rounded-md border border-[var(--error)] bg-[var(--error-container)] px-3 py-2 text-body-sm text-[var(--on-error-container)]">
              {error}
            </div>
          ) : null}

          <section>
            <h2 className="text-headline-md text-[var(--on-surface)]">Package Builder</h2>
            <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
              Define offerings, pricing tiers, duration, and what customers get.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {packages.map((item, index) => (
                <article
                  className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4"
                  key={`${item.name}-${index}`}
                >
                  <div className="flex items-start justify-between gap-3 border-b border-[var(--surface-variant)] pb-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-label-lg text-[var(--on-surface)]">{item.name}</h3>
                      <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">{item.description || "Custom service package"}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button aria-label={`Edit ${item.name}`} className="text-[var(--on-surface-variant)]" onClick={() => openPackageForm(index)} type="button">
                        <Edit3 className="h-5 w-5" />
                      </button>
                      <button aria-label={`Delete ${item.name}`} className="text-[var(--on-surface-variant)]" onClick={() => removePackage(index)} type="button">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <FieldValue label="Price" value={`${"\u20B9"}${item.priceInr}`} />
                    <FieldValue label="Duration" value={item.durationMin ? `${item.durationMin} min` : "Flexible"} />
                  </div>
                </article>
              ))}
            </div>

            {showPackageForm ? (
              <div className="mt-3 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3">
                <div className="grid gap-2">
                  <input
                    className="min-h-11 rounded-md border border-[var(--outline-variant)] bg-[var(--surface)] px-3 text-body-md outline-none focus:border-[var(--primary)]"
                    onChange={(event) => updatePackageDraft({ name: event.target.value })}
                    placeholder="Package name"
                    value={packageDraft.name}
                  />
                  <textarea
                    className="min-h-20 resize-none rounded-md border border-[var(--outline-variant)] bg-[var(--surface)] px-3 py-2 text-body-md outline-none focus:border-[var(--primary)]"
                    onChange={(event) => updatePackageDraft({ description: event.target.value })}
                    placeholder="What is included"
                    value={packageDraft.description}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      className="min-h-11 rounded-md border border-[var(--outline-variant)] bg-[var(--surface)] px-3 text-body-md outline-none focus:border-[var(--primary)]"
                      inputMode="numeric"
                      onChange={(event) => updatePackageDraft({ priceInr: event.target.value })}
                      placeholder="Price INR"
                      value={packageDraft.priceInr}
                    />
                    <input
                      className="min-h-11 rounded-md border border-[var(--outline-variant)] bg-[var(--surface)] px-3 text-body-md outline-none focus:border-[var(--primary)]"
                      inputMode="numeric"
                      onChange={(event) => updatePackageDraft({ durationMin: event.target.value })}
                      placeholder="Duration min"
                      value={packageDraft.durationMin}
                    />
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    className="min-h-10 rounded-md border border-[var(--outline-variant)] bg-[var(--surface)] px-3 text-label-md text-[var(--on-surface-variant)]"
                    onClick={() => {
                      setShowPackageForm(false);
                      setPackageDraft(emptyPackageDraft);
                    }}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="min-h-10 rounded-md bg-[var(--primary)] px-3 text-label-md text-[var(--on-primary)]"
                    onClick={savePackageDraft}
                    type="button"
                  >
                    {packageDraft.editIndex == null ? "Add Package" : "Save Package"}
                  </button>
                </div>
              </div>
            ) : null}

            <button
              className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[var(--primary)] bg-[var(--surface)] text-label-lg text-[var(--primary)]"
              onClick={() => openPackageForm()}
              type="button"
            >
              <Plus className="h-5 w-5" />
              Add New Package
            </button>
          </section>

          <Divider />

          <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-label-lg text-[var(--on-surface)]">Accept Custom Quotes</h3>
                <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                  Allow customers to request personalized pricing for unique jobs.
                </p>
              </div>
              <button
                aria-label="Toggle custom quotes"
                className={customQuoteEnabled ? "relative h-8 w-14 shrink-0 rounded-full bg-[var(--primary)]" : "relative h-8 w-14 shrink-0 rounded-full bg-[var(--surface-container-highest)]"}
                onClick={() => setCustomQuoteEnabled((current) => !current)}
                type="button"
              >
                <span className={customQuoteEnabled ? "absolute right-1 top-1 h-6 w-6 rounded-full bg-[var(--on-primary)]" : "absolute left-1 top-1 h-6 w-6 rounded-full bg-[var(--surface)]"} />
              </button>
            </div>
          </section>

          <Divider />

          <section>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[var(--primary)]" />
              <h2 className="text-headline-md text-[var(--on-surface)]">Travel Area</h2>
            </div>

            <div className="mt-4 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
              <div className="flex items-center justify-between gap-3">
                <label className="text-label-lg text-[var(--on-surface)]">Travel Radius</label>
                <span className="rounded bg-[var(--surface-container)] px-2 py-1 text-label-md text-[var(--on-surface-variant)]">{travelRadiusKm} km</span>
              </div>
              <input className="mt-4 w-full accent-[var(--primary)]" max="50" min="1" onChange={(event) => setTravelRadiusKm(Number(event.target.value))} type="range" value={travelRadiusKm} />
              <div className="mt-1 flex justify-between text-label-sm text-[var(--on-surface-variant)]">
                <span>1 km</span>
                <span>50 km</span>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-label-lg text-[var(--on-surface)]">Neighborhoods</h3>
              <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                Suggested from your service location. Select areas where you want leads.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {displayedNeighborhoods.length ? displayedNeighborhoods.map((neighborhood) => {
                  const selected = selectedNeighborhoods.includes(neighborhood);
                  return (
                    <button
                      className={selected
                        ? "inline-flex min-h-9 items-center gap-2 rounded-full bg-[var(--primary)] px-3 text-label-md text-[var(--on-primary)]"
                        : "inline-flex min-h-9 items-center gap-2 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 text-label-md text-[var(--on-surface)]"}
                      key={neighborhood}
                      onClick={() => toggleNeighborhood(neighborhood)}
                      type="button"
                    >
                      {neighborhood}
                      {selected ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    </button>
                  );
                }) : (
                  <span className="rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-3 py-2 text-body-sm text-[var(--on-surface-variant)]">
                    Save your service area in Verify Identity to see suggested neighborhoods.
                  </span>
                )}
              </div>
            </div>
          </section>

          <Divider />

          <section>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-[var(--primary)]" />
              <h2 className="text-headline-md text-[var(--on-surface)]">Availability & Pricing</h2>
            </div>
            <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
              Manage calendar availability, blackout dates, and special rates.
            </p>

            <div className="mt-4 space-y-4 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
              <div>
                <h3 className="text-label-lg text-[var(--on-surface)]">Working Days</h3>
                <div className="mt-3 flex justify-between gap-1">
                  {availability.map((slot) => (
                    <button
                      aria-label={`Toggle ${weekDays[slot.weekday]} availability`}
                      className={slot.active
                        ? "min-h-10 flex-1 rounded-lg bg-[var(--primary)] px-1 text-label-md text-[var(--on-primary)]"
                        : "min-h-10 flex-1 rounded-lg bg-[var(--surface-container)] px-1 text-label-md text-[var(--on-surface-variant)]"}
                      key={slot.weekday}
                      onClick={() => updateAvailability(slot.weekday, { active: !slot.active })}
                      type="button"
                    >
                      {weekDays[slot.weekday][0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-[var(--outline-variant)]" />

              <div>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-label-lg text-[var(--on-surface)]">Blackout Dates</h3>
                  <span className="text-label-md text-[var(--on-surface-variant)]">{currentMonthDateBounds.label}</span>
                </div>
                <input
                  className="mt-3 min-h-10 w-full rounded-lg border border-[var(--outline)] bg-[var(--surface-container-lowest)] px-3 text-body-md text-[var(--on-surface)] outline-none focus:border-[var(--primary)]"
                  max={currentMonthDateBounds.max}
                  min={currentMonthDateBounds.min}
                  onChange={(event) => {
                    const nextDate = event.target.value;
                    setBlackoutDateInput("");
                    if (!nextDate) return;
                    setBlackoutDates((current) =>
                      current.includes(nextDate) ? current : [...current, nextDate].sort()
                    );
                  }}
                  type="date"
                  value={blackoutDateInput}
                />
                {blackoutDates.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {blackoutDates.map((date) => (
                      <button className="inline-flex min-h-8 items-center gap-2 rounded-full bg-[var(--surface-container)] px-3 text-label-md" key={date} onClick={() => removeBlackoutDate(date)} type="button">
                        {toDateLabel(date)}
                        <X className="h-3.5 w-3.5" />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="h-px bg-[var(--outline-variant)]" />

              <div>
                <h3 className="text-label-lg text-[var(--on-surface)]">Weekend/Holiday Surcharge</h3>
                <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                  Apply premiums on weekends, festivals, and holidays.
                </p>
                <SurchargeSlider label="Weekend" value={weekendSurchargePct} onChange={setWeekendSurchargePct} />
                <SurchargeSlider label="Holiday" value={holidaySurchargePct} onChange={setHolidaySurchargePct} />
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-lg border border-[var(--surface-variant)] bg-[var(--surface-container-low)] p-3">
            <div className="flex items-start gap-3">
              <Settings2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--on-surface-variant)]" />
              <p className="text-body-sm text-[var(--on-surface-variant)]">
                These settings control what customers can book, where you travel, and when special pricing applies.
              </p>
            </div>
          </section>
        </section>

        <footer className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-[var(--outline-variant)] bg-[var(--surface)] px-4 py-3">
          <div className="grid grid-cols-[1fr_1.35fr] gap-3">
            <button
              className="min-h-12 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-4 text-label-lg text-[var(--on-surface-variant)] disabled:opacity-60"
              disabled={isBusy}
              onClick={() => persistSettings("draft")}
              type="button"
            >
              {savingAction === "draft" ? "Saving..." : "Save Draft"}
            </button>
            <button
              className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 text-label-lg text-[var(--on-primary)] disabled:opacity-60"
              disabled={isBusy}
              onClick={() => persistSettings("finish")}
              type="button"
            >
              <span>{savingAction === "finish" ? "Saving..." : "Finish Setup"}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}

function FieldValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-[var(--surface-container-low)] px-3 py-2">
      <p className="text-label-sm text-[var(--on-surface-variant)]">{label}</p>
      <p className="mt-1 text-label-lg text-[var(--on-surface)]">{value}</p>
    </div>
  );
}

function SurchargeSlider({ label, onChange, value }: { label: string; onChange: (value: number) => void; value: number }) {
  return (
    <div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-3">
      <div>
        <label className="text-label-md text-[var(--on-surface)]">{label}</label>
        <input className="mt-2 w-full accent-[var(--primary)]" max="50" min="0" onChange={(event) => onChange(Number(event.target.value))} type="range" value={value} />
      </div>
      <span className="rounded bg-[var(--surface-container)] px-2 py-1 text-label-md text-[var(--on-surface)]">{value}%</span>
    </div>
  );
}

function Divider() {
  return <div className="my-6 h-px bg-[var(--surface-container-highest)]" />;
}