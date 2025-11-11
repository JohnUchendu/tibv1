// components/ServiceWorker.tsx
'use client';

import { useEffect } from 'react';

export default function ServiceWorker() {
  useEffect(() => {
    // Check if we're in the browser and service workers are supported
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const registerServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered successfully:', registration);
        } catch (error) {
          console.log('Service Worker registration failed:', error);
        }
      };

      registerServiceWorker();
    }
  }, []);

  return null;
}