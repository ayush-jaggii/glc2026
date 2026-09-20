import { NextResponse } from 'next/server'
import { allocateAuditoriumSeat, generateRegistrationId, AttendeeCategory } from '@/lib/seatAllocator'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      registrationType = 'delegate',
      fullName,
      email,
      phone,
      // Delegate specific
      organization,
      designation,
      passType,
      trackPreference,
      // Student specific
      institution,
      program,
      studentId
    } = body

    if (!fullName || !email) {
      return NextResponse.json(
        { error: 'Full Name and Email Address are required.' },
        { status: 400 }
      )
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    let resolvedCategory: AttendeeCategory = 'executive'
    let resolvedPassType = 'Executive Delegate'
    let resolvedAffiliation = ''
    let resolvedRoleOrProgram = ''

    if (registrationType === 'student') {
      if (!institution) {
        return NextResponse.json(
          { error: 'Institution / College name is required for student registration.' },
          { status: 400 }
        )
      }
      resolvedCategory = 'student'
      resolvedPassType = 'Student Delegate'
      resolvedAffiliation = institution.trim()
      resolvedRoleOrProgram = program?.trim() ? `${program.trim()}${studentId ? ` (${studentId.trim()})` : ''}` : 'Student Scholar'
    } else {
      if (!organization) {
        return NextResponse.json(
          { error: 'Organization / Company name is required for delegate registration.' },
          { status: 400 }
        )
      }
      if (passType?.toLowerCase().includes('corporate')) {
        resolvedCategory = 'corporate'
        resolvedPassType = 'Corporate Delegation'
      } else if (passType?.toLowerCase().includes('academic')) {
        resolvedCategory = 'academic'
        resolvedPassType = 'Academic Fellow'
      } else {
        resolvedCategory = 'executive'
        resolvedPassType = 'Executive Delegate'
      }
      resolvedAffiliation = organization.trim()
      resolvedRoleOrProgram = designation?.trim() || 'Industry Delegate'
    }

    // Allocate Auditorium Seat
    const registrationId = generateRegistrationId(resolvedCategory)
    const seatAllocation = allocateAuditoriumSeat(resolvedCategory, registrationId)

    const payload = {
      registrationId,
      registrationType,
      category: resolvedCategory,
      passType: resolvedPassType,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || 'N/A',
      affiliation: resolvedAffiliation,
      roleOrProgram: resolvedRoleOrProgram,
      trackPreference: trackPreference || 'General Plenary Track',
      seatNumber: seatAllocation.seatNumber,
      seatZone: seatAllocation.zone,
      seatGate: seatAllocation.gate,
      fullSeatString: seatAllocation.fullSeatString,
      submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      targetSpreadsheetId: '1ZS0-TQlBPyBjTMQqOM11M2Yi2lpbiA6RPd0U_PUEtH0',
      source: 'GLC 2026 Official Flagship Portal'
    }

    // Forward to configured Google Sheets webhook (Apps Script / SheetDB) if env var set
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || process.env.EXCEL_WEBHOOK_URL

    if (webhookUrl) {
      try {
        const upstream = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (!upstream.ok) {
          console.error('Google Sheets webhook returned non-OK status:', await upstream.text())
        }
      } catch (err) {
        console.error('Failed to dispatch to Google Sheets webhook:', err)
      }
    } else {
      console.log('Registration logged for Google Sheet (1ZS0-TQlBPyBjTMQqOM11M2Yi2lpbiA6RPd0U_PUEtH0):', payload)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Registration confirmed. Your official conference pass has been generated.',
        registrationId,
        passDetails: {
          regId: registrationId,
          name: payload.fullName,
          category: payload.passType,
          categoryKey: resolvedCategory,
          affiliation: payload.affiliation,
          roleOrProgram: payload.roleOrProgram,
          seat: seatAllocation.seatNumber,
          zone: seatAllocation.zone,
          gate: seatAllocation.gate,
          fullSeatString: seatAllocation.fullSeatString,
          date: 'Saturday, 10 October 2026',
          time: '09:00 AM IST',
          venue: 'Dr. Ramdas M. Pai Auditorium',
          campus: 'MAHE Bengaluru',
          submittedAt: payload.submittedAt
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Registration processing error:', error)
    return NextResponse.json(
      { error: 'An unexpected system error occurred while processing registration. Please try again.' },
      { status: 500 }
    )
  }
}
