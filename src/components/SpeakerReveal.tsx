'use client'

import React, { useRef, useState } from 'react'
import { SHUFFLED_PANELISTS } from '@/data/panelistsData'
import PanelistCard from './PanelistCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function SpeakerReveal() {
  const [navOffset, setNavOffset] = useState(0)
  const [isInteracting, setIsInteracting] = useState(false)
  const touchStartXRef = useRef(0)
  const touchStartYRef = useRef(0)
  const startOffsetRef = useRef(0)
  const isHorizontalSwipeRef = useRef(false)

  // Desktop manual navigation buttons
  const handlePrev = () => {
    setNavOffset((prev) => prev + 340)
  }

  const handleNext = () => {
    setNavOffset((prev) => prev - 340)
  }

  // Mobile touch swipe handling (passive & non-blocking for vertical page scrolling)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
    touchStartYRef.current = e.touches[0].clientY
    startOffsetRef.current = navOffset
    isHorizontalSwipeRef.current = false
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartXRef.current
    const dy = e.touches[0].clientY - touchStartYRef.current

    // Determine gesture direction
    if (!isHorizontalSwipeRef.current) {
      // If moving more vertically than horizontally, let native page scroll take over freely!
      if (Math.abs(dy) > Math.abs(dx)) {
        return
      }
      // If clearly swiping horizontally, take over carousel offset
      if (Math.abs(dx) > 10) {
        isHorizontalSwipeRef.current = true
        setIsInteracting(true)
      }
    }

    if (isHorizontalSwipeRef.current) {
      setNavOffset(startOffsetRef.current + dx)
    }
  }

  const handleTouchEnd = () => {
    if (isHorizontalSwipeRef.current) {
      setIsInteracting(false)
      isHorizontalSwipeRef.current = false
    }
  }

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
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 py-2 overflow-hidden select-none group">
        
        {/* Floating Side Scroll Buttons on Desktop */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            handlePrev()
          }}
          aria-label="Scroll speakers left"
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-[#180415]/90 hover:bg-[#250620] border border-wine-600/80 hover:border-glc-magenta text-white items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            handleNext()
          }}
          aria-label="Scroll speakers right"
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-[#180415]/90 hover:bg-[#250620] border border-wine-600/80 hover:border-glc-magenta text-white items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Subtle Edge Fade Hints */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-wine-950 via-wine-950/60 to-transparent z-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-wine-950 via-wine-950/60 to-transparent z-40" />

        {/* Interactive Translation Layer */}
        <div
          className="w-max flex"
          style={{
            transform: `translate3d(${navOffset}px, 0, 0)`,
            transition: isInteracting ? 'none' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          {/* 100% GPU Hardware-Accelerated Marquee Loop running on Compositor Thread */}
          <div
            className="flex gap-4 sm:gap-6 py-4 animate-marquee group-hover:[animation-play-state:paused]"
            style={{
              animationDuration: '38s',
              animationPlayState: isInteracting ? 'paused' : undefined,
            }}
          >
            {/* Track 1 */}
            <div className="flex gap-4 sm:gap-6 shrink-0">
              {SHUFFLED_PANELISTS.map((panelist, idx) => (
                <PanelistCard
                  key={`track1-${panelist.id}-${idx}`}
                  panelist={panelist}
                  isCarousel
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
                />
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
