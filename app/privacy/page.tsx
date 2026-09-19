// The privacy notice.
//
// This page has one job: describe what this build actually does, no more and no less.
// tests/tracking.spec.ts ("the privacy notice matches what was actually built") holds it to
// that from both directions: it must name PostHog, session recording, Google Ads, Google
// Analytics, Telegram, the United States and the 90 days, and it must never describe a consent
// choice. There is no consent banner on this site and nothing on this page may imply one.
//
// Every sentence below was written from the code, not from a template:
//   components/PosthogProvider.tsx  init options, session recording masking, identifyUser
//   lib/analytics.ts                the events and their properties
//   lib/formTracking.ts             what happens on a form start, submit and success
//   lib/gtag.ts                     what reaches Google, and which parts are hashed
//   lib/clickIds.ts                 the storage key and the 90-day window
//   lib/book.ts + app/api/book      where a booking goes
//   lib/telegram.ts                 that the Telegram message IS the record; no database
//   next.config.ts                  the /ingest proxy to PostHog's US hosts
//
// Deliberately NOT here: MobileCallBar and the `has-callbar` class. A legal notice is reading
// matter, not a landing page, and the bar is held off it by the same decision that keeps the
// price-process line off it (tests/excluded-copy.spec.ts).

import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import StaticHero from "@/components/static/StaticHero";
import { CLICK_ID_STORAGE_KEY } from "@/lib/clickIds";
import { FALLBACK_HERO } from "@/lib/media";
import { STATIC_ROUTE_BY_PATH } from "@/lib/routes";
import {
  COMPANY_NUMBER,
  CONTACT_EMAIL,
  REGISTERED_NAME,
  REGISTERED_OFFICE,
  SITE_URL,
  TRADING_NAME,
  openGraphFor,
} from "@/lib/site";

const TITLE = `Privacy notice | ${TRADING_NAME}`;

const DESCRIPTION =
  "What we do with the details you send us, what this website measures while you read it, who " +
  "receives that, and how to ask us for a copy or to delete it.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/privacy` },
  openGraph: openGraphFor({ path: "/privacy", title: TITLE, description: DESCRIPTION }),
  twitter: { card: "summary_large_image" },
  // Out of the index, but the links on it are worth following.
  robots: { index: false, follow: true },
};

const LAST_UPDATED = "19 September 2026";

/** A link is only offered when the page behind it is live, so no link here is ever a 404. */
function publishedHref(path: string): string | undefined {
  return STATIC_ROUTE_BY_PATH[path]?.published ? path : undefined;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-10 first:border-t-0">
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

export default function PrivacyPage() {
  const termsHref = publishedHref("/terms");

  return (
    <div>
      <Header />

      <main id="main" tabIndex={-1} className="outline-none">
        {/* The heading block is the shared hero, so the backdrop sits behind the first screen and
            not behind the whole notice. Everything below it stays plain reading matter.

            Both button flags are off, deliberately. This page has no call bar and no primary
            action for the same reason it carries no price-process line: a legal notice is
            reading matter, not a landing page. */}
        <StaticHero
          image={FALLBACK_HERO}
          crumbs={<Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Privacy notice" }]} />}
          eyebrow="Legal"
          h1="Privacy notice."
          ctaLocation="privacy_page"
          showCall={false}
          showWhatsApp={false}
          sub={
            <>
              <p className="text-[14px] font-medium text-steel">Last updated: {LAST_UPDATED}</p>
              <p>
                This page says what happens to your details when you ring us, send us a message or fill in
                a form, and what this website records while you read it. It is written to match the site as
                it is built, not as a general statement of intent.
              </p>
            </>
          }
        />

        <section className="border-t border-line bg-paper-2">
          <div className="mx-auto max-w-content px-5 pb-14 sm:px-8 md:pb-20">
            <Section title="Who we are">
              <p>
                <Lead>{REGISTERED_NAME} is the controller of your data.</Lead> It trades as {TRADING_NAME}.
              </p>
              <ul className="flex list-none flex-col gap-1 rounded-card border border-line bg-white p-6 text-[15.5px] text-ink shadow-card">
                <li>Registered in England and Wales, company number {COMPANY_NUMBER}.</li>
                <li>Registered office: {REGISTERED_OFFICE}.</li>
                <li>
                  Email:{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    data-cta="email"
                    data-cta-location="privacy_page"
                    data-cta-variant="text_link"
                    className="font-semibold text-brand underline underline-offset-2 hover:text-tint"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </li>
              </ul>
              <p>
                We are a small plumbing business and we have no data protection officer. Write to the
                address above and one of us reads it.
              </p>
            </Section>

            <Section title="What we collect, and why">
              <p>
                <Lead>What you type into a form.</Lead> Your name, your phone number and your postcode.
                An email address, a description of the problem and photos are optional. We use all of it to
                ring you back, work out what the job needs and do the work. Photos are shrunk in your own
                browser before they are sent, and at most four of them go through.
              </p>
              <p>
                <Lead>How you use the site.</Lead> Our analytics provider records all of this from the
                first page you open:
              </p>
              <ul className="flex list-disc flex-col gap-2 pl-5">
                <li>The pages you look at, and how long you spend on them.</li>
                <li>Taps on the call, WhatsApp and booking buttons, and where on the page they sat.</li>
                <li>How far down you scroll, and how long before you do anything at all.</li>
                <li>Whether you start a form, and whether you finish it.</li>
                <li>The postcode area you type into the coverage check, never the full postcode.</li>
                <li>Your device, your browser and how quickly pages loaded.</li>
                <li>An approximate location, worked out from your IP address.</li>
              </ul>
              <p>
                A record is kept for every visitor, so separate visits by the same person join up as one
                thread. When you submit a form, your phone number becomes the reference for that record,
                along with your name and your email address if you gave one.
              </p>
              <p>
                <Lead>Advertising identifiers.</Lead> If you arrive from one of our Google adverts, the
                click identifier on the link (gclid, gbraid or wbraid) and the page you landed on are kept
                in your browser and sent with any booking you make.
              </p>
            </Section>

            <Section title="Who receives it">
              <p>We do not sell your details. These are the companies that receive them:</p>
              <p>
                <Lead>Telegram.</Lead> Your booking, including any photos, is delivered as a message to our
                business group on Telegram. That message is the only copy of your booking: this website
                stores nothing in a database.
              </p>
              <p>
                <Lead>PostHog.</Lead> Product analytics and session recording. Your visit is recorded as a
                replay, with everything you type into a form masked in the recording. PostHog also receives
                your name and phone number, and your email address if you gave one, when you submit a form,
                so a booking can be matched to the visit it came from. PostHog is hosted in the United
                States.
              </p>
              <p>
                <Lead>Google Ads and Google Analytics.</Lead> Page views and conversions. When you submit a
                booking, your phone number, your name, and your email address if you gave one, are sent to
                Google only as SHA-256 hashes, never in plain text, together with your postcode and country,
                which are sent as they are. If you
                arrived from one of our adverts, Google may show you a forwarding number in place of ours so
                it can count the call.
              </p>
              <p>
                <Lead>Vercel.</Lead> Hosts this website and handles every request to it, which includes your
                IP address.
              </p>
            </Section>

            <Section title="Where it goes outside the UK">
              <p>
                <Lead>PostHog, Google, Telegram and Vercel all process data outside the UK, including in
                the United States.</Lead> Those transfers rely on the safeguards each of those providers
                offers for international transfers, under their own terms with us.
              </p>
              <p>
                We cannot offer you a UK-only version of this site. If that matters to you, ring us instead
                of using the forms.
              </p>
            </Section>

            <Section title="Cookies and storage on your device">
              <p>
                <Lead>From the first page you open, this site sets analytics and advertising cookies and
                writes entries into your browser storage.</Lead> There are three sets:
              </p>
              <ul className="flex list-disc flex-col gap-2 pl-5">
                <li>
                  PostHog, with names beginning <code className="text-[15px] text-ink">ph_</code>. Its
                  requests are routed through our own domain rather than sent straight to PostHog.
                </li>
                <li>
                  Google, with names beginning <code className="text-[15px] text-ink">_ga</code> and{" "}
                  <code className="text-[15px] text-ink">_gcl_</code>.
                </li>
                <li>
                  Our own storage entry,{" "}
                  <code className="text-[15px] text-ink">{CLICK_ID_STORAGE_KEY}</code>, which holds a Google
                  click identifier for 90 days so that a booking can be attributed to the advert that led to
                  it.
                </li>
              </ul>
              <p>
                You can clear or block all of them in your browser settings, under cookies and site data for
                this site. Blocking them does not stop the site working, and it does not stop you ringing us
                or sending a message on WhatsApp.
              </p>
            </Section>

            <Section title="Our legal bases">
              <p>
                We handle the details you type into a form to take steps, at your request, towards a
                contract with you, and then to carry that work out. We handle the site-usage and
                advertising data under our legitimate interests in running the business and in knowing which
                pages and which adverts produce real work. You can object to the second of those at any
                time.
              </p>
            </Section>

            <Section title="How long we keep it">
              <p>
                <Lead>Your booking message stays in our Telegram group until somebody deletes it.</Lead> The
                group is the record, so there is no separate file to delete. Ask us and we will remove the
                message.
              </p>
              <p>
                Analytics data is held by PostHog and by Google under their own retention settings. Those
                periods are set by them rather than by us, so we will not put a number here that we do not
                control.
              </p>
              <p>
                The Google click identifier in your browser lasts 90 days, or until you clear your site
                data, whichever comes first.
              </p>
            </Section>

            <Section title="Your rights">
              <p>
                <Lead>You can ask us for a copy of what we hold about you.</Lead> You can also ask us to
                correct it, to delete it, to stop or restrict what we do with it, to hand it to you in a
                portable form, or to object to us using it at all.
              </p>
              <p>
                Email{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  data-cta="email"
                  data-cta-location="privacy_page"
                  data-cta-variant="text_link"
                  className="font-semibold text-brand underline underline-offset-2 hover:text-tint"
                >
                  {CONTACT_EMAIL}
                </a>{" "}
                and tell us what you want. The law gives us one month to answer. Tell us the phone number
                you gave us, because that is how a booking is found.
              </p>
              <p>
                If you are not happy with our answer, you can complain to the Information Commissioner&apos;s
                Office at{" "}
                <a
                  href="https://ico.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta="nav"
                  data-cta-location="privacy_page"
                  data-cta-variant="text_link"
                  className="font-semibold text-brand underline underline-offset-2 hover:text-tint"
                >
                  ico.org.uk
                </a>
                . You do not have to raise it with us first, though we would rather you did.
              </p>
            </Section>

            <Section title="Changes to this notice">
              <p>
                We update this page whenever the site changes what it collects or who receives it. The date
                at the top is the date of the version you are reading. There is no archive of earlier
                versions.
              </p>
              {termsHref && (
                <p>
                  Our{" "}
                  <a
                    href={termsHref}
                    data-cta="nav"
                    data-cta-location="privacy_page"
                    data-cta-variant="text_link"
                    className="font-semibold text-brand underline underline-offset-2 hover:text-tint"
                  >
                    website terms
                  </a>{" "}
                  cover the use of this site itself.
                </p>
              )}
            </Section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
