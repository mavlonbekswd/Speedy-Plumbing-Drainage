import Seo from '../lib/seo'
import { plumberSchema } from '../lib/schema'
import CinematicIntro from '../components/home/CinematicIntro'
import ServicesShowcase from '../components/home/ServicesShowcase'
import EmergencySection from '../components/home/EmergencySection'
import ProcessStory from '../components/home/ProcessStory'
import BeforeAfterSection from '../components/home/BeforeAfterSection'
import WhyUs from '../components/home/WhyUs'
import ReviewsSection from '../components/home/ReviewsSection'
import AreasSection from '../components/home/AreasSection'
import FinalCTA from '../components/home/FinalCTA'

export default function Home() {
  return (
    <>
      <Seo
        title="Plumber in Cambridge — Emergency Plumbing & Drainage"
        description="Fast, professional plumbing and drainage services across Cambridge, Ely, Huntingdon, Newmarket, Haverhill, St Neots and surrounding areas. Call Speedy Plumbing & Drain on 01223 482415."
        path="/"
        jsonLd={[plumberSchema()]}
      />
      <CinematicIntro />
      <ServicesShowcase />
      <EmergencySection />
      <ProcessStory />
      <BeforeAfterSection />
      <WhyUs />
      <ReviewsSection />
      <AreasSection />
      <FinalCTA />
    </>
  )
}
