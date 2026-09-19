// The one template every /services/<slug> page renders. A service page is an ad landing page
// first and a piece of reading second, so the order below is fixed: the number and the callback
// card come before any prose, and the pinned ad lines sit in always-visible text a third of the
// way down rather than at the foot of the page.
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
import PlainWords from "@/components/PlainWords";
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
import { URGENT_GRID_NOTE } from "@/lib/claims";
import { STATIC_ROUTE_BY_PATH } from "@/lib/routes";
import type { ServiceContent } from "@/lib/types";
import IllustrationRow from "@/components/IllustrationRow";

/** A link is only offered when the page behind it is live, so no crumb is ever a 404. */
function publishedHref(path: string): string | undefined {
  return STATIC_ROUTE_BY_PATH[path]?.published ? path : undefined;
}

export default function ServicePage({ data }: { data: ServiceContent }) {
  const { slug } = data;
  const urgent = data.kind === "urgent";
  const servicesHref = publishedHref("/services");
  const guaranteeHref = publishedHref("/guarantee");

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
          aside={<CallbackInline formId={`${slug}_hero`} service={slug} idPrefix={`${slug}_hero`} />}
        />

        <TickChips guaranteeHref={guaranteeHref} />

        <StraightAnswers answers={data.answers} after={data.afterAnswers} tinted={false} />

        <ProblemGrid
          heading={data.problems.heading}
          sub={data.problems.sub}
          cards={data.problems.cards}
          note={urgent ? URGENT_GRID_NOTE : undefined}
          tinted
        />

        {/* The pinned ad descriptions, verbatim and always visible. They sit here, directly
            under the problem grid, because an ad may only promise what its landing page says
            and this is the last point a reader still on the page is certain to pass. */}
        <section className="bg-paper">
          <div className="mx-auto max-w-content px-5 py-14 sm:px-8 md:py-16">
            <PlainWords lines={data.adLines} />
          </div>
        </section>

        {data.sections && data.sections.length > 0 && <ContentSections sections={data.sections} tinted />}

        {data.illustrations && data.illustrations.length > 0 && <IllustrationRow slugs={data.illustrations} />}

        <CTABand heading={data.ctaBand.heading} sub={data.ctaBand.sub} />

        <HowItWorks steps={data.steps} tinted={false} />

        <BookingForm heading={data.bookingHeading} formId={`${slug}_booking`} service={slug} />

        <ProofStrip photoSlugs={data.proof.photos} videoSlug={data.proof.video} tinted={false} />

        <TownsByCounty tinted />

        <ServiceFAQ faqs={data.faqs} tinted={false} />

        <ClosingBand heading={data.closing.heading} sub={data.closing.sub} />
      </main>

      <Footer />
      <MobileCallBar />
    </div>
  );
}
