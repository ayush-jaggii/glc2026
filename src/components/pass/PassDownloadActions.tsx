'use client'

import React, { useState } from 'react'
import { Download, FileText, Image as ImageIcon, Printer, Check, Loader2 } from 'lucide-react'
import { PassDetails } from './DelegatePassCard'

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

  const handleDownloadPdf = async () => {
    try {
      setDownloadingPdf(true)
      const element = document.getElementById(cardElementId)
      if (!element) {
        throw new Error('Pass card element not found in DOM')
      }

      // Dynamic import to prevent any SSR compilation friction
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')

      // Capture at high resolution (scale 2.5)
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0B0207',
        logging: false
      })

      const imgData = canvas.toDataURL('image/png')

      // Create PDF in landscape matching standard ticket/pass aspect ratio
      const imgWidth = 280 // mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [imgWidth + 20, imgHeight + 20]
      })

      pdf.setFillColor(11, 2, 7) // Wine background for PDF margins
      pdf.rect(0, 0, imgWidth + 20, imgHeight + 20, 'F')
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight)

      const safeName = sanitizeFilename(pass.name)
      pdf.save(`GLC2026_Delegate_Pass_${safeName}.pdf`)

      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 4000)
    } catch (err) {
      console.error('Error generating PDF:', err)
      // Fallback: trigger native browser print
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

      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0B0207',
        logging: false
      })

      const link = document.createElement('a')
      link.download = `GLC2026_Delegate_Pass_${sanitizeFilename(pass.name)}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()

      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 4000)
    } catch (err) {
      console.error('Error generating Image:', err)
    } finally {
      setDownloadingImage(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
      
      {/* Primary: Download PDF */}
      <button
        type="button"
        onClick={handleDownloadPdf}
        disabled={downloadingPdf}
        className="w-full sm:w-auto px-6 py-3.5 rounded-full font-semibold text-xs tracking-wider uppercase text-white bg-gradient-to-r from-glc-magenta via-glc-pink to-glc-orange hover:shadow-[0_0_24px_-4px_rgba(244,81,151,0.6)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg"
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
        className="w-full sm:w-auto px-5 py-3.5 rounded-full font-semibold text-xs tracking-wider uppercase text-cream-200 hover:text-white bg-wine-900/70 hover:bg-wine-850 border border-wine-700/80 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {downloadingImage ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ImageIcon className="w-4 h-4 text-glc-orange" />
        )}
        <span>Save as Image (PNG)</span>
      </button>

      {/* Secondary: Print */}
      <button
        type="button"
        onClick={handlePrint}
        className="w-full sm:w-auto px-5 py-3.5 rounded-full font-semibold text-xs tracking-wider uppercase text-cream-300 hover:text-white bg-wine-950/80 hover:bg-wine-900 border border-wine-800 transition-all duration-200 flex items-center justify-center gap-2"
        title="Print Pass"
      >
        <Printer className="w-4 h-4 text-cream-400" />
        <span>Print</span>
      </button>

    </div>
  )
}
