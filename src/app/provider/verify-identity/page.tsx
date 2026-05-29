/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  ChevronDown,
  CircleHelp,
  FileImage,
  Info,
  Lock,
  MapPin,
  RotateCcw,
  Search,
  Upload,
  User,
} from "lucide-react";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { submitProviderIdentity } from "@/services/provider-identity-service";

const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

declare global {
  interface Window {
    google?: any;
    __setuGoogleMapsPromise?: Promise<void>;
  }
}

const steps = [
  { id: "id", label: "ID", title: "Upload ID", icon: FileImage },
  { id: "selfie", label: "Selfie", title: "Verify face", icon: Camera },
  { id: "area", label: "Area", title: "Service area", icon: MapPin },
] as const;

type StepId = (typeof steps)[number]["id"];

const stepCopy: Record<StepId, { heading: string; body: string; cta: string }> = {
  id: {
    heading: "Verify your identity",
    body: "Enter your provider name and upload ID documents to build customer trust.",
    cta: "Continue",
  },
  selfie: {
    heading: "Take a selfie",
    body: "We use this to match your face with your ID document.",
    cta: "Verify Face",
  },
  area: {
    heading: "Set your service area",
    body: "Tell us where you can provide services so we can match you with local customers.",
    cta: "Finish Registration",
  },
};

export default function ProviderVerifyIdentityPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState<StepId>("id");
  const [displayName, setDisplayName] = useState("");
  const [documentType, setDocumentType] = useState("Aadhaar Card");
  const [documentFront, setDocumentFront] = useState<File | null>(null);
  const [documentBack, setDocumentBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [serviceArea, setServiceArea] = useState("Indiranagar, Bangalore");
  const [serviceRadiusKm, setServiceRadiusKm] = useState(10);
  const [serviceLat, setServiceLat] = useState(12.9716);
  const [serviceLng, setServiceLng] = useState(77.5946);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const activeIndex = steps.findIndex((step) => step.id === activeStep);
  const progress = ((activeIndex + 1) / steps.length) * 100;
  const current = stepCopy[activeStep];
  const primaryCta = current.cta;

  async function goNext() {
    setError("");

    if (activeStep === "id") {
      if (!displayName.trim()) {
        setError("Provider name is required.");
        return;
      }

      if (!documentFront || !documentBack) {
        setError("Upload both front and back document files.");
        return;
      }
    }

    if (activeStep === "selfie" && !selfie) {
      setError("Upload a selfie to continue verification.");
      return;
    }

    if (activeStep === "area") {
      setSubmitting(true);

      try {
        const result = await submitProviderIdentity({
          displayName,
          documentType,
          documentFront,
          documentBack,
          selfie,
          serviceArea,
          serviceRadiusKm,
          serviceLat,
          serviceLng,
        });
        router.push(result.nextPath);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Could not save identity details.");
      } finally {
        setSubmitting(false);
      }

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

          {error ? <p className="mt-4 rounded-md bg-[var(--error-container)] px-3 py-2 text-body-sm text-[var(--on-error-container)]">{error}</p> : null}

          <div className="mt-6">
            {activeStep === "id" ? (
              <IdUploadStep
                displayName={displayName}
                documentBack={documentBack}
                documentFront={documentFront}
                documentType={documentType}
                setDisplayName={setDisplayName}
                setDocumentBack={setDocumentBack}
                setDocumentFront={setDocumentFront}
                setDocumentType={setDocumentType}
              />
            ) : null}
            {activeStep === "selfie" ? <SelfieStep selfie={selfie} setSelfie={setSelfie} /> : null}
            {activeStep === "area" ? (
              <ServiceAreaStep
                serviceArea={serviceArea}
                serviceLat={serviceLat}
                serviceLng={serviceLng}
                serviceRadiusKm={serviceRadiusKm}
                setServiceArea={setServiceArea}
                setServiceLat={setServiceLat}
                setServiceLng={setServiceLng}
                setServiceRadiusKm={setServiceRadiusKm}
              />
            ) : null}
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
              className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 text-label-lg text-[var(--on-primary)] disabled:opacity-60"
              disabled={submitting}
              onClick={goNext}
              type="button"
            >
              <span>{submitting ? "Saving..." : primaryCta}</span>
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
      <div className="relative grid grid-cols-3 gap-1">
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

function IdUploadStep({
  displayName,
  documentBack,
  documentFront,
  documentType,
  setDisplayName,
  setDocumentBack,
  setDocumentFront,
  setDocumentType,
}: {
  displayName: string;
  documentBack: File | null;
  documentFront: File | null;
  documentType: string;
  setDisplayName: (value: string) => void;
  setDocumentBack: (file: File | null) => void;
  setDocumentFront: (file: File | null) => void;
  setDocumentType: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-label-md text-[var(--on-surface)]">Provider Name</span>
        <input
          className="min-h-12 rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 text-body-md outline-none focus:border-[var(--primary)]"
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder="Enter your full name"
          type="text"
          value={displayName}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-label-md text-[var(--on-surface)]">Document Type</span>
        <span className="relative block">
          <select
            className="min-h-12 w-full appearance-none rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 pr-10 text-body-md outline-none focus:border-[var(--primary)]"
            onChange={(event) => setDocumentType(event.target.value)}
            value={documentType}
          >
            <option>Aadhaar Card</option>
            <option>PAN Card</option>
            <option>Voter ID</option>
            <option>Driving License</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--on-surface-variant)]" />
        </span>
      </label>

      <UploadBox file={documentFront} onChange={setDocumentFront} title="Upload Front" />
      <UploadBox file={documentBack} onChange={setDocumentBack} title="Upload Back" />

      <TrustNote icon={Lock}>
        Your data is encrypted and used only for verification. We do not share ID documents with customers.
      </TrustNote>
    </div>
  );
}

function UploadBox({
  file,
  onChange,
  title,
}: {
  file: File | null;
  onChange: (file: File | null) => void;
  title: string;
}) {
  return (
    <label className="relative flex h-36 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] text-center">
      <input
        accept="image/*"
        className="sr-only"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        type="file"
      />
      {file?.type.startsWith("image/") ? (
        <SelectedFilePreview file={file} />
      ) : (
        <span className="flex flex-col items-center justify-center gap-3 p-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-container)] text-[var(--on-surface-variant)]">
            <Upload className="h-6 w-6" />
          </span>
          <span>
            <span className="block text-label-lg text-[var(--on-surface)]">{title}</span>
            <span className="block max-w-[16rem] truncate text-body-sm text-[var(--on-surface-variant)]">
              JPG or PNG up to 5MB
            </span>
          </span>
        </span>
      )}
    </label>
  );
}

function SelectedFilePreview({ file }: { file: File }) {
  const previewUrl = useImagePreviewUrl(file);

  if (!previewUrl) return null;

  return <img alt={`Preview of ${file.name}`} className="absolute inset-0 h-full w-full object-cover grayscale" src={previewUrl} />;
}

function SelectedSelfiePreview({ file }: { file: File }) {
  const previewUrl = useImagePreviewUrl(file);

  if (!previewUrl) return null;

  return <img alt="Selfie preview" className="absolute inset-0 h-full w-full object-cover grayscale" src={previewUrl} />;
}

function useImagePreviewUrl(file: File) {
  return useMemo(() => URL.createObjectURL(file), [file]);
}
function SelfieStep({ selfie, setSelfie }: { selfie: File | null; setSelfie: (file: File | null) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative mx-auto flex aspect-square w-full max-w-[18rem] items-center justify-center overflow-hidden rounded-full border-2 border-[var(--outline-variant)] bg-[var(--surface-container-low)]">
        {selfie?.type.startsWith("image/") ? (
          <SelectedSelfiePreview file={selfie} />
        ) : (
          <User className="h-32 w-32 text-[var(--surface-container-highest)]" />
        )}
        <div className="absolute left-6 right-6 top-1/2 h-0.5 rounded-full bg-[var(--primary)] shadow-[0_0_12px_rgb(0_0_0_/_0.35)]" />
        <div className="absolute inset-5 rounded-full border border-[var(--outline-variant)]" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="flex min-h-12 items-center justify-center gap-2 rounded-md border border-[var(--outline)] bg-[var(--surface-container-lowest)] text-label-lg" onClick={() => setSelfie(null)} type="button">
          <RotateCcw className="h-5 w-5" />
          Retake
        </button>
        <label className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-md bg-[var(--primary)] text-label-lg text-[var(--on-primary)]">
          <input
            accept="image/*"
            className="sr-only"
            onChange={(event) => setSelfie(event.target.files?.[0] ?? null)}
            type="file"
          />
          <Camera className="h-5 w-5" />
          {selfie ? "Selfie Added" : "Upload Selfie"}
        </label>
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

function ServiceAreaStep({
  serviceArea,
  serviceLat,
  serviceLng,
  serviceRadiusKm,
  setServiceArea,
  setServiceLat,
  setServiceLng,
  setServiceRadiusKm,
}: {
  serviceArea: string;
  serviceLat: number;
  serviceLng: number;
  serviceRadiusKm: number;
  setServiceArea: (value: string) => void;
  setServiceLat: (value: number) => void;
  setServiceLng: (value: number) => void;
  setServiceRadiusKm: (value: number) => void;
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const googleMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const radiusCircleRef = useRef<any>(null);
  const placesLibraryRef = useRef<any>(null);
  const [locationQuery, setLocationQuery] = useState(serviceArea);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [mapsReady, setMapsReady] = useState(false);
  const [mapsError, setMapsError] = useState(false);

  useEffect(() => {
    if (!googleMapsApiKey || !mapRef.current) return;

    let cancelled = false;

    loadGoogleMapsScript(googleMapsApiKey)
      .then(async () => {
        if (cancelled || !window.google || !mapRef.current) return;

        const center = { lat: serviceLat, lng: serviceLng };
        const map = new window.google.maps.Map(mapRef.current, {
          center,
          clickableIcons: false,
          disableDefaultUI: true,
          gestureHandling: "greedy",
          mapTypeControl: false,
          streetViewControl: false,
          zoom: 13,
        });
        const marker = new window.google.maps.Marker({
          map,
          position: center,
        });
        const circle = new window.google.maps.Circle({
          center,
          clickable: false,
          fillColor: "#000000",
          fillOpacity: 0.06,
          map,
          radius: serviceRadiusKm * 1000,
          strokeColor: "#000000",
          strokeOpacity: 0.4,
          strokeWeight: 1,
        });
        googleMapRef.current = map;
        markerRef.current = marker;
        radiusCircleRef.current = circle;
        setMapsReady(true);
        fitMapToCircle(circle, map);

        window.google.maps.importLibrary("places")
          .then((placesLibrary: any) => {
            placesLibraryRef.current = placesLibrary;
          })
          .catch(() => {
            placesLibraryRef.current = null;
          });
      })
      .catch(() => setMapsError(true));

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!suggestionsOpen || !mapsReady || !placesLibraryRef.current || locationQuery.trim().length < 2) return;

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      const center = { lat: serviceLat, lng: serviceLng };
      const { AutocompleteSuggestion } = placesLibraryRef.current;
      const response = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input: locationQuery,
        includedRegionCodes: ["in"],
        locationBias: { center, radius: serviceRadiusKm * 1000 },
      }).catch(() => null);

      if (!cancelled) {
        setSuggestions(response?.suggestions ?? []);
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [locationQuery, mapsReady, serviceLat, serviceLng, serviceRadiusKm, suggestionsOpen]);

  useEffect(() => {
    const circle = radiusCircleRef.current;
    const map = googleMapRef.current;

    if (!circle || !map) return;

    circle.setRadius(serviceRadiusKm * 1000);
    fitMapToCircle(circle, map);
  }, [serviceRadiusKm]);

  function geocodeTypedLocation() {
    if (!window.google?.maps?.Geocoder || !googleMapRef.current || !locationQuery.trim()) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { address: locationQuery, componentRestrictions: { country: "IN" } },
      (results: any[], status: string) => {
        const firstResult = results?.[0];
        const location = firstResult?.geometry?.location;

        if (status !== "OK" || !location) return;

        const nextCenter = { lat: location.lat(), lng: location.lng() };
        const nextArea = firstResult.formatted_address || locationQuery;

        markerRef.current?.setPosition(nextCenter);
        radiusCircleRef.current?.setCenter(nextCenter);
        fitMapToCircle(radiusCircleRef.current, googleMapRef.current);
        setLocationQuery(nextArea);
        setSuggestions([]);
        setSuggestionsOpen(false);
        setServiceArea(nextArea);
        setServiceLat(nextCenter.lat);
        setServiceLng(nextCenter.lng);
      },
    );
  }
  async function selectSuggestion(suggestion: any) {
    const place = suggestion.placePrediction.toPlace();
    await place.fetchFields({ fields: ["displayName", "formattedAddress", "location"] });

    if (!place.location) return;

    const nextCenter = { lat: place.location.lat(), lng: place.location.lng() };
    const nextArea = place.formattedAddress || place.displayName || suggestion.placePrediction.text?.text || locationQuery;

    markerRef.current?.setPosition(nextCenter);
    radiusCircleRef.current?.setCenter(nextCenter);
    googleMapRef.current?.panTo(nextCenter);
    fitMapToCircle(radiusCircleRef.current, googleMapRef.current);
    setLocationQuery(nextArea);
    setSuggestions([]);
    setSuggestionsOpen(false);
    setServiceArea(nextArea);
    setServiceLat(nextCenter.lat);
    setServiceLng(nextCenter.lng);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]">
        <div className="relative h-64 overflow-hidden bg-[var(--surface-container)]">
          {googleMapsApiKey && !mapsError ? (
            <div className="h-full w-full grayscale" ref={mapRef} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-body-sm text-[var(--on-surface-variant)]">
              {googleMapsApiKey
                ? "Google Maps could not load. Check Maps JavaScript API, Places API (New), and key restrictions."
                : "Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable Google Maps."}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 p-4">
          <div className="relative">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--on-surface-variant)]" />
              <input
                className="min-h-12 w-full rounded-md border border-[var(--outline-variant)] bg-[var(--surface)] px-10 text-body-md outline-none focus:border-[var(--primary)]"
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setLocationQuery(nextValue);
                  setServiceArea(nextValue);
                  setSuggestionsOpen(nextValue.trim().length >= 2);
                  if (nextValue.trim().length < 2) setSuggestions([]);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    geocodeTypedLocation();
                  }
                }}

                placeholder="Search city, area, or landmark"
                type="text"
                value={locationQuery}
              />
            </label>
            {suggestionsOpen && suggestions.length ? (
              <div className="absolute left-0 right-0 top-[calc(100%+0.25rem)] z-50 max-h-56 overflow-y-auto rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] shadow-[0_4px_12px_rgb(0_0_0_/_0.12)]">
                {suggestions.map((suggestion, index) => (
                  <button
                    className="flex min-h-12 w-full items-start border-b border-[var(--surface-container)] px-3 py-2 text-left text-body-sm last:border-b-0"
                    key={`${suggestion.placePrediction?.placeId ?? index}`}
                    onClick={() => selectSuggestion(suggestion)}
                    type="button"
                  >
                    {suggestion.placePrediction?.text?.text ?? "Select location"}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="text-label-lg text-[var(--on-surface)]">Service Radius</label>
              <span className="rounded bg-[var(--surface-container)] px-2 py-1 text-label-md text-[var(--on-surface-variant)]">{serviceRadiusKm} km</span>
            </div>
            <input
              className="w-full accent-[var(--primary)]"
              max="50"
              min="1"
              onChange={(event) => setServiceRadiusKm(Number(event.target.value))}
              type="range"
              value={serviceRadiusKm}
            />
            <div className="mt-1 flex justify-between text-label-sm text-[var(--on-surface-variant)]">
              <span>1 km</span>
              <span>50 km</span>
            </div>
          </div>
        </div>
      </div>

      <TrustNote icon={Info}>
        Showing matches for {serviceArea || "your selected area"} within a {serviceRadiusKm} km radius. You can update this later.
      </TrustNote>
    </div>
  );
}

function fitMapToCircle(circle: any, map: any) {
  const bounds = circle?.getBounds?.();
  if (bounds && map) map.fitBounds(bounds, 28);
}
function loadGoogleMapsScript(apiKey: string) {
  if (window.google?.maps) return Promise.resolve();
  if (window.__setuGoogleMapsPromise) return window.__setuGoogleMapsPromise;

  window.__setuGoogleMapsPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>("script[data-setu-google-maps]");

    if (existingScript) {
      if (window.google?.maps) {
        resolve();
        return;
      }
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Google Maps failed to load.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.dataset.setuGoogleMaps = "true";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly&libraries=places`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google Maps failed to load."));
    document.head.appendChild(script);
  });

  return window.__setuGoogleMapsPromise;
}

function TrustNote({
  children,
  icon: Icon,
}: {
  children: ReactNode;
  icon: typeof Lock;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-[var(--surface-variant)] bg-[var(--surface-container-low)] p-3">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--on-surface-variant)]" />
      <p className="text-body-sm text-[var(--on-surface-variant)]">{children}</p>
    </div>
  );
}