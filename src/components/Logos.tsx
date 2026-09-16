'use client'

import React from 'react'

interface LogoProps {
  className?: string
  variant?: 'light' | 'color'
}

/**
 * TAPMI Official Brand Crest Logo
 */
export function TapmiLogo({ className = "h-11 w-auto", variant = "light" }: LogoProps) {
  return (
    <img
      src="/logos/tapmi-logo.svg"
      alt="TAPMI Logo - T. A. Pai Management Institute"
      width={183}
      height={40}
      className={`object-contain block transition-opacity duration-200 ${variant === 'light' ? 'brightness-0 invert opacity-95 hover:opacity-100' : 'opacity-100'} ${className}`}
      style={{ minHeight: '34px', minWidth: '110px' }}
    />
  )
}

/**
 * Official MAHE Manipal Vector Logo
 */
export function MaheLogo({ className = "h-11 w-auto", variant = "light" }: LogoProps) {
  return (
    <img
      src="/logos/mahe-logo.svg"
      alt="Manipal Academy of Higher Education (MAHE), Bengaluru"
      width={240}
      height={72}
      className={`object-contain block transition-opacity duration-200 ${variant === 'light' ? 'brightness-0 invert opacity-95 hover:opacity-100' : 'opacity-100'} ${className}`}
      style={{ minHeight: '34px', minWidth: '110px' }}
    />
  )
}

/**
 * Official TAPMI PACE Committee Emblem
 */
export function PaceLogo({ className = "h-9 w-auto" }: { className?: string }) {
  return (
    <img
      src="/logos/pace-logo.jpg"
      alt="TAPMI PACE Committee Logo"
      width={48}
      height={48}
      className={`object-contain block rounded shadow-xs ${className}`}
    />
  )
}

/**
 * TAPMI Bottom / Institutional Horizontal Logo
 */
export function BottomTapmiLogo({ className = "h-10 w-auto", variant = "light" }: LogoProps) {
  return (
    <img
      src="/logos/bottom-tapmi-logo.svg"
      alt="TAPMI Institutional Logo"
      width={404}
      height={84}
      className={`object-contain block transition-opacity duration-200 ${variant === 'light' ? 'brightness-0 invert opacity-90' : 'opacity-100'} ${className}`}
    />
  )
}

/**
 * Official Accreditations Logo Bar (AACSB, AMBA, NBA)
 */
export function AccredationsLogo({ className = "h-7 w-auto", variant = "light" }: LogoProps) {
  return (
    <img
      src="/logos/accredations-logo.svg"
      alt="TAPMI Accreditations - AACSB, AMBA, NBA"
      width={129}
      height={22}
      className={`object-contain block ${variant === 'light' ? 'brightness-0 invert opacity-80' : 'opacity-90'} ${className}`}
    />
  )
}

/**
 * Nexora IT Club Logo (for discreet design & engineering credit)
 */
export function NexoraLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <img
      src="/logos/nexora-logo.jpg"
      alt="NEXORA IT Club - TAPMI Bengaluru"
      width={80}
      height={24}
      className={`object-contain inline-block opacity-75 hover:opacity-100 transition-opacity ${className}`}
    />
  )
}
