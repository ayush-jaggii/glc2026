'use client'

import React, { useState } from 'react'
import { ARCHIVE_EDITIONS } from '@/data/eventData'
import VideoShowcase from './VideoShowcase'
import { Award, History, CheckCircle, ChevronRight } from 'lucide-react'

export default function ArchiveGallery() {
  const [selectedEdition, setSelectedEdition] = useState(ARCHIVE_EDITIONS[0])

  return (
    <section id="archive" className="relative py-24 sm:py-32 bg-wine-950 overflow-hidden border-t border-wine-900/60">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm text-xs font-semibold tracking-widest uppercase bg-wine-900 text-glc-pink border border-wine-700 mb-4">
            <History className="w-3.5 h-3.5" />
            <span>Legacy of Leadership</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream-50 uppercase mb-4">
            INSTITUTIONAL PEDIGREE
          </h2>
          <p className="text-sm sm:text-base text-cream-200/90 leading-relaxed">
            GLC is TAPMI Bengaluru&apos;s annual flagship leadership convergence. Across four editions, the conference has convened Fortune 500 decision-makers, unicorn founders, and academic fellows to address decisive economic inflection points.
          </p>
        </div>

        {/* Cinematic Video Showcase Component */}
        <VideoShowcase />

        {/* Asymmetric Edition Chronology */}
        <div className="mt-16">
          
          {/* Edition Selector Tabs */}
          <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {ARCHIVE_EDITIONS.map((ed) => {
              const isCurrent = ed.edition === selectedEdition.edition
              return (
                <button
                  key={ed.edition}
                  onClick={() => setSelectedEdition(ed)}
                  type="button"
                  className={`px-6 py-3 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 shrink-0 border ${
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

          {/* Active Edition Deep Dive Card */}
          <div className="bg-[#13030F] rounded-xl p-8 sm:p-12 border border-wine-800 shadow-2xl relative overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Edition Metadata & Highlights */}
              <div className="lg:col-span-7">
                <div className="text-xs font-mono uppercase tracking-widest text-glc-orange mb-2">
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
                    Key Historical Outcomes
                  </div>
                  {selectedEdition.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs text-cream-200">
                      <CheckCircle className="w-4 h-4 text-glc-orange shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Verified Statistical Proof */}
              <div className="lg:col-span-5 flex flex-col justify-center gap-4">
                <div className="text-xs font-mono uppercase tracking-widest text-cream-400 mb-1">
                  Validated Impact Metrics
                </div>
                
                {selectedEdition.stats.map((st, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-5 rounded-lg bg-[#0E020C] border border-wine-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs text-cream-300">{st.label}</div>
                    </div>
                    <div className="font-mono text-3xl sm:text-4xl text-[#ffc5b6] font-bold">
                      {st.value}
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
