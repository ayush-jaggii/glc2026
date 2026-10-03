import { NextResponse } from 'next/server'
import { verifyPassword, generateSessionToken } from '@/lib/volunteerAuth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and Password are required.' },
        { status: 400 }
      )
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://epkpjeuqfttwnptxnubt.supabase.co'
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwa3BqZXVxZnR0d25wdHhudWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwOTk2NDIsImV4cCI6MjEwNTY3NTY0Mn0.yT1WLsa057AXEnExxkJWU_s0uZ7XD4Qwx1PM7a9xgT0'

    // Fetch volunteer by username
    const res = await fetch(
      `${supabaseUrl}/rest/v1/volunteers?username=eq.${encodeURIComponent(username.trim().toLowerCase())}&select=*`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`
        }
      }
    )

    if (!res.ok) {
      return NextResponse.json({ error: 'Database lookup failed.' }, { status: 500 })
    }

    const volunteers = await res.json()
    if (!Array.isArray(volunteers) || volunteers.length === 0) {
      return NextResponse.json(
        { error: 'Invalid volunteer username or password.' },
        { status: 401 }
      )
    }

    const volunteer = volunteers[0]

    if (!volunteer.is_active) {
      return NextResponse.json(
        { error: 'This volunteer account is deactivated. Contact an administrator.' },
        { status: 403 }
      )
    }

    // Verify password hash
    const isValid = verifyPassword(password, volunteer.password_hash)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid volunteer username or password.' },
        { status: 401 }
      )
    }

    // Single-device check: Is this volunteer already active on another device?
    if (volunteer.is_logged_in && volunteer.current_session_token) {
      return NextResponse.json(
        {
          error:
            'This volunteer ID is already active on another phone. Please log out from the previous device first, or ask an administrator to reset your session.',
          code: 'DEVICE_CONFLICT'
        },
        { status: 409 }
      )
    }

    // Generate new unique session token and lock this device
    const sessionToken = generateSessionToken()

    const updateRes = await fetch(`${supabaseUrl}/rest/v1/volunteers?id=eq.${volunteer.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({
        is_logged_in: true,
        current_session_token: sessionToken,
        last_login_at: new Date().toISOString()
      })
    })

    if (!updateRes.ok) {
      return NextResponse.json({ error: 'Failed to initialize session.' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      sessionToken,
      volunteer: {
        id: volunteer.id,
        username: volunteer.username,
        name: volunteer.name,
        gate: volunteer.gate
      }
    })
  } catch (error) {
    console.error('Volunteer login error:', error)
    return NextResponse.json({ error: 'Unexpected login error.' }, { status: 500 })
  }
}
