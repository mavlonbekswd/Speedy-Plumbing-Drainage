// Website terms of use, and nothing more.
//
// The deliberate limit: this page governs the USE OF THIS WEBSITE. It sets no term of any job.
// There is no cancellation fee, no deposit, no call-out fee, no minimum charge, no payment
// deadline, no late-payment interest and no liability cap on this site, because none of those
// has been settled by the owner and a page that invented one would be inventing a contract the
// business does not have. Wherever a reader would expect such a term, the honest answer is the
// one below: the terms of a job are agreed with you directly before work starts.
//
// Every shared sentence comes from lib/claims.ts (PRICE_PROCESS_LINE, GUARANTEE_LINE with its
// scope, PAYMENT_ANSWER) so that a change of fact is a change in one file.

import type { Metadata } from "next";
import { Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import Breadcrumb from "@/components/Breadcrumb";
import HeroBackdrop from "@/components/HeroBackdrop";
import Button from "@/components/ui/Button";
import { FALLBACK_HERO } from "@/lib/media";
import {
  ANSWERED_LINE,
  GUARANTEE_LINE,
  GUARANTEE_SCOPE_LINE,
  PAYMENT_ANSWER,
  PRICE_PROCESS_LINE,
} from "@/lib/claims";
import { STATIC_ROUTE_BY_PATH } from "@/lib/routes";
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

const TITLE = `Website terms | ${TRADING_NAME}`;

const DESCRIPTION =
  "The terms for using this website: what the pages tell you, what they do not, and how the " +
  "price and terms of any job are agreed with you before work starts.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/terms` },
  openGraph: openGraphFor({ path: "/terms", title: TITLE, description: DESCRIPTION }),
  twitter: { card: "summary_large_image" },
};

const LAST_UPDATED = "19 September 2026";

/** A link is only offered when the page behind it is live, so no link here is ever a 404. */
function publishedHref(path: string): string | undefined {
  return STATIC_ROUTE_BY_PATH[path]?.published ? path : undefined;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-10">
      <h2 className="font-display text-[clamp(22px,2.4vw,30px)] font-extrabold leading-[1.15] text-brand">
        {title}
      </h2>
      <div className="mt-4 flex max-w-[64ch] flex-col gap-3 text-[16.5px] leading-[1.65] text-slate">
        {children}
      </div>
    </section>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-ink">{children}</strong>;
}

export default function TermsPage() {
  const guaranteeHref = publishedHref("/guarantee");
  const privacyHref = publishedHref("/privacy");
  const projectsHref = publishedHref("/projects");

  return (
    <div className="has-callbar">
      <Header />

      <main id="main" tabIndex={-1} className="outline-none">
        {/* The heading block is its own section so the backdrop sits behind the first screen and
            not behind three hundred lines of legal text. Everything below it stays plain. */}
        <section className="relative isolate overflow-hidden bg-paper">
          <HeroBackdrop image={FALLBACK_HERO} />

          <div className="mx-auto max-w-content px-5 pb-12 pt-16 sm:px-8 md:pb-14 md:pt-20">
            <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Website terms" }]} className="mb-8" />

            <h1 className="max-w-[18ch] text-pretty font-display text-[clamp(34px,4.6vw,60px)] font-extrabold leading-[1.02] text-brand">
              Website terms.
            </h1>
            <p className="mt-5 text-[14px] font-medium text-steel">Last updated: {LAST_UPDATED}</p>
            <p className="mt-6 max-w-[64ch] text-[16.5px] leading-[1.65] text-slate">
              These terms cover your use of this website. They do not set the terms of a plumbing job. The
              terms of any job are agreed with you directly, before work starts.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                as="a"
                href={CALL_HREF}
                variant="primary"
                size="lg"
                className="nums w-full sm:w-auto"
                data-cta="phone"
                data-cta-location="terms_page"
                data-cta-variant="primary_button"
              >
                <Phone size={18} weight="fill" aria-hidden />
                Call {CALL_NUMBER_DISPLAY}
              </Button>
              <Button
                as="a"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="whatsapp"
                size="lg"
                className="w-full sm:w-auto"
                data-cta="whatsapp"
                data-cta-location="terms_page"
                data-cta-variant="secondary_button"
              >
                <WhatsappLogo size={20} weight="fill" aria-hidden />
                WhatsApp us
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-paper">
          <div className="mx-auto max-w-content px-5 pb-16 sm:px-8 md:pb-20">
            <Section title="Who runs this site">
              <p>
                <Lead>This site is run by {REGISTERED_NAME}, which trades as {TRADING_NAME}.</Lead> It is
                registered in England and Wales under company number {COMPANY_NUMBER}, at{" "}
                {REGISTERED_OFFICE}.
              </p>
              <p>
                By using the site you accept these terms. If you do not accept them, ring us on{" "}
                <a
                  href={CALL_HREF}
                  data-cta="phone"
                  data-cta-location="terms_page"
                  data-cta-variant="text_link"
                  className="nums font-semibold text-brand underline underline-offset-2 hover:text-tint"
                >
                  {CALL_NUMBER_DISPLAY}
                </a>{" "}
                instead and we will take it from there.
              </p>
            </Section>

            <Section title="What the pages here tell you">
              <p>
                <Lead>The information on this site is general.</Lead> It describes the kind of work we do
                and how we go about it. It is not advice about your particular property, your pipework or
                your drains, and nobody has looked at them.
              </p>
              <p>
                So do not act on a page here as though a plumber had seen the job. Ring us, describe what is
                happening, and you get an answer about your house rather than about houses in general.
              </p>
              <p>
                Some pictures on this site are representative and do not show our own jobs. Every photo and
                clip on{" "}
                {projectsHref ? (
                  <a
                    href={projectsHref}
                    data-cta="nav"
                    data-cta-location="terms_page"
                    data-cta-variant="text_link"
                    className="font-semibold text-brand underline underline-offset-2 hover:text-tint"
                  >
                    our work page
                  </a>
                ) : (
                  "our work page"
                )}{" "}
                is from our own jobs.
              </p>
            </Section>

            <Section title="What the site says about price">
              <p>
                <Lead>{PRICE_PROCESS_LINE}</Lead>
              </p>
              <p>
                Nothing on this site is a quote, an estimate or an offer to do work at a stated figure. The
                price for any job is the one agreed with you before work starts, and it is agreed with you
                and not on this page.
              </p>
            </Section>

            <Section title="Our guarantee">
              <p>
                <Lead>{GUARANTEE_LINE}</Lead> {GUARANTEE_SCOPE_LINE}
              </p>
              <p>
                It sits on top of your rights under consumer law and takes nothing away from them. Nothing
                in these terms limits the rights the law gives you as a consumer.
              </p>
              {guaranteeHref && (
                <p>
                  What it covers, for how long, what it does not cover and how to claim are set out on our{" "}
                  <a
                    href={guaranteeHref}
                    data-cta="nav"
                    data-cta-location="terms_page"
                    data-cta-variant="text_link"
                    className="font-semibold text-brand underline underline-offset-2 hover:text-tint"
                  >
                    guarantee page
                  </a>
                  .
                </p>
              )}
            </Section>

            <Section title="How you pay">
              <p>
                <Lead>{PAYMENT_ANSWER.lead}</Lead> {PAYMENT_ANSWER.rest}
              </p>
              <p>
                This site takes no payment and holds no card details. Nothing is paid through these pages.
              </p>
            </Section>

            <Section title="Photos you send us">
              <p>
                <Lead>A photo is used to understand and price the job, and for nothing else.</Lead> It stays
                yours. Sending one gives us permission to look at it, pass it to the plumber who will do the
                work and keep it with your booking.
              </p>
            </Section>

            <Section title="The terms of the job itself">
              <p>
                <Lead>They are agreed with you directly, before work starts.</Lead> When we come, what is
                included, what happens if you need to move the day, what we do if the job turns out to be
                something else: all of it is settled with you on the phone or on site.
              </p>
              <p>
                This website does not set any of it, and nothing on it should be read as a term of your job.
              </p>
            </Section>

            <Section title="What is on this site belongs to us">
              <p>
                <Lead>The words, the layout, the photographs and the video on this site are ours.</Lead> You
                are welcome to read them, print a page and send a link to anyone.
              </p>
              <p>
                Do not copy the content onto another website, into a listing or into your own marketing. The
                job photographs are of our own work and are not stock pictures to be reused.
              </p>
            </Section>

            <Section title="Links to other sites">
              <p>
                <Lead>A few links here go somewhere we do not run.</Lead> WhatsApp is the obvious one. We
                have no control over those sites and we are not responsible for what they do with your
                visit or what they show you.
              </p>
            </Section>

            <Section title="When the site is not available">
              <p>
                <Lead>We keep this site up as much as we can, but we do not promise it is always
                available.</Lead> Pages can be down for maintenance, a form can fail, and a hosting fault can
                take the whole thing off the air for a while.
              </p>
              <p>
                If that happens, ring us on{" "}
                <a
                  href={CALL_HREF}
                  data-cta="phone"
                  data-cta-location="terms_page"
                  data-cta-variant="text_link"
                  className="nums font-semibold text-brand underline underline-offset-2 hover:text-tint"
                >
                  {CALL_NUMBER_DISPLAY}
                </a>
                . The number works whether or not the website does.
              </p>
            </Section>

            <Section title="Which law applies">
              <p>
                <Lead>These terms are governed by the law of England and Wales.</Lead> Any dispute about
                them, or about your use of this site, goes to the courts of England and Wales.
              </p>
              <p>
                We may change these terms when the site changes. The date at the top is the date of the
                version you are reading.
              </p>
            </Section>

            <Section title="How to reach us">
              <p>
                <Lead>Ring us, message us on WhatsApp, or email us.</Lead> {ANSWERED_LINE} The phone is
                still the fastest way to get an answer about a job.
              </p>
              <p>
                Phone{" "}
                <a
                  href={CALL_HREF}
                  data-cta="phone"
                  data-cta-location="terms_page"
                  data-cta-variant="text_link"
                  className="nums font-semibold text-brand underline underline-offset-2 hover:text-tint"
                >
                  {CALL_NUMBER_DISPLAY}
                </a>{" "}
                or email{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  data-cta="email"
                  data-cta-location="terms_page"
                  data-cta-variant="text_link"
                  className="font-semibold text-brand underline underline-offset-2 hover:text-tint"
                >
                  {CONTACT_EMAIL}
                </a>
                . Our registered office is given at the top of this page and in the footer of every page.
              </p>
              {privacyHref && (
                <p>
                  What we do with your details is set out in our{" "}
                  <a
                    href={privacyHref}
                    data-cta="nav"
                    data-cta-location="terms_page"
                    data-cta-variant="text_link"
                    className="font-semibold text-brand underline underline-offset-2 hover:text-tint"
                  >
                    privacy notice
                  </a>
                  .
                </p>
              )}
            </Section>
          </div>
        </section>
      </main>

      <Footer />
      <MobileCallBar />
    </div>
  );
}
