'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  PANELISTS_DATA,
  PANEL_TRACKS,
  FEATURED_ACCORDION_ITEMS,
} from '@/data/panelistsData'
import PanelistCard from './PanelistCard'
import { TailwindImageAccordion } from './ui/tailwind-image-accordion'
import { EVENT_DETAILS } from '@/data/eventData'
import { calculateTimeRemaining, TimeRemaining } from '@/lib/countdown'
import {
  Search,
  LayoutGrid,
  SlidersHorizontal,
  Sparkles,
  Users,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Compass,
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

  return (
    <div id="speakers" className="relative space-y-20 scroll-mt-24">
      
      {/* 1. Header & Summit Countdown Banner */}
      <div className="rounded-2xl p-6 sm:p-10 bg-gradient-to-br from-[#1A0415] via-[#10020D] to-[#080006] border border-wine-800/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-glc-magenta/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-glc-orange/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-widest bg-wine-900/90 text-glc-pink border border-wine-700/80 mb-5">
            <Users className="w-3.5 h-3.5" />
            <span>27 Confirmed Industry Leaders · 6 Symposia Tracks</span>
          </div>

          <h3 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-cream-50 uppercase mb-4 font-sans">
            THE LEADERSHIP CONFLUENCE
          </h3>

          <p className="text-sm sm:text-base text-cream-200/90 max-w-2xl mx-auto leading-relaxed mb-8">
            Distinguished Managing Directors, CXOs, and Symposia Chairs converging on October 10, 2026 to architect enterprise paradigms across 6 critical economic sectors.
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

      {/* 2. Continuous Ambient Scrolling Marquee ("Scrolling Past") */}
      <div className="relative overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 py-4">
        {/* Section Tagline */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-glc-magenta opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-glc-magenta"></span>
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-cream-300">
              Live Executive Stream · Hover to Pause & Inspect
            </span>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-mono text-cream-400">
            27 Industry Chairs & Speakers
          </span>
        </div>

        {/* Ambient Marquee with Masked Gradient Edges */}
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
          <div className="animate-marquee flex gap-5 py-2">
            {PANELISTS_DATA.map((panelist, idx) => (
              <PanelistCard
                key={`marquee-1-${panelist.id}-${idx}`}
                panelist={panelist}
                isCarousel
              />
            ))}
            {PANELISTS_DATA.map((panelist, idx) => (
              <PanelistCard
                key={`marquee-2-${panelist.id}-${idx}`}
                panelist={panelist}
                isCarousel
              />
            ))}
          </div>
        </div>
      </div>

      {/* 3. Featured Leadership Spotlight (Accordion) */}
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

      {/* 4. Interactive Symposia Directory (Track Filtered Carousel & Grid) */}
      <div className="rounded-2xl p-6 sm:p-10 bg-[#11020E] border border-wine-800/80 shadow-2xl relative">
        
        {/* Controls & Filter Bar */}
        <div className="flex flex-col gap-6 mb-8">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-glc-magenta mb-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Symposia Panelists Roster</span>
              </div>
              <h4 className="text-2xl sm:text-3xl font-bold text-cream-50 tracking-tight flex items-center gap-3">
                <span>All Confirmed Panelists</span>
                <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-wine-900/90 text-glc-pink border border-wine-700/80">
                  {filteredPanelists.length} of {PANELISTS_DATA.length}
                </span>
              </h4>
            </div>

            {/* View Mode and Navigation Controls */}
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

        {/* Panelists Display: Carousel or Grid */}
        {filteredPanelists.length === 0 ? (
          <div className="py-16 text-center text-cream-300 text-sm flex flex-col items-center gap-2">
            <Compass className="w-8 h-8 text-cream-400/60 mb-1" />
            <p>No panelists found matching &ldquo;{searchQuery}&rdquo;</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedTrack('ALL')
              }}
              className="mt-2 text-xs font-mono text-glc-magenta hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : viewMode === 'carousel' ? (
          /* Horizontal Scrolling Carousel */
          <div
            ref={carouselRef}
            className="flex gap-5 overflow-x-auto pb-6 pt-2 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-wine-700 scrollbar-track-wine-950/40"
          >
            {filteredPanelists.map((panelist) => (
              <PanelistCard
                key={`${panelist.trackCode}-${panelist.id}`}
                panelist={panelist}
                isCarousel
              />
            ))}
          </div>
        ) : (
          /* Responsive Multi-column Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
            {filteredPanelists.map((panelist) => (
              <PanelistCard
                key={`${panelist.trackCode}-${panelist.id}`}
                panelist={panelist}
                isCarousel={false}
              />
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
