// The one template every /services/<slug> page renders. A service page is an ad landing page
// first and a piece of reading second, so the order at the top is fixed: hero, the ticks, then
// the eight answer cards. Nothing may be inserted before them.
//
// Reshaped on 19 September 2026 after the owner's review ("very text heavy", "the page is very
// long"). Three things changed and all three are template-wide, so all nine service pages moved
// together:
//
//   1. the pictures come up the page. The problem illustrations now sit BESIDE the problem grid
//      instead of a row of their own further down, and the proof strip of real job photos
//      lands in the middle of the page rather than near the foot;
//   2. the boxed "In plain words" card is gone. Its sentences are the pinned ad descriptions and
//      they stay, verbatim, folded into ordinary copy by `placeAdLines` in lib/claims.ts;
//   3. every section this template owns is rendered `compact`, which is a shorter vertical
//      rhythm and no lost words. Other pages keep the taller one.
//
// A server component with no state of its own. Everything it shows comes from the leaf it is
// handed, so a copy change is a content change and never a template change.

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import Breadcrumb from "@/components/Breadcrumb";
import ServiceHero from "@/components/ServiceHero";
import TickChips from "@/components/TickChips";
import StraightAnswers from "@/components/StraightAnswers";
import ProblemGrid from "@/components/ProblemGrid";
import ContentSections from "@/components/ContentSections";
import CTABand from "@/components/CTABand";
import HowItWorks from "@/components/HowItWorks";
import BookingForm from "@/components/BookingForm";
import CallbackInline from "@/components/CallbackInline";
import ProofStrip from "@/components/ProofStrip";
import TownsByCounty from "@/components/TownsByCounty";
import ServiceFAQ from "@/components/ServiceFAQ";
import ClosingBand from "@/components/ClosingBand";
import FAQSchema from "@/components/FAQSchema";
import { placeAdLines, URGENT_GRID_NOTE } from "@/lib/claims";
import { FALLBACK_HERO, HERO_IMAGE_BY_KEY, type HeroImageKey } from "@/lib/media";
import { STATIC_ROUTE_BY_PATH } from "@/lib/routes";
import type { ServiceContent } from "@/lib/types";
import IllustrationRow from "@/components/IllustrationRow";

/** A link is only offered when the page behind it is live, so no crumb is ever a 404. */
function publishedHref(path: string): string | undefined {
  return STATIC_ROUTE_BY_PATH[path]?.published ? path : undefined;
}

/**
 * Every published slug has a hero photograph of its own. The lookup is guarded rather than cast,
 * so a slug published before its picture exists falls back to the workbench instead of handing
 * HeroBackdrop an undefined file and blanking the first screen.
 */
function heroImageFor(slug: string): HeroImageKey {
  return Object.hasOwn(HERO_IMAGE_BY_KEY, slug) ? (slug as HeroImageKey) : FALLBACK_HERO;
}

export default function ServicePage({ data }: { data: ServiceContent }) {
  const { slug } = data;
  const urgent = data.kind === "urgent";
  const servicesHref = publishedHref("/services");
  const guaranteeHref = publishedHref("/guarantee");

  // The pinned ad descriptions, placed from the data alone. Each one renders verbatim, as one
  // text node, in markup that is always in the document: tests/ad-page-join.spec.ts.
  const ads = placeAdLines(data.adLines);

  const hasSections = Boolean(data.sections && data.sections.length > 0);
  const hasIllustrations = Boolean(data.illustrations && data.illustrations.length > 0);

  return (
    <div className="has-callbar">
      <FAQSchema faqs={data.faqs} />
      <Header />

      <main id="main" tabIndex={-1} className="outline-none">
        <ServiceHero
          crumbs={
            <Breadcrumb
              items={[
                { name: "Home", href: "/" },
                { name: "Services", href: servicesHref },
                { name: data.navLabel },
              ]}
            />
          }
          eyebrow={data.hero.eyebrow}
          h1Top={data.hero.h1Top}
          h1Bottom={data.hero.h1Bottom}
          sub={data.hero.sub}
          urgent={urgent}
          serviceOnlyLine={data.hero.serviceOnlyLine}
          heroImage={heroImageFor(slug)}
          aside={<CallbackInline formId={`${slug}_hero`} service={slug} idPrefix={`${slug}_hero`} />}
        />

        <TickChips guaranteeHref={guaranteeHref} />

        <StraightAnswers answers={data.answers} after={data.afterAnswers} tinted={false} compact />

        {/* The problem the reader arrived with, with a picture of it beside the cards. The lead
            paragraphs are the page's first pinned ad line: an ad may only promise what its
            landing page says, and this is the first place a reader is certain to pass. */}
        <ProblemGrid
          heading={data.problems.heading}
          sub={data.problems.sub}
          cards={data.problems.cards}
          lead={ads.problemLead}
          aside={
            hasIllustrations ? <IllustrationRow slugs={data.illustrations!} variant="aside" /> : undefined
          }
          note={urgent ? URGENT_GRID_NOTE : undefined}
          tinted
          compact
        />

        {/* Real jobs, at the middle of the page rather than the foot. */}
        <ProofStrip photoSlugs={data.proof.photos} videoSlug={data.proof.video} tinted={false} compact />

        <CTABand heading={data.ctaBand.heading} sub={ads.ctaSub ?? data.ctaBand.sub} />

        {hasSections && <ContentSections sections={data.sections!} tinted />}

        <HowItWorks steps={data.steps} intro={ads.howIntro} tinted={false} compact />

        <BookingForm heading={data.bookingHeading} formId={`${slug}_booking`} service={slug} />

        <TownsByCounty tinted={false} />

        <ServiceFAQ faqs={data.faqs} tinted />

        <ClosingBand heading={data.closing.heading} sub={ads.closingSub ?? data.closing.sub} />
      </main>

      <Footer />
      <MobileCallBar />
    </div>
  );
}
