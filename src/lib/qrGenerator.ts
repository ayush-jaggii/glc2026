import QRCode from 'qrcode'

export interface PassQrPayload {
  regId: string
  name: string
  category: string
  affiliation: string
  roleOrProgram: string
  seat: string
  gate: string
  venue: string
  date: string
  checkInUrl?: string
}

/**
 * Generates a high-resolution QR code data URL (PNG format)
 */
export async function generateQrDataUrl(payload: PassQrPayload | string): Promise<string> {
  const content = typeof payload === 'string' ? payload : JSON.stringify({
    glc: 'GLC 2026 · BUSINESS BEYOND BORDERS',
    id: payload.regId,
    name: payload.name,
    tier: payload.category,
    seat: payload.seat,
    gate: payload.gate,
    venue: 'Dr. Ramdas M. Pai Auditorium, MAHE Bengaluru',
    date: '10 October 2026',
    verify: payload.checkInUrl || `https://glc40.vercel.app/verify?id=${payload.regId}`
  })

  try {
    const dataUrl = await QRCode.toDataURL(content, {
      width: 400,
      margin: 1,
      color: {
        dark: '#0B0207',      // Deep GLC wine tone for crisp contrast
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    })
    return dataUrl
  } catch (err) {
    console.error('Failed to generate QR code data URL:', err)
    // Fallback: minimal 1x1 or empty string
    return ''
  }
}
