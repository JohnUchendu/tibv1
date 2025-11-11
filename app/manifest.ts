// app/manifest.ts
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Trust - Build Reputation, Unlock Loans',
    short_name: 'Trust',
    description: 'WhatsApp traders: Build trust, get rated, unlock loans from verified lenders',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#10B981',
    orientation: 'portrait',
    categories: ['business', 'finance', 'social'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable', // Changed from 'any maskable' to 'maskable'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable', // Changed from 'any maskable' to 'maskable'
      },
    ],
  }
}