'use client'

import React, { useState } from 'react'
import { PANELS_LIST } from '@/data/eventData'
import { ChevronRight, HelpCircle } from 'lucide-react'

export default function PanelReveal() {
  const [activePanelId, setActivePanelId] = useState<string>(PANELS_LIST[0].id)
  const activePanel = PANELS_LIST.find((p) => p.id === activePanelId) || PANELS_LIST[0]

  return (
    <div id="panels" className="relative mt-20 pt-16 border-t border-wine-900/60 scroll-mt-24">
      {/* Hidden anchor target for backwards compatibility */}
      <span id="symposia" className="absolute -top-24 pointer-events-none" />
      
      {/* Section Header */}
      <div className="max-w-3xl mb-12">
        <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream-50 uppercase mb-4">
          Panels
        </h3>
        <p className="text-sm sm:text-base text-cream-200/90 leading-relaxed">
          Five focused panels exploring multinational enterprise strategies, global capability centers, capital convergence, and economic resilience across borders.
        </p>
      </div>

      {/* Two Column Interactive Track Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Vertical Track Selector */}
        <div className="lg:col-span-5 space-y-3">
          {PANELS_LIST.map((panel) => {
            const isSelected = panel.id === activePanelId
            return (
              <button
                key={panel.id}
                onClick={() => setActivePanelId(panel.id)}
                type="button"
                className={`w-full text-left p-5 rounded-xl transition-colors duration-200 border flex items-center justify-between group ${
                  isSelected
                    ? 'bg-[#1A0515] border-wine-700 shadow-lg'
                    : 'bg-[#11030D] border-wine-800/80 hover:bg-[#160412] hover:border-wine-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-sm ${
                    isSelected ? 'bg-glc-magenta text-white' : 'bg-wine-800 text-cream-400'
                  }`}>
                    {panel.number}
                  </span>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-glc-orange mb-0.5 font-medium">
                      {panel.category}
                    </div>
                    <div className="text-sm sm:text-base font-bold text-cream-100 group-hover:text-white">
                      {panel.title}
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                  isSelected ? 'text-glc-magenta translate-x-1' : 'text-cream-400 opacity-40 group-hover:opacity-100'
                }`} />
              </button>
            )
          })}
        </div>

        {/* Right Column: Details of Selected Track */}
        <div className="lg:col-span-7">
          <div className="bg-[#13030F] rounded-xl p-7 sm:p-9 border border-wine-800 shadow-2xl relative">
            
            <div className="flex items-center justify-between gap-4 mb-5 pb-5 border-b border-wine-800/80">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-glc-magenta font-semibold">
                <span>Panel {activePanel.number}</span>
                <span>·</span>
                <span className="text-cream-300 font-normal">{activePanel.category}</span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-cream-300 bg-wine-900 px-3 py-1 rounded-sm border border-wine-700">
                <span>Confirmed Theme</span>
              </span>
            </div>

            <h4 className="text-2xl sm:text-3xl font-bold text-cream-50 mb-2">
              {activePanel.title}
            </h4>
            <div className="text-xs sm:text-sm font-medium text-glc-orange mb-6">
              {activePanel.subtitle}
            </div>

            <p className="text-sm text-cream-200/90 leading-relaxed mb-8">
              {activePanel.description}
            </p>

            {/* Discussion Themes */}
            <div className="rounded-2xl p-5 bg-wine-950/80 border border-wine-800/80 mb-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-cream-300 mb-3 flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-glc-pink" />
                <span>Key Discussion Themes</span>
              </div>
              <ul className="space-y-2.5">
                {activePanel.keyQuestions.map((q, qIdx) => (
                  <li key={qIdx} className="text-xs text-cream-300 flex items-start gap-2.5">
                    <span className="text-glc-magenta font-bold">Q{qIdx + 1}.</span>
                    <span className="leading-relaxed">{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Panel Information */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-4 border-t border-wine-800/80 text-cream-300">
              <div>
                <span className="block text-[10px] uppercase font-semibold tracking-wider text-cream-400 mb-0.5">Format</span>
                <span className="font-semibold text-cream-100">45-Minute Session</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-semibold tracking-wider text-cream-400 mb-0.5">Panel</span>
                <span className="font-semibold text-cream-100">Industry Leaders & Chair</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="block text-[10px] uppercase font-semibold tracking-wider text-cream-400 mb-0.5">Audience</span>
                <span className="font-semibold text-cream-100">Open Delegate Floor Q&A</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  )
}
