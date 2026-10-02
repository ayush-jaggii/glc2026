'use client'

import React from 'react'
import Image from 'next/image'

interface PartnerLogo {
  name: string
  src: string
  width: number
  height: number
}

const EXHIBITORS: PartnerLogo[] = [
  { name: 'Yoga Bar', src: '/sponsors/yogabar.png', width: 140, height: 60 },
  { name: 'The Belgian Waffle Co', src: '/sponsors/belgian-waffle.svg', width: 140, height: 60 },
  { name: 'SMH', src: '/sponsors/smh.png', width: 140, height: 60 },
  { name: 'Farmley', src: '/sponsors/farmley.jpg', width: 140, height: 60 },
  { name: 'NEXTORK', src: '/sponsors/nextork.jpg', width: 160, height: 60 },
  { name: 'Tazish', src: '/sponsors/tazish.jpeg', width: 160, height: 60 },
  { name: "Snap 'N' Stick", src: '/sponsors/snap-n-stick.svg', width: 150, height: 50 },
  { name: 'The Chatpata Affair', src: '/sponsors/chatpata-affair.webp', width: 150, height: 50 },
  { name: 'Rescript', src: '/sponsors/rescript.svg', width: 150, height: 50 }
]

export default function PartnersSection() {
  return (
    <section id="partners" className="relative py-20 sm:py-28 bg-[#0B0207] border-t border-wine-900/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Clean, Minimal Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream-50 uppercase">
            Our Partners
          </h2>
        </div>

        {/* Minimalist Card Container */}
        <div className="rounded-3xl bg-[#13030F] border border-wine-800/80 p-8 sm:p-12 lg:p-14 shadow-2xl relative backdrop-blur-md">
          
          {/* 1. Digital Media Partner */}
          <div className="flex flex-col items-center justify-center mb-12">
            <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-cream-400 mb-4">
              Digital Media Partner
            </span>
            <div className="bg-white rounded-2xl px-8 py-4 sm:py-5 shadow-lg border border-white/90 flex items-center justify-center transition-transform duration-300 hover:scale-105">
              <div className="relative w-48 sm:w-56 h-14 sm:h-16">
                <Image
                  src="/sponsors/bharat24.png"
                  alt="Bharat 24 - Vision of New India"
                  fill
                  sizes="(max-width: 640px) 192px, 224px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Minimal Divider */}
          <div className="w-20 h-px bg-wine-800/80 mx-auto mb-12" />

          {/* 2. Partner Marquee Ticker */}
          <div className="flex flex-col items-center">
            {/* Seamless Infinite Loop with Gradient Edge Mask */}
            <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)] py-2">
              <div
                className="animate-marquee flex items-center gap-6"
                style={{ animationDuration: '28s' }}
              >
                {/* Track 1 */}
                <div className="flex items-center gap-6 shrink-0">
                  {EXHIBITORS.map((item) => (
                    <div
                      key={item.name}
                      className="bg-white rounded-2xl px-6 py-3 h-20 w-44 flex items-center justify-center shadow-md border border-white/90 shrink-0 transition-transform duration-200 hover:scale-105"
                    >
                      <div className="relative w-full h-12">
                        <Image
                          src={item.src}
                          alt={item.name}
                          fill
                          sizes="176px"
                          className="object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Track 2 (Duplicate for Seamless Infinite Marquee Loop) */}
                <div className="flex items-center gap-6 shrink-0" aria-hidden="true">
                  {EXHIBITORS.map((item, idx) => (
                    <div
                      key={`${item.name}-dup-${idx}`}
                      className="bg-white rounded-2xl px-6 py-3 h-20 w-44 flex items-center justify-center shadow-md border border-white/90 shrink-0 transition-transform duration-200 hover:scale-105"
                    >
                      <div className="relative w-full h-12">
                        <Image
                          src={item.src}
                          alt={item.name}
                          fill
                          sizes="176px"
                          className="object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
