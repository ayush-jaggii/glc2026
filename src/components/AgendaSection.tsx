'use client'

import React from 'react'

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

interface ScheduleEntry {
  time: string
  title: string
  isBreak?: boolean
  panelId?: string
  anchorId?: string
}

const SCHEDULE: ScheduleEntry[] = [
  { time: '09:30 AM', title: 'Inaugural Ceremony' },
  { time: '09:50 AM', title: 'Welcome Address by Dean, TAPMI Bengaluru' },
  { time: '10:05 AM', title: 'Address by Pro Vice-Chancellor, MAHE Bengaluru' },
  { time: '10:15 AM', title: 'Keynote Address & Felicitation' },
  { time: '10:50 AM', title: 'Tea Break', isBreak: true },
  { time: '11:00 AM', title: 'Panel 1 — IT (Ctrl + Alt + Global)', panelId: 'panel-1' },
  { time: '12:15 PM', title: 'Panel 2 — FMCG (Aisle Be There)', panelId: 'panel-2' },
  { time: '01:20 PM', title: 'Lunch Break', isBreak: true },
  { time: '02:30 PM', title: 'Panel 3 — Automotive & EV (Shifting Gears)', panelId: 'panel-4' },
  { time: '03:45 PM', title: 'Panel 4 — BFSI (Capital Without Borders)', panelId: 'panel-3' },
  { time: '05:00 PM', title: 'Panel 5 — Media & Marketing (Going Viral, Staying Local)', panelId: 'panel-5' },
  { time: '06:00 PM', title: 'High Tea', isBreak: true },
  { time: '06:15 PM', title: 'GLC Excellence Awards', anchorId: 'awards' },
  { time: '06:40 PM', title: 'Vote of Thanks & National Anthem' },
  { time: '08:00 PM', title: 'Gala Dinner', isBreak: true },
]

export default function AgendaSection() {
  const handleItemClick = (item: ScheduleEntry) => {
    if (item.panelId) {
      // Trigger auto-expansion in PanelReveal
      window.dispatchEvent(
        new CustomEvent('glc:open-panel', { detail: { panelId: item.panelId } })
      )
      const el = document.getElementById(item.panelId) || document.getElementById('panels')
      if (el) {
        const yOffset = -90
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    } else if (item.anchorId) {
      const el = document.getElementById(item.anchorId)
      if (el) {
        const yOffset = -90
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }
  }

  return (
    <section
      id="agenda"
      className="relative py-24 sm:py-32 bg-wine-950 overflow-hidden border-t border-wine-800/80 scroll-mt-24"
    >
      {/* Background Radial Glow */}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header: Pure title, zero fluff */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream-50 uppercase">
            Conference Agenda
          </h2>
        </div>

        {/* Schedule Card Container */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-[#13030F] border border-wine-800 shadow-2xl overflow-hidden divide-y divide-wine-800/60">
          {SCHEDULE.map((item, index) => {
            const isInteractive = Boolean(item.panelId || item.anchorId)

            return (
              <div
                key={index}
                onClick={isInteractive ? () => handleItemClick(item) : undefined}
                role={isInteractive ? 'button' : undefined}
                tabIndex={isInteractive ? 0 : undefined}
                onKeyDown={
                  isInteractive
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleItemClick(item)
                        }
                      }
                    : undefined
                }
                className={`group px-6 sm:px-10 py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6 transition-all duration-200 select-none ${
                  item.isBreak
                    ? 'bg-wine-950/40 text-cream-400'
                    : isInteractive
                    ? 'hover:bg-wine-900/50 cursor-pointer active:scale-[0.995]'
                    : 'text-cream-100'
                }`}
              >
                {/* Left: Time and Title */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8 min-w-0">
                  <div
                    className={`sm:w-36 shrink-0 text-xs sm:text-sm font-bold tracking-wider uppercase ${
                      item.isBreak ? 'text-cream-400' : 'text-[#ffc5b6]'
                    }`}
                  >
                    {item.time}
                  </div>
                  <div
                    className={`text-sm sm:text-base tracking-wide transition-colors ${
                      item.isBreak
                        ? 'italic text-cream-300/80 font-normal'
                        : isInteractive
                        ? 'font-semibold text-cream-50 group-hover:text-white'
                        : 'font-semibold text-cream-50'
                    }`}
                  >
                    {item.title}
                  </div>
                </div>

                {/* Right: Subtle arrow icon on interactive rows */}
                {isInteractive && (
                  <div className="shrink-0 text-cream-400/40 group-hover:text-glc-orange transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
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
