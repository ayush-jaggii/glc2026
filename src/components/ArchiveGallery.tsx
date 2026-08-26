'use client'

import React from 'react'
import { ARCHIVE_EDITIONS } from '@/data/eventData'
import { Award, ChevronRight } from 'lucide-react'

const YT_VIDEO_ID = "sGkYVVQqLQQ"

export default function ArchiveGallery() {
  const activeEdition = ARCHIVE_EDITIONS[0] // GLC 3.0 (Last Year's Official Edition)

  return (
    <section id="archive" className="py-24 relative bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-slate-200">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono text-brand-orange uppercase tracking-widest font-bold flex items-center gap-2">
              <span className="w-2.5 h-[2px] bg-brand-orange"></span>
              CREDIBILITY & ARCHIVAL REEL
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">
              PAST GLC EDITION
            </h2>
          </div>

          <p className="text-sm text-slate-600 max-w-md font-normal leading-relaxed">
            A legacy of executive dialogue bringing together CXOs, academic fellows, and global capability leads at TAPMI Bengaluru.
          </p>
        </div>

        {/* Archival Detailed View Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Direct Native Embedded YouTube Video Player (Zero Overlay Clutter) */}
          <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200 p-4 md:p-5 flex flex-col justify-between relative overflow-hidden shadow-sm">
            
            <div className="w-full aspect-video rounded-xl bg-slate-950 border border-slate-200 relative overflow-hidden">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${YT_VIDEO_ID}?rel=0&modestbranding=1`}
                title="TAPMI Global Leadership Conference Archival Reel"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="pt-5 px-1">
              <div className="flex items-center gap-2 text-xs font-mono text-brand-orange font-bold uppercase mb-1">
                <span>{activeEdition.edition}</span>
                <span>•</span>
                <span>{activeEdition.year}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {activeEdition.theme}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeEdition.summary}
              </p>
            </div>

          </div>

          {/* Right: Stats & Highlights Box */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Key Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              {activeEdition.stats.map((stat, i) => (
                <div key={i} className="p-5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-brand-orange font-mono">
                      {stat.value}
                    </span>
                    <span className="text-xs text-slate-500 font-mono tracking-wide uppercase pt-1 font-semibold">
                      {stat.label}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-brand-orange/10 text-brand-orange">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
              ))}
            </div>

            {/* Highlights List */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 flex-1 flex flex-col justify-between shadow-xs">
              <span className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider mb-4 block border-b border-slate-100 pb-2">
                KEY SESSION HIGHLIGHTS
              </span>

              <div className="space-y-3">
                {activeEdition.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs text-slate-800 font-medium">
                    <ChevronRight className="w-4 h-4 text-brand-orange flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                <span>ESTABLISHED AT TAPMI</span>
                <span className="text-brand-orange font-bold">MAHE BENGALURU</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
