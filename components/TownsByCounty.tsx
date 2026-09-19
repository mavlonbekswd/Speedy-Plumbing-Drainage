import AnimateIn from "@/components/AnimateIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { COVERAGE_LINE } from "@/lib/claims";
import { COUNTY_ORDER, TOWNS_BY_COUNTY, townHref } from "@/lib/towns";

interface Props {
  heading?: string;
  /** paper-2 with a hairline top, for alternating against the section above. */
  tinted?: boolean;
}

// Where we work, grouped by county, on a service page. Plain anchors in the server HTML: these
// are the internal links that make the town pages reachable, so they are never behind a script
// or an accordion summary.
//
// Only published Tier 1 towns appear. TOWNS_BY_COUNTY already filters them, so an unpublished
// or organic-only town cannot be offered here as coverage.
export default function TownsByCounty({ heading = "Towns we cover.", tinted = false }: Props) {
  const counties = COUNTY_ORDER.filter((county) => TOWNS_BY_COUNTY[county].length > 0);
  if (counties.length === 0) return null;

  return (
    <section id="areas" className={tinted ? "border-t border-line bg-paper-2" : "bg-paper"}>
      <div className="mx-auto max-w-content px-5 py-20 sm:px-8 md:py-28">
        <AnimateIn>
          <SectionHeading eyebrow="Where we work" title={heading} />
        </AnimateIn>

        <div className="mt-10 flex flex-col gap-8">
          {counties.map((county, i) => (
            <AnimateIn key={county} delay={i * 60}>
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-tint">{county}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {TOWNS_BY_COUNTY[county].map((town) => (
                  <li key={town.slug}>
                    <a
                      href={townHref(town.slug)}
                      data-cta="nav"
                      data-cta-location="service_areas"
                      data-cta-variant="chip"
                      className="press inline-flex min-h-[44px] items-center rounded-chip border border-line bg-white px-4 text-[14.5px] font-semibold text-brand hover:border-tint"
                    >
                      {town.name}
                    </a>
                  </li>
                ))}
              </ul>
            </AnimateIn>
          ))}
        </div>

        <p className="mt-8 max-w-[62ch] text-[15px] leading-[1.7] text-slate">{COVERAGE_LINE}</p>
      </div>
    </section>
  );
}
