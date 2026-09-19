// /reviews.
//
// HAS_REVIEWS is false, so this page shows no rating, no count, no stars and no sample review.
// The idea is BeBest's ReviewsEmptyState; the five grey stars it draws are not carried over,
// because a row of stars is a rating shape whether or not a number sits beside it.
//
// The branch is driven by the constant rather than by deleting the page, so the day real
// reviews clear the floor the unit that adds them flips HAS_REVIEWS and fills the other arm.
// Until then what stands here is the honest answer plus the three things a caller can actually
// weigh today.
//
// Static: nothing is read from the request.

import type { Metadata } from "next";
import { Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import Breadcrumb from "@/components/Breadcrumb";
import BookingForm from "@/components/BookingForm";
import AnimateIn from "@/components/AnimateIn";
import Button from "@/components/ui/Button";
import {
  ANSWERED_LINE,
  GUARANTEE_LINE,
  GUARANTEE_SCOPE_LINE,
  HAS_REVIEWS,
  NIGHT_RATE_LINE,
  PRICE_PROCESS_LINE,
} from "@/lib/claims";
import { STATIC_ROUTE_BY_PATH } from "@/lib/routes";
import { CALL_HREF, CALL_NUMBER_DISPLAY, SITE_URL, TRADING_NAME, WHATSAPP_URL, openGraphFor } from "@/lib/site";

const TITLE = `Reviews | ${TRADING_NAME}`;
const DESCRIPTION =
  "We are a new company and have no review history worth showing you yet, so we show none. Here is what you can weigh us on today, and the number to ring.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/reviews` },
  openGraph: openGraphFor({ path: "/reviews", title: TITLE, description: DESCRIPTION }),
  twitter: { card: "summary_large_image" },
};

const guaranteeHref = STATIC_ROUTE_BY_PATH["/guarantee"]?.published ? "/guarantee" : undefined;

export default function ReviewsPage() {
  return (
    <div className="has-callbar">
      <Header />

      <main id="main" tabIndex={-1} className="outline-none">
        <section className="bg-paper">
          <div className="mx-auto max-w-content px-5 pb-14 pt-8 sm:px-8 lg:px-12 md:pb-20 md:pt-10">
            <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Reviews" }]} className="mb-8" />

            <h1 className="max-w-[16ch] text-pretty font-display text-[clamp(34px,4.6vw,60px)] font-extrabold leading-[1.02] text-brand">
              Reviews.
            </h1>

            {HAS_REVIEWS ? null : (
              <p className="mt-5 max-w-[62ch] text-[17px] leading-[1.7] text-slate">
                We are a new company, and we have not built up a history you could usefully read. We
                would rather show you nothing than something we cannot stand behind, so this page
                stays empty until there is enough here to be worth your time.
              </p>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                as="a"
                href={CALL_HREF}
                variant="primary"
                size="xl"
                className="nums w-full sm:w-auto"
                data-cta="phone"
                data-cta-location="reviews_page"
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
                data-cta-location="reviews_page"
                data-cta-variant="secondary_button"
              >
                <WhatsappLogo size={22} weight="fill" aria-hidden />
                WhatsApp us
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t border-line bg-paper-2">
          <div className="mx-auto max-w-content px-5 py-20 sm:px-8 md:py-28">
            <AnimateIn>
              <h2 className="max-w-[20ch] text-pretty font-display text-[clamp(28px,3.4vw,42px)] font-extrabold leading-[1.05] text-brand">
                What you can judge us on today.
              </h2>
            </AnimateIn>

            <AnimateIn delay={80}>
              <div className="mt-8 flex max-w-[66ch] flex-col gap-4 text-[16.5px] leading-[1.75] text-slate">
                <p>{ANSWERED_LINE}</p>
                <p>
                  {PRICE_PROCESS_LINE} {NIGHT_RATE_LINE}
                </p>
                <p>
                  {guaranteeHref ? (
                    <a
                      href={guaranteeHref}
                      data-cta="nav"
                      data-cta-location="reviews_page"
                      data-cta-variant="text_link"
                      className="font-semibold text-brand underline underline-offset-4"
                    >
                      {GUARANTEE_LINE}
                    </a>
                  ) : (
                    <strong className="font-semibold text-ink">{GUARANTEE_LINE}</strong>
                  )}{" "}
                  {GUARANTEE_SCOPE_LINE}
                </p>
                <p>
                  Ring and ask us anything you would have wanted a stranger to tell you. You will get a
                  plumber on the line, not a script, and you can decide from there.
                </p>
              </div>
            </AnimateIn>
          </div>
        </section>

        <BookingForm heading="Ask us to ring you" formId="reviews_booking" />
      </main>

      <Footer />
      <MobileCallBar />
    </div>
  );
}
