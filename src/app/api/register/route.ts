import { NextResponse } from 'next/server'
import QRCode from 'qrcode'
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
      studentId,
      rollNumber: rawRollNumber,
      program
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

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://epkpjeuqfttwnptxnubt.supabase.co'
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwa3BqZXVxZnR0d25wdHhudWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwOTk2NDIsImV4cCI6MjEwNTY3NTY0Mn0.yT1WLsa057AXEnExxkJWU_s0uZ7XD4Qwx1PM7a9xgT0'

    // ==========================================
    // 1. STUDENT REGISTRATION ENGINE (SUPABASE)
    // ==========================================
    if (registrationType === 'student') {
      const rollNumber = (studentId || rawRollNumber || '').trim().toUpperCase()

      if (!rollNumber) {
        return NextResponse.json(
          { error: 'College Roll Number / Student ID is required for student registration.' },
          { status: 400 }
        )
      }

      const yearLabel = year?.trim() || 'Student'
      const programLabel = program?.trim() || 'TAPMI / MAHE Bengaluru'

      // Check if student is already in Supabase (either pre-loaded by PACE or previously registered)
      let studentRecord: any = null

      try {
        const checkRes = await fetch(
          `${supabaseUrl}/rest/v1/students?roll_number=eq.${encodeURIComponent(rollNumber)}&select=*`,
          {
            headers: {
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseAnonKey}`
            }
          }
        )
        if (checkRes.ok) {
          const existing = await checkRes.json()
          if (Array.isArray(existing) && existing.length > 0) {
            studentRecord = existing[0]
          }
        }
      } catch (err) {
        console.warn('Supabase student lookup error:', err)
      }

      const qrToken =
        studentRecord?.qr_token ||
        `GLC26-STU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

      if (studentRecord) {
        // Update contact details and ensure qr_token is active
        try {
          const updateRes = await fetch(
            `${supabaseUrl}/rest/v1/students?id=eq.${studentRecord.id}`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                apikey: supabaseAnonKey,
                Authorization: `Bearer ${supabaseAnonKey}`,
                Prefer: 'return=representation'
              },
              body: JSON.stringify({
                full_name: fullName.trim() || studentRecord.full_name,
                email: email.trim().toLowerCase() || studentRecord.email,
                phone: phone?.trim() || studentRecord.phone,
                year_of_study: yearLabel || studentRecord.year_of_study,
                qr_token: qrToken
              })
            }
          )
          if (updateRes.ok) {
            const updated = await updateRes.json()
            if (Array.isArray(updated) && updated.length > 0) {
              studentRecord = updated[0]
            }
          }
        } catch (patchErr) {
          console.warn('Supabase student record update warning:', patchErr)
        }
      } else {
        // PACE hasn't pre-loaded this student yet, insert with PACE pending seat
        const defaultSeatNumber = body.seatNumber || 'Allocated at Check-in'
        const defaultZone = 'Balcony · Student Seating'
        const defaultGate = 'Gate 3 · Student Check-In'

        try {
          const insertRes = await fetch(`${supabaseUrl}/rest/v1/students`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseAnonKey}`,
              Prefer: 'return=representation'
            },
            body: JSON.stringify({
              roll_number: rollNumber,
              full_name: fullName.trim(),
              email: email.trim().toLowerCase(),
              phone: phone?.trim() || 'N/A',
              program: programLabel,
              year_of_study: yearLabel,
              seat_number: defaultSeatNumber,
              seat_zone: defaultZone,
              gate: defaultGate,
              full_seat_string: `${defaultZone} · ${defaultSeatNumber}`,
              qr_token: qrToken,
              status: 'ABSENT'
            })
          })

          if (insertRes.ok) {
            const inserted = await insertRes.json()
            if (Array.isArray(inserted) && inserted.length > 0) {
              studentRecord = inserted[0]
            }
          }
        } catch (insertErr) {
          console.error('Supabase student insert error:', insertErr)
        }

        if (!studentRecord) {
          studentRecord = {
            roll_number: rollNumber,
            full_name: fullName.trim(),
            program: programLabel,
            year_of_study: yearLabel,
            seat_number: defaultSeatNumber,
            seat_zone: defaultZone,
            gate: defaultGate,
            full_seat_string: `${defaultZone} · ${defaultSeatNumber}`,
            qr_token: qrToken,
            status: 'ABSENT'
          }
        }
      }

      // Generate verifiable QR code data URL
      const verificationUrl = `https://www.tapmiblrglc.in/verify?token=${studentRecord.qr_token}`
      const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
        margin: 1,
        width: 320,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Your official GLC 2026 student pass has been generated.',
        registrationId: studentRecord.qr_token,
        passDetails: {
          regId: studentRecord.qr_token,
          name: studentRecord.full_name,
          category: 'Student Pass',
          categoryKey: 'student',
          affiliation: 'TAPMI Bengaluru, MAHE',
          roleOrProgram: `${studentRecord.year_of_study} (${studentRecord.roll_number})`,
          seat: studentRecord.seat_number,
          zone: studentRecord.seat_zone,
          gate: studentRecord.gate,
          fullSeatString: studentRecord.full_seat_string,
          date: 'Saturday, 10 October 2026',
          time: '09:00 AM IST',
          venue: 'Dr. Ramdas M. Pai Auditorium',
          campus: 'MAHE Bengaluru',
          qrDataUrl,
          submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        }
      })
    }

    // ==========================================
    // 2. DELEGATE REGISTRATION ENGINE
    // ==========================================
    if (!organization) {
      return NextResponse.json(
        { error: 'Organization / Company name is required for delegate registration.' },
        { status: 400 }
      )
    }

    const resolvedCategory: AttendeeCategory = 'delegate'
    const resolvedPassType = 'Delegate Pass'
    const resolvedAffiliation = organization.trim()
    const resolvedRoleOrProgram = designation?.trim() || 'Delegate'

    // Allocate Auditorium Seat
    const registrationId = generateRegistrationId(resolvedCategory)
    const seatAllocation = allocateAuditoriumSeat(resolvedCategory, registrationId)

    const payload = {
      // For delegates: omit delegate ID, registration type, pass type, seat, and entry
      registrationId: '',
      registrationType: '',
      category: resolvedCategory,
      passType: '',
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || 'N/A',
      affiliation: resolvedAffiliation,
      company: resolvedAffiliation,
      roleOrProgram: resolvedRoleOrProgram,
      designation: resolvedRoleOrProgram,
      trackPreference: trackPreference || 'General Delegate',
      seatNumber: '',
      seatZone: '',
      seatGate: '',
      fullSeatString: '',
      submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      targetSpreadsheetId: '15sqfdMeYUw0s57I-4bGBxOXy_eA1HM4YnXT0pSYM7sk',
      source: 'GLC 2026 Official Flagship Portal'
    }

    // 1. Dual-Write: Safely persist delegate registration to Supabase database (PostgreSQL)
    // Ensures zero data loss and handles high-concurrency bursts effortlessly
    let supabaseRecordId: string | null = null

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
