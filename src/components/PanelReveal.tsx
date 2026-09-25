'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { PANELS_LIST } from '@/data/eventData'
import { PANELISTS_DATA, Panelist } from '@/data/panelistsData'

const ArrowUpRightIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
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

const LinkedinIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
)

const PANEL_TRACK_MAP: Record<string, 'IT' | 'Auto' | 'FMCG' | 'BFSI' | 'Media'> = {
  'panel-1': 'IT',
  'panel-2': 'FMCG',
  'panel-3': 'BFSI',
  'panel-4': 'Auto',
  'panel-5': 'Media',
}

export default function PanelReveal() {
  const [expandedPanelId, setExpandedPanelId] = useState<string | null>(null)

  const togglePanel = (panelId: string) => {
    setExpandedPanelId((prev) => (prev === panelId ? null : panelId))
  }

  const getSpeakersForPanel = (panelId: string): Panelist[] => {
    const trackCode = PANEL_TRACK_MAP[panelId]
    if (!trackCode) return []
    return PANELISTS_DATA.filter((p) => p.trackCode === trackCode)
  }

  return (
    <section id="panels" className="relative mt-20 pt-16 border-t border-wine-900/60 scroll-mt-24">
      {/* Hidden anchor target for backwards compatibility */}
      <span id="symposia" className="absolute -top-24 pointer-events-none" />

      {/* Section Header */}
      <div className="max-w-3xl mb-12 sm:mb-16">
        <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream-50 uppercase">
          Panel Discussion Topics
        </h3>
      </div>

      {/* Minimalist Editorial Panels List */}
      <div className="divide-y divide-wine-800/60 border-y border-wine-800/60">
        {PANELS_LIST.map((panel) => {
          const isExpanded = expandedPanelId === panel.id
          const speakers = getSpeakersForPanel(panel.id)

          return (
            <div
              key={panel.id}
              className={`transition-colors duration-300 rounded-xl overflow-hidden ${
                isExpanded ? 'bg-wine-900/30' : ''
              }`}
            >
              {/* Clickable Panel Row */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => togglePanel(panel.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    togglePanel(panel.id)
                  }
                }}
                aria-expanded={isExpanded}
                className="group relative py-7 sm:py-9 px-2 sm:px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-wine-900/25 transition-all duration-300 rounded-xl cursor-pointer select-none"
              >
                {/* Left Column: Photo Thumbnail & Topic Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-7 flex-1 min-w-0">
                  {/* Panel Image Thumbnail */}
                  <div className="relative w-full sm:w-44 md:w-56 aspect-[16/9] sm:aspect-auto sm:h-28 md:h-32 rounded-lg overflow-hidden shrink-0 bg-wine-950 border border-wine-800/80 group-hover:border-glc-magenta/70 shadow-lg group-hover:shadow-[0_0_24px_-6px_rgba(244,81,151,0.35)] transition-all duration-300">
                    <Image
                      src={panel.image}
                      alt={panel.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 176px, 224px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {/* Subtle dark vignette on image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Panel Name & Sector Tag Only */}
                  <div className="flex flex-col justify-center min-w-0">
                    {/* Panel Title */}
                    <h4 className="text-xl sm:text-2xl md:text-3xl font-bold font-sans tracking-tight text-cream-100 group-hover:text-white transition-colors leading-snug">
                      {panel.title}
                    </h4>

                    {/* Sector Category Tag in warm accent color */}
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-medium tracking-wide text-glc-orange group-hover:text-glc-pink transition-colors">
                        {panel.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Active Gradient Edge Indicator & Arrow */}
                <div className="hidden sm:flex items-center gap-4 shrink-0 pl-4">
                  <ArrowUpRightIcon
                    className={`w-5 h-5 transition-all duration-300 ${
                      isExpanded
                        ? 'text-glc-orange rotate-90 scale-110'
                        : 'text-cream-400/60 group-hover:text-glc-orange group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                    }`}
                  />

                  {/* Gradient Accent Bar */}
                  <div
                    className={`w-2.5 h-16 rounded-full bg-gradient-to-b from-glc-orange via-glc-pink to-glc-magenta transition-all duration-300 shadow-[0_0_16px_rgba(244,81,151,0.6)] ${
                      isExpanded ? 'opacity-100 scale-y-105' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  />
                </div>
              </div>

              {/* Direct Speakers Grid on Click */}
              {isExpanded && (
                <div className="px-2 sm:px-4 pb-8 pt-3 border-t border-wine-800/60 animate-fadeIn">
                  {speakers.length === 0 ? (
                    <div className="p-6 text-center text-xs text-cream-400 bg-wine-950/40 rounded-xl border border-wine-800/40">
                      Speakers for this panel will be announced shortly.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {speakers.map((speaker) => (
                        <div
                          key={speaker.id}
                          className="group/speaker relative rounded-xl bg-gradient-to-b from-[#1b0518] to-[#0c0209] border border-wine-800/80 hover:border-glc-magenta/70 p-4 transition-all duration-300 hover:shadow-[0_12px_30px_rgba(244,81,151,0.22)] flex flex-col justify-between"
                        >
                          <div>
                            {/* Avatar & Name Header */}
                            <div className="flex items-center gap-3.5 mb-3">
                              {/* Portrait Thumbnail */}
                              <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-wine-700/80 group-hover/speaker:border-glc-orange transition-colors bg-wine-950 shadow-md">
                                {speaker.photo ? (
                                  <Image
                                    src={speaker.photo}
                                    alt={speaker.name}
                                    fill
                                    sizes="56px"
                                    className="object-cover object-top filter grayscale contrast-110 group-hover/speaker:grayscale-0 transition-all duration-300"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center font-bold text-glc-orange text-sm bg-wine-900">
                                    {speaker.name.slice(0, 2).toUpperCase()}
                                  </div>
                                )}
                              </div>

                              {/* Name & LinkedIn */}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                  <h6 className="font-bold text-sm text-cream-100 group-hover/speaker:text-white transition-colors truncate">
                                    {speaker.name}
                                  </h6>
                                  {speaker.linkedin && (
                                    <a
                                      href={speaker.linkedin}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      aria-label={`${speaker.name} LinkedIn`}
                                      className="text-cream-400 hover:text-[#0A66C2] transition-colors p-1 shrink-0"
                                    >
                                      <LinkedinIcon className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                </div>
                                <p className="text-xs text-glc-orange font-medium truncate mt-0.5">
                                  {speaker.company}
                                </p>
                              </div>
                            </div>

                            {/* Designation */}
                            <p className="text-xs text-cream-300/80 leading-snug line-clamp-2">
                              {speaker.designation}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
