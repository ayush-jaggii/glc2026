'use client'

import React from 'react'
import Image from 'next/image'

export default function KeynoteReveal() {
  return (
    <section id="keynote" className="relative scroll-mt-24">
      {/* Section Header */}
      <div className="max-w-3xl mb-8 sm:mb-12">
        <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream-50 uppercase">
          Keynote Speaker
        </h3>
      </div>

      {/* Cinematic Keynote Card */}
      <div className="relative group w-full max-w-lg sm:max-w-xl mx-auto rounded-3xl overflow-hidden border border-wine-800/80 hover:border-glc-magenta/70 shadow-2xl hover:shadow-[0_20px_70px_rgba(244,81,151,0.25)] transition-all duration-500 bg-[#0a0208]">
        
        {/* Aspect Ratio Container for Image */}
        <div className="relative w-full aspect-[3/4] overflow-hidden">
          <Image
            src="/images/keynote-silhouette.jpg"
            alt="Keynote Speaker Revealing Soon"
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            priority
            className="object-cover object-center filter contrast-[1.08] group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Vignette & Contrast Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-wine-950 via-wine-950/40 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-wine-950/50 via-transparent to-transparent pointer-events-none" />

          {/* Floating Revealing Soon Typography */}
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 text-center z-10">
            <h4 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase text-cream-50 drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)]">
              Revealing Soon
            </h4>
          </div>
        </div>

      </div>
    </section>
  )
}
