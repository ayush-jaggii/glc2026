'use client'

import React from 'react'
import { DELEGATE_ADVANTAGES } from '@/data/eventData'
import { ArrowUpRight, ShieldCheck, Building2 } from 'lucide-react'

export default function DelegateAdvantage() {
  return (
    <section id="advantage" className="py-24 relative bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-slate-200">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono text-brand-orange uppercase tracking-widest font-bold flex items-center gap-2">
              <span className="w-2.5 h-[2px] bg-brand-orange"></span>
              EXECUTIVE VALUE PROPOSITION
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">
              DELEGATE ADVANTAGE
            </h2>
          </div>

          <p className="text-sm text-slate-600 max-w-md font-normal leading-relaxed">
            Why enterprise executives, GCC leaders, and management delegates attend GLC 2026 at TAPMI Bengaluru.
          </p>
        </div>

        {/* Advantage Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {DELEGATE_ADVANTAGES.map((adv) => (
            <div
              key={adv.num}
              className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-orange/50 transition-all duration-300 flex flex-col justify-between group shadow-xs hover:shadow-md"
            >
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-bold text-brand-orange">
                    {adv.num}
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-brand-orange group-hover:border-brand-orange/30 transition-colors shadow-xs">
                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-orange transition-colors">
                  {adv.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {adv.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200 flex items-center gap-2 text-xs font-mono text-slate-500 font-semibold">
                <ShieldCheck className="w-4 h-4 text-brand-orange" />
                <span>TAPMI EXECUTIVE STANDARD</span>
              </div>
            </div>
          ))}
        </div>

        {/* Institutional Endorsement Bar */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 border border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-brand-orange/15 border border-brand-orange/20 text-brand-orange">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900">HOSTED BY TAPMI BENGALURU</span>
              <span className="text-xs font-mono text-slate-600">Manipal Academy of Higher Education (MAHE) • Bengaluru Campus</span>
            </div>
          </div>

          <a
            href="#register"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold font-mono tracking-wider uppercase transition-all shadow-md"
          >
            <span>APPLY FOR DELEGATE PASS</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  )
}
