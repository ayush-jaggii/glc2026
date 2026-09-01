import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, email, organization, designation, passType } = body

    if (!fullName || !email || !organization) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const payload = {
      fullName,
      email,
      organization,
      designation: designation || 'N/A',
      passType: passType || 'Executive',
      submittedAt: new Date().toISOString(),
      source: 'GLC 2026 Website Registration'
    }

    // Check if Excel / SharePoint Power Automate Webhook URL is configured
    const webhookUrl = process.env.EXCEL_WEBHOOK_URL || process.env.NEXT_PUBLIC_EXCEL_WEBHOOK_URL

    if (webhookUrl) {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        console.error('Failed to append to Excel webhook:', await response.text())
      }
    } else {
      console.log('Registration received (Mock Mode):', payload)
    }

    return NextResponse.json({
      success: true,
      message: 'Delegate registration recorded successfully',
      data: payload
    })

  } catch (error) {
    console.error('Registration API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
