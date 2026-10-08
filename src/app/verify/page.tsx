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
  ShieldAlert,
  UserCheck,
  ArrowRight,
  Lock,
  Loader2,
  ChevronLeft
} from 'lucide-react'

function formatName(name: string) {
  if (!name) return ''
  return name
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function VerifyContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || searchParams.get('id') || ''

  const [volunteerName, setVolunteerName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [isAuth, setIsAuth] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [authError, setAuthError] = useState('')
  const [studentName, setStudentName] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('glc_volunteer_session')
    const savedName = localStorage.getItem('glc_volunteer_name')
    if (savedToken) {
      setSessionToken(savedToken)
      if (savedName) setVolunteerName(savedName)
      setIsAuth(true)
      executeVerification(token, savedToken, savedName || 'Volunteer Desk')
    } else if (token) {
      // Student opened page with token without volunteer session: log the self-scan attempt & retrieve student name
      setLoading(true)
      fetch('/api/volunteer/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
        .then(async (res) => {
          const data = await res.json().catch(() => null)
          if (data?.studentName) {
            setStudentName(data.studentName)
          }
        })
        .catch(() => {})
        .finally(() => {
          setLoading(false)
        })
    }
  }, [token])

  const executeVerification = async (tok: string, sToken: string, vName: string) => {
    if (!tok) return
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/volunteer/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: tok,
          sessionToken: sToken,
          volunteerName: vName || 'Volunteer Desk'
        })
      })

      const data = await res.json()
      if (data?.studentName) {
        setStudentName(data.studentName)
      }
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

  const handleVolunteerLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')

    if (!username.trim() || !password) {
      setAuthError('Please enter your Volunteer Login ID and Password.')
      return
    }

    try {
      const res = await fetch('/api/volunteer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password
        })
      })

      const data = await res.json()

      if (res.ok && data.success) {
        localStorage.setItem('glc_volunteer_session', data.sessionToken)
        localStorage.setItem('glc_volunteer_name', data.volunteer.name)
        localStorage.setItem('glc_volunteer_gate', data.volunteer.gate || 'Gate 1')
        setSessionToken(data.sessionToken)
        setVolunteerName(data.volunteer.name)
        setIsAuth(true)
        executeVerification(token, data.sessionToken, data.volunteer.name)
      } else {
        setAuthError(data.error || 'Nice try! 😉 Only authorized GLC gate volunteers can check in passes.')
      }
    } catch {
      setAuthError('Network connectivity error. Please verify your connection.')
    }
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
          /* When student scans with regular phone camera and is not authenticated */
          !showLoginForm ? (
            <div className="text-center py-2">
              {/* Big HA! Callout */}
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-glc-magenta via-glc-pink to-glc-orange mb-3 select-none">
                HA!
              </div>

              {/* Nice try, (their name) */}
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
                Nice try{studentName ? `, ${formatName(studentName)}` : ''}
              </h2>

              {/* Bold Title */}
              <p className="text-base sm:text-lg font-bold text-glc-orange mb-3">
                Turns out Nexora outsmarts you, again.
              </p>

              {/* Explanation */}
              <p className="text-sm font-medium text-cream-200 mb-3">
                Unfortunately, marking attendance isn't that easy.
              </p>

              <p className="text-xs text-cream-400 leading-relaxed max-w-sm mx-auto mb-6">
                You cannot mark your own attendance. Attendance can only be recorded by designated gate volunteers at the auditorium entry.
              </p>

              {/* Official Procedure Card */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-wine-800/80 text-left space-y-1.5 mb-6 text-xs">
                <div className="text-[10px] font-mono uppercase tracking-wider text-cream-400 flex items-center gap-1.5 font-semibold">
                  <ShieldAlert className="w-3.5 h-3.5 text-glc-orange" />
                  Official Entry Procedure
                </div>
                <div className="text-cream-300 text-xs leading-relaxed">
                  Present your digital pass with QR code at the registration gate. An authorized volunteer will scan and confirm your check-in.
                </div>
              </div>

              {/* CTA Button */}
              <Link
                href="/"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-glc-magenta to-glc-orange text-white text-xs font-semibold tracking-wider uppercase hover:opacity-95 transition-opacity shadow-lg"
              >
                <span>Return to GLC Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Volunteer Gateway Link */}
              <div className="mt-6 pt-4 border-t border-wine-900/60 text-center">
                <button
                  type="button"
                  onClick={() => setShowLoginForm(true)}
                  className="text-[11px] text-cream-400 hover:text-white transition-colors cursor-pointer"
                >
                  Authorized gate volunteer? <span className="underline text-glc-orange">Sign in here</span>
                </button>
              </div>
            </div>
          ) : (
            /* Volunteer Auth Form (if volunteer opens on their own browser) */
            <div>
              <button
                type="button"
                onClick={() => {
                  setShowLoginForm(false)
                  setAuthError('')
                }}
                className="inline-flex items-center gap-1 text-xs text-cream-400 hover:text-white mb-4 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              <div className="text-center mb-5">
                <div className="w-12 h-12 rounded-2xl bg-wine-900/80 border border-wine-700/80 flex items-center justify-center text-glc-magenta mx-auto mb-3">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-white">Volunteer Check-In</h2>
                <p className="text-xs text-cream-400 mt-1">
                  Enter your Volunteer Login ID and Password to authenticate and record student attendance.
                </p>
              </div>

              {authError && (
                <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-200 text-center">
                  {authError}
                </div>
              )}

              <form onSubmit={handleVolunteerLogin} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-cream-300 font-semibold mb-1">
                    Volunteer Login ID / Username
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                    placeholder="e.g. rahul_gate1"
                    className="w-full px-4 py-2.5 rounded-xl bg-wine-950 border border-wine-800 text-sm text-cream-100 placeholder:text-cream-400 focus:outline-none focus:border-glc-magenta font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-cream-300 font-semibold mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter volunteer password"
                    className="w-full px-4 py-2.5 rounded-xl bg-wine-950 border border-wine-800 text-sm text-cream-100 placeholder:text-cream-400 focus:outline-none focus:border-glc-magenta font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-glc-magenta via-glc-pink to-glc-orange text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:opacity-95 transition-opacity mt-2 cursor-pointer"
                >
                  Sign In & Confirm Attendance →
                </button>
              </form>

              <div className="mt-4 pt-4 border-t border-wine-800/60 text-center">
                <Link
                  href="/volunteer"
                  className="text-xs text-glc-orange hover:underline font-medium"
                >
                  Or open Volunteer Camera Scanner →
                </Link>
              </div>
            </div>
          )
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
                    <span className="text-cream-400">Affiliation:</span>
                    <span className="font-semibold text-cream-200">
                      TAPMI Bengaluru, MAHE
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
                    <div className="flex justify-between text-amber-300">
                      <span>Recorded At:</span>
                      <span>
                        {result.student.marked_at} (by {result.student.marked_by})
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : result.code === 'UNAUTHORIZED_SELF_SCAN' || result.code === 'UNAUTHORIZED_NICE_TRY' || (result.error && (result.error.includes('outsmarts') || result.error.includes('Nice try'))) ? (
              <div className="text-center py-4 animate-fadeIn">
                {/* Big HA! Callout */}
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-glc-magenta via-glc-pink to-glc-orange mb-3 select-none">
                  HA!
                </div>
                <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
                  Nice try{result?.studentName || studentName ? `, ${formatName(result?.studentName || studentName)}` : ''}
                </h2>
                <p className="text-base sm:text-lg font-bold text-glc-orange mb-3">
                  Turns out Nexora outsmarts you, again.
                </p>
                <p className="text-sm font-medium text-cream-200 mb-2">
                  Unfortunately, marking attendance isn't that easy.
                </p>
                <p className="text-xs text-cream-400 leading-relaxed mb-5 max-w-sm mx-auto">
                  You cannot mark your own attendance. Attendance can only be recorded by designated gate volunteers at the auditorium entry.
                </p>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-wine-800 text-[11px] text-cream-300 space-y-1 mb-5 text-left">
                  <div className="font-semibold text-cream-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-glc-orange" />
                    Official Entry Procedure
                  </div>
                  <div className="text-cream-300 leading-relaxed">
                    Present your digital pass with QR code at the registration gate. An authorized volunteer will scan and confirm your check-in.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('glc_volunteer_name')
                    localStorage.removeItem('glc_volunteer_session')
                    setIsAuth(false)
                    setResult(null)
                  }}
                  className="text-xs text-glc-orange hover:underline font-semibold"
                >
                  ← Return to Verification Portal
                </button>
              </div>
            ) : (
              <div className="text-center py-6">
                <XCircle className="w-14 h-14 text-red-400 mx-auto mb-3" />
                <h2 className="text-lg font-bold text-white mb-1">Pass Verification Failed</h2>
                <p className="text-xs text-red-300 mb-4">{result.message || result.error}</p>
                <div className="p-3 text-[10px] text-cream-400 border-t border-wine-900">
                  Please direct student to the registration helpdesk for assistance.
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
