'use client'

import React from 'react'
import { EVENT_DETAILS } from '@/data/eventData'
import { TapmiLogo, BottomTapmiLogo, AccredationsLogo } from './Logos'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full bg-slate-100 border-t border-slate-200 text-slate-600 text-xs py-16 px-4 md:px-8 relative z-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-slate-200">
        
        {/* Left Brand Summary & SVG Logos */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <TapmiLogo className="h-12 w-auto self-start" />
            <AccredationsLogo className="h-8 w-auto self-start" />
          </div>

          <p className="text-xs text-slate-600 max-w-sm leading-relaxed font-sans">
            The 4th annual Global Leadership Conference hosted by T. A. Pai Management Institute (TAPMI), Bengaluru — A constituent unit of Manipal Academy of Higher Education (MAHE, Manipal).
          </p>

          <div className="flex flex-col gap-2 pt-1 text-[11px] font-mono text-slate-700">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-brand-orange" />
              <a href={`mailto:${EVENT_DETAILS.contacts.email}`} className="hover:text-brand-orange transition-colors font-bold">
                {EVENT_DETAILS.contacts.email}
              </a>
            </div>
            {EVENT_DETAILS.contacts.leads.map((lead, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-600">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{lead.name} ({lead.role}): <span className="font-semibold">{lead.phone}</span></span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Navigation Links */}
        <div className="md:col-span-3 flex flex-col gap-3 font-mono text-[11px] uppercase tracking-wider">
          <span className="text-slate-900 font-bold mb-1">NAVIGATION</span>
          <a href="#theme" className="hover:text-brand-orange transition-colors">THEME OVERVIEW</a>
          <a href="#reveals" className="hover:text-brand-orange transition-colors">SPEAKERS & PANELS</a>
          <a href="#archive" className="hover:text-brand-orange transition-colors">PAST EDITIONS</a>
          <a href="#advantage" className="hover:text-brand-orange transition-colors">DELEGATE ADVANTAGE</a>
          <a href="#register" className="hover:text-brand-orange transition-colors">REGISTRATION</a>
        </div>

        {/* Venue & Location Details */}
        <div className="md:col-span-4 flex flex-col gap-4 font-mono text-[11px]">
          <span className="text-slate-900 font-bold uppercase tracking-wider">CONFERENCE VENUE</span>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-slate-900 font-bold">{EVENT_DETAILS.venue.name}</span>
              <span className="text-slate-700">{EVENT_DETAILS.venue.institution}</span>
              <span className="text-slate-600">{EVENT_DETAILS.venue.address}</span>
              <span className="text-brand-orange font-bold pt-1">{EVENT_DETAILS.venue.coordinates}</span>
            </div>
          </div>

          <div className="pt-4">
            <BottomTapmiLogo className="h-10 w-auto" />
          </div>
        </div>

      </div>

      {/* Bottom Copyright & Credit */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-slate-500 font-medium">
        <div>
          © {new Date().getFullYear()} TAPMI Bengaluru, MAHE Manipal. All rights reserved.
        </div>
        
        <div className="flex items-center gap-4">
          <span>PRIVACY POLICY</span>
          <span>•</span>
          <span>TERMS OF DELEGATE ACCESS</span>
        </div>
      </div>
    </footer>
  )
}
