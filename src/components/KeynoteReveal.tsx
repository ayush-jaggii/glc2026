'use client'

import React, { useRef, useEffect, useState } from 'react'
import Image from 'next/image'

export default function KeynoteReveal() {
  const containerRef = useRef<HTMLElement>(null)
  const holeGroupRef = useRef<SVGGElement>(null)
  const gradientTextGroupRef = useRef<SVGGElement>(null)
  const polygonRef = useRef<SVGPolygonElement>(null)
  const curtainRef = useRef<SVGRectElement>(null)
  const showcaseRef = useRef<HTMLDivElement>(null)

  const holeRemyaRef = useRef<SVGTextElement>(null)
  const holeMohanaRef = useRef<SVGTextElement>(null)
  const gradRemyaRef = useRef<SVGTextElement>(null)
  const gradMohanaRef = useRef<SVGTextElement>(null)
  const gradSubRef = useRef<SVGTextElement>(null)

  const [isMobile, setIsMobile] = useState(false)

  // Responsive font size and geometry adjustment for mobile viewports
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)

      const remyaSize = mobile ? '76' : '120'
      const mohanaSize = mobile ? '38' : '64'
      const mohanaY = mobile ? '535' : '555'
      const mohanaSpacing = mobile ? '-1' : '-2'
      const subSize = mobile ? '10' : '14'
      const subSpacing = mobile ? '3' : '7'
      const subY = mobile ? '575' : '612'
      const polyPoints = mobile ? '480,412 520,412 500,464' : '466,379 534,379 500,464'

      if (holeRemyaRef.current) holeRemyaRef.current.setAttribute('font-size', remyaSize)
      if (gradRemyaRef.current) gradRemyaRef.current.setAttribute('font-size', remyaSize)
      if (holeMohanaRef.current) {
        holeMohanaRef.current.setAttribute('font-size', mohanaSize)
        holeMohanaRef.current.setAttribute('y', mohanaY)
        holeMohanaRef.current.setAttribute('letter-spacing', mohanaSpacing)
      }
      if (gradMohanaRef.current) {
        gradMohanaRef.current.setAttribute('font-size', mohanaSize)
        gradMohanaRef.current.setAttribute('y', mohanaY)
        gradMohanaRef.current.setAttribute('letter-spacing', mohanaSpacing)
      }
      if (gradSubRef.current) {
        gradSubRef.current.setAttribute('font-size', subSize)
        gradSubRef.current.setAttribute('letter-spacing', subSpacing)
        gradSubRef.current.setAttribute('y', subY)
      }
      if (polygonRef.current) polygonRef.current.setAttribute('points', polyPoints)
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

      // Center inside the letter M of REMYA
      const mobile = window.innerWidth < 768
      const ox = 500
      const oy = mobile ? 438 : 420

      // Natural zoom directly into the letter M so all strokes expand completely out of view
      const scale = 1 + Math.pow(p, 2.3) * (mobile ? 75 : 65)
      const transformValue = `translate(${ox}, ${oy}) scale(${scale}) translate(-${ox}, -${oy})`

      if (holeGroupRef.current) {
        holeGroupRef.current.setAttribute('transform', transformValue)
      }

      // 1. Solid gradient typography and subtitle smoothly fade to see-through as user begins zooming in
      if (gradientTextGroupRef.current) {
        gradientTextGroupRef.current.setAttribute('transform', transformValue)
        const textOpacity = Math.max(0, 1 - p / 0.18)
        gradientTextGroupRef.current.style.opacity = textOpacity.toString()
      }

      // 2. The V-notch of M is opaque black curtain at p = 0 so NOTHING behind M can be seen at rest.
      // It only opens as camera zooms into M (p > 0.2) to pass cleanly through the letter.
      if (polygonRef.current) {
        if (p > 0.2) {
          const polyOpacity = Math.min(1.0, (p - 0.2) / 0.12)
          polygonRef.current.style.opacity = polyOpacity.toString()
        } else {
          polygonRef.current.style.opacity = '0'
        }
      }

      // 3. Once fully zoomed through the letter M (p >= 0.65), hide the curtain
      // so it is 100% out of frame and can NEVER obscure any speaker information
      if (curtainRef.current) {
        if (p >= 0.65) {
          curtainRef.current.style.display = 'none'
        } else {
          curtainRef.current.style.display = 'block'
        }
      }

      // 4. Underlying speaker showcase transitions in subtly & activates pointer events
      // At p = 0, opacity is 0 so absolutely nothing peeks through the text at rest.
      if (showcaseRef.current) {
        const showcaseScale = Math.min(1.0, 0.94 + p * 0.08)
        const stageOpacity = Math.min(1.0, p / 0.12)
        showcaseRef.current.style.transform = `scale(${showcaseScale})`
        showcaseRef.current.style.opacity = stageOpacity.toString()
        showcaseRef.current.style.pointerEvents = p >= 0.65 ? 'auto' : 'none'
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
      className="relative w-full h-[220vh] sm:h-[300vh] bg-wine-950 scroll-mt-24"
    >
      {/* Sticky full-viewport frame pinned while scrolling through the mask reveal */}
      <div className="sticky top-0 w-full h-[100dvh] overflow-hidden flex items-center justify-center bg-wine-950 select-none">
        
        {/* Ambient atmospheric backdrop glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,81,151,0.12)_0%,rgba(245,130,50,0.06)_45%,transparent_75%)] pointer-events-none" />

        {/* LAYER 1: Underlying Clean Keynote Stage (Behind the Mask) */}
        <div
          ref={showcaseRef}
          style={{ opacity: 0 }}
          className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-6 transition-transform duration-100 ease-out pointer-events-none"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-14 items-center">
            
            {/* Left: Cutout PNG Portrait with Seamless Bottom Feather & Ambient Backlight Glow */}
            <div className="lg:col-span-5 flex justify-center items-center relative">
              {/* Vibrant radial halo backlight behind cutout silhouette */}
              <div className="absolute w-56 sm:w-80 h-56 sm:h-80 rounded-full bg-gradient-to-tr from-glc-magenta/25 via-glc-pink/20 to-glc-orange/20 blur-3xl pointer-events-none" />

              {/* Cutout container with bottom gradient fade mask for 100% seamless blending */}
              <div className="relative group/photo cursor-pointer w-full max-w-[210px] xs:max-w-[250px] sm:max-w-sm lg:max-w-md aspect-[3/4.1] flex items-end justify-center">
                <div className="relative w-full h-full flex items-end justify-center [mask-image:linear-gradient(to_top,transparent_0%,transparent_3%,black_22%,black_100%)] [-webkit-mask-image:linear-gradient(to_top,transparent_0%,transparent_3%,black_22%,black_100%)]">
                  <Image
                    src="/images/remya-keynote-cutout.webp"
                    alt="Remya Mohanakrishnan - Keynote Speaker"
                    fill
                    priority
                    sizes="(max-width: 640px) 250px, (max-width: 1024px) 380px, 450px"
                    className="object-contain object-bottom select-none transition-transform duration-700 ease-out group-hover/photo:scale-105 drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] group-hover/photo:drop-shadow-[0_25px_50px_rgba(244,81,151,0.35)]"
                  />
                </div>
              </div>
            </div>

            {/* Right: Clean, Prestigious Executive Details (Optimized for Mobile & Desktop) */}
            <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left space-y-2.5 sm:space-y-4">
              
              {/* Clean Editorial Category Label */}
              <p className="text-[11px] sm:text-sm font-bold uppercase tracking-[0.25em] text-glc-orange font-sans">
                Keynote Speaker
              </p>

              {/* Speaker Full Name in Helvetica */}
              <h2 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-cream-50 font-sans leading-[1.08]">
                Remya Mohanakrishnan
              </h2>

              {/* Designation & Organization in Helvetica */}
              <div className="space-y-0.5 sm:space-y-1 font-sans">
                <p className="text-base sm:text-xl lg:text-2xl font-semibold text-cream-100">
                  Head – Education (South Asia)
                </p>
                <p className="text-xs sm:text-sm lg:text-base text-glc-pink font-medium">
                  Trade & Investment Queensland · Queensland Government
                </p>
              </div>

              {/* Clean, Impactful Executive Bio (Crisp and Focused) */}
              <p className="text-xs sm:text-sm lg:text-base text-cream-200/85 leading-relaxed max-w-xl font-normal font-sans pt-0.5 sm:pt-1 mx-auto lg:mx-0">
                Driving strategic bilateral education partnerships and transnational initiatives between Queensland, Australia, and South Asia.
              </p>

              {/* Clean Minimalist LinkedIn Link */}
              <div className="pt-2 sm:pt-3">
                <a
                  href="https://www.linkedin.com/in/remya-mohanakrishnan-25b8a128"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 hover:border-glc-orange text-cream-50 font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-glc-orange/20 hover:scale-[1.02] active:scale-[0.98] group font-sans"
                >
                  <svg
                    className="w-4 h-4 fill-[#0A66C2] group-hover:scale-110 transition-transform"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <span>Connect on LinkedIn</span>
                  <span className="text-glc-orange group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>

            </div>

          </div>
        </div>

        {/* LAYER 2: SVG Mask Layer (Curtain + Cutout Window in Helvetica) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Gradient definition for solid initial typography */}
            <linearGradient id="keynoteTextGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F58232" />
              <stop offset="50%" stopColor="#FF2D8D" />
              <stop offset="100%" stopColor="#F45197" />
            </linearGradient>

            {/* SVG Mask cutting out the expanding letters in Helvetica */}
            <mask id="keynoteHoleMask">
              {/* White background preserves the opaque black curtain */}
              <rect width="1000" height="1000" fill="white" />

              {/* Black shapes cut out the transparent window into Layer 1 */}
              <g ref={holeGroupRef}>
                {/* The V-aperture of M with initial opacity: 0 so nothing peeks through at rest */}
                <polygon
                  ref={polygonRef}
                  points={isMobile ? '480,412 520,412 500,464' : '466,379 534,379 500,464'}
                  fill="black"
                  style={{ opacity: 0 }}
                />

                <text
                  ref={holeRemyaRef}
                  x="500"
                  y="465"
                  textAnchor="middle"
                  fontSize={isMobile ? '76' : '120'}
                  fontWeight="900"
                  fill="black"
                  letterSpacing="-2"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  REMYA
                </text>
                <text
                  ref={holeMohanaRef}
                  x="500"
                  y={isMobile ? '535' : '555'}
                  textAnchor="middle"
                  fontSize={isMobile ? '38' : '64'}
                  fontWeight="900"
                  fill="black"
                  letterSpacing={isMobile ? '-1' : '-2'}
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
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

          {/* Solid Gradient Typography with Subtitle Positioned Directly Below the Name */}
          <g ref={gradientTextGroupRef}>
            <text
              ref={gradRemyaRef}
              x="500"
              y="465"
              textAnchor="middle"
              fontSize={isMobile ? '76' : '120'}
              fontWeight="900"
              fill="url(#keynoteTextGradient)"
              letterSpacing="-2"
              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              REMYA
            </text>
            <text
              ref={gradMohanaRef}
              x="500"
              y={isMobile ? '535' : '555'}
              textAnchor="middle"
              fontSize={isMobile ? '38' : '64'}
              fontWeight="900"
              fill="url(#keynoteTextGradient)"
              letterSpacing={isMobile ? '-1' : '-2'}
              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              MOHANAKRISHNAN
            </text>

            {/* Clean Subtitle Directly Below Name (No Pills, No Border, Tight Typography) */}
            <text
              ref={gradSubRef}
              x="500"
              y={isMobile ? '575' : '612'}
              textAnchor="middle"
              fontSize={isMobile ? '10' : '14'}
              fontWeight="700"
              fill="#F58232"
              letterSpacing={isMobile ? '3' : '7'}
              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              KEYNOTE SPEAKER
            </text>
          </g>
        </svg>

      </div>
    </section>
  )
}
