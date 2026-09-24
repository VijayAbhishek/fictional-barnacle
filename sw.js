/* Tiger Fitness — service worker: precache app shell + data, offline-first. */
'use strict';

var VERSION = 'tf-v2.1.0'; // v2.1.0: Tiger Fitness logo icons
var PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/css/app.css',
  './assets/js/storage.js',
  './assets/js/model.js',
  './assets/js/ui.js',
  './assets/js/reference.js',
  './assets/js/trackers.js',
  './assets/js/recipes-view.js',
  './assets/js/progress.js',
  './assets/js/app.js',
  './data/program.js',
  './data/nutrition.js',
  './data/recipes.js',
  './assets/icons/favicon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-192.png',
  './assets/icons/icon-maskable-512.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(VERSION).then(function (cache) {
      // cache:'reload' bypasses the HTTP cache so a new version never precaches stale files
      return cache.addAll(PRECACHE.map(function (u) {
        return new Request(u, { cache: 'reload' });
      }));
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key !== VERSION) return caches.delete(key);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('message', function (event) {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

// Cache-first for same-origin GET (app is fully local); network fallback updates the cache.
self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return; // never intercept YouTube/etc.

  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(VERSION).then(function (cache) { cache.put(req, copy); });
        }
        return res;
      }).catch(function () {
        if (req.mode === 'navigate') return caches.match('./index.html');
        return new Response('', { status: 504, statusText: 'offline' });
      });
    })
  );
});
