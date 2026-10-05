'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'

interface PartnerLogo {
  name: string
  src: string
  imageClass: string
  href: string
}

const PARTNERS: PartnerLogo[] = [
  {
    name: 'Yoga Bar',
    src: '/sponsors/yogabar.png',
    imageClass: 'h-13 sm:h-18 md:h-20 w-auto max-w-[120px] sm:max-w-[160px]',
    href: 'https://yogabars.in'
  },
  {
    name: 'The Belgian Waffle Co',
    src: '/sponsors/belgian-waffle.svg',
    imageClass: 'h-14 sm:h-20 md:h-22 w-auto max-w-[125px] sm:max-w-[165px]',
    href: 'https://thebelgianwaffle.co/'
  },
  {
    name: 'SMH',
    src: '/sponsors/smh.png',
    imageClass: 'h-13 sm:h-18 md:h-20 w-auto max-w-[120px] sm:max-w-[160px]',
    href: 'https://www.smharabia.com/'
  },
  {
    name: 'Farmley',
    src: '/sponsors/farmley.jpg',
    imageClass: 'h-14 sm:h-19 md:h-22 w-auto max-w-[135px] sm:max-w-[175px]',
    href: 'https://www.farmley.com/'
  },
  {
    name: 'NEXTORK',
    src: '/sponsors/nextork.jpg',
    imageClass: 'h-7 sm:h-11 md:h-13 w-auto max-w-[120px] sm:max-w-[170px]',
    href: 'https://nextork.com/'
  },
  {
    name: 'Tazish',
    src: '/sponsors/tazish.jpeg',
    imageClass: 'h-11 sm:h-16 md:h-18 w-auto max-w-[130px] sm:max-w-[180px]',
    href: 'https://www.instagram.com/tazishpoket/?hl=en'
  },
  {
    name: "Snap 'N' Stick",
    src: '/sponsors/snap-n-stick.svg',
    imageClass: 'h-10 sm:h-16 md:h-20 w-auto max-w-[120px] sm:max-w-[165px]',
    href: 'https://snapnstick.vercel.app/'
  },
  {
    name: 'The Chatpata Affair',
    src: '/sponsors/chatpata-affair.webp',
    imageClass: 'h-8 sm:h-12 md:h-14 w-auto max-w-[120px] sm:max-w-[170px]',
    href: 'https://thechatpataaffair.com/'
  },
  // {
  //   name: 'Rescript',
  //   src: '/sponsors/rescript.svg',
  //   imageClass: 'h-7 sm:h-11 md:h-13 w-auto max-w-[115px] sm:max-w-[165px]',
  //   href: 'https://rescript.in/'
  // },
  {
    name: 'Ownly',
    src: '/sponsors/ownly.svg',
    imageClass: 'h-7 sm:h-11 md:h-13 w-auto max-w-[115px] sm:max-w-[165px]',
    href: 'https://ownly.food/'
  },
  {
    name: 'Taurke',
    src: '/sponsors/taurke.png',
    imageClass: 'h-10 sm:h-16 md:h-18 w-auto max-w-[115px] sm:max-w-[155px]',
    href: 'https://taurke.com'
  },
  {
    name: 'NikMish',
    src: '/sponsors/nikmish.png',
    imageClass: 'h-9 sm:h-14 md:h-16 w-auto max-w-[115px] sm:max-w-[160px]',
    href: 'https://www.instagram.com/nikmish.designs/'
  },
]

export default function PartnersSection() {
  useEffect(() => {
    // Eagerly preload all partner logo images into memory so they never pop in while sliding
    PARTNERS.forEach((partner) => {
      const img = new window.Image()
      img.src = partner.src
    })
  }, [])

  return (
    <section id="partners" className="relative py-14 sm:py-24 lg:py-28 bg-[#0B0207] border-t border-wine-900/60 overflow-hidden">
      {/* Target anchor for #sponsors or #partners navigation */}
      <span id="sponsors" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* Minimalist Section Header */}
        <div className="text-center mb-8 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-cream-50 uppercase">
            Our Partners
          </h2>
        </div>

        {/* Minimalist Card Container */}
        <div className="rounded-2xl sm:rounded-3xl bg-[#13030F] border border-wine-800/80 p-4 sm:p-10 lg:p-14 shadow-2xl relative backdrop-blur-md">
          
          {/* 1. Featured Main Partners (Top Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 max-w-3xl mx-auto mb-8 sm:mb-12">
            {/* Digital Media Partner */}
            <div className="flex flex-col items-center justify-center w-full">
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] sm:tracking-[0.22em] uppercase text-cream-400 mb-2 sm:mb-3">
                Digital Media Partner
              </span>
              <a
                href="https://bharat24live.com/"
                target="_blank"
                rel="noopener noreferrer"
                title="Bharat 24 - Vision of New India"
                className="bg-white rounded-xl sm:rounded-2xl px-5 py-3 sm:px-8 sm:py-5 shadow-lg border border-white/90 flex items-center justify-center transition-transform duration-300 hover:scale-105 w-full max-w-[280px] sm:max-w-[340px] h-24 sm:h-32 group cursor-pointer"
              >
                <div className="relative w-44 sm:w-60 h-14 sm:h-18">
                  <Image
                    src="/sponsors/bharat24.png"
                    alt="Bharat 24 - Vision of New India"
                    fill
                    sizes="(max-width: 640px) 176px, 240px"
                    className="object-contain"
                    priority
                  />
                </div>
              </a>
            </div>

            {/* Hospitality Partner */}
            <div className="flex flex-col items-center justify-center w-full">
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] sm:tracking-[0.22em] uppercase text-cream-400 mb-2 sm:mb-3">
                Hospitality Partner
              </span>
              <a
                href="https://www.instagram.com/vanya_bangalore/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                title="Vanya Luxury Boutique Resort"
                className="bg-white rounded-xl sm:rounded-2xl px-5 py-2 sm:px-8 sm:py-3 shadow-lg border border-white/90 flex items-center justify-center transition-transform duration-300 hover:scale-105 w-full max-w-[280px] sm:max-w-[340px] h-24 sm:h-32 group cursor-pointer"
              >
                <div className="relative w-44 sm:w-60 h-18 sm:h-24">
                  <Image
                    src="/sponsors/vanya.png"
                    alt="Vanya Luxury Boutique Resort"
                    fill
                    sizes="(max-width: 640px) 176px, 240px"
                    className="object-contain"
                    priority
                  />
                </div>
              </a>
            </div>
          </div>

          {/* Minimal Divider */}
          <div className="w-16 sm:w-24 h-px bg-wine-800/80 mx-auto mb-8 sm:mb-12" />

          {/* 2. Partner Marquee Ticker (Clickable Cards with External Redirects) */}
          <div className="flex flex-col items-center">
            {/* Seamless Infinite Loop with Gradient Edge Mask */}
            <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_6%,black_94%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_6%,black_94%,transparent_100%)] py-2 sm:py-3">
              <div
                className="animate-marquee flex items-center gap-4 sm:gap-7 md:gap-8"
                style={{ animationDuration: '30s' }}
              >
                {/* Track 1 */}
                <div className="flex items-center gap-4 sm:gap-7 md:gap-8 shrink-0">
                  {PARTNERS.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Visit ${item.name}`}
                      className="bg-white rounded-xl sm:rounded-2xl px-3.5 py-2 sm:px-6 sm:py-4 h-20 sm:h-28 md:h-32 w-40 sm:w-56 md:w-64 flex items-center justify-center shadow-md border border-white/90 shrink-0 transition-transform duration-200 hover:scale-105 group cursor-pointer"
                    >
                      <img
                        src={item.src}
                        alt={item.name}
                        className={`${item.imageClass} object-contain`}
                        loading="eager"
                        decoding="async"
                      />
                    </a>
                  ))}
                </div>

                {/* Track 2 (Duplicate for Seamless Infinite Marquee Loop) */}
                <div className="flex items-center gap-4 sm:gap-7 md:gap-8 shrink-0" aria-hidden="true">
                  {PARTNERS.map((item, idx) => (
                    <a
                      key={`${item.name}-dup-${idx}`}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Visit ${item.name}`}
                      tabIndex={-1}
                      className="bg-white rounded-xl sm:rounded-2xl px-3.5 py-2 sm:px-6 sm:py-4 h-20 sm:h-28 md:h-32 w-40 sm:w-56 md:w-64 flex items-center justify-center shadow-md border border-white/90 shrink-0 transition-transform duration-200 hover:scale-105 group cursor-pointer"
                    >
                      <img
                        src={item.src}
                        alt={item.name}
                        className={`${item.imageClass} object-contain`}
                        loading="eager"
                        decoding="async"
                      />
                    </a>
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
