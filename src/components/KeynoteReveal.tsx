'use client'

import React from 'react'

const ArrowUpRightIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
)

const LockIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const SparkleIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
)

const MicIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
)

export default function KeynoteReveal() {
  return (
    <section id="keynote" className="relative scroll-mt-24">
      {/* Outer Card with layered glow & borders */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#1C051A] via-[#10020E] to-[#070006] border border-wine-800/90 shadow-[0_20px_70px_rgba(244,81,151,0.12)] p-6 sm:p-10 lg:p-14 overflow-hidden">
        
        {/* Background Atmospheric Glows */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[340px] bg-gradient-to-b from-glc-magenta/20 via-glc-orange/15 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-glc-magenta/15 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-glc-orange/15 blur-3xl pointer-events-none rounded-full" />

        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-60" />

        {/* Top Status Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-8 mb-8 border-b border-wine-800/70">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-wine-900/80 border border-glc-magenta/40 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-glc-orange opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-glc-orange" />
            </span>
            <span className="text-xs font-semibold tracking-wider uppercase text-cream-100">
              Plenary Keynote Address
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-wine-950/80 border border-wine-700/60 text-xs font-medium text-cream-300">
            <LockIcon className="w-3.5 h-3.5 text-glc-orange" />
            <span className="tracking-wide uppercase text-[11px] text-glc-orange font-semibold">
              Announcement Imminent
            </span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Information */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-glc-orange font-semibold text-xs tracking-widest uppercase">
                <SparkleIcon className="w-3.5 h-3.5 text-glc-magenta" />
                <span>Conference Inauguration</span>
              </div>
              <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream-50 uppercase leading-none">
                THE KEYNOTE SPEAKER
              </h3>
              <p className="text-lg sm:text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-glc-orange via-glc-pink to-cream-100">
                A Global Luminary Defining Leadership Beyond Borders
              </p>
            </div>

            <p className="text-sm sm:text-base text-cream-300/90 leading-relaxed max-w-2xl font-light">
              The pinnacle opening address of GLC 2026 will be delivered by an internationally distinguished leader whose transformative footprint shapes modern global enterprise. Setting the strategic paradigm for all symposia, this inaugural plenary will explore resilience, technological sovereignty, and cross-border leadership.
            </p>

            {/* Micro spec cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-wine-900/40 border border-wine-800/80">
                <span className="text-[10px] uppercase font-semibold text-glc-orange block tracking-wider mb-1">
                  Format
                </span>
                <span className="text-xs text-cream-100 font-medium leading-snug block">
                  Presidential Plenary & Fireside
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-wine-900/40 border border-wine-800/80">
                <span className="text-[10px] uppercase font-semibold text-glc-magenta block tracking-wider mb-1">
                  Topic
                </span>
                <span className="text-xs text-cream-100 font-medium leading-snug block">
                  Leading Across Fractured Borders
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-wine-900/40 border border-wine-800/80">
                <span className="text-[10px] uppercase font-semibold text-cream-400 block tracking-wider mb-1">
                  Status
                </span>
                <span className="text-xs text-glc-orange font-medium leading-snug block flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-glc-orange inline-block" />
                  Revealing Soon
                </span>
              </div>
            </div>

            {/* CTA Row */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-glc-orange to-glc-magenta text-wine-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all duration-200 shadow-[0_8px_24px_rgba(245,130,50,0.3)]"
              >
                <span>Reserve Delegate Seat</span>
                <ArrowUpRightIcon className="w-4 h-4" />
              </a>

              <span className="text-xs text-cream-400/80 italic">
                Exclusive seating reserved for registered delegates
              </span>
            </div>
          </div>

          {/* Right Column: Visual Teaser / Silhouette Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[4/5] rounded-2xl overflow-hidden border border-wine-700/80 bg-gradient-to-b from-[#1c051a] via-[#10020e] to-[#070005] p-1 shadow-[0_15px_45px_rgba(0,0,0,0.7)] group">
              
              {/* Inner card viewport */}
              <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-[#0A0108] flex flex-col items-center justify-end">
                
                {/* Stage Spotlight from top */}
                <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-glc-orange/20 via-glc-magenta/15 to-transparent pointer-events-none" />
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-glc-orange/30 blur-2xl rounded-full pointer-events-none" />

                {/* Animated Radial Pulse Rings */}
                <div className="absolute top-28 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-glc-magenta/25 animate-ping opacity-25 pointer-events-none" />
                <div className="absolute top-28 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border border-glc-orange/30 pointer-events-none" />

                {/* Glowing Holographic Silhouette SVG */}
                <div className="relative z-10 w-full h-full flex items-end justify-center pointer-events-none pb-4">
                  <svg
                    viewBox="0 0 320 380"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[90%] h-auto max-h-[340px] drop-shadow-[0_0_25px_rgba(244,81,151,0.35)]"
                  >
                    <defs>
                      {/* Rim Light Gradient */}
                      <linearGradient id="keynoteRim" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FF7A00" />
                        <stop offset="50%" stopColor="#F45197" />
                        <stop offset="100%" stopColor="#5B0C38" />
                      </linearGradient>

                      {/* Silhouette Body Gradient */}
                      <linearGradient id="bodyDark" x1="50%" y1="0%" x2="50%" y2="100%">
                        <stop offset="0%" stopColor="#1a0416" />
                        <stop offset="45%" stopColor="#0d020c" />
                        <stop offset="100%" stopColor="#050005" />
                      </linearGradient>

                      {/* Spotlight beam */}
                      <radialGradient id="spotAura" cx="50%" cy="30%" r="50%">
                        <stop offset="0%" stopColor="#F58232" stopOpacity="0.45" />
                        <stop offset="40%" stopColor="#F45197" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#0B0207" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Aura behind head */}
                    <circle cx="160" cy="115" r="75" fill="url(#spotAura)" />

                    {/* Speaker Head / Hair Silhouette */}
                    <path
                      d="M160 55 C135 55 125 72 125 105 C125 138 140 162 160 162 C180 162 195 138 195 105 C195 72 185 55 160 55 Z"
                      fill="url(#bodyDark)"
                      stroke="url(#keynoteRim)"
                      strokeWidth="1.75"
                    />

                    {/* Neck */}
                    <path
                      d="M147 150 L147 185 L173 185 L173 150 Z"
                      fill="url(#bodyDark)"
                    />

                    {/* Executive Torso & Shoulders */}
                    <path
                      d="M147 185 
                         C132 187 100 200 70 230 
                         C48 252 35 285 25 350 
                         L295 350 
                         C285 285 272 252 250 230 
                         C220 200 188 187 173 185 
                         L160 215 
                         Z"
                      fill="url(#bodyDark)"
                      stroke="url(#keynoteRim)"
                      strokeWidth="1.5"
                    />

                    {/* Suit Lapel Highlights */}
                    <path
                      d="M147 185 L156 250 L160 270 L164 250 L173 185"
                      stroke="url(#keynoteRim)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M130 200 L156 255"
                      stroke="#FF7A00"
                      strokeWidth="1.25"
                      strokeOpacity="0.8"
                    />
                    <path
                      d="M190 200 L164 255"
                      stroke="#F45197"
                      strokeWidth="1.25"
                      strokeOpacity="0.8"
                    />

                    {/* Podium / Microphone on Stage */}
                    <g opacity="0.9">
                      <path
                        d="M100 270 Q105 210 135 175"
                        stroke="#FF7A00"
                        strokeWidth="2"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <circle cx="137" cy="172" r="5" fill="#FF7A00" />
                      <circle cx="137" cy="172" r="8" stroke="#FF7A00" strokeWidth="1" opacity="0.6" />
                    </g>
                  </svg>
                </div>

                {/* Shimmer sweep effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                {/* Floating "Revealing Soon" Badge */}
                <div className="absolute inset-x-4 bottom-5 z-20">
                  <div className="backdrop-blur-md bg-wine-950/85 border border-glc-magenta/40 rounded-xl p-3.5 text-center shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
                    <div className="flex items-center justify-center gap-1.5 text-glc-orange mb-1">
                      <LockIcon className="w-3.5 h-3.5" />
                      <span className="text-[10px] tracking-widest font-extrabold uppercase">
                        Confidential Embargo
                      </span>
                    </div>
                    <div className="text-base sm:text-lg font-extrabold tracking-wider text-cream-50 uppercase">
                      Revealing Soon
                    </div>
                    <p className="text-[11px] text-cream-300/80 mt-0.5 font-normal">
                      Official Announcement Dropping Shortly
                    </p>
                  </div>
                </div>

                {/* Top Corner Teaser Tag */}
                <div className="absolute top-3.5 right-3.5 z-20">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-wine-900/90 border border-wine-700/80 text-[10px] font-bold uppercase tracking-wider text-glc-pink">
                    <MicIcon className="w-3 h-3 text-glc-orange" />
                    Keynote 2026
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
