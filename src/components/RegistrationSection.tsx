'use client'

import React, { useState } from 'react'
import { EVENT_DETAILS } from '@/data/eventData'
import { ArrowRight, CheckCircle2, Shield, Calendar, MapPin, Navigation as NavIcon } from 'lucide-react'
import { LiquidButton } from '@/components/ui/liquid-glass-button'

export default function RegistrationSection() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    organization: '',
    role: '',
    sector: 'IT & GCCs',
    delegateType: 'Executive Delegate',
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 800)
  }

  return (
    <section id="register" className="py-24 relative bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Context, Venue Info & Google Maps */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            <div className="flex flex-col gap-3">
              <span className="text-xs font-mono text-brand-orange font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-2.5 h-[2px] bg-brand-orange"></span>
                DELEGATE ACCESS & VENUE MAP
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 font-serif">
                RESERVE YOUR PASS
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed pt-2 font-sans">
                Join over 1,000+ senior leaders, GCC managing directors, and academic fellows at TAPMI Bengaluru for GLC 2026.
              </p>
            </div>

            {/* Event Summary Details Box */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-brand-orange/15 text-brand-orange">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">DATE</span>
                  <span className="text-sm font-bold text-slate-900 font-mono">{EVENT_DETAILS.date} ({EVENT_DETAILS.day})</span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                <div className="p-2.5 rounded-lg bg-brand-orange/15 text-brand-orange mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">VENUE & PLUS CODE</span>
                  <span className="text-sm font-bold text-slate-900 font-mono">{EVENT_DETAILS.venue.name}</span>
                  <span className="text-xs text-slate-600">{EVENT_DETAILS.venue.institution}, {EVENT_DETAILS.venue.campus}</span>
                  <span className="text-xs text-brand-orange font-mono font-bold pt-1">
                    Google Plus Code: 4HHR+59 Bengaluru, Karnataka
                  </span>
                </div>
              </div>
            </div>

            {/* Embedded Google Maps View */}
            <div className="rounded-2xl bg-white border border-slate-200 p-2 shadow-sm overflow-hidden flex flex-col gap-2">
              <div className="w-full h-64 rounded-xl overflow-hidden relative border border-slate-200">
                <iframe
                  title="TAPMI Bengaluru Google Maps Location"
                  width="100%"
                  height="100%"
                  className="border-0"
                  loading="lazy"
                  allowFullScreen
                  src="https://maps.google.com/maps?q=4HHR%2B59+Bengaluru%2C+Karnataka&t=&z=15&ie=UTF8&iwloc=&output=embed"
                />
              </div>

              <a
                href="https://maps.google.com/?q=4HHR%2B59+Bengaluru%2C+Karnataka"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <LiquidButton variant="secondary" size="lg" className="w-full justify-between font-mono text-xs text-slate-800 font-bold">
                  <span className="flex items-center gap-2">
                    <NavIcon className="w-4 h-4 text-brand-orange" />
                    <span>OPEN IN GOOGLE MAPS</span>
                  </span>
                  <span className="text-[10px] text-slate-500">4HHR+59 BENGALURU</span>
                </LiquidButton>
              </a>
            </div>

            <div className="p-4 rounded-xl bg-brand-orange/10 border border-brand-orange/20 text-xs text-slate-700 flex items-start gap-3 font-sans">
              <Shield className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" />
              <span>Official entry QR codes and parking details will be dispatched to your registered work email prior to the event.</span>
            </div>

          </div>

          {/* Right Column: Delegate Registration Form */}
          <div className="lg:col-span-7">
            <div className="p-8 md:p-10 rounded-2xl bg-white border border-slate-200 shadow-lg relative">
              
              {submitted ? (
                <div className="py-12 flex flex-col items-center text-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-brand-orange/20 border border-brand-orange text-brand-orange flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-bold text-slate-900 font-serif">REGISTRATION CONFIRMED</h3>
                    <p className="text-xs text-slate-600 max-w-md font-mono">
                      Thank you, <span className="text-brand-orange font-bold">{formData.fullName}</span>. Your delegate pass application for <span className="text-slate-900 font-bold">{EVENT_DETAILS.title}</span> has been received.
                    </p>
                  </div>

                  <LiquidButton
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    size="lg"
                    className="font-mono text-xs text-slate-800 font-bold"
                  >
                    Submit Another Application
                  </LiquidButton>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <h3 className="text-lg font-bold text-slate-900 font-serif">DELEGATE APPLICATION FORM</h3>
                    <span className="text-[11px] font-mono text-brand-orange font-bold">GLC 4.0 REGISTRATION</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    
                    {/* Full Name */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono text-slate-700 font-bold uppercase">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Rajesh Sharma"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-brand-orange transition-colors font-sans"
                      />
                    </div>

                    {/* Work Email */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono text-slate-700 font-bold uppercase">Work Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="rajesh@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-brand-orange transition-colors font-sans"
                      />
                    </div>

                    {/* Organization */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono text-slate-700 font-bold uppercase">Organization / Institution *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Goldman Sachs / TAPMI"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        className="px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-brand-orange transition-colors font-sans"
                      />
                    </div>

                    {/* Designation */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono text-slate-700 font-bold uppercase">Designation / Role</label>
                      <input
                        type="text"
                        placeholder="e.g. VP Strategy / Student"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-brand-orange transition-colors font-sans"
                      />
                    </div>

                    {/* Industry Sector */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono text-slate-700 font-bold uppercase">Industry Sector</label>
                      <select
                        value={formData.sector}
                        onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                        className="px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-brand-orange transition-colors font-sans"
                      >
                        <option value="IT & GCCs">IT, GCCs & Enterprise Tech</option>
                        <option value="BFSI">BFSI & Capital Markets</option>
                        <option value="FMCG">FMCG & Consumer Goods</option>
                        <option value="Automotive & EV">Automotive & EV Mobility</option>
                        <option value="Media & Marketing">Media & Marketing</option>
                        <option value="Academia">Academia & Research</option>
                      </select>
                    </div>

                    {/* Attending As */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono text-slate-700 font-bold uppercase">Attending As</label>
                      <select
                        value={formData.delegateType}
                        onChange={(e) => setFormData({ ...formData, delegateType: e.target.value })}
                        className="px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-brand-orange transition-colors font-sans"
                      >
                        <option value="Executive Delegate">Executive Delegate (Corporate)</option>
                        <option value="Student Delegate">MAHE Student Delegate</option>
                        <option value="Faculty / Guest">Faculty / Special Guest</option>
                      </select>
                    </div>

                  </div>

                  {/* Submit Liquid Glass Button */}
                  <div className="w-full mt-4">
                    <LiquidButton
                      type="submit"
                      disabled={isSubmitting}
                      size="xl"
                      className="w-full bg-brand-orange text-white font-mono font-bold text-xs uppercase tracking-widest"
                    >
                      {isSubmitting ? (
                        <span>PROCESSING APPLICATION...</span>
                      ) : (
                        <>
                          <span>CONFIRM REGISTRATION</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </LiquidButton>
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
