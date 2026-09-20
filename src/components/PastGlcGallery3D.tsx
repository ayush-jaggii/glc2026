'use client'

import React, { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import InfiniteGallery with SSR disabled for WebGL canvas safety
const InfiniteGallery = dynamic(
  () => import('@/components/ui/3d-gallery-photography'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-glc-magenta border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-[11px] font-mono tracking-widest uppercase text-cream-300/60">
          Loading 3D Visuals...
        </span>
      </div>
    ),
  }
)

const GLC_PAST_PHOTOS = [
  { src: '/glc-photos/DSC00015.JPG', alt: 'Keynote Address & Grand Audience' },
  { src: '/glc-photos/DSC00016.JPG', alt: 'Executive Leadership Panel in Session' },
  { src: '/glc-photos/DSC00026.JPG', alt: 'Dignitaries Lighting the Ceremonial Lamp' },
  { src: '/glc-photos/DSC00046.JPG', alt: 'Colloquium Opening Address' },
  { src: '/glc-photos/DSC00296.JPG', alt: 'Industry Thought Leaders & Deliberations' },
  { src: '/glc-photos/DSC00311.JPG', alt: 'Auditorium Interactive Q&A' },
  { src: '/glc-photos/DSC00361.JPG', alt: 'Delegate Networking & Executive Synergy' },
  { src: '/glc-photos/DSC00414.JPG', alt: 'CXO Symposium Deliberations' },
  { src: '/glc-photos/DSC00419.JPG', alt: 'Felicitation of Distinguished Speakers' },
  { src: '/glc-photos/DSC_0424.JPG', alt: 'Conclave Assembly & Student Leaders' },
]

export default function PastGlcGallery3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const progressRef = useRef(0)
  const isLockedRef = useRef(false)
  const isCompletedRef = useRef(false)
  const [isLocked, setIsLocked] = useState(false)

  // 1. Wheel listener to lock page scroll on arrival and advance photos until cycle is complete
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      
      // When the section is centered/aligned in the viewport
      const inView = rect.top <= 50 && rect.bottom >= window.innerHeight - 50

      // Lock scroll if user lands on this section and hasn't finished the photo cycle
      if (inView && !isCompletedRef.current) {
        if (!isLockedRef.current) {
          isLockedRef.current = true
          setIsLocked(true)
          // Snap smoothly to lock position
          containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }

      if (isLockedRef.current) {
        // Prevent website from scrolling while viewing photos
        e.preventDefault()

        const delta = e.deltaY * 0.0012
        let next = progressRef.current + delta

        // If user scrolls UP while at the beginning, release lock upwards
        if (delta < 0 && progressRef.current <= 0.01) {
          isLockedRef.current = false
          setIsLocked(false)
          return
        }

        // Clamp between 0.0 and 1.0
        next = Math.max(0, Math.min(1.0, next))
        progressRef.current = next
        setScrollProgress(next)

        // When all 10 photos are done coming, release the lock and continue website scroll!
        if (next >= 1.0) {
          isLockedRef.current = false
          setIsLocked(false)
          isCompletedRef.current = true
          // Smoothly continue scrolling down the website
          window.scrollBy({ top: 160, behavior: 'smooth' })
        }
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  // 2. Touch listener for mobile devices
  useEffect(() => {
    let touchStartY = 0

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const inView = rect.top <= 60 && rect.bottom >= window.innerHeight - 60

      if (inView && !isCompletedRef.current) {
        if (!isLockedRef.current) {
          isLockedRef.current = true
          setIsLocked(true)
          containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }

      if (isLockedRef.current) {
        const currentY = e.touches[0].clientY
        const deltaY = touchStartY - currentY
        touchStartY = currentY

        e.preventDefault()
        const delta = deltaY * 0.0028
        let next = progressRef.current + delta

        if (delta < 0 && progressRef.current <= 0.01) {
          isLockedRef.current = false
          setIsLocked(false)
          return
        }

        next = Math.max(0, Math.min(1.0, next))
        progressRef.current = next
        setScrollProgress(next)

        if (next >= 1.0) {
          isLockedRef.current = false
          setIsLocked(false)
          isCompletedRef.current = true
          window.scrollBy({ top: 160, behavior: 'smooth' })
        }
      }
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  // 3. Keyboard navigation support (ArrowDown, PageDown, Space)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isLockedRef.current) return
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault()
        const next = Math.min(1.0, progressRef.current + 0.1)
        progressRef.current = next
        setScrollProgress(next)
        if (next >= 1.0) {
          isLockedRef.current = false
          setIsLocked(false)
          isCompletedRef.current = true
          window.scrollBy({ top: 160, behavior: 'smooth' })
        }
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault()
        const next = Math.max(0, progressRef.current - 0.1)
        if (next <= 0) {
          isLockedRef.current = false
          setIsLocked(false)
        }
        progressRef.current = next
        setScrollProgress(next)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // 4. Reset completion if user scrolls back above the section
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      if (rect.top > window.innerHeight * 0.85) {
        isCompletedRef.current = false
        progressRef.current = 0
        setScrollProgress(0)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Manual skip function
  const handleSkip = () => {
    isLockedRef.current = false
    setIsLocked(false)
    isCompletedRef.current = true
    progressRef.current = 1.0
    setScrollProgress(1.0)
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
  }

  const currentPhotoNum = Math.min(10, Math.floor(scrollProgress * 10) + 1)

  return (
    <div
      ref={containerRef}
      id="past-glc-gallery"
      className="relative w-full h-screen overflow-hidden flex items-center justify-center my-0 p-0 bg-wine-950"
    >
      {/* Deep atmospheric radial glow blending seamlessly with the page */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,81,151,0.09)_0%,transparent_75%)] pointer-events-none z-10" />

      {/* 3D Photography Canvas driven by scrollProgress */}
      <div className="absolute inset-0 w-full h-full">
        <InfiniteGallery
          images={GLC_PAST_PHOTOS}
          scrollProgress={scrollProgress}
          speed={1.0}
          zSpacing={3.2}
          visibleCount={10}
          className="w-full h-full"
        />
      </div>

      {/* Prominent GLC Text in the Middle with mix-blend-exclusion */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center px-4 mix-blend-exclusion z-20 select-none">
        <h2 className="font-tektype text-7xl sm:text-9xl md:text-[12rem] lg:text-[15rem] font-bold tracking-tight text-white leading-none">
          GLC
        </h2>
        <p className="font-mono text-xs sm:text-sm md:text-base tracking-[0.35em] uppercase text-white/90 mt-2 font-medium">
          Archival Chronicles
        </p>
      </div>

      {/* Dynamic Scroll Lock Status & Progress Indicator */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-12 pointer-events-none">
        <div className="flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-[11px] font-mono text-cream-200">
          <span className="w-2 h-2 rounded-full bg-glc-magenta animate-pulse" />
          <span>Photo {currentPhotoNum} of 10</span>
          <span className="text-cream-400/60">· Scroll to advance</span>
        </div>

        {isLocked && (
          <button
            type="button"
            onClick={handleSkip}
            className="pointer-events-auto text-[11px] font-mono uppercase tracking-wider text-cream-300 hover:text-white bg-black/60 hover:bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 transition-colors"
          >
            Continue to Editions ↓
          </button>
        )}
      </div>

      {/* Top and Bottom Feathering Gradients for seamless section blending */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-wine-950 via-wine-950/80 to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-wine-950 via-wine-950/80 to-transparent pointer-events-none z-20" />
    </div>
  )
}
