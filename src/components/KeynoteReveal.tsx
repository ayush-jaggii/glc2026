'use client'

import React from 'react'
import { Component as BloimBackground } from '@/components/ui/bloim-animation-background'

export default function KeynoteReveal() {
  return (
    <section id="keynote" className="relative scroll-mt-24">
      {/* Section Header */}
      <div className="max-w-3xl mb-4 sm:mb-8">
        <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream-50 uppercase">
          Keynote Speaker
        </h3>
      </div>

      {/* Seamless Bloim Animated Area - Feathered radially to melt into black background */}
      <div className="relative w-full min-h-[360px] sm:min-h-[480px] flex items-center justify-center">
        
        {/* Radially Feathered Blooming Glow Canvas */}
        <div className="absolute inset-0 w-full h-full pointer-events-none [mask-image:radial-gradient(ellipse_65%_55%_at_50%_50%,black_25%,transparent_85%)] [-webkit-mask-image:radial-gradient(ellipse_65%_55%_at_50%_50%,black_25%,transparent_85%)]">
          <BloimBackground className="w-full h-full" />
        </div>

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
