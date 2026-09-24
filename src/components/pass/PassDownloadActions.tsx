'use client'

import React, { useState } from 'react'
import { FileText, Image as ImageIcon, Check, Loader2 } from 'lucide-react'
import { PassDetails } from './DelegatePassCard'
import { ticketClipPath, TICKET_GEOMETRY } from '@/components/ui/admit-one-ticket'

interface PassDownloadActionsProps {
  pass: PassDetails
  cardElementId?: string
}

export default function PassDownloadActions({
  pass,
  cardElementId = 'conference-pass-card'
}: PassDownloadActionsProps) {
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const [downloadingImage, setDownloadingImage] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const sanitizeFilename = (str: string) => {
    return str.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30)
  }

  /**
   * Captures the live pass element with:
   * 1. Full WebGL liquid shader frame buffer cloned via 2D canvas/image.
   * 2. Crisp vector white TAPMI logo (no broken CSS invert filters).
   * 3. Custom fonts (Tektype & Geist) fully ready.
   * 4. Exact ticket silhouette clipping (4 rounded corners + 2 circular notches).
   * 5. Glowing pink-to-orange gradient perimeter stroke.
   */
  const captureAndClipTicket = async (element: HTMLElement): Promise<HTMLCanvasElement> => {
    // Ensure all custom fonts (Tektype, etc.) are rendered with exact metrics
    if (typeof document !== 'undefined' && document.fonts) {
      await document.fonts.ready
    }

    // Temporarily reset any 3D perspective or mouse-hover tilt
    if (element.parentElement) {
      element.parentElement.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)'
    }

    const html2canvas = (await import('html2canvas')).default

    // Guarantee ultra high-res output (at least 2200px wide) regardless of screen size
    const currentWidth = element.offsetWidth || 741
    const scale = Math.max(3, Math.min(5, Math.round(2223 / currentWidth)))

    const rawCanvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null, // Transparent canvas background
      logging: false,
      onclone: (clonedDoc, clonedEl) => {
        // Flatten any transforms in the cloned document
        clonedEl.style.transform = 'none'
        clonedEl.style.filter = 'none'
        if (clonedEl.parentElement) {
          clonedEl.parentElement.style.transform = 'none'
        }

        // Copy the active WebGL canvas pixels into the clone
        const liveCanvas = element.querySelector('canvas')
        const clonedCanvas = clonedEl.querySelector('canvas')
        if (liveCanvas && clonedCanvas) {
          try {
            const copyCanvas = clonedDoc.createElement('canvas')
            copyCanvas.width = liveCanvas.width
            copyCanvas.height = liveCanvas.height
            copyCanvas.style.cssText = liveCanvas.style.cssText
            const ctx = copyCanvas.getContext('2d')
            if (ctx) {
              ctx.drawImage(liveCanvas, 0, 0)
            }
            clonedCanvas.parentNode?.replaceChild(copyCanvas, clonedCanvas)
          } catch {
            try {
              const img = clonedDoc.createElement('img')
              img.src = liveCanvas.toDataURL('image/png')
              img.style.cssText = clonedCanvas.style.cssText
              img.style.position = 'absolute'
              img.style.inset = '0'
              img.style.width = '100%'
              img.style.height = '100%'
              img.style.objectFit = 'cover'
              clonedCanvas.parentNode?.replaceChild(img, clonedCanvas)
            } catch (e2) {
              console.error('Failed to clone WebGL canvas', e2)
            }
          }
        }

        // Ensure the entire student info row (program, roll number, dot separator, and seat pill)
        // is rasterized onto a single unified canvas along the EXACT same horizontal center line.
        const liveSubmeta = element.querySelector('[data-submeta-line]') as HTMLElement | null
        const clonedSubmeta = clonedEl.querySelector('[data-submeta-line]') as HTMLElement | null
        if (liveSubmeta && clonedSubmeta) {
          try {
            const progRoll = (liveSubmeta.getAttribute('data-program-roll') || '').toUpperCase()
            const seat = liveSubmeta.getAttribute('data-seat') || ''

            if (seat) {
              const seatText = `SEAT: ${seat}`
              const refScale = currentWidth / 741
              const fontSize = 13.5 * refScale
              const pillFontSize = 11.5 * refScale
              const pillH = Math.round(22 * refScale)
              const dotGap = Math.round(10 * refScale)

              // Compute computed styles from live element for font family
              const computedStyle = window.getComputedStyle(liveSubmeta)
              const fontFamily = computedStyle.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'

              // Measure components using a temporary canvas context
              const measureCanvas = document.createElement('canvas')
              const mCtx = measureCanvas.getContext('2d')
              if (mCtx) {
                mCtx.font = `600 ${fontSize}px ${fontFamily}`
                if ('letterSpacing' in mCtx) {
                  // @ts-ignore
                  mCtx.letterSpacing = '0.05em'
                }
                const progWidth = mCtx.measureText(progRoll).width
                const dotWidth = mCtx.measureText('·').width

                mCtx.font = `bold ${pillFontSize}px ${fontFamily}`
                if ('letterSpacing' in mCtx) {
                  // @ts-ignore
                  mCtx.letterSpacing = '0.06em'
                }
                const pillPadX = Math.round(10 * refScale)
                const seatMetrics = mCtx.measureText(seatText)
                const pillW = Math.round(seatMetrics.width + pillPadX * 2)

                const totalW = Math.round(progWidth + dotGap + dotWidth + dotGap + pillW + 20)
                const totalH = Math.max(pillH, Math.round(26 * refScale))
                const centerY = totalH / 2

                const unifiedCanvas = clonedDoc.createElement('canvas')
                unifiedCanvas.width = Math.round(totalW * scale)
                unifiedCanvas.height = Math.round(totalH * scale)
                unifiedCanvas.style.width = `${totalW}px`
                unifiedCanvas.style.height = `${totalH}px`
                unifiedCanvas.style.display = 'block'
                unifiedCanvas.style.marginTop = `${Math.round(26 * refScale)}px`

                const uCtx = unifiedCanvas.getContext('2d')
                if (uCtx) {
                  uCtx.scale(scale, scale)

                  // 1. Draw Program & Roll number
                  uCtx.font = `600 ${fontSize}px ${fontFamily}`
                  if ('letterSpacing' in uCtx) {
                    // @ts-ignore
                    uCtx.letterSpacing = '0.05em'
                  }
                  uCtx.textAlign = 'left'
                  uCtx.textBaseline = 'middle'
                  uCtx.fillStyle = '#f8f4ec' // text-cream-100
                  uCtx.shadowColor = 'rgba(0,0,0,0.95)'
                  uCtx.shadowBlur = 8
                  uCtx.shadowOffsetY = 2
                  uCtx.fillText(progRoll, 0, centerY)

                  // 2. Draw pink separator dot
                  let cursorX = progWidth + dotGap
                  uCtx.fillStyle = '#F45197'
                  uCtx.fillText('·', cursorX, centerY)
                  cursorX += dotWidth + dotGap

                  // Clear shadow for pill container
                  uCtx.shadowColor = 'transparent'
                  uCtx.shadowBlur = 0
                  uCtx.shadowOffsetY = 0

                  // 3. Draw Pill Capsule
                  const pillY = centerY - pillH / 2
                  const radius = pillH / 2
                  uCtx.beginPath()
                  if (typeof uCtx.roundRect === 'function') {
                    uCtx.roundRect(cursorX, pillY, pillW, pillH, radius)
                  } else {
                    uCtx.moveTo(cursorX + radius, pillY)
                    uCtx.lineTo(cursorX + pillW - radius, pillY)
                    uCtx.arc(cursorX + pillW - radius, pillY + radius, radius, -Math.PI / 2, Math.PI / 2)
                    uCtx.lineTo(cursorX + radius, pillY + pillH)
                    uCtx.arc(cursorX + radius, pillY + radius, radius, Math.PI / 2, (3 * Math.PI) / 2)
                    uCtx.closePath()
                  }
                  uCtx.fillStyle = 'rgba(255, 255, 255, 0.12)'
                  uCtx.fill()
                  uCtx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
                  uCtx.lineWidth = 1
                  uCtx.stroke()

                  // 4. Draw Seat Text centered inside the pill
                  uCtx.font = `bold ${pillFontSize}px ${fontFamily}`
                  if ('letterSpacing' in uCtx) {
                    // @ts-ignore
                    uCtx.letterSpacing = '0.06em'
                  }
                  uCtx.fillStyle = '#FFFFFF'
                  uCtx.textAlign = 'center'
                  uCtx.textBaseline = 'middle'
                  uCtx.fillText(seatText, cursorX + pillW / 2, centerY)
                }

                clonedSubmeta.parentNode?.replaceChild(unifiedCanvas, clonedSubmeta)
              }
            }
          } catch (lineErr) {
            console.error('Failed to rasterize submeta line for download', lineErr)
          }
        }
      }
    })

    // Create the final canvas clipped along the authentic notched ticket path
    const destCanvas = document.createElement('canvas')
    destCanvas.width = rawCanvas.width
    destCanvas.height = rawCanvas.height
    const ctx = destCanvas.getContext('2d')
    if (!ctx) return rawCanvas

    const pathD = ticketClipPath(rawCanvas.width, rawCanvas.height, TICKET_GEOMETRY)
    const path = new Path2D(pathD)

    // 1. Clip to exact notched ticket outline (makes corners & notches transparent)
    ctx.save()
    ctx.clip(path)
    ctx.drawImage(rawCanvas, 0, 0)
    ctx.restore()

    // 2. Stroke the glowing gradient perimeter
    ctx.save()
    const grad = ctx.createLinearGradient(0, 0, rawCanvas.width, rawCanvas.height)
    grad.addColorStop(0, 'rgba(244, 81, 151, 0.95)')
    grad.addColorStop(0.45, 'rgba(255, 197, 182, 0.85)')
    grad.addColorStop(0.85, 'rgba(245, 130, 50, 0.95)')
    ctx.strokeStyle = grad
    ctx.lineWidth = Math.max(3, Math.round(rawCanvas.width * (2 / 741)))
    ctx.stroke(path)
    ctx.restore()

    return destCanvas
  }

  const handleDownloadPdf = async () => {
    try {
      setDownloadingPdf(true)
      const element = document.getElementById(cardElementId)
      if (!element) {
        throw new Error('Pass card element not found in DOM')
      }

      const clippedCanvas = await captureAndClipTicket(element)
      const { jsPDF } = await import('jspdf')

      // Standard ticket format: 200mm wide x 114.71mm high, on 220mm x 135mm page
      const ticketMmWidth = 200
      const ticketMmHeight = (clippedCanvas.height * ticketMmWidth) / clippedCanvas.width
      const pageMmWidth = ticketMmWidth + 20
      const pageMmHeight = ticketMmHeight + 20

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [pageMmWidth, pageMmHeight]
      })

      // Deep luxury wine background
      pdf.setFillColor(10, 2, 7)
      pdf.rect(0, 0, pageMmWidth, pageMmHeight, 'F')

      // Draw the clipped ticket centered with authentic notches
      const imgData = clippedCanvas.toDataURL('image/png')
      pdf.addImage(imgData, 'PNG', 10, 10, ticketMmWidth, ticketMmHeight)

      const safeName = sanitizeFilename(pass.name)
      pdf.save(`GLC2026_Delegate_Pass_${safeName}.pdf`)

      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 4000)
    } catch (err) {
      console.error('Error generating PDF:', err)
      window.print()
    } finally {
      setDownloadingPdf(false)
    }
  }

  const handleDownloadImage = async () => {
    try {
      setDownloadingImage(true)
      const element = document.getElementById(cardElementId)
      if (!element) return

      const clippedCanvas = await captureAndClipTicket(element)

      const link = document.createElement('a')
      link.download = `GLC2026_Delegate_Pass_${sanitizeFilename(pass.name)}.png`
      link.href = clippedCanvas.toDataURL('image/png')
      link.click()

      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 4000)
    } catch (err) {
      console.error('Error generating Image:', err)
    } finally {
      setDownloadingImage(false)
    }
  }

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
      
      {/* Primary: Download PDF */}
      <button
        type="button"
        onClick={handleDownloadPdf}
        disabled={downloadingPdf}
        className="w-full sm:w-auto px-6 py-3.5 rounded-full font-semibold text-xs tracking-wider uppercase text-white bg-gradient-to-r from-glc-magenta via-glc-pink to-glc-orange hover:shadow-[0_0_24px_-4px_rgba(244,81,151,0.6)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
      >
        {downloadingPdf ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating High-Res PDF...</span>
          </>
        ) : downloadSuccess ? (
          <>
            <Check className="w-4 h-4 text-emerald-300" />
            <span>Pass Downloaded!</span>
          </>
        ) : (
          <>
            <FileText className="w-4 h-4" />
            <span>Download Pass (PDF)</span>
          </>
        )}
      </button>

      {/* Secondary: Save Image PNG */}
      <button
        type="button"
        onClick={handleDownloadImage}
        disabled={downloadingImage}
        className="w-full sm:w-auto px-6 py-3.5 rounded-full font-semibold text-xs tracking-wider uppercase text-cream-200 hover:text-white bg-wine-900/70 hover:bg-wine-850 border border-wine-700/80 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer shadow-md"
      >
        {downloadingImage ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ImageIcon className="w-4 h-4 text-glc-orange" />
        )}
        <span>Save as Image (PNG)</span>
      </button>

    </div>
  )
}
