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

      {/* Bloim Animated Background Card in authentic GLC Brand Colors */}
      <div className="relative group rounded-3xl overflow-hidden border border-wine-800/80 hover:border-glc-magenta/60 transition-all duration-500 shadow-2xl bg-wine-950 min-h-[340px] sm:min-h-[460px] flex items-center justify-center">
        
        {/* Bloim Canvas in Authentic GLC Magenta & Orange */}
        <BloimBackground className="absolute inset-0 w-full h-full" />

        {/* Minimalist Keynote Text Content */}
        <div className="relative z-10 text-center px-4 select-none pointer-events-none">
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
