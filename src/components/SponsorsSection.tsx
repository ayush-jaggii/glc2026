'use client'

import React from 'react'
import Image from 'next/image'

interface SponsorLogo {
  name: string
  src: string
  width: number
  height: number
  className?: string
}

const EXHIBITORS_ROW_1: SponsorLogo[] = [
  { name: 'Yoga Bar', src: '/sponsors/yogabar.png', width: 140, height: 60 },
  { name: 'The Belgian Waffle Co', src: '/sponsors/belgian-waffle.svg', width: 140, height: 60 },
  { name: 'SMH', src: '/sponsors/smh.png', width: 140, height: 60 },
  { name: 'Farmley', src: '/sponsors/farmley.jpg', width: 140, height: 60 }
]

const EXHIBITORS_ROW_2: SponsorLogo[] = [
  { name: 'NEXTORK', src: '/sponsors/nextork.jpg', width: 160, height: 60 },
  { name: 'Tazish', src: '/sponsors/tazish.jpeg', width: 160, height: 60 }
]

const EXHIBITORS_ROW_3: SponsorLogo[] = [
  { name: "Snap 'N' Stick", src: '/sponsors/snap-n-stick.svg', width: 150, height: 50 },
  { name: 'The Chatpata Affair', src: '/sponsors/chatpata-affair.webp', width: 150, height: 50 },
  { name: 'Rescript', src: '/sponsors/rescript.svg', width: 150, height: 50 }
]

export default function SponsorsSection() {
  return (
    <section id="sponsors" className="relative py-20 sm:py-28 bg-[#0D020B] border-t border-wine-900/80 overflow-hidden">
      {/* Subtle ambient gradient highlights */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-glc-magenta/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 bg-glc-orange/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-wine-900/60 text-glc-orange border border-glc-orange/30 mb-3 shadow-sm">
            Partners & Collaborators
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream-50 uppercase">
            Sponsors
          </h2>
        </div>

        {/* Main Showcase Panel */}
        <div className="bg-[#13030F] rounded-3xl border border-wine-800/80 p-6 sm:p-10 lg:p-12 shadow-2xl relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            
            {/* Left: Digital Media Partner */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-wine-800/60 text-center">
              <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-cream-300 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-glc-orange" />
                Digital Media Partner
              </h3>

              <div className="w-full max-w-[280px] bg-white rounded-2xl p-6 shadow-lg border border-white/90 flex items-center justify-center transition-all duration-300 hover:scale-[1.03]">
                <div className="relative w-full h-20 sm:h-24">
                  <Image
                    src="/sponsors/bharat24.png"
                    alt="Bharat 24 - Vision of New India"
                    fill
                    sizes="(max-width: 768px) 240px, 280px"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Right: Exhibitor Showcase */}
            <div className="lg:col-span-8 flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-wine-800/60">
              <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-cream-300 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-glc-magenta" />
                Exhibitor
              </h3>

              {/* 3 Partitioned Rows with subtle dashed borders */}
              <div className="space-y-6">
                
                {/* Row 1: Yoga Bar | Belgian Waffle | SMH | Farmley */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 items-center">
                  {EXHIBITORS_ROW_1.map((item) => (
                    <div
                      key={item.name}
                      className="bg-white rounded-2xl p-3 h-24 flex items-center justify-center shadow-md border border-white/90 transition-transform duration-200 hover:scale-105"
                    >
                      <div className="relative w-full h-16">
                        <Image
                          src={item.src}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 120px, 140px"
                          className="object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Divider 1 */}
                <div className="border-t border-dashed border-wine-800/80" />

                {/* Row 2: NEXTORK | Tazish */}
                <div className="grid grid-cols-2 gap-4 items-center max-w-md mx-auto sm:max-w-lg">
                  {EXHIBITORS_ROW_2.map((item) => (
                    <div
                      key={item.name}
                      className="bg-white rounded-2xl p-3 h-24 flex items-center justify-center shadow-md border border-white/90 transition-transform duration-200 hover:scale-105"
                    >
                      <div className="relative w-full h-16">
                        <Image
                          src={item.src}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 140px, 180px"
                          className="object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Divider 2 */}
                <div className="border-t border-dashed border-wine-800/80" />

                {/* Row 3: Snap 'N' Stick | The Chatpata Affair | Rescript */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 items-center">
                  {EXHIBITORS_ROW_3.map((item) => (
                    <div
                      key={item.name}
                      className="bg-white rounded-2xl p-3 h-24 flex items-center justify-center shadow-md border border-white/90 transition-transform duration-200 hover:scale-105"
                    >
                      <div className="relative w-full h-14">
                        <Image
                          src={item.src}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 140px, 160px"
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
