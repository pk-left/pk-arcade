// Service worker: keeps a copy of the site on the device so it opens with no data.
// Strategy: answer from the saved copy straight away, and refresh that copy in the background,
// so the next visit gets the newest version. Map tiles and other sites are never cached.
const CACHE = "pk-arcade-v2";
const PAGES = ["", "wordle/", "guess-the-place/", "ataya/", "bridge/", "dish-quiz/", "names/", "soundboard/", "sky/"];
const FILES = [
  ...PAGES.map(p => "/" + p),
  "/assets/style.css", "/assets/common.js", "/assets/theme.js", "/assets/icons.js",
  "/assets/fonts/press-start-2p.woff2", "/assets/fonts/vt323.woff2",
  "/assets/icons/icon.svg", "/assets/icons/icon-192.png",
  "/assets/leaflet/leaflet.js", "/assets/leaflet/leaflet.css",
  "/wordle/words.js", "/guess-the-place/places.js", "/names/names.js",
  "/sky/astronomy.min.js", "/sky/skydata.js", "/manifest.webmanifest",
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async cache => {
    const saved = await cache.match(e.request, { ignoreSearch: true });
    const fresh = fetch(e.request).then(res => {
      if (res.ok) cache.put(e.request, res.clone());
      return res;
    }).catch(() => saved || (e.request.mode === "navigate" ? cache.match("/") : Response.error()));
    return saved || fresh;
  }));
});
