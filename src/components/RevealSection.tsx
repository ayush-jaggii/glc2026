'use client'

import React, { useState } from 'react'
import { PANELS_PREVIEW, EVENT_DETAILS } from '@/data/eventData'
import { Lock, Eye, Sparkles, ChevronRight, HelpCircle } from 'lucide-react'
import { MagicTextReveal } from '@/components/ui/magic-text-reveal'
import CountdownTimer from '@/components/CountdownTimer'

export default function RevealSection() {
  const [activeTab, setActiveTab] = useState<'panels' | 'speakers'>('panels')

  return (
    <section id="reveals" className="py-24 relative bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-slate-200">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono text-brand-orange uppercase tracking-widest font-bold flex items-center gap-2">
              <span className="w-2.5 h-[2px] bg-brand-orange"></span>
              CONFIDENTIAL PROGRAMME SCHEDULE
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
              <span className="text-xs font-bold text-slate-900 font-serif uppercase">CONFIDENTIAL UNTIL SEPTEMBER 15, 2026</span>
              <span className="text-xs text-slate-500 font-mono">Hover over particle clouds to reveal confidential panel titles & session questions</span>
            </div>
          </div>

          <div className="w-full md:w-auto">
            <CountdownTimer targetDate={EVENT_DETAILS.revealTargetIso} />
          </div>
        </div>

        {/* Tab 1: 5 Panel Tracks with Slow Magic Particle Reveals */}
        {activeTab === 'panels' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PANELS_PREVIEW.map((panel) => (
              <div
                key={panel.id}
                className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono font-bold text-brand-orange bg-brand-orange/10 px-2.5 py-1 rounded border border-brand-orange/20">
                      PANEL {panel.number}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                      HOVER TO UNVEIL
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500 font-bold uppercase block mb-2 tracking-wider">
                    {panel.category}
                  </span>

                  {/* Magic Particle Text Reveal for Confidential Panel Title (Slow Motion) */}
                  <div className="my-4 flex items-center justify-center">
                    <MagicTextReveal
                      text={panel.title}
                      color="#F58232"
                      fontSize={22}
                      fontFamily="Sabon LT Std, Georgia, serif"
                      fontWeight={700}
                      spread={30}
                      speed={0.2}
                      density={4}
                    />
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
                  <span>STATUS</span>
                  <span className="text-brand-orange font-bold flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    HOVER UNLOCKED
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: 35+ Confidential C-Suite Speakers with Slow Magic Particle Reveals */}
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
                className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between items-center text-center group"
              >
                <div className="w-full flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mb-6 text-brand-orange">
                    <Lock className="w-6 h-6" />
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider mb-2">
                    CONFIDENTIAL SPEAKER #{idx + 1}
                  </span>

                  {/* Magic Particle Text Reveal for Speaker Title (Slow Motion) */}
                  <div className="my-3 flex items-center justify-center">
                    <MagicTextReveal
                      text={sp.role}
                      color="#0F172A"
                      fontSize={16}
                      fontFamily="Helvetica Now, Arial, sans-serif"
                      fontWeight={700}
                      spread={20}
                      speed={0.2}
                    />
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
