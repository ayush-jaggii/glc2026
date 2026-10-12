import { NextResponse } from 'next/server'

function checkAdminAuth(token: string | null): boolean {
  if (!token) return false
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
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!checkAdminAuth(token)) {
    return new NextResponse('Unauthorized access.', { status: 401 })
  }

  try {
    // Fetch all students using pagination to overcome PostgREST 1000 row ceiling
    let students: any[] = []
    let offset = 0
    const pageSize = 1000

    while (true) {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/students?select=roll_number,full_name,email,qr_token,status,marked_at,status_pm,marked_at_pm&order=roll_number.asc&offset=${offset}&limit=${pageSize}`,
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

      const page = await res.json()
      if (!Array.isArray(page) || page.length === 0) break
      students = students.concat(page)
      if (page.length < pageSize) break
      offset += pageSize
    }

    // Format IST date helper
    const formatIst = (isoStr: string | null) => {
      if (!isoStr) return ''
      try {
        return new Date(isoStr).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      } catch {
        return isoStr
      }
    }

    // 3-Tier Categorization & Sorting:
    // 1. Both Sessions Present
    // 2. One Session Present (Morning or Afternoon)
    // 3. Both Sessions Absent
    const group1Both: any[] = []
    const group2One: any[] = []
    const group3None: any[] = []

    for (const s of students) {
      const isAm = s.status === 'PRESENT'
      const isPm = s.status_pm === 'PRESENT'

      if (isAm && isPm) {
        group1Both.push({ ...s, category: 'Both Sessions Present' })
      } else if (isAm || isPm) {
        group2One.push({
          ...s,
          category: isAm ? 'Morning Only Present' : 'Afternoon Only Present'
        })
      } else {
        group3None.push({ ...s, category: 'Both Sessions Absent' })
      }
    }

    const rollSort = (a: any, b: any) =>
      (a.roll_number || '').localeCompare(b.roll_number || '', undefined, { numeric: true })

    group1Both.sort(rollSort)
    group2One.sort(rollSort)
    group3None.sort(rollSort)

    const sortedStudents = [...group1Both, ...group2One, ...group3None]

    const headers = [
      'Roll Number',
      'Name',
      'Email',
      'QR Token',
      'Morning Status',
      'Morning Marked At',
      'Afternoon Status',
      'Afternoon Marked At',
      'Overall Attendance'
    ]

    const escape = (val: any) => {
      if (val === null || val === undefined) return ''
      const str = String(val)
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }

    const rows = sortedStudents.map((s: any) => {
      return [
        escape(s.roll_number),
        escape(s.full_name),
        escape(s.email),
        escape(s.qr_token),
        escape(s.status || 'ABSENT'),
        escape(formatIst(s.marked_at)),
        escape(s.status_pm || 'ABSENT'),
        escape(formatIst(s.marked_at_pm)),
        escape(s.category)
      ].join(',')
    })

    const csvContent = '\uFEFF' + [headers.map(escape).join(','), ...rows].join('\r\n')
    const filename = `GLC_2026_Final_Attendance_Report_${new Date().toISOString().slice(0, 10)}.csv`

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
