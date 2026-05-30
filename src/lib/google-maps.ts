/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    google?: any;
    __setuGoogleMapsPromise?: Promise<void>;
  }
}

export const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// Loads the Google Maps JS SDK (with the Places library) exactly once and
// reuses the same promise/script across pages. Shared by the provider
// service-area step and the customer location picker.
export function loadGoogleMapsScript(apiKey: string) {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only load in the browser."));
  }
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
