import { Suspense, lazy, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, MapPin, Phone } from 'lucide-react'
import Seo from '../lib/seo'
import { breadcrumbSchema, plumberSchema } from '../lib/schema'
import { businessConfig } from '../data/business'
import { areaGroups, getAreaBySlug, locationPageSlugs } from '../data/serviceAreas'
import Button from '../components/ui/Button'
import PostcodeChecker from '../components/ui/PostcodeChecker'
import Reveal from '../components/ui/Reveal'

// The interactive network is the heaviest part of the page — it loads as its
// own chunk AFTER the heading, postcode checker and CTAs are on screen.
const AreaNetwork = lazy(() => import('../components/ui/AreaNetwork'))

function MapSkeleton() {
  return (
    <div
      className="relative w-full animate-pulse overflow-hidden rounded-sm border border-white/8 bg-navy/40"
      style={{ aspectRatio: '10 / 7' }}
      role="status"
      aria-label="Loading coverage map"
    >
      {/* Faint static preview dots so the placeholder reads as a map */}
      {[[50, 53], [64, 17], [17, 25], [83, 42], [12, 56], [77, 79], [30, 86]].map(([x, y]) => (
        <span
          key={`${x}-${y}`}
          className="absolute size-2 rounded-full bg-electric/30"
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      ))}
    </div>
  )
}

export default function AreasWeCover() {
  const [highlightedIds, setHighlightedIds] = useState([])

  return (
    <>
      <Seo
        title="Areas We Cover — Cambridge & Surrounding Areas"
        description="Plumbing and drainage services across Cambridge, Ely, Huntingdon, Newmarket, Haverhill, St Neots, Royston and nearby villages. Check whether we cover your postcode."
        path="/areas-we-cover"
        jsonLd={[plumberSchema(), breadcrumbSchema([{ name: 'Areas We Cover', path: '/areas-we-cover' }])]}
      />

      {/* Coverage hero: heading + postcode checker paint immediately, the
          interactive network streams in beside them. */}
      <section
        className="grain relative overflow-hidden bg-navy-deep px-5 pt-32 pb-20 md:px-8 md:pt-40 md:pb-24 lg:flex lg:min-h-[92vh] lg:flex-col lg:justify-center"
        aria-labelledby="areas-heading"
      >
        <div className="mx-auto w-full max-w-7xl">
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-steel">
              <li>
                <Link to="/" className="transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight className="size-3.5" aria-hidden="true" />
                <span aria-current="page" className="text-mist/80">
                  Areas We Cover
                </span>
              </li>
            </ol>
          </nav>

          <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
            <div>
              <Reveal>
                <p className="eyebrow text-electric">Service coverage</p>
              </Reveal>
              <Reveal delay={0.06}>
                <h1 id="areas-heading" className="display-check mt-5 text-white">
                  Check whether we{' '}
                  <span className="block text-electric">cover your postcode</span>
                </h1>
              </Reveal>
              <Reveal delay={0.14}>
                <div className="mt-9">
                  <PostcodeChecker
                    onResult={(result) => setHighlightedIds(result?.areaIds ?? [])}
                  />
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-7 text-base text-steel">
                  Not sure?{' '}
                  <a
                    href={businessConfig.phoneHref}
                    className="inline-flex items-center gap-1.5 font-semibold text-white underline-offset-4 transition-colors hover:text-electric hover:underline"
                  >
                    <Phone className="size-4" aria-hidden="true" />
                    Call {businessConfig.phoneDisplay}
                  </a>
                </p>
              </Reveal>
            </div>

            <div className="relative">
              <Suspense fallback={<MapSkeleton />}>
                <AreaNetwork highlightedIds={highlightedIds} />
              </Suspense>
              <p className="mt-3 text-center text-xs text-steel/70 lg:text-right">
                A stylised view of our coverage network — tap or hover an area to explore.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Grouped areas */}
      <section className="bg-mist px-5 py-24 text-charcoal md:px-8 md:py-32" aria-label="Service areas by region">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 md:grid-cols-3">
            {areaGroups.map((group, gi) => (
              <Reveal key={group.title} delay={0.08 * gi}>
                <div>
                  <h2 className="display-md">{group.title}</h2>
                  <ul className="mt-7 space-y-3.5">
                    {group.slugs.map((slug) => {
                      const area = getAreaBySlug(slug)
                      const hasPage = locationPageSlugs.includes(slug)
                      return (
                        <li key={slug} className="flex items-start gap-3">
                          <MapPin className="mt-1 size-4 shrink-0 text-blue" aria-hidden="true" />
                          {hasPage ? (
                            <Link
                              to={`/areas/${slug}`}
                              className="text-base font-medium text-charcoal underline-offset-4 transition-colors hover:text-blue hover:underline"
                            >
                              {area.displayName}
                            </Link>
                          ) : (
                            <span className="text-base text-charcoal/85">{area.displayName}</span>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-20">
            <div className="rounded-sm bg-charcoal p-8 md:p-12">
              <p className="max-w-2xl text-lg leading-relaxed text-mist/85">
                These are the areas we serve — we travel to you from the Cambridge area, so there’s no
                office or branch in each town. If your village isn’t listed, we may still be able to
                help.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button href={businessConfig.phoneHref} icon={Phone} size="lg">
                  Call {businessConfig.phoneDisplay}
                </Button>
                <Button to="/quote" variant="outline" size="lg">
                  Request a Quote
                </Button>
              </div>
              <p className="mt-6 text-sm text-steel">
                Or email{' '}
                <a href={businessConfig.emailHref} className="font-semibold text-electric underline-offset-4 hover:underline">
                  {businessConfig.email}
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
