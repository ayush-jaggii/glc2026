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

  // Constants
  const TARGET_CRUISE_SPEED = 0.14 // ~140px/s (~2.3px per frame at 60Hz, ~1.15px at 120Hz ProMotion)

  // Interaction & momentum tracking refs
  const isTouchingRef = useRef(false)
  const isHoveredRef = useRef(false)
  const isButtonNavigatingRef = useRef(false)
  const isWheelScrollingRef = useRef(false)
  const buttonNavTimerRef = useRef<NodeJS.Timeout | null>(null)
  const wheelTimerRef = useRef<NodeJS.Timeout | null>(null)

  const lastFrameTimeRef = useRef(0)
  const lastScrollLeftRef = useRef(0)
  const measuredVelocityRef = useRef(0) // px/ms
  const currentAutoSpeedRef = useRef(0) // px/ms
  const lastTouchEndTimeRef = useRef(0)
  const isAutoScrollingRef = useRef(false)

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

    isButtonNavigatingRef.current = true
    isAutoScrollingRef.current = false
    currentAutoSpeedRef.current = 0
    if (buttonNavTimerRef.current) clearTimeout(buttonNavTimerRef.current)
    buttonNavTimerRef.current = setTimeout(() => {
      isButtonNavigatingRef.current = false
      if (scrollContainerRef.current) {
        lastScrollLeftRef.current = scrollContainerRef.current.scrollLeft
        lastTouchEndTimeRef.current = performance.now()
      }
    }, 700)

    const scrollAmount = Math.max(340, Math.floor(el.clientWidth * 0.75))
    const targetScroll = direction === 'left' ? el.scrollLeft - scrollAmount : el.scrollLeft + scrollAmount

    el.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    })
  }

  // Smooth momentum-aware continuous auto-scroll loop
  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return

    let animationFrameId: number

    const autoScrollLoop = (now: DOMHighResTimeStamp) => {
      if (!el) {
        animationFrameId = requestAnimationFrame(autoScrollLoop)
        return
      }

      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = now
        lastScrollLeftRef.current = el.scrollLeft
        animationFrameId = requestAnimationFrame(autoScrollLoop)
        return
      }

      // Elapsed time in ms, clamped between 1ms and 35ms (handles frame drops / background tabs)
      const dt = Math.min(35, Math.max(1, now - lastFrameTimeRef.current))
      lastFrameTimeRef.current = now

      const halfScroll = el.scrollWidth / 2
      const currentScroll = el.scrollLeft

      // 1. If actively touching with finger
      if (isTouchingRef.current) {
        isAutoScrollingRef.current = false
        currentAutoSpeedRef.current = 0
        const dx = currentScroll - lastScrollLeftRef.current
        if (Math.abs(dx) < halfScroll / 2) {
          const instantV = dx / dt
          measuredVelocityRef.current = measuredVelocityRef.current * 0.6 + instantV * 0.4
        }
        if (el.scrollLeft >= halfScroll) {
          el.scrollLeft -= halfScroll
        } else if (el.scrollLeft < 0) {
          el.scrollLeft += halfScroll
        }
        lastScrollLeftRef.current = el.scrollLeft
        animationFrameId = requestAnimationFrame(autoScrollLoop)
        return
      }

      // 2. If desktop hovering, manual button navigating, or wheel scrolling
      if (isHoveredRef.current || isButtonNavigatingRef.current || isWheelScrollingRef.current) {
        isAutoScrollingRef.current = false
        currentAutoSpeedRef.current = 0
        measuredVelocityRef.current = 0
        lastScrollLeftRef.current = currentScroll
        animationFrameId = requestAnimationFrame(autoScrollLoop)
        return
      }

      // 3. User released finger: track native inertia / momentum
      if (!isAutoScrollingRef.current) {
        const dx = currentScroll - lastScrollLeftRef.current
        const instantV = dx / dt
        if (Math.abs(dx) < halfScroll / 2) {
          measuredVelocityRef.current = measuredVelocityRef.current * 0.65 + instantV * 0.35
        } else {
          measuredVelocityRef.current *= 0.8
        }

        // Loop wrap during native momentum
        if (el.scrollLeft >= halfScroll) {
          el.scrollLeft -= halfScroll
        } else if (el.scrollLeft < 0) {
          el.scrollLeft += halfScroll
        }
        lastScrollLeftRef.current = el.scrollLeft

        const timeSinceRelease = now - lastTouchEndTimeRef.current
        const v = measuredVelocityRef.current

        // If native momentum is still cruising forward faster than target cruise speed:
        // Wait for it to naturally decelerate so there is zero abrupt speed jump!
        if (v > TARGET_CRUISE_SPEED) {
          animationFrameId = requestAnimationFrame(autoScrollLoop)
          return
        }

        // If native momentum is moving backward (swiped left):
        // Wait until backward motion settles to a stop.
        if (v < -0.05) {
          animationFrameId = requestAnimationFrame(autoScrollLoop)
          return
        }

        // Momentum is now <= TARGET_CRUISE_SPEED and not moving backward.
        // If it was a fast swipe that naturally glided down to cruise speed, OR if it has been settled for >= 250ms:
        const isSmoothTakeover = (v > 0.04 && v <= TARGET_CRUISE_SPEED) || timeSinceRelease >= 250

        if (isSmoothTakeover || timeSinceRelease >= 2000) {
          isAutoScrollingRef.current = true
          // Match the current glide velocity for a 100% seamless transition
          currentAutoSpeedRef.current = Math.max(0.02, Math.min(TARGET_CRUISE_SPEED, v))
        } else {
          animationFrameId = requestAnimationFrame(autoScrollLoop)
          return
        }
      }

      // 4. Actively Auto-Scrolling:
      // Smoothly ease speed to TARGET_CRUISE_SPEED (gentle ramp up prevents any sudden kick)
      if (currentAutoSpeedRef.current < TARGET_CRUISE_SPEED) {
        currentAutoSpeedRef.current = Math.min(
          TARGET_CRUISE_SPEED,
          currentAutoSpeedRef.current + 0.005 * (dt / 16.67)
        )
      }

      const moveAmount = currentAutoSpeedRef.current * dt
      el.scrollLeft += moveAmount

      // Seamless infinite wrap
      if (el.scrollLeft >= halfScroll) {
        el.scrollLeft -= halfScroll
      }

      lastScrollLeftRef.current = el.scrollLeft
      animationFrameId = requestAnimationFrame(autoScrollLoop)
    }

    animationFrameId = requestAnimationFrame(autoScrollLoop)

    const onScroll = () => {
      checkScrollState()
    }

    // Touch events for mobile
    const onTouchStart = () => {
      isTouchingRef.current = true
      isAutoScrollingRef.current = false
      currentAutoSpeedRef.current = 0
      measuredVelocityRef.current = 0
      if (scrollContainerRef.current) {
        lastScrollLeftRef.current = scrollContainerRef.current.scrollLeft
      }
    }

    const onTouchEnd = () => {
      isTouchingRef.current = false
      lastTouchEndTimeRef.current = performance.now()
    }

    const onTouchCancel = () => {
      isTouchingRef.current = false
      lastTouchEndTimeRef.current = performance.now()
    }

    // Mouse events for desktop
    const onMouseEnter = () => {
      isHoveredRef.current = true
      isAutoScrollingRef.current = false
    }

    const onMouseLeave = () => {
      isHoveredRef.current = false
      lastTouchEndTimeRef.current = performance.now()
    }

    // Wheel/trackpad events for desktop
    const onWheel = () => {
      isWheelScrollingRef.current = true
      isAutoScrollingRef.current = false
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current)
      wheelTimerRef.current = setTimeout(() => {
        isWheelScrollingRef.current = false
        lastTouchEndTimeRef.current = performance.now()
      }, 400)
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    el.addEventListener('touchcancel', onTouchCancel, { passive: true })
    el.addEventListener('mouseenter', onMouseEnter, { passive: true })
    el.addEventListener('mouseleave', onMouseLeave, { passive: true })
    el.addEventListener('wheel', onWheel, { passive: true })

    checkScrollState()

    return () => {
      cancelAnimationFrame(animationFrameId)
      if (buttonNavTimerRef.current) clearTimeout(buttonNavTimerRef.current)
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current)
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('touchcancel', onTouchCancel)
      el.removeEventListener('mouseenter', onMouseEnter)
      el.removeEventListener('mouseleave', onMouseLeave)
      el.removeEventListener('wheel', onWheel)
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

        {/* Scrollable Container - Touch drag enabled with momentum on iOS & Android (no CSS scroll-smooth conflict) */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 px-6 sm:px-10 lg:px-12 py-4 overflow-x-auto overflow-y-hidden select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden touch-pan-x cursor-grab active:cursor-grabbing"
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

    </div>
  )
}
