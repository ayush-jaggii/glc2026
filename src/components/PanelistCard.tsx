'use client'

import React from 'react'
import Image from 'next/image'
import { Panelist, PANEL_TRACKS } from '@/data/panelistsData'
import { Linkedin, ExternalLink } from 'lucide-react'

interface PanelistCardProps {
  panelist: Panelist
  isCarousel?: boolean
}

export default function PanelistCard({ panelist, isCarousel = false }: PanelistCardProps) {
  const track = PANEL_TRACKS.find((t) => t.code === panelist.trackCode)
  const badgeBg = track?.badgeBg || 'bg-wine-900/80'
  const badgeBorder = track?.badgeBorder || 'border-wine-700/60'
  const badgeText = track?.badgeText || 'text-cream-200'
  const trackColor = track?.color || '#F45197'
  const shortTitle = track?.shortTitle || panelist.trackCode

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
      className={`group relative rounded-xl overflow-hidden bg-gradient-to-b from-[#180415] to-[#0A0207] border border-wine-800/80 hover:border-glc-magenta/80 transition-all duration-500 shadow-xl hover:shadow-[0_10px_35px_-10px_rgba(244,81,151,0.35)] flex flex-col justify-end text-left ${
        isCarousel
          ? 'w-[270px] sm:w-[290px] h-[390px] sm:h-[420px] flex-shrink-0 snap-start'
          : 'h-[390px] sm:h-[420px] w-full'
      }`}
    >
      {/* 1. Background Image or Clean Monogram Avatar */}
      <div className="absolute inset-0 bg-wine-950 overflow-hidden">
        {panelist.photo ? (
          <Image
            src={panelist.photo}
            alt={panelist.name}
            fill
            sizes="(max-width: 640px) 270px, 290px"
            className="object-cover object-top filter grayscale contrast-[1.22] brightness-[0.88] group-hover:grayscale-0 group-hover:contrast-[1.05] group-hover:brightness-105 group-hover:scale-105 transition-all duration-500 ease-out"
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
          className={`inline-block text-[11px] font-medium tracking-wide px-2.5 py-1 rounded-md ${badgeBg} ${badgeBorder} ${badgeText} border shadow-lg backdrop-blur-md`}
        >
          {shortTitle}
        </span>
      </div>

      {/* 3. Deep Cinematic Bottom Vignette Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#090106] via-[#090106]/65 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none z-10" />

      {/* 4. Speaker Details Overlay */}
      <div className="relative z-20 p-4 sm:p-5 flex flex-col justify-end">
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
        <div className="text-xs font-semibold text-glc-orange mt-1 truncate">
          {panelist.company}
        </div>

        {/* Corporate Designation */}
        <div className="text-xs text-cream-200/90 mt-1 line-clamp-2 leading-relaxed font-normal">
          {panelist.designation}
        </div>

        {/* Action Bar */}
        <div className="mt-3 pt-3 border-t border-wine-800/80 flex items-center justify-between gap-2 opacity-95 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-1 sm:group-hover:translate-y-0 transition-all duration-300">
          <span className="text-[11px] text-cream-400/90 truncate max-w-[140px]">
            {panelist.trackName}
          </span>

          {panelist.linkedin && (
            <a
              href={panelist.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0077B5] hover:bg-[#005E93] text-white text-[11px] font-medium transition-all duration-200 shadow-md shrink-0"
            >
              <Linkedin className="w-3 h-3" />
              <span>LinkedIn</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-80" />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
