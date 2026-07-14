import { Link } from 'react-router-dom'
import { ArrowUpRight, Phone } from 'lucide-react'
import Seo from '../lib/seo'
import { breadcrumbSchema } from '../lib/schema'
import { businessConfig } from '../data/business'
import { services } from '../data/services'
import PageHero from '../components/layout/PageHero'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'

export default function Services() {
  return (
    <>
      <Seo
        title="Plumbing & Drainage Services in Cambridge"
        description="Emergency plumbing, blocked drains, leak repairs, drain cleaning, toilet repairs and bathroom plumbing — professional service across Cambridge and surrounding areas."
        path="/services"
        jsonLd={[breadcrumbSchema([{ name: 'Services', path: '/services' }])]}
      />

      <PageHero
        eyebrow="Our services"
        title="Every plumbing and drainage problem, handled."
        intro="Seven core services cover the vast majority of problems homes and businesses face. If yours isn’t listed, call — the answer is usually yes."
        crumbs={[{ name: 'Services', path: '/services' }]}
      />

      <section className="bg-mist px-5 py-24 text-charcoal md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={0.04 * i} className={i === 0 ? 'md:col-span-2' : ''}>
                <Link
                  to={`/services/${service.slug}`}
                  className="group relative block h-full overflow-hidden rounded-sm bg-charcoal"
                >
                  <img
                    src={service.image}
                    alt={service.imageAlt}
                    loading="lazy"
                    className={`w-full object-cover opacity-60 transition duration-700 group-hover:scale-105 group-hover:opacity-45 ${
                      i === 0 ? 'aspect-[16/7]' : 'aspect-[16/9]'
                    }`}
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                    {service.emergency && (
                      <span className="mb-3 w-fit rounded-sm bg-amber px-2.5 py-1 text-[10px] font-bold tracking-widest text-charcoal uppercase">
                        Emergency service
                      </span>
                    )}
                    <h2 className={`${i === 0 ? 'display-lg' : 'display-md'} text-white`}>{service.name}</h2>
                    <p className="mt-3 max-w-xl text-base text-mist/80">{service.short}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold tracking-widest text-electric uppercase">
                      Learn more
                      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16 flex flex-col items-start gap-5 rounded-sm bg-charcoal p-8 sm:flex-row sm:items-center sm:justify-between md:p-12">
            <div>
              <p className="display-md text-white">Not sure what you need?</p>
              <p className="mt-2 text-steel">Describe the problem — we’ll tell you what it takes to fix it.</p>
            </div>
            <Button href={businessConfig.phoneHref} icon={Phone} size="lg">
              {businessConfig.phoneDisplay}
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  )
}
