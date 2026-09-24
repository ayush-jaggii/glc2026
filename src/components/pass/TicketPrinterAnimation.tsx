'use client'

import React, { useState, useEffect, useRef } from 'react'
import { CheckCircle2, RotateCcw, Printer, Sparkles } from 'lucide-react'
import DelegatePassCard, { PassDetails } from './DelegatePassCard'
import PassDownloadActions from './PassDownloadActions'

interface TicketPrinterAnimationProps {
  pass: PassDetails
  id?: string
  onReset?: () => void
}

export default function TicketPrinterAnimation({
  pass,
  id = 'conference-pass-card',
  onReset
}: TicketPrinterAnimationProps) {
  // Printing states: 'printing' (0 - 2.4s) -> 'dispensed' (2.4s - 3.0s) -> 'ready' (3.0s+)
  const [printState, setPrintState] = useState<'printing' | 'dispensed' | 'ready'>('printing')
  const [key, setKey] = useState(0) // Used to re-trigger animation
  // Audio ref for realistic receipt printer sound effect
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const soundPlayedRef = useRef(false)

  // Play realistic receipt printer sound effect
  const playPrinterAudio = () => {
    try {
      if (typeof window === 'undefined') return

      if (!audioRef.current) {
        audioRef.current = new Audio('/sounds/receipt-printer.mp3')
        audioRef.current.volume = 0.75
      }

      audioRef.current.currentTime = 0
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay policy fallback: silent if browser restricts initial autoplay
        })
      }
    } catch {
      // Graceful fallback if audio is unsupported
    }
  }

  const triggerPrint = () => {
    setPrintState('printing')
    setKey((prev) => prev + 1)
    playPrinterAudio()
  }

  useEffect(() => {
    if (!soundPlayedRef.current) {
      soundPlayedRef.current = true
      playPrinterAudio()
    }

    // 2.8s feed duration matches printer motor run before cut
    const dispenseTimer = setTimeout(() => {
      setPrintState('dispensed')
    }, 2800)

    // 3.4s settles ticket after cut & drop bounce
    const readyTimer = setTimeout(() => {
      setPrintState('ready')
    }, 3400)

    return () => {
      clearTimeout(dispenseTimer)
      clearTimeout(readyTimer)
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [key])

  const isPrinting = printState === 'printing'
  const isDispensed = printState === 'dispensed' || printState === 'ready'

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Inline styles for realistic mechanical stepped feed and laser printhead */}
      <style>{`
        @keyframes thermalTicketFeed {
          0% { transform: translateY(-100%); }
          14% { transform: translateY(-84%); }
          22% { transform: translateY(-81%); }
          38% { transform: translateY(-58%); }
          46% { transform: translateY(-55%); }
          64% { transform: translateY(-30%); }
          72% { transform: translateY(-27%); }
          90% { transform: translateY(-5%); }
          100% { transform: translateY(0%); }
        }

        @keyframes ticketTearDrop {
          0% { transform: translateY(0) rotate(0deg); }
          30% { transform: translateY(14px) rotate(0.4deg); }
          65% { transform: translateY(-3px) rotate(-0.2deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }

        @keyframes printLaserPulse {
          0%, 100% { opacity: 0.4; transform: scaleX(0.85); }
          50% { opacity: 1; transform: scaleX(1); }
        }

        @keyframes holoLaserSheen {
          0% { transform: translateX(-100%) skewX(-20deg); opacity: 0; }
          20% { opacity: 0.7; }
          80% { opacity: 0.7; }
          100% { transform: translateX(200%) skewX(-20deg); opacity: 0; }
        }

        .animate-ticket-feed {
          animation: thermalTicketFeed 2.8s cubic-bezier(0.18, 0.8, 0.28, 1) forwards;
        }

        .animate-ticket-tear {
          animation: ticketTearDrop 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .animate-holo-sheen {
          animation: holoLaserSheen 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .animate-laser-pulse {
          animation: printLaserPulse 1.2s ease-in-out infinite alternate;
        }
      `}</style>

      {/* High-Tech Dispenser Slot Housing (Minimalist, text-free metallic aperture) */}
      <div className="w-full max-w-4xl px-2 sm:px-4 relative z-20">
        <div className="w-full rounded-2xl bg-gradient-to-b from-[#1c0617] via-[#12030f] to-[#080106] border border-wine-700/60 shadow-[0_-8px_30px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.12)] p-2.5 sm:p-3">
          {/* Dispenser Aperture / Slot Mouth */}
          <div className="relative w-full h-2 sm:h-2.5 rounded-full bg-[#020002] border border-wine-800 shadow-[inset_0_3px_6px_rgba(0,0,0,0.95),0_0_15px_rgba(244,81,151,0.2)] overflow-hidden">
            {isPrinting && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F45197] via-[#ffc5b6] to-transparent shadow-[0_0_14px_#F45197] animate-laser-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* Ticket Extrusion Throat */}
      <div
        className={`w-full max-w-4xl relative transition-all duration-300 ${
          isPrinting ? 'overflow-hidden' : 'overflow-visible'
        }`}
        style={{
          marginTop: '-4px' // Flush mount seamlessly against dispenser mouth
        }}
      >
        <div
          key={key}
          className={`w-full transition-transform ${
            isPrinting
              ? 'animate-ticket-feed'
              : isDispensed
              ? 'animate-ticket-tear'
              : ''
          }`}
        >
          {/* Laser printhead burn line at extrusion mouth */}
          {isPrinting && (
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F45197] via-[#ffc5b6] to-transparent shadow-[0_0_16px_#F45197,0_0_24px_#ffc5b6] z-30 pointer-events-none" />
          )}

          {/* Holographic shimmer wipe on completion */}
          {!isPrinting && isDispensed && (
            <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 via-[#F45197]/25 to-transparent animate-holo-sheen" />
            </div>
          )}

          {/* The Pass Card */}
          <DelegatePassCard pass={pass} id={id} />
        </div>
      </div>

      {/* Action Controls & Secondary Actions */}
      <div
        className={`w-full max-w-xl mx-auto mt-4 transition-all duration-700 ${
          isPrinting
            ? 'opacity-0 pointer-events-none translate-y-4'
            : 'opacity-100 translate-y-0'
        }`}
      >
        <PassDownloadActions pass={pass} cardElementId={id} />

        <div className="mt-4 flex items-center justify-center gap-3.5 flex-wrap">
          <button
            type="button"
            onClick={triggerPrint}
            disabled={isPrinting}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-cream-200 hover:text-white transition-all py-2 px-4 rounded-xl bg-wine-900/50 hover:bg-wine-900 border border-wine-800 hover:border-glc-pink/50 hover:shadow-[0_0_15px_rgba(244,81,151,0.2)] disabled:opacity-50"
          >
            <Printer className="w-3.5 h-3.5 text-[#F45197]" />
            <span>Re-print Pass</span>
          </button>

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              disabled={isPrinting}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-cream-200 hover:text-white transition-all py-2 px-4 rounded-xl bg-wine-900/50 hover:bg-wine-900 border border-wine-800 hover:border-glc-orange/50 hover:shadow-[0_0_15px_rgba(245,130,50,0.2)] disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#f58232]" />
              <span>Register Another Attendee</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
