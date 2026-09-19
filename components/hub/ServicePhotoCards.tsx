import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import AnimateIn from "@/components/AnimateIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { PHOTO_BY_SLUG, SERVICE_CARD_PHOTO } from "@/lib/media";
import { serviceHref } from "@/lib/services";
import type { ServiceContent, WorkPhoto } from "@/lib/types";

// The body of /services: one card per published service, urgent first, each led by a photograph
// of one of our own jobs. It replaced two stacked lists of text cards (owner, 19 Sept 2026:
// "very text heavy, needs more images or photos").
//
// The whole card is ONE anchor. A heading link plus a "read the page" link would be two tap
// targets doing the same thing, and a link inside a link is invalid markup, so the arrow below
// the blurb is a span that the card's own hover styles light up.
//
// The picture comes from that service's own proof set, so every tile is first-party work with
// its own alt text. Where two services lead with the same photograph, the second takes the next
// picture from its own list instead: two identical tiles side by side read as a bug.

interface Props {
  services: readonly ServiceContent[];
  eyebrow: string;
  heading: string;
}

function pickPhoto(service: ServiceContent, used: Set<string>): WorkPhoto | undefined {
  const own = service.proof.photos.filter((slug) => {
    const photo = PHOTO_BY_SLUG[slug];
    return Boolean(photo) && !photo.illustration;
  });
  const picked = SERVICE_CARD_PHOTO[service.slug];
  const chosen = (picked && PHOTO_BY_SLUG[picked] ? picked : undefined) ?? own.find((slug) => !used.has(slug)) ?? own[0];
  if (!chosen) return undefined;
  used.add(chosen);
  return PHOTO_BY_SLUG[chosen];
}

export default function ServicePhotoCards({ services, eyebrow, heading }: Props) {
  if (services.length === 0) return null;

  const used = new Set<string>();
  const cards = services.map((service) => ({ service, photo: pickPhoto(service, used) }));

  return (
    <section id="services" className="bg-paper">
      <div className="mx-auto max-w-content px-5 py-16 sm:px-8 md:py-20">
        <AnimateIn>
          <SectionHeading eyebrow={eyebrow} title={heading} />
        </AnimateIn>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {cards.map(({ service, photo }, i) => (
            <li key={service.slug}>
              <AnimateIn delay={i * 60} className="h-full">
                <a
                  href={serviceHref(service.slug)}
                  data-cta="nav"
                  data-cta-location="services_hub_cards"
                  data-cta-variant="text_link"
                  className="lift press group flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-card hover:border-tint-soft"
                >
                  {photo && (
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper-2">
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

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-tint">
                      {service.kind === "urgent" ? "Emergency" : "Booked visit"}
                    </p>

                    <h3 className="font-display text-[19px] font-bold leading-snug text-brand">
                      {service.navLabel}
                    </h3>

                    <p className="mt-2 text-[14.5px] leading-[1.6] text-slate">{service.cardBlurb}</p>

                    <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[14px] font-bold text-tint group-hover:underline group-hover:underline-offset-4">
                      Read the page <ArrowRight size={14} weight="bold" aria-hidden />
                    </span>
                  </div>
                </a>
              </AnimateIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
