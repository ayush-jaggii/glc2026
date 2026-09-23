export type AttendeeCategory = 'student' | 'delegate' | 'executive' | 'corporate' | 'academic'

export interface SeatAllocation {
  seatNumber: string          // e.g. "Row B-14"
  zone: string                // e.g. "Executive Stalls"
  row: string                 // e.g. "Row B"
  seatIndex: string           // e.g. "Seat 14"
  gate?: string               // Optional gate reference
  fullSeatString: string      // e.g. "Delegate Stalls · Row B-14"
}

/**
 * Deterministically generates an auditorium seat number based on category and reference hash
 * for Dr. Ramdas M. Pai Auditorium, MAHE Bengaluru.
 */
export function allocateAuditoriumSeat(category: AttendeeCategory, seed?: string): SeatAllocation {
  // Use pseudo-hash for repeatable or dynamic distribution
  const hashSeed = seed || Math.random().toString(36).substring(2, 9)
  let numericHash = 0
  for (let i = 0; i < hashSeed.length; i++) {
    numericHash = (numericHash * 31 + hashSeed.charCodeAt(i)) & 0xffffffff
  }
  const positiveHash = Math.abs(numericHash)

  switch (category) {
    case 'student': {
      const studentRows = ['J', 'K', 'L', 'M', 'N']
      const row = studentRows[positiveHash % studentRows.length]
      const seatNum = ((positiveHash >> 3) % 35) + 1
      const seatPad = seatNum.toString().padStart(2, '0')
      return {
        seatNumber: `Row ${row}-${seatPad}`,
        zone: 'Balcony · Student Seating',
        row: `Row ${row}`,
        seatIndex: `Seat ${seatPad}`,
        gate: 'Gate 3 · Student Check-In',
        fullSeatString: `Balcony · Row ${row}-${seatPad}`
      }
    }

    case 'delegate':
    case 'executive':
    default: {
      const execRows = ['A', 'B', 'C', 'D', 'E', 'F']
      const row = execRows[positiveHash % execRows.length]
      const seatNum = ((positiveHash >> 3) % 28) + 1
      const seatPad = seatNum.toString().padStart(2, '0')
      return {
        seatNumber: `Row ${row}-${seatPad}`,
        zone: 'Executive & Delegate Stalls',
        row: `Row ${row}`,
        seatIndex: `Seat ${seatPad}`,
        gate: 'Gate 1 · Main Delegate Desk',
        fullSeatString: `Delegate Stalls · Row ${row}-${seatPad}`
      }
    }
  }
}

/**
 * Generates an official reference ID
 */
export function generateRegistrationId(category: AttendeeCategory): string {
  const prefixMap: Record<AttendeeCategory, string> = {
    student: 'GLC26-STU',
    delegate: 'GLC26-DEL',
    executive: 'GLC26-DEL',
    corporate: 'GLC26-DEL',
    academic: 'GLC26-DEL'
  }
  const prefix = prefixMap[category] || 'GLC26-DEL'
  const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `${prefix}-${randomSuffix}`
}
