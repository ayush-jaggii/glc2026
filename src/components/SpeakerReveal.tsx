'use client'

import React from 'react'
import { SHUFFLED_PANELISTS } from '@/data/panelistsData'
import PanelistCard from './PanelistCard'

export default function SpeakerReveal() {
  return (
    <div id="speakers" className="relative space-y-10 scroll-mt-24">
      
      {/* Header Banner */}
      <div className="rounded-2xl p-6 sm:p-10 bg-gradient-to-br from-[#1A0415] via-[#10020D] to-[#080006] border border-wine-800/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-glc-magenta/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-glc-orange/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-cream-50 uppercase">
            MEET OUR SPEAKERS
          </h2>
        </div>
      </div>

      {/* Smooth Continuous Scrolling Carousel with Masked Edges */}
      <div className="relative overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 py-6 group">
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
          <div className="animate-marquee flex gap-6 py-4 group-hover:[animation-play-state:paused] hover:[animation-play-state:paused]">
            {SHUFFLED_PANELISTS.map((panelist, idx) => (
              <PanelistCard
                key={`marquee-1-${panelist.id}-${idx}`}
                panelist={panelist}
                isCarousel
              />
            ))}
            {SHUFFLED_PANELISTS.map((panelist, idx) => (
              <PanelistCard
                key={`marquee-2-${panelist.id}-${idx}`}
                panelist={panelist}
                isCarousel
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
