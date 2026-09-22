import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const tektype = localFont({
  src: "../../public/fonts/Tektype-Regular.ttf",
  variable: "--font-tektype",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://glc.tapmi.edu.in"),
  title: "GLC 2026 | BUSINESS BEYOND BORDERS — Global Leadership Colloquium",
  description: "Global Leadership Conference 4.0 hosted by TAPMI Bengaluru (MAHE Bengaluru). Navigating enterprise strategy, cross-border supply chains, geopolitics, and capital convergence across international borders.",
  keywords: [
    "GLC 2026",
    "Global Leadership Conference",
    "Business Beyond Borders",
    "TAPMI Bengaluru",
    "MAHE Bengaluru",
    "Leadership Colloquium",
    "Enterprise Tech",
    "BFSI",
    "Global Trade"
  ],
  authors: [{ name: "TAPMI - PACE Committee & MAHE Bengaluru" }],
  openGraph: {
    title: "GLC 2026 — BUSINESS BEYOND BORDERS",
    description: "TAPMI Bengaluru Flagship Global Leadership Colloquium · 10 October 2026",
    url: "https://glc.tapmi.edu.in",
    siteName: "GLC 2026",
    images: [
      {
        url: "/images/ribbons/hero-ribbon-confluence.jpg",
        width: 2087,
        height: 753,
        alt: "GLC 2026 Business Beyond Borders Visual Identity",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GLC 2026 — BUSINESS BEYOND BORDERS",
    description: "TAPMI Bengaluru Flagship Global Leadership Colloquium · 10 October 2026",
    images: ["/images/ribbons/hero-ribbon-confluence.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "256x256" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${tektype.variable} overflow-x-clip w-full`}>
      <body className="bg-wine-950 text-cream-50 font-sans antialiased min-h-screen selection:bg-glc-magenta selection:text-white overflow-x-clip w-full">
        {children}
      </body>
    </html>
  );
}
