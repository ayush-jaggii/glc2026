'use client'

import React from 'react'
import SpeakerReveal from './SpeakerReveal'
import PanelReveal from './PanelReveal'

export default function RevealSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-wine-950 overflow-hidden">
      
      {/* Visual Ambient Stream Line connecting sections */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-glc-magenta/40 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-glc-magenta mb-2 block">
            Phase 01 Disclosure
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream-50 uppercase">
            THE DIALOGUE ARCHITECTURE
          </h2>
        </div>

        {/* 1. Speakers Locked Reveal State with Integrated Countdown */}
        <SpeakerReveal />

        {/* 2. The 5 Confirmed Thematic Panels */}
        <PanelReveal />

      </div>

    </section>
  )
}
