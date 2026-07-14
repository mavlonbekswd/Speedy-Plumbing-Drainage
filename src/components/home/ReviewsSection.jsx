import ReviewCarousel from '../ui/ReviewCarousel'
import SectionHeading from '../ui/SectionHeading'

export default function ReviewsSection() {
  return (
    <section className="border-t border-white/8 bg-ink px-5 py-28 md:px-8 md:py-40" aria-labelledby="reviews-heading">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="What customers say"
          title={<span id="reviews-heading">Judged on every job.</span>}
          intro="Genuine customer reviews will appear here — the cards below show the format while they’re collected."
        />
        <div className="mt-16">
          <ReviewCarousel />
        </div>
      </div>
    </section>
  )
}
