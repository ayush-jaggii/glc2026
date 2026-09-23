'use client'

import React, { useRef, useState, useEffect } from 'react'
import AdmitOneTicket from '@/components/ui/admit-one-ticket'

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
}

export default function DelegatePassCard({
  pass,
  id = 'conference-pass-card'
}: DelegatePassCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [ticketWidth, setTicketWidth] = useState(741)

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const clientW = containerRef.current.clientWidth
        // Keep within 340px to 741px reference scale
        setTicketWidth(Math.min(741, Math.max(320, clientW)))
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div ref={containerRef} className="w-full flex justify-center py-4 px-2">
      <AdmitOneTicket
        id={id}
        name={pass.name}
        event={'GLC 2026\nBUSINESS BEYOND BORDERS'}
        subMeta={`${pass.roleOrProgram || ''} · Seat: ${pass.seat}`}
        venue="DR. RAMDAS M. PAI AUDITORIUM"
        dates="SAT, 10 OCT 2026 · 09:00 AM"
        watermark="2026"
        qrDataUrl={pass.qrDataUrl}
        regId={pass.regId}
        width={ticketWidth}
      />
    </div>
  )
}
