import { NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { allocateAuditoriumSeat, generateRegistrationId, AttendeeCategory } from '@/lib/seatAllocator'

// In-memory debounce cache to prevent rapid double-clicks from creating duplicate rows
const recentDelegateSubmissions = new Map<string, number>()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rollNumber = (searchParams.get('rollNumber') || searchParams.get('roll') || '').trim().toUpperCase()

    if (!rollNumber) {
      return NextResponse.json({ error: 'Roll number is required.' }, { status: 400 })
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://epkpjeuqfttwnptxnubt.supabase.co'
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwa3BqZXVxZnR0d25wdHhudWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwOTk2NDIsImV4cCI6MjEwNTY3NTY0Mn0.yT1WLsa057AXEnExxkJWU_s0uZ7XD4Qwx1PM7a9xgT0'

    const res = await fetch(
      `${supabaseUrl}/rest/v1/students?roll_number=eq.${encodeURIComponent(rollNumber)}&select=id,full_name,email,roll_number,has_downloaded_pass,download_count,first_downloaded_at,last_downloaded_at`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`
        }
      }
    )

    if (!res.ok) {
      return NextResponse.json({ error: 'Database query failed.' }, { status: 500 })
    }

    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { found: false, error: `Roll number "${rollNumber}" not found in the student roster.` },
        { status: 404 }
      )
    }

    const student = data[0]
    return NextResponse.json({
      found: true,
      student: {
        name: student.full_name,
        email: student.email,
        rollNumber: student.roll_number,
        hasDownloaded: Boolean(student.has_downloaded_pass),
        downloadCount: student.download_count || 0
      }
    })
  } catch (error) {
    console.error('Lookup error:', error)
    return NextResponse.json({ error: 'Server error during lookup.' }, { status: 500 })
  }
}

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
      rollNumber: rawRollNumber,
      studentId
    } = body

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://epkpjeuqfttwnptxnubt.supabase.co'
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwa3BqZXVxZnR0d25wdHhudWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwOTk2NDIsImV4cCI6MjEwNTY3NTY0Mn0.yT1WLsa057AXEnExxkJWU_s0uZ7XD4Qwx1PM7a9xgT0'

    // ==========================================
    // 1. STUDENT PASS RETRIEVAL ENGINE (SUPABASE)
    // ==========================================
    if (registrationType === 'student') {
      const rollNumber = (rawRollNumber || studentId || '').trim().toUpperCase()

      if (!rollNumber) {
        return NextResponse.json(
          { error: 'College Roll Number is required to access your pass.' },
          { status: 400 }
        )
      }

      // 1. Fetch student from Supabase roster
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

      if (!studentRecord) {
        return NextResponse.json(
          {
            error: `Roll number "${rollNumber}" was not found in the student roster. Please check your roll number or contact the GLC Secretariat at tapmi.glc@manipal.edu.`
          },
          { status: 404 }
        )
      }

      // 2. Track that student has retrieved/downloaded their pass
      const newDownloadCount = (studentRecord.download_count || 0) + 1
      const nowIso = new Date().toISOString()
      const firstDownloaded = studentRecord.first_downloaded_at || nowIso

      try {
        await fetch(`${supabaseUrl}/rest/v1/students?id=eq.${studentRecord.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
            Prefer: 'return=representation'
          },
          body: JSON.stringify({
            has_downloaded_pass: true,
            first_downloaded_at: firstDownloaded,
            last_downloaded_at: nowIso,
            download_count: newDownloadCount
          })
        })
      } catch (patchErr) {
        console.warn('Failed to update student download tracking:', patchErr)
      }

      // 3. Generate QR code for gate verification
      const verificationUrl = `https://www.tapmiblrglc.in/verify?token=${studentRecord.qr_token}`
      const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
        margin: 1,
        width: 320,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })

      // 4. Return official Pass Details (NO program, NO seat displayed)
      return NextResponse.json({
        success: true,
        message: 'Your official GLC 2026 student pass has been retrieved.',
        registrationId: studentRecord.qr_token,
        passDetails: {
          regId: studentRecord.qr_token,
          name: studentRecord.full_name,
          category: 'Student Pass',
          categoryKey: 'student',
          affiliation: 'TAPMI Bengaluru, MAHE',
          roleOrProgram: `Roll No: ${studentRecord.roll_number}`,
          date: 'Saturday, 10 October 2026',
          time: '09:00 AM IST',
          venue: 'Dr. Ramdas M. Pai Auditorium',
          campus: 'MAHE Bengaluru',
          qrDataUrl,
          submittedAt: firstDownloaded,
          hasDownloadedBefore: Boolean(studentRecord.has_downloaded_pass),
          downloadCount: newDownloadCount
        }
      })
    }

    // ==========================================
    // 2. DELEGATE REGISTRATION ENGINE
    // ==========================================
    if (!fullName || !email) {
      return NextResponse.json(
        { error: 'Full Name and Email Address are required for delegate registration.' },
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
