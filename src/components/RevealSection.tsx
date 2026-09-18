'use client'

import React from 'react'
import SpeakerReveal from './SpeakerReveal'
import PanelReveal from './PanelReveal'

export default function RevealSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-wine-950 overflow-hidden">
      
      {/* Visual Ambient Stream Line connecting sections */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-glc-magenta/40 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-24">
        {/* 1. Speakers Section */}
        <SpeakerReveal />

        {/* 2. Symposia Section */}
        <PanelReveal />
      </div>

    </section>
  )
}
