'use client'

import React, { useState, useEffect } from 'react'
import { EVENT_DETAILS, SpeakerSchema } from '@/data/eventData'
import { calculateTimeRemaining, TimeRemaining } from '@/lib/countdown'
import { Bell } from 'lucide-react'

interface SpeakerRevealProps {
  speakers?: SpeakerSchema[]
}

export default function SpeakerReveal({ speakers = [] }: SpeakerRevealProps) {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false,
  })
  const [isMounted, setIsMounted] = useState(false)
  const [notifyEmail, setNotifyEmail] = useState('')
  const [notifyStatus, setNotifyStatus] = useState<'idle' | 'success'>('idle')

  useEffect(() => {
    setIsMounted(true)
    const updateCountdown = () => {
      // Countdown targeting October 10, 2026 conference date
      setTimeLeft(calculateTimeRemaining(EVENT_DETAILS.targetDateIso))
    }
    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault()
    if (notifyEmail.trim()) {
      setNotifyStatus('success')
      setNotifyEmail('')
    }
  }

  return (
    <div id="speakers" className="relative rounded-xl p-8 sm:p-12 bg-[#13030F] border border-wine-800 shadow-2xl overflow-hidden">
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream-50 uppercase mb-4">
          THE PEOPLE BEHIND THE CONVERSATION
        </h3>

        <p className="text-sm sm:text-base text-cream-200/90 max-w-2xl mx-auto leading-relaxed mb-10">
          GLC 2026 brings together global executives, industry leaders, policymakers, and visionary academics across five transformative symposia.
        </p>

        {/* Integrated Countdown Ribbon Component */}
        {isMounted && (
          <div className="mb-10">
            <div className="text-[11px] font-mono uppercase tracking-widest text-cream-400 mb-4">
              Countdown to Conference Opening · 10 October 2026
            </div>
            
            <div className="inline-grid grid-cols-4 gap-3 sm:gap-6 p-4 sm:p-6 rounded-xl bg-[#0D020B] border border-wine-800 shadow-xl">
              <div className="flex flex-col items-center">
                <span className="font-mono text-3xl sm:text-5xl text-cream-50 font-bold">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-glc-magenta mt-1">Days</span>
              </div>
              <div className="flex flex-col items-center border-l border-wine-800/80 pl-3 sm:pl-6">
                <span className="font-mono text-3xl sm:text-5xl text-cream-50 font-bold">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-glc-pink mt-1">Hours</span>
              </div>
              <div className="flex flex-col items-center border-l border-wine-800/80 pl-3 sm:pl-6">
                <span className="font-mono text-3xl sm:text-5xl text-cream-50 font-bold">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-glc-orange mt-1">Mins</span>
              </div>
              <div className="flex flex-col items-center border-l border-wine-800/80 pl-3 sm:pl-6">
                <span className="font-mono text-3xl sm:text-5xl text-glc-orange font-bold">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-cream-300 mt-1">Secs</span>
              </div>
            </div>
          </div>
        )}

        {/* Priority Notification Trigger */}
        <div className="max-w-md mx-auto">
          {notifyStatus === 'success' ? (
            <div className="p-3.5 rounded-xl bg-wine-900/80 border border-glc-magenta/40 text-xs font-medium text-cream-100">
              ✓ You are on the priority list. Speaker details will be sent to your inbox.
            </div>
          ) : (
            <form onSubmit={handleNotify} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email for speaker announcements..."
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-full bg-wine-950/90 border border-wine-700 text-xs text-cream-100 placeholder:text-cream-400 focus:outline-none focus:border-glc-magenta"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-glc-magenta via-glc-pink to-glc-orange text-xs font-semibold uppercase tracking-wider text-white hover:shadow-[0_0_20px_rgba(244,81,151,0.5)] transition-all flex items-center gap-1.5 shrink-0"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Notify Me</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  )
}
