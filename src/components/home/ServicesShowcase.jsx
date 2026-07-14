import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { getServiceBySlug, homepageServiceSlugs } from '../../data/services'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'

/**
 * Oversized alternating service panels — editorial layout, no small cards.
 */
export default function ServicesShowcase() {
  const featured = homepageServiceSlugs.map(getServiceBySlug)

  return (
    <section className="bg-mist px-5 py-28 text-charcoal md:px-8 md:py-40" aria-labelledby="services-heading">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="What we do"
          title={<span id="services-heading">Built to fix. Trusted to finish.</span>}
          intro="Six core services cover almost every plumbing and drainage problem a home or business faces. Every job gets the same standard: clear pricing, professional equipment and a clean finish."
          dark={false}
        />

        <div className="mt-20 space-y-24 md:mt-28 md:space-y-36">
          {featured.map((service, i) => (
            <Reveal key={service.slug}>
              <article
                className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${
                  i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''
                }`}
              >
                <Link
                  to={`/services/${service.slug}`}
                  className="group relative block overflow-hidden rounded-sm"
                  aria-label={`Learn more about ${service.name}`}
                >
                  <img
                    src={service.image}
                    alt={service.imageAlt}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent" aria-hidden="true" />
                  <span className="font-display absolute bottom-4 left-5 text-6xl text-white/25 md:text-8xl" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </Link>

                <div>
                  <h3 className="display-lg">
                    <Link
                      to={`/services/${service.slug}`}
                      className="transition-colors hover:text-blue"
                    >
                      {service.name}
                    </Link>
                  </h3>
                  <p className="mt-5 max-w-lg text-lg leading-relaxed text-steel-dark">{service.short}</p>
                  <ul className="mt-6 space-y-2">
                    {service.points.slice(0, 3).map((point) => (
                      <li key={point} className="flex items-start gap-3 text-base text-charcoal/80">
                        <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-blue" aria-hidden="true" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/services/${service.slug}`}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-bold tracking-widest text-blue uppercase underline-offset-4 hover:underline"
                  >
                    {service.name}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
