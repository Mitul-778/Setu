"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  BellRing,
  Bug,
  ChevronRight,
  Hammer,
  Leaf,
  MapPin,
  Mic,
  Paintbrush,
  PlugZap,
  Search,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SetupMode = "permissions" | "location" | "interests";

const permissionItems = [
  {
    title: "Location",
    description:
      "Allow us to access your location to quickly find top-rated service providers near you.",
    icon: MapPin,
  },
  {
    title: "Notifications",
    description:
      "Stay updated with real-time alerts about your booking status and important updates.",
    icon: BellRing,
  },
  {
    title: "Microphone",
    description:
      "Enable microphone access to use our fast and convenient AI voice search feature.",
    icon: Mic,
  },
];

const cities = ["Bangalore", "Mumbai", "Delhi NCR", "Hyderabad"];

const neighborhoods = [
  "Indiranagar",
  "Koramangala",
  "Whitefield",
  "Jayanagar",
  "HSR Layout",
];

const serviceCategories = [
  { label: "Plumbing", icon: Wrench },
  { label: "Electrical", icon: PlugZap },
  { label: "Cleaning", icon: ShieldCheck },
  { label: "Pest Control", icon: Bug },
  { label: "Carpentry", icon: Hammer },
  { label: "Appliance Repair", icon: Wrench },
  { label: "Gardening", icon: Leaf },
  { label: "Painting", icon: Paintbrush },
  { label: "Moving", icon: Truck },
];

export function SetupFlow({ mode }: { mode: SetupMode }) {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col overflow-hidden bg-[var(--background)]">
        <SetupHeader />
        {mode === "permissions" && <PermissionsScreen />}
        {mode === "location" && <LocationScreen />}
        {mode === "interests" && <InterestsScreen />}
      </div>
    </main>
  );
}

function SetupHeader() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between px-4 min-[390px]:px-5">
      <Link
        aria-label="Go back"
        className="flex min-h-12 min-w-12 items-center justify-center rounded-full text-[var(--primary)]"
        href="/verify-otp"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <Link
        className="flex min-h-12 items-center px-1 text-label-lg text-[var(--primary)]"
        href="/"
      >
        Skip
      </Link>
    </header>
  );
}

function PermissionsScreen() {
  return (
    <section className="flex min-h-0 flex-1 flex-col px-4 pb-6 pt-8 min-[390px]:px-5">
      <div className="text-center">
        <h1 className="text-headline-lg text-[var(--primary)]">
          Enhance Your Experience
        </h1>
        <p className="mx-auto mt-2 max-w-[21rem] text-body-md text-[var(--on-surface-variant)]">
          We need a few permissions to provide you with the best possible
          service and accurate results.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {permissionItems.map(({ title, description, icon: Icon }) => (
          <article
            className="flex items-start gap-4 rounded-lg border border-[var(--surface-variant)] bg-[var(--surface-container-lowest)] p-4 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]"
            key={title}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--surface-container)]">
              <Icon className="h-6 w-6 text-[var(--primary)]" />
            </div>
            <div>
              <h2 className="text-headline-sm text-[var(--primary)]">
                {title}
              </h2>
              <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                {description}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-2 border-t border-[var(--surface-variant)] pt-6">
        <Link
          className="flex min-h-12 items-center justify-center rounded-md bg-[var(--primary)] text-label-lg text-[var(--on-primary)]"
          href="/select-location"
        >
          Allow All
        </Link>
        <Link
          className="flex min-h-12 items-center justify-center rounded-md text-label-lg text-[var(--on-surface-variant)]"
          href="/select-location"
        >
          Ask me later
        </Link>
      </div>
    </section>
  );
}

function LocationScreen() {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("");

  return (
    <section className="flex min-h-0 flex-1 flex-col px-4 pb-6 pt-4 min-[390px]:px-5">
      <div className="mb-2">
        <h1 className="text-headline-lg text-[var(--primary)]">
          Where are you looking?
        </h1>
        <p className="mt-1 max-w-[21rem] text-body-md text-[var(--on-surface-variant)]">
          Select your city and neighborhood to see available services.
        </p>
      </div>

      <label className="relative mt-5 block">
        <span className="sr-only">Select your city</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--outline)]" />
        <input
          className="min-h-12 w-full rounded-md border border-[var(--outline-variant)] bg-[var(--surface)] px-10 text-body-md outline-none placeholder:text-[var(--outline)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
          placeholder="Select your city"
          type="search"
        />
      </label>

      <div className="mt-6">
        <h2 className="text-label-lg text-[var(--on-surface)]">
          Popular Cities
        </h2>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {cities.map((city) => (
            <button
              className={cn(
                "flex min-h-12 items-center justify-between rounded-md border px-3 text-left text-body-md",
                selectedCity === city
                  ? "border-[var(--primary)] bg-[var(--surface-container-low)]"
                  : "border-[var(--outline-variant)] bg-[var(--surface)]"
              )}
              key={city}
              onClick={() => {
                setSelectedCity(city);
                setSelectedNeighborhood("");
              }}
              type="button"
            >
              <span>{city}</span>
              <span
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-full border",
                  selectedCity === city
                    ? "border-[var(--primary)]"
                    : "border-[var(--outline)]"
                )}
              >
                {selectedCity === city ? (
                  <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                ) : null}
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedCity ? (
        <div className="mt-6 border-t border-[var(--surface-container-high)] pt-5">
          <h2 className="text-label-lg text-[var(--on-surface)]">
            Select your neighborhood
          </h2>
          <label className="relative mt-3 block">
            <span className="sr-only">Search areas</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--outline)]" />
            <input
              className="min-h-12 w-full rounded-md border border-[var(--outline-variant)] bg-[var(--surface)] px-10 text-body-md outline-none placeholder:text-[var(--outline)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
              placeholder="Search areas..."
              type="search"
            />
          </label>

          <div className="no-scrollbar mt-3 max-h-64 overflow-y-auto rounded-md border border-[var(--outline-variant)] bg-[var(--surface)]">
            {neighborhoods.map((neighborhood, index) => (
              <button
                className={cn(
                  "flex min-h-12 w-full items-center justify-between px-4 text-left text-body-md",
                  index < neighborhoods.length - 1 &&
                    "border-b border-[var(--surface-container-high)]",
                  selectedNeighborhood === neighborhood &&
                    "bg-[var(--surface-container-low)]"
                )}
                key={neighborhood}
                onClick={() => setSelectedNeighborhood(neighborhood)}
                type="button"
              >
                <span>{neighborhood}</span>
                <ChevronRight className="h-4 w-4 text-[var(--outline)]" />
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-auto pt-6">
        <Link
          className={cn(
            "flex min-h-12 items-center justify-center rounded-md text-label-lg",
            selectedNeighborhood
              ? "bg-[var(--primary)] text-[var(--on-primary)]"
              : "pointer-events-none bg-[var(--surface-container-high)] text-[var(--on-surface-variant)] opacity-0"
          )}
          href="/interests"
        >
          Continue
        </Link>
      </div>
    </section>
  );
}

function InterestsScreen() {
  const [selected, setSelected] = useState(["Plumbing", "Cleaning"]);

  function toggleCategory(label: string) {
    setSelected((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label]
    );
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col px-4 pb-6 pt-8 min-[390px]:px-5">
      <div>
        <h1 className="max-w-[22rem] text-headline-lg text-[var(--primary)]">
          What services are you looking for?
        </h1>
        <p className="mt-2 max-w-[21rem] text-body-md text-[var(--on-surface-variant)]">
          Select all that apply to help us personalize your experience.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {serviceCategories.map(({ label, icon: Icon }) => {
          const isSelected = selected.includes(label);
          return (
            <button
              className={cn(
                "flex min-h-10 items-center gap-2 rounded-full border px-4 text-label-md transition-colors",
                isSelected
                  ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--on-primary)]"
                  : "border-[var(--outline)] bg-[var(--surface)] text-[var(--on-surface)]"
              )}
              key={label}
              onClick={() => toggleCategory(label)}
              type="button"
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-8">
        <Link
          className="flex min-h-12 items-center justify-center rounded-md bg-[var(--primary)] text-label-lg text-[var(--on-primary)]"
          href="/customer"
        >
          Finish Setup
        </Link>
      </div>
    </section>
  );
}
