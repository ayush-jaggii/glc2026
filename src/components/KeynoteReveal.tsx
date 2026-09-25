'use client'

import React from 'react'
import { Component as BloimBackground } from '@/components/ui/bloim-animation-background'

export default function KeynoteReveal() {
  return (
    <section id="keynote" className="relative scroll-mt-24">
      {/* Section Header */}
      <div className="max-w-3xl mb-8 sm:mb-12">
        <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream-50 uppercase">
          Keynote Speaker
        </h3>
      </div>

      {/* Bloim Animated Background Card in authentic GLC brand colors */}
      <div className="relative group rounded-3xl overflow-hidden border border-wine-800/80 hover:border-glc-magenta/60 transition-all duration-500 shadow-2xl bg-[#0B0207] min-h-[340px] sm:min-h-[460px] flex items-center justify-center">
        
        {/* Bloim WebGL Canvas with GLC Magenta & Amber Orange Shaders */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <BloimBackground jsonFilePath="/scenes/glc-bloim.json" className="w-full h-full" />
        </div>

        {/* Minimal edge vignette to blend with container edges */}
        <div className="absolute inset-0 bg-gradient-to-t from-wine-950/70 via-transparent to-wine-950/50 pointer-events-none" />

        {/* Text Content: Strictly Keynote Speaker / Revealing Soon */}
        <div className="relative z-10 text-center px-4 select-none">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-glc-orange mb-2 sm:mb-3">
            Keynote Speaker
          </p>
          <h4 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase text-cream-50 drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)]">
            Revealing Soon
          </h4>
        </div>

      </div>
    </section>
  )
}
