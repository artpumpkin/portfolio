/* Build substitutes the version and asset list into public/sw.js. */
const VERSION = "__VERSION__";
const ASSETS = "__ASSETS__";
const PREFIX = "lachkar-offline-";
const CACHE = PREFIX + VERSION;

self.addEventListener("install", (event) => {
  // A failed download must not replace the previous complete offline version.
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      try {
        await cache.addAll(
          ASSETS.map((url) => new Request(url, { cache: "reload" })),
        );
      } catch (error) {
        await caches.delete(CACHE);
        throw error;
      }
    })(),
  );
  // Let existing tabs finish before activating a new version.
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) {
        if (key.startsWith(PREFIX) && key !== CACHE) await caches.delete(key);
      }
      await self.clients.claim();
    })(),
  );
});

async function networkOrSaved(request, key) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    const response = await fetch(request, { signal: controller.signal });
    if (response.status < 500) return response;
    const cache = await caches.open(CACHE);
    return (await cache.match(key, { ignoreVary: true })) || response;
  } catch (error) {
    const cache = await caches.open(CACHE);
    const saved = await cache.match(key, { ignoreVary: true });
    if (saved) return saved;
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate" && url.pathname === "/") {
    // Keep a coherent build snapshot offline; always prefer live content online.
    event.respondWith(networkOrSaved(request, "/"));
  } else if (
    url.pathname.startsWith("/_next/static/") &&
    ASSETS.includes(url.pathname)
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE);
        return (await cache.match(url.pathname)) || fetch(request);
      })(),
    );
  } else if (url.pathname !== "/" && ASSETS.includes(url.pathname)) {
    event.respondWith(networkOrSaved(request, url.pathname));
  }
  // API responses, RSC requests, unknown pages and external links stay network-only.
});
