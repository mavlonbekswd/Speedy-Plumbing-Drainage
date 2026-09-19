// /contact. One block: how to reach a plumber on the left, the callback form on the right.
//
// Rebuilt to the owner's review of 19 September 2026. The telephone link comes before the form
// in DOM order and the columns stack with the details first, so a person on a phone gets the
// number before they get a field to type in. The removed wizard URL now redirects to #book here.
//
// Deliberately NOT an address card at the top. There is no shop and no trade counter, so the
// registered office is a legal disclosure and is written as one, in small print under the
// contact details. No map and no third-party embed.
//
// Nothing here reads the request, so the page is a static file.

import type { Metadata } from "next";
import { Clock, EnvelopeSimple, Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import Breadcrumb from "@/components/Breadcrumb";
import BookingForm from "@/components/BookingForm";
import ServiceFAQ from "@/components/ServiceFAQ";
import FAQSchema from "@/components/FAQSchema";
import StaticHero from "@/components/static/StaticHero";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import { AVAILABILITY_LINE, COVERAGE_SHORT, FREE_WHATSAPP_LINE } from "@/lib/claims";
import { CONTACT_FAQS } from "@/lib/faqs";
import {
  CALL_HREF,
  CALL_NUMBER_DISPLAY,
  COMPANY_NUMBER,
  CONTACT_EMAIL,
  REGISTERED_NAME,
  REGISTERED_OFFICE,
  SITE_URL,
  TRADING_NAME,
  WHATSAPP_URL,
  openGraphFor,
} from "@/lib/site";

const PATH = "/contact";

const TITLE = `Contact Speedy | Plumber 24/7 | ${TRADING_NAME}`;

const DESCRIPTION = `Ring, WhatsApp or email us. A plumber answers, day or night, and we cover ${COVERAGE_SHORT}. Or ask us to ring you back.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: openGraphFor({ path: PATH, title: TITLE, description: DESCRIPTION }),
  twitter: { card: "summary_large_image" },
};

export default function ContactPage() {
  return (
    <div className="has-callbar">
      <FAQSchema faqs={CONTACT_FAQS} />
      <Header />

      <main id="main" tabIndex={-1} className="outline-none">
        {/* No hero buttons, on purpose: the details block immediately below carries the Call pill,
            the WhatsApp pill and the email address, and a second set here would put the same
            action on the screen twice before a visitor has read a line. */}
        <StaticHero
          image="contact"
          crumbs={<Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Contact" }]} />}
          eyebrow="Get in touch"
          h1="Contact Speedy."
          sub="Ring us, message us on WhatsApp, or leave your number and we will ring you back."
          ctaLocation="contact_hero"
          showCall={false}
          showWhatsApp={false}
        />

        {/* One block, two columns from lg. The details are first in the markup, so on a phone the
            number is above the form and nothing pushes it down. */}
        <section className="border-t border-line bg-paper-2">
          <div className="mx-auto max-w-content px-5 py-14 sm:px-8 md:py-20">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
              <div className="flex flex-col gap-6 rounded-card border border-line bg-white p-6 shadow-card">
                <SectionHeading eyebrow="How to reach us" title="Speak to a plumber." />

                <div className="flex flex-col gap-3">
                  <Button
                    as="a"
                    href={CALL_HREF}
                    variant="primary"
                    size="lg"
                    className="nums w-full"
                    data-cta="phone"
                    data-cta-location="contact_details"
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
                    className="w-full"
                    data-cta="whatsapp"
                    data-cta-location="contact_details"
                    data-cta-variant="secondary_button"
                  >
                    <WhatsappLogo size={20} weight="fill" aria-hidden />
                    WhatsApp us
                  </Button>

                  <p className="text-[14.5px] leading-[1.6] text-slate">{FREE_WHATSAPP_LINE}</p>
                </div>

                <p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    data-cta="email"
                    data-cta-location="contact_details"
                    data-cta-variant="text_link"
                    className="press inline-flex min-h-[44px] items-center gap-2 break-all text-[15.5px] font-semibold text-brand underline underline-offset-4 hover:text-tint"
                  >
                    <EnvelopeSimple size={18} weight="fill" aria-hidden className="text-tint" />
                    {CONTACT_EMAIL}
                  </a>
                </p>

                <p className="flex items-start gap-2 text-[15.5px] font-semibold leading-[1.6] text-ink">
                  <Clock size={18} weight="fill" aria-hidden className="mt-[3px] flex-shrink-0 text-tint" />
                  {AVAILABILITY_LINE}
                </p>

                <div className="nums border-t border-line pt-5 text-[13.5px] leading-[1.7] text-steel">
                  <p>
                    {TRADING_NAME} is a trading name of {REGISTERED_NAME}, registered in England &amp; Wales.
                    Company number {COMPANY_NUMBER}. Registered office: {REGISTERED_OFFICE}.
                  </p>
                  <p className="mt-2">
                    That address is the registered office, not a shop and not a trade counter. We work at
                    your address.
                  </p>
                </div>
              </div>

              <BookingForm heading="Ask us to ring you." formId="contact_booking" embedded />
            </div>
          </div>
        </section>

        <div id="faq">
          <ServiceFAQ faqs={CONTACT_FAQS} heading="Questions people ask us." />
        </div>
      </main>

      <Footer />
      <MobileCallBar />
    </div>
  );
}
