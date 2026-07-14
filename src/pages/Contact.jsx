import { Link } from 'react-router-dom'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import Seo from '../lib/seo'
import { breadcrumbSchema, plumberSchema } from '../lib/schema'
import { businessConfig } from '../data/business'
import PageHero from '../components/layout/PageHero'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'

export default function Contact() {
  return (
    <>
      <Seo
        title="Contact Us"
        description={`Contact Speedy Plumbing & Drain — call ${businessConfig.phoneDisplay} or email ${businessConfig.email}. Plumbing and drainage services across Cambridge and surrounding areas.`}
        path="/contact"
        jsonLd={[plumberSchema(), breadcrumbSchema([{ name: 'Contact', path: '/contact' }])]}
      />

      <PageHero
        eyebrow="Contact"
        title="Talk to a plumber, not a call centre."
        intro="The fastest way to get help is a phone call — describe the problem and we’ll tell you honestly what it needs and when we can come."
        crumbs={[{ name: 'Contact', path: '/contact' }]}
      />

      <section className="bg-mist px-5 py-24 text-charcoal md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-3">
            <Reveal>
              <div className="flex h-full flex-col rounded-sm bg-charcoal p-8 md:p-10">
                <Phone className="size-7 text-electric" aria-hidden="true" />
                <h2 className="display-md mt-5 text-white">Call us</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-steel">
                  The quickest route — especially for anything urgent.
                </p>
                <a
                  href={businessConfig.phoneHref}
                  className="font-display mt-6 block text-3xl text-white transition-colors hover:text-electric md:text-4xl"
                >
                  {businessConfig.phoneDisplay}
                </a>
                <Button href={businessConfig.phoneHref} icon={Phone} className="mt-6 w-full">
                  Call Now
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="flex h-full flex-col rounded-sm bg-charcoal p-8 md:p-10">
                <Mail className="size-7 text-electric" aria-hidden="true" />
                <h2 className="display-md mt-5 text-white">Email us</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-steel">
                  Best for non-urgent enquiries, photos of the problem, and landlord or business
                  queries.
                </p>
                <a
                  href={businessConfig.emailHref}
                  className="mt-6 block text-lg font-semibold break-all text-white transition-colors hover:text-electric"
                >
                  {businessConfig.email}
                </a>
                <Button href={businessConfig.emailHref} icon={Mail} variant="outline" className="mt-6 w-full">
                  Write an Email
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="flex h-full flex-col rounded-sm bg-charcoal p-8 md:p-10">
                <MapPin className="size-7 text-electric" aria-hidden="true" />
                <h2 className="display-md mt-5 text-white">Get a quote</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-steel">
                  A structured request with photos gets you an accurate quote fastest.
                </p>
                <Button to="/quote" variant="light" className="mt-6 w-full">
                  Request a Quote
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-12">
            <div className="grid gap-8 rounded-sm border border-charcoal/10 bg-white p-8 md:grid-cols-2 md:p-12">
              <div>
                <h2 className="eyebrow text-blue">Business details</h2>
                <p className="display-md mt-4">{businessConfig.name}</p>
                <dl className="mt-6 space-y-3 text-base">
                  <div className="flex gap-3">
                    <dt className="font-semibold">Telephone:</dt>
                    <dd>
                      <a href={businessConfig.phoneHref} className="text-blue underline-offset-4 hover:underline">
                        {businessConfig.phoneDisplay}
                      </a>
                    </dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="font-semibold">Email:</dt>
                    <dd>
                      <a href={businessConfig.emailHref} className="text-blue break-all underline-offset-4 hover:underline">
                        {businessConfig.email}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
              <div>
                <h2 className="eyebrow text-blue">Availability & coverage</h2>
                <p className="mt-4 flex items-start gap-3 text-base leading-relaxed text-steel-dark">
                  <Clock className="mt-1 size-4.5 shrink-0 text-blue" aria-hidden="true" />
                  {businessConfig.openingHours
                    ? businessConfig.openingHours
                    : 'Call to confirm current availability — for emergencies we’ll always tell you honestly whether we can attend.'}
                </p>
                <p className="mt-4 flex items-start gap-3 text-base leading-relaxed text-steel-dark">
                  <MapPin className="mt-1 size-4.5 shrink-0 text-blue" aria-hidden="true" />
                  <span>
                    Serving homes and businesses throughout Cambridgeshire and nearby towns.{' '}
                    <Link to="/areas-we-cover" className="font-semibold text-blue underline-offset-4 hover:underline">
                      See all areas we cover →
                    </Link>
                  </span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
