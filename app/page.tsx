// The home page.
//
// Statically generated, and that is a decision rather than an accident. The specification asks
// for a geo-personalised eyebrow, and reading a request header opts the route out of static
// prerendering. This is the page most visitors land on and the owner's brief puts speed first,
// so the eyebrow names the footprint instead and nothing here reads anything from the request.
//
// Section order is the order a person decides in: the number and the three facts, the four
// figures behind them, what we fix, whether we come to you, why us, what happens when you ring,
// what it costs, our own jobs, and then the form for somebody who would rather not call.

import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import HomeHero from "@/components/home/HomeHero";
import StatsStrip from "@/components/home/StatsStrip";
import ServiceCards from "@/components/home/ServiceCards";
import WhereWeWork from "@/components/home/WhereWeWork";
import WhyUs from "@/components/home/WhyUs";
import HowItWorks from "@/components/HowItWorks";
import PriceClarity from "@/components/home/PriceClarity";
import ProofStrip from "@/components/ProofStrip";
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
import { FEATURED_PHOTO_SLUGS } from "@/lib/media";
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
        <PriceClarity />
        <ProofStrip photoSlugs={FEATURED_PHOTO_SLUGS} videoSlug="drain-jetting" tinted />
        <BookingForm heading={FORM_COPY.full.heading} formId="home_booking" />
      </main>

      <Footer />
      <MobileCallBar />
    </div>
  );
}
