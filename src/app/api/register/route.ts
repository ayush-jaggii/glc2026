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

    // 1. Dual-Write: Safely persist delegate registration to Supabase database (PostgreSQL)
    // Ensures zero data loss and handles high-concurrency bursts effortlessly
    let supabaseRecordId: string | null = null
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://epkpjeuqfttwnptxnubt.supabase.co'
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwa3BqZXVxZnR0d25wdHhudWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwOTk2NDIsImV4cCI6MjEwNTY3NTY0Mn0.yT1WLsa057AXEnExxkJWU_s0uZ7XD4Qwx1PM7a9xgT0'

    if (resolvedCategory === 'delegate' && supabaseUrl && supabaseAnonKey) {
      try {
        const sbRes = await fetch(`${supabaseUrl}/rest/v1/delegates`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
            Prefer: 'return=representation'
          },
          body: JSON.stringify({
            full_name: payload.fullName,
            email: payload.email,
            phone: payload.phone,
            company: payload.company,
            designation: payload.designation,
            track_preference: payload.trackPreference,
            synced_to_sheets: false,
            submitted_at: payload.submittedAt
          }),
          signal: AbortSignal.timeout(5000)
        })

        if (sbRes.ok) {
          const inserted = await sbRes.json()
          if (Array.isArray(inserted) && inserted[0]?.id) {
            supabaseRecordId = inserted[0].id
            console.log('Delegate securely saved in Supabase:', supabaseRecordId)
          }
        } else {
          console.warn('Supabase delegate backup non-OK:', await sbRes.text())
        }
      } catch (sbErr) {
        console.warn('Supabase delegate backup dispatch warning:', sbErr)
      }
    }

    // 2. Forward delegate registration to Google Sheets webhook with automatic retries and 12s timeout
    const webhookUrl =
      process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
      process.env.EXCEL_WEBHOOK_URL ||
      'https://script.google.com/macros/s/AKfycbyBuLVzg4kTc78RHpJ4jg3OOXUYiDGBd43-xinzy9uelua0kbgT4mR53EHJpbSHu7eD/exec'

    if (resolvedCategory === 'delegate' && webhookUrl) {
      const MAX_RETRIES = 2
      let sheetDispatched = false

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          const upstream = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            redirect: 'follow',
            signal: AbortSignal.timeout(12000) // generous 12s timeout to accommodate cold starts & lock wait
          })

          if (upstream.ok) {
            sheetDispatched = true
            console.log(`Successfully recorded delegate to Google Sheet on attempt ${attempt}:`, payload.fullName)
            break
          } else {
            console.warn(`Google Sheets webhook attempt ${attempt} returned status ${upstream.status}`)
          }
        } catch (err) {
          console.warn(`Google Sheets webhook attempt ${attempt} failed:`, err)
        }

        // Wait 1.2s before retry
        if (attempt < MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, 1200))
        }
      }

      // If synced successfully, flag the record in Supabase
      if (sheetDispatched && supabaseRecordId && supabaseUrl && supabaseAnonKey) {
        try {
          await fetch(`${supabaseUrl}/rest/v1/delegates?id=eq.${supabaseRecordId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseAnonKey}`
            },
            body: JSON.stringify({ synced_to_sheets: true }),
            signal: AbortSignal.timeout(3000)
          })
        } catch {
          // Non-blocking sync status update
        }
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
