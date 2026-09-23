import QRCode from 'qrcode'

export interface PassQrPayload {
  regId: string
  name: string
  category: string
  affiliation: string
  roleOrProgram: string
  seat: string
  gate?: string
  venue: string
  date: string
  checkInUrl?: string
}

/**
 * Generates a high-resolution QR code data URL (PNG format)
 */
export async function generateQrDataUrl(payload: PassQrPayload | string): Promise<string> {
  const content =
    typeof payload === 'string'
      ? payload
      : payload.checkInUrl ||
        `https://www.tapmiblrglc.in/verify?token=${payload.regId}`

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
