'use client'

import React from 'react'

export default function KeynoteReveal() {
  return (
    <section id="keynote" className="relative scroll-mt-24">
      {/* Section Header */}
      <div className="max-w-3xl mb-8 sm:mb-12">
        <h3 className="font-tektype text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-cream-50 uppercase drop-shadow-lg">
          Keynote Speaker
        </h3>
      </div>

      {/* Cinematic Stage Viewport */}
      <div className="relative group rounded-3xl overflow-hidden bg-gradient-to-b from-[#160214] via-[#0A0109] to-[#030003] border border-wine-800/80 hover:border-glc-magenta/50 transition-all duration-700 shadow-2xl hover:shadow-[0_20px_80px_rgba(244,81,151,0.22)] flex flex-col items-center justify-between pt-10 sm:pt-14 pb-8 sm:pb-12 px-4 sm:px-8">
        
        {/* Top Ambient Overhead Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 sm:w-2/3 h-48 bg-gradient-to-b from-glc-orange/20 via-glc-magenta/15 to-transparent blur-3xl pointer-events-none rounded-full" />
        
        {/* Corner Ambient Mood Lights */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-glc-magenta/10 blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 w-72 h-72 bg-glc-orange/10 blur-3xl pointer-events-none" />

        {/* The Cinematic Silhouette Artwork */}
        <div className="relative z-10 w-full flex items-center justify-center">
          <svg
            viewBox="0 0 500 520"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-[360px] sm:max-w-[420px] h-auto select-none pointer-events-none drop-shadow-[0_0_35px_rgba(244,81,151,0.3)] group-hover:drop-shadow-[0_0_55px_rgba(245,130,50,0.45)] transition-all duration-700"
          >
            <defs>
              {/* Volumetric Stage Spotlight Beams */}
              <linearGradient id="spotlightLeft" x1="50%" y1="0%" x2="20%" y2="100%">
                <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.32" />
                <stop offset="60%" stopColor="#FF7A00" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#0B0207" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="spotlightRight" x1="50%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#F45197" stopOpacity="0.32" />
                <stop offset="60%" stopColor="#F45197" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#0B0207" stopOpacity="0" />
              </linearGradient>

              {/* Dual-color Rim Light Gradients */}
              <linearGradient id="rimAmber" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFA439" stopOpacity="1" />
                <stop offset="45%" stopColor="#FF7A00" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#F45197" stopOpacity="0.4" />
              </linearGradient>

              <linearGradient id="rimMagenta" x1="100%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6BB5" stopOpacity="1" />
                <stop offset="45%" stopColor="#F45197" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#FF7A00" stopOpacity="0.4" />
              </linearGradient>

              {/* Ambient Stage Halo behind head */}
              <radialGradient id="haloStage" cx="50%" cy="30%" r="48%">
                <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.42" />
                <stop offset="35%" stopColor="#F45197" stopOpacity="0.25" />
                <stop offset="70%" stopColor="#3D0D30" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#0B0207" stopOpacity="0" />
              </radialGradient>

              {/* Body Dark Gradient Fill */}
              <linearGradient id="bodyGradient" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#180315" />
                <stop offset="40%" stopColor="#0D020B" />
                <stop offset="100%" stopColor="#040003" />
              </linearGradient>

              {/* Filter for glowing rim */}
              <filter id="glowLight" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* 1. Volumetric Overhead Spotlights */}
            <polygon points="220,-20 280,-20 480,520 20,520" fill="url(#spotlightLeft)" />
            <polygon points="280,-20 220,-20 490,520 30,520" fill="url(#spotlightRight)" />

            {/* 2. Ambient Radiant Backlight Halo */}
            <circle cx="250" cy="175" r="135" fill="url(#haloStage)" />

            {/* Concentric Subtle Energy Rings */}
            <circle cx="250" cy="175" r="110" stroke="#FF7A00" strokeWidth="1" strokeDasharray="4 6" opacity="0.3" />
            <circle cx="250" cy="175" r="145" stroke="#F45197" strokeWidth="1" strokeDasharray="3 8" opacity="0.25" />

            {/* 3. The Detailed Silhouette */}
            <g filter="url(#glowLight)">
              {/* Head, Neck, Torso in seamless anatomical executive silhouette */}
              <path
                d="
                  M 250 82
                  C 220 82 202 102 200 135
                  C 198 152 201 168 206 182
                  C 209 191 213 198 217 205
                  C 221 212 225 218 226 226
                  C 214 230 188 242 165 258
                  C 135 278 108 308 88 348
                  C 70 384 56 426 44 472
                  C 38 496 32 515 28 520
                  L 472 520
                  C 468 515 462 496 456 472
                  C 444 426 430 384 412 348
                  C 392 308 365 278 335 258
                  C 312 242 286 230 274 226
                  C 275 218 279 212 283 205
                  C 287 198 291 191 294 182
                  C 299 168 302 152 300 135
                  C 298 102 280 82 250 82
                  Z
                "
                fill="url(#bodyGradient)"
              />

              {/* Left Rim Light Stroke (Amber Glow) */}
              <path
                d="
                  M 250 82
                  C 220 82 202 102 200 135
                  C 198 152 201 168 206 182
                  C 209 191 213 198 217 205
                  C 221 212 225 218 226 226
                  C 214 230 188 242 165 258
                  C 135 278 108 308 88 348
                  C 70 384 56 426 44 472
                  C 38 496 32 515 28 520
                "
                stroke="url(#rimAmber)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Right Rim Light Stroke (Magenta Glow) */}
              <path
                d="
                  M 250 82
                  C 280 82 298 102 300 135
                  C 302 152 299 168 294 182
                  C 291 191 287 198 283 205
                  C 279 212 275 218 274 226
                  C 286 230 312 242 335 258
                  C 365 278 392 308 412 348
                  C 430 384 444 426 456 472
                  C 462 496 468 515 472 520
                "
                stroke="url(#rimMagenta)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Executive Tailored Suit Lapels Accent */}
              <path
                d="M 226 226 L 238 310 L 244 335 L 250 420"
                stroke="url(#rimAmber)"
                strokeWidth="1.75"
                strokeOpacity="0.7"
                strokeLinecap="round"
              />
              <path
                d="M 274 226 L 262 310 L 256 335 L 250 420"
                stroke="url(#rimMagenta)"
                strokeWidth="1.75"
                strokeOpacity="0.7"
                strokeLinecap="round"
              />
              {/* Collar Notch */}
              <path
                d="M 226 226 L 250 275 L 274 226"
                stroke="#FF7A00"
                strokeWidth="1.5"
                strokeOpacity="0.6"
                strokeLinecap="round"
              />
              {/* Tie */}
              <path
                d="M 247 275 L 253 275 L 254 350 L 250 362 L 246 350 Z"
                fill="#FF7A00"
                fillOpacity="0.2"
                stroke="#FF7A00"
                strokeWidth="1"
                strokeOpacity="0.5"
              />
            </g>

            {/* 4. Subtle Floating Dust Motes in Spotlight */}
            <circle cx="190" cy="240" r="1.5" fill="#FFA439" opacity="0.6" />
            <circle cx="310" cy="210" r="1.5" fill="#FF6BB5" opacity="0.6" />
            <circle cx="160" cy="320" r="2" fill="#FFA439" opacity="0.4" />
            <circle cx="340" cy="350" r="1.5" fill="#FF6BB5" opacity="0.5" />
            <circle cx="230" cy="140" r="1" fill="#FFFFFF" opacity="0.7" />
            <circle cx="270" cy="150" r="1.5" fill="#FFFFFF" opacity="0.8" />
          </svg>
        </div>

        {/* Polished Stage Floor Reflection Line */}
        <div className="relative z-10 w-full max-w-md mx-auto h-px bg-gradient-to-r from-transparent via-glc-orange/60 to-transparent my-6 sm:my-8" />

        {/* Revealing Soon Headline in Tektype with Neon Glow */}
        <div className="relative z-10 text-center">
          <h4 className="font-tektype text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[0.16em] sm:tracking-[0.22em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#ffc5b6] via-white to-glc-orange drop-shadow-[0_0_30px_rgba(244,81,151,0.6)] group-hover:drop-shadow-[0_0_45px_rgba(255,122,0,0.7)] transition-all duration-500">
            Revealing Soon
          </h4>
        </div>

      </div>
    </section>
  )
}
