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

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect()
            const totalDistance = rect.height - window.innerHeight
            if (totalDistance > 0) {
              const currentOffset = -rect.top
              const rawProgress = currentOffset / totalDistance
              const clamped = Math.max(0, Math.min(1, rawProgress))
              setScrollProgress(clamped)
            }
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-[230vh] my-12">
      
      {/* Sticky Viewport pinned during the scroll journey */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-transparent">
        
        {/* Deep atmospheric radial glow blending seamlessly with the page */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,81,151,0.1)_0%,transparent_75%)] pointer-events-none z-10" />

        {/* 3D Photography Canvas driven by page scroll */}
        <div className="absolute inset-0 w-full h-full">
          <InfiniteGallery
            images={GLC_PAST_PHOTOS}
            scrollProgress={scrollProgress}
            speed={1.0}
            zSpacing={3.2}
            visibleCount={10}
            falloff={{ near: 0.8, far: 14 }}
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

        {/* Top and Bottom Feathering Gradients for 100% seamless transition */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-wine-950 via-wine-950/80 to-transparent pointer-events-none z-20" />
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-wine-950 via-wine-950/80 to-transparent pointer-events-none z-20" />

      </div>

    </div>
  )
}
