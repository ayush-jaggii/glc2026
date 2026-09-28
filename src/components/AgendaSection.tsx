'use client'

import React from 'react'

interface ScheduleEntry {
  time: string
  title: string
  isBreak?: boolean
}

const SCHEDULE: ScheduleEntry[] = [
  { time: '09:30 AM', title: 'Inaugural Ceremony' },
  { time: '09:50 AM', title: 'Welcome Address by Dean, TAPMI Bengaluru' },
  { time: '10:05 AM', title: 'Address by Pro Vice-Chancellor, MAHE Bengaluru' },
  { time: '10:15 AM', title: 'Keynote Address & Felicitation' },
  { time: '10:50 AM', title: 'Tea Break', isBreak: true },
  { time: '11:00 AM', title: 'Panel 1 — IT (Ctrl + Alt + Global)' },
  { time: '12:15 PM', title: 'Panel 2 — FMCG (Aisle Be There)' },
  { time: '01:20 PM', title: 'Lunch Break', isBreak: true },
  { time: '02:30 PM', title: 'Panel 3 — Automotive & EV (Shifting Gears)' },
  { time: '03:45 PM', title: 'Panel 4 — BFSI (Capital Without Borders)' },
  { time: '05:00 PM', title: 'Panel 5 — Media & Marketing (Going Viral, Staying Local)' },
  { time: '06:00 PM', title: 'High Tea', isBreak: true },
  { time: '06:15 PM', title: 'GLC Excellence Awards' },
  { time: '06:40 PM', title: 'Vote of Thanks & National Anthem' },
  { time: '08:00 PM', title: 'Gala Dinner', isBreak: true },
]

export default function AgendaSection() {
  return (
    <section
      id="agenda"
      className="relative py-24 sm:py-32 bg-wine-950 overflow-hidden border-t border-wine-800/80 scroll-mt-24"
    >
      {/* Background Radial Glow Matching Other Sections */}
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
        
        {/* Section Header: Identical Typography and Structure to Venue, Past Editions, etc. */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream-50 uppercase mb-4">
            Conference Agenda
          </h2>
          <p className="text-sm sm:text-base text-cream-300 leading-relaxed">
            Official flow of events for Global Leadership Conference 4.0 · 10 October 2026
          </p>
        </div>

        {/* Schedule Card Container: Matching Dark Glassmorphism and Borders */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-[#13030F] border border-wine-800 shadow-2xl overflow-hidden divide-y divide-wine-800/60">
          {SCHEDULE.map((item, index) => (
            <div
              key={index}
              className={`px-6 sm:px-10 py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8 transition-colors duration-150 ${
                item.isBreak
                  ? 'bg-wine-950/40 text-cream-400'
                  : 'hover:bg-wine-900/40 text-cream-100'
              }`}
            >
              <div
                className={`sm:w-36 shrink-0 text-xs sm:text-sm font-bold tracking-wider uppercase ${
                  item.isBreak ? 'text-cream-400' : 'text-[#ffc5b6]'
                }`}
              >
                {item.time}
              </div>
              <div
                className={`text-sm sm:text-base font-semibold leading-relaxed tracking-wide ${
                  item.isBreak ? 'italic text-cream-300/80 font-normal' : 'text-cream-50'
                }`}
              >
                {item.title}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
