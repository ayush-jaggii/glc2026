import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { password } = body

    const expectedPassword = process.env.ADMIN_PASSWORD || 'clankers'

    if (!password || password.trim() !== expectedPassword.trim()) {
      return NextResponse.json({ error: 'Invalid administrator password.' }, { status: 401 })
    }

    // Return admin session token
    const adminToken = Buffer.from(`admin:${Date.now()}:${expectedPassword}`).toString('base64')

    return NextResponse.json({
      success: true,
      token: adminToken,
      message: 'Authenticated as Core Administrator.'
    })
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json({ error: 'Unexpected error during admin login.' }, { status: 500 })
  }
}
