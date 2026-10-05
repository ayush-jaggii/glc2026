import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token, volunteerName = 'Volunteer', session, sessionToken } = body

    if (!token) {
      return NextResponse.json({ error: 'Verification token / QR code is required.' }, { status: 400 })
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://epkpjeuqfttwnptxnubt.supabase.co'
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwa3BqZXVxZnR0d25wdHhudWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwOTk2NDIsImV4cCI6MjEwNTY3NTY0Mn0.yT1WLsa057AXEnExxkJWU_s0uZ7XD4Qwx1PM7a9xgT0'

    let effectiveVolunteerName = volunteerName
    let isAuthenticated = false

    // 1. Authenticate exclusively via active individual Volunteer session token
    if (sessionToken) {
      try {
        const vRes = await fetch(
          `${supabaseUrl}/rest/v1/volunteers?current_session_token=eq.${encodeURIComponent(sessionToken)}&select=*`,
          {
            headers: {
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseAnonKey}`
            }
          }
        )
        if (vRes.ok) {
          const vData = await vRes.json()
          if (Array.isArray(vData) && vData.length > 0 && vData[0].is_active) {
            isAuthenticated = true
            effectiveVolunteerName = `${vData[0].name} (${vData[0].gate || 'Gate 1'})`
          }
        }
      } catch (err) {
        console.warn('Volunteer token lookup error:', err)
      }
    }

    // 2. Reject unauthorized requests (e.g. student camera scanning their pass)
    if (!isAuthenticated) {
      // Record failed self-scan attempt asynchronously
      try {
        const userAgent = request.headers.get('user-agent') || ''
        const ipAddress =
          request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
          request.headers.get('x-real-ip') ||
          ''

        // Look up student roll and name from token if valid
        let studentRoll: string | null = null
        let studentName: string | null = null

        if (token && token !== 'PING_CHECK') {
          const sRes = await fetch(
            `${supabaseUrl}/rest/v1/students?qr_token=eq.${encodeURIComponent(token.trim())}&select=roll_number,full_name`,
            {
              headers: {
                apikey: supabaseAnonKey,
                Authorization: `Bearer ${supabaseAnonKey}`
              }
            }
          )
          if (sRes.ok) {
            const sData = await sRes.json()
            if (Array.isArray(sData) && sData.length > 0) {
              studentRoll = sData[0].roll_number
              studentName = sData[0].full_name
            }
          }
        }

        await fetch(`${supabaseUrl}/rest/v1/scan_attempts`, {
          method: 'POST',
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: token || null,
            student_roll: studentRoll,
            student_name: studentName,
            user_agent: userAgent,
            ip_address: ipAddress,
            attempt_type: 'SELF_SCAN_BLOCKED'
          })
        })
      } catch (logErr) {
        console.warn('Failed to record unauthorized scan attempt:', logErr)
      }

      return NextResponse.json(
        {
          success: false,
          code: 'UNAUTHORIZED_SELF_SCAN',
          error: "Turns out Nexora outsmarts you, again. Marking attendance isn't that easy — you cannot mark your own attendance.",
          message: "Turns out Nexora outsmarts you, again. Marking attendance isn't that easy — you cannot mark your own attendance."
        },
        { status: 401 }
      )
    }

    if (token === 'PING_CHECK') {
      return NextResponse.json({ success: true, message: 'Authorized.' })
    }

    const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/mark_student_attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({
        p_qr_token: token.trim(),
        p_volunteer_name: effectiveVolunteerName.trim(),
        p_session: session ? String(session).toUpperCase().trim() : null
      })
    })

    if (!rpcRes.ok) {
      const errText = await rpcRes.text()
      return NextResponse.json(
        { error: 'Database execution failed', details: errText },
        { status: 500 }
      )
    }

    const result = await rpcRes.json()
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Scan error:', error)
    return NextResponse.json({ error: 'Unexpected server error while scanning.' }, { status: 500 })
  }
}
