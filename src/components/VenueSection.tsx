'use client'

import React from 'react'
import { MapPin, Navigation as NavIcon, Plane, Car, ExternalLink, Building2 } from 'lucide-react'
import { EVENT_DETAILS } from '@/data/eventData'

export default function VenueSection() {
  const mapsUrl = "https://maps.app.goo.gl/AqKzfTSUj8v9RHWTA"
  const embedUrl = "https://maps.google.com/maps?q=13.1275531,77.588986+(Ramdas+M+Pai+Convention+Centre)&hl=en&z=16&output=embed"

  return (
    <section id="venue" className="relative py-24 sm:py-32 bg-[#0E020C] border-t border-wine-800/80 overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-glc-magenta/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-glc-orange/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-cream-50 uppercase mb-4">
            RAMDAS M. PAI CONVENTION CENTRE
          </h2>
          <p className="text-sm sm:text-base text-cream-300 leading-relaxed">
            Hosted at the state-of-the-art convention facilities of MAHE Bengaluru.
          </p>
        </div>

        {/* Two-Column Grid: Logistics Details + Interactive Maps Embed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Venue Details Card */}
          <div className="lg:col-span-5 flex flex-col justify-between p-8 sm:p-10 rounded-2xl bg-[#13030F] border border-wine-800 shadow-2xl">
            
            <div>
              {/* Institution Monogram */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-wine-800/80">
                <div className="w-10 h-10 rounded-xl bg-wine-900/80 border border-wine-700 flex items-center justify-center text-glc-magenta shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-cream-50">
                    Dr. Ramdas M. Pai Convention Centre
                  </h3>
                  <p className="text-xs text-cream-400">
                    MAHE Bengaluru
                  </p>
                </div>
              </div>

              {/* Exact Address */}
              <div className="space-y-4 mb-8">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-glc-orange mb-1 font-semibold">
                    Campus Address
                  </div>
                  <p className="text-xs sm:text-sm text-cream-200 leading-relaxed">
                    Thanisandra Main Road, Chokkanahalli, Yelahanka, Bengaluru, Karnataka 560064
                  </p>
                </div>

                {/* Transit Information */}
                <div className="pt-4 border-t border-wine-800/60 space-y-3 text-xs text-cream-300">
                  <div className="flex items-start gap-3">
                    <Plane className="w-4 h-4 text-glc-pink shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-cream-100">Airport Proximity:</span> ~25 mins from Kempegowda Int'l Airport (BLR) via NH 44.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Car className="w-4 h-4 text-glc-orange shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-cream-100">Delegate Parking:</span> Designated on-campus parking for registered attendee vehicles.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <NavIcon className="w-4 h-4 text-glc-magenta shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-cream-100">City Access:</span> Convenient arterial access via Hebbal and Outer Ring Road corridors.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Google Maps Action CTA */}
            <div className="pt-6 border-t border-wine-800/80">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-7 py-4 text-xs sm:text-sm font-semibold tracking-widest uppercase text-white rounded-full bg-gradient-to-r from-glc-magenta via-glc-pink to-glc-orange hover:shadow-[0_0_28px_rgba(244,81,151,0.5)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] group"
              >
                <span>Get Directions On Google Maps</span>
                <ExternalLink className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

          </div>

          {/* Right Column: Clean Google Maps Embed Container */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-wine-800 bg-[#080106] shadow-2xl relative min-h-[420px] lg:min-h-[500px]">
            <iframe
              src={embedUrl}
              title="Google Map of Ramdas M Pai Convention Centre, TAPMI Bengaluru"
              width="100%"
              height="100%"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>

      </div>

    </section>
  )
}
