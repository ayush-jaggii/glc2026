import { NextResponse } from 'next/server'

function checkAdminAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return false
  const token = authHeader.replace('Bearer ', '').trim()
  const expectedPassword = process.env.ADMIN_PASSWORD || 'clankers'
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    return decoded.includes(expectedPassword)
  } catch {
    return false
  }
}

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://epkpjeuqfttwnptxnubt.supabase.co'
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwa3BqZXVxZnR0d25wdHhudWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwOTk2NDIsImV4cCI6MjEwNTY3NTY0Mn0.yT1WLsa057AXEnExxkJWU_s0uZ7XD4Qwx1PM7a9xgT0'

// GET /api/admin/session - get active session ('AM' or 'PM')
export async function GET(request: Request) {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/app_settings?key=eq.active_session&select=value`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`
      }
    })

    if (!res.ok) {
      return NextResponse.json({ activeSession: 'AM' })
    }

    const data = await res.json()
    const activeSession = (Array.isArray(data) && data.length > 0 && data[0]?.value) ? data[0].value : 'AM'
    return NextResponse.json({ success: true, activeSession })
  } catch (err) {
    console.error('Failed to get active session:', err)
    return NextResponse.json({ activeSession: 'AM' })
  }
}

// POST /api/admin/session - toggle active session ('AM' or 'PM') [Admin Protected]
export async function POST(request: Request) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const session = String(body.session || '').toUpperCase().trim()
    if (session !== 'AM' && session !== 'PM') {
      return NextResponse.json({ error: 'Invalid session. Must be AM or PM.' }, { status: 400 })
    }

    const res = await fetch(`${supabaseUrl}/rest/v1/app_settings?key=eq.active_session`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        Prefer: 'return=representation'
      },
      body: JSON.stringify({
        value: session,
        updated_at: new Date().toISOString()
      })
    })

    if (!res.ok) {
      // If row did not exist, insert it
      const insRes = await fetch(`${supabaseUrl}/rest/v1/app_settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify({
          key: 'active_session',
          value: session,
          updated_at: new Date().toISOString()
        })
      })

      if (!insRes.ok) {
        return NextResponse.json({ error: 'Failed to update active session.' }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      activeSession: session,
      message: `Active session switched to ${session === 'AM' ? 'Morning (AM)' : 'After Lunch / Afternoon (PM)'}.`
    })
  } catch (err) {
    console.error('Failed to set active session:', err)
    return NextResponse.json({ error: 'Server error updating session.' }, { status: 500 })
  }
}
