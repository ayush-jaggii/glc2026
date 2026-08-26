'use client'

import React from 'react'
import { EVENT_DETAILS } from '@/data/eventData'
import { ArrowRight, Calendar, MapPin, Globe2 } from 'lucide-react'
import GlobeCanvas from '@/components/GlobeCanvas'
import CountdownTimer from '@/components/CountdownTimer'
import { LiquidButton } from '@/components/ui/liquid-glass-button'

export default function HeroSection() {
  return (
    <section className="relative w-full pt-12 pb-24 md:pt-16 md:pb-32 overflow-hidden bg-transparent border-b border-slate-200">
      
      {/* Background Decorative Radial Gradient (Orange to Magenta Pink Ambient Glow) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-brand-orange/10 via-brand-pink/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Hero Grid: Main Editorial & 3D Interactive Globe */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Messaging */}
          <div className="lg:col-span-7 flex flex-col text-center md:text-left items-center md:items-start">
            
            <div className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-mono text-slate-700">
              <span className="w-2 h-2 rounded-full bg-brand-pink animate-pulse"></span>
              <span className="font-bold text-slate-900">{EVENT_DETAILS.fullTitle}</span>
              <span className="text-slate-300">•</span>
              <span className="text-brand-pink font-bold">TAPMI BENGALURU</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.08] mb-6 font-serif">
              BUSINESS <br />
              <span className="text-gradient-orange italic font-serif font-normal">BEYOND BORDERS</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mb-8 font-sans font-normal">
              Navigating global value chains, capital flows, and enterprise strategy across geopolitical fault lines. Hosted by TAPMI Bengaluru.
            </p>

            {/* Event Coordinates Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mb-10 text-left">
              <div className="p-4 rounded-xl bg-white/90 border border-slate-200 shadow-xs flex items-start gap-3">
                <Calendar className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">DATE</span>
                  <span className="text-sm font-bold text-slate-900 font-mono">{EVENT_DETAILS.date}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/90 border border-slate-200 shadow-xs flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-pink flex-shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">LOCATION</span>
                  <span className="text-sm font-bold text-slate-900 font-mono">{EVENT_DETAILS.venue.name}</span>
                </div>
              </div>
            </div>

            {/* Primary & Secondary Liquid Glass CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <a href="#register" className="w-full sm:w-auto">
                <LiquidButton size="xl" className="w-full sm:w-auto bg-brand-orange text-white font-mono font-bold text-xs uppercase tracking-wider">
                  <span>REGISTER DELEGATE PASS</span>
                  <ArrowRight className="w-4 h-4" />
                </LiquidButton>
              </a>

              <a href="#theme" className="w-full sm:w-auto">
                <LiquidButton variant="outline" size="xl" className="w-full sm:w-auto font-mono font-bold text-xs uppercase tracking-wider text-slate-800">
                  <Globe2 className="w-4 h-4 text-brand-pink" />
                  <span>EXPLORE THEME</span>
                </LiquidButton>
              </a>
            </div>

          </div>

          {/* Right Column: 3D Interactive Cobe Globe Canvas */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <GlobeCanvas />

            <div className="mt-6 w-full max-w-md">
              <div className="text-center mb-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-pink"></span>
                <span>SPEAKER & PANEL REVEAL COUNTDOWN</span>
              </div>
              <CountdownTimer targetDate={EVENT_DETAILS.revealTargetIso} />
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
