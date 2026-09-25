'use client'

import React from 'react'

export default function KeynoteReveal() {
  return (
    <section id="keynote" className="relative scroll-mt-24">
      {/* Section Header */}
      <div className="max-w-3xl mb-8 sm:mb-12">
        <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream-50 uppercase">
          Keynote Speaker
        </h3>
      </div>

      {/* Minimalist Teaser Card */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#180415] via-[#0E020C] to-[#080006] border border-wine-800/80 p-8 sm:p-14 flex flex-col items-center justify-center text-center shadow-xl">
        {/* Soft atmospheric ambient glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-glc-magenta/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-glc-orange/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Silhouette Portrait Card */}
          <div className="relative w-48 sm:w-56 aspect-[3/4] rounded-2xl overflow-hidden border border-wine-700/60 bg-[#0B0209] shadow-2xl mb-6 flex items-end justify-center">
            <svg
              viewBox="0 0 240 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto drop-shadow-[0_0_20px_rgba(244,81,151,0.25)]"
            >
              <defs>
                <radialGradient id="keynoteHalo" cx="50%" cy="40%" r="50%">
                  <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.35" />
                  <stop offset="50%" stopColor="#F45197" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#0B0207" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="silhouetteRim" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#F45197" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#340C29" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="silhouetteDark" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#1B0615" />
                  <stop offset="100%" stopColor="#080106" />
                </linearGradient>
              </defs>

              {/* Soft Radial Ambient Aura behind head */}
              <circle cx="120" cy="105" r="75" fill="url(#keynoteHalo)" />

              {/* Head Silhouette */}
              <path
                d="M 120 48 C 96 48 86 66 86 98 C 86 128 98 150 120 150 C 142 150 154 128 154 98 C 154 66 144 48 120 48 Z"
                fill="url(#silhouetteDark)"
                stroke="url(#silhouetteRim)"
                strokeWidth="1.5"
              />

              {/* Neck */}
              <path
                d="M 108 142 L 108 175 L 132 175 L 132 142 Z"
                fill="url(#silhouetteDark)"
              />

              {/* Shoulders & Torso */}
              <path
                d="M 108 175 
                   C 96 178 72 192 48 220 
                   C 28 244 15 272 8 300 
                   L 232 300 
                   C 225 272 212 244 192 220 
                   C 168 192 144 178 132 175 
                   Z"
                fill="url(#silhouetteDark)"
                stroke="url(#silhouetteRim)"
                strokeWidth="1.5"
              />

              {/* Subtle Minimalist Lapel Cut */}
              <path
                d="M 108 175 L 120 235 L 132 175"
                stroke="url(#silhouetteRim)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Clean, Bold Headline */}
          <h4 className="text-2xl sm:text-4xl font-extrabold text-cream-50 uppercase tracking-tight">
            Revealing Soon
          </h4>
        </div>
      </div>
    </section>
  )
}
