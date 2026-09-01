'use client'

import React, { useState } from 'react'
import { PANELS_PREVIEW, EVENT_DETAILS } from '@/data/eventData'
import { Lock, ChevronRight, HelpCircle } from 'lucide-react'
import CountdownTimer from '@/components/CountdownTimer'

export default function RevealSection() {
  const [activeTab, setActiveTab] = useState<'panels' | 'speakers'>('panels')

  return (
    <section id="reveals" className="py-24 relative bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-slate-200">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono text-brand-pink uppercase tracking-widest font-bold flex items-center gap-2">
              <span className="w-2.5 h-[2px] bg-brand-pink"></span>
              OFFICIAL PROGRAMME SCHEDULE
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 font-serif">
              SPEAKERS & PANELS REVEAL
            </h2>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setActiveTab('panels')}
              className={`px-5 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                activeTab === 'panels'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              5 PANEL TRACKS
            </button>
            <button
              onClick={() => setActiveTab('speakers')}
              className={`px-5 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                activeTab === 'speakers'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              C-SUITE SPEAKERS (35+)
            </button>
          </div>
        </div>

        {/* Countdown Banner */}
        <div className="mb-12 p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-brand-orange/15 text-brand-orange">
              <Lock className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 font-serif uppercase">PROGRAMME ANNOUNCEMENT</span>
              <span className="text-xs text-slate-500 font-mono">Panel topics and speaker lineups will be officially unveiled on September 15, 2026</span>
            </div>
          </div>

          <div className="w-full md:w-auto">
            <CountdownTimer targetDate={EVENT_DETAILS.revealTargetIso} />
          </div>
        </div>

        {/* Tab 1: 5 Panel Tracks with Blurred Overlay & Coming Soon Badge */}
        {activeTab === 'panels' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PANELS_PREVIEW.map((panel) => (
              <div
                key={panel.id}
                className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between relative overflow-hidden group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                    <span className="text-xs font-mono font-bold text-brand-orange bg-brand-orange/10 px-2.5 py-1 rounded border border-brand-orange/20">
                      PANEL {panel.number}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-400" />
                      LOCKED
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500 font-bold uppercase block mb-3 tracking-wider">
                    {panel.category}
                  </span>

                  {/* Blurred Title + Centered Coming Soon Overlay */}
                  <div className="my-6 relative py-4 min-h-[72px] flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200/60 overflow-hidden">
                    {/* Blurred Text */}
                    <div className="filter blur-md select-none pointer-events-none opacity-40 text-slate-900 font-serif font-bold text-xl text-center px-4">
                      {panel.title}
                    </div>

                    {/* Centered Coming Soon Badge */}
                    <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
                      <span className="px-3.5 py-1.5 rounded-full bg-slate-900 text-white font-mono text-[10px] font-bold uppercase tracking-widest shadow-sm">
                        COMING SOON
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal mb-6">
                    {panel.description}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase flex items-center gap-1 mb-2">
                      <HelpCircle className="w-3 h-3 text-brand-orange" />
                      KEY STRATEGIC QUESTIONS
                    </span>
                    {panel.keyQuestions.map((q, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                        <ChevronRight className="w-3.5 h-3.5 text-brand-orange flex-shrink-0 mt-0.5" />
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase font-semibold">
                  <span>UNVEIL DATE</span>
                  <span className="text-slate-900 font-bold">SEPT 15, 2026</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: 35+ C-Suite Speakers with Blurred Overlay & Coming Soon Badge */}
        {activeTab === 'speakers' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { role: "Managing Director & India Head", sector: "Global Capability Centre (GCC)", highlight: "Fortune 500 Enterprise Tech" },
              { role: "Chief Risk & Strategy Officer", sector: "BFSI & Investment Banking", highlight: "Tier-1 Sovereign Wealth Fund" },
              { role: "Global Vice President - Supply Chain", sector: "FMCG & Consumer Brands", highlight: "Multinational Enterprise" },
              { role: "Chief Technology Officer (CTO)", sector: "Electric Mobility & Auto OEM", highlight: "Global EV Manufacturing" },
            ].map((sp, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between items-center text-center relative overflow-hidden"
              >
                <div className="w-full flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mb-6 text-slate-400">
                    <Lock className="w-6 h-6" />
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider mb-3">
                    KEYNOTE SPEAKER #{idx + 1}
                  </span>

                  {/* Blurred Role + Coming Soon Badge */}
                  <div className="my-3 w-full relative py-3 rounded-xl bg-slate-50 border border-slate-200/60 overflow-hidden flex items-center justify-center min-h-[52px]">
                    <div className="filter blur-md opacity-30 select-none pointer-events-none text-xs font-bold text-slate-900 font-sans px-2">
                      {sp.role}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
                      <span className="px-3 py-1 rounded-full bg-slate-900 text-white font-mono text-[9px] font-bold uppercase tracking-widest shadow-xs">
                        COMING SOON
                      </span>
                    </div>
                  </div>

                  <span className="text-xs text-slate-500 font-medium pt-1">{sp.sector}</span>
                  <span className="text-[11px] text-brand-orange font-mono font-bold pt-2">{sp.highlight}</span>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 w-full text-[10px] font-mono text-slate-400 uppercase font-bold">
                  UNVEILS SEPT 15, 2026
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
