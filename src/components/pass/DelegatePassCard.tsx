'use client'

import React from 'react'
import Image from 'next/image'
import { Calendar, MapPin, Armchair, DoorOpen, ShieldCheck } from 'lucide-react'

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
}

interface DelegatePassCardProps {
  pass: PassDetails
  id?: string
}

export default function DelegatePassCard({ pass, id = 'conference-pass-card' }: DelegatePassCardProps) {
  const isStudent = pass.categoryKey === 'student' || pass.category.toLowerCase().includes('student')

  return (
    <div
      id={id}
      className="relative w-full max-w-[860px] mx-auto rounded-3xl overflow-hidden bg-gradient-to-br from-[#1A0416] via-[#10020D] to-[#080106] border border-wine-700/80 shadow-[0_20px_60px_-15px_rgba(244,81,151,0.35)] text-cream-50 font-sans select-none"
      style={{
        backgroundImage: 'radial-gradient(ellipse at 85% 15%, rgba(244,81,151,0.18) 0%, transparent 60%), radial-gradient(ellipse at 15% 85%, rgba(245,130,50,0.14) 0%, transparent 60%)'
      }}
    >
      {/* Decorative Top Accent Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-glc-magenta via-glc-pink to-glc-orange" />

      {/* Main Grid: Ticket Body (Left) + Perforated Stub (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[420px]">
        
        {/* Left / Main Section (md:col-span-8) */}
        <div className="md:col-span-8 p-6 sm:p-8 sm:pr-10 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-wine-800/80 border-dashed">
          
          {/* Header Row: Logos + Category Badge */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-wine-800/60">
              {/* Institution Branding */}
              <div className="flex items-center gap-3">
                <img
                  src="/logos/tapmi-logo.svg"
                  alt="TAPMI Logo"
                  className="h-7 w-auto object-contain brightness-0 invert opacity-95"
                />
                <div className="h-4 w-px bg-wine-700/80" />
                <span className="text-[11px] sm:text-xs font-bold tracking-widest text-[#ffc5b6] uppercase">
                  MAHE Bengaluru
                </span>
              </div>

              {/* Attendee Category Badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase shadow-sm ${
                  isStudent
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/70'
                    : 'bg-gradient-to-r from-glc-magenta/20 to-glc-orange/20 text-white border border-glc-magenta/60'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isStudent ? 'bg-emerald-400' : 'bg-glc-orange'} animate-pulse`} />
                <span>{pass.category}</span>
              </div>
            </div>

            {/* Conference Brand Header */}
            <div className="mt-5">
              <div className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-glc-orange">
                Global Leadership Colloquium 4.0
              </div>
              <h1 className="font-tektype text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#ffc5b6] leading-none mt-1">
                BUSINESS BEYOND BORDERS
              </h1>
            </div>

            {/* Attendee Name & Affiliation */}
            <div className="mt-6 pt-4 border-t border-wine-800/40">
              <div className="text-[10px] uppercase tracking-wider text-cream-400 font-medium">
                Official Delegate Pass Issued To
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-cream-50 tracking-tight mt-0.5 leading-snug">
                {pass.name}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-glc-orange mt-0.5 flex flex-wrap items-center gap-2">
                <span>{pass.roleOrProgram}</span>
                <span className="text-wine-500">•</span>
                <span className="text-cream-200">{pass.affiliation}</span>
              </div>
            </div>
          </div>

          {/* Key Event Metadata & Assigned Seat Box */}
          <div className="mt-6 pt-5 border-t border-wine-800/60">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              
              {/* Highlighted Seat Box */}
              <div className="col-span-2 sm:col-span-1 rounded-2xl p-3 sm:p-3.5 bg-gradient-to-br from-glc-magenta/25 via-wine-900/60 to-glc-orange/20 border border-glc-magenta/70 shadow-inner flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-glc-orange">
                  <Armchair className="w-3 h-3 text-glc-orange" />
                  <span>Assigned Seat</span>
                </div>
                <div className="text-lg sm:text-xl font-extrabold text-white tracking-tight mt-0.5">
                  {pass.seat}
                </div>
                <div className="text-[9px] text-cream-200/90 truncate mt-0.5">
                  {pass.zone}
                </div>
              </div>

              {/* Gate & Entry */}
              <div className="rounded-2xl p-3 bg-wine-950/80 border border-wine-800 flex flex-col justify-center">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-cream-400">
                  <DoorOpen className="w-3 h-3 text-cream-300" />
                  <span>Entry Access</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-cream-100 mt-1 truncate">
                  {pass.gate}
                </div>
                <div className="text-[9px] text-cream-400 mt-0.5">Registration Desk Open: 08:30 AM</div>
              </div>

              {/* Date & Time */}
              <div className="col-span-2 sm:col-span-1 rounded-2xl p-3 bg-wine-950/80 border border-wine-800 flex flex-col justify-center">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-cream-400">
                  <Calendar className="w-3 h-3 text-cream-300" />
                  <span>Date & Schedule</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#ffc5b6] mt-1">
                  10 Oct 2026
                </div>
                <div className="text-[9px] text-cream-400 mt-0.5">09:00 AM – 06:00 PM IST</div>
              </div>

            </div>

            {/* Venue Baseline */}
            <div className="flex items-center gap-1.5 text-[11px] text-cream-300/90 mt-4 pt-3 border-t border-wine-900/80">
              <MapPin className="w-3.5 h-3.5 text-glc-magenta shrink-0" />
              <span><strong>Dr. Ramdas M. Pai Auditorium</strong>, TAPMI, MAHE Bengaluru Campus</span>
            </div>
          </div>

        </div>

        {/* Right / Perforated Stub Section (md:col-span-4) */}
        <div className="md:col-span-4 p-6 sm:p-8 bg-[#0D020B]/90 flex flex-col items-center justify-between text-center relative">
          
          {/* Top Notch Indicators */}
          <div className="w-full flex items-center justify-between text-[10px] text-cream-400 font-mono uppercase tracking-wider pb-3 border-b border-wine-800/60">
            <span>AUDITORIUM PASS</span>
            <span className="text-glc-magenta font-bold">{pass.regId}</span>
          </div>

          {/* QR Code Container */}
          <div className="my-auto py-4 flex flex-col items-center">
            <div className="relative p-3 rounded-2xl bg-white shadow-xl ring-4 ring-glc-magenta/30 border border-white/90">
              {pass.qrDataUrl ? (
                <img
                  src={pass.qrDataUrl}
                  alt="Delegate Verification QR Code"
                  className="w-36 h-36 sm:w-40 sm:h-40 object-contain block"
                />
              ) : (
                <div className="w-36 h-36 sm:w-40 sm:h-40 bg-gray-100 rounded-lg flex items-center justify-center text-black text-xs">
                  Generating QR...
                </div>
              )}
            </div>
            
            <div className="mt-3 text-[10px] text-cream-300 font-medium tracking-wide flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-glc-orange" />
              <span>Scan at Venue Check-In</span>
            </div>
          </div>

          {/* Bottom Security / Reference Info */}
          <div className="w-full pt-3 border-t border-wine-800/60 flex flex-col items-center gap-1">
            <div className="text-[9px] font-mono tracking-widest text-cream-400 uppercase">
              SEAT: <strong className="text-white">{pass.seat}</strong>
            </div>
            <div className="text-[8px] text-cream-400 tracking-wider uppercase">
              NON-TRANSFERABLE · PHOTO ID REQUIRED
            </div>
          </div>

        </div>

      </div>

      {/* Decorative Bottom Bar */}
      <div className="px-6 py-2.5 bg-black/50 border-t border-wine-900/90 flex flex-wrap items-center justify-between text-[9px] text-cream-400 tracking-wider uppercase">
        <span>T. A. Pai Management Institute (TAPMI)</span>
        <span>Accreditations: AACSB · AMBA · NBA</span>
        <span>LeadXAI · GLC 2026 Official Pass</span>
      </div>
    </div>
  )
}
