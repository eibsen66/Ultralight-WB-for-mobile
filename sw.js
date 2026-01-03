/* ASCII-only service worker */
const CACHE_NAME = "wb-ultralight-v2-04-002";
const PRECACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((k) => (k === CACHE_NAME ? Promise.resolve() : caches.delete(k)))
    )).then(() => self.clients.claim())
  );
});

// Network-first for same-origin requests so updates (like cg limit changes) appear promptly.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  event.respondWith((async () => {
    try {
      const resp = await fetch(req);
      try {
        const url = new URL(req.url);
        if (url.origin === self.location.origin) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, resp.clone());
        }
      } catch (e) {}
      return resp;
    } catch (e) {
      const cached = await caches.match(req);
      if (cached) return cached;
      return caches.match("./index.html");
    }
  })());
});
