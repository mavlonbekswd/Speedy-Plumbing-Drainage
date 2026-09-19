import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import AnimateIn from "@/components/AnimateIn";
import SectionHeading from "@/components/ui/SectionHeading";
import PostcodeCheck from "@/components/PostcodeCheck";
import { COVERAGE_LINE } from "@/lib/claims";
import { COUNTY_ORDER, TOWNS_BY_COUNTY, townHref } from "@/lib/towns";
import { STATIC_ROUTE_BY_PATH } from "@/lib/routes";

// The coverage band: what we cover, the postcode check that answers it without a lead, and
// every town page one tap away.
//
// The town list is folded into a native <details> rather than cut, because each chip is still
// an <a> in the served HTML whether the fold is open or shut, and that is what keeps every town
// page within two clicks of home for a crawler that runs no script.
//
// Published Tier 1 towns only: TOWNS_BY_COUNTY already filters them, so an unpublished or
// organic-only town can never be offered here as coverage.
export default function WhereWeWork() {
  const counties = COUNTY_ORDER.filter((county) => TOWNS_BY_COUNTY[county].length > 0);
  const areasHubPublished = STATIC_ROUTE_BY_PATH["/areas-we-cover"]?.published === true;

  return (
    <section id="areas" className="bg-brand">
      <div className="mx-auto grid max-w-content items-start gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 md:py-24">
        <AnimateIn>
          <SectionHeading eyebrow="Where we work" title="Where we work." sub={COVERAGE_LINE} dark />

          {counties.length > 0 && (
            <details className="group mt-8">
              <summary className="press inline-flex min-h-[46px] cursor-pointer list-none select-none items-center gap-2 rounded-pill border border-white/25 bg-white/10 px-5 text-[14.5px] font-bold text-white [&::-webkit-details-marker]:hidden">
                See every town
                <CaretDown size={15} weight="bold" className="transition-transform group-open:rotate-180" aria-hidden />
              </summary>

              <div className="mt-6 flex flex-col gap-5">
                {counties.map((county) => (
                  <div key={county}>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
                      {county}
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {TOWNS_BY_COUNTY[county].map((town) => (
                        <li key={town.slug}>
                          <a
                            href={townHref(town.slug)}
                            data-cta="nav"
                            data-cta-location="where_we_work"
                            data-cta-variant="chip"
                            className="press inline-flex min-h-[44px] items-center rounded-chip bg-white/10 px-4 text-[14px] font-semibold text-white hover:bg-white hover:text-brand"
                          >
                            {town.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </details>
          )}

          {areasHubPublished && (
            <p className="mt-6 text-[15px] leading-[1.6] text-white/80">
              <a
                href="/areas-we-cover"
                data-cta="nav"
                data-cta-location="where_we_work"
                data-cta-variant="text_link"
                className="font-bold text-white underline underline-offset-4"
              >
                See the areas we cover
              </a>
            </p>
          )}
        </AnimateIn>

        <AnimateIn delay={120} className="lg:sticky lg:top-24">
          <PostcodeCheck variant="dark" />
        </AnimateIn>
      </div>
    </section>
  );
}
