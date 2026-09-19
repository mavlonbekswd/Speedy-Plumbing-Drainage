import Image from "next/image";
import AnimateIn from "@/components/AnimateIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { BOOKED_SERVICES, URGENT_SERVICES, serviceHref } from "@/lib/services";
import { PHOTO_BY_SLUG, SERVICE_CARD_PHOTO } from "@/lib/media";
import type { WorkPhoto } from "@/lib/types";

// One card per published service, urgent first, because the person who cannot wait is the
// person this list is for.
//
// Each card now carries a REAL photograph of that kind of job, taken from the service's own
// `proof.photos` in content/services/*. Owner review, 19 September 2026: the site is too text
// heavy, and this is the first block of reading matter a visitor meets, so it is the right place
// to put pictures of our own work rather than more words. The photograph is first-party, its alt
// text comes from lib/media.ts and is never rewritten, and nothing is captioned as a job in a
// place a caption could be read as a claim about this customer's job.
//
// The whole card is the tap target: the heading's anchor is stretched over the card with a
// pseudo-element, so one link per card replaces the heading link plus a "Read the page" line.
//
// Published only. An unpublished leaf is a skeleton, and a link to it would 404.
export default function ServiceCards() {
  const services = [...URGENT_SERVICES, ...BOOKED_SERVICES];
  if (services.length === 0) return null;

  // Services share proof photos, so the first unused slug is preferred over the first slug: nine
  // cards showing the same open manhole twice reads as one photograph, not as nine jobs.
  const used = new Set<string>();
  const cards = services.map((service) => {
    const picked = SERVICE_CARD_PHOTO[service.slug];
    const slug =
      (picked && PHOTO_BY_SLUG[picked] ? picked : undefined) ??
      service.proof.photos.find((s) => PHOTO_BY_SLUG[s] && !used.has(s)) ??
      service.proof.photos[0];
    const photo: WorkPhoto | undefined = slug ? PHOTO_BY_SLUG[slug] : undefined;
    if (photo && !photo.illustration) {
      used.add(photo.slug);
      return { service, photo };
    }
    return { service, photo: undefined };
  });

  return (
    <section id="services" className="bg-paper">
      <div className="mx-auto max-w-content px-5 py-20 sm:px-8 md:py-28">
        <AnimateIn>
          <SectionHeading eyebrow="What we do" title="What do you need fixed?" />
        </AnimateIn>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {cards.map(({ service, photo }, i) => (
            <AnimateIn key={service.slug} delay={i * 80} className="h-full">
              <article className="lift relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-card">
                {photo && (
                  <div className="aspect-[16/10] overflow-hidden bg-paper-2">
                    <Image
                      src={photo.file}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col gap-2 p-6">
                  <h3 className="font-display text-[19px] font-bold leading-tight text-brand">
                    <a
                      href={serviceHref(service.slug)}
                      data-cta="nav"
                      data-cta-location="home_services"
                      data-cta-variant="text_link"
                      className="after:absolute after:inset-0 hover:underline hover:underline-offset-4"
                    >
                      {service.navLabel}
                    </a>
                  </h3>
                  <p className="text-[14.5px] leading-[1.6] text-slate">{service.cardBlurb}</p>
                </div>
              </article>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
