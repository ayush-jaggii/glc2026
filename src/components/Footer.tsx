'use client'

import React from 'react'
import Image from 'next/image'
import { EVENT_DETAILS } from '@/data/eventData'
import { TapmiLogo, MaheLogo, AccredationsLogo } from './Logos'
import { MapPin, Mail, Phone, ArrowUp, Instagram, Facebook, Linkedin, Youtube } from 'lucide-react'

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    icon: Instagram,
    href: 'https://www.instagram.com/tapmibengaluru/',
    hoverColor: 'hover:text-[#E4405F] hover:border-[#E4405F]/60 hover:shadow-[0_0_12px_rgba(228,64,95,0.4)]',
  },
  {
    name: 'Facebook',
    icon: Facebook,
    href: 'https://www.facebook.com/tapmibengaluru/',
    hoverColor: 'hover:text-[#1877F2] hover:border-[#1877F2]/60 hover:shadow-[0_0_12px_rgba(24,119,242,0.4)]',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    href: 'https://www.linkedin.com/school/tapmibengaluru/',
    hoverColor: 'hover:text-[#0A66C2] hover:border-[#0A66C2]/60 hover:shadow-[0_0_12px_rgba(10,102,194,0.4)]',
  },
  {
    name: 'YouTube',
    icon: Youtube,
    href: 'https://www.youtube.com/@TAPMIBengaluru',
    hoverColor: 'hover:text-[#FF0000] hover:border-[#FF0000]/60 hover:shadow-[0_0_12px_rgba(255,0,0,0.4)]',
  },
]

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12">
          
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
              Global Leadership Conference 4.0 organized by the TAPMI PACE Committee, T. A. Pai Management Institute Bengaluru, a constituent unit of Manipal Academy of Higher Education (MAHE Bengaluru).
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
                <a href="#awards" className="hover:text-glc-orange transition-colors">Business Excellence Awards</a>
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
              {EVENT_DETAILS.contacts.leads.map((lead) => (
                <div key={lead.name} className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-glc-orange shrink-0" />
                  <a href={`tel:${lead.phone.replace(/\s+/g, '')}`} className="text-cream-400 hover:text-white transition-colors">
                    {lead.name}: {lead.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Contact & Social Bar (Inspired by Last Year's Footer) */}
        <div className="py-6 border-y border-wine-900/80 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Quick Contact Links */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 sm:gap-7 text-xs text-cream-300">
            {EVENT_DETAILS.contacts.leads.map((lead) => (
              <a
                key={`bar-${lead.name}`}
                href={`tel:${lead.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-2 hover:text-white transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-wine-900/60 border border-wine-800 flex items-center justify-center text-glc-orange group-hover:border-glc-orange transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span className="text-cream-300 group-hover:text-white font-medium">{lead.name}: {lead.phone}</span>
              </a>
            ))}

            <a
              href={`mailto:${EVENT_DETAILS.contacts.email}`}
              className="flex items-center gap-2 hover:text-white transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-wine-900/60 border border-wine-800 flex items-center justify-center text-glc-pink group-hover:border-glc-pink transition-colors">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <span className="text-cream-300 group-hover:text-white font-medium">{EVENT_DETAILS.contacts.email}</span>
            </a>
          </div>

          {/* Social Media Channels with Styled Square Borders */}
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-cream-400 font-semibold mr-1 hidden sm:inline-block">
              Follow Us
            </span>
            {SOCIAL_LINKS.map((s) => {
              const Icon = s.icon
              return (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`TAPMI Bengaluru on ${s.name}`}
                  className={`w-9 h-9 rounded-lg bg-wine-900/70 border border-wine-800 flex items-center justify-center text-cream-300 transition-all duration-300 hover:scale-105 ${s.hoverColor}`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              )
            })}
          </div>
        </div>

        {/* Bottom Baseline Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-[11px] text-cream-400">
          <div>
            © {new Date().getFullYear()} TAPMI Bengaluru · MAHE Bengaluru. All rights reserved.
          </div>

          {/* Nexora IT Club Signature Credit */}
          <div className="flex items-center gap-2 text-cream-400">
            <span>Designed & Engineered by</span>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wine-900/80 border border-wine-700/80 shadow-md hover:border-glc-magenta/70 transition-all">
              <Image
                src="/logos/nexora-emblem-bright.png"
                alt="Nexora IT Club"
                width={20}
                height={20}
                className="w-4 h-auto object-contain"
              />
              <span className="text-xs font-bold text-cream-100 tracking-wide">
                NEXORA IT CLUB
              </span>
            </div>
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
