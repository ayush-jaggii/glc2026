'use client'

import React from 'react'
import { TapmiLogo, MaheLogo, AccredationsLogo } from './Logos'

export default function BrandHeader() {
  return (
    <div className="w-full bg-white border-b border-slate-200 py-3.5 px-4 md:px-8 shadow-xs relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Official TAPMI Logo & Official MAHE Bengaluru Logo */}
        <div className="flex flex-wrap items-center gap-6 md:gap-8">
          <TapmiLogo className="h-11 md:h-12 w-auto" />
          <div className="h-10 w-[1px] bg-slate-200 hidden sm:block" />
          <MaheLogo className="h-11 md:h-12 w-auto" />
        </div>

        {/* Right: Accreditations Logo Bar & Committee Tag */}
        <div className="flex flex-wrap items-center gap-6">
          <AccredationsLogo className="h-7 md:h-8 w-auto" />
          <span className="hidden lg:inline text-slate-300">|</span>
          <span className="hidden lg:inline text-[10px] font-mono text-slate-700 font-bold bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            TAPMI PACE COMMITTEE
          </span>
        </div>

      </div>
    </div>
  )
}
