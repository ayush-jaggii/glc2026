'use client'

import React, { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface BloimAnimationBackgroundProps {
  className?: string
  children?: React.ReactNode
}

export const Component = ({ className, children }: BloimAnimationBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId = 0
    let width = 0
    let height = 0
    let dpr = 1

    const handleResize = () => {
      if (!containerRef.current || !canvas) return
      const rect = containerRef.current.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.scale(dpr, dpr)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    const mouse = {
      x: width * 0.5,
      y: height * 0.5,
      targetX: width * 0.5,
      targetY: height * 0.5,
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      mouse.targetX = e.clientX - rect.left
      mouse.targetY = e.clientY - rect.top
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || !e.touches[0]) return
      const rect = containerRef.current.getBoundingClientRect()
      mouse.targetX = e.touches[0].clientX - rect.left
      mouse.targetY = e.touches[0].clientY - rect.top
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove, { passive: true })
      container.addEventListener('touchmove', handleTouchMove, { passive: true })
    }

    const startTime = performance.now()

    const render = () => {
      if (!ctx || width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render)
        return
      }

      const now = (performance.now() - startTime) * 0.001

      // Mouse smooth interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05
      mouse.y += (mouse.targetY - mouse.y) * 0.05

      // Base background: Obsidian Wine #0B0207
      ctx.fillStyle = '#0B0207'
      ctx.fillRect(0, 0, width, height)

      // Calculate organic animated center with Lissajous drift (guarantees animation on mobile even without touch!)
      const driftX = Math.sin(now * 0.6) * (width * 0.12)
      const driftY = Math.cos(now * 0.7) * (height * 0.1)
      const cx = (mouse.x || width * 0.5) * 0.4 + (width * 0.5 + driftX) * 0.6
      const cy = (mouse.y || height * 0.5) * 0.4 + (height * 0.5 + driftY) * 0.6

      // Emitter 1: Deep Burgundy / Wine Ambient Bloom (#5B0C38 / #3D0D30)
      const maxR = Math.max(width, height) * 0.7
      const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, maxR)
      bgGrad.addColorStop(0, 'rgba(91, 12, 56, 0.85)')
      bgGrad.addColorStop(0.35, 'rgba(61, 13, 48, 0.5)')
      bgGrad.addColorStop(0.7, 'rgba(27, 6, 21, 0.25)')
      bgGrad.addColorStop(1, 'rgba(11, 2, 7, 0)')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, width, height)

      // Emitter 2: Expanding Organic Blooming Rings (Harmonic pulses)
      // Ring A - GLC Magenta (#F45197)
      const pulseA = (now * 0.22) % 1
      const radiusA = maxR * 0.65 * pulseA
      const alphaA = Math.sin(pulseA * Math.PI) * 0.75
      if (radiusA > 5) {
        const gradA = ctx.createRadialGradient(
          cx - 30 * Math.sin(now),
          cy + 20 * Math.cos(now),
          Math.max(0, radiusA - 80),
          cx,
          cy,
          radiusA + 60
        )
        gradA.addColorStop(0, 'rgba(244, 81, 151, 0)')
        gradA.addColorStop(0.5, `rgba(244, 81, 151, ${alphaA * 0.65})`)
        gradA.addColorStop(0.8, `rgba(255, 45, 141, ${alphaA * 0.35})`)
        gradA.addColorStop(1, 'rgba(244, 81, 151, 0)')
        ctx.fillStyle = gradA
        ctx.beginPath()
        ctx.arc(cx, cy, radiusA + 60, 0, Math.PI * 2)
        ctx.fill()
      }

      // Ring B - GLC Orange / Amber (#FF7A00 / #F58232)
      const pulseB = (now * 0.22 + 0.5) % 1
      const radiusB = maxR * 0.65 * pulseB
      const alphaB = Math.sin(pulseB * Math.PI) * 0.75
      if (radiusB > 5) {
        const gradB = ctx.createRadialGradient(
          cx + 40 * Math.cos(now * 0.8),
          cy - 20 * Math.sin(now * 0.8),
          Math.max(0, radiusB - 70),
          cx,
          cy,
          radiusB + 50
        )
        gradB.addColorStop(0, 'rgba(255, 122, 0, 0)')
        gradB.addColorStop(0.45, `rgba(245, 130, 50, ${alphaB * 0.7})`)
        gradB.addColorStop(0.75, `rgba(255, 122, 0, ${alphaB * 0.4})`)
        gradB.addColorStop(1, 'rgba(255, 122, 0, 0)')
        ctx.fillStyle = gradB
        ctx.beginPath()
        ctx.arc(cx, cy, radiusB + 50, 0, Math.PI * 2)
        ctx.fill()
      }

      // Emitter 3: Dual Luminous Organic Blobs orbiting each other
      const orbitR = 60 + Math.sin(now * 1.5) * 20
      const orb1X = cx + Math.cos(now * 0.8) * orbitR
      const orb1Y = cy + Math.sin(now * 0.8) * (orbitR * 0.6)
      const orb2X = cx - Math.cos(now * 0.8) * orbitR
      const orb2Y = cy - Math.sin(now * 0.8) * (orbitR * 0.6)

      // Magenta Core Blob (#F45197)
      const r1 = 120 + Math.sin(now * 2) * 25
      const gradOrb1 = ctx.createRadialGradient(orb1X, orb1Y, 0, orb1X, orb1Y, r1)
      gradOrb1.addColorStop(0, 'rgba(255, 45, 141, 0.85)')
      gradOrb1.addColorStop(0.4, 'rgba(244, 81, 151, 0.45)')
      gradOrb1.addColorStop(1, 'rgba(244, 81, 151, 0)')
      ctx.fillStyle = gradOrb1
      ctx.beginPath()
      ctx.arc(orb1X, orb1Y, r1, 0, Math.PI * 2)
      ctx.fill()

      // Orange Core Blob (#F58232 / #FF7A00)
      const r2 = 110 + Math.cos(now * 1.8) * 25
      const gradOrb2 = ctx.createRadialGradient(orb2X, orb2Y, 0, orb2X, orb2Y, r2)
      gradOrb2.addColorStop(0, 'rgba(255, 122, 0, 0.85)')
      gradOrb2.addColorStop(0.4, 'rgba(245, 130, 50, 0.45)')
      gradOrb2.addColorStop(1, 'rgba(245, 130, 50, 0)')
      ctx.fillStyle = gradOrb2
      ctx.beginPath()
      ctx.arc(orb2X, orb2Y, r2, 0, Math.PI * 2)
      ctx.fill()

      // Emitter 4: Core Specular Flare in Peach (#ffc5b6)
      const flareR = 40 + Math.sin(now * 2.5) * 12
      const flareGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, flareR)
      flareGrad.addColorStop(0, 'rgba(255, 197, 182, 0.75)')
      flareGrad.addColorStop(0.5, 'rgba(244, 81, 151, 0.3)')
      flareGrad.addColorStop(1, 'rgba(244, 81, 151, 0)')
      ctx.fillStyle = flareGrad
      ctx.beginPath()
      ctx.arc(cx, cy, flareR, 0, Math.PI * 2)
      ctx.fill()

      // Vignette to blend smoothly into surrounding dark wine
      const vig = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        Math.min(width, height) * 0.25,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.55
      )
      vig.addColorStop(0, 'rgba(11, 2, 7, 0)')
      vig.addColorStop(0.7, 'rgba(11, 2, 7, 0.3)')
      vig.addColorStop(1, 'rgba(11, 2, 7, 0.85)')
      ctx.fillStyle = vig
      ctx.fillRect(0, 0, width, height)

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove)
        container.removeEventListener('touchmove', handleTouchMove)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full flex flex-col items-center justify-center overflow-hidden", className)}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full filter blur-[28px] sm:blur-[36px] scale-110 pointer-events-none select-none"
      />
      {children}
    </div>
  )
}

export default Component
