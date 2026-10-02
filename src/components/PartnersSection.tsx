'use client'

import React from 'react'
import Image from 'next/image'

interface PartnerLogo {
  name: string
  src: string
  imageClass: string
}

const PARTNERS: PartnerLogo[] = [
  { name: 'Yoga Bar', src: '/sponsors/yogabar.png', imageClass: 'h-11 w-auto max-w-[110px]' },
  { name: 'The Belgian Waffle Co', src: '/sponsors/belgian-waffle.svg', imageClass: 'h-12 w-auto max-w-[110px]' },
  { name: 'SMH', src: '/sponsors/smh.png', imageClass: 'h-11 w-auto max-w-[110px]' },
  { name: 'Farmley', src: '/sponsors/farmley.jpg', imageClass: 'h-11 w-auto max-w-[115px]' },
  { name: 'NEXTORK', src: '/sponsors/nextork.jpg', imageClass: 'h-9 w-auto max-w-[130px]' },
  { name: 'Tazish', src: '/sponsors/tazish.jpeg', imageClass: 'h-10 w-auto max-w-[125px]' },
  { name: "Snap 'N' Stick", src: '/sponsors/snap-n-stick.svg', imageClass: 'h-12 w-auto max-w-[125px]' },
  { name: 'The Chatpata Affair', src: '/sponsors/chatpata-affair.webp', imageClass: 'h-9 w-auto max-w-[130px]' },
  { name: 'Rescript', src: '/sponsors/rescript.svg', imageClass: 'h-9 w-auto max-w-[125px]' }
]

export default function PartnersSection() {
  return (
    <section id="partners" className="relative py-20 sm:py-28 bg-[#0B0207] border-t border-wine-900/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Minimalist Section Header */}
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

          {/* 2. Partner Marquee Ticker (Optically Balanced, No Exhibitors label) */}
          <div className="flex flex-col items-center">
            {/* Seamless Infinite Loop with Gradient Edge Mask */}
            <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)] py-2">
              <div
                className="animate-marquee flex items-center gap-6"
                style={{ animationDuration: '26s' }}
              >
                {/* Track 1 */}
                <div className="flex items-center gap-6 shrink-0">
                  {PARTNERS.map((item) => (
                    <div
                      key={item.name}
                      className="bg-white rounded-2xl px-5 py-3 h-20 w-44 flex items-center justify-center shadow-md border border-white/90 shrink-0 transition-transform duration-200 hover:scale-105"
                    >
                      <img
                        src={item.src}
                        alt={item.name}
                        className={`${item.imageClass} object-contain`}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>

                {/* Track 2 (Duplicate for Seamless Infinite Marquee Loop) */}
                <div className="flex items-center gap-6 shrink-0" aria-hidden="true">
                  {PARTNERS.map((item, idx) => (
                    <div
                      key={`${item.name}-dup-${idx}`}
                      className="bg-white rounded-2xl px-5 py-3 h-20 w-44 flex items-center justify-center shadow-md border border-white/90 shrink-0 transition-transform duration-200 hover:scale-105"
                    >
                      <img
                        src={item.src}
                        alt={item.name}
                        className={`${item.imageClass} object-contain`}
                        loading="lazy"
                      />
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
