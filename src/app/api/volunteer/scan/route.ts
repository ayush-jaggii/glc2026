import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token, volunteerName = 'Volunteer', pin, sessionToken } = body

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

    // 2. Reject unauthorized requests (no master PIN fallback)
    if (!isAuthenticated) {
      return NextResponse.json(
        {
          success: false,
          code: 'UNAUTHORIZED_NICE_TRY',
          error: 'Nice try! 😉 Caught red-handed! Nice attempt marking attendance yourself, but only authorized GLC gate volunteers can check in passes.',
          message: 'Nice try! 😉 Caught red-handed! Nice attempt marking attendance yourself, but only authorized GLC gate volunteers can check in passes.'
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
        p_volunteer_name: effectiveVolunteerName.trim()
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
