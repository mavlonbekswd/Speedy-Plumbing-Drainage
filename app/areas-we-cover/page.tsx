// /areas-we-cover. The coverage index, and the only page on the site that links to the organic
// town pages, so those links are built from the data rather than hand-listed.
//
// Owner, 19 September 2026: no postcode district is printed anywhere on this page. The districts
// are still the truth behind it, and the checker under the hero is where a customer meets them:
// they type their own postcode once and get a yes or no. What the page shows is towns.
//
// Nothing here prints a place name that is not a town leaf, because a page that claims a place
// the ad account excludes puts the site and the account in contradiction. Nothing reads the
// request, so the page is a static file.

import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import Breadcrumb from "@/components/Breadcrumb";
import PostcodeCheck from "@/components/PostcodeCheck";
import BookingForm from "@/components/BookingForm";
import ProofStrip from "@/components/ProofStrip";
import ServiceFAQ from "@/components/ServiceFAQ";
import FAQSchema from "@/components/FAQSchema";
import ClosingBand from "@/components/ClosingBand";
import SectionHeading from "@/components/ui/SectionHeading";
import HubHero from "@/components/hub/HubHero";
import CountyTownCards from "@/components/hub/CountyTownCards";
import {
  ARRIVAL_LINE,
  AVAILABILITY_LINE,
  COVERAGE_LINE,
  DEFAULT_CTA_BAND,
  FORM_COPY,
  PRICE_PROCESS_LINE,
} from "@/lib/claims";
import { AREAS_FAQS } from "@/lib/faqs";
import { FEATURED_PHOTO_SLUGS } from "@/lib/media";
import { TOWNS, placeOf, townHref } from "@/lib/towns";
import { SITE_URL, TRADING_NAME, openGraphFor } from "@/lib/site";

const PATH = "/areas-we-cover";

const TITLE = `Areas We Cover | Plumber and Drains | ${TRADING_NAME}`;

const DESCRIPTION =
  "The towns we work in, county by county, each with its own page. Check your postcode for a straight yes or no, then ring a plumber.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: openGraphFor({ path: PATH, title: TITLE, description: DESCRIPTION }),
  twitter: { card: "summary_large_image" },
};

/**
 * The organic pages. They are reachable from here and from nowhere else, so the list is derived
 * and the group appears the day a flag flips rather than the day someone remembers this file.
 * Their own districts are excluded in the ad account, so each one is named by its placeLabel
 * ("the villages around Peterborough") and never as a town we cover.
 */
const ORGANIC_TOWNS = TOWNS.filter((town) => town.tier === "organic" && town.published);

/** Three of our own jobs, enough to break the list up without turning the page into a gallery. */
const AREA_PHOTOS = FEATURED_PHOTO_SLUGS.slice(0, 3);

export default function AreasWeCoverPage() {
  return (
    <div className="has-callbar">
      <FAQSchema faqs={AREAS_FAQS} />
      <Header />

      <main id="main" tabIndex={-1} className="outline-none">
        <HubHero
          image="areas"
          crumbs={
            <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Areas we cover" }]} />
          }
          eyebrow="Where we work"
          h1="Areas we cover."
          facts={[PRICE_PROCESS_LINE, ARRIVAL_LINE, AVAILABILITY_LINE]}
          sub={COVERAGE_LINE}
          ctaLocation="areas_index"
        />

        {/* Directly under the hero, because it is the question this page exists to answer and
            the only place a postcode belongs: the customer types their own and gets a verdict. */}
        <section className="border-t border-line bg-paper-2">
          <div className="mx-auto max-w-content px-5 py-10 sm:px-8 md:py-12">
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
              <SectionHeading
                eyebrow="One check"
                title="Do we cover you?"
                sub="Type your postcode and get a straight yes or no."
              />
              <PostcodeCheck />
            </div>
          </div>
        </section>

        <CountyTownCards eyebrow="Town by town" heading="The towns we work in.">
          {ORGANIC_TOWNS.length > 0 && (
            <div className="mt-10 border-t border-line pt-8">
              <p className="max-w-[62ch] text-[15px] leading-[1.7] text-slate">
                We work in the villages around these three towns, not in the town centres.
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {ORGANIC_TOWNS.map((town) => (
                  <li key={town.slug}>
                    <a
                      href={townHref(town.slug)}
                      data-cta="nav"
                      data-cta-location="areas_index_organic"
                      data-cta-variant="chip"
                      className="press inline-flex min-h-[44px] items-center rounded-chip border border-line bg-white px-4 text-[15px] font-semibold text-brand hover:border-tint"
                    >
                      {placeOf(town)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CountyTownCards>

        <ProofStrip photoSlugs={AREA_PHOTOS} tinted />

        <div id="faq">
          <ServiceFAQ faqs={AREAS_FAQS} />
        </div>

        <BookingForm heading={FORM_COPY.full.heading} formId="areas_booking" />

        <ClosingBand heading={DEFAULT_CTA_BAND.heading} sub={DEFAULT_CTA_BAND.sub} />
      </main>

      <Footer />
      <MobileCallBar />
    </div>
  );
}
