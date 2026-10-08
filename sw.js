const CACHE = "rede-viva-v6";
const ASSETS = ["./", "index.html", "app.html", "styles.css", "auth-config.js", "manifest.webmanifest", "icon.svg", "icons/icon-192.svg", "icons/icon-512.svg", "assets/app-loader.js", "assets/doc-0.txt", "assets/doc-1.txt", "assets/rv-app-0.txt", "assets/rv-app-1.txt", "assets/rv-app-2.txt", "assets/rv-app-3.txt", "assets/rv-app-4.txt"];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;
  event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request).then(response => {
    if (response.ok) { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); }
    return response;
  }).catch(() => event.request.mode === "navigate" ? caches.match("index.html") : Response.error())));
});
