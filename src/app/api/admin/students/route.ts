import { NextResponse } from 'next/server'

function checkAdminAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return false
  const token = authHeader.replace('Bearer ', '').trim()
  const expectedPassword = process.env.ADMIN_PASSWORD
  if (!expectedPassword) return false
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

    // 1. Fetch active session setting from app_settings
    let activeSession = 'AM'
    try {
      const sessionRes = await fetch(`${supabaseUrl}/rest/v1/app_settings?key=eq.active_session&select=value`, {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`
        }
      })
      if (sessionRes.ok) {
        const sData = await sessionRes.json()
        if (Array.isArray(sData) && sData.length > 0 && sData[0]?.value) {
          activeSession = sData[0].value
        }
      }
    } catch (sErr) {
      console.warn('Error fetching active session:', sErr)
    }

    // Fetch all students using pagination to overcome PostgREST 1000 row ceiling
    let allStudents: any[] = []
    let offset = 0
    const pageSize = 1000

    while (true) {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/students?select=id,roll_number,full_name,email,qr_token,status,marked_at,marked_by,status_pm,marked_at_pm,marked_by_pm,has_downloaded_pass,download_count,first_downloaded_at,last_downloaded_at&order=roll_number.asc&offset=${offset}&limit=${pageSize}`,
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

      const page = await res.json()
      if (!Array.isArray(page) || page.length === 0) break
      allStudents = allStudents.concat(page)
      if (page.length < pageSize) break
      offset += pageSize
    }

    const totalCount = allStudents.length

    // Pass download metrics
    const downloadedCount = allStudents.filter((s: any) => Boolean(s.has_downloaded_pass)).length
    const notDownloadedCount = totalCount - downloadedCount
    const downloadedPercent = totalCount > 0 ? Math.round((downloadedCount / totalCount) * 100) : 0
    const totalDownloadEvents = allStudents.reduce((acc: number, s: any) => acc + (s.download_count || 0), 0)

    // AM Attendance metrics
    const presentAmCount = allStudents.filter((s: any) => s.status === 'PRESENT').length
    const absentAmCount = totalCount - presentAmCount
    const presentAmPercent = totalCount > 0 ? Math.round((presentAmCount / totalCount) * 100) : 0

    // PM Attendance metrics
    const presentPmCount = allStudents.filter((s: any) => s.status_pm === 'PRESENT').length
    const absentPmCount = totalCount - presentPmCount
    const presentPmPercent = totalCount > 0 ? Math.round((presentPmCount / totalCount) * 100) : 0

    // Both Sessions (Attended Full Day)
    const presentBothCount = allStudents.filter((s: any) => s.status === 'PRESENT' && s.status_pm === 'PRESENT').length
    const presentBothPercent = totalCount > 0 ? Math.round((presentBothCount / totalCount) * 100) : 0

    // Filter students
    let filtered = allStudents

    if (statusFilter === 'DOWNLOADED') {
      filtered = filtered.filter((s: any) => Boolean(s.has_downloaded_pass))
    } else if (statusFilter === 'NOT_DOWNLOADED') {
      filtered = filtered.filter((s: any) => !s.has_downloaded_pass)
    } else if (statusFilter === 'PRESENT' || statusFilter === 'PRESENT_AM') {
      filtered = filtered.filter((s: any) => s.status === 'PRESENT')
    } else if (statusFilter === 'PRESENT_PM') {
      filtered = filtered.filter((s: any) => s.status_pm === 'PRESENT')
    } else if (statusFilter === 'PRESENT_BOTH') {
      filtered = filtered.filter((s: any) => s.status === 'PRESENT' && s.status_pm === 'PRESENT')
    } else if (statusFilter === 'ABSENT' || statusFilter === 'ABSENT_AM') {
      filtered = filtered.filter((s: any) => s.status !== 'PRESENT')
    } else if (statusFilter === 'ABSENT_PM') {
      filtered = filtered.filter((s: any) => s.status_pm !== 'PRESENT')
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
      activeSession,
      stats: {
        total: totalCount,
        downloaded: downloadedCount,
        downloadedPercent,
        notDownloaded: notDownloadedCount,
        // Backward-compatible fields
        present: presentAmCount,
        presentPercent: presentAmPercent,
        absent: absentAmCount,
        // Detailed session fields
        presentAm: presentAmCount,
        presentAmPercent,
        absentAm: absentAmCount,
        presentPm: presentPmCount,
        presentPmPercent,
        absentPm: absentPmCount,
        presentBoth: presentBothCount,
        presentBothPercent,
        totalDownloadEvents
      },
      students: filtered
    })
  } catch (error) {
    console.error('Admin students API error:', error)
    return NextResponse.json({ error: 'Server error loading students.' }, { status: 500 })
  }
}
