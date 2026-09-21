'use client'

import React, { useState, useEffect } from 'react'
import { TapmiLogo, AccredationsLogo, LeadxaiLogo } from './Logos'
import { ArrowUpRight, Menu, X } from 'lucide-react'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile drawer is open to prevent background scrolling
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const navLinks = [
    { label: 'Speakers', href: '#speakers' },
    { label: 'Panels', href: '#panels' },
    { label: 'Awards', href: '#awards' },
    { label: 'Venue', href: '#venue' },
  ]

  const nominationFormUrl = 'https://forms.gle/4khjou6rWyKZMpGm7'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-wine-950/95 backdrop-blur-md border-b border-wine-800/80 shadow-2xl py-2 sm:py-3'
          : 'bg-gradient-to-b from-wine-950/95 via-wine-950/50 to-transparent py-2.5 sm:py-4'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
          
          {/* Left: TAPMI Logo + LEADXAI in Tektype */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <a href="#" className="flex items-center gap-2 sm:gap-3 group focus:outline-none focus:ring-2 focus:ring-glc-magenta rounded-xs" aria-label="GLC 2026 Home">
              <TapmiLogo className="h-7 sm:h-9 w-auto" variant="light" />
              <div className="h-4 sm:h-5 w-px bg-wine-700/80" />
              <LeadxaiLogo className="h-4.5 sm:h-6 w-auto" />
            </a>
          </div>

          {/* Desktop Navigation Links - Breathable, elegant, perfectly kerned */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9 text-[11px] tracking-[0.14em] uppercase font-medium text-cream-300" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="whitespace-nowrap transition-colors duration-200 hover:text-white focus:outline-none focus:text-glc-magenta"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: Prominent Accreditations & Streamlined Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3.5 xl:gap-5 flex-shrink-0">
            <div className="hidden lg:flex items-center">
              <AccredationsLogo className="h-6 sm:h-6.5 xl:h-7 w-auto opacity-90 hover:opacity-100 transition-opacity" variant="light" />
            </div>

            <div className="hidden lg:block h-5 w-px bg-wine-700/60" />

            <a
              href={nominationFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-semibold tracking-wider uppercase text-cream-200 hover:text-white rounded-full border border-wine-700/80 hover:border-glc-orange bg-wine-900/50 hover:bg-wine-850/80 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-glc-orange group"
            >
              <span>Nominate</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-glc-orange transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <a
              href="#register"
              className="relative inline-flex items-center justify-center px-3 sm:px-4 py-1.5 text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-white rounded-full overflow-hidden transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-glc-magenta group shadow-md hover:shadow-[0_0_18px_-3px_rgba(244,81,151,0.5)]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-glc-magenta via-glc-pink to-glc-orange opacity-95 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-1">
                <span>Register</span>
                <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="lg:hidden p-1.5 sm:p-2 text-cream-200 hover:text-white hover:bg-wine-800/60 rounded-md focus:outline-none focus:ring-2 focus:ring-glc-magenta"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-wine-950/98 backdrop-blur-xl border-b border-wine-800 px-5 sm:px-6 py-5 sm:py-6 transition-all duration-300">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-wine-800/80">
              <div className="flex items-center gap-2">
                <TapmiLogo className="h-6 sm:h-7 w-auto" variant="light" />
                <div className="h-3.5 w-px bg-wine-700/80" />
                <LeadxaiLogo className="h-4 sm:h-5 w-auto" />
              </div>
              <AccredationsLogo className="h-4.5 sm:h-5 w-auto" variant="light" />
            </div>
            {[
              ...navLinks,
              { label: 'Past Editions', href: '#previous-editions' },
              { label: 'Delegate Benefits', href: '#delegate-benefits' }
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-cream-100 hover:text-glc-magenta py-1.5 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2.5 mt-2">
              <a
                href={nominationFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-full text-xs font-semibold tracking-wider uppercase text-cream-100 border border-wine-700/80 bg-wine-900/60 hover:bg-wine-850/80 transition-all"
              >
                <span>Submit Nomination</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-glc-orange" />
              </a>

              <a
                href="#register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-3 px-4 rounded-full text-xs font-semibold tracking-wider uppercase text-white bg-gradient-to-r from-glc-magenta via-glc-pink to-glc-orange shadow-md"
              >
                Register For Pass →
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
