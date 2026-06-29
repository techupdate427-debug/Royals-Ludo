/*
 * Royal Ludo — Service Worker v3.1
 * Provides offline-first caching of all static assets.
 * Network-first strategy for Firebase requests; cache-first for local assets.
 */

const CACHE_NAME = "royal-ludo-v4-1";

// All local assets to pre-cache on install
const PRECACHE_ASSETS = [
  "./index.html",
  "./styles.css",
  "./app.js",
  "./firebase-config.js",
  "./firebase-setup-ui.js",
  "./privacy.html",
  "./terms.html",
  "./icon-192.png",
  "./icon-512.png",
  "./manifest.json"
];

// ── Install: pre-cache all assets ────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Pre-caching assets");
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: delete old caches ───────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[SW] Deleting old cache:", key);
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first for local assets, network-first for everything else ───
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Bypass service worker for Firebase / external requests (always go online)
  const isFirebase = url.hostname.includes("firebase") ||
                     url.hostname.includes("gstatic") ||
                     url.hostname.includes("googleapis") ||
                     url.hostname.includes("firebaseio");

  if (isFirebase || event.request.method !== "GET") {
    // Pass through directly — don't cache Firebase Realtime Database responses
    return;
  }

  // Cache-first for local files
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Serve from cache; also try to refresh in background
        const networkFetch = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        }).catch(() => { /* offline — already serving cached version */ });

        return cachedResponse; // Instant response from cache
      }

      // Not in cache: fetch from network and cache the result
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === "opaque") {
          return networkResponse;
        }
        const clone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return networkResponse;
      }).catch(() => {
        // Offline and not cached — return offline fallback
        if (event.request.destination === "document") {
          return caches.match("./index.html");
        }
      });
    })
  );
});

// ── Background Sync placeholder (for future move queue) ──────────────────────
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-moves") {
    console.log("[SW] Background sync: sync-moves");
    // Future: flush queued offline moves to Firebase
  }
});

// ── Push Notifications placeholder ───────────────────────────────────────────
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Royal Ludo";
  const options = {
    body: data.body || "It's your turn!",
    icon: "./icon-192.png",
    badge: "./icon-192.png",
    vibrate: [200, 100, 200],
    data: { url: data.url || "./" }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(event.notification.data.url || "./");
    })
  );
});
