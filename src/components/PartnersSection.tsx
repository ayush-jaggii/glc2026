'use client'

import React from 'react'
import Image from 'next/image'

interface PartnerLogo {
  name: string
  src: string
  imageClass: string
}

const PARTNERS: PartnerLogo[] = [
  { name: 'Yoga Bar', src: '/sponsors/yogabar.png', imageClass: 'h-14 sm:h-16 w-auto max-w-[150px]' },
  { name: 'The Belgian Waffle Co', src: '/sponsors/belgian-waffle.svg', imageClass: 'h-16 sm:h-18 w-auto max-w-[155px]' },
  { name: 'SMH', src: '/sponsors/smh.png', imageClass: 'h-14 sm:h-16 w-auto max-w-[145px]' },
  { name: 'Farmley', src: '/sponsors/farmley.jpg', imageClass: 'h-14 sm:h-16 w-auto max-w-[155px]' },
  { name: 'NEXTORK', src: '/sponsors/nextork.jpg', imageClass: 'h-11 sm:h-13 w-auto max-w-[170px]' },
  { name: 'Tazish', src: '/sponsors/tazish.jpeg', imageClass: 'h-13 sm:h-15 w-auto max-w-[160px]' },
  { name: "Snap 'N' Stick", src: '/sponsors/snap-n-stick.svg', imageClass: 'h-16 sm:h-20 w-auto max-w-[165px]' },
  { name: 'The Chatpata Affair', src: '/sponsors/chatpata-affair.webp', imageClass: 'h-12 sm:h-14 w-auto max-w-[170px]' },
  { name: 'Rescript', src: '/sponsors/rescript.svg', imageClass: 'h-11 sm:h-13 w-auto max-w-[165px]' },
  { name: 'Ownly', src: '/sponsors/ownly.svg', imageClass: 'h-11 sm:h-13 w-auto max-w-[165px]' },
  { name: 'Taurke', src: '/sponsors/taurke.png', imageClass: 'h-16 sm:h-18 w-auto max-w-[155px]' },
  { name: 'NikMish', src: '/sponsors/nikmish.png', imageClass: 'h-14 sm:h-16 w-auto max-w-[160px]' },
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
          
          {/* 1. Featured Main Partners (Top Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-14">
            {/* Digital Media Partner */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-cream-400 mb-3">
                Digital Media Partner
              </span>
              <div className="bg-white rounded-2xl px-8 py-5 shadow-lg border border-white/90 flex items-center justify-center transition-transform duration-300 hover:scale-105 w-full max-w-[320px] h-28">
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

            {/* Hospitality Partner */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-cream-400 mb-3">
                Hospitality Partner
              </span>
              <a
                href="http://www.thevanya.in/"
                target="_blank"
                rel="noopener noreferrer"
                title="Vanya Luxury Boutique Resort"
                className="bg-white rounded-2xl px-8 py-4 shadow-lg border border-white/90 flex items-center justify-center transition-transform duration-300 hover:scale-105 w-full max-w-[320px] h-28 group"
              >
                <div className="relative w-48 sm:w-56 h-16 sm:h-20">
                  <Image
                    src="/sponsors/vanya.png"
                    alt="Vanya Luxury Boutique Resort"
                    fill
                    sizes="(max-width: 640px) 192px, 224px"
                    className="object-contain"
                    priority
                  />
                </div>
              </a>
            </div>
          </div>

          {/* Minimal Divider */}
          <div className="w-24 h-px bg-wine-800/80 mx-auto mb-14" />

          {/* 2. Partner Marquee Ticker (Enlarged Cards, Optically Balanced) */}
          <div className="flex flex-col items-center">
            {/* Seamless Infinite Loop with Gradient Edge Mask */}
            <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_6%,black_94%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_6%,black_94%,transparent_100%)] py-3">
              <div
                className="animate-marquee flex items-center gap-7 sm:gap-8"
                style={{ animationDuration: '32s' }}
              >
                {/* Track 1 */}
                <div className="flex items-center gap-7 sm:gap-8 shrink-0">
                  {PARTNERS.map((item) => (
                    <div
                      key={item.name}
                      className="bg-white rounded-2xl px-6 py-4 h-28 sm:h-32 w-56 sm:w-64 flex items-center justify-center shadow-md border border-white/90 shrink-0 transition-transform duration-200 hover:scale-105"
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
                <div className="flex items-center gap-7 sm:gap-8 shrink-0" aria-hidden="true">
                  {PARTNERS.map((item, idx) => (
                    <div
                      key={`${item.name}-dup-${idx}`}
                      className="bg-white rounded-2xl px-6 py-4 h-28 sm:h-32 w-56 sm:w-64 flex items-center justify-center shadow-md border border-white/90 shrink-0 transition-transform duration-200 hover:scale-105"
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
