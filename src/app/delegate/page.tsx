'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  CheckCircle2,
  Loader2,
  RotateCcw,
  ArrowRight,
  Maximize,
  Minimize
} from 'lucide-react'

export default function DelegateRegistrationKioskPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [organization, setOrganization] = useState('')
  const [designation, setDesignation] = useState('')

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successData, setSuccessData] = useState<{
    name: string
    email: string
    organization: string
    designation: string
    registrationId?: string
  } | null>(null)

  const [isFullscreen, setIsFullscreen] = useState(false)

  // Auto-reset timer for iPad kiosk
  const [countdown, setCountdown] = useState(20)
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Track fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fsElement =
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      setIsFullscreen(Boolean(fsElement))
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = async () => {
    try {
      const doc = document as any
      const docEl = document.documentElement as any

      if (
        !doc.fullscreenElement &&
        !doc.webkitFullscreenElement &&
        !doc.mozFullScreenElement &&
        !doc.msFullscreenElement
      ) {
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen()
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen()
        } else if (docEl.mozRequestFullScreen) {
          await docEl.mozRequestFullScreen()
        } else if (docEl.msRequestFullscreen) {
          await docEl.msRequestFullscreen()
        }
      } else {
        if (doc.exitFullscreen) {
          await doc.exitFullscreen()
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen()
        } else if (doc.mozCancelFullScreen) {
          await doc.mozCancelFullScreen()
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen()
        }
      }
    } catch (err) {
      console.warn('Fullscreen toggle request was prevented:', err)
    }
  }

  useEffect(() => {
    if (successData) {
      setCountdown(20)
      countdownTimerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            handleReset()
            return 20
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current)
        countdownTimerRef.current = null
      }
    }

    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current)
      }
    }
  }, [successData])

  const handleReset = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current)
      countdownTimerRef.current = null
    }
    setFullName('')
    setEmail('')
    setPhone('')
    setOrganization('')
    setDesignation('')
    setErrorMsg('')
    setSuccessData(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Please fill in your Full Name, Email, and Contact Number.')
      return
    }

    if (!organization.trim()) {
      setErrorMsg('Please enter your Organization or Company name.')
      return
    }

    setLoading(true)

    try {
      const payload = {
        registrationType: 'delegate',
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        organization: organization.trim(),
        designation: designation.trim() || 'Delegate',
        passType: 'Delegate Pass'
      }

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setSuccessData({
          name: payload.fullName,
          email: payload.email,
          organization: payload.organization,
          designation: payload.designation,
          registrationId: data.registrationId
        })
      } else {
        setErrorMsg(data.error || 'Failed to submit registration. Please try again.')
      }
    } catch {
      setErrorMsg('Network connectivity error. Please check your internet connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-wine-950 text-cream-50 font-sans flex flex-col justify-between selection:bg-glc-magenta selection:text-white">
      {/* Header */}
      <header className="w-full border-b border-wine-800/60 bg-wine-950/90 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Image
            src="/logos/tapmi-logo.svg"
            alt="TAPMI"
            width={100}
            height={32}
            priority
            className="brightness-0 invert h-7 w-auto"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-wine-900/70 hover:bg-wine-900 text-cream-200 hover:text-white border border-wine-700/70 text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
          >
            {isFullscreen ? (
              <>
                <Minimize className="w-3.5 h-3.5 text-glc-orange" />
                <span>Exit Full Screen</span>
              </>
            ) : (
              <>
                <Maximize className="w-3.5 h-3.5 text-glc-orange" />
                <span>Full Screen</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative">
        <div className="w-full max-w-2xl relative z-10">
          {successData ? (
            /* ========================================== */
            /* SUCCESS CONFIRMATION STATE                 */
            /* ========================================== */
            <div className="bg-[#13030F] rounded-3xl p-8 sm:p-12 border border-wine-800 shadow-2xl text-center animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-950/90 border border-emerald-500/50 flex items-center justify-center mx-auto mb-5 shadow-lg">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1 uppercase">
                Registration Confirmed
              </h2>

              <p className="text-base sm:text-lg text-glc-orange font-semibold mb-6">
                Welcome, {successData.name}
              </p>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-wine-800/80 text-left space-y-3 mb-8 text-sm">
                <div className="text-[11px] font-mono uppercase tracking-wider text-cream-400 font-semibold border-b border-wine-800/80 pb-2 flex items-center justify-between">
                  <span>Delegate Details</span>
                  {successData.registrationId && (
                    <span className="text-cream-300">ID: {successData.registrationId}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-cream-400 block text-[11px] uppercase tracking-wider">
                      Organization
                    </span>
                    <span className="font-semibold text-white">
                      {successData.organization}
                    </span>
                  </div>
                  <div>
                    <span className="text-cream-400 block text-[11px] uppercase tracking-wider">
                      Designation
                    </span>
                    <span className="font-semibold text-white">
                      {successData.designation || 'Delegate'}
                    </span>
                  </div>
                  <div>
                    <span className="text-cream-400 block text-[11px] uppercase tracking-wider">
                      Email
                    </span>
                    <span className="font-semibold text-white truncate block">
                      {successData.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-cream-400 block text-[11px] uppercase tracking-wider">
                      Venue
                    </span>
                    <span className="font-semibold text-white">
                      Dr. Ramdas M. Pai Auditorium
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-wine-900/30 border border-wine-800/80 text-cream-200 text-xs sm:text-sm leading-relaxed mb-8 text-left">
                <strong className="block text-white font-semibold mb-0.5">
                  Next Step:
                </strong>
                Please collect your official delegate badge and kit at the registration desk.
              </div>

              {/* Action Buttons & Countdown */}
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-glc-magenta via-glc-pink to-glc-orange text-white text-sm sm:text-base font-bold uppercase tracking-wider shadow-xl hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Register Next Delegate</span>
                </button>

                <p className="text-xs text-cream-400">
                  Screen will reset in <strong className="text-white font-mono font-bold">{countdown}s</strong> for the next delegate.
                </p>
              </div>
            </div>
          ) : (
            /* ========================================== */
            /* REGISTRATION FORM                          */
            /* ========================================== */
            <div className="bg-[#13030F] rounded-3xl p-6 sm:p-10 border border-wine-800 shadow-2xl relative">
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
                  Delegate Registration
                </h1>
                <p className="text-xs sm:text-sm text-cream-300/80 mt-1.5">
                  Please enter your details to receive your conference pass.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 rounded-2xl bg-red-950/60 border border-red-800 text-xs sm:text-sm text-red-200">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-[11px] sm:text-xs uppercase tracking-wider text-cream-300 font-bold mb-2">
                    Full Name <span className="text-glc-magenta">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-cream-400 absolute left-4 top-3.5 sm:top-4 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Dr. Rajesh Kumar"
                      autoComplete="name"
                      className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-2xl bg-wine-950 border border-wine-800 text-base text-cream-100 placeholder:text-cream-500 focus:outline-none focus:border-glc-magenta transition-all"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[11px] sm:text-xs uppercase tracking-wider text-cream-300 font-bold mb-2">
                    Official / Personal Email <span className="text-glc-magenta">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-cream-400 absolute left-4 top-3.5 sm:top-4 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rajesh.kumar@company.com"
                      autoComplete="email"
                      className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-2xl bg-wine-950 border border-wine-800 text-base text-cream-100 placeholder:text-cream-500 focus:outline-none focus:border-glc-magenta transition-all"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-[11px] sm:text-xs uppercase tracking-wider text-cream-300 font-bold mb-2">
                    Contact / WhatsApp Number <span className="text-glc-magenta">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-cream-400 absolute left-4 top-3.5 sm:top-4 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      autoComplete="tel"
                      className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-2xl bg-wine-950 border border-wine-800 text-base text-cream-100 placeholder:text-cream-500 focus:outline-none focus:border-glc-magenta transition-all"
                    />
                  </div>
                </div>

                {/* Grid: Organization & Designation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Organization */}
                  <div>
                    <label className="block text-[11px] sm:text-xs uppercase tracking-wider text-cream-300 font-bold mb-2">
                      Organization / Company <span className="text-glc-magenta">*</span>
                    </label>
                    <div className="relative">
                      <Building className="w-5 h-5 text-cream-400 absolute left-4 top-3.5 sm:top-4 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="e.g. Infosys, TCS, IIM..."
                        autoComplete="organization"
                        className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-2xl bg-wine-950 border border-wine-800 text-base text-cream-100 placeholder:text-cream-500 focus:outline-none focus:border-glc-magenta transition-all"
                      />
                    </div>
                  </div>

                  {/* Designation */}
                  <div>
                    <label className="block text-[11px] sm:text-xs uppercase tracking-wider text-cream-300 font-bold mb-2">
                      Designation / Role
                    </label>
                    <div className="relative">
                      <Briefcase className="w-5 h-5 text-cream-400 absolute left-4 top-3.5 sm:top-4 pointer-events-none" />
                      <input
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="e.g. Vice President, Director..."
                        className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-2xl bg-wine-950 border border-wine-800 text-base text-cream-100 placeholder:text-cream-500 focus:outline-none focus:border-glc-magenta transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 sm:py-4.5 px-6 rounded-2xl bg-gradient-to-r from-glc-magenta via-glc-pink to-glc-orange text-white text-base font-bold uppercase tracking-wider shadow-xl hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Registration</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 px-6 border-t border-wine-900/60 text-center text-xs text-cream-400/80 bg-wine-950/60">
        GLC 2026 • TAPMI Bengaluru
      </footer>
    </div>
  )
}
