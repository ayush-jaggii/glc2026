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
      submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      source: 'GLC 2026 Website Registration'
    }

    // Google Sheets Webhook / Apps Script URL
    const googleSheetsUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL
    const webhookUrl = googleSheetsUrl || process.env.EXCEL_WEBHOOK_URL

    if (webhookUrl) {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        console.error('Failed to append to Google Sheets webhook:', await response.text())
      }
    } else {
      console.log('Registration received for Google Sheet (1ZS0-TQlBPyBjTMQqOM11M2Yi2lpbiA6RPd0U_PUEtH0):', payload)
    }

    return NextResponse.json({
      success: true,
      message: 'Delegate registration recorded successfully',
      sheetId: '1ZS0-TQlBPyBjTMQqOM11M2Yi2lpbiA6RPd0U_PUEtH0',
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
