import { Link } from 'react-router-dom'
import { Phone } from 'lucide-react'
import { businessConfig } from '../../data/business'
import { serviceAreas } from '../../data/serviceAreas'
import AreasMap from '../ui/AreasMap'
import PostcodeChecker from '../ui/PostcodeChecker'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'

/**
 * Premium service-area section (Contact.md). The map is stylised and shows
 * areas served — it does not imply offices or branches.
 */
export default function AreasSection() {
  return (
    <section
      className="grain relative overflow-hidden bg-navy-deep px-5 py-28 md:px-8 md:py-40"
      aria-labelledby="areas-heading"
    >
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Areas we cover"
          title={<span id="areas-heading">Professional plumbing across Cambridge and surrounding areas</span>}
          intro="Speedy Plumbing & Drain provides reliable plumbing and drainage services across Cambridge, Ely, Huntingdon, Newmarket, St Neots, Haverhill and surrounding communities."
          size="display-lg"
        />

        <div className="mt-16 grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <AreasMap />
          </Reveal>

          <div>
            <Reveal>
              <ul className="flex flex-wrap gap-x-6 gap-y-3" aria-label="Areas we serve">
                {serviceAreas.map((area, i) => (
                  <Reveal key={area.slug} as="li" delay={0.04 * i} y={16}>
                    <span className="text-base font-medium text-mist/85">{area.name}</span>
                  </Reveal>
                ))}
              </ul>
            </Reveal>

            <Reveal className="mt-10">
              <PostcodeChecker />
            </Reveal>

            <Reveal className="mt-10">
              <p className="text-lg text-white">
                Not sure whether we cover your area?{' '}
                <a
                  href={businessConfig.phoneHref}
                  className="inline-flex items-center gap-2 font-bold text-electric underline-offset-4 hover:underline"
                >
                  <Phone className="size-4" aria-hidden="true" />
                  Call {businessConfig.phoneDisplay}
                </a>
              </p>
              <Link
                to="/areas-we-cover"
                className="mt-4 inline-block text-sm font-bold tracking-widest text-electric uppercase underline-offset-4 hover:underline"
              >
                View all areas we cover →
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
