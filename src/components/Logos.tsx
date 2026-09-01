'use client'

import React from 'react'

/**
 * TAPMI Official Brand Crest Logo
 */
export function TapmiLogo({ className = "h-12 w-auto" }: { className?: string }) {
  return (
    <img
      src="/tapmi-logo.svg"
      alt="TAPMI Logo - T. A. Pai Management Institute"
      width={183}
      height={40}
      className={`object-contain block max-w-full ${className}`}
      style={{ minHeight: '36px', minWidth: '120px' }}
    />
  )
}

/**
 * Official MAHE Manipal Bengaluru Vector Logo (MAHE_Color.svg)
 */
export function MaheLogo({ className = "h-12 w-auto" }: { className?: string }) {
  return (
    <img
      src="/mahe-logo.svg"
      alt="Manipal Academy of Higher Education (MAHE), Bengaluru"
      width={240}
      height={72}
      className={`object-contain block max-w-full ${className}`}
      style={{ minHeight: '36px', minWidth: '120px' }}
    />
  )
}

/**
 * Official TAPMI PACE Committee Emblem Logo
 */
export function PaceLogo({ className = "h-10 w-auto" }: { className?: string }) {
  return (
    <img
      src="/pace-logo.jpg"
      alt="TAPMI PACE Committee Logo"
      width={60}
      height={60}
      className={`object-contain block max-w-full rounded-md ${className}`}
      style={{ minHeight: '32px', minWidth: '32px' }}
    />
  )
}

/**
 * TAPMI Bottom / Main Horizontal Brand Logo (Dark Filled)
 */
export function BottomTapmiLogo({ className = "h-10 w-auto" }: { className?: string }) {
  return (
    <img
      src="/bottom-tapmi-logo.svg"
      alt="TAPMI Institutional Logo"
      width={404}
      height={84}
      className={`object-contain block max-w-full ${className}`}
      style={{ minHeight: '32px', minWidth: '140px' }}
    />
  )
}

/**
 * Official Accreditations Logo Bar (AACSB / AMBA / EQUIS / IoE Recognition)
 */
export function AccredationsLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <img
      src="/accredations-logo.svg"
      alt="TAPMI Accreditations - AACSB, AMBA, EQUIS, Institution of Eminence"
      width={129}
      height={22}
      className={`object-contain block max-w-full ${className}`}
      style={{ minHeight: '24px', minWidth: '100px' }}
    />
  )
}
