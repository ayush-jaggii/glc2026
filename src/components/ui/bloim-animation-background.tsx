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

      // Smooth mouse interaction
      mouse.x += (mouse.targetX - mouse.x) * 0.05
      mouse.y += (mouse.targetY - mouse.y) * 0.05

      // Fully transparent clear - NO opaque rectangular fill!
      ctx.clearRect(0, 0, width, height)

      // Natural organic center coordinates with Lissajous drift
      const driftX = Math.sin(now * 0.5) * (width * 0.08)
      const driftY = Math.cos(now * 0.6) * (height * 0.06)
      const cx = (mouse.x || width * 0.5) * 0.25 + (width * 0.5 + driftX) * 0.75
      const cy = (mouse.y || height * 0.5) * 0.25 + (height * 0.5 + driftY) * 0.75

      const maxR = Math.max(width, height) * 0.6

      // 1. Soft Ambient Breathing Plum/Wine Aura (#5B0C38 / #3D0D30)
      const breath = 0.85 + 0.15 * Math.sin(now * 1.2)
      const baseR = maxR * 0.65 * breath
      const baseGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR)
      baseGrad.addColorStop(0, 'rgba(91, 12, 56, 0.75)')
      baseGrad.addColorStop(0.35, 'rgba(61, 13, 48, 0.4)')
      baseGrad.addColorStop(0.7, 'rgba(27, 6, 21, 0.15)')
      baseGrad.addColorStop(1, 'rgba(11, 2, 7, 0)')
      ctx.fillStyle = baseGrad
      ctx.beginPath()
      ctx.arc(cx, cy, baseR, 0, Math.PI * 2)
      ctx.fill()

      // 2. Continuous Organic Blooming Waves (Concentric expanding pulses)
      const ringCount = 4
      for (let i = 0; i < ringCount; i++) {
        const speed = 0.18
        const offset = i / ringCount
        const progress = ((now * speed + offset) % 1)
        
        // Exponential ease expansion like a real bloom
        const easeProgress = Math.sin(progress * (Math.PI / 2))
        const r = maxR * 0.75 * easeProgress
        
        // Bell-curve opacity
        const opacity = Math.sin(progress * Math.PI) * 0.85

        if (r > 8 && opacity > 0.01) {
          // Alternating colors between GLC Magenta (#F45197) and GLC Amber Orange (#FF7A00)
          const isMagenta = i % 2 === 0
          const innerColor = isMagenta ? '244, 81, 151' : '255, 122, 0'
          const outerColor = isMagenta ? '255, 45, 141' : '245, 130, 50'

          const ringGrad = ctx.createRadialGradient(
            cx, cy, Math.max(0, r - 60),
            cx, cy, r + 45
          )
          ringGrad.addColorStop(0, `rgba(${innerColor}, 0)`)
          ringGrad.addColorStop(0.45, `rgba(${innerColor}, ${opacity * 0.8})`)
          ringGrad.addColorStop(0.75, `rgba(${outerColor}, ${opacity * 0.45})`)
          ringGrad.addColorStop(1, `rgba(${outerColor}, 0)`)

          ctx.fillStyle = ringGrad
          ctx.beginPath()
          ctx.arc(cx, cy, r + 45, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // 3. Central Luminous Core Blobs (Swirling orbit)
      const orbitR = 35 + Math.sin(now * 1.8) * 12
      const angle = now * 0.9

      // Magenta Core
      const mX = cx + Math.cos(angle) * orbitR
      const mY = cy + Math.sin(angle) * (orbitR * 0.7)
      const mR = 100 + Math.sin(now * 2) * 20
      const mGrad = ctx.createRadialGradient(mX, mY, 0, mX, mY, mR)
      mGrad.addColorStop(0, 'rgba(255, 45, 141, 0.95)')
      mGrad.addColorStop(0.5, 'rgba(244, 81, 151, 0.45)')
      mGrad.addColorStop(1, 'rgba(244, 81, 151, 0)')
      ctx.fillStyle = mGrad
      ctx.beginPath()
      ctx.arc(mX, mY, mR, 0, Math.PI * 2)
      ctx.fill()

      // Orange / Amber Core
      const oX = cx - Math.cos(angle) * orbitR
      const oY = cy - Math.sin(angle) * (orbitR * 0.7)
      const oR = 95 + Math.cos(now * 1.7) * 20
      const oGrad = ctx.createRadialGradient(oX, oY, 0, oX, oY, oR)
      oGrad.addColorStop(0, 'rgba(255, 122, 0, 0.95)')
      oGrad.addColorStop(0.5, 'rgba(245, 130, 50, 0.5)')
      oGrad.addColorStop(1, 'rgba(245, 130, 50, 0)')
      ctx.fillStyle = oGrad
      ctx.beginPath()
      ctx.arc(oX, oY, oR, 0, Math.PI * 2)
      ctx.fill()

      // 4. Specular Peach-Rose Flare Core (#ffc5b6)
      const flareR = 40 + Math.sin(now * 2.4) * 10
      const flareGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, flareR)
      flareGrad.addColorStop(0, 'rgba(255, 197, 182, 0.9)')
      flareGrad.addColorStop(0.4, 'rgba(244, 81, 151, 0.45)')
      flareGrad.addColorStop(1, 'rgba(244, 81, 151, 0)')
      ctx.fillStyle = flareGrad
      ctx.beginPath()
      ctx.arc(cx, cy, flareR, 0, Math.PI * 2)
      ctx.fill()

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
        className="absolute inset-0 w-full h-full filter blur-[36px] sm:blur-[50px] scale-105 pointer-events-none select-none"
      />
      {children}
    </div>
  )
}

export default Component
