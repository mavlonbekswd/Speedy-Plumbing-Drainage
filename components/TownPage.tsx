// The one template every /areas/<slug> page renders. It is the service page's shape with the
// town written into it, because a town keyword's Final URL has to answer the same questions the
// service page answers and then prove it knows the place.
//
// Two rules make this file worth its existence rather than a copy of the service template:
//
//   1. the H1 puts the town INSIDE the question, so no line of it reads as a bare fragment;
//   2. the page carries the pinned lines of both town-keyword ad groups, through
//      TownServicesBlock, which is what makes any published town page a safe Final URL.
//
// A server component. `lead` is the emergency service leaf: its answers, steps, problems and
// proof are reused here, and the town's own sentences come from the City leaf.

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import Breadcrumb from "@/components/Breadcrumb";
import ServiceHero from "@/components/ServiceHero";
import TickChips from "@/components/TickChips";
import StraightAnswers from "@/components/StraightAnswers";
import ProblemGrid from "@/components/ProblemGrid";
import TownAreaBlock from "@/components/TownAreaBlock";
import TownServicesBlock from "@/components/TownServicesBlock";
import CTABand from "@/components/CTABand";
import HowItWorks from "@/components/HowItWorks";
import BookingForm from "@/components/BookingForm";
import CallbackInline from "@/components/CallbackInline";
import ProofStrip from "@/components/ProofStrip";
import ServiceFAQ from "@/components/ServiceFAQ";
import ClosingBand from "@/components/ClosingBand";
import FAQSchema from "@/components/FAQSchema";
import { TOWN_CLOSING, TOWN_CTA_BAND, URGENT_GRID_NOTE } from "@/lib/claims";
import { townCoverFaq } from "@/lib/faqs";
import { PUBLISHED_SERVICES } from "@/lib/services";
import { STATIC_ROUTE_BY_PATH } from "@/lib/routes";
import { TOWN_AD_LINES } from "@/content/ads";
import type { Answer, City, ServiceContent } from "@/lib/types";
import { placeOf } from "@/lib/towns";

/** The most any page shows, so the schema and the accordion can never disagree about the set. */
const MAX_TOWN_FAQS = 5;

/** A link is only offered when the page behind it is live, so no crumb is ever a 404. */
function publishedHref(path: string): string | undefined {
  return STATIC_ROUTE_BY_PATH[path]?.published ? path : undefined;
}

/**
 * The service answers say "your postcode". On a town page that becomes "your Cambridge
 * postcode", which is the sentence the page owns and nothing else on the site has. Every field
 * of the card is rewritten, and every occurrence in it, so a leaf that moves the phrase from
 * `rest` into `q` later does not quietly lose the town.
 */
function localise(answers: readonly Answer[], town: string): Answer[] {
  const swap = (text: string) => text.split("your postcode").join(`your ${town} postcode`);
  return answers.map((answer) => ({
    q: swap(answer.q),
    lead: swap(answer.lead),
    rest: swap(answer.rest),
  }));
}

export default function TownPage({ city, lead }: { city: City; lead: ServiceContent }) {
  const place = placeOf(city);
  const headline = lead.townH1!(place);
  const answers = localise(lead.answers, place);
  const areasHref = publishedHref("/areas-we-cover");
  const guaranteeHref = publishedHref("/guarantee");

  // The town's own question leads, then the service's, and the set is capped: one list, passed
  // to both the accordion and the schema, so the page can never mark up an answer it hides.
  const faqs = [townCoverFaq(city.name, city.county, city.placeLabel), ...lead.faqs.slice(0, 4)].slice(0, MAX_TOWN_FAQS);

  return (
    <div className="has-callbar">
      <FAQSchema faqs={faqs} />
      <Header />

      <main id="main" tabIndex={-1} className="outline-none">
        <ServiceHero
          crumbs={
            <Breadcrumb
              items={[
                { name: "Home", href: "/" },
                { name: "Areas we cover", href: areasHref },
                { name: city.name },
              ]}
            />
          }
          eyebrow={`Emergency plumber in ${place}, day or night`}
          h1Top={headline.top}
          h1Bottom={headline.bottom}
          // The town blurb renders in TownAreaBlock, not here: hero copy at 390x844 is budgeted at
          // 60 words and the longest town H1 already spends more of it than the service page does.
          sub=""
          urgent
          aside={
            <CallbackInline
              formId={`area_${city.slug}_hero`}
              service={lead.slug}
              idPrefix={`area_${city.slug}_hero`}
            />
          }
        />

        <TickChips guaranteeHref={guaranteeHref} />

        <StraightAnswers answers={answers} after={lead.afterAnswers} tinted={false} />

        <ProblemGrid
          heading={`${lead.navLabel} in ${place}.`}
          sub={lead.problems.sub}
          cards={lead.problems.cards}
          note={URGENT_GRID_NOTE}
          tinted
        />

        <TownAreaBlock city={city} tinted={false} />

        {/* Carries the pinned lines of the Emergency and Drain Cleaning ads, verbatim and always
            visible, which is what lets a town keyword point here. */}
        <TownServicesBlock city={city} services={PUBLISHED_SERVICES} adLines={TOWN_AD_LINES} tinted />

        <CTABand {...TOWN_CTA_BAND(place)} />

        <HowItWorks steps={lead.steps} tinted={false} />

        <BookingForm
          heading={`Book a plumber in ${place}`}
          formId={`area_${city.slug}_booking`}
          service={lead.slug}
        />

        <ProofStrip photoSlugs={lead.proof.photos} videoSlug={lead.proof.video} tinted={false} />

        <ServiceFAQ faqs={faqs} tinted />

        <ClosingBand {...TOWN_CLOSING(place)} />
      </main>

      <Footer />
      <MobileCallBar />
    </div>
  );
}
