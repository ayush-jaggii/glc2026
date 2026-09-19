'use client'

import React from 'react'
import { PANELS_LIST } from '@/data/eventData'
import { Layers } from 'lucide-react'

export default function PanelReveal() {
  const topPanels = PANELS_LIST.slice(0, 2)
  const bottomPanels = PANELS_LIST.slice(2, 5)

  return (
    <div id="panels" className="relative mt-24 pt-16 border-t border-wine-900/60 scroll-mt-24">
      {/* Hidden anchor target for backwards compatibility */}
      <span id="symposia" className="absolute -top-24 pointer-events-none" />
      
      {/* Section Header */}
      <div className="max-w-3xl mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm text-xs font-semibold tracking-widest uppercase bg-wine-900 text-glc-magenta border border-wine-700 mb-3">
          <Layers className="w-3.5 h-3.5 text-glc-orange" />
          <span>Strategic Themes</span>
        </div>
        <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream-50 uppercase mb-4">
          Panels
        </h3>
        <p className="text-sm sm:text-base text-cream-200/90 leading-relaxed">
          Five focused tracks exploring multinational enterprise strategies, global capability centers, capital convergence, and cross-border innovation.
        </p>
      </div>

      {/* 5-Panel Editorial Multi-Track Grid */}
      <div className="space-y-6 sm:space-y-8">
        
        {/* Row 1: 2 Major Flagship Panels (2 x col-span-6) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {topPanels.map((panel) => (
            <div
              key={panel.id}
              className="lg:col-span-6 rounded-2xl p-7 sm:p-9 bg-gradient-to-br from-[#180515]/95 via-[#11030E]/95 to-[#0A0108]/95 border border-wine-800/80 hover:border-glc-magenta/60 shadow-xl hover:shadow-[0_12px_36px_-10px_rgba(244,81,151,0.25)] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Top Track Pill & Number */}
                <div className="flex items-center justify-between gap-4 mb-5">
                  <span className="text-xs font-bold px-3 py-1 rounded-sm bg-wine-900 text-glc-magenta border border-wine-700 tracking-wider">
                    PANEL {panel.number}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-glc-orange font-semibold">
                    {panel.category}
                  </span>
                </div>

                {/* Panel Title & Subtitle */}
                <h4 className="text-2xl sm:text-3xl font-bold text-cream-50 group-hover:text-white transition-colors mb-2">
                  {panel.title}
                </h4>
                <div className="text-xs sm:text-sm font-medium text-glc-pink/95 mb-4">
                  {panel.subtitle}
                </div>

                {/* Synopsis */}
                <p className="text-xs sm:text-sm text-cream-200/90 leading-relaxed mb-6">
                  {panel.description}
                </p>
              </div>

              {/* Discussion Themes */}
              <div className="pt-5 border-t border-wine-800/70 mt-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-cream-300/80 mb-2.5">
                  Core Discussion Themes
                </div>
                <ul className="space-y-2">
                  {panel.keyQuestions.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-cream-200/90 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-glc-orange shrink-0 mt-1.5" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: 3 Focused Industry Panels (3 x col-span-4) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8">
          {bottomPanels.map((panel, idx) => (
            <div
              key={panel.id}
              className={`${idx === 2 ? 'md:col-span-2 lg:col-span-4' : 'lg:col-span-4'} rounded-2xl p-7 sm:p-8 bg-gradient-to-br from-[#180515]/95 via-[#11030E]/95 to-[#0A0108]/95 border border-wine-800/80 hover:border-glc-magenta/60 shadow-xl hover:shadow-[0_12px_36px_-10px_rgba(244,81,151,0.25)] transition-all duration-300 flex flex-col justify-between group`}
            >
              <div>
                {/* Top Track Pill & Number */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-sm bg-wine-900 text-glc-magenta border border-wine-700 tracking-wider">
                    PANEL {panel.number}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-glc-orange font-semibold truncate">
                    {panel.category}
                  </span>
                </div>

                {/* Panel Title & Subtitle */}
                <h4 className="text-xl sm:text-2xl font-bold text-cream-50 group-hover:text-white transition-colors mb-2">
                  {panel.title}
                </h4>
                <div className="text-xs font-medium text-glc-pink/95 mb-4">
                  {panel.subtitle}
                </div>

                {/* Synopsis */}
                <p className="text-xs text-cream-200/90 leading-relaxed mb-6">
                  {panel.description}
                </p>
              </div>

              {/* Discussion Themes */}
              <div className="pt-4 border-t border-wine-800/70 mt-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-cream-300/80 mb-2">
                  Core Discussion Themes
                </div>
                <ul className="space-y-1.5">
                  {panel.keyQuestions.map((q, qIdx) => (
                    <li key={qIdx} className="flex items-start gap-2 text-xs text-cream-200/90 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-glc-orange shrink-0 mt-1.5" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
