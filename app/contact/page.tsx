// /contact. Three ways to reach a plumber, then the coverage question, then the form.
//
// Deliberately NOT an address card. There is no shop and no trade counter, so an address block
// at the top of this page would invite somebody to drive to a flat. The registered office is a
// legal disclosure and is written as one, low down, in its own words.
//
// Nothing here reads the request, so the page is a static file.

import type { Metadata } from "next";
import { EnvelopeSimple, Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import Breadcrumb from "@/components/Breadcrumb";
import PostcodeCheck from "@/components/PostcodeCheck";
import BookingForm from "@/components/BookingForm";
import Button from "@/components/ui/Button";
import {
  ANSWERED_LINE,
  AVAILABILITY_LINE,
  COVERAGE_LINE,
  COVERAGE_SHORT,
  FREE_WHATSAPP_LINE,
  PRICE_PROCESS_LINE,
} from "@/lib/claims";
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

const DESCRIPTION = `Ring, WhatsApp or email us. A plumber answers, day or night, and we cover ${COVERAGE_SHORT}. Check your postcode before you ring.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: openGraphFor({ path: PATH, title: TITLE, description: DESCRIPTION }),
  twitter: { card: "summary_large_image" },
};

const CARD_CLASS = "flex h-full flex-col rounded-card border border-line bg-white p-6 shadow-card";
const CARD_H3 = "font-display text-[19px] font-bold leading-snug text-brand";
const CARD_BODY = "mt-2 max-w-[62ch] text-[15px] leading-[1.7] text-slate";

export default function ContactPage() {
  return (
    <div className="has-callbar">
      <Header />

      <main id="main" tabIndex={-1} className="outline-none">
        <section className="bg-paper">
          <div className="mx-auto max-w-content px-5 pb-16 pt-10 sm:px-8 lg:px-12 lg:pb-20 lg:pt-14">
            <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Contact" }]} className="mb-8" />

            <h1 className="max-w-[18ch] text-pretty font-display text-[clamp(34px,4.6vw,60px)] font-extrabold leading-[1.02] text-brand">
              Contact Speedy.
            </h1>

            <div className="mt-6 flex max-w-[58ch] flex-col gap-2 text-[16.5px] leading-[1.6] text-slate">
              <p>{AVAILABILITY_LINE}</p>
              <p>{ANSWERED_LINE}</p>
              <p>{PRICE_PROCESS_LINE}</p>
            </div>

            <h2 className="mt-12 font-display text-[clamp(28px,3.4vw,42px)] font-extrabold leading-[1.05] text-brand">
              Three ways to reach a plumber.
            </h2>

            <ul className="mt-8 grid gap-5 md:grid-cols-3">
              <li className={CARD_CLASS}>
                <h3 className={CARD_H3}>Ring us</h3>
                <p className={CARD_BODY}>
                  The quickest way, and the only one to use if water is running. A plumber picks up.
                </p>
                <div className="mt-5">
                  <Button
                    as="a"
                    href={CALL_HREF}
                    variant="primary"
                    size="lg"
                    className="nums w-full"
                    data-cta="phone"
                    data-cta-location="contact_page"
                    data-cta-variant="primary_button"
                  >
                    <Phone size={20} weight="fill" aria-hidden />
                    Call {CALL_NUMBER_DISPLAY}
                  </Button>
                </div>
              </li>

              <li className={CARD_CLASS}>
                <h3 className={CARD_H3}>WhatsApp us</h3>
                <p className={CARD_BODY}>{FREE_WHATSAPP_LINE}</p>
                <div className="mt-5">
                  <Button
                    as="a"
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="whatsapp"
                    size="lg"
                    className="w-full"
                    data-cta="whatsapp"
                    data-cta-location="contact_page"
                    data-cta-variant="secondary_button"
                  >
                    <WhatsappLogo size={20} weight="fill" aria-hidden />
                    WhatsApp us
                  </Button>
                </div>
              </li>

              <li className={CARD_CLASS}>
                <h3 className={CARD_H3}>Email us</h3>
                <p className={CARD_BODY}>
                  For paperwork, an invoice, or anything that is not urgent.
                </p>
                <p className="mt-5">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    data-cta="email"
                    data-cta-location="contact_page"
                    data-cta-variant="text_link"
                    className="press inline-flex min-h-[44px] items-center gap-2 break-all text-[15.5px] font-semibold text-brand underline underline-offset-4 hover:text-tint"
                  >
                    <EnvelopeSimple size={18} weight="fill" aria-hidden className="text-tint" />
                    {CONTACT_EMAIL}
                  </a>
                </p>
              </li>
            </ul>
          </div>
        </section>

        <section className="border-t border-line bg-paper-2">
          <div className="mx-auto max-w-content px-5 py-20 sm:px-8 md:py-28">
            <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
              <div>
                <h2 className="font-display text-[clamp(28px,3.4vw,42px)] font-extrabold leading-[1.05] text-brand">
                  Do we come to you?
                </h2>
                <p className="mt-4 max-w-[58ch] text-[16.5px] leading-[1.6] text-slate">
                  We cover {COVERAGE_LINE}
                </p>
                <p className="mt-3 max-w-[58ch] text-[16.5px] leading-[1.6] text-slate">
                  Type your postcode and you get a straight yes or no. If the answer is no, ring
                  anyway and we will tell you who to try.
                </p>
              </div>

              <div className="lg:pt-2">
                <PostcodeCheck />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-paper">
          <div className="mx-auto max-w-content px-5 py-20 sm:px-8 md:py-28">
            <div className="max-w-[62ch] rounded-card border border-line bg-white p-6 shadow-card sm:p-8">
              <h2 className="font-display text-[clamp(22px,2.4vw,28px)] font-extrabold leading-[1.1] text-brand">
                Company details
              </h2>
              <p className="mt-3 text-[15px] leading-[1.7] text-slate">
                {TRADING_NAME} is a trading name of {REGISTERED_NAME}, registered in England &amp;
                Wales.
              </p>
              <p className="nums mt-2 text-[15px] leading-[1.7] text-slate">
                Company number {COMPANY_NUMBER}. Registered office: {REGISTERED_OFFICE}.
              </p>
              <p className="mt-2 text-[15px] leading-[1.7] text-slate">
                That address is the registered office, not a trade counter and not a shop. There is
                nowhere to call in: we work at your address, so ring or message us instead.
              </p>
            </div>
          </div>
        </section>

        <BookingForm heading="Ask us to ring you" formId="contact_booking" />
      </main>

      <Footer />
      <MobileCallBar />
    </div>
  );
}
