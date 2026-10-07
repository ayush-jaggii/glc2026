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

    // Pause auto-scroll briefly during button click, then quickly resume
    isInteractingRef.current = true
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = setTimeout(() => {
      isInteractingRef.current = false
    }, 1200)

    // Scroll by roughly 1 card width + gap (300px + 24px) on desktop
    const scrollAmount = Math.max(340, Math.floor(el.clientWidth * 0.75))
    const targetScroll = direction === 'left' ? el.scrollLeft - scrollAmount : el.scrollLeft + scrollAmount

    el.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    })
  }

  // Smooth continuous auto-scroll loop
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
          el.scrollLeft += 2.4 // Brisk, fluid ~145px per second
        }
      }
      animationFrameId = requestAnimationFrame(autoScrollLoop)
    }

    animationFrameId = requestAnimationFrame(autoScrollLoop)

    const onScroll = () => {
      checkScrollState()
    }

    // Touch events for mobile: pause while finger is down/swiping, resume immediately when released
    const onTouchStart = () => {
      isInteractingRef.current = true
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    }

    const onTouchEnd = () => {
      // Immediately resume auto-scrolling as soon as finger leaves the screen
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
      resumeTimerRef.current = setTimeout(() => {
        isInteractingRef.current = false
      }, 400)
    }

    const onTouchCancel = () => {
      isInteractingRef.current = false
    }

    // Mouse events for desktop: pause ONLY when cursor is hovering or clicking over a card
    const onMouseEnter = () => {
      isInteractingRef.current = true
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    }

    const onMouseLeave = () => {
      // Immediately resume auto-scrolling as soon as mouse leaves the container
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
      isInteractingRef.current = false
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    el.addEventListener('touchcancel', onTouchCancel, { passive: true })
    el.addEventListener('mouseenter', onMouseEnter, { passive: true })
    el.addEventListener('mouseleave', onMouseLeave, { passive: true })

    checkScrollState()

    return () => {
      cancelAnimationFrame(animationFrameId)
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('touchcancel', onTouchCancel)
      el.removeEventListener('mouseenter', onMouseEnter)
      el.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [checkScrollState])

  return (
    <div id="speakers" className="relative space-y-8 sm:space-y-10 scroll-mt-24">
      
      {/* Header Banner - Restored to clean, centered layout without extra labels or arrows */}
      <div className="rounded-2xl p-5 sm:p-10 bg-gradient-to-br from-[#1A0415] via-[#10020D] to-[#080006] border border-wine-800/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-glc-magenta/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-glc-orange/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-cream-50 uppercase">
            MEET OUR SPEAKERS
          </h2>
        </div>
      </div>

      {/* Interactive Carousel with Touch Swipe and Desktop Click Controls */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 py-2">
        
        {/* Floating Side Scroll Buttons on Desktop - z-50 ensures they always stay above hovered cards (z-30) */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleScroll('left')
          }}
          aria-label="Scroll speakers left"
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-[#180415]/90 hover:bg-[#250620] border border-wine-600/80 hover:border-glc-magenta text-white items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            handleScroll('right')
          }}
          aria-label="Scroll speakers right"
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-[#180415]/90 hover:bg-[#250620] border border-wine-600/80 hover:border-glc-magenta text-white items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Scrollable Container - Touch drag enabled with momentum on iOS & Android */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 px-6 sm:px-10 lg:px-12 py-4 overflow-x-auto overflow-y-hidden select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth touch-pan-x cursor-grab active:cursor-grabbing"
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
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-wine-950 via-wine-950/60 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-wine-950 via-wine-950/60 to-transparent z-10" />

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
