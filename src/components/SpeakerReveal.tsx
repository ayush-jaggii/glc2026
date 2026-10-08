'use client'

import React, { useRef, useState, useCallback } from 'react'
import { SHUFFLED_PANELISTS } from '@/data/panelistsData'
import PanelistCard from './PanelistCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function SpeakerReveal() {
  const [navOffset, setNavOffset] = useState(0)
  const [isCardExpanded, setIsCardExpanded] = useState(false)
  const touchStartXRef = useRef(0)
  const touchStartYRef = useRef(0)
  const isTouchActiveRef = useRef(false)

  // Step navigation (Desktop buttons & Mobile buttons/flicks)
  const handlePrev = useCallback(() => {
    setNavOffset((prev) => prev + 340)
  }, [])

  const handleNext = useCallback(() => {
    setNavOffset((prev) => prev - 340)
  }, [])

  // Touch flick detection for mobile:
  // Does NOT hijack touchmove so vertical page scrolling stays 100% native and smooth.
  // Tap (<30px movement) passes through cleanly to expand the card and open LinkedIn.
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
    touchStartYRef.current = e.touches[0].clientY
    isTouchActiveRef.current = true
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isTouchActiveRef.current) return
    isTouchActiveRef.current = false

    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    const dx = touchEndX - touchStartXRef.current
    const dy = touchEndY - touchStartYRef.current

    // If gesture was predominantly vertical, allow native vertical scroll
    if (Math.abs(dy) > Math.abs(dx)) return

    // Clean horizontal swipe/flick threshold (35px)
    if (dx < -35) {
      handleNext()
    } else if (dx > 35) {
      handlePrev()
    }
  }

  const handleToggleExpand = useCallback((expanded: boolean) => {
    setIsCardExpanded(expanded)
  }, [])

  return (
    <div id="speakers" className="relative space-y-8 sm:space-y-10 scroll-mt-24">
      
      {/* Header Banner - Clean, centered layout */}
      <div className="rounded-2xl p-5 sm:p-10 bg-gradient-to-br from-[#1A0415] via-[#10020D] to-[#080006] border border-wine-800/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-glc-magenta/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-glc-orange/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-cream-50 uppercase">
            MEET OUR SPEAKERS
          </h2>
        </div>
      </div>

      {/* GPU Hardware-Accelerated Marquee Carousel */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 py-2 overflow-hidden group">
        
        {/* Floating Side Scroll Buttons - Touch-friendly & active on both mobile and desktop */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            handlePrev()
          }}
          aria-label="Scroll speakers left"
          className="flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-[#180415]/90 hover:bg-[#250620] active:bg-glc-magenta/30 border border-wine-600/80 hover:border-glc-magenta text-white items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer"
        >
          <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            handleNext()
          }}
          aria-label="Scroll speakers right"
          className="flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-[#180415]/90 hover:bg-[#250620] active:bg-glc-magenta/30 border border-wine-600/80 hover:border-glc-magenta text-white items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer"
        >
          <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6" />
        </button>

        {/* Subtle Edge Fade Hints */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-wine-950 via-wine-950/60 to-transparent z-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-wine-950 via-wine-950/60 to-transparent z-40" />

        {/* Interactive Translation Layer */}
        <div
          className="w-max flex transition-transform duration-500 ease-out"
          style={{
            transform: `translate3d(${navOffset}px, 0, 0)`,
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* 100% GPU Hardware-Accelerated Marquee Loop running on Compositor Thread */}
          <div
            className="flex gap-4 sm:gap-6 py-4 animate-marquee group-hover:[animation-play-state:paused]"
            style={{
              animationDuration: '38s',
              animationPlayState: isCardExpanded ? 'paused' : undefined,
            }}
          >
            {/* Track 1 */}
            <div className="flex gap-4 sm:gap-6 shrink-0">
              {SHUFFLED_PANELISTS.map((panelist, idx) => (
                <PanelistCard
                  key={`track1-${panelist.id}-${idx}`}
                  panelist={panelist}
                  isCarousel
                  onToggleExpand={handleToggleExpand}
                />
              ))}
            </div>

            {/* Track 2 (Identical duplicate for seamless 100% infinite wrap) */}
            <div className="flex gap-4 sm:gap-6 shrink-0">
              {SHUFFLED_PANELISTS.map((panelist, idx) => (
                <PanelistCard
                  key={`track2-${panelist.id}-${idx}`}
                  panelist={panelist}
                  isCarousel
                  onToggleExpand={handleToggleExpand}
                />
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
