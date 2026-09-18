'use client'

import React from 'react'
import { DELEGATE_ADVANTAGES } from '@/data/eventData'
import { CheckCircle2, ArrowRight } from 'lucide-react'

export default function DelegateAdvantage() {
  return (
    <section id="delegate-benefits" className="relative py-24 sm:py-32 bg-wine-950 overflow-hidden border-t border-wine-900/60 scroll-mt-24">
      {/* Hidden anchor for backwards compatibility */}
      <span id="advantage" className="absolute -top-24 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm text-xs font-semibold tracking-widest uppercase bg-wine-900 text-glc-orange border border-wine-700 mb-4">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Delegate Value</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream-50 uppercase mb-4">
            Delegate Benefits
          </h2>
          <p className="text-sm sm:text-base text-cream-200/90 leading-relaxed">
            GLC 2026 offers direct access to transformative discussions, networking with industry chairs and peers, and actionable insights across international business domains.
          </p>
        </div>

        {/* Numbered Benefits Grid */}
        <div className="relative">
          {/* Central Connecting Divider Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-wine-800 -translate-y-1/2 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {DELEGATE_ADVANTAGES.map((item) => (
              <div
                key={item.step}
                className="relative rounded-xl p-7 flex flex-col justify-between bg-[#13030F] border border-wine-800 hover:border-wine-700 transition-colors duration-200 group"
              >
                {/* Step indicator */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-bold text-[#ffc5b6]">
                      {item.step}
                    </span>
                    <span className="text-[10px] font-semibold tracking-wider text-glc-orange uppercase px-2 py-1 rounded-sm bg-wine-900 border border-wine-700">
                      {item.metric}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-cream-50 mb-3 group-hover:text-white leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-cream-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom indicator */}
                <div className="mt-8 pt-4 border-t border-wine-800/60 flex items-center justify-between text-[11px] font-medium text-cream-400">
                  <span>Benefit {item.step}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-glc-magenta group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  )
}
