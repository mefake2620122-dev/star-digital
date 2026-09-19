import { HeroSection } from '@/sections/HeroSection'
import { TrustStrip } from '@/sections/TrustStrip'
import { ServicesSection } from '@/sections/ServicesSection'
import { WhyStarDigital } from '@/sections/WhyStarDigital'
import { HowItWorksSection } from '@/sections/HowItWorksSection'
import { ReviewsSection } from '@/sections/ReviewsSection'
import { ServiceAreaSection } from '@/sections/ServiceAreaSection'
import { QuickHelpSection } from '@/sections/QuickHelpSection'
import { FinalCTASection } from '@/sections/FinalCTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <ServicesSection />
      <WhyStarDigital />
      <HowItWorksSection />
      <ReviewsSection />
      <ServiceAreaSection />
      <QuickHelpSection />
      <FinalCTASection />
    </>
  )
}
