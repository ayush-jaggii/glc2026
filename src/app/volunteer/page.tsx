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
  Armchair,
  UserCheck,
  Lock
} from 'lucide-react'

interface StudentResult {
  roll_number: string
  full_name: string
  seat_number: string
  program: string
  year_of_study: string
  status: string
  marked_at?: string
  marked_by?: string
}

export default function VolunteerScannerPage() {
  const [volunteerName, setVolunteerName] = useState('')
  const [pin, setPin] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Scanner state
  const [scannerActive, setScannerActive] = useState(false)
  const [scanResult, setScanResult] = useState<{
    type: 'success' | 'warning' | 'error'
    message: string
    student?: StudentResult
  } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)

  const html5QrCodeRef = useRef<any>(null)
  const processingRef = useRef(false)

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
    const savedName = localStorage.getItem('glc_volunteer_name')
    const savedPin = localStorage.getItem('glc_volunteer_pin')
    if (savedName && savedPin) {
      setVolunteerName(savedName)
      setPin(savedPin)
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    if (!volunteerName.trim()) {
      setLoginError('Please enter your name.')
      return
    }
    if (!pin.trim()) {
      setLoginError('Please enter the Event PIN.')
      return
    }

    localStorage.setItem('glc_volunteer_name', volunteerName.trim())
    localStorage.setItem('glc_volunteer_pin', pin.trim())
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    stopScanner()
    localStorage.removeItem('glc_volunteer_name')
    localStorage.removeItem('glc_volunteer_pin')
    setIsAuthenticated(false)
    setVolunteerName('')
    setPin('')
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
          volunteerName: volunteerName.trim() || 'Volunteer Desk',
          pin: pin.trim()
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
          message: data.error || data.message || 'Pass not recognized or invalid PIN.'
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
    setScannerActive(true)

    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      const html5QrCode = new Html5Qrcode('volunteer-reader')
      html5QrCodeRef.current = html5QrCode

      const config = {
        fps: 15,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      }

      await html5QrCode.start(
        { facingMode: 'environment' },
        config,
        (decodedText: string) => {
          processToken(decodedText)
        },
        () => {
          // Ignore frame decode misses
        }
      )
    } catch (err) {
      console.error('Camera init error:', err)
      setScannerActive(false)
      setScanResult({
        type: 'error',
        message: 'Camera access denied or unavailable. Please enable camera permissions in your mobile browser.'
      })
    }
  }

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop()
        html5QrCodeRef.current.clear()
      } catch {
        // Already stopped
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
            className="flex items-center gap-1 text-[11px] text-cream-400 hover:text-white px-2.5 py-1 rounded-lg bg-wine-900/60 border border-wine-800 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>
        )}
      </div>

      {!isAuthenticated ? (
        /* Login / PIN Prompt Card */
        <div className="w-full max-w-md bg-[#13030F] rounded-3xl p-6 sm:p-8 border border-wine-800 shadow-2xl mt-4">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-wine-900/80 border border-wine-700/80 flex items-center justify-center text-glc-magenta mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide">
              Auditorium Attendance Desk
            </h1>
            <p className="text-xs text-cream-400 mt-1">
              Sign in with your name and the Event PIN provided by the PACE Committee.
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
                Volunteer Name
              </label>
              <input
                type="text"
                required
                value={volunteerName}
                onChange={(e) => setVolunteerName(e.target.value)}
                placeholder="e.g. Priya Sharma"
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
                placeholder="Enter 4 or 6-digit PIN"
                className="w-full px-4 py-2.5 rounded-xl bg-wine-950 border border-wine-800 text-sm text-cream-100 placeholder:text-cream-400 focus:outline-none focus:border-glc-magenta tracking-widest text-center"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-glc-magenta via-glc-pink to-glc-orange text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:opacity-95 transition-opacity mt-2"
            >
              Access Scanner Desk →
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
              <span className="font-semibold text-white">{volunteerName}</span>
            </div>
            <div className="text-[11px] text-cream-300">
              Verified by you: <strong className="text-glc-orange text-sm ml-0.5">{sessionCount}</strong>
            </div>
          </div>

          {/* Scanner Viewfinder Box */}
          <div className="relative rounded-3xl overflow-hidden bg-black border-2 border-wine-700/80 shadow-2xl flex flex-col items-center justify-center min-h-[300px]">
            <div id="volunteer-reader" className="w-full h-full min-h-[300px]" />

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
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-glc-magenta to-glc-orange text-white text-xs font-bold uppercase tracking-wider shadow-md hover:scale-105 transition-all"
                >
                  Start Camera Scanner
                </button>
              </div>
            )}

            {scannerActive && (
              <button
                onClick={stopScanner}
                type="button"
                className="absolute bottom-3 px-4 py-1.5 rounded-full bg-black/70 border border-white/20 text-[11px] text-cream-200 hover:text-white backdrop-blur-md"
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
              className={`p-5 rounded-2xl border shadow-xl transition-all ${
                scanResult.type === 'success'
                  ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-100'
                  : scanResult.type === 'warning'
                  ? 'bg-amber-950/70 border-amber-500/80 text-amber-100'
                  : 'bg-red-950/70 border-red-500/80 text-red-100'
              }`}
            >
              <div className="flex items-start gap-3">
                {scanResult.type === 'success' && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                )}
                {scanResult.type === 'warning' && (
                  <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                )}
                {scanResult.type === 'error' && (
                  <XCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                )}

                <div className="flex-1">
                  <div className="font-bold text-sm leading-tight">{scanResult.message}</div>

                  {scanResult.student && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="opacity-80">Student Name:</span>
                        <strong className="text-white text-sm">{scanResult.student.full_name}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="opacity-80">Roll Number:</span>
                        <strong className="font-mono text-white tracking-wider">
                          {scanResult.student.roll_number}
                        </strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="opacity-80">Assigned Seat:</span>
                        <span className="inline-flex items-center gap-1 font-bold text-white px-2.5 py-0.5 rounded-md bg-white/20">
                          <Armchair className="w-3.5 h-3.5 text-glc-orange" />
                          {scanResult.student.seat_number}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="opacity-80">Program / Year:</span>
                        <span>{scanResult.student.year_of_study}</span>
                      </div>
                      {scanResult.student.marked_at && (
                        <div className="flex justify-between items-center text-[11px] text-amber-300">
                          <span>Recorded At:</span>
                          <span>
                            {scanResult.student.marked_at} (by {scanResult.student.marked_by})
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Verification Protocol Notice */}
          <div className="p-3 text-center text-[10px] text-cream-400/80 leading-relaxed border-t border-wine-900/80">
            <UserCheck className="w-3.5 h-3.5 inline mr-1 text-glc-magenta" />
            <strong>Physical Protocol</strong>: Always match the student name and roll number with their physical TAPMI / MAHE University ID card.
          </div>
        </div>
      )}
    </div>
  )
}
