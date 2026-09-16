'use client'

import React, { useState } from 'react'
import { PANELS_LIST, PanelSchema } from '@/data/eventData'
import { Layers, ChevronRight, HelpCircle, Lock } from 'lucide-react'

export default function PanelReveal() {
  const [activePanelId, setActivePanelId] = useState<string>(PANELS_LIST[0].id)
  const activePanel = PANELS_LIST.find((p) => p.id === activePanelId) || PANELS_LIST[0]

  return (
    <div id="panels" className="relative mt-20 pt-16 border-t border-wine-900/60">
      
      {/* Section Header */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm text-xs font-semibold tracking-widest uppercase bg-wine-900 text-glc-orange border border-wine-700 mb-4">
          <Layers className="w-3.5 h-3.5" />
          <span>Curated Symposia</span>
        </div>
        <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream-50 uppercase mb-4">
          THE 5 STRATEGIC VERTICALS
        </h3>
        <p className="text-sm sm:text-base text-cream-200/90 leading-relaxed">
          Five focused panel symposia interrogating how multinational enterprise networks, capital, and leadership models withstand geopolitical fracturing.
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
                  <span className={`font-mono text-xs font-bold px-2 py-1 rounded-sm ${
                    isSelected ? 'bg-glc-magenta text-white' : 'bg-wine-800 text-cream-400'
                  }`}>
                    {panel.number}
                  </span>
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-glc-orange mb-0.5">
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

        {/* Right Column: Deep Strategic Details of Selected Track */}
        <div className="lg:col-span-7">
          <div className="bg-[#13030F] rounded-xl p-7 sm:p-9 border border-wine-800 shadow-2xl relative">
            
            <div className="flex items-center justify-between gap-4 mb-5 pb-5 border-b border-wine-800/80">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-glc-magenta">
                <span>Symposium {activePanel.number}</span>
                <span>·</span>
                <span className="text-cream-300">{activePanel.category}</span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-glc-orange bg-wine-900 px-3 py-1 rounded-sm border border-wine-700">
                <Lock className="w-3 h-3" />
                <span>Panelists Locked</span>
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

            {/* Strategic Interrogation Questions */}
            <div className="rounded-2xl p-5 bg-wine-950/80 border border-wine-800/80 mb-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-cream-300 mb-3 flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-glc-pink" />
                <span>Core Strategic Interrogations</span>
              </div>
              <ul className="space-y-2.5">
                {activePanel.keyQuestions.map((q, qIdx) => (
                  <li key={qIdx} className="text-xs text-cream-300 flex items-start gap-2.5">
                    <span className="text-glc-magenta font-mono font-bold">Q{qIdx + 1}.</span>
                    <span className="leading-relaxed">{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Panel Metadata Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-4 border-t border-wine-800/80 text-cream-300">
              <div>
                <span className="block text-[10px] uppercase font-mono text-cream-400">Format</span>
                <span className="font-semibold text-cream-100">45-Min Colloquium</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-mono text-cream-400">Roster</span>
                <span className="font-semibold text-cream-100">4 CXOs + 1 Chair</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="block text-[10px] uppercase font-mono text-cream-400">Q&A Audience</span>
                <span className="font-semibold text-cream-100">Open Delegate Floor</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  )
}
