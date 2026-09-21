'use client'

import React from 'react'
import Image from 'next/image'
import { Panelist, PANEL_TRACKS } from '@/data/panelistsData'
import { Linkedin, ExternalLink, Layers } from 'lucide-react'

interface PanelistCardProps {
  panelist: Panelist
  isCarousel?: boolean
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
  BFSI: {
    number: '03',
    title: 'Capital Without Borders',
    subtitle: 'Global Liquidity & International Settlement',
  },
  Auto: {
    number: '04',
    title: 'Shifting Gears',
    subtitle: 'Clean-Tech Alliances & Trade Tariffs',
  },
  Media: {
    number: '05',
    title: 'Going Viral, Staying Local',
    subtitle: 'Cultural Resonance vs. International Scale',
  },
  CGD: {
    number: '02',
    title: 'Aisle Be There',
    subtitle: 'Global Supply Networks & Consumer Resonance',
  },
}

export default function PanelistCard({ panelist, isCarousel = false }: PanelistCardProps) {
  const track = PANEL_TRACKS.find((t) => t.code === panelist.trackCode)
  const badgeBg = track?.badgeBg || 'bg-wine-900/80'
  const badgeBorder = track?.badgeBorder || 'border-wine-700/60'
  const badgeText = track?.badgeText || 'text-cream-200'
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

  return (
    <article
      className={`group relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#180415] to-[#0A0207] border border-wine-800/80 hover:border-glc-magenta transition-all duration-500 shadow-xl hover:shadow-[0_20px_45px_-10px_rgba(244,81,151,0.4)] flex flex-col justify-end text-left hover:scale-[1.03] hover:z-30 cursor-pointer ${
        isCarousel
          ? 'w-[280px] sm:w-[300px] h-[410px] sm:h-[440px] flex-shrink-0 snap-start'
          : 'h-[410px] sm:h-[440px] w-full'
      }`}
    >
      {/* 1. Background Speaker Portrait or Monogram Avatar */}
      <div className="absolute inset-0 bg-wine-950 overflow-hidden">
        {panelist.photo ? (
          <Image
            src={panelist.photo}
            alt={panelist.name}
            fill
            sizes="(max-width: 640px) 280px, 300px"
            className="object-cover object-top filter grayscale contrast-[1.18] brightness-[0.85] group-hover:grayscale-0 group-hover:contrast-[1.05] group-hover:brightness-100 group-hover:scale-105 transition-all duration-500 ease-out"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-wine-900/60 via-wine-950 to-black">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold tracking-wider border shadow-2xl mb-2 group-hover:scale-110 transition-transform duration-300"
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
      <div className="absolute top-3.5 left-3.5 z-20">
        <span
          className="inline-block text-[11px] font-medium tracking-wide px-2.5 py-1 rounded-md bg-black/60 border border-white/20 text-white shadow-lg backdrop-blur-md"
        >
          {shortTitle}
        </span>
      </div>

      {/* 3. Deep Cinematic Bottom Vignette Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#090106] via-[#090106]/70 to-transparent opacity-90 group-hover:opacity-98 transition-opacity duration-300 pointer-events-none z-10" />

      {/* 4. Interactive Expanding Details Overlay */}
      <div className="relative z-20 p-4 sm:p-5 flex flex-col justify-end bg-gradient-to-t from-[#0A0108] via-[#0A0108]/90 to-transparent">
        
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
              className="text-cream-400 hover:text-[#0077B5] hover:scale-110 transition-all p-1 -mr-1 shrink-0"
            >
              <Linkedin className="w-4 h-4 shrink-0" />
            </a>
          )}
        </div>

        {/* Company Organization */}
        <div className="text-xs font-semibold text-glc-orange mt-0.5 truncate">
          {panelist.company}
        </div>

        {/* Corporate Designation */}
        <div className="text-xs text-cream-200/90 mt-1 leading-relaxed font-normal group-hover:line-clamp-none line-clamp-1 transition-all">
          {panelist.designation}
        </div>

        {/* Expanded Panel Details - Reveals on Hover */}
        <div className="max-h-0 group-hover:max-h-48 opacity-0 group-hover:opacity-100 overflow-hidden transition-all duration-400 ease-out pt-0 group-hover:pt-3">
          
          {/* Panel Info Box */}
          <div className="rounded-xl p-3 bg-wine-950/95 border border-wine-700/80 shadow-inner mb-3">
            <div className="text-xs font-bold text-cream-100 leading-snug">
              {panelInfo.title}
            </div>
            <div className="text-[11px] text-cream-300/90 mt-0.5 leading-tight">
              {panelInfo.subtitle}
            </div>
          </div>

          {/* Direct LinkedIn Button */}
          {panelist.linkedin && (
            <a
              href={panelist.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#0077B5] hover:bg-[#005E93] text-white text-xs font-semibold transition-all duration-200 shadow-md"
            >
              <Linkedin className="w-3.5 h-3.5 shrink-0" />
              <span>Connect on LinkedIn</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          )}

        </div>

      </div>
    </article>
  )
}
