import crypto from 'crypto'

const AUTH_SALT = process.env.VOLUNTEER_AUTH_SALT || 'glc-2026-secure-volunteer-salt-mahe'

export function hashPassword(password: string): string {
  return crypto
    .createHmac('sha256', AUTH_SALT)
    .update(password.trim())
    .digest('hex')
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const hash = hashPassword(password)
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash))
  } catch {
    return false
  }
}

export function generateSessionToken(): string {
  return crypto.randomUUID()
}
