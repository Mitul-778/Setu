const CACHE_NAME = "setu-static-v2";

const APP_SHELL = [
  "/",
  "/manifest.webmanifest",
  "/setu_logo.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/a_subtle_minimal_grayscale_line_art_illustration_of_an_indian_city_skyline.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => (await caches.match("/")) ?? Response.error())
    );
    return;
  }

  if (shouldCacheAsset(request, url)) {
    event.respondWith(cacheFirst(request));
  }
});

function shouldCacheAsset(request, url) {
  return (
    APP_SHELL.includes(url.pathname) ||
    ["font", "image"].includes(request.destination)
  );
}

async function cacheFirst(request) {
  const cached = await caches.match(request);

  if (cached) {
    return cached;
  }

  const response = await fetch(request);

  if (response && response.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
  }

  return response;
}

