// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";
import TestimonialToasts from "@/components/TestimonialToast";
import InstallPrompt from "@/components/InstallPrompt";
// import PWADebug from "@/components/PWADebug";
import ServiceWorker from "@/components/ServiceWorker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// In app/layout.tsx, add metadata
export const metadata: Metadata = {
  title: "Trust - Build Reputation. Unlock Loans.",
  description: "WhatsApp traders: Build trust, get rated, unlock loans from verified lenders",
  manifest: '/manifest.json',
  themeColor: '#10B981',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Trust',
  },
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <InstallPrompt />
          <TestimonialToasts />
          {/* <PWADebug /> */}
          <ServiceWorker />
        </AuthProvider>
      </body>
    </html>
  );
}