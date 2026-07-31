const CACHE_NAME = 'hoyocodes-cache-v1';
const ASSETS_TO_CACHE = [
  '/Hoyocodes/',
  '/Hoyocodes/index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event: Cache the core UI assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Fetch event: Serve from cache, but always fetch fresh codes from the API
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // Do not cache the ennead.cc API calls
  if (requestUrl.hostname === 'api.ennead.cc') {
    return; // Let the browser handle it normally over the network
  }

  // For everything else, try the cache first, then fall back to network
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
