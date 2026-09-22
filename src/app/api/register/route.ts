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
      year,
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

    let resolvedCategory: AttendeeCategory = 'delegate'
    let resolvedPassType = 'Delegate Pass'
    let resolvedAffiliation = ''
    let resolvedRoleOrProgram = ''

    if (registrationType === 'student') {
      resolvedCategory = 'student'
      resolvedPassType = 'Student Pass'
      resolvedAffiliation = 'TAPMI Bengaluru, MAHE'
      const yearLabel = year?.trim() || 'Student'
      resolvedRoleOrProgram = `${yearLabel}${studentId ? ` (${studentId.trim()})` : ''}`
    } else {
      if (!organization) {
        return NextResponse.json(
          { error: 'Organization / Company name is required for delegate registration.' },
          { status: 400 }
        )
      }
      resolvedCategory = 'delegate'
      resolvedPassType = 'Delegate Pass'
      resolvedAffiliation = organization.trim()
      resolvedRoleOrProgram = designation?.trim() || 'Delegate'
    }

    // Allocate Auditorium Seat
    const registrationId = generateRegistrationId(resolvedCategory)
    const seatAllocation = allocateAuditoriumSeat(resolvedCategory, registrationId)

    const payload = {
      // For delegates: omit delegate ID, registration type, pass type, seat, and entry
      registrationId: resolvedCategory === 'student' ? registrationId : '',
      registrationType: resolvedCategory === 'student' ? registrationType : '',
      category: resolvedCategory,
      passType: resolvedCategory === 'student' ? resolvedPassType : '',
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || 'N/A',
      affiliation: resolvedAffiliation,
      company: resolvedAffiliation,
      roleOrProgram: resolvedRoleOrProgram,
      designation: resolvedRoleOrProgram,
      trackPreference: trackPreference || 'General Delegate',
      seatNumber: resolvedCategory === 'student' ? seatAllocation.seatNumber : '',
      seatZone: resolvedCategory === 'student' ? seatAllocation.zone : '',
      seatGate: resolvedCategory === 'student' ? seatAllocation.gate : '',
      fullSeatString: resolvedCategory === 'student' ? seatAllocation.fullSeatString : '',
      submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      targetSpreadsheetId: '15sqfdMeYUw0s57I-4bGBxOXy_eA1HM4YnXT0pSYM7sk',
      source: 'GLC 2026 Official Flagship Portal'
    }

    // Forward ONLY delegate registrations to configured Google Sheets webhook
    // (Student registrations will be handled separately via Supabase for the QR attendance system and are NOT recorded in this Google Sheet)
    const webhookUrl =
      process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
      process.env.EXCEL_WEBHOOK_URL ||
      'https://script.google.com/macros/s/AKfycbyBuLVzg4kTc78RHpJ4jg3OOXUYiDGBd43-xinzy9uelua0kbgT4mR53EHJpbSHu7eD/exec'

    if (resolvedCategory === 'delegate' && webhookUrl) {
      try {
        const upstream = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          redirect: 'follow',
          signal: AbortSignal.timeout(6000)
        })
        if (!upstream.ok) {
          console.error('Google Sheets webhook returned non-OK status:', await upstream.text())
        } else {
          console.log('Successfully recorded delegate to Google Sheet:', payload.registrationId)
        }
      } catch (err) {
        console.error('Failed to dispatch to Google Sheets webhook:', err)
      }
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
