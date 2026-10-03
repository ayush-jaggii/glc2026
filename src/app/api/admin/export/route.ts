import { NextResponse } from 'next/server'

function checkAdminAuth(token: string | null): boolean {
  if (!token) return false
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
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!checkAdminAuth(token)) {
    return new NextResponse('Unauthorized access.', { status: 401 })
  }

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/students?select=roll_number,full_name,email,has_downloaded_pass,first_downloaded_at,last_downloaded_at,download_count,status,marked_at,marked_by&order=roll_number.asc`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`
        }
      }
    )

    if (!res.ok) {
      return new NextResponse('Failed to export data.', { status: 500 })
    }

    const students = await res.json()

    // Format IST date helper
    const formatIst = (isoStr: string | null) => {
      if (!isoStr) return ''
      try {
        return new Date(isoStr).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'medium',
          timeStyle: 'medium'
        })
      } catch {
        return isoStr
      }
    }

    const headers = [
      'Roll Number',
      'Full Name',
      'Email',
      'Pass Downloaded',
      'First Downloaded At (IST)',
      'Last Downloaded At (IST)',
      'Total Downloads',
      'Attendance Status',
      'Marked At (IST)',
      'Marked By Volunteer'
    ]

    const escape = (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`

    const rows = (students || []).map((s: any) => {
      return [
        escape(s.roll_number),
        escape(s.full_name),
        escape(s.email),
        escape(s.has_downloaded_pass ? 'YES' : 'NO'),
        escape(formatIst(s.first_downloaded_at)),
        escape(formatIst(s.last_downloaded_at)),
        escape(s.download_count || 0),
        escape(s.status || 'ABSENT'),
        escape(formatIst(s.marked_at)),
        escape(s.marked_by || '')
      ].join(',')
    })

    const csvContent = [headers.join(','), ...rows].join('\r\n')
    const filename = `GLC_2026_Student_Roster_Status_${new Date().toISOString().slice(0, 10)}.csv`

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch (error) {
    console.error('Export error:', error)
    return new NextResponse('Failed to generate export file.', { status: 500 })
  }
}
