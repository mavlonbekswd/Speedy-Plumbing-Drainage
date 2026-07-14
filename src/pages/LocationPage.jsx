import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowUpRight, CheckCircle2, Phone } from 'lucide-react'
import Seo from '../lib/seo'
import { breadcrumbSchema, plumberSchema } from '../lib/schema'
import { businessConfig } from '../data/business'
import { getLocationBySlug } from '../data/locationPages'
import { getServiceBySlug, homepageServiceSlugs } from '../data/services'
import PageHero from '../components/layout/PageHero'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'

export default function LocationPage() {
  const { slug } = useParams()
  const location = getLocationBySlug(slug)

  if (!location) return <Navigate to="/areas-we-cover" replace />

  const featured = homepageServiceSlugs.slice(0, 6).map(getServiceBySlug)

  return (
    <>
      <Seo
        title={location.title}
        description={location.metaDescription}
        path={`/areas/${location.slug}`}
        jsonLd={[
          plumberSchema(),
          breadcrumbSchema([
            { name: 'Areas We Cover', path: '/areas-we-cover' },
            { name: location.town, path: `/areas/${location.slug}` },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Areas we cover"
        title={`Plumbing & drainage services in ${location.town}`}
        intro={location.intro}
        crumbs={[
          { name: 'Areas We Cover', path: '/areas-we-cover' },
          { name: location.town, path: `/areas/${location.slug}` },
        ]}
      >
        <div className="mt-9 flex flex-col gap-4 sm:flex-row">
          <Button href={businessConfig.phoneHref} icon={Phone} size="lg">
            Call {businessConfig.phoneDisplay}
          </Button>
          <Button to="/quote" variant="outline" size="lg">
            Request a Quote
          </Button>
        </div>
      </PageHero>

      <section className="bg-mist px-5 py-24 text-charcoal md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <Reveal>
                <h2 className="display-lg">
                  Local knowledge <span className="text-blue">matters.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-7 max-w-2xl text-lg leading-relaxed text-charcoal/85">{location.localDetail}</p>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="mt-5 text-sm text-steel-dark">
                  {location.town} is one of the areas we serve — we travel to you, so there’s no local
                  office or branch. Final coverage confirmation is always a quick phone call away.
                </p>
              </Reveal>
            </div>

            <Reveal className="lg:col-span-2">
              <div className="rounded-sm bg-charcoal p-8">
                <h3 className="eyebrow text-electric">Common jobs in {location.town}</h3>
                <ul className="mt-6 space-y-3.5">
                  {location.commonJobs.map((job) => (
                    <li key={job} className="flex items-start gap-3 text-base text-mist/85">
                      <CheckCircle2 className="mt-1 size-4.5 shrink-0 text-electric" aria-hidden="true" />
                      {job}
                    </li>
                  ))}
                </ul>
                {location.nearby.length > 0 && (
                  <p className="mt-7 border-t border-white/10 pt-5 text-sm text-steel">
                    Also serving nearby: {location.nearby.join(', ')}.{' '}
                    <Link to="/areas-we-cover" className="font-semibold text-electric underline-offset-4 hover:underline">
                      All areas →
                    </Link>
                  </p>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-charcoal px-5 py-20 md:px-8 md:py-28" aria-labelledby={`services-${location.slug}`}>
        <div className="mx-auto max-w-7xl">
          <h2 id={`services-${location.slug}`} className="eyebrow text-electric">
            Services available in {location.town}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((service) => (
              <Reveal key={service.slug}>
                <Link
                  to={`/services/${service.slug}`}
                  className="group flex h-full items-center justify-between gap-4 rounded-sm border border-white/10 p-6 transition-colors hover:border-electric/40"
                >
                  <span className="font-display text-xl text-white uppercase">{service.name}</span>
                  <ArrowUpRight className="size-5 shrink-0 text-electric transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-14 text-center">
            <p className="text-lg text-mist/85">
              Need a plumber in {location.town}?{' '}
              <a href={businessConfig.phoneHref} className="font-bold text-electric underline-offset-4 hover:underline">
                Call {businessConfig.phoneDisplay}
              </a>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
