import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sessionToken, username } = body

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://epkpjeuqfttwnptxnubt.supabase.co'
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwa3BqZXVxZnR0d25wdHhudWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwOTk2NDIsImV4cCI6MjEwNTY3NTY0Mn0.yT1WLsa057AXEnExxkJWU_s0uZ7XD4Qwx1PM7a9xgT0'

    if (username) {
      await fetch(
        `${supabaseUrl}/rest/v1/volunteers?username=eq.${encodeURIComponent(username.trim().toLowerCase())}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`
          },
          body: JSON.stringify({
            is_logged_in: false,
            current_session_token: null
          })
        }
      )
    } else if (sessionToken) {
      await fetch(
        `${supabaseUrl}/rest/v1/volunteers?current_session_token=eq.${encodeURIComponent(sessionToken)}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`
          },
          body: JSON.stringify({
            is_logged_in: false,
            current_session_token: null
          })
        }
      )
    }

    return NextResponse.json({ success: true, message: 'Logged out successfully.' })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Unexpected error during logout.' }, { status: 500 })
  }
}
