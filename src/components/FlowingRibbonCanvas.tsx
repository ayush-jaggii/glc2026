'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export default function FlowingRibbonCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [webglSupported, setWebglSupported] = useState(true)
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Try WebGL context
    const gl = (canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      premultipliedAlpha: false,
    }) ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null

    if (!gl) {
      setWebglSupported(false)
      return
    }

    let animationFrameId: number
    let isVisible = true
    let startTime = performance.now()

    // Shaders
    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `

    const fsSource = `
      precision highp float;
      varying vec2 v_uv;
      uniform sampler2D u_texture;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform vec2 u_resolution;

      void main() {
        vec2 uv = v_uv;
        // Invert Y for image texture orientation
        uv.y = 1.0 - uv.y;

        float t = u_time * 0.38;

        // Smooth interactive parallax tilt from cursor
        vec2 m = (u_mouse - 0.5) * 0.025;

        // Fluid ribbon traveling wave displacement
        // Clean margin dampener near canvas edges so borders never stretch
        float edgeMargin = smoothstep(0.0, 0.08, uv.y) * smoothstep(1.0, 0.92, uv.y);

        // Layered harmonic traveling waves flowing gracefully from left to right
        float w1 = sin(uv.x * 4.5 - t * 2.0 + uv.y * 1.6) * 0.012;
        float w2 = cos(uv.x * 8.0 - t * 3.0 - uv.y * 2.2) * 0.006;
        float w3 = sin(uv.x * 13.0 - t * 4.2 + uv.y * 3.5) * 0.003;
        
        // Vertical gentle breathing swell
        float swell = sin(t * 1.1 + uv.x * 2.8) * 0.007;

        vec2 warpedUV = uv;
        warpedUV.y += (w1 + w2 + w3 + swell) * edgeMargin + m.y * (1.0 - uv.x);
        warpedUV.x += cos(uv.y * 3.5 - t * 0.9) * 0.005 * edgeMargin + m.x * uv.y;

        // Clamp coordinates cleanly
        warpedUV = clamp(warpedUV, 0.001, 0.999);

        // Sample texture with subtle chromatic dispersion for optical luxury sheen
        float r = texture2D(u_texture, warpedUV + vec2(0.001 * sin(t * 1.5), 0.0)).r;
        float g = texture2D(u_texture, warpedUV).g;
        float b = texture2D(u_texture, warpedUV - vec2(0.001 * cos(t * 1.5), 0.0)).b;
        vec4 texCol = vec4(r, g, b, 1.0);

        // Ribbon luminosity mask - strictly isolate luminous ribbon pixels
        float lum = max(max(texCol.r, texCol.g), texCol.b);
        float ribbonMask = smoothstep(0.2, 0.65, lum);

        // Traveling light pulse: silky beam of light traveling along ribbon curve
        float pulsePos = fract(uv.x * 0.4 - t * 0.2);
        float pulse = exp(-pow((pulsePos - 0.5) * 8.0, 2.0)) * ribbonMask;
        vec3 pulseColor = mix(vec3(1.0, 0.35, 0.75), vec3(1.0, 0.75, 0.25), smoothstep(0.4, 0.8, uv.x));
        texCol.rgb += pulseColor * pulse * 0.28;

        // Nexus focal point anamorphic bloom (aligned precisely with pinch at x=0.7312, y=0.5936)
        vec2 nexusPos = vec2(0.7312, 0.5936);
        float nexusDist = length((uv - nexusPos) * vec2(1.2, 2.2));
        float breath = 0.5 + 0.5 * sin(t * 2.2);
        
        // Anamorphic horizontal streak centered right through the nexus pinch
        float streak = exp(-pow((uv.y - nexusPos.y) * 45.0, 2.0)) * exp(-pow((uv.x - nexusPos.x) * 4.5, 2.0));
        vec3 streakCol = mix(vec3(1.0, 0.98, 1.0), vec3(1.0, 0.55, 0.85), 0.35);
        texCol.rgb += streakCol * streak * 0.4 * (0.8 + 0.2 * breath);

        // Soft radial glow at nexus
        float radialGlow = exp(-nexusDist * 7.0) * 0.25 * (0.75 + 0.25 * breath);
        texCol.rgb += vec3(1.0, 0.75, 0.88) * radialGlow;

        // Edge vignetting to keep deep contrast
        float vig = 1.0 - smoothstep(0.75, 1.5, length(uv - 0.5));
        texCol.rgb *= vig;

        gl_FragColor = texCol;
      }
    `

    function createShader(glCtx: WebGLRenderingContext, type: number, source: string) {
      const shader = glCtx.createShader(type)
      if (!shader) return null
      glCtx.shaderSource(shader, source)
      glCtx.compileShader(shader)
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.error(glCtx.getShaderInfoLog(shader))
        glCtx.deleteShader(shader)
        return null
      }
      return shader
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource)
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource)
    if (!vs || !fs) {
      setWebglSupported(false)
      return
    }

    const program = gl.createProgram()
    if (!program) {
      setWebglSupported(false)
      return
    }

    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program))
      setWebglSupported(false)
      return
    }

    gl.useProgram(program)

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]),
      gl.STATIC_DRAW
    )

    const posLoc = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    const resLoc = gl.getUniformLocation(program, 'u_resolution')
    const timeLoc = gl.getUniformLocation(program, 'u_time')
    const mouseLoc = gl.getUniformLocation(program, 'u_mouse')
    const texLoc = gl.getUniformLocation(program, 'u_texture')

    // Handle Resize
    const handleResize = () => {
      if (!canvas || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(rect.width * dpr)
      canvas.height = Math.floor(rect.height * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    // Smooth Mouse Handler
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      mouseRef.current.targetX = (e.clientX - rect.left) / rect.width
      mouseRef.current.targetY = (e.clientY - rect.top) / rect.height
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // IntersectionObserver to pause when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible && !animationFrameId && !prefersReducedMotion) {
          render()
        }
      },
      { threshold: 0.05 }
    )
    if (containerRef.current) observer.observe(containerRef.current)

    // Load texture
    const texture = gl.createTexture()
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = '/images/ribbons/brand-ribbon-flow.png'

    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)

      if (prefersReducedMotion) {
        drawFrame(0)
      } else {
        render()
      }
    }

    img.onerror = () => {
      setWebglSupported(false)
    }

    function drawFrame(nowSec: number) {
      if (!canvas || !gl || !texture) return
      // Mouse spring interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05

      gl.uniform2f(resLoc, canvas.width, canvas.height)
      gl.uniform1f(timeLoc, nowSec)
      gl.uniform2f(mouseLoc, mouseRef.current.x, mouseRef.current.y)

      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.uniform1i(texLoc, 0)

      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    function render() {
      if (!isVisible) return
      const now = (performance.now() - startTime) * 0.001
      drawFrame(now)
      animationFrameId = requestAnimationFrame(render)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      observer.disconnect()
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [])

  if (!webglSupported) {
    return (
      <div className="absolute inset-0 w-full h-full pointer-events-none opacity-90 mix-blend-screen overflow-hidden">
        <Image
          src="/images/ribbons/brand-ribbon-flow.png"
          alt="Business Beyond Borders Ribbon Flow"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
    )
  }

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden mix-blend-screen opacity-95">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover pointer-events-none"
      />
    </div>
  )
}
