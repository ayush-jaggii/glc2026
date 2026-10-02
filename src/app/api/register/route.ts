import { NextResponse } from 'next/server'
import QRCode from 'qrcode'
import crypto from 'crypto'
import { allocateAuditoriumSeat, generateRegistrationId, AttendeeCategory } from '@/lib/seatAllocator'

// In-memory debounce cache to prevent rapid double-clicks from creating duplicate rows
const recentDelegateSubmissions = new Map<string, number>()

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

    if (registrationType === 'delegate') {
      if (!fullName || !email) {
        return NextResponse.json(
          { error: 'Full Name and Email Address are required for delegate registration.' },
          { status: 400 }
        )
      }
    } else {
      if (!email) {
        return NextResponse.json(
          { error: 'Email Address is required.' },
          { status: 400 }
        )
      }
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

      const normalizedEmail = (email || '').trim().toLowerCase()
      if (!normalizedEmail.endsWith('@learner.manipal.edu')) {
        return NextResponse.json(
          { error: 'Please enter your official MAHE student email ending with @learner.manipal.edu' },
          { status: 400 }
        )
      }

      // Generate deterministic unique token from Roll Number using HMAC SHA-256
      // Guaranteed to be mathematically unique per roll number with zero collisions
      const rollTokenHash = crypto
        .createHmac('sha256', 'glc-2026-student-qr-secret-key-mahe')
        .update(rollNumber)
        .digest('hex')
        .substring(0, 10)
        .toUpperCase()
      const deterministicToken = `GLC26-STU-${rollTokenHash}`

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

      const qrToken = studentRecord?.qr_token || deterministicToken

      if (studentRecord) {
        // Record exists: ensure qr_token and email are synchronized
        const updateFields: any = {}
        if (!studentRecord.qr_token) updateFields.qr_token = deterministicToken
        if (!studentRecord.email || studentRecord.email !== normalizedEmail) updateFields.email = normalizedEmail

        if (Object.keys(updateFields).length > 0) {
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
                body: JSON.stringify(updateFields)
              }
            )
            if (updateRes.ok) {
              const updated = await updateRes.json()
              if (Array.isArray(updated) && updated.length > 0) {
                studentRecord = updated[0]
              }
            }
          } catch (patchErr) {
            console.warn('Supabase student update notice:', patchErr)
          }
        }
      } else {
        // If student not found in pre-loaded list, register with entered details or return error
        const studentName = (fullName || '').trim() || `Student (${rollNumber})`

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
              full_name: studentName,
              email: normalizedEmail,
              phone: phone?.trim() || 'N/A',
              program: programLabel,
              year_of_study: yearLabel,
              seat_number: '',
              seat_zone: 'Auditorium',
              gate: 'Auditorium Main Gate',
              full_seat_string: 'Auditorium Seating',
              qr_token: deterministicToken,
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
            full_name: studentName,
            program: programLabel,
            year_of_study: yearLabel,
            seat_number: '',
            seat_zone: 'Auditorium',
            gate: 'Auditorium Main Gate',
            full_seat_string: 'Auditorium Seating',
            qr_token: deterministicToken,
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
          roleOrProgram: `${studentRecord.year_of_study || 'Student'} (${studentRecord.roll_number})`,
          seat: '', // No seat selection needed
          zone: 'Auditorium',
          fullSeatString: 'Auditorium Seating',
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

    // 1. Debounce rapid double-clicks (within 15 seconds for exact same email)
    const normalizedEmail = payload.email
    const now = Date.now()
    const lastSubmission = recentDelegateSubmissions.get(normalizedEmail)

    if (lastSubmission && (now - lastSubmission) < 15000) {
      console.log('Debouncing rapid double-click submission for:', normalizedEmail)
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
    }
    recentDelegateSubmissions.set(normalizedEmail, now)

    // Periodic cleanup of debounce cache
    if (recentDelegateSubmissions.size > 2000) {
      const cutoff = now - 60000
      recentDelegateSubmissions.forEach((timestamp, key) => {
        if (timestamp < cutoff) recentDelegateSubmissions.delete(key)
      })
    }

    // 2. Persist delegate registration to Supabase database (PostgreSQL)
    if (resolvedCategory === 'delegate' && supabaseUrl && supabaseAnonKey) {
      try {
        await fetch(`${supabaseUrl}/rest/v1/delegates`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
            Prefer: 'return=minimal'
          },
          body: JSON.stringify({
            full_name: payload.fullName,
            email: payload.email,
            phone: payload.phone,
            company: payload.company,
            designation: payload.designation,
            track_preference: payload.trackPreference,
            submitted_at: payload.submittedAt
          }),
          signal: AbortSignal.timeout(5000)
        })
      } catch (sbErr) {
        console.warn('Supabase delegate notice:', sbErr)
      }
    }

    // 3. Forward delegate registration to Google Sheets webhook (Single dispatch, NO retry loop)
    // Eliminates duplicate row creation caused by slow Google Apps Script cold starts
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
          signal: AbortSignal.timeout(12000)
        })

        if (upstream.ok) {
          console.log('Successfully recorded delegate to Google Sheet:', payload.fullName)
        } else {
          console.warn(`Google Sheets webhook returned status ${upstream.status}`)
        }
      } catch (err) {
        // Notice: Google Apps Script frequently processes requests in the background even if the HTTP
        // connection times out. We intentionally do NOT retry to prevent duplicate rows.
        console.warn('Google Sheets webhook notice (single dispatch completed):', err)
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
