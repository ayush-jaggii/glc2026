'use client'

import React from 'react'
import { EVENT_DETAILS } from '@/data/eventData'
import { TapmiLogo, MaheLogo, AccredationsLogo } from './Logos'
import { MapPin, Mail, Phone, ArrowUp } from 'lucide-react'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-wine-950 text-cream-200 border-t border-wine-800/80 pt-16 pb-12 overflow-hidden">
      
      {/* Dissolving bottom flow gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-glc-magenta/50 to-transparent pointer-events-none" />
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-wine-900/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-wine-900">
          
          {/* Col 1: Institutional Leadership & Brand */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-4 mb-2">
              <TapmiLogo className="h-10 w-auto" variant="light" />
              <div className="h-6 w-px bg-wine-800" />
              <MaheLogo className="h-10 w-auto" variant="light" />
            </div>

            <div>
              <div className="text-xs uppercase tracking-widest text-glc-magenta font-semibold mb-1">
                GLC 2026
              </div>
              <div className="font-tektype text-2xl text-[#ffc5b6] font-bold tracking-tight">
                BUSINESS BEYOND BORDERS
              </div>
            </div>

            <p className="text-xs text-cream-400 max-w-sm leading-relaxed">
              Global Leadership Conference 4.0 organized by the TAPMI PACE Committee, T. A. Pai Management Institute Bengaluru, a constituent unit of Manipal Academy of Higher Education (Institution of Eminence).
            </p>

            <div className="pt-2">
              <AccredationsLogo className="h-6 w-auto" variant="light" />
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs uppercase tracking-widest text-glc-magenta font-semibold mb-3">
              Navigation
            </div>
            <ul className="space-y-2 text-xs text-cream-300">
              <li>
                <a href="#speakers" className="hover:text-glc-orange transition-colors">Speakers</a>
              </li>
              <li>
                <a href="#panels" className="hover:text-glc-orange transition-colors">Panels</a>
              </li>
              <li>
                <a href="#previous-editions" className="hover:text-glc-orange transition-colors">Previous Editions</a>
              </li>
              <li>
                <a href="#delegate-benefits" className="hover:text-glc-orange transition-colors">Delegate Benefits</a>
              </li>
              <li>
                <a href="#venue" className="hover:text-glc-orange transition-colors">Venue</a>
              </li>
              <li>
                <a href="#register" className="hover:text-glc-orange transition-colors">Register</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Secretariat & Contact */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs uppercase tracking-widest text-glc-orange font-semibold mb-3">
              Contact
            </div>
            <div className="space-y-2.5 text-xs text-cream-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-glc-magenta shrink-0 mt-0.5" />
                <span className="text-cream-400">
                  {EVENT_DETAILS.venue.institution}, Thanisandra Main Rd, Chokkanahalli, Bengaluru, Karnataka 560064
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-glc-pink shrink-0" />
                <a href={`mailto:${EVENT_DETAILS.contacts.email}`} className="text-cream-200 hover:text-white transition-colors">
                  {EVENT_DETAILS.contacts.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-glc-orange shrink-0" />
                <span className="text-cream-400">
                  {EVENT_DETAILS.contacts.leads[0].name}: {EVENT_DETAILS.contacts.leads[0].phone}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Baseline Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-cream-400">
          <div>
            © {new Date().getFullYear()} TAPMI Bengaluru · MAHE Manipal. All rights reserved.
          </div>

          {/* IT Team Credit */}
          <div className="flex items-center gap-2 text-cream-400">
            <span>Designed & Engineered by</span>
            <span className="text-cream-200 font-semibold flex items-center gap-1.5">
              <span>NEXORA IT CLUB</span>
            </span>
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            type="button"
            className="flex items-center gap-1.5 text-cream-300 hover:text-glc-magenta transition-colors p-1"
            aria-label="Scroll back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  )
}
