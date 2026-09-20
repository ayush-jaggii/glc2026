'use client'

import React from 'react'
import Image from 'next/image'
import { PANELS_LIST } from '@/data/eventData'
import { ArrowUpRight } from 'lucide-react'

export default function PanelReveal() {
  return (
    <section id="panels" className="relative mt-20 pt-16 border-t border-wine-900/60 scroll-mt-24">
      {/* Hidden anchor target for backwards compatibility */}
      <span id="symposia" className="absolute -top-24 pointer-events-none" />

      {/* Section Header */}
      <div className="max-w-3xl mb-12 sm:mb-16">
        <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream-50 uppercase mb-3">
          Panel Discussion Topics
        </h3>
        <p className="text-xs sm:text-sm text-cream-200/80 leading-relaxed font-normal">
          Five focused symposia exploring multinational enterprise strategy, capability centers, and global market dynamics.
        </p>
      </div>

      {/* Minimalist Editorial Panels List */}
      <div className="divide-y divide-wine-800/60 border-y border-wine-800/60">
        {PANELS_LIST.map((panel) => (
          <div
            key={panel.id}
            className="group relative py-7 sm:py-9 px-2 sm:px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-wine-900/25 transition-all duration-300 rounded-xl cursor-default"
          >
            {/* Left Column: Photo Thumbnail & Topic Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-7 flex-1 min-w-0">
              
              {/* Panel Image Thumbnail */}
              <div className="relative w-full sm:w-44 md:w-56 h-28 sm:h-28 md:h-32 rounded-lg overflow-hidden shrink-0 bg-wine-950 border border-wine-800/80 group-hover:border-glc-magenta/70 shadow-lg group-hover:shadow-[0_0_24px_-6px_rgba(244,81,151,0.35)] transition-all duration-300">
                <Image
                  src={panel.image}
                  alt={panel.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 176px, 224px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                {/* Subtle dark vignette on image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* One-Liner Topic & Sector Tag */}
              <div className="flex flex-col justify-center min-w-0">
                
                {/* Creative Title (Helvetica only) */}
                <div className="text-xs font-sans font-bold tracking-wider uppercase text-cream-400 group-hover:text-cream-300 mb-1.5 transition-colors">
                  {panel.title}
                </div>

                {/* Primary One-Liner Topic */}
                <h4 className="text-base sm:text-lg md:text-xl font-bold text-cream-100 group-hover:text-white group-hover:text-[#ffc5b6] transition-colors leading-snug">
                  {panel.topic}
                </h4>

                {/* Sector Category Tag in warm accent color */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs font-semibold tracking-wide text-glc-orange group-hover:text-glc-pink transition-colors">
                    {panel.category}
                  </span>
                  <span className="text-cream-400/40 text-xs">·</span>
                  <span className="text-xs text-cream-300/80 truncate">
                    {panel.subtitle}
                  </span>
                </div>

              </div>

            </div>

            {/* Right Column: Active Gradient Edge Indicator & Arrow */}
            <div className="hidden sm:flex items-center gap-4 shrink-0 pl-4">
              <ArrowUpRight className="w-5 h-5 text-cream-400/60 group-hover:text-glc-orange transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              
              {/* Gradient Accent Bar (Inspired by reference design) */}
              <div className="w-2.5 h-16 rounded-full bg-gradient-to-b from-glc-orange via-glc-pink to-glc-magenta opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_16px_rgba(244,81,151,0.6)]" />
            </div>

          </div>
        ))}
      </div>

    </section>
  )
}
