'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Plus, Minus, ArrowUpRight, Award, Sparkles, ExternalLink } from 'lucide-react'

interface AwardCategory {
  id: string
  number: string
  title: string
  tagline: string
  description: string
  focusAreas: string[]
}

const AWARD_CATEGORIES: AwardCategory[] = [
  {
    id: 'global-business-excellence',
    number: '01',
    title: 'Global Business Excellence',
    tagline: 'Honoring organizational mastery and resilient international value creation',
    description:
      'Recognizing multinational enterprises and institutions that demonstrate sustained business excellence, operational brilliance, and transformational leadership across global markets.',
    focusAreas: ['Strategic Scalability', 'Financial & Operational Resilience', 'Cross-Border Governance']
  },
  {
    id: 'cross-border-innovation',
    number: '02',
    title: 'Cross-border Innovation',
    tagline: 'Celebrating disruptive technologies bridging multinational frontiers',
    description:
      'Commending breakthrough digital architectures, frontier AI platforms, and innovative business models that solve critical challenges and bridge multinational ecosystems.',
    focusAreas: ['Technological Originality', 'Cross-Border Scalability', 'Measurable Market Disruption']
  },
  {
    id: 'international-market-leadership',
    number: '03',
    title: 'International Market Leadership',
    tagline: 'Recognizing visionary market expansion and competitive stewardship',
    description:
      'Honoring leaders and organizations that have successfully entered, navigated, and established decisive market leadership across international territories through strategic agility.',
    focusAreas: ['Market Agility & Expansion', 'Global Brand Equity', 'Competitive Strategy']
  },
  {
    id: 'global-growth-impact',
    number: '04',
    title: 'Global Growth and Impact',
    tagline: 'Commending sustainable, high-impact enterprise footprints',
    description:
      'Awarding enterprises creating meaningful economic, societal, and environmental impact across borders through ESG stewardship, clean-tech adoption, and sustainable growth.',
    focusAreas: ['ESG Integration & Clean-Tech', 'Societal Footprint', 'Multinational Partnership Vitality']
  }
]

export default function AwardsSection() {
  const [expandedId, setExpandedId] = useState<string | null>('global-business-excellence')
  const nominationFormUrl = 'https://forms.gle/4khjou6rWyKZMpGm7'

  const toggleCategory = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id))
  }

  return (
    <section
      id="awards"
      className="relative py-24 sm:py-32 bg-wine-950 overflow-hidden border-t border-wine-900/70 scroll-mt-24"
    >
      {/* Subtle Background Grid Texture matching GLC brand identity */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      {/* Ambient Lighting Accents */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-glc-magenta/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[450px] h-[450px] bg-glc-orange/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating 3D Ribbon Accent (Right side, desktop only) */}
      <div className="hidden xl:block absolute -top-8 -right-16 w-80 h-96 pointer-events-none opacity-85 z-0 select-none">
        <img
          src="/images/awards-3d-ribbon.png"
          alt="GLC 3D Ribbon Graphic"
          className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(244,81,151,0.35)]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header Grid: Title, Co-presenting Partner, Schedule & Submit CTA */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 pb-12 border-b border-wine-800/80">
          
          {/* Left Column: Brand Typography & Event Metadata */}
          <div className="max-w-2xl">
            
            {/* Institution Wordmark */}
            <div className="text-xs sm:text-sm font-extrabold tracking-[0.28em] text-[#ffc5b6] uppercase mb-2">
              TAPMI B&apos;LRU
            </div>

            {/* Main Title with Stylized Ribbon X */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-tektype text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-none">
                BUSINESS
              </span>
              <span className="inline-flex items-center font-tektype text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-none">
                <span>E</span>
                <span className="relative inline-flex items-center justify-center mx-1 h-9 sm:h-12 lg:h-14 w-auto">
                  <img
                    src="/images/ribbon-x.png"
                    alt="X"
                    className="h-full w-auto object-contain brightness-110 drop-shadow-[0_0_15px_rgba(244,81,151,0.6)]"
                  />
                </span>
                <span>CELLENCE</span>
              </span>
            </div>

            {/* Hairline Rule with AWARDS 2026 */}
            <div className="flex items-center gap-4 my-4 max-w-md">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-wine-600 to-wine-600" />
              <div className="text-sm sm:text-base font-medium tracking-[0.3em] uppercase text-cream-200">
                AWARDS 2026
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-wine-600 via-wine-600 to-transparent" />
            </div>

            {/* Date & Venue Coordinates */}
            <div className="mt-3">
              <div className="text-sm sm:text-base font-bold text-glc-orange tracking-wide uppercase">
                10 October 2026
              </div>
              <div className="text-xs sm:text-sm text-cream-300 mt-0.5">
                Dr. Ramdas M. Pai Auditorium, MAHE Bengaluru
              </div>
            </div>

          </div>

          {/* Right Column: Co-presenting Partner Lockup & Submit Nomination CTA */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-6">
            
            {/* Co-presenting Partner: Plugscale */}
            <div className="flex flex-col lg:items-end">
              <div className="text-[11px] uppercase tracking-widest text-cream-400 font-semibold mb-2">
                Co-presenting Partner
              </div>
              <a
                href="https://plugscale.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-3 rounded-xl bg-wine-900/50 border border-wine-800/80 hover:border-glc-magenta/60 transition-all hover:scale-[1.02]"
                aria-label="Plugscale - Co-presenting Partner"
              >
                <img
                  src="/logos/plugscale-horizontal-white.png"
                  alt="PLUGSCALE Logo"
                  className="h-8 sm:h-9 w-auto object-contain opacity-95 group-hover:opacity-100 transition-opacity"
                />
              </a>
            </div>

            {/* Submit Nomination CTA Button */}
            <div className="mt-2">
              <a
                href={nominationFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-7 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold tracking-widest uppercase text-white rounded-full bg-gradient-to-r from-glc-magenta via-glc-pink to-glc-orange hover:shadow-[0_0_28px_-5px_rgba(244,81,151,0.65)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group shadow-xl"
              >
                <span>Submit Nomination</span>
                <ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

          </div>

        </div>

        {/* 4 Award Categories Grid (2x2 on Desktop, 1 Column on Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {AWARD_CATEGORIES.map((award) => {
            const isExpanded = expandedId === award.id

            return (
              <div
                key={award.id}
                onClick={() => toggleCategory(award.id)}
                className={`group relative rounded-2xl p-6 sm:p-8 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                  isExpanded
                    ? 'bg-gradient-to-br from-[#1F041B] via-[#140212] to-[#0A0108] border-glc-magenta shadow-[0_15px_45px_-10px_rgba(244,81,151,0.35)]'
                    : 'bg-[#12030F]/90 border-wine-800/80 hover:border-wine-600 hover:bg-[#160413]'
                } border`}
              >
                {/* Card Top: Number & Category Title */}
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <span className="text-xs font-mono font-bold tracking-widest text-glc-orange uppercase">
                      Category {award.number}
                    </span>
                    <Award
                      className={`w-5 h-5 transition-colors ${
                        isExpanded ? 'text-glc-magenta' : 'text-cream-400 group-hover:text-cream-200'
                      }`}
                    />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-cream-50 group-hover:text-white leading-snug tracking-tight">
                    {award.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-cream-300/90 mt-2 leading-relaxed">
                    {award.tagline}
                  </p>
                </div>

                {/* Expanded Drawer: Details, Focus Areas & Direct Link */}
                {isExpanded && (
                  <div className="mt-6 pt-5 border-t border-wine-800/80 animate-fadeIn">
                    <p className="text-xs sm:text-sm text-cream-200/95 leading-relaxed font-normal">
                      {award.description}
                    </p>

                    {/* Focus Criteria Tags */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {award.focusAreas.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] sm:text-[11px] font-medium tracking-wide px-2.5 py-1 rounded-md bg-wine-950 border border-wine-700/80 text-cream-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Direct Nomination Link */}
                    <div className="mt-5 pt-3 flex items-center justify-between">
                      <a
                        href={nominationFormUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-glc-orange hover:text-white transition-colors"
                      >
                        <span>Nominate for this Category</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Card Bottom: Plus / Minus Interactive Trigger */}
                <div className="mt-6 pt-4 border-t border-wine-900/60 flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-cream-400">
                    {isExpanded ? 'Click to collapse details' : 'Click to view criteria & details'}
                  </span>

                  <button
                    type="button"
                    aria-label={isExpanded ? `Collapse ${award.title}` : `Expand ${award.title}`}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      isExpanded
                        ? 'bg-glc-magenta text-white shadow-md'
                        : 'bg-wine-900/80 text-cream-300 group-hover:bg-wine-800 group-hover:text-white'
                    }`}
                  >
                    {isExpanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>

              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
