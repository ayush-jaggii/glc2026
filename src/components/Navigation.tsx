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

  const navLinks = [
    { label: 'Speakers', href: '#speakers' },
    { label: 'Panels', href: '#panels' },
    { label: 'Previous Editions', href: '#previous-editions' },
    { label: 'Delegate Benefits', href: '#delegate-benefits' },
    { label: 'Venue', href: '#venue' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-wine-950/95 backdrop-blur-md border-b border-wine-800/80 shadow-2xl py-3'
          : 'bg-gradient-to-b from-wine-950/90 via-wine-950/40 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          
          {/* Left: TAPMI Logo + LEADXAI in Tektype */}
          <div className="flex items-center gap-3 sm:gap-4">
            <a href="#" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-glc-magenta rounded-xs" aria-label="GLC 2026 Home">
              <TapmiLogo className="h-8 sm:h-9 w-auto" variant="light" />
              <div className="h-5 w-px bg-wine-700/80" />
              <LeadxaiLogo className="h-5 sm:h-6 w-auto" />
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-xs tracking-wider uppercase font-medium text-cream-200" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="transition-colors duration-200 hover:text-glc-orange focus:outline-none focus:text-glc-magenta"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: Institutional Accreditation Logos & Register Button */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden md:flex items-center">
              <AccredationsLogo className="h-5 sm:h-6 w-auto" variant="light" />
            </div>

            <a
              href="#register"
              className="relative inline-flex items-center justify-center px-4 sm:px-5 py-2 text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-white rounded-full overflow-hidden transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-glc-magenta group shadow-md hover:shadow-[0_0_20px_-3px_rgba(244,81,151,0.5)]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-glc-magenta via-glc-pink to-glc-orange opacity-95 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-1.5">
                <span>Register</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
        <div className="lg:hidden bg-wine-950/98 backdrop-blur-xl border-b border-wine-800 px-6 py-6 transition-all duration-300">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-wine-800/80">
              <div className="flex items-center gap-2.5">
                <TapmiLogo className="h-7 w-auto" variant="light" />
                <div className="h-4 w-px bg-wine-700/80" />
                <LeadxaiLogo className="h-4 sm:h-5 w-auto" />
              </div>
              <AccredationsLogo className="h-5 w-auto" variant="light" />
            </div>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-cream-100 hover:text-glc-magenta py-1 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#register"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 text-center py-2.5 px-4 rounded-full text-xs font-semibold tracking-wider uppercase text-white bg-gradient-to-r from-glc-magenta via-glc-pink to-glc-orange shadow-md"
            >
              Register For Pass →
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
