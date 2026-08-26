'use client'

import React, { useState, useEffect } from 'react'

interface CountdownProps {
  targetDate: string
  label?: string
}

export default function CountdownTimer({ targetDate, label = 'REVEAL COUNTDOWN' }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date()
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTime()
    const timer = setInterval(calculateTime, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex flex-col items-center gap-3 py-3">
      {label && (
        <span className="text-[10px] font-mono text-brand-orange uppercase tracking-widest font-bold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping"></span>
          {label}
        </span>
      )}

      {/* Editorial Monospace Layout */}
      <div className="flex items-center gap-3 sm:gap-6 font-mono">
        <div className="flex flex-col items-center">
          <span className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            {String(timeLeft.days).padStart(2, '0')}
          </span>
          <span className="text-[9px] text-slate-500 font-bold tracking-wider uppercase">DAYS</span>
        </div>

        <span className="text-xl sm:text-3xl text-brand-orange font-light mb-4">:</span>

        <div className="flex flex-col items-center">
          <span className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="text-[9px] text-slate-500 font-bold tracking-wider uppercase">HOURS</span>
        </div>

        <span className="text-xl sm:text-3xl text-brand-orange font-light mb-4">:</span>

        <div className="flex flex-col items-center">
          <span className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="text-[9px] text-slate-500 font-bold tracking-wider uppercase">MINS</span>
        </div>

        <span className="text-xl sm:text-3xl text-brand-orange font-light mb-4">:</span>

        <div className="flex flex-col items-center">
          <span className="text-2xl sm:text-4xl font-bold text-brand-orange tracking-tight">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="text-[9px] text-slate-500 font-bold tracking-wider uppercase">SECS</span>
        </div>
      </div>
    </div>
  )
}
