// /quote. The six-step wizard and almost nothing else.
//
// One form on the page, on purpose: the wizard's own submit button carries the same label as the
// booking form's, so a second form here would give a reader, and the test suite, two buttons with
// one name. The only other actions are the phone, for the person who should not be filling in a
// form at all, and WhatsApp for the photo quote.
//
// Nothing here reads the request, so the page is a static file.

import type { Metadata } from "next";
import { Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import Breadcrumb from "@/components/Breadcrumb";
import QuoteWizard from "@/components/QuoteWizard";
import Button from "@/components/ui/Button";
import {
  ANSWERED_LINE,
  FORM_COPY,
  FREE_WHATSAPP_LINE,
  PRICE_PROCESS_LINE,
} from "@/lib/claims";
import { PUBLISHED_SERVICES } from "@/lib/services";
import {
  CALL_HREF,
  CALL_NUMBER_DISPLAY,
  SITE_URL,
  TRADING_NAME,
  WHATSAPP_URL,
  openGraphFor,
} from "@/lib/site";

const PATH = "/quote";

const TITLE = `Ask Us to Ring You | Plumbing Quote | ${TRADING_NAME}`;

const DESCRIPTION = `Tell us what is wrong in six short steps and we will ring you back. ${PRICE_PROCESS_LINE}`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: openGraphFor({ path: PATH, title: TITLE, description: DESCRIPTION }),
  twitter: { card: "summary_large_image" },
};

/** The one thing that should stop somebody filling in a form. It stands above the wizard. */
const CEILING_LINE = "If water is coming through the ceiling, ring us now instead of filling this in.";

export default function QuotePage() {
  return (
    <div className="has-callbar">
      <Header />

      <main id="main" tabIndex={-1} className="outline-none">
        <section className="bg-paper">
          <div className="mx-auto max-w-content px-5 pb-16 pt-10 sm:px-8 lg:px-12 lg:pb-20 lg:pt-14">
            <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Ask us to ring you" }]} className="mb-8" />

            <h1 className="max-w-[18ch] text-pretty font-display text-[clamp(34px,4.6vw,60px)] font-extrabold leading-[1.02] text-brand">
              {FORM_COPY.full.heading}
            </h1>

            <p className="mt-6 max-w-[58ch] text-[16.5px] leading-[1.6] text-slate">{CEILING_LINE}</p>

            <div className="mt-6">
              <Button
                as="a"
                href={CALL_HREF}
                variant="primary"
                size="xl"
                className="nums w-full sm:w-auto"
                data-cta="phone"
                data-cta-location="quote_page"
                data-cta-variant="primary_button"
              >
                <Phone size={20} weight="fill" aria-hidden />
                Call {CALL_NUMBER_DISPLAY}
              </Button>
            </div>

            <div className="mt-8 flex max-w-[58ch] flex-col gap-2 text-[16.5px] leading-[1.6] text-slate">
              <p>{PRICE_PROCESS_LINE}</p>
              <p>{ANSWERED_LINE}</p>
            </div>
          </div>
        </section>

        <section className="border-t border-line bg-paper-2">
          <div className="mx-auto max-w-content px-5 py-20 sm:px-8 md:py-28">
            <QuoteWizard intro={false} services={PUBLISHED_SERVICES.map((service) => ({ value: service.slug, label: service.navLabel }))} />
          </div>
        </section>

        <section className="bg-paper">
          <div className="mx-auto max-w-content px-5 py-20 sm:px-8 md:py-28">
            <div className="max-w-[62ch] rounded-card border border-line bg-white p-6 shadow-card sm:p-8">
              <h2 className="font-display text-[clamp(22px,2.4vw,28px)] font-extrabold leading-[1.1] text-brand">
                Rather send a photo?
              </h2>
              <p className="mt-3 text-[16px] leading-[1.7] text-slate">{FREE_WHATSAPP_LINE}</p>

              <div className="mt-5">
                <Button
                  as="a"
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="whatsapp"
                  size="lg"
                  className="w-full sm:w-auto"
                  data-cta="whatsapp"
                  data-cta-location="quote_page"
                  data-cta-variant="secondary_button"
                >
                  <WhatsappLogo size={20} weight="fill" aria-hidden />
                  WhatsApp us
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileCallBar />
    </div>
  );
}
