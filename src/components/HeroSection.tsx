'use client'

import React from 'react'
import FlowingRibbonCanvas from './FlowingRibbonCanvas'
import RibbonFlowCanvas from './RibbonFlowCanvas'
import { EVENT_DETAILS } from '@/data/eventData'
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react'
import { AccredationsLogo } from './Logos'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-20 sm:pt-24 pb-6 sm:pb-8 overflow-hidden bg-wine-950">
      
      {/* 1. Base Dark Wine Radial Atmospheric Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,#3D0D30_0%,#0B0207_70%)] opacity-85 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_60%,#2D0920_0%,#0B0207_75%)] opacity-85 pointer-events-none" />

      {/* 2. Official High-Performance Living Fluid Ribbon Canvas */}
      <FlowingRibbonCanvas />

      {/* 3. Interactive HTML5 Flow Particles */}
      <RibbonFlowCanvas />

      {/* 3. Vignette Overlays for deep contrast and high typography legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-wine-950 via-transparent to-wine-950/70 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-wine-950/85 via-transparent to-wine-950/85 pointer-events-none" />

      {/* 4. Main Hero Editorial Content */}
      <div className="relative z-20 max-w-7xl xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full my-auto py-4 sm:py-6">
        <div className="max-w-4xl flex flex-col lg:-translate-x-6 xl:-translate-x-10">
          
          {/* Editorial Metadata Monogram */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5">
            <span className="inline-flex items-center px-3 py-1 rounded-sm text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase bg-wine-900 text-glc-magenta border border-wine-700">
              A Global Leadership Colloquium
            </span>
            <span className="text-[11px] sm:text-xs tracking-wider uppercase text-cream-300 font-medium">
              4th Edition · 2026
            </span>
          </div>

          {/* Main Theme constructed in Tektype font */}
          <h1 className="font-tektype text-4xl sm:text-6xl md:text-7xl lg:text-[5.2rem] xl:text-[6rem] font-bold text-[#ffc5b6] leading-[0.92] tracking-tight mb-5 drop-shadow-2xl">
            <span className="block">BUSINESS</span>
            <span className="block">BEYOND</span>
            <span className="block">BORDERS</span>
          </h1>

          {/* Official Tagline & Event Details */}
          <p className="text-sm sm:text-base md:text-lg font-medium tracking-wide text-cream-200/90 max-w-2xl mb-6 leading-relaxed">
            Different Perspectives. A Brighter Tomorrow.
            <span className="block text-xs sm:text-sm font-normal text-cream-400 mt-1">
              Hosted by T. A. Pai Management Institute (TAPMI), Bengaluru · MAHE Manipal (Institution of Eminence)
            </span>
          </p>

          {/* Clean Telemetry Bar: Date, Time & Venue */}
          <div className="flex flex-wrap items-center gap-y-2.5 gap-x-6 text-xs text-cream-300 mb-8 py-3 px-4 rounded-xl bg-wine-900/40 border border-wine-800/80 w-fit">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-glc-magenta shrink-0" />
              <span className="font-semibold text-cream-100">{EVENT_DETAILS.date} · {EVENT_DETAILS.day}</span>
            </div>
            <div className="hidden sm:block h-3.5 w-px bg-wine-700/80" />
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-glc-orange shrink-0" />
              <span>{EVENT_DETAILS.time}</span>
            </div>
            <div className="hidden sm:block h-3.5 w-px bg-wine-700/80" />
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-glc-pink shrink-0" />
              <span>{EVENT_DETAILS.venue.name}, {EVENT_DETAILS.venue.campus}</span>
            </div>
          </div>

          {/* CTA Group */}
          <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
            <a
              href="#register"
              className="inline-flex items-center justify-center px-7 sm:px-9 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold tracking-widest uppercase text-white rounded-full bg-gradient-to-r from-glc-magenta via-glc-pink to-glc-orange hover:shadow-[0_0_28px_-5px_rgba(244,81,151,0.65)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
            >
              <span>Register For Delegate Pass</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href="#panels"
              className="inline-flex items-center justify-center px-6 sm:px-7 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#ffc5b6] hover:text-white rounded-full border border-wine-700 hover:border-glc-magenta/60 bg-wine-900/60 transition-all duration-200"
            >
              <span>Explore Symposia Tracks</span>
            </a>
          </div>

          {/* Institutional Standing Accreditations */}
          <div className="mt-8 pt-5 border-t border-wine-800/60 flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="text-[10px] uppercase tracking-wider text-cream-400 font-mono">
              Institutional Accreditation:
            </span>
            <AccredationsLogo className="h-5 sm:h-6 w-auto" variant="light" />
          </div>

        </div>
      </div>

    </section>
  )
}
