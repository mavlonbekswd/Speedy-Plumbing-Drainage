// /guarantee.
//
// The scope leads. Every plumber in this auction says "guaranteed"; none of them says what the
// guarantee covers, and a guarantee with no stated scope is read as covering the materials too.
// It does not. So the figure beside the H1 says how long, the two lists say what is ours and
// what belongs to the maker of the part, and nothing on the page promises anything else.
//
// Redesigned on the owner's review of 19 September 2026: the same facts, laid out instead of
// written out. The 12 months start the day the job is done; it is stated once, in the list, and
// nowhere as a date or a deadline.

import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import Breadcrumb from "@/components/Breadcrumb";
import CTABand from "@/components/CTABand";
import ServiceFAQ from "@/components/ServiceFAQ";
import FAQSchema from "@/components/FAQSchema";
import HowItWorks from "@/components/HowItWorks";
import StaticHero from "@/components/static/StaticHero";
import AnimateIn from "@/components/AnimateIn";
import CoverList, { type CoverItem } from "@/components/static/CoverList";
import JobPhotoRow from "@/components/static/JobPhotoRow";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  DEFAULT_CTA_BAND,
  GUARANTEE_LINE,
  GUARANTEE_SCOPE_LINE,
  NIGHT_RATE_LINE,
  PRICE_PROCESS_LINE,
} from "@/lib/claims";
import { GUARANTEE_FAQS } from "@/lib/faqs";
import type { Step } from "@/lib/types";
import { SITE_URL, TRADING_NAME, openGraphFor, REGISTERED_NAME } from "@/lib/site";

const TITLE = `Our 1-year workmanship guarantee | ${TRADING_NAME}`;
const DESCRIPTION =
  "Twelve months on our workmanship: what the guarantee covers, what it does not, and how to claim. Contact us first and we inspect and put it right.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/guarantee` },
  openGraph: openGraphFor({ path: "/guarantee", title: TITLE, description: DESCRIPTION }),
  twitter: { card: "summary_large_image" },
};

// The guarantee's terms, as the plumbers give them to customers (owner, 20 Sept 2026). The four
// paragraphs of GUARANTEE_TERMS are his wording and are rendered verbatim: do not tidy them. The
// two lists above them are the same terms broken into lines a person can scan, item for item,
// and must never say more than the terms do. Evidence: ARIM/speedy/claims-evidence/guarantee-12-month.md.
const GUARANTEE_TERMS: readonly string[] = [
  `All work carried out by ${REGISTERED_NAME} is covered by a 12-month workmanship guarantee, unless otherwise stated.`,
  "The guarantee covers faults directly caused by our workmanship. It does not cover normal wear and tear, pre-existing faults, misuse, accidental damage, manufacturer defects, customer-supplied parts, recurring drain blockages, or work altered or repaired by another person or contractor.",
  "If you believe there is an issue with our work, please contact us first and allow us the opportunity to inspect and rectify the problem.",
  "Your statutory rights are not affected.",
];

const COVERED: readonly CoverItem[] = [
  { lead: "Faults directly caused by our workmanship", rest: "on all work we carry out, unless otherwise stated." },
  { lead: "12 months", rest: "starting the day the job is done." },
  { lead: "Hot water cylinder work", rest: "is covered on the same terms." },
  { lead: "We inspect and put it right", rest: "when the fault is down to the way we did the work." },
];

const NOT_COVERED: readonly CoverItem[] = [
  { lead: "Normal wear and tear", rest: "and faults that were already there." },
  { lead: "Misuse", rest: "or accidental damage." },
  { lead: "Manufacturer defects.", rest: "Materials are covered by their own maker's warranty." },
  { lead: "Parts you supplied yourself", rest: "and asked us to fit." },
  { lead: "Recurring drain blockages.", rest: "" },
  { lead: "Work altered or repaired", rest: "by another person or contractor." },
];

const CLAIM_STEPS: readonly Step[] = [
  {
    icon: "phone",
    title: "Contact us first",
    body: "Ring us or message us on WhatsApp before anyone else touches the work. Have your invoice to hand and tell us what has happened.",
  },
  {
    icon: "clipboard",
    title: "We inspect it",
    body: "We book you in and a plumber looks at the work. A photo on WhatsApp beforehand helps.",
  },
  {
    icon: "wrench",
    title: "We put it right",
    body: "If the fault was caused by our workmanship, we rectify it.",
  },
];

export default function GuaranteePage() {
  return (
    <div className="has-callbar">
      <FAQSchema faqs={GUARANTEE_FAQS} />
      <Header />

      <main id="main" tabIndex={-1} className="outline-none">
        {/* The figure card is the hero's right column, where a service page puts its callback
            card: the same slot, so the page reads as the rest of the site. */}
        <StaticHero
          image="guarantee"
          crumbs={<Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Guarantee" }]} />}
          eyebrow="Our guarantee"
          h1="Our 1-year guarantee."
          ctaLocation="guarantee_hero"
          sub={
            <p>
              <strong className="font-semibold text-ink">{GUARANTEE_LINE}</strong> {GUARANTEE_SCOPE_LINE}
            </p>
          }
          aside={
            <div className="rounded-card border border-line bg-white p-8 text-center shadow-card">
              <p className="nums font-display text-[clamp(54px,9vw,92px)] font-extrabold leading-[0.9] text-brand">
                1 year
              </p>
              <p className="mt-3 text-[16.5px] font-semibold leading-snug text-slate">on our workmanship</p>
            </div>
          }
        >
          <a
            href="/contact#book"
            data-cta="book_anchor"
            data-cta-location="guarantee_hero"
            data-cta-variant="text_link"
            className="inline-flex min-h-[44px] items-center text-[15.5px] font-semibold text-brand underline underline-offset-4 hover:text-tint"
          >
            Ask us to ring you
          </a>
        </StaticHero>

        <section className="border-t border-line bg-paper-2">
          <div className="mx-auto max-w-content px-5 py-14 sm:px-8 md:py-20">
            <AnimateIn>
              <SectionHeading eyebrow="The scope" title="What it covers, and what it does not." />
            </AnimateIn>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <AnimateIn className="h-full">
                <CoverList title="What it covers" items={COVERED} tone="yes" />
              </AnimateIn>
              <AnimateIn delay={80} className="h-full">
                <CoverList title="What it does not" items={NOT_COVERED} tone="no" />
              </AnimateIn>
            </div>

            <AnimateIn>
              <div className="mt-8 rounded-card border border-line bg-white p-6 shadow-card">
                <h3 className="font-display text-[19px] font-bold leading-snug text-brand">
                  12-Month Workmanship Guarantee
                </h3>
                <div className="mt-3 flex max-w-[72ch] flex-col gap-3 text-[15.5px] leading-[1.7] text-slate">
                  {GUARANTEE_TERMS.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </AnimateIn>

            <p className="mt-6 max-w-[64ch] text-[15.5px] leading-[1.7] text-slate">
              {PRICE_PROCESS_LINE} {NIGHT_RATE_LINE}
            </p>
          </div>
        </section>

        <HowItWorks steps={CLAIM_STEPS} eyebrow="If something goes wrong" title="How to claim." />

        <JobPhotoRow
          slugs={["shower-over-bath", "water-supply-pipe", "new-toilet", "hot-water-system-cupboard"]}
          heading="Recent work."
          tinted
        />

        <div id="faq">
          <ServiceFAQ faqs={GUARANTEE_FAQS} heading="Questions about the guarantee." />
        </div>

        <CTABand heading={DEFAULT_CTA_BAND.heading} sub={DEFAULT_CTA_BAND.sub} />
      </main>

      <Footer />
      <MobileCallBar />
    </div>
  );
}
