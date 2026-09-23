'use client'

import React, { useRef, useState, useCallback } from 'react'

export interface PassDetails {
  regId: string
  name: string
  category: string
  categoryKey?: 'student' | 'executive' | 'corporate' | 'academic'
  affiliation?: string
  roleOrProgram?: string
  seat: string
  zone?: string
  gate?: string
  fullSeatString?: string
  date: string
  time: string
  venue: string
  campus?: string
  qrDataUrl?: string
  submittedAt?: string
}

interface DelegatePassCardProps {
  pass: PassDetails
  id?: string
  tilt?: boolean
}

// Interactive 3D Tilt Wrapper with dynamic ambient glare
function TiltWrapper({
  children,
  enabled = true
}: {
  children: React.ReactNode
  enabled?: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)

  const onMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const dx = (e.clientX - rect.left) / rect.width - 0.5
    const dy = (e.clientY - rect.top) / rect.height - 0.5

    const maxTilt = 6
    cardRef.current.style.transform = `perspective(1200px) rotateX(${
      -(dy * 2) * maxTilt
    }deg) rotateY(${dx * 2 * maxTilt}deg) scale(1.01)`

    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(40% 60% at ${
        (dx + 0.5) * 100
      }% ${(dy + 0.5) * 100}%, rgba(255,255,255,0.12) 0%, transparent 70%)`
    }
  }, [])

  const onLeave = useCallback(() => {
    setHovering(false)
    if (cardRef.current) {
      cardRef.current.style.transform =
        'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)'
    }
    if (glareRef.current) {
      glareRef.current.style.background = 'transparent'
    }
  }, [])

  if (!enabled) {
    return <div className="w-full flex justify-center">{children}</div>
  }

  return (
    <div
      ref={cardRef}
      onPointerEnter={() => setHovering(true)}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative w-full flex justify-center will-change-transform"
      style={{
        transition: hovering
          ? 'none'
          : 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)',
        transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)',
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
      {/* Glare overlay */}
      <div
        ref={glareRef}
        aria-hidden={true}
        className="pointer-events-none absolute inset-0 rounded-2xl z-30 transition-opacity"
        style={{
          transition: hovering ? 'none' : 'background 400ms ease-out'
        }}
      />
    </div>
  )
}

export default function DelegatePassCard({
  pass,
  id = 'conference-pass-card',
  tilt = true
}: DelegatePassCardProps) {
  return (
    <TiltWrapper enabled={tilt}>
      {/* 
        Minimal, High-Fashion Conference Ticket
        - Authentic cut-out notches and perforation line
        - Uncluttered, bold typography inspired by the Admit One ticket layout
        - Official GLC Theme: Deep Wine, Warm Amber / Gold (#FFC591), Crisp White
      */}
      <div
        id={id}
        className="relative w-full max-w-[820px] bg-gradient-to-br from-[#1C0518] via-[#10020E] to-[#070006] rounded-2xl border border-[#FFC591]/25 shadow-[0_20px_60px_-15px_rgba(244,81,151,0.25)] text-cream-50 font-sans select-none overflow-hidden"
        style={{
          backgroundImage:
            'radial-gradient(circle at 80% 20%, rgba(244,81,151,0.12) 0%, transparent 45%), radial-gradient(circle at 20% 80%, rgba(255,197,145,0.08) 0%, transparent 45%)'
        }}
      >
        {/* Top Semi-Circular Cutout Notch */}
        <div
          aria-hidden={true}
          className="absolute -top-3.5 right-[28%] translate-x-1/2 w-7 h-7 rounded-full bg-[#0B0207] border border-[#FFC591]/25 z-20"
        />

        {/* Bottom Semi-Circular Cutout Notch */}
        <div
          aria-hidden={true}
          className="absolute -bottom-3.5 right-[28%] translate-x-1/2 w-7 h-7 rounded-full bg-[#0B0207] border border-[#FFC591]/25 z-20"
        />

        {/* Ticket Container: Main Body (Left ~72%) + Perforated Stub (Right ~28%) */}
        <div className="flex flex-col sm:flex-row min-h-[380px] sm:min-h-[400px]">
          
          {/* ================= LEFT: MAIN TICKET BODY ================= */}
          <div className="flex-1 p-6 sm:p-9 lg:p-11 flex flex-col justify-between relative border-b sm:border-b-0 sm:border-r border-dashed border-[#FFC591]/25">
            
            {/* Top Presenter / Event Title */}
            <div>
              <div className="flex items-center gap-3">
                <img
                  src="/logos/tapmi-logo.svg"
                  alt="TAPMI"
                  className="h-6 sm:h-7 w-auto object-contain brightness-0 invert opacity-90"
                />
                <div className="h-4 w-px bg-[#FFC591]/30" />
                <span className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] text-[#FFC591] uppercase">
                  TAPMI BENGALURU PRESENTS
                </span>
              </div>

              <div className="mt-3">
                <div className="text-xs sm:text-sm font-bold tracking-[0.22em] text-cream-200 uppercase">
                  Global Leadership Colloquium 2026
                </div>
                <div className="text-sm sm:text-base font-extrabold tracking-[0.15em] text-[#FFC591] uppercase mt-0.5">
                  Business Beyond Borders
                </div>
              </div>
            </div>

            {/* Centerpiece: Attendee Full Name & Details */}
            <div className="my-6 sm:my-8">
              <h1 className="text-2xl sm:text-4xl lg:text-[44px] font-black text-white tracking-tight leading-tight uppercase">
                {pass.name}
              </h1>

              <div className="mt-2.5 text-xs sm:text-sm font-medium text-[#FFC591]/90 flex flex-wrap items-center gap-2">
                {pass.roleOrProgram && <span>{pass.roleOrProgram}</span>}
                <span className="text-wine-500">•</span>
                <span className="text-white">
                  Seat: <strong className="font-bold text-[#FFD7BA]">{pass.seat}</strong>
                </span>
                {pass.zone && pass.zone !== 'Allocated at Check-in' && (
                  <>
                    <span className="text-wine-500">•</span>
                    <span className="text-cream-300 text-xs">{pass.zone}</span>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Venue, Date & Schedule */}
            <div className="pt-4 border-t border-[#FFC591]/15 text-[11px] sm:text-xs text-[#FFC591]/80 font-medium flex flex-wrap items-center gap-2 tracking-wide uppercase">
              <span>Dr. Ramdas M. Pai Auditorium</span>
              <span className="text-wine-500">•</span>
              <span>Saturday, 10 October 2026</span>
              <span className="text-wine-500">•</span>
              <span>09:00 AM IST</span>
            </div>

          </div>

          {/* ================= RIGHT: THE TICKET STUB ================= */}
          <div className="w-full sm:w-[28%] p-6 sm:p-7 flex flex-col items-center justify-between text-center relative overflow-hidden bg-[#0A0108]/90">
            
            {/* Large Subtle Vertical 2026 Watermark */}
            <div
              aria-hidden={true}
              className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden"
            >
              <span className="text-[100px] sm:text-[140px] font-black text-[#FFC591]/[0.06] tracking-tighter rotate-90 leading-none">
                2026
              </span>
            </div>

            {/* Stub Header / Type */}
            <div className="w-full text-center relative z-10">
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] text-[#FFC591]/80 uppercase">
                AUDITORIUM
              </span>
            </div>

            {/* High-Contrast Scannable QR Code */}
            <div className="my-auto py-3 flex flex-col items-center relative z-10">
              <div className="p-2 sm:p-2.5 rounded-xl bg-white shadow-xl ring-2 ring-[#FFC591]/30">
                {pass.qrDataUrl ? (
                  <img
                    src={pass.qrDataUrl}
                    alt="GLC Pass QR Code"
                    className="w-32 h-32 sm:w-36 sm:h-36 object-contain block"
                  />
                ) : (
                  <div className="w-32 h-32 sm:w-36 sm:h-36 bg-gray-100 rounded-lg flex items-center justify-center text-black text-xs font-mono">
                    Generating...
                  </div>
                )}
              </div>
            </div>

            {/* Stub Footer: Token ID */}
            <div className="w-full text-center relative z-10">
              <span className="font-mono text-[9px] sm:text-[10px] text-[#FFC591]/75 tracking-widest uppercase">
                {pass.regId}
              </span>
            </div>

          </div>

        </div>

      </div>
    </TiltWrapper>
  )
}
