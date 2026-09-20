// /services. The hub a reader lands on when they know something is wrong but not what to call it.
//
// It is a signpost: one photo card per published leaf, urgent first, and the phone number for
// the person whose problem is not on the list. The prose it used to carry was the owner's
// complaint of 19 September 2026 ("very text heavy, needs more images or photos"), so the
// pictures are our own jobs and the words are the service name and one line about it.
//
// The one form on the page is the callback card in the hero aside, the same card the home page
// and every service page carry, so the three page types a visitor actually lands on offer the
// same three ways to reach us. It sits after the telephone link in DOM order.
//
// Nothing here reads the request, so the page is a static file.

import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import Breadcrumb from "@/components/Breadcrumb";
import TickChips from "@/components/TickChips";
import ServiceFAQ from "@/components/ServiceFAQ";
import FAQSchema from "@/components/FAQSchema";
import ClosingBand from "@/components/ClosingBand";
import CallbackInline from "@/components/CallbackInline";
import HubHero from "@/components/hub/HubHero";
import ServicePhotoCards from "@/components/hub/ServicePhotoCards";
import {
  AVAILABILITY_LINE,
  COVERAGE_SHORT,
  DEFAULT_CTA_BAND,
  PRICE_FACT_LINE,
} from "@/lib/claims";
import { SERVICES_HUB_FAQS } from "@/lib/faqs";
import { BOOKED_SERVICES, URGENT_SERVICES } from "@/lib/services";
import { STATIC_ROUTE_BY_PATH } from "@/lib/routes";
import {
  CALL_HREF,
  CALL_NUMBER_DISPLAY,
  SITE_URL,
  TRADING_NAME,
  openGraphFor,
} from "@/lib/site";

const PATH = "/services";

const TITLE = `Plumbing & Drainage Services | ${TRADING_NAME}`;

const DESCRIPTION = `Pick the service for your problem. Emergency and booked plumbing across ${COVERAGE_SHORT}. A plumber answers, day or night.`;

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

/** Urgent first: the person who cannot wait is the person this list is for. */
const SERVICES_IN_ORDER = [...URGENT_SERVICES, ...BOOKED_SERVICES];


export default function ServicesHubPage() {
  return (
    <div className="has-callbar">
      <FAQSchema faqs={SERVICES_HUB_FAQS} />
      <Header />

      <main id="main" tabIndex={-1} className="outline-none">
        <HubHero
          image="services"
          crumbs={<Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Services" }]} />}
          eyebrow="What we do"
          h1="Pick the service for your problem."
          facts={[PRICE_FACT_LINE, AVAILABILITY_LINE]}
          ctaLocation="services_hub"
          // The same card the home page and every service page carry, so the three page types a
          // visitor actually lands on offer the same third option. It sits after the telephone
          // link in DOM order and has no `service`: this hub covers all of them.
          aside={<CallbackInline formId="services_hero" idPrefix="services_hero" />}
        />

        <TickChips part="figures" />

        <ServicePhotoCards
          services={SERVICES_IN_ORDER}
          eyebrow="Every job we take"
          heading="Emergencies first, then booked work."
        />

        {/* The one line for the reader whose problem is on neither card. It sends them to the
            phone, because describing it out loud takes ten seconds and reading nine cards does
            not. The callback link is third, after the number, as it is everywhere else. */}
        <section className="border-t border-line bg-paper-2">
          <div className="mx-auto max-w-content px-5 py-10 sm:px-8 md:py-12">
            <p className="mx-auto max-w-[62ch] text-center text-[16.5px] leading-[1.6] text-slate">
              Not sure which one? Ring{" "}
              <a
                href={CALL_HREF}
                data-cta="phone"
                data-cta-location="services_hub_help"
                data-cta-variant="text_link"
                className="nums font-semibold text-brand underline underline-offset-4"
              >
                {CALL_NUMBER_DISPLAY}
              </a>{" "}
              and say what is happening. Or{" "}
              <a
                href="/contact#book"
                data-cta="book_anchor"
                data-cta-location="services_hub_help"
                data-cta-variant="text_link"
                className="font-semibold text-brand underline underline-offset-4"
              >
                ask us to ring you
              </a>
              .
            </p>
          </div>
        </section>

        <div id="faq">
          <ServiceFAQ faqs={SERVICES_HUB_FAQS} />
        </div>

        <TickChips part="ticks" guaranteeHref={publishedHref("/guarantee")} />

        <ClosingBand heading={DEFAULT_CTA_BAND.heading} sub={DEFAULT_CTA_BAND.sub} />
      </main>

      <Footer />
      <MobileCallBar />
    </div>
  );
}
