import AnimateIn from "@/components/AnimateIn";
import { serviceHref } from "@/lib/services";
import type { City, ServiceContent, ServiceSlug } from "@/lib/types";
import { placeOf } from "@/lib/towns";

interface Props {
  city: City;
  /** Published services to cross-link. Unpublished ones are dropped here as well. */
  services: readonly ServiceContent[];
  /**
   * The pinned descriptions of the two Emergency ads, VERBATIM. They sit with the emergency
   * cross-link because that is the promise an emergency keyword was bought against. One reads
   * above the cards and one below them, so two lines that both say "A plumber answers, day or
   * night" never sit side by side. See lib/claims.ts.
   */
  emergencyLines: readonly string[];
  /** The pinned descriptions of the two Drain Cleaning ads, VERBATIM, with the drains cards. */
  drainLines: readonly string[];
  /** paper-2 with a hairline top, for alternating against the section above. */
  tinted?: boolean;
}

/** ServiceContent carries no group field, so the drains set is named here and nowhere else. */
const DRAINS_SLUGS: ReadonlySet<ServiceSlug> = new Set<ServiceSlug>([
  "drainage",
  "blocked-drains",
  "drain-cleaning",
]);

/** The town note that belongs to a given service card. */
function noteFor(city: City, service: ServiceContent): string | undefined {
  if (DRAINS_SLUGS.has(service.slug)) return city.serviceNotes.drains;
  return service.kind === "booked" ? city.serviceNotes.booked : undefined;
}

// The rest of what we do in this town, in three groups rather than one long grid: what cannot
// wait, the drains, and the work you book a time for. Each card carries the town note that
// belongs to it, so the cross-links say something local instead of repeating the service page's
// opening line, and the two ad groups that buy town keywords get their pinned lines read in the
// part of the section they were written about.
export default function TownServicesBlock({
  city,
  services,
  emergencyLines,
  drainLines,
  tinted = true,
}: Props) {
  const shown = services.filter((service) => service.published);
  if (shown.length === 0) return null;

  const place = placeOf(city);

  const groups = [
    {
      key: "emergency",
      title: "When it cannot wait",
      items: shown.filter((s) => s.kind === "urgent" && !DRAINS_SLUGS.has(s.slug)),
      lines: emergencyLines,
    },
    {
      key: "drains",
      title: "Drains",
      items: shown.filter((s) => DRAINS_SLUGS.has(s.slug)),
      lines: drainLines,
    },
    {
      key: "booked",
      title: "Work you book a time for",
      items: shown.filter((s) => s.kind === "booked" && !DRAINS_SLUGS.has(s.slug)),
      lines: [] as readonly string[],
    },
  ].filter((group) => group.items.length > 0 || group.lines.length > 0);

  return (
    <section id="more-in-town" className={tinted ? "border-t border-line bg-paper-2" : "bg-paper"}>
      <div className="mx-auto max-w-content px-5 py-14 sm:px-8 md:py-20">
        <AnimateIn>
          <h2 className="text-pretty font-display text-[clamp(24px,2.8vw,34px)] font-extrabold leading-[1.1] text-brand">
            More plumbing in {place}
          </h2>
        </AnimateIn>

        <div className="mt-8 flex flex-col gap-10">
          {groups.map((group) => {
            // The first line leads the group and the second closes it, with the cards between
            // them. Anything beyond two joins the closing lines, so no pinned line is dropped.
            const [lead, ...rest] = group.lines;
            return (
              <div key={group.key}>
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-tint">{group.title}</h3>

                {/* Outside the reveal wrapper: a sentence an ad paid for may not wait on a
                    script, and one <p> per string keeps each one a single text node. */}
                {lead && <p className="mt-3 max-w-[62ch] text-[16px] leading-[1.65] text-slate">{lead}</p>}

                {group.items.length > 0 && (
                  // A single card goes full width rather than sitting in a three-up grid with two
                  // empty cells beside it, which also puts the group's two lines further apart.
                  <ul
                    className={`mt-4 grid gap-4 ${
                      group.items.length > 1 ? "sm:grid-cols-2 lg:grid-cols-3" : ""
                    }`}
                  >
                    {group.items.map((service, i) => {
                      const note = noteFor(city, service);
                      return (
                        <li key={service.slug} className="h-full">
                          <AnimateIn
                            delay={i * 60}
                            className="flex h-full flex-col rounded-card border border-line bg-white p-5 shadow-card"
                          >
                            <h4 className="font-display text-[17px] font-bold leading-snug">
                              <a
                                href={serviceHref(service.slug)}
                                data-cta="nav"
                                data-cta-location="town_services"
                                data-cta-variant="text_link"
                                className="inline-flex min-h-[44px] items-center text-brand underline-offset-4 hover:underline"
                              >
                                {service.navLabel}
                              </a>
                            </h4>
                            <p className="mt-1 max-w-[58ch] text-[14.5px] leading-[1.6] text-slate">
                              {service.townLine}
                            </p>
                            {note && (
                              <p className="mt-2 max-w-[58ch] text-[14.5px] leading-[1.6] text-slate">{note}</p>
                            )}
                          </AnimateIn>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {rest.map((line) => (
                  <p key={line} className="mt-4 max-w-[62ch] text-[16px] leading-[1.65] text-slate">
                    {line}
                  </p>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
