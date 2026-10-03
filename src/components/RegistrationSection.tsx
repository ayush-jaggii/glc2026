'use client'

import React, { useState, useEffect } from 'react'
import { EVENT_DETAILS } from '@/data/eventData'
import {
  CheckCircle2,
  Loader2,
  ArrowRight,
  Mail,
  Phone,
  Building,
  User,
  Tag,
  GraduationCap,
  Briefcase,
  RotateCcw
} from 'lucide-react'
import { PassDetails } from '@/components/pass/DelegatePassCard'
import TicketPrinterAnimation from '@/components/pass/TicketPrinterAnimation'
import { generateQrDataUrl } from '@/lib/qrGenerator'

type StreamType = 'delegate' | 'student'

// Feature flag: set to true to re-enable student registration whenever ready
// Feature flag: student registration is live
const ENABLE_STUDENT_REGISTRATION = true

export default function RegistrationSection() {
  const [stream, setStream] = useState<StreamType>('delegate')

  // Delegate specific fields
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [organization, setOrganization] = useState('')
  const [designation, setDesignation] = useState('')

  // Student specific fields (Instant Roll Number Lookup)
  const [studentRollNumber, setStudentRollNumber] = useState('')

  // Submission & Pass State
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [generatedPass, setGeneratedPass] = useState<PassDetails | null>(null)
  const [delegateSuccess, setDelegateSuccess] = useState(false)

  // Mobile-only auto-scroll to the top of the pass / confirmation area
  useEffect(() => {
    if (generatedPass || delegateSuccess) {
      // Only execute on mobile screens (< 768px), leaving desktop/laptops untouched
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        // Delay allows mobile on-screen keyboards to finish collapsing
        const timer = setTimeout(() => {
          const target = document.getElementById('register')
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 120)

        return () => clearTimeout(timer)
      }
    }
  }, [generatedPass, delegateSuccess])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    // 1. Student Pass Retrieval Engine
    if (stream === 'student') {
      const cleanRoll = studentRollNumber.trim().toUpperCase()
      if (!cleanRoll) {
        setErrorMsg('Please enter your College Roll Number.')
        return
      }

      setLoading(true)

      try {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            registrationType: 'student',
            rollNumber: cleanRoll
          })
        })

        const data = await res.json()
        if (res.ok && data.success && data.passDetails) {
          // Generate high-resolution QR code data URL for student pass
          const qrUrl = await generateQrDataUrl(data.passDetails)
          const completePass: PassDetails = {
            ...data.passDetails,
            qrDataUrl: qrUrl
          }
          setGeneratedPass(completePass)
        } else {
          setErrorMsg(data.error || 'Roll number not found, please check roll no or contact Nexora or the CE team')
        }
      } catch {
        setErrorMsg('Network connectivity error. Please verify your connection.')
      } finally {
        setLoading(false)
      }
      return
    }

    // 2. Delegate Registration Engine
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Please complete all required fields (Full Name, Email, Phone).')
      return
    }

    if (!organization.trim()) {
      setErrorMsg('Please provide your Organization or Company name.')
      return
    }

    setLoading(true)

    try {
      const payload = {
        registrationType: 'delegate',
        fullName,
        email,
        phone,
        organization,
        designation,
        passType: 'Delegate Pass'
      }

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setDelegateSuccess(true)
      } else {
        setErrorMsg(data.error || 'Failed to submit registration. Please try again.')
      }
    } catch {
      setErrorMsg('Network connectivity error. Please verify your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setGeneratedPass(null)
    setDelegateSuccess(false)
    setFullName('')
    setEmail('')
    setPhone('')
    setOrganization('')
    setDesignation('')
    setStudentRollNumber('')
    setErrorMsg('')
  }

  const studentFirstName = generatedPass?.name ? generatedPass.name.trim().split(' ')[0] : ''

  return (
    <section id="register" className="relative py-24 sm:py-32 bg-wine-950 overflow-hidden border-t border-wine-900/80 scroll-mt-24">
      {/* Ambient background accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-glc-magenta/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-glc-orange/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Delegate Thank You State */}
        {delegateSuccess ? (
          <div className="flex flex-col items-center justify-center animate-fadeIn py-8 px-4 max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-glc-magenta/20 to-glc-orange/20 border border-glc-magenta/50 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(244,81,151,0.25)]">
              <CheckCircle2 className="w-8 h-8 text-glc-magenta" />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-wine-900/80 text-glc-orange border border-glc-orange/40 mb-4 shadow-lg">
              <span>Registration Confirmed</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase mb-4 leading-tight">
              Thank You for Registering
            </h2>

            <p className="text-base sm:text-lg text-cream-200/90 leading-relaxed mb-8">
              We will get in touch with you shortly with further details and conference updates.
            </p>

            {/* Delegate Info Summary Card */}
            <div className="w-full p-6 rounded-2xl bg-[#13030F] border border-wine-800 shadow-xl text-left mb-8 space-y-3">
              <div className="text-xs uppercase tracking-wider text-cream-400 font-semibold border-b border-wine-800/80 pb-2">
                Registration Summary
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div>
                  <span className="text-cream-400 block text-[11px] uppercase tracking-wider">Delegate Name</span>
                  <span className="font-semibold text-white">{fullName}</span>
                </div>
                <div>
                  <span className="text-cream-400 block text-[11px] uppercase tracking-wider">Email</span>
                  <span className="font-semibold text-white">{email}</span>
                </div>
                {organization && (
                  <div>
                    <span className="text-cream-400 block text-[11px] uppercase tracking-wider">Organization</span>
                    <span className="font-semibold text-white">{organization}</span>
                  </div>
                )}
                {designation && (
                  <div>
                    <span className="text-cream-400 block text-[11px] uppercase tracking-wider">Designation</span>
                    <span className="font-semibold text-white">{designation}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-cream-200 hover:text-white transition-colors py-2.5 px-6 rounded-xl bg-wine-900/60 hover:bg-wine-900 border border-wine-800 shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Register Another Attendee</span>
            </button>
          </div>
        ) : generatedPass ? (
          <div className="flex flex-col items-center justify-center animate-fadeIn">
            
            <div className="text-center max-w-2xl mx-auto mb-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-cream-50 uppercase leading-tight">
                {studentFirstName ? `Hello ${studentFirstName},` : 'Hello,'}
                <span className="block mt-1">welcome to GLC 2026</span>
              </h2>
              <p className="mt-2 text-sm sm:text-base text-cream-200/90 leading-relaxed">
                Official pass is issued. You may download and use it for attendance on 10th October.
              </p>
            </div>

            {/* Ticket Printer Dispenser Animation, Pass Card, and Unified Actions */}
            <div className="w-full max-w-4xl mx-auto mb-4">
              <TicketPrinterAnimation pass={generatedPass} onReset={handleReset} />
            </div>
          </div>
        ) : (
          /* Registration Form & Context */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Clean & Revamped Context */}
            <div className="lg:col-span-5 flex flex-col justify-between pt-2">
              <div>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream-50 uppercase mb-4 leading-tight">
                  {stream === 'student' ? 'Student Registration' : 'Delegate Registration'}
                </h2>

                <p className="text-sm sm:text-base text-cream-200/80 leading-relaxed mb-6">
                  {stream === 'student'
                    ? 'Enter your roll number to register for the event.'
                    : 'Register for executive access and participation at GLC 2026. Our team will review your registration and get in touch.'}
                </p>
              </div>

              {/* Inquiries & Assistance */}
              <div className="p-6 rounded-2xl bg-wine-900/40 border border-wine-800/80 text-xs mt-4">
                <div className="font-semibold uppercase tracking-wider text-cream-300 mb-3">
                  Inquiries & Assistance
                </div>
                <div className="text-cream-400 space-y-2.5">
                  {EVENT_DETAILS.contacts.leads.map((lead) => (
                    <div key={lead.name} className="flex items-center justify-between gap-2">
                      <span>{lead.name}</span>
                      <a href={`tel:${lead.phone.replace(/\s+/g, '')}`} className="text-cream-200 hover:text-glc-orange font-medium">
                        {lead.phone}
                      </a>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-wine-800/60 flex items-center justify-between">
                    <span>Official Email</span>
                    <a href={`mailto:${EVENT_DETAILS.contacts.email}`} className="text-glc-orange hover:underline font-medium">
                      {EVENT_DETAILS.contacts.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Registration Card */}
            <div className="lg:col-span-7">
              <div className="bg-[#13030F] rounded-2xl p-6 sm:p-10 border border-wine-800 shadow-2xl relative">
                
                {/* Mode Switcher: Delegate vs Student */}
                {ENABLE_STUDENT_REGISTRATION && (
                  <div className="mb-8">
                    <div className="grid grid-cols-2 p-1 rounded-xl bg-wine-950 border border-wine-800">
                      <button
                        type="button"
                        onClick={() => {
                          setStream('delegate')
                          setErrorMsg('')
                        }}
                        className={`flex items-center justify-center gap-1.5 sm:gap-2 py-3 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition-all ${
                          stream === 'delegate'
                            ? 'bg-gradient-to-r from-glc-magenta to-glc-orange text-white shadow-md'
                            : 'text-cream-300 hover:text-white'
                        }`}
                      >
                        <Briefcase className="w-4 h-4 shrink-0" />
                        <span className="sm:hidden">Delegate</span>
                        <span className="hidden sm:inline">Delegate Registration</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setStream('student')
                          setErrorMsg('')
                        }}
                        className={`flex items-center justify-center gap-1.5 sm:gap-2 py-3 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition-all ${
                          stream === 'student'
                            ? 'bg-gradient-to-r from-glc-magenta to-glc-orange text-white shadow-md'
                            : 'text-cream-300 hover:text-white'
                        }`}
                      >
                        <GraduationCap className="w-4 h-4 shrink-0" />
                        <span className="sm:hidden">Student</span>
                        <span className="hidden sm:inline">Student Registration</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {errorMsg && (
                  <div className="mb-6 p-3.5 rounded-xl bg-red-950/50 border border-red-800/80 text-xs text-red-200">
                    {errorMsg}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleRegister} className="space-y-5">

                  {/* Delegate Form Fields */}
                  {stream === 'delegate' ? (
                    <>
                      {/* Name & Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-cream-300 mb-1.5 font-semibold">
                            Full Name *
                          </label>
                          <div className="relative">
                            <User className="w-4 h-4 text-cream-400 absolute left-3.5 top-3.5 pointer-events-none" />
                            <input
                              type="text"
                              required
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="e.g. Dr. Rajesh Sharma"
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-wine-950/90 border border-wine-800 text-[16px] sm:text-xs text-cream-100 placeholder:text-cream-400 focus:outline-none focus:border-glc-magenta transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-cream-300 mb-1.5 font-semibold">
                            Official / Corporate Email *
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-cream-400 absolute left-3.5 top-3.5 pointer-events-none" />
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="name@company.com"
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-wine-950/90 border border-wine-800 text-[16px] sm:text-xs text-cream-100 placeholder:text-cream-400 focus:outline-none focus:border-glc-magenta transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Organization & Designation */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-cream-300 mb-1.5 font-semibold">
                            Organization / Company *
                          </label>
                          <div className="relative">
                            <Building className="w-4 h-4 text-cream-400 absolute left-3.5 top-3.5 pointer-events-none" />
                            <input
                              type="text"
                              required
                              value={organization}
                              onChange={(e) => setOrganization(e.target.value)}
                              placeholder="e.g. Global Tech Solutions"
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-wine-950/90 border border-wine-800 text-[16px] sm:text-xs text-cream-100 placeholder:text-cream-400 focus:outline-none focus:border-glc-magenta transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-cream-300 mb-1.5 font-semibold">
                            Designation / Role
                          </label>
                          <div className="relative">
                            <Tag className="w-4 h-4 text-cream-400 absolute left-3.5 top-3.5 pointer-events-none" />
                            <input
                              type="text"
                              value={designation}
                              onChange={(e) => setDesignation(e.target.value)}
                              placeholder="e.g. VP Global Strategy"
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-wine-950/90 border border-wine-800 text-[16px] sm:text-xs text-cream-100 placeholder:text-cream-400 focus:outline-none focus:border-glc-magenta transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Contact Phone / WhatsApp */}
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-cream-300 mb-1.5 font-semibold">
                          Contact Phone / WhatsApp *
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-cream-400 absolute left-3.5 top-3.5 pointer-events-none" />
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-wine-950/90 border border-wine-800 text-[16px] sm:text-xs text-cream-100 placeholder:text-cream-400 focus:outline-none focus:border-glc-magenta transition-colors"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Student Form Fields (Streamlined Roll Number Lookup) */
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-cream-300 mb-2 font-semibold">
                          College Roll Number *
                        </label>
                        <div className="relative">
                          <Tag className="w-4 h-4 text-cream-400 absolute left-3.5 top-3.5 pointer-events-none" />
                          <input
                            type="text"
                            required
                            autoFocus
                            value={studentRollNumber}
                            onChange={(e) => {
                              setStudentRollNumber(e.target.value)
                              setErrorMsg('')
                            }}
                            placeholder="e.g. 246213240"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-wine-950/90 border border-wine-800 text-[16px] sm:text-sm text-cream-100 placeholder:text-cream-500 focus:outline-none focus:border-glc-magenta transition-colors uppercase font-mono tracking-wider"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 px-8 rounded-full font-semibold text-xs sm:text-sm tracking-widest uppercase text-white bg-gradient-to-r from-glc-magenta via-glc-pink to-glc-orange hover:shadow-[0_0_28px_-5px_rgba(244,81,151,0.65)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 group shadow-xl cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>
                            {stream === 'student' ? 'Accessing Student Pass...' : 'Submitting Registration...'}
                          </span>
                        </>
                      ) : (
                        <>
                          <span>
                            {stream === 'student' ? 'Download My Pass' : 'Complete Registration'}
                          </span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </div>

                </form>

              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  )
}
