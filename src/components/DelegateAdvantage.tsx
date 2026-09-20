'use client'

import React from 'react'
import Image from 'next/image'
import { DELEGATE_ADVANTAGES } from '@/data/eventData'
import { CheckCircle2, ArrowRight, Mic2 } from 'lucide-react'

export default function DelegateAdvantage() {
  return (
    <section id="delegate-benefits" className="relative py-24 sm:py-32 bg-wine-950 overflow-hidden border-t border-wine-900/60 scroll-mt-24">
      {/* Hidden anchor for backwards compatibility */}
      <span id="advantage" className="absolute -top-24 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
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

        {/* 12-Column Grid: Featured Authentic Delegate Image + 4 Core Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          
          {/* Left Column: Authentic Delegate Photo Showcase */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden bg-[#13030F] border border-wine-800/80 hover:border-glc-magenta/60 shadow-2xl min-h-[460px] sm:min-h-[520px] flex flex-col justify-end p-6 sm:p-8 group transition-all duration-300">
            
            {/* Background Image: Delegate with Microphone at MAHE Bengaluru */}
            <div className="absolute inset-0 bg-wine-950">
              <Image
                src="/delegate.webp"
                alt="GLC Delegate participating in live colloquium deliberations at MAHE Bengaluru"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                priority
                className="object-cover object-top filter grayscale contrast-[1.12] brightness-[0.92] group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500 ease-out"
              />
            </div>

            {/* Deep Cinematic Vignette Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0108] via-[#0A0108]/65 to-black/30 pointer-events-none z-10" />

            {/* Top Badge: Live Floor Participation */}
            <div className="absolute top-4 left-4 z-20">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold tracking-wider text-glc-orange uppercase px-3 py-1 rounded-full bg-black/70 border border-white/10 backdrop-blur-md">
                <Mic2 className="w-3 h-3 text-glc-magenta" />
                <span>Auditorium Floor Voice</span>
              </span>
            </div>

            {/* Bottom Content Overlay */}
            <div className="relative z-20">
              <div className="text-xs font-semibold uppercase tracking-wider text-glc-pink mb-1.5">
                Active Deliberation
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-cream-50 group-hover:text-white transition-colors mb-2 leading-snug">
                Direct CXO Discourse & Floor Access
              </h3>
              <p className="text-xs sm:text-sm text-cream-200/85 leading-relaxed mb-4 font-normal">
                Every registered delegate is an active participant in keynote dialogues, interactive panel Q&A, and cross-border executive roundtables at MAHE Bengaluru.
              </p>

              {/* Live Metric Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-wine-800/80">
                <span className="text-[11px] font-mono text-cream-300/80 bg-wine-950/80 px-2.5 py-1 rounded border border-wine-800">
                  40+ CXO Chairs
                </span>
                <span className="text-[11px] font-mono text-cream-300/80 bg-wine-950/80 px-2.5 py-1 rounded border border-wine-800">
                  5 Sector Panels
                </span>
                <span className="text-[11px] font-mono text-cream-300/80 bg-wine-950/80 px-2.5 py-1 rounded border border-wine-800">
                  1,000+ Leaders
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: 4 Numbered Benefit Cards in 2x2 Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {DELEGATE_ADVANTAGES.map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between bg-[#13030F] border border-wine-800/80 hover:border-glc-magenta/60 hover:shadow-[0_12px_32px_-8px_rgba(244,81,151,0.2)] transition-all duration-300 group"
              >
                <div>
                  {/* Step & Metric Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl sm:text-4xl font-bold text-[#ffc5b6]">
                      {item.step}
                    </span>
                    <span className="text-[10px] font-semibold tracking-wider text-glc-orange uppercase px-2.5 py-1 rounded-sm bg-wine-900 border border-wine-700/80">
                      {item.metric}
                    </span>
                  </div>

                  {/* Benefit Title */}
                  <h3 className="text-base sm:text-lg font-bold text-cream-50 mb-2.5 group-hover:text-white leading-snug">
                    {item.title}
                  </h3>

                  {/* Benefit Description */}
                  <p className="text-xs sm:text-sm text-cream-300/90 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Footer */}
                <div className="mt-6 pt-3.5 border-t border-wine-800/60 flex items-center justify-between text-[11px] font-medium text-cream-400">
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
