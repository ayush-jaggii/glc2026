'use client'

import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { LiquidButton } from '@/components/ui/liquid-glass-button'

export default function DelegateAdvantage() {
  const advantages = [
    {
      num: "01",
      title: "C-Suite & Boardroom Intelligence",
      description: "Direct off-the-record keynotes and closed-door panel discussions with 40+ Managing Directors, Chief Strategy Officers, and GCC Country Heads.",
      stat: "40+ C-SUITE SPEAKERS"
    },
    {
      num: "02",
      title: "Global GCC & Trade Networking",
      description: "Engage with 850+ executive delegates spanning global technology hubs, investment banking, automotive OEMs, and supply chain enterprises.",
      stat: "850+ DELEGATES"
    },
    {
      num: "03",
      title: "Actionable Geopolitical Strategy",
      description: "Acquire real-world frameworks on navigating supply chain realignments, currency volatility, and cross-border regulatory shifts.",
      stat: "5 CORE TRACKS"
    },
    {
      num: "04",
      title: "TAPMI & MAHE Executive Certification",
      description: "Official Delegate Credential from TAPMI Bengaluru (AACSB & AMBA Accredited) and Manipal Academy of Higher Education (Institution of Eminence).",
      stat: "OFFICIAL CERTIFICATION"
    }
  ]

  return (
    <section id="advantage" className="py-24 relative bg-slate-50/80 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Sticky Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <span className="text-xs font-mono text-brand-pink uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
              <span className="w-2.5 h-[2px] bg-brand-pink"></span>
              DELEGATE VALUE PROPOSITION
            </span>
            
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 font-serif mb-6 leading-tight">
              WHY ATTEND <br />
              <span className="text-brand-orange italic font-serif font-normal">GLC 2026?</span>
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed font-sans mb-8 max-w-md">
              Designed specifically for senior corporate executives, policy makers, founders, and academic researchers seeking strategic clarity in an era of global volatility.
            </p>

            <a href="#register">
              <LiquidButton size="xl" className="bg-brand-orange text-white font-mono font-bold text-xs uppercase tracking-wider">
                <span>SECURE YOUR PASS</span>
                <ArrowUpRight className="w-4 h-4" />
              </LiquidButton>
            </a>
          </div>

          {/* Right Editorial Value Propositions List */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {advantages.map((adv) => (
              <div
                key={adv.num}
                className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex items-start justify-between gap-6 mb-4">
                  <span className="text-2xl font-mono font-bold text-slate-300 group-hover:text-brand-orange transition-colors">
                    {adv.num}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-brand-pink uppercase tracking-widest px-2.5 py-1 rounded bg-brand-pink/10 border border-brand-pink/20">
                    {adv.stat}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 font-serif group-hover:text-brand-orange transition-colors">
                  {adv.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                  {adv.description}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  )
}
