'use client'

import React, { useState } from 'react'
import { EVENT_DETAILS } from '@/data/eventData'
import { CheckCircle2, ArrowUpRight, Loader2 } from 'lucide-react'
import { LiquidButton } from '@/components/ui/liquid-glass-button'

export default function RegistrationSection() {
  const [passType, setPassType] = useState<'executive' | 'corporate' | 'academic'>('executive')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [organization, setOrganization] = useState('')
  const [designation, setDesignation] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim() || !organization.trim()) {
      setErrorMsg('Please complete all required fields.')
      return
    }
    setErrorMsg('')
    setLoading(true)

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          organization,
          designation,
          passType
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit registration')
      }

      setSubmitted(true)
    } catch (err: any) {
      console.error('Registration submission error:', err)
      setErrorMsg(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const passDetails = {
    executive: {
      name: "EXECUTIVE DELEGATE PASS",
      category: "Individual Senior Leader",
      inclusions: ["Full Access to 5 Panel Tracks", "Official Networking Lunch & Gala Dinner", "C-Suite Keynote Briefings", "AACSB & MAHE Certificate"]
    },
    corporate: {
      name: "CORPORATE DELEGATION (3+ PASSES)",
      category: "Enterprise Group Pass",
      inclusions: ["Reserved Table Seating", "3+ Executive Delegate Passes", "Company Logo in Summit Catalogue", "Exclusive VIP Speaker Lounge Access"]
    },
    academic: {
      name: "ACADEMIC & RESEARCH FELLOW PASS",
      category: "Faculty & Scholar Access",
      inclusions: ["Access to All Keynote Sessions", "Research Paper Presentation Track", "Networking Refreshments", "MAHE Academic Credential"]
    }
  }

  const selectedPass = passDetails[passType]

  return (
    <section id="register" className="py-24 relative bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono text-brand-pink uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
            <span className="w-2.5 h-[2px] bg-brand-pink"></span>
            DELEGATE REGISTRATION & VENUE
            <span className="w-2.5 h-[2px] bg-brand-pink"></span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 font-serif mb-4">
            RESERVE DELEGATE PASS
          </h2>
          <p className="text-sm text-slate-600 font-sans max-w-xl">
            Join 850+ C-Suite leaders, GCC directors, and academic visionaries at Dr. Ramdas M. Pai Auditorium, MAHE Bengaluru.
          </p>
        </div>

        {/* Pass Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12 max-w-3xl mx-auto">
          {(['executive', 'corporate', 'academic'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setPassType(type)}
              className={`px-6 py-3 rounded-full text-xs font-mono font-bold uppercase transition-all border ${
                passType === type
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {type === 'executive' && 'EXECUTIVE PASS'}
              {type === 'corporate' && 'CORPORATE DELEGATION'}
              {type === 'academic' && 'ACADEMIC FELLOW'}
            </button>
          ))}
        </div>

        {/* Form & Pass Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto mb-20">
          
          {/* Left Column: Interactive Form */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
            {submitted ? (
              <div className="flex flex-col items-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 font-serif mb-2">REGISTRATION CONFIRMED</h3>
                <p className="text-xs text-slate-600 max-w-md mb-6 font-sans">
                  Thank you, <span className="font-bold text-slate-900">{fullName}</span>. Your delegate reservation request for <span className="font-bold text-brand-orange">{selectedPass.name}</span> has been recorded.
                </p>
                <div className="p-4 rounded-xl bg-white border border-slate-200 w-full text-left font-mono text-xs text-slate-700 space-y-2 mb-6">
                  <div><span className="text-slate-400 font-bold uppercase">ORGANIZATION:</span> {organization}</div>
                  <div><span className="text-slate-400 font-bold uppercase">EMAIL:</span> {email}</div>
                  <div><span className="text-slate-400 font-bold uppercase">VENUE:</span> Dr. Ramdas M. Pai Auditorium, MAHE Bengaluru</div>
                </div>
                <button
                  onClick={() => { setSubmitted(false); setFullName(''); setEmail(''); setOrganization(''); setDesignation(''); }}
                  className="text-xs font-mono text-brand-orange font-bold hover:underline uppercase"
                >
                  Register Another Delegate →
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="flex flex-col gap-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">DELEGATE DETAILS</span>
                  <span className="text-[11px] font-mono text-brand-pink font-bold">{selectedPass.category}</span>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-mono text-red-600 font-bold">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-mono font-bold text-slate-700 uppercase">FULL NAME *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Rajesh Kumar"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-brand-orange transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-mono font-bold text-slate-700 uppercase">CORPORATE EMAIL *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-brand-orange transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-mono font-bold text-slate-700 uppercase">ORGANIZATION / INSTITUTION *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Infosys / TAPMI"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-brand-orange transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-mono font-bold text-slate-700 uppercase">DESIGNATION / ROLE</label>
                    <input
                      type="text"
                      placeholder="e.g. VP Strategy / Professor"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-brand-orange transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <LiquidButton size="xl" disabled={loading} className="w-full bg-brand-orange text-white font-mono font-bold text-xs uppercase tracking-wider">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>RECORDING RESERVATION...</span>
                      </>
                    ) : (
                      <>
                        <span>CONFIRM DELEGATE RESERVATION</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </>
                    )}
                  </LiquidButton>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Pass Summary Card */}
          <div className="lg:col-span-5 p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between h-full">
            <div>
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block mb-2">
                SELECTED PASS SUMMARY
              </span>
              <h3 className="text-2xl font-bold text-slate-900 font-serif mb-4">
                {selectedPass.name}
              </h3>
              
              <div className="space-y-3 mb-8 pt-4 border-t border-slate-100">
                {selectedPass.inclusions.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col gap-2">
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">VENUE LOCATION</span>
              <span className="text-xs font-bold text-slate-900">{EVENT_DETAILS.venue.name}</span>
              <span className="text-xs text-slate-600 font-mono">{EVENT_DETAILS.venue.address}</span>
            </div>
          </div>

        </div>

        {/* Embedded Google Maps Location */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs max-w-6xl mx-auto h-[380px] relative">
          <iframe
            title="Dr. Ramdas M. Pai Auditorium, MAHE Bengaluru Campus"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.6748491873836!2d77.59242!3d13.12056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae190059e74d75%3A0x6bbf690e54d310e5!2sTAPMI%20Bengaluru!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-md flex items-center justify-between gap-6 max-w-md">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 font-serif">Dr. Ramdas M. Pai Auditorium</span>
              <span className="text-[10px] font-mono text-slate-500">{EVENT_DETAILS.venue.address}</span>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(EVENT_DETAILS.venue.address)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LiquidButton size="sm" className="bg-brand-orange text-white font-mono font-bold text-[10px] uppercase">
                <span>OPEN MAPS</span>
                <ArrowUpRight className="w-3 h-3" />
              </LiquidButton>
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
