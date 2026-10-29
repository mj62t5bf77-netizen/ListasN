// Permite abrir la aplicación sin conexión una vez cargada. No guarda tus tareas (eso lo hace el navegador en tu iPhone).
const V = "mis-listas-v1";
self.addEventListener("install", e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(["./", "./index.html"])).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(r => { const cp = r.clone(); caches.open(V).then(c => c.put(e.request, cp)); return r; })
      .catch(() => caches.match(e.request).then(m => m || caches.match("./index.html")))
  );
});
