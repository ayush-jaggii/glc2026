import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, email, organization, designation, passType, phone } = body

    if (!fullName || !email || !organization) {
      return NextResponse.json(
        { error: 'Please provide all required fields (Name, Email, Organization).' },
        { status: 400 }
      )
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid business or academic email address.' },
        { status: 400 }
      )
    }

    const payload = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      organization: organization.trim(),
      designation: designation?.trim() || 'N/A',
      phone: phone?.trim() || 'N/A',
      passType: passType || 'Executive Delegate',
      submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      targetSpreadsheetId: '1ZS0-TQlBPyBjTMQqOM11M2Yi2lpbiA6RPd0U_PUEtH0',
      source: 'GLC 2026 Official Flagship Portal'
    }

    // Forward to configured Google Sheets webhook (Apps Script / SheetDB) if env var set
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || process.env.EXCEL_WEBHOOK_URL

    if (webhookUrl) {
      try {
        const upstream = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (!upstream.ok) {
          console.error('Google Sheets webhook returned non-OK status:', await upstream.text())
        }
      } catch (err) {
        console.error('Failed to dispatch to Google Sheets webhook:', err)
      }
    } else {
      console.log('Registration logged for Google Sheet (1ZS0-TQlBPyBjTMQqOM11M2Yi2lpbiA6RPd0U_PUEtH0):', payload)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successfully received. Your delegate pass request has been recorded.',
        registrationId: `GLC26-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        payload: {
          fullName: payload.fullName,
          passType: payload.passType,
          submittedAt: payload.submittedAt
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Registration processing error:', error)
    return NextResponse.json(
      { error: 'An unexpected system error occurred while processing registration. Please try again.' },
      { status: 500 }
    )
  }
}
