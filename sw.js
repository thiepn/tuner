'use strict';

const CACHE_PREFIX = 'guitar-tuner-' + encodeURIComponent(self.registration.scope) + '-';
const CACHE_NAME = CACHE_PREFIX + '1.3.0-rc.2';
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/ArrowDown.svg",
  "./assets/ArrowUp.svg",
  "./assets/BarlowCondensed-Bold.woff",
  "./assets/Check.svg",
  "./assets/ChevronDown.svg",
  "./assets/IBMPlexMono-Regular.woff",
  "./assets/Mic.svg",
  "./assets/NimbusMonoPS-Regular.woff",
  "./assets/NimbusSans-Regular.woff",
  "./assets/NimbusSansNarrow-Bold.woff",
  "./assets/SlidersHorizontal.svg",
  "./assets/X.svg",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-64.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png"
];

const SCOPE_URL = new URL(self.registration.scope);
const INDEX_URL = new URL('./index.html', self.registration.scope);
const APP_NAV_PATHS = new Set([SCOPE_URL.pathname, INDEX_URL.pathname]);
const SHELL_URLS = new Set(APP_SHELL.map(path => new URL(path, self.registration.scope).href));

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

async function fetchWithTimeout(request, timeoutMs = 3000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(request, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isAppNavigation = request.mode === 'navigate' && APP_NAV_PATHS.has(url.pathname);
  const shellUrl = new URL(url.href);
  shellUrl.search = '';
  shellUrl.hash = '';
  const isShellAsset = SHELL_URLS.has(shellUrl.href);

  // Never interfere with unrelated pages/assets even if this worker is deployed at
  // a broad website scope.
  if (!isAppNavigation && !isShellAsset) return;

  if (isAppNavigation) {
    event.respondWith((async () => {
      try {
        const response = await fetchWithTimeout(request);
        if (response?.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(INDEX_URL.href, response.clone());
          return response;
        }
        throw new Error(`Navigation returned ${response?.status || 'no response'}`);
      } catch (_) {
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match(INDEX_URL.href)) || Response.error();
      }
    })());
    return;
  }

  // Versioned shell assets stay coherent until the next worker installs.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(shellUrl.href);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response?.ok) await cache.put(shellUrl.href, response.clone());
      return response;
    } catch (_) {
      return Response.error();
    }
  })());
});
