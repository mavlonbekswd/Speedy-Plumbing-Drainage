import AnimateIn from "@/components/AnimateIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { placeOf, TOWN_BY_SLUG, townHref } from "@/lib/towns";
import type { City } from "@/lib/types";

interface Props {
  city: City;
  /** paper-2 with a hairline top, for alternating against the section above. */
  tinted?: boolean;
  /** Shorter vertical rhythm on a phone, for the town template. Opt-in: the default is unchanged. */
  compact?: boolean;
}

// Where in this town we work. Scannable first: the postcode districts, then the area names, then
// the two sourced notes. Every name here is verified in the town leaf against a source, and it
// all renders as plain DOM so a crawler and a text audit see the same words the reader does.
export default function TownAreaBlock({ city, tinted = false, compact = false }: Props) {
  const nearby = (city.nearbyTowns ?? [])
    .map((slug) => TOWN_BY_SLUG[slug])
    // Tier 1 only. The heading over these chips says "Also covering", and the organic towns
    // (King's Lynn, Peterborough, Bedford) sit beside districts the ad account excludes: a chip
    // reading "Peterborough" under that heading would be the coverage claim the exclusions forbid.
    // Organic pages get their inbound links from /areas-we-cover instead.
    .filter((town) => Boolean(town) && town.published && town.tier === 1);

  return (
    <section id="areas" className={tinted ? "border-t border-line bg-paper-2" : "bg-paper"}>
      <div
        className={`mx-auto max-w-content px-5 sm:px-8 ${compact ? "py-10 sm:py-14 md:py-20" : "py-14 md:py-20"}`}
      >
        <AnimateIn>
          <SectionHeading eyebrow="Where we work" title={`Where in ${placeOf(city)} we work.`} sub={city.blurb || undefined} />

          <p className="mt-6 text-[15px] font-semibold text-brand">
            Postcode districts we cover here: {city.postcodeDistricts.join(", ")}.
          </p>

          <ul className="mt-3 flex flex-wrap gap-2">
            {city.nearbyAreas.map((area) => (
              <li
                key={area}
                className="inline-flex items-center rounded-chip border border-line bg-white px-3 py-1.5 text-[13.5px] font-medium text-brand"
              >
                {area}
              </li>
            ))}
          </ul>

          <div className="mt-8 grid gap-x-10 gap-y-3 md:grid-cols-2">
            <p className="max-w-[58ch] text-[14.5px] leading-[1.65] text-slate">{city.localNote}</p>
            <p className="max-w-[58ch] text-[14.5px] leading-[1.65] text-slate">{city.serviceNotes.emergency}</p>
          </div>
        </AnimateIn>

        {nearby.length > 0 && (
          <AnimateIn delay={80}>
            <h3 className="mt-10 text-[13px] font-semibold uppercase tracking-[0.16em] text-tint">
              Also covering nearby areas
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {nearby.map((town) => (
                <li key={town.slug}>
                  <a
                    href={townHref(town.slug)}
                    data-cta="nav"
                    data-cta-location="nearby_areas"
                    data-cta-variant="chip"
                    className="press inline-flex min-h-[44px] items-center rounded-chip border border-line bg-white px-4 text-[15px] font-semibold text-brand hover:border-tint"
                  >
                    {town.name}
                  </a>
                </li>
              ))}
            </ul>
          </AnimateIn>
        )}
      </div>
    </section>
  );
}
