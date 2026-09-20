'use client'

import React, { useState } from 'react'
import { ARCHIVE_EDITIONS } from '@/data/eventData'
import VideoShowcase from './VideoShowcase'
import PastGlcGallery3D from './PastGlcGallery3D'
import { History, CheckCircle } from 'lucide-react'
import { CountingNumber } from '@/components/ui/counting-number'

const CUMULATIVE_PAST_STATS = [
  { target: 3, suffix: "", label: "Landmark Editions" },
  { target: 91, suffix: "+", label: "C-Suite Speakers" },
  { target: 2050, suffix: "+", label: "Delegates Convened" },
  { target: 140, suffix: "+", label: "Participating MNCs" },
]

export default function ArchiveGallery() {
  const [selectedEdition, setSelectedEdition] = useState(ARCHIVE_EDITIONS[0])

  return (
    <section id="previous-editions" className="relative py-24 sm:py-32 bg-wine-950 overflow-hidden border-t border-wine-900/60 scroll-mt-24">
      {/* Hidden anchor for backwards compatibility */}
      <span id="archive" className="absolute -top-24 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm text-xs font-semibold tracking-widest uppercase bg-wine-900 text-glc-pink border border-wine-700 mb-4">
            <History className="w-3.5 h-3.5" />
            <span>Conference History</span>
          </div>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Edition Chronology */}
        <div className="mt-2 sm:mt-4">
          
          {/* Edition Selector Tabs */}
          <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {ARCHIVE_EDITIONS.map((ed) => {
              const isCurrent = ed.edition === selectedEdition.edition
              return (
                <button
                  key={ed.edition}
                  onClick={() => setSelectedEdition(ed)}
                  type="button"
                  className={`px-6 py-3 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 shrink-0 border ${
                    isCurrent
                      ? 'bg-gradient-to-r from-glc-magenta to-glc-orange text-white border-transparent shadow-lg shadow-glc-magenta/20 scale-102'
                      : 'bg-wine-900/60 text-cream-300 border-wine-800 hover:text-white hover:bg-wine-800'
                  }`}
                >
                  <span>{ed.edition}</span>
                  <span className="opacity-70 ml-2">({ed.year})</span>
                </button>
              )
            })}
          </div>

          {/* Active Edition Card */}
          <div className="bg-[#13030F] rounded-2xl p-8 sm:p-12 border border-wine-800 shadow-2xl relative overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Edition Metadata & Highlights */}
              <div className="lg:col-span-7">
                <div className="text-xs uppercase tracking-widest text-glc-orange mb-2 font-semibold">
                  Edition {selectedEdition.edition} · {selectedEdition.year}
                </div>
                <h3 className="text-2xl sm:text-4xl font-bold text-cream-50 mb-3">
                  {selectedEdition.theme}
                </h3>
                <div className="text-xs sm:text-sm font-medium text-glc-magenta mb-6">
                  {selectedEdition.tagline}
                </div>

                <p className="text-sm text-cream-200/90 leading-relaxed mb-8">
                  {selectedEdition.summary}
                </p>

                {/* Highlights list */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-cream-300">
                    Key Outcomes
                  </div>
                  {selectedEdition.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs text-cream-200">
                      <CheckCircle className="w-4 h-4 text-glc-orange shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Statistics */}
              <div className="lg:col-span-5 flex flex-col justify-center gap-4">
                <div className="text-xs uppercase tracking-widest text-cream-400 mb-1 font-semibold">
                  Edition Metrics
                </div>
                
                {selectedEdition.stats.map((st, sIdx) => {
                  const numMatch = st.value.match(/(\d+)/)
                  const target = numMatch ? parseInt(numMatch[1], 10) : 0
                  const suffix = st.value.replace(/[\d,]/g, '')

                  return (
                    <div
                      key={`${selectedEdition.edition}-${sIdx}`}
                      className="p-5 rounded-xl bg-[#0E020C] border border-wine-800/80 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs text-cream-300">{st.label}</div>
                      </div>
                      <div className="text-3xl sm:text-4xl text-[#ffc5b6] font-bold">
                        <CountingNumber target={target} />
                        <span className="text-glc-orange">{suffix}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
