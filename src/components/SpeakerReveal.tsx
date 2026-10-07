'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { SHUFFLED_PANELISTS } from '@/data/panelistsData'
import PanelistCard from './PanelistCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function SpeakerReveal() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isInteractingRef = useRef(false)
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Duplicate list for infinite loop feel
  const allSpeakers = [...SHUFFLED_PANELISTS, ...SHUFFLED_PANELISTS]

  // Update button visibility based on scroll position
  const checkScrollState = useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 20)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 20)
  }, [])

  // Manual scroll handler for desktop buttons
  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current
    if (!el) return

    // Pause auto-scroll on manual interaction
    isInteractingRef.current = true
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = setTimeout(() => {
      isInteractingRef.current = false
    }, 4000)

    // Scroll by roughly 1 card width + gap (300px + 24px) on desktop or container width / 2
    const scrollAmount = Math.max(320, Math.floor(el.clientWidth * 0.75))
    const targetScroll = direction === 'left' ? el.scrollLeft - scrollAmount : el.scrollLeft + scrollAmount

    el.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    })
  }

  // Smooth auto-scroll loop when idle
  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return

    let animationFrameId: number

    const autoScrollLoop = () => {
      if (!isInteractingRef.current && el) {
        // Half-width of content (the first copy of the list)
        const halfScroll = el.scrollWidth / 2

        if (el.scrollLeft >= halfScroll) {
          // Seamlessly reset back to start without user noticing
          el.scrollLeft -= halfScroll
        } else {
          el.scrollLeft += 0.75 // Silky smooth ~45px per second
        }
      }
      animationFrameId = requestAnimationFrame(autoScrollLoop)
    }

    animationFrameId = requestAnimationFrame(autoScrollLoop)

    const onScroll = () => {
      checkScrollState()
    }

    const onTouchStart = () => {
      isInteractingRef.current = true
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    }

    const onTouchEnd = () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
      resumeTimerRef.current = setTimeout(() => {
        isInteractingRef.current = false
      }, 3500)
    }

    const onMouseEnter = () => {
      isInteractingRef.current = true
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    }

    const onMouseLeave = () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
      resumeTimerRef.current = setTimeout(() => {
        isInteractingRef.current = false
      }, 2500)
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    el.addEventListener('mouseenter', onMouseEnter, { passive: true })
    el.addEventListener('mouseleave', onMouseLeave, { passive: true })

    checkScrollState()

    return () => {
      cancelAnimationFrame(animationFrameId)
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('mouseenter', onMouseEnter)
      el.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [checkScrollState])

  return (
    <div id="speakers" className="relative space-y-8 sm:space-y-10 scroll-mt-24">
      
      {/* Header Banner */}
      <div className="rounded-2xl p-5 sm:p-10 bg-gradient-to-br from-[#1A0415] via-[#10020D] to-[#080006] border border-wine-800/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-glc-magenta/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-glc-orange/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-glc-orange font-sans block mb-1">
              Global Leadership Conclave
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-cream-50 uppercase">
              MEET OUR SPEAKERS
            </h2>
          </div>

          {/* Desktop Manual Navigation Arrows */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              className={`w-11 h-11 rounded-full border border-wine-700/80 bg-wine-950/80 hover:bg-wine-900/90 text-cream-100 flex items-center justify-center transition-all duration-200 backdrop-blur-md shadow-lg active:scale-95 ${
                !canScrollLeft ? 'opacity-40 cursor-not-allowed' : 'hover:border-glc-magenta hover:text-white cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              className={`w-11 h-11 rounded-full border border-wine-700/80 bg-wine-950/80 hover:bg-wine-900/90 text-cream-100 flex items-center justify-center transition-all duration-200 backdrop-blur-md shadow-lg active:scale-95 ${
                !canScrollRight ? 'opacity-40 cursor-not-allowed' : 'hover:border-glc-magenta hover:text-white cursor-pointer'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Carousel with Touch Swipe and Desktop Click Controls */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 py-2">
        
        {/* Floating Side Scroll Buttons on Desktop for Fast Navigation */}
        <button
          onClick={() => handleScroll('left')}
          aria-label="Scroll speakers left"
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/75 hover:bg-black/95 border border-white/20 hover:border-glc-magenta text-white items-center justify-center shadow-2xl backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() => handleScroll('right')}
          aria-label="Scroll speakers right"
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/75 hover:bg-black/95 border border-white/20 hover:border-glc-magenta text-white items-center justify-center shadow-2xl backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Scrollable Container - Touch drag enabled with momentum on iOS & Android */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 py-4 overflow-x-auto overflow-y-hidden select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth touch-pan-x cursor-grab active:cursor-grabbing"
          style={{
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {allSpeakers.map((panelist, idx) => (
            <PanelistCard
              key={`interactive-${panelist.id}-${idx}`}
              panelist={panelist}
              isCarousel
            />
          ))}
        </div>

        {/* Subtle Edge Fade Hints */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-wine-950 via-wine-950/60 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-wine-950 via-wine-950/60 to-transparent" />

      </div>

      {/* Mobile Swipe Hint */}
      <div className="sm:hidden text-center -mt-3">
        <p className="text-[11px] text-cream-400/70 tracking-wider uppercase font-medium">
          ← Swipe to explore all speakers →
        </p>
      </div>

    </div>
  )
}
