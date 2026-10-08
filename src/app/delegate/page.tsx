'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Sparkles,
  BadgeCheck,
  ArrowRight,
  ShieldCheck
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

  // Auto-reset timer for iPad kiosk (resets after 20 seconds so next delegate has fresh screen)
  const [countdown, setCountdown] = useState(20)
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null)

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
      setErrorMsg('Network connectivity error. Please check internet connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-wine-950 text-cream-50 font-sans flex flex-col justify-between selection:bg-glc-magenta selection:text-white">
      {/* Top Header / Kiosk Branding */}
      <header className="w-full border-b border-wine-800/80 bg-wine-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Image
            src="/logos/tapmi-logo.svg"
            alt="TAPMI"
            width={110}
            height={34}
            priority
            className="brightness-0 invert h-7 sm:h-8 w-auto"
          />
          <div className="h-5 w-[1px] bg-wine-700/80 hidden sm:block" />
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-black tracking-widest text-glc-magenta uppercase">
              GLC 2026 • 4TH EDITION
            </span>
            <span className="text-[10px] text-cream-400 uppercase tracking-wider">
              Global Leadership Conference
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Delegate Desk</span>
          </div>
          <Link
            href="/"
            className="text-[11px] text-cream-400 hover:text-white transition-colors underline"
          >
            Portal
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative overflow-hidden">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-glc-magenta/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-glc-orange/10 blur-3xl pointer-events-none" />

        <div className="w-full max-w-2xl relative z-10">
          {successData ? (
            /* ========================================== */
            /* SUCCESS CONFIRMATION STATE (KIOSK READY)   */
            /* ========================================== */
            <div className="bg-[#13030F] rounded-3xl p-8 sm:p-12 border border-wine-800 shadow-2xl text-center animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/50 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(52,211,153,0.3)]">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-wine-900/80 text-emerald-300 border border-emerald-500/40 mb-4">
                <BadgeCheck className="w-4 h-4 text-emerald-400" />
                <span>On-Spot Registration Confirmed</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
                Welcome to GLC 2026!
              </h2>

              <p className="text-lg text-glc-orange font-semibold mb-6">
                {successData.name}
              </p>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-wine-800/80 text-left space-y-3 mb-8 text-sm">
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

              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 text-xs sm:text-sm leading-relaxed mb-8 flex items-start gap-3 text-left">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-emerald-300 font-bold mb-0.5">
                    Next Step: Collect Your Badge
                  </strong>
                  Please proceed to the registration desk right in front to collect your official physical conference badge and kit.
                </div>
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
                  Screen will automatically reset in <strong className="text-glc-orange font-mono font-bold text-sm">{countdown}s</strong> for the next delegate.
                </p>
              </div>
            </div>
          ) : (
            /* ========================================== */
            /* REGISTRATION FORM (IPAD OPTIMIZED)         */
            /* ========================================== */
            <div className="bg-[#13030F] rounded-3xl p-6 sm:p-10 border border-wine-800 shadow-2xl relative">
              <div className="mb-8 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wine-900/80 border border-wine-700/80 text-[11px] font-bold text-glc-orange uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-glc-magenta" />
                  <span>On-Spot Registration</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase leading-tight">
                  Delegate Check-In
                </h1>
                <p className="text-xs sm:text-sm text-cream-300/80 mt-1.5 leading-relaxed">
                  Please enter your details below for instant conference access and badging.
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
                      className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-2xl bg-wine-950 border border-wine-800 text-base text-cream-100 placeholder:text-cream-500 focus:outline-none focus:border-glc-magenta focus:ring-2 focus:ring-glc-magenta/20 transition-all"
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
                      className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-2xl bg-wine-950 border border-wine-800 text-base text-cream-100 placeholder:text-cream-500 focus:outline-none focus:border-glc-magenta focus:ring-2 focus:ring-glc-magenta/20 transition-all"
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
                      className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-2xl bg-wine-950 border border-wine-800 text-base text-cream-100 placeholder:text-cream-500 focus:outline-none focus:border-glc-magenta focus:ring-2 focus:ring-glc-magenta/20 transition-all"
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
                        className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-2xl bg-wine-950 border border-wine-800 text-base text-cream-100 placeholder:text-cream-500 focus:outline-none focus:border-glc-magenta focus:ring-2 focus:ring-glc-magenta/20 transition-all"
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
                        className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-2xl bg-wine-950 border border-wine-800 text-base text-cream-100 placeholder:text-cream-500 focus:outline-none focus:border-glc-magenta focus:ring-2 focus:ring-glc-magenta/20 transition-all"
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
                        <span>Confirming Registration...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit & Confirm Registration</span>
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

      {/* Footer info for Kiosk */}
      <footer className="w-full py-4 px-6 border-t border-wine-900/60 text-center text-xs text-cream-400/80 bg-wine-950/60">
        GLC 2026 Registration Desk • TAPMI Bengaluru, MAHE • Need help? Ask the registration team volunteer
      </footer>
    </div>
  )
}
