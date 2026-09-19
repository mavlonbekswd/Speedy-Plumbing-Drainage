// /guarantee.
//
// The scope leads. Every plumber in this auction says "guaranteed"; none of them says what the
// guarantee covers, and a guarantee with no stated scope is read as covering the materials too.
// It does not. So the first thing under the H1 is the pair of sentences that say what is ours
// and what belongs to the maker of the part, and the four cards repeat it in the negative.
//
// The 12 months start the day the job is done (owner, 19 Sept 2026). It is stated in the
// "For how long" card and the matching FAQ, and nowhere as a date or a deadline.

import type { Metadata } from "next";
import { Phone } from "@phosphor-icons/react/dist/ssr";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import Breadcrumb from "@/components/Breadcrumb";
import BookingForm from "@/components/BookingForm";
import ServiceFAQ from "@/components/ServiceFAQ";
import FAQSchema from "@/components/FAQSchema";
import AnimateIn from "@/components/AnimateIn";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { GUARANTEE_LINE, GUARANTEE_SCOPE_LINE, NIGHT_RATE_LINE, PRICE_PROCESS_LINE } from "@/lib/claims";
import type { Faq } from "@/lib/types";
import { CALL_HREF, CALL_NUMBER_DISPLAY, SITE_URL, TRADING_NAME, openGraphFor } from "@/lib/site";

const TITLE = `Our 12-month workmanship guarantee | ${TRADING_NAME}`;
const DESCRIPTION =
  "Twelve months on our workmanship, and we say what that covers. Materials are covered by their own maker's warranty. Ring the number on your invoice to claim.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/guarantee` },
  openGraph: openGraphFor({ path: "/guarantee", title: TITLE, description: DESCRIPTION }),
  twitter: { card: "summary_large_image" },
};

/** `lead` renders bold, so a reader who reads only the bold still knows what is excluded. */
const NOT_COVERED: { lead: string; rest: string }[] = [
  { lead: "Materials", rest: "are covered by their own maker's warranty." },
  { lead: "A new blockage", rest: "from a different cause." },
  { lead: "Parts you supplied yourself", rest: "and asked us to fit." },
  { lead: "Later work by someone else", rest: "on the same pipework." },
  { lead: "Misuse", rest: "or damage after we left." },
];

const TERMS: { title: string; body?: string; items?: { lead: string; rest: string }[] }[] = [
  {
    title: "What is covered",
    body: "Our workmanship, including hot water cylinder work we carry out. If the work fails because of the way we did it, we come back and put it right.",
  },
  {
    title: "For how long",
    body: "12 months, starting the day the job is done. The same 12 months on every job, whether it took us ten minutes or a full day.",
  },
  { title: "What is not covered", items: NOT_COVERED },
  {
    title: "How to claim",
    body: "Ring the number on your invoice. Tell us what has happened, we book you in, and a plumber comes back to look at it.",
  },
];

const FAQS: Faq[] = [
  {
    q: "What does the guarantee cover?",
    a: "Our workmanship. If a repair, a clearance or an installation we carried out fails because of the way we did the work, we come back and put it right. Materials are covered by their own maker's warranty.",
  },
  {
    q: "How long does it last?",
    a: "12 months on our workmanship, starting the day the job is done. It comes with every job, including hot water cylinder work.",
  },
  {
    q: "What is not covered?",
    a: "Materials, which are covered by their own maker's warranty. Also a new blockage from a different cause, parts you supplied yourself, later work by someone else on the same pipework, and misuse.",
  },
  {
    q: "What should I have ready when I claim?",
    a: "Your invoice, so you have the number to ring and the record of what we did. Say what has gone wrong and when you noticed it, and send a photo on WhatsApp if you can. That tells the plumber what to bring.",
  },
  {
    q: "Does the guarantee affect my legal rights?",
    a: "No. This guarantee is in addition to your statutory rights and does not replace them.",
  },
];

export default function GuaranteePage() {
  return (
    <div className="has-callbar">
      <FAQSchema faqs={FAQS} />
      <Header />

      <main id="main" tabIndex={-1} className="outline-none">
        <section className="bg-paper">
          <div className="mx-auto max-w-content px-5 pb-14 pt-8 sm:px-8 lg:px-12 md:pb-20 md:pt-10">
            <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Guarantee" }]} className="mb-8" />

            <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-tint">Our guarantee</p>

            <h1 className="max-w-[16ch] text-pretty font-display text-[clamp(34px,4.6vw,60px)] font-extrabold leading-[1.02] text-brand">
              Our 12-month guarantee.
            </h1>

            <p className="mt-5 max-w-[58ch] text-[17px] leading-[1.6] text-slate">
              <strong className="font-semibold text-ink">{GUARANTEE_LINE}</strong> {GUARANTEE_SCOPE_LINE}
            </p>

            <p className="mt-3 max-w-[58ch] text-[16px] leading-[1.6] text-slate">
              That is the whole scope, and it is on this page because you should not have to guess at it.
              If our work fails inside the 12 months, we come back and put it right.
            </p>

            <div className="mt-8">
              <Button
                as="a"
                href={CALL_HREF}
                variant="primary"
                size="xl"
                className="nums w-full sm:w-auto"
                data-cta="phone"
                data-cta-location="guarantee_page"
                data-cta-variant="primary_button"
              >
                <Phone size={20} weight="fill" aria-hidden />
                Call {CALL_NUMBER_DISPLAY}
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t border-line bg-paper-2">
          <div className="mx-auto max-w-content px-5 py-20 sm:px-8 md:py-28">
            <AnimateIn>
              <SectionHeading
                eyebrow="The terms"
                title="Four things to know."
                sub="Short, and the same on every job we do."
              />
            </AnimateIn>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {TERMS.map((card, i) => (
                <AnimateIn key={card.title} delay={i * 80} className="h-full">
                  <div className="flex h-full flex-col gap-3 rounded-card border border-line bg-white p-6 shadow-card">
                    <h3 className="font-display text-[19px] font-bold leading-tight text-brand">{card.title}</h3>
                    {card.body ? (
                      <p className="max-w-[52ch] text-[15px] leading-[1.65] text-slate">{card.body}</p>
                    ) : null}
                    {card.items ? (
                      <ul className="flex flex-col gap-2 text-[15px] leading-[1.65] text-slate">
                        {card.items.map((item) => (
                          <li
                            key={item.lead}
                            className="relative pl-4 before:absolute before:left-0 before:top-[0.68em] before:h-1.5 before:w-1.5 before:rounded-pill before:bg-cta-deep"
                          >
                            <strong className="font-semibold text-ink">{item.lead}</strong> {item.rest}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </AnimateIn>
              ))}
            </div>

            <div className="mt-10 flex max-w-[66ch] flex-col gap-3 text-[15.5px] leading-[1.7] text-slate">
              <p>This guarantee is in addition to your statutory rights and does not replace them.</p>
              <p>
                {PRICE_PROCESS_LINE} {NIGHT_RATE_LINE}
              </p>
            </div>
          </div>
        </section>

        <BookingForm heading="Ask us to ring you" formId="guarantee_booking" />

        <ServiceFAQ faqs={FAQS} heading="Questions about the guarantee." tinted />
      </main>

      <Footer />
      <MobileCallBar />
    </div>
  );
}
