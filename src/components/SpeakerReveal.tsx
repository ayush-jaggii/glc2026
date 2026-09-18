'use client'

import React, { useState, useEffect } from 'react'
import { PANELISTS_DATA } from '@/data/panelistsData'
import PanelistCard from './PanelistCard'
import { EVENT_DETAILS } from '@/data/eventData'
import { calculateTimeRemaining, TimeRemaining } from '@/lib/countdown'
import {
  Users,
  Clock,
  Pause,
  Play,
} from 'lucide-react'

export default function SpeakerReveal() {
  const [isMounted, setIsMounted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false,
  })

  useEffect(() => {
    setIsMounted(true)
    const updateCountdown = () => {
      setTimeLeft(calculateTimeRemaining(EVENT_DETAILS.targetDateIso))
    }
    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div id="speakers" className="relative space-y-12 scroll-mt-24">
      
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

      {/* 2. Interactive Scrolling Past Carousel */}
      <div className="relative overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 py-4">
        {/* Stream Tagline & Pause Control */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-glc-magenta opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-glc-magenta"></span>
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-cream-200">
              Live Executive Stream · Hover any leader to highlight & connect
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-wine-900/70 hover:bg-wine-800 border border-wine-700/80 text-cream-300 hover:text-white text-xs font-mono transition-colors"
              title={isPaused ? 'Resume scrolling' : 'Pause scrolling'}
            >
              {isPaused ? (
                <>
                  <Play className="w-3 h-3 text-glc-orange fill-glc-orange" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3 text-glc-pink" />
                  <span>Pause</span>
                </>
              )}
            </button>
            <span className="hidden sm:inline-block text-[11px] font-mono text-cream-400">
              {PANELISTS_DATA.length} Industry Chairs & Panelists
            </span>
          </div>
        </div>

        {/* Continuous Smooth Scrolling Carousel with Masked Edges */}
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
          <div
            className="animate-marquee flex gap-5 py-3"
            style={{
              animationPlayState: isPaused ? 'paused' : undefined,
            }}
          >
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

    </div>
  )
}
