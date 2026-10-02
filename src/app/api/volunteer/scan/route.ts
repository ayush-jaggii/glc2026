import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token, sessionToken } = body

    if (!token) {
      return NextResponse.json({ error: 'Verification token / QR code is required.' }, { status: 400 })
    }

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing volunteer session token.', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://epkpjeuqfttwnptxnubt.supabase.co'
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwa3BqZXVxZnR0d25wdHhudWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwOTk2NDIsImV4cCI6MjEwNTY3NTY0Mn0.yT1WLsa057AXEnExxkJWU_s0uZ7XD4Qwx1PM7a9xgT0'

    // Validate volunteer session token
    const volRes = await fetch(
      `${supabaseUrl}/rest/v1/volunteers?current_session_token=eq.${encodeURIComponent(sessionToken)}&is_logged_in=eq.true&select=id,name,gate,username,is_active`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`
        }
      }
    )

    if (!volRes.ok) {
      return NextResponse.json({ error: 'Failed to authenticate volunteer.' }, { status: 500 })
    }

    const volunteers = await volRes.json()
    if (!Array.isArray(volunteers) || volunteers.length === 0) {
      return NextResponse.json(
        {
          error: 'Session expired or active on another device. Please re-login.',
          code: 'SESSION_INVALID'
        },
        { status: 401 }
      )
    }

    const volunteer = volunteers[0]
    if (!volunteer.is_active) {
      return NextResponse.json(
        { error: 'Volunteer account deactivated.', code: 'DEACTIVATED' },
        { status: 403 }
      )
    }

    const volunteerLabel = `${volunteer.name} (${volunteer.gate || 'Gate 1'})`

    // Execute atomic stored procedure
    const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/mark_student_attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({
        p_qr_token: token.trim(),
        p_volunteer_name: volunteerLabel
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
