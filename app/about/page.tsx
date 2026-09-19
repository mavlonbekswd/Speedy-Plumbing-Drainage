// /about. Who you are ringing, in one scroll.
//
// Rebuilt on the owner's review of 19 September 2026: shorter, with pictures instead of
// paragraphs. The hero is a label, not a speech; "Local Plumber" is two sentences, both of them
// the owner's own words and both built from lib/claims.ts so a fact changes in one place.
//
// NO CREDENTIAL CLAIM OF ANY KIND appears here. What we can put in writing is the insurance, the
// company registration and the guarantee, and nothing else is offered as proof.
//
// Static: nothing is read from the request.

import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { Phone, ShieldCheck, Buildings, SealCheck, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import Breadcrumb from "@/components/Breadcrumb";
import CTABand from "@/components/CTABand";
import AnimateIn from "@/components/AnimateIn";
import HeroBackdrop from "@/components/HeroBackdrop";
import ServiceFAQ from "@/components/ServiceFAQ";
import FAQSchema from "@/components/FAQSchema";
import JobPhotoRow from "@/components/static/JobPhotoRow";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import {
  ARRIVAL_LINE,
  AVAILABILITY_LINE,
  COVERAGE_LINE,
  DEFAULT_CTA_BAND,
  EXPERIENCE_LINE,
  GUARANTEE_LINE,
  GUARANTEE_SCOPE_LINE,
  INSURED_LEAD,
  NIGHT_RATE_LINE,
  PRICE_PROCESS_LINE,
} from "@/lib/claims";
import { ABOUT_FAQS } from "@/lib/faqs";
import { PHOTO_BY_SLUG } from "@/lib/media";
import { STATIC_ROUTE_BY_PATH } from "@/lib/routes";
import {
  CALL_HREF,
  CALL_NUMBER_DISPLAY,
  COMPANY_NUMBER,
  REGISTERED_NAME,
  SITE_URL,
  TRADING_NAME,
  WHATSAPP_URL,
  openGraphFor,
} from "@/lib/site";

// The one AI-made picture the owner supplied. It is a brand graphic, not a job photo, so it
// never appears in the row of real work below. The owner removed its visible "Illustration"
// label on 19 September 2026; the alt text still says what it is, for anyone who cannot see it.
const VAN = PHOTO_BY_SLUG["van-illustration"];

const TITLE = `About us: a local plumbing company | ${TRADING_NAME}`;
const DESCRIPTION =
  "Speedy Plumbing & Drain Ltd is a local plumbing company covering Cambridgeshire, Suffolk, Norfolk and north Essex. The price is agreed before we start.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: openGraphFor({ path: "/about", title: TITLE, description: DESCRIPTION }),
  twitter: { card: "summary_large_image" },
};

/** A link is only offered when the page behind it is live, so nothing here can 404. */
const guaranteeHref = STATIC_ROUTE_BY_PATH["/guarantee"]?.published ? "/guarantee" : undefined;

// The owner's two paragraphs, 19 September 2026, word for word. The experience half is sliced
// out of EXPERIENCE_LINE rather than retyped, so the job count can only ever be the plumbers'
// own, and the price paragraph is three constants in a row.
const EXPERIENCE_TAIL = EXPERIENCE_LINE.replace(/^Our plumbers bring\s+/, "");
const LOCAL_PLUMBER_PARAGRAPHS: readonly string[] = [
  `${REGISTERED_NAME} is a local plumbing company serving Cambridgeshire, Suffolk, Norfolk and north Essex. Our team has ${EXPERIENCE_TAIL}`,
  `${PRICE_PROCESS_LINE} ${NIGHT_RATE_LINE} ${AVAILABILITY_LINE}`,
];

/**
 * The guarantee and its scope, always together. GUARANTEE_LINE links to /guarantee wherever it
 * renders and the page is live; where it is not, the sentence still renders, unlinked.
 */
function GuaranteeSentence({ location }: { location: string }) {
  return (
    <>
      {guaranteeHref ? (
        <a
          href={guaranteeHref}
          data-cta="nav"
          data-cta-location={location}
          data-cta-variant="text_link"
          className="font-semibold text-brand underline underline-offset-4"
        >
          {GUARANTEE_LINE}
        </a>
      ) : (
        <strong className="font-semibold text-ink">{GUARANTEE_LINE}</strong>
      )}{" "}
      {GUARANTEE_SCOPE_LINE}
    </>
  );
}

// One line each. No card claims a credential, an award or a first place.
const HOLD_US_TO: { title: string; body: ReactNode }[] = [
  {
    title: "Local Plumber",
    body: `We cover ${COVERAGE_LINE}`,
  },
  {
    title: "With you within 45 minutes",
    body: `${ARRIVAL_LINE} Booked work gets you a time instead, and your plumber turns up at it.`,
  },
  {
    title: "The price before we start",
    body: `${PRICE_PROCESS_LINE} ${NIGHT_RATE_LINE}`,
  },
  {
    title: "1 year guarantee",
    body: <GuaranteeSentence location="about_values" />,
  },
  {
    title: "Quality is our promise",
    body:
      "If we find something unexpected, we stop and talk to you before it changes the bill. " +
      "Taps run and drains flush in front of you before anyone packs up.",
  },
];

const IN_WRITING: { icon: ReactNode; title: string; body: ReactNode }[] = [
  {
    icon: <ShieldCheck size={22} weight="fill" aria-hidden className="text-tint" />,
    title: "Fully insured",
    body: `${INSURED_LEAD} If something goes wrong on your job, you are not the one left holding it.`,
  },
  {
    icon: <Buildings size={22} weight="fill" aria-hidden className="text-tint" />,
    title: "A registered company",
    body: `${REGISTERED_NAME}, company number ${COMPANY_NUMBER}, registered in England and Wales.`,
  },
  {
    icon: <SealCheck size={22} weight="fill" aria-hidden className="text-tint" />,
    title: "The guarantee",
    body: <GuaranteeSentence location="about_writing" />,
  },
];

export default function AboutPage() {
  return (
    <div className="has-callbar">
      <FAQSchema faqs={ABOUT_FAQS} />
      <Header />

      <main id="main" tabIndex={-1} className="outline-none">
        <section className="relative isolate overflow-hidden bg-paper">
          <HeroBackdrop image="about" />
          <div className="mx-auto max-w-content px-5 pb-14 pt-8 sm:px-8 lg:px-12 md:pb-20 md:pt-10">
            <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "About" }]} className="mb-8" />

            <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-tint">
              About {TRADING_NAME}
            </p>

            <h1 className="max-w-[16ch] text-pretty font-display text-[clamp(34px,4.6vw,60px)] font-extrabold leading-[1.02] text-brand">
              Efficient service
            </h1>

            <p className="mt-5 max-w-[46ch] text-[17px] leading-[1.6] text-slate">{AVAILABILITY_LINE}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                as="a"
                href={CALL_HREF}
                variant="primary"
                size="xl"
                className="nums w-full sm:w-auto"
                data-cta="phone"
                data-cta-location="about_hero"
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
                data-cta-location="about_hero"
                data-cta-variant="secondary_button"
              >
                <WhatsappLogo size={22} weight="fill" aria-hidden />
                WhatsApp us
              </Button>
              <a
                href="/contact#book"
                data-cta="book_anchor"
                data-cta-location="about_hero"
                data-cta-variant="text_link"
                className="inline-flex min-h-[44px] items-center text-[15.5px] font-semibold text-brand underline underline-offset-4 hover:text-tint"
              >
                Ask us to ring you
              </a>
            </div>
          </div>
        </section>

        <section className="border-t border-line bg-paper-2">
          <div className="mx-auto grid max-w-content items-center gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 md:gap-14 md:py-20">
            <AnimateIn>
              <SectionHeading eyebrow="Who you are ringing" title="Local Plumber" />
              <div className="mt-5 flex max-w-[58ch] flex-col gap-4 text-[16.5px] leading-[1.7] text-slate">
                {LOCAL_PLUMBER_PARAGRAPHS.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </AnimateIn>

            {VAN && (
              <AnimateIn delay={80}>
                <Image
                  src={VAN.file}
                  alt={VAN.alt}
                  width={VAN.width}
                  height={VAN.height}
                  sizes="(max-width: 767px) 100vw, 560px"
                  loading="lazy"
                  className="h-auto w-full rounded-card border border-line"
                />
              </AnimateIn>
            )}
          </div>
        </section>

        <section className="bg-paper">
          <div className="mx-auto max-w-content px-5 py-16 sm:px-8 md:py-20">
            <AnimateIn>
              <SectionHeading
                eyebrow="What you can hold us to"
                title="Five things you can hold us to."
                sub="If one of these slips on your job, say so on the day and you will be right."
              />
            </AnimateIn>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {HOLD_US_TO.map((item, i) => (
                <AnimateIn key={item.title} delay={i * 70} className="h-full">
                  <div className="flex h-full flex-col gap-2 rounded-card border border-line bg-white p-6 shadow-card">
                    <h3 className="font-display text-[19px] font-bold leading-tight text-brand">{item.title}</h3>
                    <p className="max-w-[46ch] text-[15px] leading-[1.65] text-slate">{item.body}</p>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-line bg-paper-2">
          <div className="mx-auto max-w-content px-5 py-16 sm:px-8 md:py-20">
            <AnimateIn>
              <SectionHeading eyebrow="What we can stand behind" title="What we can put in writing." />
            </AnimateIn>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {IN_WRITING.map((item, i) => (
                <AnimateIn key={item.title} delay={i * 80} className="h-full">
                  <div className="flex h-full flex-col gap-2 rounded-card border border-line bg-white p-6 shadow-card">
                    {item.icon}
                    <h3 className="font-display text-[18px] font-bold leading-tight text-brand">{item.title}</h3>
                    <p className="max-w-[46ch] text-[15px] leading-[1.65] text-slate">{item.body}</p>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        <JobPhotoRow
          slugs={["drain-jetting-manhole", "new-bath-white-tile", "kitchen-mixer-tap"]}
          heading="Some of the work."
        />

        <div id="faq">
          <ServiceFAQ faqs={ABOUT_FAQS} heading="Questions about us." tinted />
        </div>

        <CTABand heading={DEFAULT_CTA_BAND.heading} sub={DEFAULT_CTA_BAND.sub} />
      </main>

      <Footer />
      <MobileCallBar />
    </div>
  );
}
