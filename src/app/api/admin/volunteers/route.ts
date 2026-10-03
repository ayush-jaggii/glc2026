import { NextResponse } from 'next/server'
import { hashPassword } from '@/lib/volunteerAuth'

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

export async function GET(request: Request) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/volunteers?select=*&order=created_at.desc`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`
      }
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch volunteers.' }, { status: 500 })
    }

    const volunteers = await res.json()

    // Also get scan counts from students table using pagination
    const scanCounts: Record<string, number> = {}
    let scanOffset = 0
    while (true) {
      const scanCountRes = await fetch(
        `${supabaseUrl}/rest/v1/students?status=eq.PRESENT&select=marked_by&offset=${scanOffset}&limit=1000`,
        {
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`
          }
        }
      )
      if (!scanCountRes.ok) break
      const records = await scanCountRes.json()
      if (!Array.isArray(records) || records.length === 0) break
      records.forEach((r: any) => {
        if (r.marked_by) {
          scanCounts[r.marked_by] = (scanCounts[r.marked_by] || 0) + 1
        }
      })
      if (records.length < 1000) break
      scanOffset += 1000
    }

    const sanitized = (volunteers || []).map((v: any) => {
      const label = `${v.name} (${v.gate || 'Gate 1'})`
      return {
        id: v.id,
        created_at: v.created_at,
        username: v.username,
        name: v.name,
        gate: v.gate,
        is_active: v.is_active,
        is_logged_in: v.is_logged_in,
        last_login_at: v.last_login_at,
        scansCount: scanCounts[label] || scanCounts[v.name] || 0
      }
    })

    return NextResponse.json({ success: true, volunteers: sanitized })
  } catch (error) {
    console.error('Fetch volunteers error:', error)
    return NextResponse.json({ error: 'Failed to load volunteers.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { username, password, name, gate = 'Gate 1' } = body

    if (!username || !password || !name) {
      return NextResponse.json(
        { error: 'Username, password, and volunteer name are required.' },
        { status: 400 }
      )
    }

    const cleanUsername = username.trim().toLowerCase()
    const passwordHash = hashPassword(password)

    const insertRes = await fetch(`${supabaseUrl}/rest/v1/volunteers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        Prefer: 'return=representation'
      },
      body: JSON.stringify({
        username: cleanUsername,
        password_hash: passwordHash,
        name: name.trim(),
        gate: gate.trim(),
        is_active: true,
        is_logged_in: false,
        current_session_token: null
      })
    })

    if (!insertRes.ok) {
      const err = await insertRes.text()
      if (err.includes('duplicate key') || err.includes('unique') || err.includes('volunteers_username_key')) {
        return NextResponse.json(
          { error: 'A volunteer with this username already exists.' },
          { status: 409 }
        )
      }
      return NextResponse.json({ error: 'Failed to create volunteer in database.' }, { status: 500 })
    }

    const created = await insertRes.json()
    return NextResponse.json({ success: true, volunteer: created[0] }, { status: 201 })
  } catch (error) {
    console.error('Create volunteer error:', error)
    return NextResponse.json({ error: 'Failed to create volunteer.' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, action, password, gate, name } = body

    if (!id) {
      return NextResponse.json({ error: 'Volunteer ID is required.' }, { status: 400 })
    }

    let updatePayload: any = {}

    if (action === 'reset_session') {
      updatePayload = {
        is_logged_in: false,
        current_session_token: null
      }
    } else if (action === 'toggle_active') {
      const { isActive } = body
      updatePayload = {
        is_active: Boolean(isActive),
        is_logged_in: false,
        current_session_token: null
      }
    } else if (action === 'update_profile') {
      if (gate) updatePayload.gate = gate
      if (name) updatePayload.name = name
      if (password) updatePayload.password_hash = hashPassword(password)
    }

    const patchRes = await fetch(`${supabaseUrl}/rest/v1/volunteers?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        Prefer: 'return=representation'
      },
      body: JSON.stringify(updatePayload)
    })

    if (!patchRes.ok) {
      return NextResponse.json({ error: 'Failed to update volunteer.' }, { status: 500 })
    }

    const updated = await patchRes.json()
    return NextResponse.json({ success: true, volunteer: updated[0] })
  } catch (error) {
    console.error('Update volunteer error:', error)
    return NextResponse.json({ error: 'Failed to update volunteer.' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Volunteer ID is required.' }, { status: 400 })
    }

    const delRes = await fetch(`${supabaseUrl}/rest/v1/volunteers?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`
      }
    })

    if (!delRes.ok) {
      return NextResponse.json({ error: 'Failed to delete volunteer.' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Volunteer removed.' })
  } catch (error) {
    console.error('Delete volunteer error:', error)
    return NextResponse.json({ error: 'Failed to remove volunteer.' }, { status: 500 })
  }
}
