// /faqs. A sitelink in the ad account points here for the price question, so the two price
// lines sit in plain always-visible text above the accordion rather than behind a toggle.
//
// One ServiceFAQ and one FAQSchema over the same list: the component keeps every answer in the
// server HTML and toggles it with `hidden`, so the schema never names an answer the page does
// not render. Nothing reads the request, so the page is a static file.

import type { Metadata } from "next";
import { Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import Breadcrumb from "@/components/Breadcrumb";
import ServiceFAQ from "@/components/ServiceFAQ";
import FAQSchema from "@/components/FAQSchema";
import BookingForm from "@/components/BookingForm";
import Button from "@/components/ui/Button";
import { ANSWERED_LINE, AVAILABILITY_LINE, PRICE_NOTE, PRICE_PROCESS_LINE } from "@/lib/claims";
import { SITE_FAQS } from "@/lib/faqs";
import {
  CALL_HREF,
  CALL_NUMBER_DISPLAY,
  SITE_URL,
  TRADING_NAME,
  WHATSAPP_URL,
  openGraphFor,
} from "@/lib/site";

const PATH = "/faqs";

const TITLE = `Plumbing Questions Answered | ${TRADING_NAME}`;

const DESCRIPTION =
  "The questions people ask before they ring: our hours, how soon we arrive, how the price is agreed, how you pay, and the work we do not take on.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: openGraphFor({ path: PATH, title: TITLE, description: DESCRIPTION }),
  twitter: { card: "summary_large_image" },
};

export default function FaqsPage() {
  return (
    <div className="has-callbar">
      <FAQSchema faqs={SITE_FAQS} />
      <Header />

      <main id="main" tabIndex={-1} className="outline-none">
        <section className="bg-paper">
          <div className="mx-auto max-w-content px-5 pb-16 pt-10 sm:px-8 lg:px-12 lg:pb-20 lg:pt-14">
            <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Questions" }]} className="mb-8" />

            <h1 className="max-w-[20ch] text-pretty font-display text-[clamp(34px,4.6vw,60px)] font-extrabold leading-[1.02] text-brand">
              Questions people ask before they ring.
            </h1>

            <div className="mt-8 flex max-w-[62ch] flex-col gap-3 text-[16.5px] leading-[1.6] text-slate">
              <p>{PRICE_PROCESS_LINE}</p>
              <p>{PRICE_NOTE}</p>
              <p>{ANSWERED_LINE}</p>
              <p>{AVAILABILITY_LINE}</p>
            </div>
          </div>
        </section>

        <ServiceFAQ faqs={SITE_FAQS} heading="The answers, in the order people ask for them." tinted />

        <section className="bg-paper">
          <div className="mx-auto max-w-content px-5 py-20 sm:px-8 md:py-28">
            <div className="rounded-card border border-line bg-white p-6 shadow-card sm:p-8">
              <h2 className="font-display text-[clamp(26px,3vw,36px)] font-extrabold leading-[1.05] text-brand">
                Still not sure?
              </h2>
              <p className="mt-3 max-w-[62ch] text-[16.5px] leading-[1.6] text-slate">
                Ring and describe it. You will get a straight answer from the plumber who would come
                out, not from a call centre.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  as="a"
                  href={CALL_HREF}
                  variant="primary"
                  size="xl"
                  className="nums w-full sm:w-auto"
                  data-cta="phone"
                  data-cta-location="faqs_page"
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
                  data-cta-location="faqs_page"
                  data-cta-variant="secondary_button"
                >
                  <WhatsappLogo size={22} weight="fill" aria-hidden />
                  WhatsApp us
                </Button>
              </div>
            </div>
          </div>
        </section>

        <BookingForm heading="Ask us to ring you" formId="faqs_booking" />
      </main>

      <Footer />
      <MobileCallBar />
    </div>
  );
}
