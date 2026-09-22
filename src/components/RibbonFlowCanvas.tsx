'use client'

import React, { useEffect, useRef } from 'react'

interface StreamParticle {
  t: number
  speed: number
  size: number
  alpha: number
  stream: 'magenta' | 'orange'
  offsetY: number
}

export default function RibbonFlowCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId = 0
    let isVisible = true
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth)
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      const rect = canvas.parentElement ? canvas.parentElement.getBoundingClientRect() : canvas.getBoundingClientRect()
      width = canvas.width = Math.floor(rect.width)
      height = canvas.height = Math.floor(rect.height)
    }
    window.addEventListener('resize', handleResize)
    handleResize()

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX / Math.max(width, 1)
      mouseRef.current.targetY = e.clientY / Math.max(height, 1)
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      return () => {
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }

    // Initialize HTML5 glowing stream particles
    const particles: StreamParticle[] = []
    const count = 55
    for (let i = 0; i < count; i++) {
      particles.push({
        t: Math.random(),
        speed: 0.0008 + Math.random() * 0.0014,
        size: 1.5 + Math.random() * 2.5,
        alpha: 0.25 + Math.random() * 0.65,
        stream: Math.random() > 0.45 ? 'magenta' : 'orange',
        offsetY: (Math.random() - 0.5) * 45,
      })
    }

    let time = 0

    const stopLoop = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = 0
      }
    }

    const startLoop = () => {
      if (!animationFrameId && isVisible && !prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render)
      }
    }

    const render = () => {
      if (!isVisible) {
        animationFrameId = 0
        return
      }
      time += 0.015

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04

      ctx.clearRect(0, 0, width, height)

      // Screen & texture aspect ratios
      const screenAspect = width / Math.max(height, 1)
      const texAspect = 1674 / 940
      const isMobile = screenAspect < 1.0

      // Dynamic nexus focal point aligned with ribbon intersection in both mobile cover and desktop
      let nexusX: number
      let nexusY: number

      if (screenAspect < texAspect) {
        // Match FlowingRibbonCanvas mobile cover projection
        const scale = screenAspect / texAspect
        const focusX = 0.5 + (0.63 - 0.5) * Math.min(Math.max((1.0 - screenAspect) * 1.4, 0), 1)
        const stX = (0.7312 - focusX) / scale + 0.5
        nexusX = Math.min(Math.max(stX, 0.15), 0.94) * width + (mouseRef.current.x - 0.5) * 20
        nexusY = height * 0.59 + (mouseRef.current.y - 0.5) * 15
      } else {
        nexusX = width * 0.72 + (mouseRef.current.x - 0.5) * 25
        nexusY = height * 0.58 + (mouseRef.current.y - 0.5) * 18
      }

      // Render flowing light impulse particles
      for (const p of particles) {
        p.t += p.speed
        if (p.t > 1) {
          p.t = 0
          p.offsetY = (Math.random() - 0.5) * (isMobile ? 30 : 45)
        }

        let px = 0
        let py = 0

        if (p.stream === 'magenta') {
          // Magenta stream enters from left, sweeping smoothly into the nexus
          const startX = 0
          const startY = height * (isMobile ? 0.35 : 0.32) + p.offsetY
          const cpX = nexusX * 0.44
          const cpY = height * (isMobile ? 0.50 : 0.58) + Math.sin(time * 0.6 + p.offsetY) * 14 + p.offsetY

          // Quadratic Bezier interpolation
          const u = 1 - p.t
          const tt = p.t * p.t
          const uu = u * u
          px = uu * startX + 2 * u * p.t * cpX + tt * nexusX
          py = uu * startY + 2 * u * p.t * cpY + tt * nexusY

          const fade = Math.sin(p.t * Math.PI)
          ctx.fillStyle = `rgba(244, 81, 151, ${p.alpha * fade})`
          ctx.shadowColor = '#F45197'
        } else {
          // Orange stream leaves nexus and sweeps toward right edge
          const endX = width
          const endY = height * (isMobile ? 0.72 : 0.68) + p.offsetY
          const cpX = nexusX + (width - nexusX) * 0.52
          const cpY = height * (isMobile ? 0.60 : 0.52) + Math.cos(time * 0.6 + p.offsetY) * 14 + p.offsetY

          const u = 1 - p.t
          const tt = p.t * p.t
          const uu = u * u
          px = uu * nexusX + 2 * u * p.t * cpX + tt * endX
          py = uu * nexusY + 2 * u * p.t * cpY + tt * endY

          const fade = Math.sin(p.t * Math.PI)
          ctx.fillStyle = `rgba(245, 130, 50, ${p.alpha * fade})`
          ctx.shadowColor = '#F58232'
        }

        ctx.shadowBlur = 10
        ctx.beginPath()
        ctx.arc(px, py, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0

      animationFrameId = requestAnimationFrame(render)
    }

    // IntersectionObserver to pause when off-screen and reliably resume when scrolled back into view
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible) {
          startLoop()
        } else {
          stopLoop()
        }
      },
      { threshold: 0.0 }
    )
    observer.observe(canvas)

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLoop()
      } else if (isVisible) {
        startLoop()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    startLoop()

    return () => {
      stopLoop()
      observer.disconnect()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      aria-hidden="true"
    />
  )
}
