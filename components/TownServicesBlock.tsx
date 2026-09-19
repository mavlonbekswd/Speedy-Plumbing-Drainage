import AnimateIn from "@/components/AnimateIn";
import PlainWords from "@/components/PlainWords";
import { serviceHref } from "@/lib/services";
import type { City, ServiceContent, ServiceSlug } from "@/lib/types";
import { placeOf } from "@/lib/towns";

interface Props {
  city: City;
  /** Published services to cross-link. Unpublished ones are dropped here as well. */
  services: readonly ServiceContent[];
  /** The pinned ad lines this town page must carry in visible text. */
  adLines: readonly string[];
  /** paper-2 with a hairline top, for alternating against the section above. */
  tinted?: boolean;
}

/** ServiceContent carries no group field, so the drains set is named here and nowhere else. */
const DRAINS_SLUGS: ReadonlySet<ServiceSlug> = new Set<ServiceSlug>([
  "drainage",
  "blocked-drains",
  "drain-cleaning",
]);

// The rest of what we do in this town: one compact card per service, each with the town note
// that belongs to it, so the cross-links say something local rather than repeating the service
// page's own opening line.
export default function TownServicesBlock({ city, services, adLines, tinted = true }: Props) {
  const shown = services.filter((service) => service.published);
  if (shown.length === 0) return null;

  return (
    <section id="more-in-town" className={tinted ? "border-t border-line bg-paper-2" : "bg-paper"}>
      <div className="mx-auto max-w-content px-5 py-20 sm:px-8 md:py-28">
        <AnimateIn>
          <h2 className="text-pretty font-display text-[clamp(24px,2.8vw,34px)] font-extrabold leading-[1.1] text-brand">
            More plumbing in {placeOf(city)}
          </h2>
        </AnimateIn>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((service, i) => {
            const note = DRAINS_SLUGS.has(service.slug)
              ? city.serviceNotes.drains
              : service.kind === "booked"
                ? city.serviceNotes.booked
                : undefined;
            return (
              <li key={service.slug} className="h-full">
                <AnimateIn
                  delay={i * 60}
                  className="flex h-full flex-col rounded-card border border-line bg-white p-5 shadow-card"
                >
                  <h3 className="font-display text-[17px] font-bold leading-snug">
                    <a
                      href={serviceHref(service.slug)}
                      data-cta="nav"
                      data-cta-location="town_services"
                      data-cta-variant="text_link"
                      className="inline-flex min-h-[44px] items-center text-brand underline-offset-4 hover:underline"
                    >
                      {service.navLabel}
                    </a>
                  </h3>
                  <p className="mt-1 max-w-[58ch] text-[14.5px] leading-[1.6] text-slate">{service.townLine}</p>
                  {note && <p className="mt-2 max-w-[58ch] text-[14.5px] leading-[1.6] text-slate">{note}</p>}
                </AnimateIn>
              </li>
            );
          })}
        </ul>

        <div className="mt-10">
          <PlainWords lines={adLines} />
        </div>
      </div>
    </section>
  );
}
