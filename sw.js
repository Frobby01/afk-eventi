// AFK Eventi: prende sempre la versione più recente dalla rete, e funziona anche offline.
const CACHE = "afk-eventi-v3";
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./", "manifest.webmanifest", "icon-192.png", "icon-512.png"]))); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  const key = url.origin + url.pathname; // ignora ?t=… così events.json non si moltiplica in cache
  e.respondWith(fetch(e.request).then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(key, copy)); } return r; })
    .catch(() => caches.match(key).then(r => r || caches.match("./"))));
});
