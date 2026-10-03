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
    const statusFilter = searchParams.get('status') || 'ALL'

    // Fetch all students
    const res = await fetch(
      `${supabaseUrl}/rest/v1/students?select=id,roll_number,full_name,email,qr_token,status,marked_at,marked_by,has_downloaded_pass,download_count,first_downloaded_at,last_downloaded_at&order=roll_number.asc`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`
        }
      }
    )

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch student records.' }, { status: 500 })
    }

    const allStudents = await res.json()
    const totalCount = allStudents.length

    // Pass download metrics
    const downloadedCount = allStudents.filter((s: any) => Boolean(s.has_downloaded_pass)).length
    const notDownloadedCount = totalCount - downloadedCount
    const downloadedPercent = totalCount > 0 ? Math.round((downloadedCount / totalCount) * 100) : 0
    const totalDownloadEvents = allStudents.reduce((acc: number, s: any) => acc + (s.download_count || 0), 0)

    // Attendance metrics
    const presentCount = allStudents.filter((s: any) => s.status === 'PRESENT').length
    const absentCount = totalCount - presentCount
    const presentPercent = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0

    // Filter students
    let filtered = allStudents

    if (statusFilter === 'DOWNLOADED') {
      filtered = filtered.filter((s: any) => Boolean(s.has_downloaded_pass))
    } else if (statusFilter === 'NOT_DOWNLOADED') {
      filtered = filtered.filter((s: any) => !s.has_downloaded_pass)
    } else if (statusFilter === 'PRESENT') {
      filtered = filtered.filter((s: any) => s.status === 'PRESENT')
    } else if (statusFilter === 'ABSENT') {
      filtered = filtered.filter((s: any) => s.status !== 'PRESENT')
    }

    if (search) {
      filtered = filtered.filter(
        (s: any) =>
          (s.roll_number && s.roll_number.toLowerCase().includes(search)) ||
          (s.full_name && s.full_name.toLowerCase().includes(search)) ||
          (s.email && s.email.toLowerCase().includes(search))
      )
    }

    return NextResponse.json({
      success: true,
      stats: {
        total: totalCount,
        downloaded: downloadedCount,
        downloadedPercent,
        notDownloaded: notDownloadedCount,
        present: presentCount,
        presentPercent,
        absent: absentCount,
        totalDownloadEvents
      },
      students: filtered
    })
  } catch (error) {
    console.error('Admin students API error:', error)
    return NextResponse.json({ error: 'Server error loading students.' }, { status: 500 })
  }
}
