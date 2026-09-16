'use client'

import React, { useState } from 'react'
import { EVENT_DETAILS } from '@/data/eventData'
import { CheckCircle2, Loader2, ArrowRight, ShieldCheck, Mail, Phone, Building, User, Tag } from 'lucide-react'

type PassCategory = 'executive' | 'corporate' | 'academic'

export default function RegistrationSection() {
  const [passType, setPassType] = useState<PassCategory>('executive')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [organization, setOrganization] = useState('')
  const [designation, setDesignation] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [regId, setRegId] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim() || !organization.trim()) {
      setErrorMsg('Please complete all required fields (Full Name, Official Email, Organization).')
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
          phone,
          passType: passType === 'executive' ? 'Executive Delegate' : passType === 'corporate' ? 'Corporate Delegation' : 'Academic / Research Fellow'
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSubmitted(true)
        setRegId(data.registrationId || 'GLC26-SUCCESS')
      } else {
        setErrorMsg(data.error || 'Failed to submit registration. Please try again.')
      }
    } catch {
      setErrorMsg('Network connectivity error. Please verify your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="register" className="relative py-24 sm:py-32 bg-wine-950 overflow-hidden border-t border-wine-900/80">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Context, Protocols & Venue Details */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm text-xs font-semibold tracking-widest uppercase bg-wine-900 text-glc-magenta border border-wine-700 mb-4">
                <span>Direct Allocation Portal</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream-50 uppercase mb-4">
                SECURE YOUR DELEGATE PASS
              </h2>

              <p className="text-sm sm:text-base text-cream-200/90 leading-relaxed mb-8">
                Attendance at GLC 2026 is curated to maintain an optimal balance of enterprise leadership, GCC architects, government liaisons, and postgraduate scholars.
              </p>

              {/* Protocol Highlights */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-glc-magenta/20 border border-glc-magenta flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-glc-magenta" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-cream-100 block">Priority Confirmation</span>
                    <span className="text-xs text-cream-400">Applications are reviewed and acknowledged within 48 business hours.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-glc-orange/20 border border-glc-orange flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-glc-orange" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-cream-100 block">Full Colloquium Access</span>
                    <span className="text-xs text-cream-400">Includes all 5 thematic symposia, executive luncheon, and networking reception.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-wine-700 border border-wine-500 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-cream-200" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-cream-100 block">Institutional Certification</span>
                    <span className="text-xs text-cream-400">Official certificate of participation endorsed by TAPMI Bengaluru (MAHE Manipal).</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Committee Support */}
            <div className="p-5 rounded-2xl bg-wine-900/50 border border-wine-800 text-xs">
              <div className="font-semibold uppercase tracking-wider text-cream-300 mb-2">
                Corporate Delegation Inquiries
              </div>
              <div className="text-cream-400 space-y-1">
                <div>Lead: <span className="text-cream-200">{EVENT_DETAILS.contacts.leads[0].name}</span> ({EVENT_DETAILS.contacts.leads[0].phone})</div>
                <div>Relations: <span className="text-cream-200">{EVENT_DETAILS.contacts.leads[1].name}</span> ({EVENT_DETAILS.contacts.leads[1].phone})</div>
                <div>Email: <a href={`mailto:${EVENT_DETAILS.contacts.email}`} className="text-glc-orange hover:underline">{EVENT_DETAILS.contacts.email}</a></div>
              </div>
            </div>
          </div>

          {/* Right Column: Registration Card / Google Sheets Form Integration */}
          <div className="lg:col-span-7">
            <div className="bg-[#13030F] rounded-xl p-8 sm:p-10 border border-wine-800 shadow-2xl relative">
              
              {submitted ? (
                /* Success State */
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-glc-magenta/20 border border-glc-magenta flex items-center justify-center text-glc-magenta mb-6 animate-pulse">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-widest text-glc-orange mb-2">
                    Registration Confirmed
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cream-50 uppercase mb-3">
                    PASS APPLICATION RECORDED
                  </h3>
                  <p className="text-xs sm:text-sm text-cream-300 max-w-md mx-auto mb-6">
                    Thank you, <strong className="text-cream-100">{fullName}</strong>. Your delegate pass application has been synced to the TAPMI registry.
                  </p>
                  
                  <div className="p-4 rounded-xl bg-wine-950 border border-wine-800 font-mono text-xs text-cream-300 mb-8 inline-block">
                    Reference ID: <span className="text-glc-magenta font-bold">{regId}</span>
                  </div>

                  <button
                    onClick={() => {
                      setSubmitted(false)
                      setFullName('')
                      setEmail('')
                      setOrganization('')
                      setDesignation('')
                      setPhone('')
                    }}
                    type="button"
                    className="text-xs font-semibold tracking-wider uppercase text-cream-300 hover:text-white underline underline-offset-4"
                  >
                    Register Another Delegate →
                  </button>
                </div>
              ) : (
                /* Interactive Registration Form */
                <form onSubmit={handleRegister} className="space-y-6">
                  
                  {/* Pass Tier Selection */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-cream-300 mb-2.5">
                      Select Delegate Classification *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {(
                        [
                          { id: 'executive', label: 'Executive Pass', desc: 'CXO & Senior Leadership' },
                          { id: 'corporate', label: 'Corporate Pass', desc: 'Enterprise Delegations' },
                          { id: 'academic', label: 'Academic Fellow', desc: 'Faculty & Scholars' },
                        ] as const
                      ).map((tier) => (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => setPassType(tier.id)}
                          className={`p-3.5 rounded-xl border text-left transition-all ${
                            passType === tier.id
                              ? 'bg-gradient-to-r from-wine-900 to-wine-850 border-glc-magenta text-white shadow-md'
                              : 'bg-wine-950/60 border-wine-800 text-cream-300 hover:border-wine-700'
                          }`}
                        >
                          <div className="text-xs font-bold text-cream-100">{tier.label}</div>
                          <div className="text-[10px] text-cream-400 mt-0.5">{tier.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Form Error Banner */}
                  {errorMsg && (
                    <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800/80 text-xs text-red-200">
                      {errorMsg}
                    </div>
                  )}

                  {/* Field Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Full Name */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-cream-300 mb-1.5">
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

                    {/* Official Email */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-cream-300 mb-1.5">
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

                    {/* Organization */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-cream-300 mb-1.5">
                        Organization / Institution *
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

                    {/* Designation */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-cream-300 mb-1.5">
                        Designation / Role
                      </label>
                      <div className="relative">
                        <Tag className="w-4 h-4 text-cream-400 absolute left-3.5 top-3 pointer-events-none" />
                        <input
                          type="text"
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          placeholder="e.g. VP Global Operations"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-wine-950/90 border border-wine-800 text-xs text-cream-100 placeholder:text-cream-400 focus:outline-none focus:border-glc-magenta transition-colors"
                        />
                      </div>
                    </div>

                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-cream-300 mb-1.5">
                      Contact Phone / WhatsApp
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-cream-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-wine-950/90 border border-wine-800 text-xs text-cream-100 placeholder:text-cream-400 focus:outline-none focus:border-glc-magenta transition-colors"
                      />
                    </div>
                  </div>

                  {/* Submission Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-8 rounded-full font-semibold text-xs sm:text-sm tracking-widest uppercase text-white bg-gradient-to-r from-glc-magenta via-glc-pink to-glc-orange hover:shadow-[0_0_28px_-5px_rgba(244,81,151,0.65)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 group"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Synchronizing Registration...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Registration Application</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-cream-400 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-glc-orange" />
                    <span>Direct encrypted submission to TAPMI Bengaluru Academic Registry</span>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
