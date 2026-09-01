import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'GLC 2026 — Business Beyond Borders | TAPMI Bengaluru',
  description: 'Global Leadership Conference 4.0 hosted by TAPMI Bengaluru (MAHE, Manipal). Navigating enterprise strategy, global capital, and trade networks across geopolitical fault lines.',
  keywords: ['GLC 2026', 'TAPMI Bengaluru', 'Global Leadership Conference', 'Business Beyond Borders', 'Geopolitics', 'MAHE Manipal', 'GCC Leadership'],
  openGraph: {
    title: 'GLC 2026 — Business Beyond Borders',
    description: 'The 4th annual Global Leadership Conference hosted by TAPMI Bengaluru.',
    type: 'website',
    locale: 'en_US',
    siteName: 'GLC 2026 — TAPMI Bengaluru',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..700;1,400..700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-white text-slate-900 min-h-screen flex flex-col antialiased selection:bg-brand-orange/20 selection:text-slate-900 font-sans">
        <Navigation />
        <main className="flex-1 w-full relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
