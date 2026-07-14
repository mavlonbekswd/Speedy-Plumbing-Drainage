import Seo from '../lib/seo'
import { breadcrumbSchema } from '../lib/schema'
import { businessConfig } from '../data/business'
import { reviewsArePlaceholders } from '../data/reviews'
import PageHero from '../components/layout/PageHero'
import ReviewCarousel from '../components/ui/ReviewCarousel'
import Reveal from '../components/ui/Reveal'

export default function ReviewsPage() {
  return (
    <>
      <Seo
        title="Customer Reviews"
        description="What customers across Cambridge and surrounding areas say about Speedy Plumbing & Drain."
        path="/reviews"
        jsonLd={[breadcrumbSchema([{ name: 'Reviews', path: '/reviews' }])]}
      />

      <PageHero
        eyebrow="Reviews"
        title="Judged on every job."
        intro={
          reviewsArePlaceholders
            ? 'Genuine customer reviews will be published here as they come in. The cards below show the format — they are clearly marked as samples, not real reviews.'
            : 'Genuine reviews from customers across Cambridge and the surrounding areas.'
        }
        crumbs={[{ name: 'Reviews', path: '/reviews' }]}
      />

      <section className="bg-ink px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <ReviewCarousel />

          <Reveal className="mt-20">
            <div className="rounded-sm border border-white/10 p-8 text-center md:p-12">
              <h2 className="display-md text-white">Had work done by us?</h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-steel">
                A short, honest review helps neighbours find a plumber they can trust — and tells us
                what to keep doing. Mention it on your next call or email{' '}
                <a href={businessConfig.emailHref} className="font-semibold text-electric underline-offset-4 hover:underline">
                  {businessConfig.email}
                </a>
                .
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
