'use client'

import React from 'react'
import { TapmiLogo, MaheLogo, AccredationsLogo, PaceLogo } from './Logos'

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

        {/* Right: Accreditations Logo Bar & Official TAPMI PACE Committee Logo */}
        <div className="flex flex-wrap items-center gap-6 md:gap-8">
          <AccredationsLogo className="h-7 md:h-8 w-auto" />
          <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />
          <div className="flex items-center gap-2.5">
            <PaceLogo className="h-10 md:h-11 w-auto" />
            <span className="hidden xl:inline text-[11px] font-mono text-slate-700 font-bold uppercase tracking-wider">
              PACE COMMITTEE
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}
