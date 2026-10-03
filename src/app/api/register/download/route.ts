import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { identifier, regId, rollNumber } = body

    const targetIdentifier = (identifier || regId || rollNumber || '').trim()
    if (!targetIdentifier) {
      return NextResponse.json({ error: 'Identifier is required' }, { status: 400 })
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://epkpjeuqfttwnptxnubt.supabase.co'
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwa3BqZXVxZnR0d25wdHhudWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwOTk2NDIsImV4cCI6MjEwNTY3NTY0Mn0.yT1WLsa057AXEnExxkJWU_s0uZ7XD4Qwx1PM7a9xgT0'

    const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/record_pass_download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({
        p_identifier: targetIdentifier
      })
    })

    if (!rpcRes.ok) {
      return NextResponse.json({ error: 'Failed to record pass download' }, { status: 500 })
    }

    const data = await rpcRes.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Track download error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
