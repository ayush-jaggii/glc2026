'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { Camera, Sparkles, Move, Maximize2, Minimize2 } from 'lucide-react'

// Dynamically import InfiniteGallery with SSR disabled for WebGL canvas safety
const InfiniteGallery = dynamic(
  () => import('@/components/ui/3d-gallery-photography'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[480px] flex flex-col items-center justify-center bg-[#12030F] rounded-2xl border border-wine-800/80">
        <div className="w-10 h-10 border-2 border-glc-magenta border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-mono uppercase tracking-widest text-cream-300">
          Initializing 3D Visual Archive...
        </p>
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
  const [isFullscreen, setIsFullscreen] = useState(false)

  return (
    <div className="mt-16 sm:mt-20">
      
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm text-xs font-semibold tracking-widest uppercase bg-wine-900/80 text-glc-orange border border-wine-700/80 mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>3D Photo Retrospective</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-cream-50 uppercase tracking-tight">
            Moments Across Past Editions
          </h3>
          <p className="text-xs sm:text-sm text-cream-200/80 mt-1 max-w-2xl leading-relaxed">
            Fly through the archives of previous Global Leadership Colloquiums. Captured keynotes, executive deliberations, and delegate synergy at MAHE Bengaluru.
          </p>
        </div>

        {/* Interaction Hint & Fullscreen Button */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-wine-900/50 border border-wine-800 text-[11px] font-medium text-cream-300">
            <Move className="w-3.5 h-3.5 text-glc-magenta" />
            <span>Scroll / Drag / Arrow Keys to Navigate</span>
          </div>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-wine-900 hover:bg-wine-800 border border-wine-700 text-xs font-semibold text-cream-100 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit full view' : 'Expand full view'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-glc-orange" />
                <span>Default View</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-glc-magenta" />
                <span>Expand View</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3D Infinite Canvas Container */}
      <div
        className={`relative w-full rounded-2xl overflow-hidden border border-wine-800 bg-gradient-to-b from-[#140311] via-[#0D020B] to-[#080107] shadow-2xl transition-all duration-500 ${
          isFullscreen
            ? 'fixed inset-4 z-50 rounded-2xl h-[calc(100vh-2rem)] border-glc-magenta/50 shadow-[0_0_80px_rgba(244,81,151,0.3)]'
            : 'h-[460px] sm:h-[560px] md:h-[620px]'
        }`}
      >
        {/* Subtle Backdrop Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,81,151,0.08)_0%,transparent_70%)] pointer-events-none z-10" />

        {/* The 3D Photography Gallery */}
        <InfiniteGallery
          images={GLC_PAST_PHOTOS}
          speed={1.0}
          zSpacing={3.2}
          visibleCount={10}
          falloff={{ near: 0.8, far: 14 }}
          className="w-full h-full"
        />

        {/* Close button if full view */}
        {isFullscreen && (
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 z-30 px-3.5 py-2 rounded-lg bg-black/80 hover:bg-black border border-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all"
          >
            Close Full View ✕
          </button>
        )}

        {/* Ambient Top & Bottom Gradients for Sleek Frame Integration */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#140311] to-transparent pointer-events-none z-20" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#080107] to-transparent pointer-events-none z-20" />

        {/* Bottom Status Bar */}
        <div className="absolute bottom-3 left-0 right-0 z-20 flex items-center justify-between px-4 sm:px-6 pointer-events-none">
          <div className="flex items-center gap-2 text-[11px] font-mono text-cream-300/80 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
            <Sparkles className="w-3 h-3 text-glc-orange shrink-0" />
            <span>10 Curated Archival Moments</span>
          </div>

          <div className="hidden sm:block text-[11px] font-mono text-cream-400/70 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
            Auto-flow resumes after 3s
          </div>
        </div>

      </div>

    </div>
  )
}
