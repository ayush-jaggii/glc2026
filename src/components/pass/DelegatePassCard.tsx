'use client'

import React, { useRef, useState, useCallback } from 'react'
import {
  Calendar,
  MapPin,
  Armchair,
  DoorOpen,
  ShieldCheck,
  Sparkles,
  Ticket
} from 'lucide-react'

export interface PassDetails {
  regId: string
  name: string
  category: string
  categoryKey?: 'student' | 'executive' | 'corporate' | 'academic'
  affiliation: string
  roleOrProgram: string
  seat: string
  zone: string
  gate: string
  fullSeatString?: string
  date: string
  time: string
  venue: string
  campus: string
  qrDataUrl?: string
  submittedAt?: string
}

interface DelegatePassCardProps {
  pass: PassDetails
  id?: string
  tilt?: boolean
}

// 3D Tilt Wrapper with dynamic ambient glare
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

    const maxTilt = 7
    cardRef.current.style.transform = `perspective(1200px) rotateX(${
      -(dy * 2) * maxTilt
    }deg) rotateY(${dx * 2 * maxTilt}deg) scale(1.015)`

    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(45% 65% at ${
        (dx + 0.5) * 100
      }% ${(dy + 0.5) * 100}%, rgba(255,255,255,0.14) 0%, transparent 75%)`
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
        className="pointer-events-none absolute inset-0 rounded-[28px] z-30 transition-opacity"
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
  const isStudent =
    pass.categoryKey === 'student' ||
    pass.category.toLowerCase().includes('student')

  return (
    <TiltWrapper enabled={tilt}>
      {/* 
        The core pass card element targeted by html2canvas (#conference-pass-card).
        Features:
        - Admit-One ticket silhouette with top and bottom semi-circular perforation notches
        - Vertical perforated tear line dividing Main Body (Left) and Ticket Stub (Right)
        - Rich Deep Wine, Obsidian, and Gold-foiled aesthetic
        - Scannable high-res QR code framed on the ticket stub
      */}
      <div
        id={id}
        className="relative w-full max-w-[880px] bg-gradient-to-br from-[#180315] via-[#0E020C] to-[#070106] rounded-[28px] border-2 border-[#D4AF37]/50 shadow-[0_25px_70px_-15px_rgba(244,81,151,0.35),0_0_35px_rgba(212,175,55,0.15)] text-cream-50 font-sans select-none overflow-hidden"
        style={{
          backgroundImage:
            'radial-gradient(circle at 85% 20%, rgba(244,81,151,0.18) 0%, transparent 45%), radial-gradient(circle at 20% 80%, rgba(212,175,55,0.14) 0%, transparent 45%)'
        }}
      >
        {/* Top Gold Foil Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#D4AF37] via-[#F45197] to-[#F58232]" />

        {/* Top Notch Cutout (Semi-Circle at perforation line ~68% on desktop) */}
        <div
          aria-hidden={true}
          className="hidden md:block absolute -top-4 right-[32%] translate-x-1/2 w-8 h-8 rounded-full bg-[#0B0207] border-2 border-[#D4AF37]/50 z-20 shadow-inner"
        />

        {/* Bottom Notch Cutout (Semi-Circle at perforation line ~68% on desktop) */}
        <div
          aria-hidden={true}
          className="hidden md:block absolute -bottom-4 right-[32%] translate-x-1/2 w-8 h-8 rounded-full bg-[#0B0207] border-2 border-[#D4AF37]/50 z-20 shadow-inner"
        />

        {/* Main Grid: Ticket Body (Left 68%) + Stub (Right 32%) */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[440px]">
          
          {/* ================= LEFT: MAIN TICKET BODY ================= */}
          <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-between relative border-b md:border-b-0 md:border-r-2 md:border-dashed border-[#D4AF37]/40">
            
            {/* Top Row: Logos & Category Badge */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-wine-800/80">
                {/* Institutional Logos */}
                <div className="flex items-center gap-3">
                  <img
                    src="/logos/tapmi-logo.svg"
                    alt="TAPMI"
                    className="h-8 w-auto object-contain brightness-0 invert opacity-95"
                  />
                  <div className="h-4 w-px bg-[#D4AF37]/60" />
                  <div className="flex flex-col">
                    <span className="text-[11px] sm:text-xs font-bold tracking-widest text-[#FFD7BA] uppercase leading-none">
                      MAHE BENGALURU
                    </span>
                    <span className="text-[9px] text-cream-300 font-medium tracking-wider uppercase mt-0.5">
                      AACSB · AMBA · NBA
                    </span>
                  </div>
                </div>

                {/* Admit-One Badge */}
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold tracking-widest uppercase bg-gradient-to-r from-[#D4AF37]/20 to-[#F45197]/20 border border-[#D4AF37]/80 text-[#FFD7BA] shadow-sm">
                    <Ticket className="w-3 h-3 text-[#D4AF37]" />
                    <span>ADMIT ONE</span>
                  </div>

                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase ${
                      isStudent
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/70'
                        : 'bg-glc-magenta/20 text-white border border-glc-magenta/70'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isStudent ? 'bg-emerald-400' : 'bg-glc-orange'
                      } animate-pulse`}
                    />
                    <span>{pass.category}</span>
                  </div>
                </div>
              </div>

              {/* Conference Title Banner */}
              <div className="mt-4">
                <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold tracking-[0.28em] uppercase text-[#F58232]">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>Global Leadership Colloquium 4.0</span>
                </div>
                <h1 className="font-tektype text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#FFD7BA] leading-none mt-1 uppercase">
                  BUSINESS BEYOND BORDERS
                </h1>
              </div>

              {/* Attendee Full Name */}
              <div className="mt-5 pt-4 border-t border-wine-800/60">
                <div className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                  Official Pass Issued To
                </div>
                <div className="text-2xl sm:text-3xl lg:text-[34px] font-black text-cream-50 tracking-tight leading-tight mt-0.5 uppercase drop-shadow-sm">
                  {pass.name}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-glc-orange mt-1 flex flex-wrap items-center gap-2">
                  <span className="font-mono bg-wine-900/60 px-2 py-0.5 rounded border border-wine-700/80 text-[#FFD7BA]">
                    {pass.roleOrProgram}
                  </span>
                  <span className="text-wine-400">•</span>
                  <span className="text-cream-200">{pass.affiliation}</span>
                </div>
              </div>
            </div>

            {/* Bottom Badges: Seat, Gate, Date, Venue */}
            <div className="mt-6 pt-4 border-t border-wine-800/80">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                
                {/* Highlighted Gold-Foiled Seat Stamp */}
                <div className="col-span-2 sm:col-span-1 rounded-2xl p-3 bg-gradient-to-br from-[#D4AF37]/25 via-wine-900/70 to-[#F45197]/20 border-2 border-[#D4AF37]/80 shadow-[inset_0_1px_10px_rgba(212,175,55,0.25)] flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#FFD7BA]">
                    <Armchair className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Assigned Seat</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                    {pass.seat}
                  </div>
                  <div className="text-[10px] font-medium text-cream-200/90 truncate mt-0.5">
                    {pass.zone}
                  </div>
                </div>

                {/* Gate & Entry Access */}
                <div className="rounded-2xl p-3 bg-wine-950/90 border border-wine-800/90 flex flex-col justify-center">
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-cream-300">
                    <DoorOpen className="w-3 h-3 text-[#D4AF37]" />
                    <span>Gate Access</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-cream-100 mt-1 truncate">
                    {pass.gate}
                  </div>
                  <div className="text-[9px] text-cream-400 mt-0.5">
                    Registration Opens: 08:30 AM
                  </div>
                </div>

                {/* Schedule & Date */}
                <div className="col-span-2 sm:col-span-1 rounded-2xl p-3 bg-wine-950/90 border border-wine-800/90 flex flex-col justify-center">
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-cream-300">
                    <Calendar className="w-3 h-3 text-[#D4AF37]" />
                    <span>Date & Time</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-[#FFD7BA] mt-1">
                    10 Oct 2026
                  </div>
                  <div className="text-[9px] text-cream-400 mt-0.5">
                    09:00 AM – 06:00 PM IST
                  </div>
                </div>

              </div>

              {/* Venue Footnote */}
              <div className="flex items-center gap-1.5 text-[11px] text-cream-300/90 mt-3 pt-2.5 border-t border-wine-900/80">
                <MapPin className="w-3.5 h-3.5 text-[#F45197] shrink-0" />
                <span>
                  <strong>Dr. Ramdas M. Pai Auditorium</strong> · TAPMI, MAHE Bengaluru Campus
                </span>
              </div>
            </div>

          </div>

          {/* ================= RIGHT: THE TICKET STUB ================= */}
          <div className="md:col-span-4 p-6 sm:p-7 bg-[#0A0108]/95 flex flex-col items-center justify-between text-center relative overflow-hidden">
            
            {/* Watermark in stub background */}
            <div
              aria-hidden={true}
              className="pointer-events-none absolute inset-0 flex items-center justify-center select-none opacity-10 overflow-hidden"
            >
              <span className="text-[120px] font-black text-[#D4AF37] tracking-tighter rotate-90 leading-none">
                2026
              </span>
            </div>

            {/* Vertical Perforation Tear Line Label (Desktop) */}
            <div className="hidden md:flex absolute left-2 top-0 bottom-0 items-center justify-center pointer-events-none">
              <span
                style={{ writingMode: 'vertical-rl' }}
                className="text-[8px] font-mono uppercase tracking-[0.3em] text-[#D4AF37]/50 rotate-180"
              >
                ✂ TICKET STUB · PERFORATION LINE
              </span>
            </div>

            {/* Stub Header: Reg / Token ID */}
            <div className="w-full flex items-center justify-between text-[10px] text-cream-300 font-mono uppercase tracking-wider pb-2.5 border-b border-wine-800/70 relative z-10">
              <span className="font-bold text-[#FFD7BA]">AUDITORIUM</span>
              <span className="text-[#D4AF37] font-bold">{pass.regId}</span>
            </div>

            {/* Scannable High-Contrast QR Code */}
            <div className="my-auto py-3 flex flex-col items-center relative z-10">
              <div className="p-3 rounded-2xl bg-white shadow-2xl ring-4 ring-[#D4AF37]/40 border-2 border-white">
                {pass.qrDataUrl ? (
                  <img
                    src={pass.qrDataUrl}
                    alt="Delegate QR Code"
                    className="w-36 h-36 sm:w-40 sm:h-40 object-contain block"
                  />
                ) : (
                  <div className="w-36 h-36 sm:w-40 sm:h-40 bg-gray-100 rounded-lg flex items-center justify-center text-black text-xs font-mono">
                    Generating QR...
                  </div>
                )}
              </div>

              <div className="mt-2.5 text-[10px] text-cream-200 font-semibold tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="uppercase">Scan at Entrance</span>
              </div>
            </div>

            {/* Stub Footer: Seat & Security Reference */}
            <div className="w-full pt-2.5 border-t border-wine-800/70 flex flex-col items-center gap-0.5 relative z-10">
              <div className="text-[10px] font-mono tracking-widest text-[#FFD7BA] uppercase font-bold">
                SEAT: <span className="text-white bg-wine-900/80 px-2 py-0.5 rounded border border-[#D4AF37]/50">{pass.seat}</span>
              </div>
              <div className="text-[8px] text-cream-400 tracking-wider uppercase mt-1">
                NON-TRANSFERABLE · MAHE ID REQUIRED
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Golden Security Ribbon */}
        <div className="px-6 py-2 bg-black/60 border-t border-wine-900/90 flex flex-wrap items-center justify-between text-[9px] text-[#FFD7BA]/80 tracking-wider uppercase">
          <span>T. A. Pai Management Institute (TAPMI)</span>
          <span className="hidden sm:inline">Nexora IT Club · PACE Committee</span>
          <span>LeadXAI · Official GLC 2026 Pass</span>
        </div>
      </div>
    </TiltWrapper>
  )
}
