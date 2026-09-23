import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token, volunteerName = 'Volunteer', pin } = body

    if (!token) {
      return NextResponse.json({ error: 'Verification token / QR code is required.' }, { status: 400 })
    }

    const expectedPin = process.env.VOLUNTEER_PIN || 'GLC2026'
    if (!pin || pin.trim() !== expectedPin.trim()) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Volunteer PIN.' }, { status: 401 })
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://epkpjeuqfttwnptxnubt.supabase.co'
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwa3BqZXVxZnR0d25wdHhudWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwOTk2NDIsImV4cCI6MjEwNTY3NTY0Mn0.yT1WLsa057AXEnExxkJWU_s0uZ7XD4Qwx1PM7a9xgT0'

    const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/mark_student_attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({
        p_qr_token: token.trim(),
        p_volunteer_name: volunteerName.trim()
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
