'use client';

import React from 'react';
import InfiniteGallery from '@/components/ui/3d-gallery-photography';

export default function DemoOne() {
  const sampleImages = [
    { src: '/glc-photos/DSC00015.JPG', alt: 'GLC Keynote Stage' },
    { src: '/glc-photos/DSC00016.JPG', alt: 'Executive Leadership Panel' },
    { src: '/glc-photos/DSC00026.JPG', alt: 'Lamp Lighting Ceremony' },
    { src: '/glc-photos/DSC00046.JPG', alt: 'Colloquium Opening' },
    { src: '/glc-photos/DSC00296.JPG', alt: 'Thought Leaders' },
    { src: '/glc-photos/DSC00311.JPG', alt: 'Auditorium Interactive Q&A' },
    { src: '/glc-photos/DSC00361.JPG', alt: 'Networking & Synergy' },
    { src: '/glc-photos/DSC00414.JPG', alt: 'Corporate CXO Deliberation' },
    { src: '/glc-photos/DSC00419.JPG', alt: 'Felicitation of Speakers' },
    { src: '/glc-photos/DSC_0424.JPG', alt: 'Delegate Conclave' },
  ];

  return (
    <main className="min-h-screen h-full w-full bg-wine-950 relative">
      <InfiniteGallery
        images={sampleImages}
        speed={1.2}
        zSpacing={3}
        visibleCount={12}
        falloff={{ near: 0.8, far: 14 }}
        className="h-screen w-full rounded-lg overflow-hidden"
      />
      <div className="h-screen inset-0 pointer-events-none fixed flex items-center justify-center text-center px-3 mix-blend-exclusion text-white">
        <h1 className="font-serif text-4xl md:text-7xl tracking-tight">
          <span className="italic">GLC Archives</span>
        </h1>
      </div>

      <div className="text-center fixed bottom-10 left-0 right-0 font-mono uppercase text-[11px] font-semibold text-cream-200">
        <p>Use mouse wheel, arrow keys, or touch to navigate</p>
        <p className="opacity-60">
          Auto-play resumes after 3 seconds of inactivity
        </p>
      </div>
    </main>
  );
}
