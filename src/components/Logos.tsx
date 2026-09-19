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

/**
 * Official LEADXAI Authentic Vector Logo in Tektype
 */
export function LeadxaiLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 712 106"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="LEADXAI"
    >
      <g transform="translate(0, -55.5)">
        {/* L */}
        <path d="M1.00244 56.4844H20.6477V140.707H75.9621V160.464H30.0817L1.00244 131.22V56.4844Z" fill="#F45197"/>
        {/* E */}
        <path d="M113.691 76.2409V98.7248H173.916V118.348H113.691V140.7H179.341V160.456H123.125L94.0454 131.212V85.7206L123.125 56.4844H179.341V76.2409H113.691Z" fill="#F45197"/>
        {/* A */}
        <path d="M265.669 128.36H219.665V160.464H200.019V85.7284L229.091 56.4844H256.227L285.307 85.7284V160.464H265.661V128.36H265.669ZM265.669 108.861V76.2409H219.665V108.861H265.669Z" fill="#F45197"/>
        {/* D */}
        <path d="M366.079 56.4844L395.158 85.7284V131.22L366.079 160.464H305.985V56.4844H366.079ZM375.513 140.707V76.2409H325.631V140.707H375.513Z" fill="#F45197"/>
        {/* X (orange) */}
        <path d="M435.863 160.761H416.296V141.083L501.07 56.6641H520.63V76.3347L435.863 160.761Z" fill="#F58232"/>
        <path d="M501.07 160.761H520.63V141.083L497.977 118.302H478.41V137.972L501.07 160.761Z" fill="#F58232"/>
        <path d="M438.956 99.1156H458.516V79.4451L435.863 56.6641H416.296V76.3347L438.956 99.1156Z" fill="#F58232"/>
        {/* A */}
        <path d="M610.634 128.391H564.676V160.456H545.054V85.8065L574.095 56.6016H601.2L630.248 85.8143V160.464H610.627V128.399L610.634 128.391ZM610.634 108.916V76.3346H564.676V108.923H610.634V108.916Z" fill="#F45197"/>
        {/* I */}
        <path d="M650.912 76.2018V56.6016H664.853L690.933 82.6961V140.856H711.332V160.589L650.919 160.456V140.856H671.318V76.2018H650.919H650.912ZM690.801 56.6016H711.324V76.3346H690.801V56.6016Z" fill="#F45197"/>
      </g>
    </svg>
  )
}

