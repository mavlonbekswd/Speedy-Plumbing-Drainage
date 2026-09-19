import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import AnimateIn from "@/components/AnimateIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { BOOKED_SERVICES, URGENT_SERVICES, serviceHref } from "@/lib/services";

// One card per published service, urgent first, because the person who cannot wait is the
// person this list is for. No illustrations and no icons: the card is the label and the blurb,
// and a picture of a tap tells a reader nothing the words do not.
//
// Published only. An unpublished leaf is a skeleton, and a link to it would 404.
export default function ServiceCards() {
  const services = [...URGENT_SERVICES, ...BOOKED_SERVICES];
  if (services.length === 0) return null;

  return (
    <section id="services" className="bg-paper">
      <div className="mx-auto max-w-content px-5 py-20 sm:px-8 md:py-28">
        <AnimateIn>
          <SectionHeading eyebrow="What we do" title="What do you need fixed?" />
        </AnimateIn>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {services.map((service, i) => (
            <AnimateIn key={service.slug} delay={i * 80} className="h-full">
              <article className="lift flex h-full flex-col gap-3 rounded-card border border-line bg-white p-6 shadow-card">
                <h3 className="font-display text-[19px] font-bold leading-tight text-brand">
                  <a
                    href={serviceHref(service.slug)}
                    data-cta="nav"
                    data-cta-location="home_services"
                    data-cta-variant="text_link"
                    className="hover:underline hover:underline-offset-4"
                  >
                    {service.navLabel}
                  </a>
                </h3>
                <p className="text-[14.5px] leading-[1.6] text-slate">{service.cardBlurb}</p>
                <a
                  href={serviceHref(service.slug)}
                  data-cta="nav"
                  data-cta-location="home_services"
                  data-cta-variant="text_link"
                  className="mt-auto inline-flex items-center gap-1.5 pt-3 text-[14px] font-bold text-tint"
                  aria-label={`${service.navLabel}: read the page`}
                >
                  Read the page <ArrowRight size={14} weight="bold" aria-hidden />
                </a>
              </article>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
