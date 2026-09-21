'use client'

import React, { useState } from 'react'
import { Plus, Minus, ArrowUpRight, Award, ExternalLink } from 'lucide-react'

function TapmiBlruWordmark({ className = 'h-5 sm:h-6 md:h-7 w-auto text-[#ffc5b6]' }: { className?: string }) {
  return (
    <svg
      viewBox="401 0 323 35"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="TAPMI B'LRU"
    >
      {/* T */}
      <path d="M410.813 34.2807V8.96561H401.191V0.00683594H431.491V8.96561H421.876V34.2807H410.813Z" />
      {/* A */}
      <path d="M458.602 34.2807H470.415L457.182 0.00683594H447.151L433.917 34.2807H445.556L446.682 30.9705H457.476L458.602 34.2807Z" />
      {/* P */}
      <path d="M503.047 6.05069C501.774 4.1075 499.972 2.61325 497.64 1.56795C495.308 0.522651 492.541 0 489.345 0H472.841V34.2738H484.393V25.8511H489.338C492.534 25.8511 495.301 25.3218 497.633 24.2631C499.965 23.2044 501.768 21.7101 503.041 19.7803C504.314 17.8572 504.95 15.5723 504.95 12.9256C504.95 10.2788 504.314 7.98718 503.041 6.04399L503.047 6.05069Z" />
      {/* M */}
      <path d="M536.021 34.2807H548.505L548.411 0.00683594H536.015L528.041 17.261L519.846 0.00683594H507.376V34.2807H519.859V22.0319L527.887 34.2807L535.954 21.5695L536.021 34.2807Z" />
      {/* I */}
      <path d="M550.93 34.2807V0.00683594H562.482V34.2807H550.93Z" />
      {/* B */}
      <path d="M608.179 19.5419C609.26 21.115 609.796 22.8191 609.796 24.6543C609.796 27.9314 608.704 30.4624 606.532 32.2674C604.359 34.0723 601.125 34.9697 596.839 34.9697H578.138V0H596.502C600.688 0 603.714 0.847018 605.589 2.55114C607.454 4.25526 608.387 6.36272 608.387 8.88361C608.387 12.3523 606.889 14.7926 603.893 16.2043C605.669 16.8597 607.087 17.9689 608.169 19.5419" />
      {/* Triangle flourish / divider */}
      <path d="M611.542 0V16.2547H617.395L623.259 0H611.542Z" />
      {/* L */}
      <path d="M653.775 21.4477V34.9697H625.471V0H638.993V21.4477H653.775Z" />
      {/* R */}
      <path d="M682.913 23.8375C686.515 21.4679 688.32 17.7571 688.32 13.2901C688.32 5.79804 683.26 0.322674 673.091 0.0201671V0H657.029V34.9697H671.077V24.6039L675.661 34.9798H688.33L682.913 23.8476V23.8375Z" />
      {/* U */}
      <path d="M709.145 20.9536V0H722.191V21.5889C722.191 25.8139 720.871 29.1011 718.232 31.4708C715.554 33.8101 711.754 34.9798 706.813 34.9798C701.873 34.9798 698.053 33.8101 695.434 31.4708C692.755 29.1415 691.426 25.8441 691.426 21.5889V0H704.472V20.9536C704.472 22.2645 705.514 23.3232 706.803 23.3232C708.093 23.3232 709.135 22.2645 709.135 20.9536" />
    </svg>
  )
}

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Centered Brand Header Lockup (Matching Reference Artwork) */}
        <div className="flex flex-col items-center text-center mb-16 pb-12 border-b border-wine-800/80">
          
          {/* Top Line: TAPMI B'LRU official SVG wordmark in pink */}
          <div className="mb-4 sm:mb-5">
            <TapmiBlruWordmark className="h-5 sm:h-6 md:h-7 w-auto text-[#ffc5b6]" />
          </div>

          {/* Main Title: BUSINESS EXCELLENCE in Helvetica bold, with stylized ribbon X */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-1 my-1 sm:my-2">
            <span className="font-sans text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-none">
              BUSINESS
            </span>
            <span className="inline-flex items-center font-sans text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-none">
              <span>E</span>
              <span className="relative inline-flex items-center justify-center mx-1 sm:mx-1.5 h-7 sm:h-10 md:h-12 lg:h-14 w-auto">
                <img
                  src="/images/ribbon-x.png"
                  alt="X"
                  className="h-full w-auto object-contain brightness-110 drop-shadow-[0_0_18px_rgba(244,81,151,0.65)]"
                />
              </span>
              <span>CELLENCE</span>
            </span>
          </div>

          {/* Hairline Divider with AWARDS 2026 in Helvetica */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 my-4 w-full max-w-xl mx-auto">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-wine-700 to-wine-600" />
            <div className="font-sans text-xs sm:text-base md:text-lg font-medium tracking-[0.3em] sm:tracking-[0.35em] uppercase text-cream-200 shrink-0">
              AWARDS 2026
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-wine-700 to-wine-600" />
          </div>

          {/* Co-presenting Partner: Plugscale Logo Lockup */}
          <div className="mt-4 flex flex-col items-center justify-center">
            <div className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-cream-400 font-medium mb-2">
              Co presenting Partner
            </div>
            <a
              href="https://plugscale.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center p-2 rounded-xl transition-all hover:scale-105"
              aria-label="Plugscale - Co presenting Partner"
            >
              <img
                src="/logos/plugscale-horizontal-white.png"
                alt="PLUGSCALE Logo"
                className="h-7 sm:h-8 md:h-9 w-auto object-contain opacity-95 group-hover:opacity-100 transition-opacity"
              />
            </a>
          </div>

          {/* Date, Venue Coordinates & Submit Nomination CTA */}
          <div className="mt-6 flex flex-col items-center gap-4">
            <div className="text-center">
              <span className="text-xs sm:text-sm font-bold text-glc-orange tracking-widest uppercase">
                10 October 2026
              </span>
              <span className="text-cream-500 mx-2">·</span>
              <span className="text-xs sm:text-sm text-cream-300">
                Dr. Ramdas M. Pai Auditorium, MAHE Bengaluru
              </span>
            </div>

            <div className="mt-1">
              <a
                href={nominationFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold tracking-widest uppercase text-white rounded-full bg-gradient-to-r from-glc-magenta via-glc-pink to-glc-orange hover:shadow-[0_0_28px_-5px_rgba(244,81,151,0.65)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] group shadow-xl"
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
