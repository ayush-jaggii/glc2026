import HeroSection from '@/components/HeroSection'
import ThemeIntro from '@/components/ThemeIntro'
import RevealSection from '@/components/RevealSection'
import ArchiveGallery from '@/components/ArchiveGallery'
import DelegateAdvantage from '@/components/DelegateAdvantage'
import RegistrationSection from '@/components/RegistrationSection'
import ConstellationGrid from '@/components/ui/constellation-grid'

export default function Home() {
  return (
    <ConstellationGrid fixed={true} forceLightMode={true}>
      <div className="flex flex-col w-full min-h-screen bg-transparent">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Theme & Geopolitics Storytelling */}
        <ThemeIntro />

        {/* 3. Speakers & Panels Reveal Countdown */}
        <RevealSection />

        {/* 4. Past GLC Credibility Archive */}
        <ArchiveGallery />

        {/* 5. Executive Delegate Advantage */}
        <DelegateAdvantage />

        {/* 6. Delegate Pass Registration */}
        <RegistrationSection />
      </div>
    </ConstellationGrid>
  )
}
