import type { ReactNode } from "react";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import AnimateIn from "@/components/AnimateIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { COVERAGE_LINE } from "@/lib/claims";
import { COUNTY_ORDER, TOWNS_BY_COUNTY, townHref } from "@/lib/towns";

interface Props {
  heading?: string;
  /** paper-2 with a hairline top, for alternating against the section above. */
  tinted?: boolean;
  /**
   * Put the whole chip list inside a native `<details>`, closed, with a shorter section rhythm.
   *
   * Added 19 September 2026 for the ad landing pages only: at 390px the open list measured about
   * 1,900px, which is a screen and a half of town names between the booking form and the FAQ on
   * a page the reader came to for one job. OPT-IN, and nothing about the default changes.
   *
   * Safe for discovery, and that is the load-bearing bit rather than an opinion: every anchor is
   * still in the served HTML, and tests/link-graph.spec.ts reads hrefs with `internalHrefs`,
   * which strips `<script>` blocks and then matches `<a href>` in the remaining markup with no
   * regard for whether the element is displayed. No pinned ad line and no MUST_RENDER sentence
   * lives in this section, so the stricter ad-to-page instrument is untouched as well.
   */
  collapsible?: boolean;
}

// Where we work, grouped by county, on a service page. Plain anchors in the server HTML: these
// are the internal links that make the town pages reachable, so they are never behind a script.
//
// Only published Tier 1 towns appear. TOWNS_BY_COUNTY already filters them, so an unpublished
// or organic-only town cannot be offered here as coverage.
export default function TownsByCounty({ heading = "Towns we cover.", tinted = false, collapsible = false }: Props) {
  const counties = COUNTY_ORDER.filter((county) => TOWNS_BY_COUNTY[county].length > 0);
  if (counties.length === 0) return null;

  // Counted from the data, never typed into the copy: a town publishing tomorrow must not leave
  // the summary promising a number the list does not contain.
  const total = counties.reduce((sum, county) => sum + TOWNS_BY_COUNTY[county].length, 0);

  const countyList = (wrap: (node: ReactNode, key: string, index: number) => ReactNode) =>
    counties.map((county, i) =>
      wrap(
        <>
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-tint">{county}</h3>
          <ul className={`flex flex-wrap gap-2 ${collapsible ? "mt-2.5" : "mt-3"}`}>
            {TOWNS_BY_COUNTY[county].map((town) => (
              <li key={town.slug}>
                <a
                  href={townHref(town.slug)}
                  data-cta="nav"
                  data-cta-location="service_areas"
                  data-cta-variant="chip"
                  className={`press inline-flex min-h-[44px] items-center rounded-chip border border-line bg-white font-semibold text-brand hover:border-tint ${
                    collapsible ? "px-3.5 text-[14px] sm:px-4 sm:text-[15px]" : "px-4 text-[15px]"
                  }`}
                >
                  {town.name}
                </a>
              </li>
            ))}
          </ul>
        </>,
        county,
        i,
      ),
    );

  return (
    <section id="areas" className={tinted ? "border-t border-line bg-paper-2" : "bg-paper"}>
      <div
        className={`mx-auto max-w-content px-5 sm:px-8 ${
          collapsible ? "py-10 sm:py-14 md:py-20" : "py-14 md:py-20"
        }`}
      >
        <AnimateIn>
          <SectionHeading eyebrow="Where we work" title={heading} />
        </AnimateIn>

        {collapsible ? (
          // No reveal wrapper inside the disclosure: a closed <details> gives its children no box,
          // so an IntersectionObserver would never see them come into view.
          <details className="mt-6 rounded-card border border-line bg-white">
            <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 font-display text-[16px] font-bold text-brand [&::-webkit-details-marker]:hidden">
              <span>
                See all <span className="nums">{total}</span> towns
              </span>
              <CaretDown size={18} weight="bold" className="flex-shrink-0 text-tint" aria-hidden />
            </summary>
            <div className="flex flex-col gap-6 border-t border-line px-4 py-5">
              {countyList((node, key) => (
                <div key={key}>{node}</div>
              ))}
            </div>
          </details>
        ) : (
          <div className="mt-10 flex flex-col gap-8">
            {countyList((node, key, i) => (
              <AnimateIn key={key} delay={i * 60}>
                {node}
              </AnimateIn>
            ))}
          </div>
        )}

        <p
          className={`max-w-[62ch] leading-[1.7] text-slate ${
            collapsible ? "mt-6 text-[14.5px] sm:text-[15px]" : "mt-8 text-[15px]"
          }`}
        >
          {COVERAGE_LINE}
        </p>
      </div>
    </section>
  );
}
