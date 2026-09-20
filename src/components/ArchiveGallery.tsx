'use client'

import React from 'react'
import VideoShowcase from './VideoShowcase'
import PastGlcGallery3D from './PastGlcGallery3D'
import { CountingNumber } from '@/components/ui/counting-number'

const CUMULATIVE_PAST_STATS = [
  { target: 3, suffix: "", label: "Landmark Editions" },
  { target: 91, suffix: "+", label: "C-Suite Speakers" },
  { target: 2050, suffix: "+", label: "Delegates Convened" },
  { target: 140, suffix: "+", label: "Participating MNCs" },
]

export default function ArchiveGallery() {

  return (
    <section id="previous-editions" className="relative py-24 sm:py-32 bg-wine-950 overflow-hidden border-t border-wine-900/60 scroll-mt-24">
      {/* Hidden anchor for backwards compatibility */}
      <span id="archive" className="absolute -top-24 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream-50 uppercase mb-4">
            Past Editions
          </h2>
          <p className="text-sm sm:text-base text-cream-200/90 leading-relaxed">
            GLC is the annual flagship leadership conference hosted at MAHE Bengaluru. Across past editions, the conference has convened Fortune 500 decision-makers, startup founders, and academic leaders to address key strategic challenges.
          </p>
        </div>

        {/* High-Impact Cumulative Stats Banner with CountingNumber */}
        <div className="mb-14 p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-[#180514]/90 via-[#10020D]/90 to-[#0A0108]/90 border border-wine-800/80 shadow-2xl">
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            {CUMULATIVE_PAST_STATS.map((stat, idx) => (
              <div key={stat.label} className={`text-center ${idx > 0 ? 'sm:border-l sm:border-wine-800/60' : ''}`}>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#ffc5b6]">
                  <CountingNumber target={stat.target} />
                  <span className="text-glc-orange">{stat.suffix}</span>
                </div>
                <p className="mt-2 text-xs sm:text-sm font-medium text-cream-300 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Video Showcase Component */}
        <VideoShowcase />
      </div>

      {/* Seamless 3D Scroll-Driven Photography Journey */}
      <PastGlcGallery3D />
    </section>
  )
}
