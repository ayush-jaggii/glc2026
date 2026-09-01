'use client'

import React from 'react'
import { EVENT_DETAILS } from '@/data/eventData'
import { ArrowRight, Globe2 } from 'lucide-react'
import GlobeCanvas from '@/components/GlobeCanvas'
import CountdownTimer from '@/components/CountdownTimer'
import ConstellationGrid from '@/components/ui/constellation-grid'
import { LiquidButton } from '@/components/ui/liquid-glass-button'

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white border-b border-slate-200">
      
      {/* Interactive Constellation Grid Canvas Background */}
      <ConstellationGrid className="py-12 md:py-16">
        
        {/* Subtle Background Radial Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-brand-orange/10 via-brand-pink/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          
          {/* Hero Grid: Asymmetric Editorial Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center py-4">
            
            {/* Left Column: Headline & Narrative */}
            <div className="lg:col-span-7 flex flex-col items-start">
              
              <span className="text-xs font-mono text-brand-pink uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-brand-pink"></span>
                TAPMI BENGALURU FLAGSHIP SUMMIT
              </span>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.06] mb-6 font-serif">
                BUSINESS <br />
                <span className="text-gradient-orange italic font-serif font-normal">BEYOND BORDERS</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mb-8 font-sans font-normal">
                Navigating global value chains, cross-border capital flows, and GCC expansion strategies across geopolitical fault lines. Hosted by T. A. Pai Management Institute, Bengaluru.
              </p>

              {/* Editorial Metadata Bar */}
              <div className="flex flex-wrap items-center gap-8 py-4 px-6 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 mb-10 w-full max-w-xl font-mono text-xs shadow-xs">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">SUMMIT DATE</span>
                  <span className="text-sm font-bold text-slate-900">{EVENT_DETAILS.date}</span>
                </div>
                <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">PRIMARY VENUE</span>
                  <span className="text-sm font-bold text-slate-900">{EVENT_DETAILS.venue.name}</span>
                </div>
              </div>

              {/* Primary & Secondary CTAs (Liquid Glass Buttons) */}
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
      </ConstellationGrid>
    </section>
  )
}
