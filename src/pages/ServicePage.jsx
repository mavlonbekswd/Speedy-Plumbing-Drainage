import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowUpRight, CheckCircle2, Mail, Phone } from 'lucide-react'
import Seo from '../lib/seo'
import { breadcrumbSchema, serviceSchema } from '../lib/schema'
import { businessConfig } from '../data/business'
import { getServiceBySlug, services } from '../data/services'
import { areaNamesSentence } from '../data/serviceAreas'
import PageHero from '../components/layout/PageHero'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'

export default function ServicePage() {
  const { slug } = useParams()
  const service = getServiceBySlug(slug)

  if (!service) return <Navigate to="/services" replace />

  const others = services.filter((s) => s.slug !== slug).slice(0, 3)
  const accent = service.emergency ? 'text-amber' : 'text-electric'

  return (
    <>
      <Seo
        title={`${service.name} in Cambridge`}
        description={`${service.short} Serving ${areaNamesSentence()}. Call ${businessConfig.phoneDisplay}.`}
        path={`/services/${service.slug}`}
        jsonLd={[
          serviceSchema(service),
          breadcrumbSchema([
            { name: 'Services', path: '/services' },
            { name: service.name, path: `/services/${service.slug}` },
          ]),
        ]}
      />

      <PageHero
        eyebrow={service.emergency ? 'Emergency service' : 'Our services'}
        title={service.heroLine}
        intro={service.description}
        image={service.image}
        crumbs={[
          { name: 'Services', path: '/services' },
          { name: service.name, path: `/services/${service.slug}` },
        ]}
      >
        <div className="mt-9 flex flex-col gap-4 sm:flex-row">
          <Button
            href={businessConfig.phoneHref}
            icon={Phone}
            size="lg"
            variant={service.emergency ? 'emergency' : 'primary'}
          >
            Call {businessConfig.phoneDisplay}
          </Button>
          <Button to="/quote" variant="outline" size="lg">
            Request a Quote
          </Button>
        </div>
      </PageHero>

      {/* What's included */}
      <section className="bg-mist px-5 py-24 text-charcoal md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-2">
            <div>
              <SectionHeading eyebrow="What we handle" title={service.name} dark={false} size="display-lg" />
              <ul className="mt-10 space-y-4">
                {service.points.map((point) => (
                  <Reveal as="li" key={point} y={20}>
                    <span className="flex items-start gap-3 text-lg text-charcoal/85">
                      <CheckCircle2 className="mt-1 size-5 shrink-0 text-blue" aria-hidden="true" />
                      {point}
                    </span>
                  </Reveal>
                ))}
              </ul>
            </div>

            <div className="lg:pt-24">
              <Reveal>
                <div className="rounded-sm bg-charcoal p-8 md:p-10">
                  <h3 className="eyebrow text-electric">How it works</h3>
                  <ol className="mt-6 space-y-6">
                    {service.steps.map((step, i) => (
                      <li key={step} className="flex items-start gap-4">
                        <span className={`font-display text-3xl ${accent}`} aria-hidden="true">
                          {i + 1}
                        </span>
                        <p className="pt-1.5 text-base leading-relaxed text-mist/85">{step}</p>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-8 border-t border-white/10 pt-6">
                    <p className="text-sm text-steel">
                      Serving {areaNamesSentence()}.{' '}
                      <Link to="/areas-we-cover" className="font-semibold text-electric underline-offset-4 hover:underline">
                        Check your area →
                      </Link>
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <section className="bg-charcoal px-5 py-20 md:px-8 md:py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <Reveal>
            <h2 className="display-lg max-w-2xl text-white">
              Ready when <span className={accent}>you are.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button href={businessConfig.phoneHref} icon={Phone} size="lg" variant={service.emergency ? 'emergency' : 'primary'}>
                {businessConfig.phoneDisplay}
              </Button>
              <Button href={businessConfig.emailHref} icon={Mail} variant="outline" size="lg">
                Email Us
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Related services */}
      <section className="border-t border-white/8 bg-ink px-5 py-20 md:px-8 md:py-28" aria-labelledby="related-heading">
        <div className="mx-auto max-w-7xl">
          <h2 id="related-heading" className="eyebrow text-electric">
            Related services
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {others.map((other) => (
              <Reveal key={other.slug}>
                <Link
                  to={`/services/${other.slug}`}
                  className="group block h-full rounded-sm border border-white/10 p-7 transition-colors hover:border-electric/40"
                >
                  <h3 className="display-md text-white">{other.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-steel">{other.short}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold tracking-widest text-electric uppercase">
                    View service
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
