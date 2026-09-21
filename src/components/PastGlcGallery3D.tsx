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
  const containerRef = useRef<HTMLElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Native, non-blocking bidirectional scroll tracking
  // Works seamlessly when scrolling down, scrolling back up, or changing direction mid-scroll
  useEffect(() => {
    let animationFrameId: number | null = null

    const updateProgress = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const totalScrollable = rect.height - window.innerHeight
      if (totalScrollable > 0) {
        // rect.top is 0 when the sticky viewport pins, and -totalScrollable when it unpins
        const progress = -rect.top / totalScrollable
        const clamped = Math.max(0, Math.min(1.0, progress))
        setScrollProgress(clamped)
      }
    }

    const onScroll = () => {
      if (animationFrameId !== null) return
      animationFrameId = window.requestAnimationFrame(() => {
        updateProgress()
        animationFrameId = null
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    updateProgress()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return (
    <section
      ref={containerRef}
      id="past-glc-gallery"
      className="relative w-full h-[300vh] bg-wine-950"
    >
      {/* Sticky full-viewport frame pinned while scrolling through the 3D photo journey */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        {/* Deep atmospheric radial glow blending seamlessly with the page */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,81,151,0.09)_0%,transparent_75%)] pointer-events-none z-10" />

        {/* 3D Photography Canvas driven smoothly by bidirectional scrollProgress */}
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

        {/* Prominent GLC in Hero Pink (#ffc5b6) with Negative Photo Inversion Effect */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-center px-4 mix-blend-exclusion z-20 select-none">
          <h2 className="font-tektype text-8xl sm:text-[11rem] md:text-[14rem] lg:text-[17rem] font-bold tracking-tight text-[#ffc5b6] leading-none">
            GLC
          </h2>
        </div>

        {/* Top and Bottom Feathering Gradients for seamless section blending */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-wine-950 via-wine-950/80 to-transparent pointer-events-none z-20" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-wine-950 via-wine-950/80 to-transparent pointer-events-none z-20" />
      </div>
    </section>
  )
}
