'use client'

import React, { useState, useEffect } from 'react'
import { PANELISTS_DATA } from '@/data/panelistsData'
import PanelistCard from './PanelistCard'
import { EVENT_DETAILS } from '@/data/eventData'
import { calculateTimeRemaining, TimeRemaining } from '@/lib/countdown'
import { Clock } from 'lucide-react'

export default function SpeakerReveal() {
  const [isMounted, setIsMounted] = useState(false)
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
      
      {/* Header & Summit Countdown Banner */}
      <div className="rounded-2xl p-6 sm:p-10 bg-gradient-to-br from-[#1A0415] via-[#10020D] to-[#080006] border border-wine-800/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-glc-magenta/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-glc-orange/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-cream-50 uppercase mb-4">
            Speakers
          </h2>

          <p className="text-sm sm:text-base text-cream-200/90 max-w-2xl mx-auto leading-relaxed mb-8">
            Distinguished industry chairs, managing directors, and senior leaders addressing global business transformation across 6 core industry symposia.
          </p>

          {/* Clean Countdown Ribbon */}
          {isMounted && (
            <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 px-6 py-3.5 rounded-xl bg-black/40 border border-wine-800/70 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-medium text-cream-300 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-glc-orange shrink-0 animate-pulse" />
                <span className="hidden sm:inline">Opening in:</span>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 font-semibold text-sm">
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

      {/* Smooth Continuous Scrolling Carousel with Masked Edges */}
      <div className="relative overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 py-4">
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
          <div className="animate-marquee flex gap-5 py-3">
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
