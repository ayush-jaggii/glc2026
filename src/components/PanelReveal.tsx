'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { PANELS_LIST } from '@/data/eventData'
import { PANELISTS_DATA, Panelist } from '@/data/panelistsData'

// Inline SVG Icons to ensure zero external file provider dependencies
const ChevronDownIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const UsersIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const SparklesIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
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

const HelpCircleIcon = ({ className = 'w-3 h-3' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
)

const PANEL_TRACK_MAP: Record<string, { code: 'IT' | 'Auto' | 'FMCG' | 'BFSI' | 'Media'; label: string }> = {
  'panel-1': { code: 'IT', label: 'Information Technology' },
  'panel-2': { code: 'FMCG', label: 'Retail & FMCG' },
  'panel-3': { code: 'BFSI', label: 'Finance & BFSI' },
  'panel-4': { code: 'Auto', label: 'Automobile & EV Mobility' },
  'panel-5': { code: 'Media', label: 'Media & Entertainment' },
}

export default function PanelReveal() {
  const [expandedPanelId, setExpandedPanelId] = useState<string | null>(null)

  const togglePanel = (panelId: string) => {
    setExpandedPanelId((prev) => (prev === panelId ? null : panelId))
  }

  const getSpeakersForPanel = (panelId: string): Panelist[] => {
    const trackInfo = PANEL_TRACK_MAP[panelId]
    if (!trackInfo) return []
    return PANELISTS_DATA.filter((p) => p.trackCode === trackInfo.code)
  }

  return (
    <section id="panels" className="relative mt-20 pt-16 border-t border-wine-900/60 scroll-mt-24">
      {/* Hidden anchor target for backwards compatibility */}
      <span id="symposia" className="absolute -top-24 pointer-events-none" />

      {/* Section Header */}
      <div className="max-w-3xl mb-12 sm:mb-16">
        <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream-50 uppercase mb-3">
          Panel Discussion Topics
        </h3>
        <p className="text-xs sm:text-sm text-cream-200/80 leading-relaxed font-normal">
          Five focused symposia exploring multinational enterprise strategy, market expansion, and cross-border innovation. Click any panel to view details and confirmed speakers.
        </p>
      </div>

      {/* Minimalist Editorial Panels List with Accordion Extension */}
      <div className="divide-y divide-wine-800/60 border-y border-wine-800/60">
        {PANELS_LIST.map((panel) => {
          const isExpanded = expandedPanelId === panel.id
          const speakers = getSpeakersForPanel(panel.id)
          const panelOverview = panel.shortDescription || panel.description

          return (
            <div
              key={panel.id}
              className={`transition-colors duration-300 rounded-2xl my-2 overflow-hidden ${
                isExpanded ? 'bg-wine-900/35 border border-wine-800/90 shadow-xl' : 'hover:bg-wine-900/20'
              }`}
            >
              {/* Clickable Header Row */}
              <button
                type="button"
                onClick={() => togglePanel(panel.id)}
                aria-expanded={isExpanded}
                className="w-full text-left group relative py-6 sm:py-8 px-3 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-glc-magenta rounded-xl"
              >
                {/* Left Column: Photo Thumbnail & Topic Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-7 flex-1 min-w-0">
                  {/* Panel Image Thumbnail */}
                  <div className="relative w-full sm:w-44 md:w-52 aspect-[16/9] sm:aspect-auto sm:h-28 md:h-32 rounded-lg overflow-hidden shrink-0 bg-wine-950 border border-wine-800/80 group-hover:border-glc-magenta/70 shadow-lg group-hover:shadow-[0_0_24px_-6px_rgba(244,81,151,0.35)] transition-all duration-300">
                    <Image
                      src={panel.image}
                      alt={panel.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 176px, 208px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {/* Subtle dark vignette on image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Panel Name, Sector Tag & Speaker Count */}
                  <div className="flex flex-col justify-center min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-mono text-cream-400 uppercase tracking-widest">
                        Panel {panel.number}
                      </span>
                      <span className="text-cream-600">·</span>
                      <span className="text-xs font-semibold tracking-wide text-glc-orange group-hover:text-glc-pink transition-colors">
                        {panel.category}
                      </span>
                    </div>

                    {/* Panel Title */}
                    <h4 className="text-xl sm:text-2xl md:text-3xl font-bold font-sans tracking-tight text-cream-100 group-hover:text-white transition-colors leading-snug">
                      {panel.title}
                    </h4>

                    {/* Subtitle / Topic Pill */}
                    <p className="mt-1 text-xs text-cream-300/80 line-clamp-1">
                      {panel.subtitle}
                    </p>
                  </div>
                </div>

                {/* Right Column: Toggle Button with Animated Chevron */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 ${
                    isExpanded
                      ? 'bg-glc-magenta/20 text-cream-100 border-glc-magenta/60 shadow-[0_0_12px_rgba(244,81,151,0.3)]'
                      : 'bg-wine-900/60 text-cream-300 border-wine-800 group-hover:border-glc-magenta/50 group-hover:text-white'
                  }`}>
                    <span>{isExpanded ? 'Hide Speakers' : `View Speakers (${speakers.length})`}</span>
                    <ChevronDownIcon
                      className={`w-3.5 h-3.5 text-glc-orange transition-transform duration-300 ${
                        isExpanded ? 'rotate-180 text-glc-pink' : 'group-hover:translate-y-0.5'
                      }`}
                    />
                  </div>
                </div>
              </button>

              {/* Expandable Drawer: Description & Speakers */}
              {isExpanded && (
                <div className="px-3 sm:px-6 pb-8 pt-2 animate-fadeIn border-t border-wine-800/60 mt-1">
                  
                  {/* 1. Panel Short Description / Overview */}
                  {panelOverview && (
                    <div className="mb-8 p-4 sm:p-5 rounded-xl bg-wine-950/80 border border-wine-800/80 shadow-inner">
                      <div className="text-[11px] uppercase tracking-widest text-glc-orange font-semibold mb-2 flex items-center gap-2">
                        <SparklesIcon className="w-3.5 h-3.5 text-glc-pink" />
                        <span>Panel Overview</span>
                      </div>
                      <p className="text-xs sm:text-sm text-cream-200/90 leading-relaxed font-normal">
                        {panelOverview}
                      </p>

                      {/* Discussion Key Questions if available */}
                      {panel.keyQuestions && panel.keyQuestions.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-wine-800/60 space-y-1.5">
                          <div className="text-[10px] uppercase tracking-wider text-cream-400 font-semibold flex items-center gap-1.5">
                            <HelpCircleIcon className="w-3 h-3 text-glc-orange" />
                            <span>Core Discussion Themes:</span>
                          </div>
                          <ul className="list-disc list-inside space-y-1 text-xs text-cream-300/80">
                            {panel.keyQuestions.map((q, idx) => (
                              <li key={idx} className="leading-relaxed">
                                {q}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. Confirmed Speakers Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <UsersIcon className="w-4 h-4 text-glc-orange" />
                        <h5 className="text-xs sm:text-sm uppercase tracking-wider font-bold text-cream-200">
                          Confirmed Panelists ({speakers.length})
                        </h5>
                      </div>
                      <span className="text-[11px] text-cream-400">
                        {panel.category} Track
                      </span>
                    </div>

                    {speakers.length === 0 ? (
                      <div className="p-6 text-center text-xs text-cream-400 bg-wine-950/40 rounded-xl border border-wine-800/40">
                        Panelists for this symposium will be announced shortly.
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
                              <p className="text-xs text-cream-300/80 leading-snug line-clamp-2 mb-3">
                                {speaker.designation}
                              </p>
                            </div>

                            {/* Focus Tags */}
                            {speaker.tags && speaker.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-2.5 border-t border-wine-800/60 mt-auto">
                                {speaker.tags.slice(0, 2).map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-[10px] px-2 py-0.5 rounded-md bg-wine-900/60 text-cream-300/90 border border-wine-800/70"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
