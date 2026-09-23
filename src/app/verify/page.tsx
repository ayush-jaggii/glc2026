'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Armchair,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Lock,
  Loader2
} from 'lucide-react'

function VerifyContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || searchParams.get('id') || ''

  const [volunteerName, setVolunteerName] = useState('')
  const [pin, setPin] = useState('')
  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    const savedName = localStorage.getItem('glc_volunteer_name')
    const savedPin = localStorage.getItem('glc_volunteer_pin')
    if (savedName && savedPin) {
      setVolunteerName(savedName)
      setPin(savedPin)
      setIsAuth(true)
      executeVerification(token, savedName, savedPin)
    }
  }, [token])

  const executeVerification = async (tok: string, vName: string, vPin: string) => {
    if (!tok) return
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/volunteer/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: tok,
          volunteerName: vName || 'Volunteer Desk',
          pin: vPin
        })
      })

      const data = await res.json()
      setResult(data)
    } catch {
      setResult({
        success: false,
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your internet connection.'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVolunteerAuth = (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')

    if (!volunteerName.trim() || !pin.trim()) {
      setAuthError('Please enter your name and Event PIN.')
      return
    }

    localStorage.setItem('glc_volunteer_name', volunteerName.trim())
    localStorage.setItem('glc_volunteer_pin', pin.trim())
    setIsAuth(true)
    executeVerification(token, volunteerName.trim(), pin.trim())
  }

  return (
    <div className="min-h-screen bg-wine-950 text-cream-50 font-sans p-4 sm:p-6 flex flex-col items-center justify-center">
      {/* Brand Header */}
      <div className="w-full max-w-md flex items-center justify-between pb-4 border-b border-wine-800/80 mb-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logos/tapmi-logo.svg"
            alt="TAPMI"
            width={90}
            height={28}
            className="brightness-0 invert h-6 w-auto"
          />
          <span className="text-xs font-bold text-glc-magenta tracking-wider">
            GLC 2026 VERIFICATION
          </span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-[#13030F] rounded-3xl p-6 sm:p-8 border border-wine-800 shadow-2xl">
        {!token ? (
          <div className="text-center py-6">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-white mb-1">No Pass Token Detected</h2>
            <p className="text-xs text-cream-400 mb-4">
              Please scan an official GLC 2026 QR code with your phone camera.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-glc-magenta hover:underline"
            >
              Return to GLC Portal <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : !isAuth ? (
          /* Volunteer Auth Required */
          <div>
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-wine-900/80 border border-wine-700/80 flex items-center justify-center text-glc-magenta mx-auto mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white">Volunteer Check-In Required</h2>
              <p className="text-xs text-cream-400 mt-1">
                Enter your name and the Event PIN to authenticate and record student attendance.
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-200 text-center">
                {authError}
              </div>
            )}

            <form onSubmit={handleVolunteerAuth} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-cream-300 font-semibold mb-1">
                  Volunteer Name
                </label>
                <input
                  type="text"
                  required
                  value={volunteerName}
                  onChange={(e) => setVolunteerName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-2.5 rounded-xl bg-wine-950 border border-wine-800 text-sm text-cream-100 placeholder:text-cream-400 focus:outline-none focus:border-glc-magenta"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-cream-300 font-semibold mb-1">
                  Event PIN
                </label>
                <input
                  type="password"
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter Event PIN"
                  className="w-full px-4 py-2.5 rounded-xl bg-wine-950 border border-wine-800 text-sm text-cream-100 placeholder:text-cream-400 focus:outline-none focus:border-glc-magenta text-center tracking-widest"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-glc-magenta via-glc-pink to-glc-orange text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:opacity-95 transition-opacity mt-2"
              >
                Confirm & Record Attendance →
              </button>
            </form>
          </div>
        ) : loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-glc-magenta mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white">Verifying Student Pass...</h3>
            <p className="text-xs text-cream-400 mt-1">Checking atomic attendance in Supabase...</p>
          </div>
        ) : result ? (
          <div>
            {result.success ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto mb-3" />
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/80 text-[11px] font-bold text-emerald-300 uppercase tracking-widest mb-3">
                  Attendance Recorded
                </span>
                <h2 className="text-xl font-bold text-white">{result.student.full_name}</h2>
                <div className="font-mono text-xs text-cream-300 mt-0.5 tracking-wider">
                  Roll No: {result.student.roll_number}
                </div>

                <div className="my-5 p-4 rounded-2xl bg-white/5 border border-wine-800 text-left space-y-2.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-cream-400">Assigned Seat:</span>
                    <span className="font-bold text-white px-2.5 py-0.5 rounded-md bg-wine-900 border border-wine-700 flex items-center gap-1">
                      <Armchair className="w-3.5 h-3.5 text-glc-orange" />
                      {result.student.seat_number}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cream-400">Program / Cohort:</span>
                    <span className="font-semibold text-cream-200">
                      {result.student.year_of_study}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cream-400">Recorded At:</span>
                    <span className="text-cream-300">{result.student.marked_at}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cream-400">Verified By:</span>
                    <span className="text-cream-300 font-medium">{volunteerName}</span>
                  </div>
                </div>

                <div className="p-3 text-[10px] text-cream-400 border-t border-wine-900 leading-relaxed">
                  <UserCheck className="w-3.5 h-3.5 inline mr-1 text-emerald-400" />
                  Physically verified with student University ID Card.
                </div>
              </div>
            ) : result.code === 'ALREADY_MARKED' ? (
              <div className="text-center py-4">
                <AlertTriangle className="w-14 h-14 text-amber-400 mx-auto mb-3" />
                <span className="inline-block px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/80 text-[11px] font-bold text-amber-300 uppercase tracking-widest mb-3">
                  Duplicate Attendance
                </span>
                <h2 className="text-lg font-bold text-white">Already Marked Present!</h2>
                <p className="text-xs text-cream-300 mt-1">
                  This student’s attendance was already recorded earlier.
                </p>

                {result.student && (
                  <div className="my-5 p-4 rounded-2xl bg-amber-950/30 border border-amber-800/80 text-left space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-amber-200/70">Student:</span>
                      <strong className="text-white">{result.student.full_name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-200/70">Roll No:</span>
                      <strong className="font-mono text-white">{result.student.roll_number}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-200/70">Seat:</span>
                      <strong className="text-white">{result.student.seat_number}</strong>
                    </div>
                    <div className="flex justify-between text-amber-300">
                      <span>Recorded At:</span>
                      <span>
                        {result.student.marked_at} (by {result.student.marked_by})
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <XCircle className="w-14 h-14 text-red-400 mx-auto mb-3" />
                <h2 className="text-lg font-bold text-white mb-1">Pass Verification Failed</h2>
                <p className="text-xs text-red-300 mb-4">{result.message || result.error}</p>
                <div className="p-3 text-[10px] text-cream-400 border-t border-wine-900">
                  Please direct student to the PACE Helpdesk Desk for assistance.
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-wine-800/80 flex justify-center">
              <Link
                href="/volunteer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-wine-900 hover:bg-wine-800 border border-wine-700 text-xs font-semibold text-white transition-colors"
              >
                <span>Open Continuous Camera Scanner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-wine-950 flex items-center justify-center text-cream-300 text-sm">
          Loading verification desk...
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  )
}
