// /about. The page that answers "who am I ringing?" before anything else.
//
// The lead is the phone, not a job count. BeBest's about page opens on 15,000 jobs; Speedy
// cannot open on a number, because the company was registered in June 2026 and the number
// belongs to the plumbers. So the page opens on the one thing that is true today and that no
// competitor in this auction says: a plumber answers, and the person who answers turns up.
//
// NO CREDENTIAL CLAIM OF ANY KIND appears here. "What we can put in writing" is insurance, the
// company registration and the guarantee, and the section says out loud that there are no trade
// badges on the page because none are held. That sentence is the point of the section.
//
// Static: nothing is read from the request.

import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import Breadcrumb from "@/components/Breadcrumb";
import BookingForm from "@/components/BookingForm";
import CTABand from "@/components/CTABand";
import AnimateIn from "@/components/AnimateIn";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import {
  ANSWERED_LINE,
  ARRIVAL_LINE,
  AVAILABILITY_LINE,
  DEFAULT_CTA_BAND,
  EXPERIENCE_LINE,
  GUARANTEE_LINE,
  GUARANTEE_SCOPE_LINE,
  INSURED_LEAD,
  NIGHT_RATE_LINE,
  PRICE_PROCESS_LINE,
} from "@/lib/claims";
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
// appears here only, under a visible "Illustration" caption, and never in a work gallery.
const VAN = PHOTO_BY_SLUG["van-illustration"];

const TITLE = `About us: a plumber answers the phone | ${TRADING_NAME}`;
const DESCRIPTION =
  "A plumber answers the phone, day or night, and the person who answers is the one who comes. A new company, and the price is agreed before we start.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: openGraphFor({ path: "/about", title: TITLE, description: DESCRIPTION }),
  twitter: { card: "summary_large_image" },
};

/** A link is only offered when the page behind it is live, so nothing here can 404. */
const guaranteeHref = STATIC_ROUTE_BY_PATH["/guarantee"]?.published ? "/guarantee" : undefined;

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

// The two sentences in the fifth card are quoted verbatim in the brief and an ad sitelink is
// pointed at them, so they live in always-visible card text: never behind a disclosure, never
// inside a responsive wrapper that hides them on one screen size.
const HOLD_US_TO: { title: string; body: ReactNode }[] = [
  {
    title: "A plumber answers",
    body: ANSWERED_LINE,
  },
  {
    title: "With you within 45 minutes",
    body: `${ARRIVAL_LINE} That is what an emergency gets you. Booked work gets you a time instead, and your plumber turns up at it.`,
  },
  {
    title: "The price before we start",
    body: `${PRICE_PROCESS_LINE} ${NIGHT_RATE_LINE}`,
  },
  {
    title: "12 months on our workmanship",
    body: <GuaranteeSentence location="about_values" />,
  },
  {
    title: "Nothing changes behind your back",
    body:
      "If we find something unexpected, we stop and talk to you before it changes the bill. " +
      "Taps run, drains flushed, systems tested in front of you before anyone packs up.",
  },
];

const IN_WRITING: { title: string; body: ReactNode }[] = [
  {
    title: "Fully insured",
    body: `${INSURED_LEAD} If something goes wrong on your job, you are not the one left holding it.`,
  },
  {
    title: "A registered company",
    body: `${REGISTERED_NAME}, company number ${COMPANY_NUMBER}, registered in England and Wales. Look it up before you ring, if you want to.`,
  },
  {
    title: "The guarantee",
    body: <GuaranteeSentence location="about_writing" />,
  },
  {
    title: "What you will not see here",
    body:
      "No trade badges and no scheme logos. You will not see marks we do not hold here, " +
      "and a sentence you can hold us to is worth more to you than a picture of one.",
  },
];

export default function AboutPage() {
  return (
    <div className="has-callbar">
      <Header />

      <main id="main" tabIndex={-1} className="outline-none">
        <section className="bg-paper">
          <div className="mx-auto max-w-content px-5 pb-14 pt-8 sm:px-8 lg:px-12 md:pb-20 md:pt-10">
            <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "About" }]} className="mb-8" />

            <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-tint">
              About {TRADING_NAME}
            </p>

            <h1 className="max-w-[18ch] text-pretty font-display text-[clamp(34px,4.6vw,60px)] font-extrabold leading-[1.02] text-brand">
              We answer our own phone.
            </h1>

            <p className="mt-5 max-w-[56ch] text-[17px] leading-[1.6] text-slate">{ANSWERED_LINE}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                as="a"
                href={CALL_HREF}
                variant="primary"
                size="xl"
                className="nums w-full sm:w-auto"
                data-cta="phone"
                data-cta-location="about_page"
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
                data-cta-location="about_page"
                data-cta-variant="secondary_button"
              >
                <WhatsappLogo size={22} weight="fill" aria-hidden />
                WhatsApp us
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t border-line bg-paper-2">
          <div className="mx-auto grid max-w-content gap-10 px-5 py-20 sm:px-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:py-28">
            <AnimateIn>
              <SectionHeading eyebrow="Who you are ringing" title="A new company, with plumbers who are not." />
            </AnimateIn>
            <AnimateIn delay={80}>
              <div className="flex max-w-[66ch] flex-col gap-4 text-[16.5px] leading-[1.75] text-slate">
                <p>
                  {REGISTERED_NAME} is a new company. It was registered in June 2026, and you should hear
                  that here rather than find it out later.
                </p>
                <p>
                  What arrives at your door is not three months old. The experience is the
                  plumbers&apos;, not the company&apos;s. {EXPERIENCE_LINE}
                </p>
                <p>
                  {PRICE_PROCESS_LINE} {NIGHT_RATE_LINE} {AVAILABILITY_LINE}
                </p>
              </div>
            </AnimateIn>
          </div>
        </section>

        <section className="bg-paper">
          <div className="mx-auto max-w-content px-5 py-20 sm:px-8 md:py-28">
            <AnimateIn>
              <SectionHeading
                eyebrow="What you can hold us to"
                title="Five things you can hold us to."
                sub="If one of these slips on your job, say so on the day and you will be right."
              />
            </AnimateIn>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="mx-auto max-w-content px-5 py-20 sm:px-8 md:py-28">
            <AnimateIn>
              <SectionHeading
                eyebrow="What we can stand behind"
                title="What we can put in writing."
                sub="No badges we do not hold."
              />
            </AnimateIn>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {IN_WRITING.map((item, i) => (
                <AnimateIn key={item.title} delay={i * 80} className="h-full">
                  <div className="flex h-full flex-col gap-2 rounded-card border border-line bg-white p-6 shadow-card">
                    <h3 className="font-display text-[19px] font-bold leading-tight text-brand">{item.title}</h3>
                    <p className="max-w-[52ch] text-[15px] leading-[1.65] text-slate">{item.body}</p>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        {VAN && (
          <section className="border-t border-line bg-paper-2">
            <div className="mx-auto max-w-content px-5 py-16 sm:px-8 md:py-20">
              <figure className="mx-auto max-w-[760px]">
                <Image
                  src={VAN.file}
                  alt={VAN.alt}
                  width={VAN.width}
                  height={VAN.height}
                  sizes="(max-width: 800px) 100vw, 760px"
                  loading="lazy"
                  className="h-auto w-full rounded-card border border-line"
                />
                <figcaption className="mt-3 text-center text-[13.5px] font-semibold uppercase tracking-[0.14em] text-steel">
                  {VAN.caption}
                </figcaption>
              </figure>
            </div>
          </section>
        )}

        <CTABand heading={DEFAULT_CTA_BAND.heading} sub={DEFAULT_CTA_BAND.sub} />

        <BookingForm heading="Ask us to ring you" formId="about_booking" />
      </main>

      <Footer />
      <MobileCallBar />
    </div>
  );
}
