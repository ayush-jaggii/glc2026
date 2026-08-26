'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { LiquidButton } from '@/components/ui/liquid-glass-button'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
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
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs py-3.5'
          : 'bg-white py-4 border-b border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        
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

        {/* Mobile menu toggle when desktop links are hidden */}
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
