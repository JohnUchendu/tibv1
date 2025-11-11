// public/sw.js - Simple version
const CACHE_NAME = 'trust-v1';

self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  self.skipWaiting(); // Activate immediately
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Optional: Add caching strategies here
  event.respondWith(fetch(event.request));
});