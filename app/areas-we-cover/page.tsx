// /areas-we-cover. The coverage index, and the only page on the site that links to the organic
// town pages, so those links are built from the data rather than hand-listed.
//
// Nothing here prints a place name that is not a town leaf or a district that is not in
// lib/coverage.ts, because a page that claims a district the ad account excludes puts the site
// and the account in contradiction. Nothing reads the request, so the page is a static file.

import type { Metadata } from "next";
import { Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import Breadcrumb from "@/components/Breadcrumb";
import PostcodeCheck from "@/components/PostcodeCheck";
import BookingForm from "@/components/BookingForm";
import Button from "@/components/ui/Button";
import {
  ARRIVAL_LINE,
  AVAILABILITY_LINE,
  COVERAGE_LINE,
  PRICE_PROCESS_LINE,
} from "@/lib/claims";
import { COUNTY_ORDER, TOWNS, TOWNS_BY_COUNTY, placeOf, townHref } from "@/lib/towns";
import {
  CALL_HREF,
  CALL_NUMBER_DISPLAY,
  SITE_URL,
  TRADING_NAME,
  WHATSAPP_URL,
  openGraphFor,
} from "@/lib/site";

const PATH = "/areas-we-cover";

const TITLE = `Areas We Cover | Plumber and Drains | ${TRADING_NAME}`;

const DESCRIPTION =
  "The towns we work in, with the postcode districts beside each one. Check your postcode and get a straight yes or no, then ring a plumber.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: openGraphFor({ path: PATH, title: TITLE, description: DESCRIPTION }),
  twitter: { card: "summary_large_image" },
};

/** Counties with at least one published Tier 1 town, in the fixed order. */
const COUNTIES_WITH_TOWNS = COUNTY_ORDER.filter((county) => TOWNS_BY_COUNTY[county].length > 0);

/**
 * The organic pages. They are reachable from here and from nowhere else, so the list is derived
 * and the group appears the day a flag flips rather than the day someone remembers this file.
 */
const ORGANIC_TOWNS = TOWNS.filter((town) => town.tier === "organic" && town.published);

function joinWithAnd(items: readonly string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export default function AreasWeCoverPage() {
  return (
    <div className="has-callbar">
      <Header />

      <main id="main" tabIndex={-1} className="outline-none">
        <section className="bg-paper">
          <div className="mx-auto max-w-content px-5 pb-16 pt-10 sm:px-8 lg:px-12 lg:pb-20 lg:pt-14">
            <Breadcrumb
              items={[{ name: "Home", href: "/" }, { name: "Areas we cover" }]}
              className="mb-8"
            />

            <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
              <div>
                <h1 className="max-w-[20ch] text-pretty font-display text-[clamp(34px,4.6vw,60px)] font-extrabold leading-[1.02] text-brand">
                  Areas we cover.
                </h1>

                <p className="mt-6 max-w-[58ch] text-[16.5px] leading-[1.6] text-slate">
                  {COVERAGE_LINE}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    as="a"
                    href={CALL_HREF}
                    variant="primary"
                    size="xl"
                    className="nums w-full sm:w-auto"
                    data-cta="phone"
                    data-cta-location="areas_index"
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
                    data-cta-location="areas_index"
                    data-cta-variant="secondary_button"
                  >
                    <WhatsappLogo size={22} weight="fill" aria-hidden />
                    WhatsApp us
                  </Button>
                </div>

                <div className="mt-8 flex max-w-[58ch] flex-col gap-2 text-[16.5px] leading-[1.6] text-slate">
                  <p>{PRICE_PROCESS_LINE}</p>
                  <p>{ARRIVAL_LINE}</p>
                  <p>{AVAILABILITY_LINE}</p>
                </div>
              </div>

              <div className="lg:pt-2">
                <PostcodeCheck />
              </div>
            </div>
          </div>
        </section>

        {COUNTIES_WITH_TOWNS.length > 0 && (
          <section className="border-t border-line bg-paper-2">
            <div className="mx-auto max-w-content px-5 py-20 sm:px-8 md:py-28">
              <h2 className="font-display text-[clamp(28px,3.4vw,42px)] font-extrabold leading-[1.05] text-brand">
                The towns we work in.
              </h2>
              <p className="mt-4 max-w-[58ch] text-[16.5px] leading-[1.6] text-slate">
                Each town has its own page, and the postcode districts we work in are beside it. If
                yours is not listed, the postcode check above still answers you.
              </p>

              <div className="mt-10 flex flex-col gap-10">
                {COUNTIES_WITH_TOWNS.map((county) => (
                  <div key={county}>
                    <h3 className="font-display text-[19px] font-bold leading-snug text-brand">
                      {county}
                    </h3>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {TOWNS_BY_COUNTY[county].map((town) => (
                        <li
                          key={town.slug}
                          className="rounded-card border border-line bg-white p-5 shadow-card"
                        >
                          <a
                            href={townHref(town.slug)}
                            data-cta="nav"
                            data-cta-location="areas_index_towns"
                            data-cta-variant="text_link"
                            className="text-[16px] font-semibold text-brand underline underline-offset-4 hover:text-tint"
                          >
                            {town.name}
                          </a>
                          <p className="nums mt-2 text-[14.5px] leading-[1.6] text-slate">
                            {town.postcodeDistricts.join(", ")}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {ORGANIC_TOWNS.length > 0 && (
          <section className="bg-paper">
            <div className="mx-auto max-w-content px-5 py-20 sm:px-8 md:py-28">
              <h2 className="font-display text-[clamp(28px,3.4vw,42px)] font-extrabold leading-[1.05] text-brand">
                Near {joinWithAnd(ORGANIC_TOWNS.map((town) => town.name))}
              </h2>
              <p className="mt-4 max-w-[58ch] text-[16.5px] leading-[1.6] text-slate">
                We work in the districts around these towns, not in the town centres themselves. The
                postcode check tells you for certain.
              </p>

              <ul className="mt-8 flex flex-col gap-3">
                {ORGANIC_TOWNS.map((town) => (
                  <li key={town.slug}>
                    <a
                      href={townHref(town.slug)}
                      data-cta="nav"
                      data-cta-location="areas_index_organic"
                      data-cta-variant="text_link"
                      className="text-[16px] font-semibold text-brand underline underline-offset-4 hover:text-tint"
                    >
                      {placeOf(town)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <BookingForm heading="Ask us to ring you" formId="areas_booking" />
      </main>

      <Footer />
      <MobileCallBar />
    </div>
  );
}
