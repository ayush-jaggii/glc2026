'use client'

import React from 'react'
import SpeakerReveal from './SpeakerReveal'
import KeynoteReveal from './KeynoteReveal'
import PanelReveal from './PanelReveal'

export default function RevealSection() {
  return (
    <div className="relative bg-wine-950">
      {/* Visual Ambient Stream Line connecting sections */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-glc-magenta/40 to-transparent pointer-events-none" />

      {/* 1. Speakers Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-12 relative z-10">
        <SpeakerReveal />
      </div>

      {/* 2. Keynote Speaker - Full-Width Scroll-Driven Text Mask Reveal */}
      <KeynoteReveal />

      {/* 3. Symposia Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative z-10">
        <PanelReveal />
      </div>
    </div>
  )
}
