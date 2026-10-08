'use client'

import React from 'react'
import Image from 'next/image'
import { Panelist, PANEL_TRACKS } from '@/data/panelistsData'
import { Linkedin, ExternalLink, X } from 'lucide-react'

interface PanelistCardProps {
  panelist: Panelist
  isCarousel?: boolean
  isExpanded?: boolean
  onToggleExpand?: (panelistId: string) => void
}

const TRACK_PANEL_MAP: Record<string, { number: string; title: string; subtitle: string }> = {
  IT: {
    number: '01',
    title: 'Ctrl + Alt + Global',
    subtitle: 'Cross-Border Tech Architecture & AI',
  },
  FMCG: {
    number: '02',
    title: 'Aisle Be There',
    subtitle: 'Global Supply Networks & Consumer Resonance',
  },
  Media: {
    number: '03',
    title: 'Going Viral, Staying Local',
    subtitle: 'Cultural Resonance vs. International Scale',
  },
  BFSI: {
    number: '04',
    title: 'Capital Without Borders',
    subtitle: 'Global Liquidity & International Settlement',
  },
  Auto: {
    number: '05',
    title: 'Shifting Gears',
    subtitle: 'Clean-Tech Alliances & Trade Tariffs',
  },
  CGD: {
    number: 'RT',
    title: 'Executive Roundtable',
    subtitle: 'Closed Group Strategic Discussion',
  },
}

export default function PanelistCard({
  panelist,
  isCarousel = false,
  isExpanded = false,
  onToggleExpand,
}: PanelistCardProps) {
  const track = PANEL_TRACKS.find((t) => t.code === panelist.trackCode)
  const trackColor = track?.color || '#F45197'
  const shortTitle = track?.shortTitle || panelist.trackCode
  const panelInfo = TRACK_PANEL_MAP[panelist.trackCode] || {
    number: '01',
    title: panelist.trackName,
    subtitle: 'Strategic Colloquium Panel',
  }

  // Compute initials for monogram placeholder
  const initials = panelist.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleExpand?.(panelist.id)
  }

  return (
    <article
      onClick={handleClick}
      className={`group relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#180415] to-[#0A0207] border ${
        isExpanded
          ? 'border-glc-magenta ring-2 ring-glc-magenta/50 shadow-[0_20px_45px_-10px_rgba(244,81,151,0.5)]'
          : 'border-wine-800/80 hover:border-glc-magenta'
      } transition-all duration-300 shadow-xl flex flex-col justify-end text-left cursor-pointer transform-gpu [backface-visibility:hidden] ${
        isCarousel
          ? 'w-[250px] sm:w-[300px] h-[370px] sm:h-[440px] flex-shrink-0'
          : 'h-[370px] sm:h-[440px] w-full'
      }`}
    >
      {/* 1. Background Speaker Portrait */}
      <div className="absolute inset-0 bg-wine-950 overflow-hidden">
        {panelist.photo ? (
          <Image
            src={panelist.photo}
            alt={panelist.name}
            fill
            priority={!isCarousel}
            sizes="(max-width: 640px) 280px, 300px"
            className="object-cover object-top filter grayscale contrast-[1.18] brightness-[0.85] group-hover:grayscale-0 group-hover:contrast-[1.05] group-hover:brightness-100 group-hover:scale-105 transition-all duration-500 ease-out"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-wine-900/60 via-wine-950 to-black">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold tracking-wider border shadow-2xl mb-2"
              style={{
                backgroundColor: `${trackColor}15`,
                borderColor: `${trackColor}50`,
                color: trackColor,
              }}
            >
              {initials}
            </div>
          </div>
        )}
      </div>

      {/* 2. Top-Left Track Tag Pill */}
      <div className="absolute top-3.5 left-3.5 z-20 transform-gpu [transform:translateZ(25px)]">
        <span className="inline-block text-[11px] font-medium tracking-wide px-2.5 py-1 rounded-md bg-black/70 border border-white/20 text-white shadow-lg backdrop-blur-md">
          {shortTitle}
        </span>
      </div>

      {/* 3. Deep Cinematic Bottom Vignette Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#090106] via-[#090106]/75 to-transparent opacity-95 pointer-events-none z-10 transform-gpu [transform:translateZ(10px)]" />

      {/* 4. Default Bottom Summary Overlay (Always visible on mobile & desktop) */}
      <div className="absolute inset-x-0 bottom-0 z-20 p-4 sm:p-5 flex flex-col justify-end bg-gradient-to-t from-[#0A0108] via-[#0A0108]/90 to-transparent transform-gpu [transform:translateZ(20px)]">
        {/* Name & Quick LinkedIn Icon */}
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-base sm:text-lg font-bold text-cream-50 group-hover:text-white transition-colors duration-200 leading-snug">
            {panelist.name}
          </h4>
          {panelist.linkedin && (
            <a
              href={panelist.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${panelist.name}'s LinkedIn profile`}
              onClick={(e) => e.stopPropagation()}
              className="text-cream-400 hover:text-[#0077B5] hover:scale-110 active:scale-95 transition-all p-1.5 -mr-1 shrink-0 relative z-30 cursor-pointer"
            >
              <Linkedin className="w-4 h-4 shrink-0" />
            </a>
          )}
        </div>

        {/* Company Organization */}
        {panelist.company && (
          <div className="text-xs font-semibold text-glc-orange mt-0.5 truncate">
            {panelist.company}
          </div>
        )}

        {/* Corporate Designation */}
        <div className="text-xs text-cream-200/90 mt-1 leading-relaxed font-normal line-clamp-1">
          {panelist.designation}
        </div>

        {/* Desktop subtle click hint */}
        <div className="hidden sm:block max-h-0 group-hover:max-h-24 opacity-0 group-hover:opacity-100 overflow-hidden transition-all duration-300 pt-0 group-hover:pt-2">
          <span className="text-[10px] text-cream-400 uppercase tracking-wider font-semibold">
            Click to view session details →
          </span>
        </div>
      </div>

      {/* 5. Expanded Full-Card Details Sheet (Reveals on Click/Tap) */}
      {isExpanded && (
        <div
          className="absolute inset-0 z-40 p-4 sm:p-5 flex flex-col justify-between bg-gradient-to-b from-[#180415]/98 via-[#120210]/98 to-[#090107]/98 backdrop-blur-xl border border-glc-magenta/50 rounded-2xl transform-gpu [transform:translateZ(30px)] animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Row: Track Badge + Close Button */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-glc-magenta/20 border border-glc-magenta/40 text-glc-magenta">
              {shortTitle}
            </span>
            <button
              onClick={handleClick}
              aria-label="Close details"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:bg-glc-magenta/30 flex items-center justify-center text-cream-200 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Middle: Speaker Info & Panel Topic */}
          <div className="my-auto space-y-3">
            <div>
              <h4 className="text-lg sm:text-xl font-extrabold text-cream-50 leading-tight">
                {panelist.name}
              </h4>
              {panelist.company && (
                <div className="text-xs sm:text-sm font-semibold text-glc-orange mt-0.5">
                  {panelist.company}
                </div>
              )}
              <div className="text-xs text-cream-200/90 mt-1 leading-relaxed">
                {panelist.designation}
              </div>
            </div>

            {/* Panel Discussion Card */}
            <div className="rounded-xl p-3 bg-wine-950/90 border border-wine-700/80 shadow-inner">
              <div className="text-[10px] text-glc-magenta uppercase font-bold tracking-wider mb-0.5">
                Panel Session
              </div>
              <div className="text-xs font-bold text-cream-100 leading-snug">
                {panelInfo.title}
              </div>
              <div className="text-[11px] text-cream-300/90 mt-0.5 leading-tight">
                {panelInfo.subtitle}
              </div>
            </div>
          </div>

          {/* Footer: Prominent LinkedIn Button */}
          {panelist.linkedin && (
            <a
              href={panelist.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0077B5] hover:bg-[#005E93] text-white text-xs font-bold transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              <Linkedin className="w-4 h-4 shrink-0" />
              <span>Connect on LinkedIn</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          )}
        </div>
      )}
    </article>
  )
}
