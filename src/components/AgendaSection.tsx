'use client'

import React, { useState } from 'react'
import { Clock, MapPin, ChevronRight, Sparkles, Coffee, Utensils, Award, Mic, Users, Wine } from 'lucide-react'

interface AgendaItem {
  time: string
  title: string
  subtitle?: string
  venue: string
  category: 'inaugural' | 'keynote' | 'panel' | 'break' | 'awards' | 'dinner'
  panelNumber?: string
  tag: string
  anchorId?: string
}

const AGENDA_ITEMS: AgendaItem[] = [
  {
    time: '09:30 AM – 09:50 AM',
    title: 'Event Inauguration & Lamp Lighting',
    subtitle: 'Formal commencement of Global Leadership Conference 4.0',
    venue: 'Dr. Ramdas M. Pai Auditorium',
    category: 'inaugural',
    tag: 'Inaugural'
  },
  {
    time: '09:50 AM – 10:05 AM',
    title: 'Welcome Address',
    subtitle: 'Dean, TAPMI Bengaluru',
    venue: 'Dr. Ramdas M. Pai Auditorium',
    category: 'inaugural',
    tag: 'Address'
  },
  {
    time: '10:05 AM – 10:15 AM',
    title: 'Institutional Address',
    subtitle: 'Pro Vice-Chancellor, MAHE Bengaluru',
    venue: 'Dr. Ramdas M. Pai Auditorium',
    category: 'inaugural',
    tag: 'Address'
  },
  {
    time: '10:15 AM – 10:50 AM',
    title: 'Keynote Address & Speaker Felicitation',
    subtitle: 'Opening perspective on Business Beyond Borders',
    venue: 'Dr. Ramdas M. Pai Auditorium',
    category: 'keynote',
    tag: 'Keynote'
  },
  {
    time: '10:50 AM – 11:00 AM',
    title: 'Morning Tea Break',
    venue: 'Auditorium Foyer',
    category: 'break',
    tag: 'Networking'
  },
  {
    time: '11:00 AM – 12:00 PM',
    title: 'Panel 1: Information Technology',
    subtitle: 'Ctrl + Alt + Global',
    venue: 'Dr. Ramdas M. Pai Auditorium',
    category: 'panel',
    panelNumber: '01',
    tag: 'Panel 1',
    anchorId: 'panels'
  },
  {
    time: '12:15 PM – 01:15 PM',
    title: 'Panel 2: FMCG & Retail',
    subtitle: 'Aisle Be There',
    venue: 'Dr. Ramdas M. Pai Auditorium',
    category: 'panel',
    panelNumber: '02',
    tag: 'Panel 2',
    anchorId: 'panels'
  },
  {
    time: '01:20 PM – 02:20 PM',
    title: 'Networking Lunch',
    venue: 'Dining Hall',
    category: 'break',
    tag: 'Lunch'
  },
  {
    time: '02:30 PM – 03:30 PM',
    title: 'Panel 3: Automotive & Electric Mobility',
    subtitle: 'Shifting Gears',
    venue: 'Dr. Ramdas M. Pai Auditorium',
    category: 'panel',
    panelNumber: '03',
    tag: 'Panel 3',
    anchorId: 'panels'
  },
  {
    time: '03:45 PM – 04:45 PM',
    title: 'Panel 4: BFSI & Financial Markets',
    subtitle: 'Capital Without Borders',
    venue: 'Dr. Ramdas M. Pai Auditorium',
    category: 'panel',
    panelNumber: '04',
    tag: 'Panel 4',
    anchorId: 'panels'
  },
  {
    time: '05:00 PM – 06:00 PM',
    title: 'Panel 5: Media & Marketing',
    subtitle: 'Going Viral, Staying Local',
    venue: 'Dr. Ramdas M. Pai Auditorium',
    category: 'panel',
    panelNumber: '05',
    tag: 'Panel 5',
    anchorId: 'panels'
  },
  {
    time: '06:00 PM – 06:15 PM',
    title: 'High Tea',
    venue: 'Auditorium Foyer',
    category: 'break',
    tag: 'Networking'
  },
  {
    time: '06:15 PM – 06:35 PM',
    title: 'GLC Excellence Awards 2026',
    subtitle: 'Recognizing trailblazing organizational excellence & innovation',
    venue: 'Dr. Ramdas M. Pai Auditorium',
    category: 'awards',
    tag: 'Awards',
    anchorId: 'awards'
  },
  {
    time: '06:40 PM – 06:47 PM',
    title: 'Vote of Thanks & Concluding Ceremony',
    subtitle: 'Closing remarks and National Anthem',
    venue: 'Dr. Ramdas M. Pai Auditorium',
    category: 'inaugural',
    tag: 'Closing'
  },
  {
    time: '08:00 PM Onwards',
    title: 'Gala Dinner & Networking Soirée',
    subtitle: 'Exclusive evening reception for delegates and speakers',
    venue: 'Banquet Grounds',
    category: 'dinner',
    tag: 'Dinner'
  }
]

type FilterType = 'all' | 'panels' | 'keynotes'

export default function AgendaSection() {
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredItems = AGENDA_ITEMS.filter((item) => {
    if (filter === 'panels') return item.category === 'panel'
    if (filter === 'keynotes') return item.category === 'keynote' || item.category === 'inaugural' || item.category === 'awards'
    return true
  })

  const getBadgeStyle = (category: AgendaItem['category']) => {
    switch (category) {
      case 'panel':
        return 'bg-glc-magenta/15 text-glc-magenta border-glc-magenta/30'
      case 'keynote':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30'
      case 'awards':
        return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30'
      case 'break':
        return 'bg-cream-100/10 text-cream-300 border-cream-100/20'
      case 'dinner':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30'
      default:
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30'
    }
  }

  const getCategoryIcon = (category: AgendaItem['category']) => {
    switch (category) {
      case 'panel':
        return <Users className="w-4 h-4 text-glc-magenta" />
      case 'keynote':
        return <Mic className="w-4 h-4 text-amber-300" />
      case 'awards':
        return <Award className="w-4 h-4 text-yellow-300" />
      case 'break':
        return <Coffee className="w-4 h-4 text-cream-300" />
      case 'dinner':
        return <Wine className="w-4 h-4 text-purple-300" />
      default:
        return <Sparkles className="w-4 h-4 text-rose-300" />
    }
  }

  return (
    <section id="agenda" className="relative py-20 sm:py-28 bg-wine-950 overflow-hidden border-t border-wine-800/60">
      {/* Background radial atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-glc-magenta/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-glc-orange/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Clean, direct, no marketing fluff */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-10 border-b border-wine-800/80">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-glc-rose mb-2.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Event Schedule</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono uppercase font-bold text-cream-50 tracking-tight">
              Conference Agenda
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-cream-300/80 font-mono">
              Saturday, 10 October 2026 · Dr. Ramdas M. Pai Auditorium
            </p>
          </div>

          {/* Quick filter tabs */}
          <div className="inline-flex p-1 rounded-lg bg-wine-900/60 border border-wine-800/80 self-start sm:self-auto text-xs font-mono">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-md transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-glc-magenta text-white font-semibold shadow-md'
                  : 'text-cream-300 hover:text-white'
              }`}
            >
              All ({AGENDA_ITEMS.length})
            </button>
            <button
              onClick={() => setFilter('panels')}
              className={`px-3.5 py-1.5 rounded-md transition-all duration-200 ${
                filter === 'panels'
                  ? 'bg-glc-magenta text-white font-semibold shadow-md'
                  : 'text-cream-300 hover:text-white'
              }`}
            >
              Panels (5)
            </button>
            <button
              onClick={() => setFilter('keynotes')}
              className={`px-3.5 py-1.5 rounded-md transition-all duration-200 ${
                filter === 'keynotes'
                  ? 'bg-glc-magenta text-white font-semibold shadow-md'
                  : 'text-cream-300 hover:text-white'
              }`}
            >
              Keynotes & Ceremonies
            </button>
          </div>
        </div>

        {/* Timeline Items */}
        <div className="mt-8 divide-y divide-wine-800/50">
          {filteredItems.map((item, index) => {
            const isClickable = Boolean(item.anchorId)
            const CardWrapper = isClickable ? 'a' : 'div'
            const wrapperProps = isClickable ? { href: `#${item.anchorId}` } : {}

            return (
              <CardWrapper
                key={index}
                {...wrapperProps}
                className={`group py-4 sm:py-5 px-3 sm:px-5 -mx-3 sm:-mx-5 rounded-xl transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 ${
                  isClickable
                    ? 'hover:bg-wine-900/40 cursor-pointer'
                    : 'hover:bg-wine-900/20'
                }`}
              >
                {/* Left: Time & Badge */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0 min-w-[240px]">
                  <div className="w-8 h-8 rounded-lg bg-wine-900/80 border border-wine-800/80 flex items-center justify-center shrink-0">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-xs sm:text-sm font-semibold text-glc-orange tracking-tight">
                      {item.time}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-cream-400 font-mono mt-0.5">
                      {item.venue}
                    </span>
                  </div>
                </div>

                {/* Center: Title & Subtitle */}
                <div className="flex-1 md:px-4">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-sm sm:text-base font-semibold text-cream-100 group-hover:text-white transition-colors">
                      {item.title}
                    </h3>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getBadgeStyle(
                        item.category
                      )}`}
                    >
                      {item.tag}
                    </span>
                  </div>
                  {item.subtitle && (
                    <p className="text-xs text-cream-300/80 font-mono mt-1">
                      {item.subtitle}
                    </p>
                  )}
                </div>

                {/* Right: Quick action / arrow if anchorable */}
                {isClickable && (
                  <div className="hidden md:flex items-center gap-1 text-xs font-mono text-glc-rose group-hover:text-glc-magenta group-hover:translate-x-1 transition-all shrink-0">
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </CardWrapper>
            )
          })}
        </div>

        {/* Footnote venue notice */}
        <div className="mt-12 pt-6 border-t border-wine-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-cream-400">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-glc-orange shrink-0" />
            <span>All main sessions will take place at Dr. Ramdas M. Pai Auditorium.</span>
          </div>
          <a
            href="#registration"
            className="text-glc-rose hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Register for Attendee Pass</span>
            <ChevronRight className="w-3 h-3" />
          </a>
        </div>

      </div>
    </section>
  )
}
