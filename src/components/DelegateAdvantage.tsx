'use client'

import React from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const DELEGATE_POINTS = [
  {
    title: 'Access to Global Leaders & Decision-Makers',
    description:
      'Engage directly with multinational CEOs, managing directors, and industry chairs driving transformation across borders.',
  },
  {
    title: 'Future-Ready Insights & Strategies',
    description:
      'Gain actionable frameworks from cutting-edge discussions on agentic AI, cross-border capital, supply chains, and EV mobility.',
  },
  {
    title: 'Networking & Collaboration Opportunities',
    description:
      'Build meaningful connections with 1,000+ peers, industry experts, and potential partners to spark new initiatives.',
  },
]

export default function DelegateAdvantage() {
  return (
    <section
      id="delegate-benefits"
      className="relative py-20 sm:py-28 bg-wine-950 overflow-hidden border-t border-wine-900/60 scroll-mt-24"
    >
      {/* Hidden anchor for backwards compatibility */}
      <span id="advantage" className="absolute -top-24 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Title, Minimalist Points List & Register Button */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Main Section Heading */}
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream-50 mb-8 sm:mb-10 leading-[1.08]">
              The GLC Delegate Advantage
            </h2>

            {/* Clean Editorial Points with Hairline Dividers */}
            <div className="divide-y divide-wine-800/60 border-t border-b border-wine-800/60 mb-8 sm:mb-10">
              {DELEGATE_POINTS.map((point, idx) => (
                <div key={idx} className="py-5 sm:py-6">
                  <h3 className="text-lg sm:text-xl font-bold text-cream-100 mb-2 leading-snug">
                    {point.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-cream-300/85 leading-relaxed font-normal">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Register CTA Button */}
            <div>
              <a
                href="#register"
                className="inline-flex items-center justify-center px-7 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold tracking-widest uppercase text-white rounded-full bg-gradient-to-r from-glc-magenta via-glc-pink to-glc-orange hover:shadow-[0_0_28px_-5px_rgba(244,81,151,0.65)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
              >
                <span>Register For Delegate Pass</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

          </div>

          {/* Right Column: Clean Photo Showcase with Offset Brand Accents */}
          <div className="lg:col-span-6 relative flex items-center justify-center py-6">
            
            {/* Top-Left Floating Gradient Accent Block */}
            <div className="hidden sm:block absolute -top-2 left-6 lg:left-8 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-glc-orange via-glc-pink to-glc-magenta opacity-90 shadow-xl pointer-events-none z-0" />

            {/* Bottom-Right Floating Gradient Accent Block */}
            <div className="hidden sm:block absolute -bottom-2 right-6 lg:right-8 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-glc-orange via-glc-pink to-glc-magenta opacity-90 shadow-xl pointer-events-none z-0" />

            {/* Main Delegate Photograph Card */}
            <div className="relative z-10 w-full max-w-[480px] aspect-[4/5] rounded-2xl overflow-hidden bg-wine-900 border border-wine-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              <Image
                src="/delegate.webp"
                alt="GLC Delegate speaking during live colloquium deliberations at MAHE Bengaluru"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 480px"
                priority
                className="object-cover object-top hover:scale-[1.02] transition-transform duration-500 ease-out"
              />
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
