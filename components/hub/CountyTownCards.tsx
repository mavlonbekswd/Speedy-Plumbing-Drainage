import type { ReactNode } from "react";
import AnimateIn from "@/components/AnimateIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { COUNTY_ORDER, TOWNS_BY_COUNTY, townHref } from "@/lib/towns";

// The coverage list on /areas-we-cover: one card per county, the towns inside it as chips.
//
// It replaced seven stacked lists, each town in a bordered box with its postcode districts
// printed beside it (owner, 19 Sept 2026: "do not show postcodes, instead show cities and
// towns"). The districts have not gone anywhere: they are what the postcode checker at the top
// of the page answers from, which is where a customer wants them, typed once and answered.
//
// Plain anchors in the server HTML. These are the links that make the town pages reachable, so
// they are never behind a script or a disclosure.
//
// Published Tier 1 towns only. TOWNS_BY_COUNTY filters them, so an unpublished town and a town
// whose own districts we do not work in cannot be offered here as coverage.

interface Props {
  eyebrow: string;
  heading: string;
  /** paper-2 with a hairline top, for alternating against the section above. */
  tinted?: boolean;
  /** The honest note about the towns we work around rather than in. */
  children?: ReactNode;
}

export default function CountyTownCards({ eyebrow, heading, tinted = false, children }: Props) {
  const counties = COUNTY_ORDER.filter((county) => TOWNS_BY_COUNTY[county].length > 0);
  if (counties.length === 0) return null;

  return (
    <section id="areas" className={tinted ? "border-t border-line bg-paper-2" : "bg-paper"}>
      <div className="mx-auto max-w-content px-5 py-14 sm:px-8 md:py-20">
        <AnimateIn>
          <SectionHeading eyebrow={eyebrow} title={heading} />
        </AnimateIn>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {counties.map((county, i) => {
            const towns = TOWNS_BY_COUNTY[county];
            return (
              <li key={county}>
                <AnimateIn delay={i * 60} className="h-full">
                  <div className="flex h-full flex-col rounded-card border border-line bg-white p-6 shadow-card">
                    <h3 className="font-display text-[19px] font-bold leading-snug text-brand">{county}</h3>
                    <p className="nums mt-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-steel">
                      {towns.length} {towns.length === 1 ? "town" : "towns"}
                    </p>

                    <ul className="mt-4 flex flex-wrap gap-2">
                      {towns.map((town) => (
                        <li key={town.slug}>
                          <a
                            href={townHref(town.slug)}
                            data-cta="nav"
                            data-cta-location="areas_index_towns"
                            data-cta-variant="chip"
                            className="press inline-flex min-h-[44px] items-center rounded-chip border border-line bg-paper px-4 text-[15px] font-semibold text-brand hover:border-tint"
                          >
                            {town.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimateIn>
              </li>
            );
          })}
        </ul>

        {children}
      </div>
    </section>
  );
}
