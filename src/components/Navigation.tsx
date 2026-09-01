'use client'

import React, { useState, useEffect } from 'react'
import { TapmiLogo, MaheLogo, AccredationsLogo, PaceLogo } from './Logos'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { LiquidButton } from '@/components/ui/liquid-glass-button'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Theme', href: '#theme' },
    { label: 'Reveals', href: '#reveals' },
    { label: 'Archive', href: '#archive' },
    { label: 'Advantage', href: '#advantage' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-xs transition-all duration-300">
      
      {/* Upper Institutional Brand Bar (collapses smoothly when scrolled for maximum content focus) */}
      <div className={`w-full border-b border-slate-100 transition-all duration-300 overflow-hidden ${
        isScrolled ? 'max-h-0 py-0 opacity-0' : 'max-h-24 py-3 opacity-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
          
          {/* Left: Official TAPMI & MAHE Vector Logos */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <TapmiLogo className="h-9 md:h-10 w-auto" />
            <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />
            <MaheLogo className="h-9 md:h-10 w-auto" />
          </div>

          {/* Right: Accreditations & TAPMI PACE Committee Emblem */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <AccredationsLogo className="h-6 md:h-7 w-auto hidden sm:block" />
            <div className="h-7 w-[1px] bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-2">
              <PaceLogo className="h-8 md:h-9 w-auto" />
              <span className="hidden xl:inline text-[10px] font-mono text-slate-700 font-bold uppercase tracking-wider">
                PACE COMMITTEE
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
        
        {/* Left Desktop Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider uppercase text-slate-700 font-semibold">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-brand-orange transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-brand-orange hover:after:w-full after:transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-brand-orange"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Right Liquid Glass CTA */}
        <div className="flex items-center gap-4">
          <a href="#register">
            <LiquidButton size="lg" className="bg-brand-orange text-white font-mono font-bold text-xs uppercase tracking-wider">
              <span>REGISTER NOW</span>
              <ArrowUpRight className="w-4 h-4" />
            </LiquidButton>
          </a>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/98 backdrop-blur-xl border-b border-slate-200 p-6 flex flex-col gap-5 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <TapmiLogo className="h-8 w-auto" />
            <MaheLogo className="h-8 w-auto" />
          </div>
          <nav className="flex flex-col gap-4 text-sm font-mono tracking-wider uppercase text-slate-700 font-semibold">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-brand-orange py-2 border-b border-slate-100"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a href="#register" onClick={() => setMobileMenuOpen(false)} className="w-full">
            <LiquidButton size="xl" className="w-full bg-brand-orange text-white font-mono font-bold text-xs uppercase tracking-wider">
              <span>REGISTER NOW</span>
              <ArrowUpRight className="w-4 h-4" />
            </LiquidButton>
          </a>
        </div>
      )}

    </header>
  )
}
