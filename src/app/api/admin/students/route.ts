import { NextResponse } from 'next/server'

function checkAdminAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return false
  const token = authHeader.replace('Bearer ', '').trim()
  const expectedPassword = process.env.ADMIN_PASSWORD || 'GLC2026_ADMIN'
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
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')?.trim().toLowerCase() || ''
    const status = searchParams.get('status') || 'ALL'
    const volunteerFilter = searchParams.get('volunteer') || 'ALL'

    // Fetch all students for stats and filtering
    const res = await fetch(`${supabaseUrl}/rest/v1/students?select=*&order=full_name.asc`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`
      }
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch student records.' }, { status: 500 })
    }

    const allStudents = await res.json()
    const totalCount = allStudents.length
    const presentCount = allStudents.filter((s: any) => s.status === 'PRESENT').length
    const absentCount = totalCount - presentCount
    const percentPresent = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0

    // Filter students
    let filtered = allStudents

    if (status !== 'ALL') {
      filtered = filtered.filter((s: any) => s.status === status)
    }

    if (volunteerFilter !== 'ALL') {
      filtered = filtered.filter((s: any) => s.marked_by === volunteerFilter)
    }

    if (search) {
      filtered = filtered.filter(
        (s: any) =>
          (s.roll_number && s.roll_number.toLowerCase().includes(search)) ||
          (s.full_name && s.full_name.toLowerCase().includes(search)) ||
          (s.email && s.email.toLowerCase().includes(search)) ||
          (s.program && s.program.toLowerCase().includes(search))
      )
    }

    return NextResponse.json({
      success: true,
      stats: {
        total: totalCount,
        present: presentCount,
        absent: absentCount,
        percent: percentPresent
      },
      students: filtered
    })
  } catch (error) {
    console.error('Admin students API error:', error)
    return NextResponse.json({ error: 'Server error loading students.' }, { status: 500 })
  }
}
