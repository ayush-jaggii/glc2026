'use client'

import React from 'react'
import { Globe, Marker, Arc } from '@/components/ui/cobe-globe'

const BENGALURU_INDIA: [number, number] = [12.9716, 77.5946]

const GLC_MARKERS: Marker[] = [
  { id: "blr", location: BENGALURU_INDIA, label: "HQ: INDIA (BENGALURU)" },
  { id: "london", location: [51.5074, -0.1278], label: "LONDON" },
  { id: "nyc", location: [40.7128, -74.006], label: "NEW YORK" },
  { id: "singapore", location: [1.3521, 103.8198], label: "SINGAPORE" },
  { id: "tokyo", location: [35.6762, 139.6503], label: "TOKYO" },
  { id: "dubai", location: [25.2048, 55.2708], label: "DUBAI" },
]

const GLC_ARCS: Arc[] = [
  { id: "india-london", from: BENGALURU_INDIA, to: [51.5074, -0.1278] },
  { id: "india-nyc", from: BENGALURU_INDIA, to: [40.7128, -74.006] },
  { id: "india-singapore", from: BENGALURU_INDIA, to: [1.3521, 103.8198] },
  { id: "india-tokyo", from: BENGALURU_INDIA, to: [35.6762, 139.6503] },
  { id: "india-dubai", from: BENGALURU_INDIA, to: [25.2048, 55.2708] },
]

export default function GlobeCanvas() {
  return (
    <div className="relative w-full max-w-[620px] aspect-square mx-auto flex items-center justify-center transform scale-105">
      <Globe
        markers={GLC_MARKERS}
        arcs={GLC_ARCS}
        markerColor={[0.96, 0.51, 0.20]} // TAPMI Brand Orange #F58232
        baseColor={[1, 1, 1]} // White Canvas
        arcColor={[0.96, 0.51, 0.20]} // TAPMI Orange Arc Vector
        glowColor={[1, 0.94, 0.88]} // Warm Ambient Glow
        dark={0}
        mapBrightness={6}
        markerSize={0.055} // Zoomed in & enlarged marker
        markerElevation={0.02}
        arcWidth={0.85}
        arcHeight={0.35}
        speed={0.0018} // Gentle rotation so India stays front & center
        initialPhi={4.95} // Center India directly in view on load
        theta={0.22}
      />
      {/* Overlay coordinate chip */}
      <div className="absolute bottom-2 left-4 px-3 py-1.5 rounded-md bg-white/95 border border-slate-200 backdrop-blur-md text-[10px] font-mono text-slate-800 flex items-center gap-2 shadow-sm pointer-events-none z-10">
        <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping"></span>
        <span className="font-bold">EPICENTER: INDIA (12.9716° N, 77.5946° E)</span>
      </div>
    </div>
  )
}
