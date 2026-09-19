// The home page.
//
// Statically generated, and that is a decision rather than an accident. The specification asks
// for a geo-personalised eyebrow, and reading a request header opts the route out of static
// prerendering. This is the page most visitors land on and the owner's brief puts speed first,
// so the eyebrow names the footprint instead and nothing here reads anything from the request.
//
// Section order is the order a person decides in: the number and two facts, the four figures
// behind them, what we fix (with a photograph of each), whether we come to you, why us, what
// happens when you ring, where the reviews are, the questions people ask, and then the form for
// somebody who would rather not call.
//
// Cut on 19 September 2026 after the owner's review ("very text heavy", "the page is very
// long"): the price section, whose three cards and payment paragraph said again what the hero
// fact, the middle step of "How it works" and the price and payment questions in HOME_FAQS all
// say; and the recent-work strip, which showed the same featured photographs the reviews block
// now shows and is the whole of /projects. /projects is linked from the reviews block instead.

import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import HomeHero from "@/components/home/HomeHero";
import StatsStrip from "@/components/home/StatsStrip";
import ServiceCards from "@/components/home/ServiceCards";
import WhereWeWork from "@/components/home/WhereWeWork";
import WhyUs from "@/components/home/WhyUs";
import Reviews from "@/components/home/Reviews";
import HowItWorks from "@/components/HowItWorks";
import ServiceFAQ from "@/components/ServiceFAQ";
import FAQSchema from "@/components/FAQSchema";
import BookingForm from "@/components/BookingForm";
import {
  AVAILABILITY_LINE,
  COVERAGE_SHORT,
  FORM_COPY,
  FREE_WHATSAPP_LINE,
  GUARANTEE_LINE,
  GUARANTEE_SCOPE_LINE,
  PRICE_PROCESS_LINE,
} from "@/lib/claims";
import { HOME_FAQS } from "@/lib/faqs";
import { SITE_URL, TRADING_NAME, openGraphFor } from "@/lib/site";
import type { Step } from "@/lib/types";

const TITLE = `Emergency Plumber & Drainage in Cambridgeshire | ${TRADING_NAME}`;

// Assembled from lib/claims.ts rather than written, for the same reason every other meta
// description on the site is: it is the one piece of copy nobody proof-reads on screen.
// The price-process line is deliberately absent: with it the string is 197 characters and a
// search result would cut it off mid-sentence. It renders in the hero instead, where it is read.
const DESCRIPTION = `Emergency plumbing and drainage across ${COVERAGE_SHORT}. ${AVAILABILITY_LINE}`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: openGraphFor({ path: "", title: TITLE, description: DESCRIPTION }),
  twitter: { card: "summary_large_image" },
};

// Three steps written for the whole business rather than for one service, so they hold whether
// the caller has a burst pipe or wants a tap changing. Between them they carry the three things
// a caller wants settled before they ring: how they are answered, how the price is fixed, and
// what stands behind the work afterwards.
const STEPS: [Step, Step, Step] = [
  {
    icon: "phone",
    title: "Ring us",
    body: "A plumber answers, day or night. Tell us what is happening and you get a straight answer on what to do next.",
  },
  {
    icon: "clipboard",
    title: "Agree the price",
    body: `${PRICE_PROCESS_LINE} ${FREE_WHATSAPP_LINE}`,
  },
  {
    icon: "shield",
    title: "We do the work",
    body: `We test it before we leave. ${GUARANTEE_LINE} ${GUARANTEE_SCOPE_LINE}`,
  },
];

export default function HomePage() {
  return (
    <div className="has-callbar">
      <Header />

      <main id="main" tabIndex={-1} className="outline-none">
        <HomeHero />
        <StatsStrip />
        <ServiceCards />
        <WhereWeWork />
        <WhyUs />
        <HowItWorks steps={STEPS} tinted />
        <Reviews />

        {/* ServiceFAQ renders its own `section#faqs`, which is not this page's to rename, so the
            wrapper carries the `#faq` the removed /faqs route redirects to. One FAQPage block on
            the page: app/layout.tsx emits the LocalBusiness graph and no FAQ schema of its own. */}
        <div id="faq">
          <ServiceFAQ faqs={HOME_FAQS} tinted />
        </div>
        <FAQSchema faqs={HOME_FAQS} />

        <BookingForm heading={FORM_COPY.full.heading} formId="home_booking" />
      </main>

      <Footer />
      <MobileCallBar />
    </div>
  );
}
