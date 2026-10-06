'use client'

import React, { useRef, useEffect, useState } from 'react'
import Image from 'next/image'

export default function KeynoteReveal() {
  const containerRef = useRef<HTMLElement>(null)
  const holeGroupRef = useRef<SVGGElement>(null)
  const visibleGroupRef = useRef<SVGGElement>(null)
  const curtainRef = useRef<SVGRectElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const showcaseRef = useRef<HTMLDivElement>(null)

  const holeRemyaRef = useRef<SVGTextElement>(null)
  const holeMohanaRef = useRef<SVGTextElement>(null)
  const visRemyaRef = useRef<SVGTextElement>(null)
  const visMohanaRef = useRef<SVGTextElement>(null)

  const [isMobile, setIsMobile] = useState(false)

  // Responsive font size adjustment for mobile viewports
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)

      const remyaSize = mobile ? '82' : '130'
      const mohanaSize = mobile ? '42' : '68'

      if (holeRemyaRef.current) holeRemyaRef.current.setAttribute('font-size', remyaSize)
      if (visRemyaRef.current) visRemyaRef.current.setAttribute('font-size', remyaSize)
      if (holeMohanaRef.current) holeMohanaRef.current.setAttribute('font-size', mohanaSize)
      if (visMohanaRef.current) visMohanaRef.current.setAttribute('font-size', mohanaSize)
    }

    handleResize()
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Native non-blocking 60fps scroll animation
  useEffect(() => {
    let animationFrameId: number | null = null

    const updateScrollAnimation = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const totalScrollable = rect.height - window.innerHeight

      if (totalScrollable <= 0) return

      // Progress p from 0 (entry) to 1 (exit)
      const p = Math.max(0, Math.min(1.0, -rect.top / totalScrollable))

      // Exponential zoom curve: starts steady, then zooms dramatically through the text
      const scale = 1 + Math.pow(p, 2.2) * 65
      const transformValue = `translate(500, 500) scale(${scale}) translate(-500, -500)`

      // 1. Transform the cut-out hole and the front visible gradient text
      if (holeGroupRef.current) {
        holeGroupRef.current.setAttribute('transform', transformValue)
      }
      if (visibleGroupRef.current) {
        visibleGroupRef.current.setAttribute('transform', transformValue)
        // Fade out front gradient text as zoom accelerates (0 to 0.28)
        const textOpacity = Math.max(0, 1 - p / 0.28)
        visibleGroupRef.current.style.opacity = textOpacity.toString()
      }

      // 2. Initial badge above the name fades out early
      if (badgeRef.current) {
        const badgeOpacity = Math.max(0, 1 - p / 0.15)
        const badgeTranslateY = -p * 80
        badgeRef.current.style.opacity = badgeOpacity.toString()
        badgeRef.current.style.transform = `translateY(${badgeTranslateY}px)`
      }

      // 3. Black curtain fades out completely once the mask opens wide
      if (curtainRef.current) {
        if (p > 0.6) {
          const fadeProgress = (p - 0.6) / 0.18
          const curtainOpacity = Math.max(0, 1 - fadeProgress)
          curtainRef.current.style.opacity = curtainOpacity.toString()
        } else {
          curtainRef.current.style.opacity = '1'
        }
      }

      // 4. Underlying speaker showcase transitions in subtly
      if (showcaseRef.current) {
        // Showcase scales gently into focus (0.94 to 1.0)
        const showcaseScale = Math.min(1.0, 0.94 + p * 0.08)
        showcaseRef.current.style.transform = `scale(${showcaseScale})`

        // Enable clicks and interactivity once mask is revealed
        if (p >= 0.68) {
          showcaseRef.current.style.pointerEvents = 'auto'
        } else {
          showcaseRef.current.style.pointerEvents = 'none'
        }
      }
    }

    const onScroll = () => {
      if (animationFrameId !== null) return
      animationFrameId = window.requestAnimationFrame(() => {
        updateScrollAnimation()
        animationFrameId = null
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    updateScrollAnimation()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return (
    <section
      ref={containerRef}
      id="keynote"
      className="relative w-full h-[280vh] sm:h-[320vh] bg-wine-950 scroll-mt-24"
    >
      {/* Sticky full-viewport frame pinned while scrolling through the mask reveal */}
      <div className="sticky top-0 w-full h-[100dvh] overflow-hidden flex items-center justify-center bg-wine-950 select-none">
        
        {/* Ambient atmospheric backdrop glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,81,151,0.12)_0%,rgba(245,130,50,0.06)_45%,transparent_75%)] pointer-events-none" />

        {/* LAYER 1: Underlying Full-Width Speaker Stage (Behind the Mask) */}
        <div
          ref={showcaseRef}
          className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 transition-transform duration-100 ease-out pointer-events-none max-h-[92dvh] overflow-y-auto lg:overflow-visible"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* Left: Original Portrait Photo with Natural Background & Elegant Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[280px] sm:max-w-sm lg:max-w-md aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden border border-glc-pink/35 shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_50px_rgba(244,81,151,0.2)] bg-[#14040F]">
                <Image
                  src="/images/remya-mohanakrishnan.webp"
                  alt="Remya Mohanakrishnan - Keynote Speaker"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 450px"
                  className="object-cover object-top select-none"
                />
                {/* Subtle inner ambient ring */}
                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl ring-1 ring-inset ring-white/10 pointer-events-none" />
              </div>
            </div>

            {/* Right: Keynote Speaker Profile & Credentials */}
            <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left space-y-4 sm:space-y-5">
              
              {/* Category Pill */}
              <div>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-glc-magenta/20 to-glc-orange/20 border border-glc-orange/40 text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase text-glc-orange shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-glc-orange animate-pulse" />
                  Keynote Speaker
                </span>
              </div>

              {/* Speaker Full Name */}
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-cream-50 font-tektype leading-[1.08]">
                Remya Mohanakrishnan
              </h2>

              {/* Designation & Organization */}
              <div className="space-y-1">
                <p className="text-lg sm:text-2xl font-semibold text-cream-100">
                  Head – Education (South Asia)
                </p>
                <p className="text-sm sm:text-base text-glc-pink font-medium">
                  Trade & Investment Queensland · Queensland Government
                </p>
              </div>

              {/* Radiant Brand Divider Accent */}
              <div className="w-20 h-1 bg-gradient-to-r from-glc-magenta to-glc-orange rounded-full mx-auto lg:mx-0" />

              {/* Comprehensive Professional Bio */}
              <p className="text-xs sm:text-sm lg:text-base text-cream-200/90 leading-relaxed max-w-2xl font-light">
                Distinguished international trade and education leader with extensive experience driving high-level bilateral engagements between Australia, India, and South Asian markets. Leading strategic educational initiatives, transnational academic partnerships, and institutional research collaboration for the Queensland Government&apos;s global business agency.
              </p>

              {/* Interactive LinkedIn Connection */}
              <div className="pt-2">
                <a
                  href="https://www.linkedin.com/in/remya-mohanakrishnan-25b8a128"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-glc-magenta/25 to-glc-orange/25 hover:from-glc-magenta/40 hover:to-glc-orange/40 border border-glc-orange/50 hover:border-glc-orange text-cream-50 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-glc-orange/25 hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <svg
                    className="w-4 h-4 fill-[#0A66C2] group-hover:scale-110 transition-transform"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <span>Connect on LinkedIn</span>
                  <span className="text-glc-orange group-hover:translate-x-0.5 transition-transform">→</span>
                </a>
              </div>

            </div>

          </div>
        </div>

        {/* Top Tag Pill visible at the beginning before zooming */}
        <div
          ref={badgeRef}
          className="absolute top-12 sm:top-16 z-30 pointer-events-none transition-transform duration-75 text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-wine-900/80 border border-glc-orange/40 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-glc-orange backdrop-blur-md shadow-xl">
            Keynote Speaker
          </span>
        </div>

        {/* LAYER 2: SVG Mask Layer (Curtain + Expanding Hole + Visible Gradient Text) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Gradient definition for initial visible typography */}
            <linearGradient id="keynoteTextGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F58232" />
              <stop offset="50%" stopColor="#FF2D8D" />
              <stop offset="100%" stopColor="#F45197" />
            </linearGradient>

            {/* SVG Mask cutting out the expanding text */}
            <mask id="keynoteHoleMask">
              {/* White background preserves the opaque black curtain */}
              <rect width="1000" height="1000" fill="white" />
              {/* Black text cuts out a transparent see-through window into Layer 1 */}
              <g ref={holeGroupRef}>
                <text
                  ref={holeRemyaRef}
                  x="500"
                  y="465"
                  textAnchor="middle"
                  fontSize={isMobile ? '82' : '130'}
                  fontWeight="900"
                  fill="black"
                  letterSpacing="-2"
                  style={{ fontFamily: 'var(--font-tektype), "Helvetica Neue", Arial, sans-serif' }}
                >
                  REMYA
                </text>
                <text
                  ref={holeMohanaRef}
                  x="500"
                  y="560"
                  textAnchor="middle"
                  fontSize={isMobile ? '42' : '68'}
                  fontWeight="900"
                  fill="black"
                  letterSpacing="-2"
                  style={{ fontFamily: 'var(--font-tektype), "Helvetica Neue", Arial, sans-serif' }}
                >
                  MOHANAKRISHNAN
                </text>
              </g>
            </mask>
          </defs>

          {/* Opaque Curtain with Cutout Window */}
          <rect
            ref={curtainRef}
            width="1000"
            height="1000"
            fill="#0B0207"
            mask="url(#keynoteHoleMask)"
          />

          {/* Initial Visible Gradient Typography (Fades away as text hole expands) */}
          <g ref={visibleGroupRef}>
            <text
              ref={visRemyaRef}
              x="500"
              y="465"
              textAnchor="middle"
              fontSize={isMobile ? '82' : '130'}
              fontWeight="900"
              fill="url(#keynoteTextGradient)"
              letterSpacing="-2"
              style={{ fontFamily: 'var(--font-tektype), "Helvetica Neue", Arial, sans-serif' }}
            >
              REMYA
            </text>
            <text
              ref={visMohanaRef}
              x="500"
              y="560"
              textAnchor="middle"
              fontSize={isMobile ? '42' : '68'}
              fontWeight="900"
              fill="url(#keynoteTextGradient)"
              letterSpacing="-2"
              style={{ fontFamily: 'var(--font-tektype), "Helvetica Neue", Arial, sans-serif' }}
            >
              MOHANAKRISHNAN
            </text>
          </g>
        </svg>

      </div>
    </section>
  )
}
