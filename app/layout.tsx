import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { WishlistProvider } from "@/lib/wishlistContext";
import { ToastProvider } from "@/lib/toastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GLEAMIA | Premium Handcrafted Jewelry Store",
  description: "Discover handcrafted jewelry that tells your story. Shop timeless necklaces, rings, earrings and accessories online. Premium quality, fair prices.",
  keywords: "jewelry, handcrafted jewelry, necklaces, rings, earrings, accessories, luxury jewelry, online jewelry store",
  creator: "GLEAMIA Team",
  icons: {
    icon: "✨",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gleamia.com",
    title: "GLEAMIA | Premium Handcrafted Jewelry Store",
    description: "Discover handcrafted jewelry that tells your story. Shop necklaces, rings, earrings and accessories.",
    siteName: "GLEAMIA",
    images: [
      {
        url: "https://gleamia.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GLEAMIA Jewelry Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GLEAMIA | Premium Handcrafted Jewelry",
    description: "Discover handcrafted jewelry. Shop necklaces, rings, earrings and accessories.",
    images: ["https://gleamia.com/twitter-image.jpg"],
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://gleamia.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#e6e6fa" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen flex flex-col`}
      >
        <ToastProvider>
          <WishlistProvider>
            {/* Top navigation */}
            <NavBar />

            {/* Main page content */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
              {children}
            </main>

            {/* Footer */}
            <Footer />
          </WishlistProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
