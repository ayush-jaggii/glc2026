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

    // Try WebGL context with preserveDrawingBuffer to prevent clearing on scroll/compositor pass
    const contextOptions: WebGLContextAttributes = {
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
    }

    const gl = (canvas.getContext('webgl', contextOptions) ||
      canvas.getContext('experimental-webgl', contextOptions)) as WebGLRenderingContext | null

    if (!gl) {
      setWebglSupported(false)
      return
    }

    let animationFrameId = 0
    let isVisible = true
    let startTime = performance.now()
    let textureLoaded = false
    let texture: WebGLTexture | null = null

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
        // Screen space coordinates [0, 1]
        vec2 st = v_uv;
        st.y = 1.0 - st.y; // Invert Y so (0,0) is top-left, matching image coordinates

        // Texture aspect ratio (1674 / 940 = 1.78085)
        float texAspect = 1674.0 / 940.0;
        float screenAspect = u_resolution.x / max(u_resolution.y, 1.0);

        // Desktop projection
        vec2 desktopUV = st;
        vec2 nexusPos = vec2(0.7312, 0.5936);
        vec2 desktopNexus = nexusPos;

        if (screenAspect >= texAspect) {
          // Desktop / Ultrawide: Screen is wider than the texture
          float scale = texAspect / screenAspect;
          desktopUV.y = (st.y - 0.5) * scale + 0.5;
          desktopNexus.y = (nexusPos.y - 0.5) / scale + 0.5;
        } else {
          // Standard Desktop / Laptop
          float scale = screenAspect / texAspect;
          float focusX = mix(0.5, 0.62, clamp((1.0 - screenAspect) * 1.4, 0.0, 1.0));
          desktopUV.x = (st.x - 0.5) * scale + focusX;
          desktopNexus.x = (nexusPos.x - focusX) / scale + 0.5;
        }

        // Mobile / Portrait Fit Projection:
        // On phones/portrait viewports, fit the entire horizontal ribbon across the screen!
        vec2 mobileUV;
        mobileUV.x = (st.x - 0.5) * 1.05 + 0.52;
        mobileUV.y = (st.y - 0.54) * 2.2 + 0.51;
        vec2 mobileNexus = vec2(0.52, 0.54);

        // Smooth transition factor: 0.0 on desktop (aspect >= 1.2), 1.0 on mobile (aspect <= 0.95)
        float mobileFactor = smoothstep(1.2, 0.95, screenAspect);

        vec2 uv = mix(desktopUV, mobileUV, mobileFactor);
        vec2 stNexus = mix(desktopNexus, mobileNexus, mobileFactor);

        float t = u_time * 0.38;

        // Smooth interactive parallax tilt from cursor
        vec2 m = (u_mouse - 0.5) * 0.025;

        // Clean margin dampener near screen top/bottom borders
        float edgeMargin = smoothstep(0.0, 0.06, st.y) * smoothstep(1.0, 0.94, st.y);

        // Layered harmonic traveling waves flowing gracefully from left to right
        float w1 = sin(uv.x * 4.5 - t * 2.0 + uv.y * 1.6) * 0.012;
        float w2 = cos(uv.x * 8.0 - t * 3.0 - uv.y * 2.2) * 0.006;
        float w3 = sin(uv.x * 13.0 - t * 4.2 + uv.y * 3.5) * 0.003;
        
        // Vertical gentle breathing swell
        float swell = sin(t * 1.1 + uv.x * 2.8) * 0.007;

        vec2 warpedUV = uv;
        warpedUV.y += (w1 + w2 + w3 + swell) * edgeMargin + m.y * (1.0 - st.x);
        warpedUV.x += cos(uv.y * 3.5 - t * 0.9) * 0.005 * edgeMargin + m.x * st.y;

        // Clamp coordinates cleanly to avoid texture border bleeding
        warpedUV = clamp(warpedUV, 0.002, 0.998);

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

        // Nexus focal point bloom in true screen space (avoids mobile distortion)
        vec2 screenDelta = (st - stNexus) * vec2(screenAspect, 1.0);
        float nexusDist = length(screenDelta);
        float breath = 0.5 + 0.5 * sin(t * 2.2);
        
        // Anamorphic horizontal streak centered right through the nexus
        float streak = exp(-pow((st.y - stNexus.y) * 40.0, 2.0)) * exp(-pow(screenDelta.x * 4.0, 2.0));
        vec3 streakCol = mix(vec3(1.0, 0.98, 1.0), vec3(1.0, 0.55, 0.85), 0.35);
        texCol.rgb += streakCol * streak * 0.35 * (0.8 + 0.2 * breath);

        // Soft radial glow at nexus
        float radialGlow = exp(-nexusDist * 6.0) * 0.22 * (0.75 + 0.25 * breath);
        texCol.rgb += vec3(1.0, 0.75, 0.88) * radialGlow;

        // Edge vignetting in screen space to maintain deep contrast
        float vig = 1.0 - smoothstep(0.75, 1.5, length(st - 0.5));
        texCol.rgb *= vig;

        // Soft vertical edge fade on mobile so ribbon top and bottom melt cleanly into dark background
        float mobileVertFade = smoothstep(0.0, 0.10, uv.y) * smoothstep(1.0, 0.90, uv.y);
        texCol.rgb *= mix(1.0, mobileVertFade, mobileFactor);

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
      if (!isVisible) {
        animationFrameId = 0
        return
      }
      const now = (performance.now() - startTime) * 0.001
      drawFrame(now)
      animationFrameId = requestAnimationFrame(render)
    }

    function startAnimation() {
      if (!animationFrameId && isVisible && !prefersReducedMotion && textureLoaded) {
        animationFrameId = requestAnimationFrame(render)
      }
    }

    function stopAnimation() {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = 0
      }
    }

    // Handle Resize
    const handleResize = () => {
      if (!canvas || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const newWidth = Math.floor(rect.width * dpr)
      const newHeight = Math.floor(rect.height * dpr)
      if (canvas.width !== newWidth || canvas.height !== newHeight) {
        canvas.width = newWidth
        canvas.height = newHeight
        gl.viewport(0, 0, canvas.width, canvas.height)
      }
      if (textureLoaded) {
        const now = (performance.now() - startTime) * 0.001
        drawFrame(now)
      }
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

    // IntersectionObserver to pause when off-screen and reliably resume when scrolled back into view
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible) {
          if (textureLoaded) {
            const now = (performance.now() - startTime) * 0.001
            drawFrame(now)
            startAnimation()
          }
        } else {
          stopAnimation()
        }
      },
      { threshold: 0.0 }
    )
    if (containerRef.current) observer.observe(containerRef.current)

    // Handle Tab/Page Visibility (e.g. switching tabs or waking up on mobile)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation()
      } else if (isVisible && textureLoaded) {
        const now = (performance.now() - startTime) * 0.001
        drawFrame(now)
        startAnimation()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Load texture
    texture = gl.createTexture()
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
      textureLoaded = true

      handleResize()
      if (prefersReducedMotion) {
        drawFrame(0)
      } else if (isVisible) {
        startAnimation()
      }
    }

    img.onerror = () => {
      setWebglSupported(false)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      observer.disconnect()
      stopAnimation()
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
          className="object-cover object-[62%_50%]"
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
