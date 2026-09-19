// /services. The hub a reader lands on when they know something is wrong but not what to call it.
//
// It is a signpost and nothing else: two groups, one card per published leaf, and the phone
// number for the person whose problem is not on either list. Nothing here reads the request, so
// the page is a static file.

import type { Metadata } from "next";
import { Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import Breadcrumb from "@/components/Breadcrumb";
import TickChips from "@/components/TickChips";
import BookingForm from "@/components/BookingForm";
import Button from "@/components/ui/Button";
import {
  ANSWERED_LINE,
  AVAILABILITY_LINE,
  BOOKED_WORK_LINE,
  COVERAGE_SHORT,
  PRICE_PROCESS_LINE,
} from "@/lib/claims";
import { BOOKED_SERVICES, URGENT_SERVICES, serviceHref } from "@/lib/services";
import { STATIC_ROUTE_BY_PATH } from "@/lib/routes";
import {
  CALL_HREF,
  CALL_NUMBER_DISPLAY,
  SITE_URL,
  TRADING_NAME,
  WHATSAPP_URL,
  openGraphFor,
} from "@/lib/site";
import type { ServiceContent } from "@/lib/types";

const PATH = "/services";

const TITLE = `Plumbing & Drainage Services | ${TRADING_NAME}`;

const DESCRIPTION = `Pick the page that matches your problem. Emergency and booked plumbing across ${COVERAGE_SHORT}. A plumber answers, day or night.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: openGraphFor({ path: PATH, title: TITLE, description: DESCRIPTION }),
  twitter: { card: "summary_large_image" },
};

/** A link is only offered when the page behind it is live, so no link here is ever a 404. */
function publishedHref(path: string): string | undefined {
  return STATIC_ROUTE_BY_PATH[path]?.published ? path : undefined;
}

/**
 * One group of cards. Renders nothing at all when the group is empty: a heading over an empty
 * grid is what a route list looks like mid-build, and the flags flip one page at a time.
 */
function ServiceGroup({
  heading,
  sub,
  services,
  tinted,
}: {
  heading: string;
  sub: string;
  services: readonly ServiceContent[];
  tinted: boolean;
}) {
  if (services.length === 0) return null;

  return (
    <section className={tinted ? "border-t border-line bg-paper-2" : "bg-paper"}>
      <div className="mx-auto max-w-content px-5 py-20 sm:px-8 md:py-28">
        <h2 className="font-display text-[clamp(28px,3.4vw,42px)] font-extrabold leading-[1.05] text-brand">
          {heading}
        </h2>
        <p className="mt-4 max-w-[58ch] text-[16.5px] leading-[1.6] text-slate">{sub}</p>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li key={service.slug}>
              <a
                href={serviceHref(service.slug)}
                data-cta="nav"
                data-cta-location="services_hub_cards"
                data-cta-variant="text_link"
                className="lift press flex h-full flex-col rounded-card border border-line bg-white p-6 shadow-card hover:border-tint-soft"
              >
                <h3 className="font-display text-[19px] font-bold leading-snug text-brand">
                  {service.navLabel}
                </h3>
                <p className="mt-2 max-w-[62ch] text-[15px] leading-[1.7] text-slate">
                  {service.cardBlurb}
                </p>
                <span className="mt-4 text-[14.5px] font-semibold text-tint underline underline-offset-4">
                  Read this page
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function ServicesHubPage() {
  return (
    <div className="has-callbar">
      <Header />

      <main id="main" tabIndex={-1} className="outline-none">
        <section className="bg-paper">
          <div className="mx-auto max-w-content px-5 pb-16 pt-10 sm:px-8 lg:px-12 lg:pb-20 lg:pt-14">
            <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Services" }]} className="mb-8" />

            <h1 className="max-w-[22ch] text-pretty font-display text-[clamp(34px,4.6vw,60px)] font-extrabold leading-[1.02] text-brand">
              Pick the page that matches your problem.
            </h1>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                as="a"
                href={CALL_HREF}
                variant="primary"
                size="xl"
                className="nums w-full sm:w-auto"
                data-cta="phone"
                data-cta-location="services_hub"
                data-cta-variant="primary_button"
              >
                <Phone size={20} weight="fill" aria-hidden />
                Call {CALL_NUMBER_DISPLAY}
              </Button>
              <Button
                as="a"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="whatsapp"
                size="xl"
                className="w-full sm:w-auto"
                data-cta="whatsapp"
                data-cta-location="services_hub"
                data-cta-variant="secondary_button"
              >
                <WhatsappLogo size={22} weight="fill" aria-hidden />
                WhatsApp us
              </Button>
            </div>

            <div className="mt-8 flex max-w-[58ch] flex-col gap-2 text-[16.5px] leading-[1.6] text-slate">
              <p>{PRICE_PROCESS_LINE}</p>
              <p>{ANSWERED_LINE}</p>
              <p>{AVAILABILITY_LINE}</p>
            </div>
          </div>
        </section>

        <TickChips guaranteeHref={publishedHref("/guarantee")} />

        <ServiceGroup
          heading="Needs someone now"
          sub="Water is moving and it should not be. Ring first, read second."
          services={URGENT_SERVICES}
          tinted={false}
        />

        <ServiceGroup
          heading="Booked for a time that suits you"
          sub={BOOKED_WORK_LINE}
          services={BOOKED_SERVICES}
          tinted
        />

        <section className="border-t border-line bg-paper">
          <div className="mx-auto max-w-content px-5 py-20 sm:px-8 md:py-28">
            <div className="rounded-card border border-line bg-white p-6 shadow-card sm:p-8">
              <h2 className="font-display text-[clamp(26px,3vw,36px)] font-extrabold leading-[1.05] text-brand">
                Not sure which it is?
              </h2>
              <p className="mt-3 max-w-[62ch] text-[16.5px] leading-[1.6] text-slate">
                Ring and describe it. A plumber answers, day or night, and tells you which page it
                is, or just books it.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  as="a"
                  href={CALL_HREF}
                  variant="primary"
                  size="lg"
                  className="nums w-full sm:w-auto"
                  data-cta="phone"
                  data-cta-location="services_hub_help"
                  data-cta-variant="primary_button"
                >
                  <Phone size={20} weight="fill" aria-hidden />
                  Call {CALL_NUMBER_DISPLAY}
                </Button>
                <Button
                  as="a"
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="whatsapp"
                  size="lg"
                  className="w-full sm:w-auto"
                  data-cta="whatsapp"
                  data-cta-location="services_hub_help"
                  data-cta-variant="secondary_button"
                >
                  <WhatsappLogo size={20} weight="fill" aria-hidden />
                  WhatsApp us
                </Button>
              </div>
            </div>
          </div>
        </section>

        <BookingForm heading="Ask us to ring you" formId="services_booking" />
      </main>

      <Footer />
      <MobileCallBar />
    </div>
  );
}
