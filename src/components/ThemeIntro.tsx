'use client'

import React from 'react'
import { THEME_PILLARS } from '@/data/eventData'
import { Globe, ArrowUpRight } from 'lucide-react'
import { MaheLogo } from './Logos'
import { LiquidButton } from '@/components/ui/liquid-glass-button'

export default function ThemeIntro() {
  return (
    <section id="theme" className="py-24 relative bg-slate-50/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-slate-200">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono text-brand-pink uppercase tracking-widest font-bold flex items-center gap-2">
              <span className="w-2.5 h-[2px] bg-brand-pink"></span>
              THEMATIC FRAMEWORK
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 font-serif">
              BUSINESS BEYOND BORDERS
            </h2>
          </div>

          <p className="text-sm text-slate-600 max-w-md font-normal leading-relaxed font-sans">
            As global value chains recalibrate, GLC 2026 brings together international industry captains and academicians to examine cross-border trade, GCC expansion, and enterprise resilience.
          </p>
        </div>

        {/* 4 Core Geopolitical Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {THEME_PILLARS.map((pillar, idx) => (
            <div
              key={pillar.code}
              className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
                    idx % 2 === 0
                      ? 'text-brand-orange bg-brand-orange/10 border-brand-orange/20'
                      : 'text-brand-pink bg-brand-pink/10 border-brand-pink/20'
                  }`}>
                    {pillar.code}
                  </span>
                  <Globe className={`w-5 h-5 transition-colors ${
                    idx % 2 === 0 ? 'text-slate-400 group-hover:text-brand-orange' : 'text-slate-400 group-hover:text-brand-pink'
                  }`} />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-brand-orange transition-colors">
                  {pillar.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase font-semibold">
                <span>FOCUS AREA</span>
                <span className={`font-bold ${idx % 2 === 0 ? 'text-brand-orange' : 'text-brand-pink'}`}>GLC 4.0 TRACK</span>
              </div>
            </div>
          ))}
        </div>

        {/* Institutional Callout Box with Official MAHE Logo */}
        <div className="p-8 md:p-10 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 max-w-3xl">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex-shrink-0">
              <MaheLogo className="h-14 w-auto" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-mono text-brand-pink font-bold uppercase">HOSTED BY TAPMI BENGALURU</span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
                Manipal Academy of Higher Education (MAHE) • Bengaluru Campus
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans pt-1">
                Connect with 40+ C-suite speakers, 850+ executive delegates, and academic thought leaders shaping the future of global enterprise strategy.
              </p>
            </div>
          </div>

          <a href="#register" className="flex-shrink-0">
            <LiquidButton size="xl" className="bg-brand-orange text-white font-mono font-bold text-xs uppercase tracking-wider">
              <span>REGISTER AS DELEGATE</span>
              <ArrowUpRight className="w-4 h-4" />
            </LiquidButton>
          </a>
        </div>

      </div>
    </section>
  )
}
