import { HeroSection } from '@/sections/HeroSection'
import { TrustStrip } from '@/sections/TrustStrip'
import { ServicesSection } from '@/sections/ServicesSection'
import { WhyStarDigital } from '@/sections/WhyStarDigital'
import { HowItWorksSection } from '@/sections/HowItWorksSection'
import { ReviewsSection } from '@/sections/ReviewsSection'
import { ServiceAreaSection } from '@/sections/ServiceAreaSection'
import { QuickHelpSection } from '@/sections/QuickHelpSection'
import { FinalCTASection } from '@/sections/FinalCTASection'
import { ScrollReveal } from '@/components/ScrollReveal'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      
      <ScrollReveal animation="fade-in" duration={600}>
        <TrustStrip />
      </ScrollReveal>

      <ScrollReveal animation="fade-up" duration={700}>
        <ServicesSection />
      </ScrollReveal>

      <ScrollReveal animation="fade-up" duration={700}>
        <WhyStarDigital />
      </ScrollReveal>

      <ScrollReveal animation="fade-up" duration={700}>
        <HowItWorksSection />
      </ScrollReveal>

      <ScrollReveal animation="fade-up" duration={700}>
        <ReviewsSection />
      </ScrollReveal>

      <ScrollReveal animation="fade-up" duration={700}>
        <ServiceAreaSection />
      </ScrollReveal>

      <ScrollReveal animation="fade-up" duration={700}>
        <QuickHelpSection />
      </ScrollReveal>

      <ScrollReveal animation="scale-up" duration={650}>
        <FinalCTASection />
      </ScrollReveal>
    </>
  )
}
