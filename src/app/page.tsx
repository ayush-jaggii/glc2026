import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import RevealSection from '@/components/RevealSection'
import PastGlcGallery3D from '@/components/PastGlcGallery3D'
import ArchiveGallery from '@/components/ArchiveGallery'
import DelegateAdvantage from '@/components/DelegateAdvantage'
import RegistrationSection from '@/components/RegistrationSection'
import VenueSection from '@/components/VenueSection'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-wine-950 text-cream-50 selection:bg-glc-magenta selection:text-white flex flex-col">
      {/* 1. Header Navigation */}
      <Navigation />

      {/* 2. Hero Viewport with Tektype Display Typography & Visual Identity */}
      <HeroSection />

      {/* 3. The 5 Strategic Symposia & Locked Speaker Embargo */}
      <RevealSection />

      {/* 4. 3D Photography Journey right after panel topics */}
      <PastGlcGallery3D />

      {/* 5. Historical Archive & Auditorium Retrospective Film */}
      <ArchiveGallery />

      {/* 6. Executive Delegate ROI & Advantage Path */}
      <DelegateAdvantage />

      {/* 7. Direct Delegate Registration Portal (Google Sheets Integrated) */}
      <RegistrationSection />

      {/* 8. Event Venue & Google Maps Location */}
      <VenueSection />

      {/* 9. Institutional Footer & Secretariat Baseline */}
      <Footer />
    </main>
  )
}
