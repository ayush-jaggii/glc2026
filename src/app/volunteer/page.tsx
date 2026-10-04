'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  ShieldCheck,
  Camera,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  LogOut,
  RefreshCw,
  UserCheck,
  Lock,
  KeyRound,
  DoorOpen,
  Eye,
  EyeOff
} from 'lucide-react'

interface StudentResult {
  roll_number: string
  full_name: string
  status: string
  marked_at?: string
  marked_by?: string
}

export default function VolunteerScannerPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [volunteerName, setVolunteerName] = useState('')
  const [volunteerGate, setVolunteerGate] = useState('')
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [validating, setValidating] = useState(false)

  // Scanner state
  const [scannerActive, setScannerActive] = useState(false)
  const [scanResult, setScanResult] = useState<{
    type: 'success' | 'warning' | 'error'
    message: string
    student?: StudentResult
  } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeSession, setActiveSession] = useState<'AM' | 'PM'>('AM')
  const [sessionCount, setSessionCount] = useState(0)

  const html5QrCodeRef = useRef<any>(null)
  const processingRef = useRef(false)

  // Fetch current active session (AM vs PM) periodically
  useEffect(() => {
    const fetchActiveSession = async () => {
      try {
        const res = await fetch('/api/admin/session')
        if (res.ok) {
          const data = await res.json()
          if (data.activeSession === 'AM' || data.activeSession === 'PM') {
            setActiveSession(data.activeSession)
          }
        }
      } catch {
        // silent fallback to current activeSession
      }
    }

    fetchActiveSession()
    const timer = setInterval(fetchActiveSession, 15000)
    return () => clearInterval(timer)
  }, [])

  // Audio synthesis feedback
  const playSound = (type: 'success' | 'warning' | 'error') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)

      if (type === 'success') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1) // A5
        gain.gain.setValueAtTime(0.2, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
        osc.start()
        osc.stop(ctx.currentTime + 0.3)
      } else if (type === 'warning') {
        osc.frequency.setValueAtTime(440, ctx.currentTime)
        osc.frequency.setValueAtTime(349.23, ctx.currentTime + 0.12)
        gain.gain.setValueAtTime(0.25, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35)
        osc.start()
        osc.stop(ctx.currentTime + 0.35)
      } else {
        osc.frequency.setValueAtTime(220, ctx.currentTime)
        gain.gain.setValueAtTime(0.3, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
        osc.start()
        osc.stop(ctx.currentTime + 0.3)
      }
    } catch {
      // AudioContext unavailable or restricted
    }
  }

  // Load volunteer session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('glc_volunteer_session')
    const savedName = localStorage.getItem('glc_volunteer_name')
    const savedGate = localStorage.getItem('glc_volunteer_gate')

    if (savedToken && savedName) {
      setSessionToken(savedToken)
      setVolunteerName(savedName)
      setVolunteerGate(savedGate || 'Gate 1')
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setValidating(true)

    try {
      if (!username.trim() || !password) {
        setLoginError('Please enter your Volunteer Login ID and Password.')
        setValidating(false)
        return
      }

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
        setVolunteerGate(data.volunteer.gate || 'Gate 1')
        setIsAuthenticated(true)
        setPassword('')
      } else {
        setLoginError(data.error || 'Nice try! 😉 Caught red-handed! Nice attempt marking attendance yourself, but only authorized GLC gate volunteers can check in passes.')
      }
    } catch {
      setLoginError('Network connectivity error. Please verify your connection.')
    } finally {
      setValidating(false)
    }
  }

  const handleLogout = async () => {
    stopScanner()
    const token = sessionToken || localStorage.getItem('glc_volunteer_session')
    if (token) {
      try {
        await fetch('/api/volunteer/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionToken: token })
        })
      } catch {
        // ignore logout network errors
      }
    }

    localStorage.removeItem('glc_volunteer_session')
    localStorage.removeItem('glc_volunteer_name')
    localStorage.removeItem('glc_volunteer_gate')
    localStorage.removeItem('glc_volunteer_pin')

    setSessionToken(null)
    setIsAuthenticated(false)
    setVolunteerName('')
    setVolunteerGate('')
    setUsername('')
    setPassword('')
    setScanResult(null)
  }

  // Scan processor
  const processToken = async (rawText: string) => {
    if (processingRef.current) return
    processingRef.current = true
    setIsProcessing(true)

    try {
      const res = await fetch('/api/volunteer/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: rawText,
          sessionToken,
          session: activeSession,
          volunteerName: volunteerGate ? `${volunteerName} (${volunteerGate})` : volunteerName
        })
      })

      const data = await res.json()

      if (res.ok && data.success) {
        playSound('success')
        setScanResult({
          type: 'success',
          message: data.message || 'Attendance Marked Successfully!',
          student: data.student
        })
        setSessionCount((prev) => prev + 1)
      } else if (data.code === 'ALREADY_MARKED') {
        playSound('warning')
        setScanResult({
          type: 'warning',
          message: data.message || 'Already Recorded!',
          student: data.student
        })
      } else {
        playSound('error')
        setScanResult({
          type: 'error',
          message: data.error || data.message || 'Pass not recognized or invalid permissions.'
        })
      }
    } catch {
      playSound('error')
      setScanResult({
        type: 'error',
        message: 'Network error. Please check your internet connection.'
      })
    } finally {
      setIsProcessing(false)
      setTimeout(() => {
        processingRef.current = false
      }, 1500)
    }
  }

  // Camera scanner lifecycle
  const startScanner = async () => {
    setScanResult(null)
    try {
      const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import('html5-qrcode')
      const html5QrCode = new Html5Qrcode('volunteer-reader', {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true
        }
      })
      html5QrCodeRef.current = html5QrCode

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 25,
          disableFlip: true
        },
        (decodedText: string) => {
          processToken(decodedText)
        },
        () => {
          // scanning frame dropped, normal behavior
        }
      )
      setScannerActive(true)
    } catch (err: any) {
      console.error('Camera initialization error:', err)
      alert('Unable to access camera. Please ensure camera permissions are granted in browser settings.')
    }
  }

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop()
        html5QrCodeRef.current.clear()
      } catch (err) {
        console.error('Error stopping scanner:', err)
      }
      html5QrCodeRef.current = null
    }
    setScannerActive(false)
  }

  useEffect(() => {
    return () => {
      stopScanner()
    }
  }, [])

  return (
    <div className="min-h-screen bg-wine-950 text-cream-50 font-sans p-4 sm:p-6 flex flex-col items-center">
      {/* Header Bar */}
      <div className="w-full max-w-md flex items-center justify-between pb-4 border-b border-wine-800/80 mb-5">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logos/tapmi-logo.svg"
            alt="TAPMI"
            width={90}
            height={28}
            className="brightness-0 invert h-6 w-auto"
          />
          <span className="text-xs font-bold text-glc-magenta tracking-wider">
            VOLUNTEER PORTAL
          </span>
        </div>
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            type="button"
            className="flex items-center gap-1 text-[11px] text-cream-400 hover:text-white px-2.5 py-1 rounded-lg bg-wine-900/60 border border-wine-800 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>
        )}
      </div>

      {!isAuthenticated ? (
        /* Login / Authentication Prompt Card */
        <div className="w-full max-w-md bg-[#13030F] rounded-3xl p-6 sm:p-8 border border-wine-800 shadow-2xl mt-4">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-wine-900/80 border border-wine-700/80 flex items-center justify-center text-glc-magenta mx-auto mb-3 shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide">
              Auditorium Gate Scanner
            </h1>
            <p className="text-xs text-cream-400 mt-1">
              Login with your account issued by Nexora
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-200 text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-cream-300 font-semibold mb-1">
                Volunteer Login ID / Username
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-cream-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                  placeholder="e.g. rahul_gate1"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-wine-950 border border-wine-800 text-sm text-cream-100 placeholder:text-cream-500 focus:outline-none focus:border-glc-magenta font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-cream-300 font-semibold mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter volunteer password"
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-wine-950 border border-wine-800 text-sm text-cream-100 placeholder:text-cream-500 focus:outline-none focus:border-glc-magenta font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-cream-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={validating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-glc-magenta via-glc-pink to-glc-orange text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:opacity-95 transition-opacity mt-2 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {validating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Access Gate Scanner Desk →</span>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Authenticated Volunteer Scanner Interface */
        <div className="w-full max-w-md space-y-4">
          {/* Volunteer Status Bar */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-wine-900/40 border border-wine-800/80 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <span className="font-semibold text-white">{volunteerName}</span>
                {volunteerGate && (
                  <span className="block text-[10px] text-cream-400 font-mono">{volunteerGate}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                activeSession === 'PM' 
                  ? 'bg-amber-950/80 text-amber-300 border-amber-700/80' 
                  : 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80'
              }`}>
                {activeSession === 'PM' ? 'Session 2 · Afternoon' : 'Session 1 · Morning'}
              </span>
              <div className="text-[11px] text-cream-300">
                Scanned: <strong className="text-glc-orange text-sm ml-0.5">{sessionCount}</strong>
              </div>
            </div>
          </div>

          {/* Camera Viewfinder Viewport */}
          <div className="relative w-full aspect-[4/5] sm:aspect-square max-h-[500px] bg-black rounded-3xl overflow-hidden border border-wine-700 shadow-2xl flex flex-col items-center justify-center">
            <div id="volunteer-reader" className="w-full min-h-[300px]" />

            {/* Active Full-View Scanner Laser Sweep */}
            {scannerActive && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-glc-magenta to-transparent shadow-[0_0_16px_#F45197] animate-scanline" />
              </div>
            )}

            {!scannerActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#0D020B]/90">
                <div className="w-16 h-16 rounded-full bg-wine-900/80 border border-wine-600/80 flex items-center justify-center text-glc-magenta mb-3 shadow-lg">
                  <Camera className="w-8 h-8" />
                </div>
                <h2 className="text-base font-bold text-white mb-1">Camera Scanner Ready</h2>
                <p className="text-xs text-cream-400 max-w-xs mb-5">
                  Point camera at the student’s phone screen pass to record atomic attendance.
                </p>
                <button
                  onClick={startScanner}
                  type="button"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-glc-magenta to-glc-orange text-white text-xs font-bold uppercase tracking-wider shadow-md hover:scale-105 transition-all cursor-pointer"
                >
                  Start Camera Scanner
                </button>
              </div>
            )}

            {scannerActive && (
              <button
                onClick={stopScanner}
                type="button"
                className="absolute bottom-3 px-4 py-1.5 rounded-full bg-black/70 border border-white/20 text-[11px] text-cream-200 hover:text-white backdrop-blur-md cursor-pointer"
              >
                Pause Camera
              </button>
            )}

            {isProcessing && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white backdrop-blur-xs">
                <RefreshCw className="w-8 h-8 animate-spin text-glc-magenta mb-2" />
                <span className="text-xs font-semibold">Committing Attendance...</span>
              </div>
            )}
          </div>

          {/* Verification Result Card */}
          {scanResult && (
            <div
              className={`p-4 sm:p-5 rounded-2xl border shadow-xl transition-all animate-fadeIn ${
                scanResult.type === 'success'
                  ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-100'
                  : scanResult.type === 'warning'
                  ? 'bg-amber-950/70 border-amber-500/80 text-amber-100'
                  : 'bg-red-950/70 border-red-500/80 text-red-100'
              }`}
            >
              <div className="flex items-start gap-3">
                {scanResult.type === 'success' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                ) : scanResult.type === 'warning' ? (
                  <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                )}

                <div className="flex-1">
                  <h3 className="font-bold text-sm leading-tight text-white">
                    {scanResult.message}
                  </h3>

                  {scanResult.student && (
                    <div className="mt-2 text-xs space-y-1 bg-black/30 p-2.5 rounded-xl border border-white/10 font-mono">
                      <div className="font-bold text-white">
                        {scanResult.student.full_name}
                      </div>
                      <div className="text-[11px] text-cream-300">
                        Roll No: {scanResult.student.roll_number}
                      </div>
                      {scanResult.student.marked_at && (
                        <div className="text-[10px] text-cream-400">
                          Marked At: {scanResult.student.marked_at}
                          {scanResult.student.marked_by ? ` (${scanResult.student.marked_by})` : ''}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Security Note */}
          <div className="text-center text-[11px] text-cream-400/60 pt-2">
            <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-glc-magenta" />
            <span>Attendance locked to official device session.</span>
          </div>
        </div>
      )}
    </div>
  )
}
