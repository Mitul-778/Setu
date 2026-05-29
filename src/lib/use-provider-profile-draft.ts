"use client";

import { useEffect, useState } from "react";
import {
  createProviderProfileDraft,
  createStructuredProviderProfileDraft,
  defaultProviderProfileDraft,
  type ProviderProfileDraft,
} from "@/lib/provider-profile-draft";

const STORAGE_KEY = "setu.providerProfileDraft.v1";

export function useProviderProfileDraft() {
  const [draft, setDraft] = useState<ProviderProfileDraft>(defaultProviderProfileDraft);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);

      if (saved) {
        setDraft(createProviderProfileDraft(JSON.parse(saved)));
      }
    } catch {
      setDraft(defaultProviderProfileDraft);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft, loaded]);

  function updateDraft(patch: Partial<ProviderProfileDraft>) {
    setDraft((current) => createProviderProfileDraft({ ...current, ...patch }));
  }

  function updateStructuredDraft(
    patch: Partial<Pick<ProviderProfileDraft, "serviceIds" | "languages" | "experienceLevel">>
  ) {
    setDraft((current) =>
      createStructuredProviderProfileDraft({
        serviceIds: patch.serviceIds || current.serviceIds,
        languages: patch.languages || current.languages,
        experienceLevel: patch.experienceLevel || current.experienceLevel,
      })
    );
  }

  function resetDraft() {
    setDraft(defaultProviderProfileDraft);
  }

  return {
    draft,
    loaded,
    resetDraft,
    updateDraft,
    updateStructuredDraft,
  };
}
