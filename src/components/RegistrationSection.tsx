'use client'

import React, { useState } from 'react'
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
import DelegatePassCard, { PassDetails } from '@/components/pass/DelegatePassCard'
import PassDownloadActions from '@/components/pass/PassDownloadActions'
import { generateQrDataUrl } from '@/lib/qrGenerator'

type StreamType = 'delegate' | 'student'

export default function RegistrationSection() {
  const [stream, setStream] = useState<StreamType>('delegate')

  // Common fields
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  // Delegate specific fields
  const [organization, setOrganization] = useState('')
  const [designation, setDesignation] = useState('')
  const [trackPreference, setTrackPreference] = useState('IT & Enterprise Tech')

  // Student specific fields (only our college - TAPMI Bengaluru, MAHE)
  const [year, setYear] = useState('1st Year')
  const [studentId, setStudentId] = useState('')

  // Submission & Pass State
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [generatedPass, setGeneratedPass] = useState<PassDetails | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Please complete all required fields (Full Name, Email, Phone).')
      return
    }

    if (stream === 'delegate' && !organization.trim()) {
      setErrorMsg('Please provide your Organization or Company name.')
      return
    }

    setLoading(true)

    try {
      const payload = {
        registrationType: stream,
        fullName,
        email,
        phone,
        // Delegate fields
        organization,
        designation,
        passType: stream === 'student' ? 'Student Pass' : 'Delegate Pass',
        trackPreference,
        // Student fields
        year,
        studentId
      }

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (res.ok && data.success && data.passDetails) {
        // Generate high-resolution QR code data URL
        const qrUrl = await generateQrDataUrl(data.passDetails)
        const completePass: PassDetails = {
          ...data.passDetails,
          qrDataUrl: qrUrl
        }
        setGeneratedPass(completePass)
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
    setFullName('')
    setEmail('')
    setPhone('')
    setOrganization('')
    setDesignation('')
    setYear('1st Year')
    setStudentId('')
    setErrorMsg('')
  }

  return (
    <section id="register" className="relative py-24 sm:py-32 bg-wine-950 overflow-hidden border-t border-wine-900/80 scroll-mt-24">
      {/* Ambient background accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-glc-magenta/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-glc-orange/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Generated Pass State */}
        {generatedPass ? (
          <div className="flex flex-col items-center justify-center animate-fadeIn">
            
            <div className="text-center max-w-2xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-600/60 mb-4 shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Registration Confirmed · Official Pass Issued</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-cream-50 uppercase">
                Welcome to GLC 2026
              </h2>
              <p className="mt-2 text-sm sm:text-base text-cream-200/90 leading-relaxed">
                Your auditorium seat has been reserved and your official delegate pass is ready.
              </p>
            </div>

            {/* Visual Conference Pass Card */}
            <div className="w-full max-w-4xl mx-auto mb-4">
              <DelegatePassCard pass={generatedPass} />
            </div>

            {/* Action Buttons: Download PDF, Save PNG, Print */}
            <div className="w-full max-w-xl mx-auto">
              <PassDownloadActions pass={generatedPass} />
            </div>

            {/* Reset Action */}
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-cream-300 hover:text-white transition-colors py-2 px-4 rounded-lg bg-wine-900/40 hover:bg-wine-900 border border-wine-800/80"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Register Another Attendee</span>
              </button>
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
                    ? 'Register for your official student pass and reserved auditorium seating at TAPMI, MAHE Bengaluru.'
                    : 'Register for executive access, reserved auditorium seating, and networking at GLC 2026.'}
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
                      <span>{lead.name} ({lead.role})</span>
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
                <div className="mb-8">
                  <div className="grid grid-cols-2 p-1 rounded-xl bg-wine-950 border border-wine-800">
                    <button
                      type="button"
                      onClick={() => setStream('delegate')}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition-all ${
                        stream === 'delegate'
                          ? 'bg-gradient-to-r from-glc-magenta to-glc-orange text-white shadow-md'
                          : 'text-cream-300 hover:text-white'
                      }`}
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>Delegate Registration</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStream('student')}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition-all ${
                        stream === 'student'
                          ? 'bg-gradient-to-r from-glc-magenta to-glc-orange text-white shadow-md'
                          : 'text-cream-300 hover:text-white'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Student Registration</span>
                    </button>
                  </div>
                </div>

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
                            <User className="w-4 h-4 text-cream-400 absolute left-3.5 top-3 pointer-events-none" />
                            <input
                              type="text"
                              required
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="e.g. Dr. Rajesh Sharma"
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-wine-950/90 border border-wine-800 text-xs text-cream-100 placeholder:text-cream-400 focus:outline-none focus:border-glc-magenta transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-cream-300 mb-1.5 font-semibold">
                            Official / Corporate Email *
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-cream-400 absolute left-3.5 top-3 pointer-events-none" />
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="name@company.com"
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-wine-950/90 border border-wine-800 text-xs text-cream-100 placeholder:text-cream-400 focus:outline-none focus:border-glc-magenta transition-colors"
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
                            <Building className="w-4 h-4 text-cream-400 absolute left-3.5 top-3 pointer-events-none" />
                            <input
                              type="text"
                              required
                              value={organization}
                              onChange={(e) => setOrganization(e.target.value)}
                              placeholder="e.g. Global Tech Solutions"
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-wine-950/90 border border-wine-800 text-xs text-cream-100 placeholder:text-cream-400 focus:outline-none focus:border-glc-magenta transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-cream-300 mb-1.5 font-semibold">
                            Designation / Role
                          </label>
                          <div className="relative">
                            <Tag className="w-4 h-4 text-cream-400 absolute left-3.5 top-3 pointer-events-none" />
                            <input
                              type="text"
                              value={designation}
                              onChange={(e) => setDesignation(e.target.value)}
                              placeholder="e.g. VP Global Strategy"
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-wine-950/90 border border-wine-800 text-xs text-cream-100 placeholder:text-cream-400 focus:outline-none focus:border-glc-magenta transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Phone & Panel Interest */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-cream-300 mb-1.5 font-semibold">
                            Contact Phone / WhatsApp *
                          </label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-cream-400 absolute left-3.5 top-3 pointer-events-none" />
                            <input
                              type="tel"
                              required
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="+91 98765 43210"
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-wine-950/90 border border-wine-800 text-xs text-cream-100 placeholder:text-cream-400 focus:outline-none focus:border-glc-magenta transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-cream-300 mb-1.5 font-semibold">
                            Primary Panel Interest
                          </label>
                          <select
                            value={trackPreference}
                            onChange={(e) => setTrackPreference(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-wine-950/90 border border-wine-800 text-xs text-cream-100 focus:outline-none focus:border-glc-magenta transition-colors"
                          >
                            <option value="IT & Enterprise Tech">Ctrl + Alt + Global (IT & Enterprise Tech)</option>
                            <option value="Automobile & EV">Shifting Gears (Automobile & Clean-Tech)</option>
                            <option value="FMCG & Supply Chain">Aisle Be There (Global Supply & FMCG)</option>
                            <option value="Executive Roundtable / CGD">Beyond The Bottomline (Roundtable)</option>
                            <option value="BFSI & Fintech">Capital Without Borders (BFSI & Liquidity)</option>
                            <option value="Media & Branding">Going Viral, Staying Local (Media)</option>
                          </select>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Student Form Fields (Streamlined for TAPMI/MAHE Bengaluru) */
                    <>
                      {/* Name & College Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-cream-300 mb-1.5 font-semibold">
                            Full Name *
                          </label>
                          <div className="relative">
                            <User className="w-4 h-4 text-cream-400 absolute left-3.5 top-3 pointer-events-none" />
                            <input
                              type="text"
                              required
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="e.g. Ananya Rao"
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-wine-950/90 border border-wine-800 text-xs text-cream-100 placeholder:text-cream-400 focus:outline-none focus:border-glc-magenta transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-cream-300 mb-1.5 font-semibold">
                            College / Learner Email *
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-cream-400 absolute left-3.5 top-3 pointer-events-none" />
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="name@learner.manipal.edu"
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-wine-950/90 border border-wine-800 text-xs text-cream-100 placeholder:text-cream-400 focus:outline-none focus:border-glc-magenta transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Year of Study & Roll Number */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-cream-300 mb-1.5 font-semibold">
                            Year *
                          </label>
                          <div className="relative">
                            <GraduationCap className="w-4 h-4 text-cream-400 absolute left-3.5 top-3 pointer-events-none" />
                            <select
                              value={year}
                              onChange={(e) => setYear(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-wine-950/90 border border-wine-800 text-xs text-cream-100 focus:outline-none focus:border-glc-magenta transition-colors"
                            >
                              <option value="1st Year">1st Year</option>
                              <option value="2nd Year">2nd Year</option>
                              <option value="3rd Year">3rd Year</option>
                              <option value="4th Year">4th Year</option>
                              <option value="MBA">MBA</option>
                              <option value="PhD / Research Scholar">PhD / Research Scholar</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-cream-300 mb-1.5 font-semibold">
                            Roll No. / Student ID
                          </label>
                          <div className="relative">
                            <Tag className="w-4 h-4 text-cream-400 absolute left-3.5 top-3 pointer-events-none" />
                            <input
                              type="text"
                              value={studentId}
                              onChange={(e) => setStudentId(e.target.value)}
                              placeholder="e.g. 24MBATM042"
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-wine-950/90 border border-wine-800 text-xs text-cream-100 placeholder:text-cream-400 focus:outline-none focus:border-glc-magenta transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-cream-300 mb-1.5 font-semibold">
                          Contact Phone / WhatsApp *
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-cream-400 absolute left-3.5 top-3 pointer-events-none" />
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-wine-950/90 border border-wine-800 text-xs text-cream-100 placeholder:text-cream-400 focus:outline-none focus:border-glc-magenta transition-colors"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 px-8 rounded-full font-semibold text-xs sm:text-sm tracking-widest uppercase text-white bg-gradient-to-r from-glc-magenta via-glc-pink to-glc-orange hover:shadow-[0_0_28px_-5px_rgba(244,81,151,0.65)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 group shadow-xl"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Generating Official Pass...</span>
                        </>
                      ) : (
                        <>
                          <span>Complete Registration & Generate Pass</span>
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
