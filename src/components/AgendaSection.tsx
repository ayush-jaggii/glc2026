'use client'

import React, { useState } from 'react'

interface ScheduleSession {
  id: string
  time: string
  duration: string
  durationMin: number
  title: string
  type: 'panel' | 'break' | 'keynote' | 'address' | 'ceremony' | 'awards'
  panelId?: string
  anchorId?: string
}

const SESSIONS: ScheduleSession[] = [
  { id: 's-reporting', time: '08:30 AM', duration: '30m', durationMin: 30, title: 'Reporting Time for Students', type: 'ceremony' },
  { id: 's-inaugural', time: '09:30 AM', duration: '20m', durationMin: 20, title: 'Inaugural Ceremony & Lighting of the Lamp', type: 'ceremony' },
  { id: 's-dean', time: '09:50 AM', duration: '10m', durationMin: 10, title: 'Welcome Address by Dean, TAPMI Bengaluru', type: 'address' },
  { id: 's-vc', time: '10:00 AM', duration: '10m', durationMin: 10, title: 'Address by Pro Vice-Chancellor, MAHE Bengaluru', type: 'address' },
  { id: 's-keynote', time: '10:10 AM', duration: '15m', durationMin: 15, title: 'Keynote Address', type: 'keynote' },
  { id: 's-felicitation', time: '10:25 AM', duration: '5m', durationMin: 5, title: 'Felicitation to Keynote Speaker', type: 'ceremony' },
  { id: 's-tea1', time: '10:30 AM', duration: '30m', durationMin: 30, title: 'Morning Tea Break', type: 'break' },
  { id: 's-panel1', time: '11:00 AM', duration: '1h 00m', durationMin: 60, title: 'Panel 1 — IT (Ctrl + Alt + Global)', type: 'panel', panelId: 'panel-1' },
  { id: 's-panel2', time: '12:15 PM', duration: '1h 00m', durationMin: 60, title: 'Panel 2 — FMCG (Aisle Be There)', type: 'panel', panelId: 'panel-2' },
  { id: 's-lunch', time: '01:20 PM', duration: '1h 00m', durationMin: 60, title: 'Networking Lunch', type: 'break' },
  { id: 's-panel3', time: '02:30 PM', duration: '1h 00m', durationMin: 60, title: 'Panel 3 — Automotive & EV (Shifting Gears)', type: 'panel', panelId: 'panel-4' },
  { id: 's-panel4', time: '03:45 PM', duration: '1h 00m', durationMin: 60, title: 'Panel 4 — BFSI (Capital Without Borders)', type: 'panel', panelId: 'panel-3' },
  { id: 's-panel5', time: '05:00 PM', duration: '1h 00m', durationMin: 60, title: 'Panel 5 — Media & Marketing (Going Viral, Staying Local)', type: 'panel', panelId: 'panel-5' },
  { id: 's-tea2', time: '06:00 PM', duration: '15m', durationMin: 15, title: 'High Tea', type: 'break' },
  { id: 's-awards', time: '06:15 PM', duration: '20m', durationMin: 20, title: 'GLC Excellence Awards', type: 'awards', anchorId: 'awards' },
  { id: 's-closing', time: '06:40 PM', duration: '10m', durationMin: 10, title: 'Vote of Thanks & National Anthem', type: 'ceremony' },
  { id: 's-dinner', time: '08:00 PM', duration: 'Evening', durationMin: 45, title: 'Gala Dinner', type: 'break' },
]

const TOTAL_MINUTES = SESSIONS.reduce((sum, s) => sum + s.durationMin, 0)

const ArrowUpRightIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
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

export default function AgendaSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const activeSession = SESSIONS.find((s) => s.id === hoveredId)

  const handleSessionClick = (session: ScheduleSession) => {
    if (session.panelId) {
      window.dispatchEvent(
        new CustomEvent('glc:open-panel', { detail: { panelId: session.panelId } })
      )
      const el = document.getElementById(session.panelId) || document.getElementById('panels')
      if (el) {
        const yOffset = -90
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    } else if (session.anchorId) {
      const el = document.getElementById(session.anchorId)
      if (el) {
        const yOffset = -90
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }
  }

  const scrollToCard = (id: string) => {
    const el = document.getElementById(`agenda-card-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <section
      id="agenda"
      className="relative py-24 sm:py-32 bg-wine-950 overflow-hidden border-t border-wine-800/80 scroll-mt-24 font-sans"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-glc-magenta/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-glc-orange/5 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Background Grid Texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header: Pure bold uppercase title */}
        <div className="text-center mb-12 sm:mb-14">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream-50 uppercase">
            Conference Agenda
          </h2>
        </div>

        {/* 1. Proportional Time Rail */}
        <div className="mb-10 p-4 sm:p-6 rounded-2xl bg-[#13030F] border border-wine-800 shadow-2xl">
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-cream-300/70 font-semibold tracking-wider uppercase mb-3">
            <span>08:30 AM</span>
            <span>12:00 PM</span>
            <span>03:00 PM</span>
            <span>06:00 PM</span>
            <span>08:00 PM+</span>
          </div>

          {/* Master Segmented Bar */}
          <div className="h-6 w-full bg-[#1B0615] rounded-lg p-0.5 flex gap-1 overflow-hidden border border-wine-800/90">
            {SESSIONS.map((item) => {
              const widthPct = (item.durationMin / TOTAL_MINUTES) * 100
              const isHovered = hoveredId === item.id
              const isPanel = item.type === 'panel'
              const isBreak = item.type === 'break'

              return (
                <div
                  key={item.id}
                  style={{ width: `${widthPct}%` }}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => {
                    setHoveredId(item.id)
                    scrollToCard(item.id)
                  }}
                  className={`h-full rounded-sm transition-all duration-200 cursor-pointer ${
                    isPanel
                      ? isHovered
                        ? 'bg-glc-magenta shadow-[0_0_12px_rgba(244,81,151,0.8)] scale-y-110'
                        : 'bg-glc-magenta/50 hover:bg-glc-magenta'
                      : isBreak
                      ? isHovered
                        ? 'bg-wine-600'
                        : 'bg-wine-800/60 hover:bg-wine-700'
                      : isHovered
                      ? 'bg-[#ffc5b6] shadow-[0_0_12px_rgba(255,197,182,0.8)] scale-y-110'
                      : 'bg-[#ffc5b6]/50 hover:bg-[#ffc5b6]'
                  }`}
                  title={`${item.time} — ${item.title} (${item.duration})`}
                />
              )
            })}
          </div>

          {/* Active Hover Label Strip */}
          <div className="mt-3 text-xs font-medium h-5 flex items-center justify-between">
            {activeSession ? (
              <>
                <span className="text-glc-magenta truncate font-semibold">
                  {activeSession.time} · {activeSession.title}
                </span>
                <span className="text-cream-400 text-[11px] shrink-0 ml-3">
                  {activeSession.duration}
                </span>
              </>
            ) : (
              <span className="text-cream-400/50 text-[11px] italic">
                Hover or tap any segment to explore day flow
              </span>
            )}
          </div>
        </div>

        {/* 2. Schedule List */}
        <div className="space-y-2.5">
          {SESSIONS.map((item) => {
            const isHovered = hoveredId === item.id
            const isPanel = item.type === 'panel'
            const isBreak = item.type === 'break'
            const isInteractive = Boolean(item.panelId || item.anchorId)

            if (isBreak) {
              return (
                <div
                  key={item.id}
                  id={`agenda-card-${item.id}`}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`py-3 px-5 sm:px-8 rounded-xl flex items-center justify-between text-xs transition-all duration-200 ${
                    isHovered
                      ? 'bg-wine-900/40 text-cream-200 border border-wine-700/60'
                      : 'text-cream-400/60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cream-400">
                      {item.time}
                    </span>
                    <span className="italic font-light text-cream-300/80">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-normal tracking-wide text-cream-400/60">
                    {item.duration}
                  </span>
                </div>
              )
            }

            return (
              <div
                key={item.id}
                id={`agenda-card-${item.id}`}
                onClick={isInteractive ? () => handleSessionClick(item) : undefined}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                role={isInteractive ? 'button' : undefined}
                tabIndex={isInteractive ? 0 : undefined}
                onKeyDown={
                  isInteractive
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleSessionClick(item)
                        }
                      }
                    : undefined
                }
                className={`group p-4 sm:p-5 rounded-xl border flex items-center justify-between gap-4 transition-all duration-200 select-none ${
                  isPanel
                    ? isHovered
                      ? 'border-glc-magenta/70 bg-[#1A0515] shadow-[0_0_24px_rgba(244,81,151,0.2)]'
                      : 'border-wine-800 bg-[#13030F] hover:border-glc-magenta/40 hover:bg-[#180413]'
                    : isHovered
                    ? 'border-[#ffc5b6]/60 bg-[#180413]'
                    : 'border-wine-800 bg-[#13030F] hover:border-wine-700'
                } ${isInteractive ? 'cursor-pointer' : ''}`}
              >
                {/* Left: Time, Duration & Title */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-6 min-w-0">
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-xs sm:text-sm font-bold text-[#ffc5b6] tracking-wider uppercase">
                      {item.time}
                    </span>
                    <span className="text-[11px] text-cream-400/60 font-medium">
                      {item.duration}
                    </span>
                  </div>

                  {/* Panel Title colored in GLC Magenta */}
                  <div
                    className={`text-sm sm:text-base tracking-wide truncate transition-colors ${
                      isPanel
                        ? 'font-bold text-glc-magenta group-hover:text-glc-pink'
                        : 'font-semibold text-cream-50 group-hover:text-white'
                    }`}
                  >
                    {item.title}
                  </div>
                </div>

                {/* Right: Minimal Arrow on interactive items */}
                {isInteractive && (
                  <div
                    className={`shrink-0 transition-all duration-200 ${
                      isPanel
                        ? 'text-glc-magenta/60 group-hover:text-glc-orange group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                        : 'text-cream-400/40 group-hover:text-glc-orange group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                    }`}
                  >
                    <ArrowUpRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
