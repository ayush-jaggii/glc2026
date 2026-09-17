'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  PANELISTS_DATA,
  PANEL_TRACKS,
  FEATURED_ACCORDION_ITEMS,
  Panelist,
} from '@/data/panelistsData'
import { TailwindImageAccordion } from './ui/tailwind-image-accordion'
import { EVENT_DETAILS } from '@/data/eventData'
import { calculateTimeRemaining, TimeRemaining } from '@/lib/countdown'
import {
  Linkedin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Search,
  LayoutGrid,
  SlidersHorizontal,
  Sparkles,
  Users,
  Clock,
  ArrowRight,
} from 'lucide-react'

export default function SpeakerReveal() {
  const [selectedTrack, setSelectedTrack] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel')
  const [isMounted, setIsMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false,
  })

  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
    const updateCountdown = () => {
      setTimeLeft(calculateTimeRemaining(EVENT_DETAILS.targetDateIso))
    }
    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  // Filter panelists based on track and search query
  const filteredPanelists = PANELISTS_DATA.filter((panelist) => {
    const matchesTrack =
      selectedTrack === 'ALL' || panelist.trackCode === selectedTrack
    const query = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !query ||
      panelist.name.toLowerCase().includes(query) ||
      panelist.company.toLowerCase().includes(query) ||
      panelist.designation.toLowerCase().includes(query) ||
      panelist.trackName.toLowerCase().includes(query)

    return matchesTrack && matchesSearch
  })

  // Scroll carousel left/right
  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  // Track badge style helper
  const getTrackBadge = (trackCode: Panelist['trackCode']) => {
    const track = PANEL_TRACKS.find((t) => t.code === trackCode)
    return {
      bg: track?.badgeBg || 'bg-wine-900/80',
      border: track?.badgeBorder || 'border-wine-700/60',
      text: track?.badgeText || 'text-cream-200',
      shortTitle: track?.shortTitle || trackCode,
    }
  }

  return (
    <div id="speakers" className="relative space-y-16">
      
      {/* 1. Header & Summit Countdown Banner */}
      <div className="rounded-2xl p-6 sm:p-10 bg-gradient-to-br from-[#1A0415] via-[#10020D] to-[#080006] border border-wine-800/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-glc-magenta/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-glc-orange/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-widest bg-wine-900/90 text-glc-pink border border-wine-700/80 mb-5">
            <Users className="w-3.5 h-3.5" />
            <span>26+ Confirmed Industry Leaders · 6 Symposia Tracks</span>
          </div>

          <h3 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-cream-50 uppercase mb-4 font-sans">
            THE LEADERSHIP CONFLUENCE
          </h3>

          <p className="text-sm sm:text-base text-cream-200/90 max-w-2xl mx-auto leading-relaxed mb-8">
            Global Chief Executives, Managing Directors, and Industry Chairs converging on October 10, 2026 to architect resilient enterprise paradigms.
          </p>

          {/* Live Countdown Ribbon */}
          {isMounted && (
            <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 px-6 py-3.5 rounded-xl bg-black/40 border border-wine-800/70 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-mono text-cream-300 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-glc-orange shrink-0 animate-pulse" />
                <span className="hidden sm:inline">Opening in:</span>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 font-mono">
                <div className="text-center">
                  <span className="text-lg sm:text-xl font-bold text-cream-50">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase text-glc-magenta ml-1">d</span>
                </div>
                <span className="text-wine-600">:</span>
                <div className="text-center">
                  <span className="text-lg sm:text-xl font-bold text-cream-50">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase text-glc-pink ml-1">h</span>
                </div>
                <span className="text-wine-600">:</span>
                <div className="text-center">
                  <span className="text-lg sm:text-xl font-bold text-cream-50">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase text-glc-orange ml-1">m</span>
                </div>
                <span className="text-wine-600">:</span>
                <div className="text-center">
                  <span className="text-lg sm:text-xl font-bold text-glc-orange">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase text-cream-300 ml-1">s</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Featured Leadership Showcase (Tailwind Image Accordion Asset) */}
      <div className="relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 px-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-glc-orange mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Executive Spotlight</span>
            </div>
            <h4 className="text-2xl sm:text-3xl font-bold text-cream-50 tracking-tight">
              Featured Summit Chairs & Keynotes
            </h4>
            <p className="text-xs sm:text-sm text-cream-300 mt-1 max-w-xl">
              Hover over or tap any leader to expand their profile, strategic focus, and connect directly on LinkedIn.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-cream-400">
            <span>Hover card to expand</span>
            <ArrowRight className="w-3.5 h-3.5 text-glc-magenta" />
          </div>
        </div>

        {/* Integration of tailwind-image-accordion */}
        <TailwindImageAccordion items={FEATURED_ACCORDION_ITEMS} className="mb-6" />
      </div>

      {/* 3. Interactive Symposia Directory & Scrolling Carousel */}
      <div className="rounded-2xl p-6 sm:p-10 bg-[#11020E] border border-wine-800/80 shadow-2xl relative">
        
        {/* Controls & Filter Bar */}
        <div className="flex flex-col gap-6 mb-8">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-glc-magenta mb-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Symposia Panelists Roster</span>
              </div>
              <h4 className="text-2xl sm:text-3xl font-bold text-cream-50 tracking-tight">
                All Participating Panelists ({PANELISTS_DATA.length})
              </h4>
            </div>

            {/* View Mode and Navigation Buttons */}
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cream-400" />
                <input
                  type="text"
                  placeholder="Search name, company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-wine-950/80 border border-wine-700/80 text-xs text-cream-100 placeholder:text-cream-400 focus:outline-none focus:border-glc-magenta transition-colors"
                />
              </div>

              {/* Grid / Carousel Toggle */}
              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'carousel' ? 'grid' : 'carousel')}
                className="p-2 rounded-lg bg-wine-900/60 hover:bg-wine-800/80 border border-wine-700/80 text-cream-200 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
                title={viewMode === 'carousel' ? 'Switch to Grid view' : 'Switch to Carousel view'}
              >
                <LayoutGrid className="w-4 h-4 text-glc-pink" />
                <span className="hidden sm:inline capitalize">{viewMode}</span>
              </button>

              {/* Carousel Left/Right Buttons */}
              {viewMode === 'carousel' && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => scroll('left')}
                    aria-label="Scroll left"
                    className="p-2 rounded-lg bg-wine-900/60 hover:bg-wine-800 border border-wine-700/80 text-cream-100 hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scroll('right')}
                    aria-label="Scroll right"
                    className="p-2 rounded-lg bg-wine-900/60 hover:bg-wine-800 border border-wine-700/80 text-cream-100 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Track Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedTrack('ALL')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 border ${
                selectedTrack === 'ALL'
                  ? 'bg-gradient-to-r from-glc-magenta to-glc-orange text-white border-transparent shadow-md'
                  : 'bg-wine-950/70 text-cream-300 border-wine-800/80 hover:bg-wine-900/70 hover:text-white'
              }`}
            >
              All Tracks ({PANELISTS_DATA.length})
            </button>

            {PANEL_TRACKS.map((track) => {
              const count = PANELISTS_DATA.filter((p) => p.trackCode === track.code).length
              const isActive = selectedTrack === track.code

              return (
                <button
                  key={track.code}
                  type="button"
                  onClick={() => setSelectedTrack(track.code)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 border flex items-center gap-1.5 ${
                    isActive
                      ? `${track.badgeBg} ${track.badgeText} ${track.badgeBorder} ring-1 ring-glc-magenta/40 shadow-md`
                      : 'bg-wine-950/70 text-cream-300 border-wine-800/80 hover:bg-wine-900/70 hover:text-white'
                  }`}
                >
                  <span>{track.shortTitle}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 text-cream-400">
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

        </div>

        {/* 4. Panelists Display: Carousel or Grid */}
        {filteredPanelists.length === 0 ? (
          <div className="py-16 text-center text-cream-300 text-sm">
            No panelists found matching your search. Try adjusting the query or track filter.
          </div>
        ) : viewMode === 'carousel' ? (
          /* Horizontal Scrolling Carousel */
          <div
            ref={carouselRef}
            className="flex gap-5 overflow-x-auto pb-6 pt-2 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-wine-700 scrollbar-track-wine-950/40"
          >
            {filteredPanelists.map((panelist) => (
              <PanelistCard key={`${panelist.trackCode}-${panelist.id}`} panelist={panelist} getBadge={getTrackBadge} isCarousel />
            ))}
          </div>
        ) : (
          /* Responsive Multi-column Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
            {filteredPanelists.map((panelist) => (
              <PanelistCard key={`${panelist.trackCode}-${panelist.id}`} panelist={panelist} getBadge={getTrackBadge} isCarousel={false} />
            ))}
          </div>
        )}

        {/* Carousel Scroll Indicator Footer */}
        {viewMode === 'carousel' && (
          <div className="mt-4 pt-4 border-t border-wine-900/60 flex items-center justify-between text-xs text-cream-400">
            <span>
              Showing {filteredPanelists.length} of {PANELISTS_DATA.length} industry leaders
            </span>
            <span className="hidden sm:inline font-mono text-[11px] text-cream-400/80">
              ← Scroll or swipe to explore all speakers →
            </span>
          </div>
        )}

      </div>

    </div>
  )
}

interface PanelistCardProps {
  panelist: Panelist
  getBadge: (code: Panelist['trackCode']) => {
    bg: string
    border: string
    text: string
    shortTitle: string
  }
  isCarousel?: boolean
}

function PanelistCard({ panelist, getBadge, isCarousel = true }: PanelistCardProps) {
  const badge = getBadge(panelist.trackCode)

  return (
    <article
      className={`group relative rounded-xl overflow-hidden bg-wine-950 border border-wine-800/80 hover:border-glc-magenta/70 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-glc-magenta/10 flex flex-col justify-end ${
        isCarousel ? 'w-[270px] sm:w-[290px] h-[390px] sm:h-[420px] flex-shrink-0 snap-start' : 'h-[390px] sm:h-[420px] w-full'
      }`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 bg-wine-950">
        <Image
          src={panelist.photo}
          alt={panelist.name}
          fill
          sizes="(max-width: 640px) 270px, 290px"
          className="object-cover object-top filter brightness-[0.92] contrast-[1.05] group-hover:scale-105 group-hover:brightness-100 transition-transform duration-500 ease-out"
        />
      </div>

      {/* Track Pill at Top */}
      <div className="absolute top-3.5 left-3.5 z-20">
        <span
          className={`inline-block text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md ${badge.bg} ${badge.border} ${badge.text} border shadow-lg backdrop-blur-md`}
        >
          {badge.shortTitle}
        </span>
      </div>

      {/* Gradient Overlays:
          Default subtle bottom vignette, intensifying on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none z-10" />

      {/* Content Container (Card Details Revealed on Hover) */}
      <div className="relative z-20 p-4 sm:p-5 flex flex-col justify-end">
        
        {/* Name */}
        <h4 className="text-lg sm:text-xl font-bold text-cream-50 group-hover:text-white transition-colors duration-200 flex items-center justify-between gap-2">
          <span>{panelist.name}</span>
          {panelist.linkedin && (
            <a
              href={panelist.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${panelist.name}'s LinkedIn profile`}
              onClick={(e) => e.stopPropagation()}
              className="text-cream-400 hover:text-[#0077B5] transition-colors p-1"
            >
              <Linkedin className="w-4 h-4 shrink-0" />
            </a>
          )}
        </h4>

        {/* Company Name */}
        <div className="text-xs font-mono font-medium text-glc-orange mt-0.5 truncate">
          {panelist.company}
        </div>

        {/* Designation (Revealed on hover / visible) */}
        <div className="text-xs text-cream-200/90 mt-1 line-clamp-2 leading-relaxed">
          {panelist.designation}
        </div>

        {/* Hover Action Details: LinkedIn Button & Symposia tag */}
        <div className="mt-3 pt-3 border-t border-wine-800/80 flex items-center justify-between gap-2 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-[10px] font-mono text-cream-400 truncate">
            {panelist.trackName}
          </span>

          {panelist.linkedin ? (
            <a
              href={panelist.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0077B5] hover:bg-[#006097] text-white text-[11px] font-medium transition-colors shadow-sm shrink-0"
            >
              <span>Connect</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-[10px] text-cream-400 font-mono">Confirmed</span>
          )}
        </div>

      </div>
    </article>
  )
}
