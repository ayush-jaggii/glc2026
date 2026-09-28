'use client'

import React from 'react'

const SCHEDULE = [
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
    <section id="agenda" className="py-24 sm:py-32 bg-wine-950 font-sans border-t border-wine-800/60">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        
        {/* Minimal Header */}
        <div className="mb-14 sm:mb-16">
          <p className="text-xs tracking-[0.25em] uppercase text-glc-rose font-medium mb-3">
            Schedule
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white">
            Agenda
          </h2>
        </div>

        {/* Minimal Schedule List */}
        <div className="divide-y divide-wine-800/40 border-t border-b border-wine-800/40">
          {SCHEDULE.map((item, index) => (
            <div
              key={index}
              className={`py-5 sm:py-6 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-12 transition-colors duration-150 ${
                item.isBreak
                  ? 'text-cream-400/70'
                  : 'text-cream-100 hover:text-white'
              }`}
            >
              <div className="sm:w-36 shrink-0 text-sm tracking-wide text-cream-400 font-normal">
                {item.time}
              </div>
              <div className={`text-base sm:text-lg font-light tracking-wide ${
                item.isBreak ? 'italic' : ''
              }`}>
                {item.title}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
