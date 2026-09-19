import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import AnimateIn from "@/components/AnimateIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { PAYMENT_ANSWER, PRICE_NOTE } from "@/lib/claims";
import { STATIC_ROUTE_BY_PATH } from "@/lib/routes";

// "What will it cost" is the question every caller has and the one this business cannot answer
// with a figure: there is no fee and none may be stated, in either direction. So the answer is
// the process, stated plainly, and the three points below are the three moments in it where a
// customer could otherwise be caught out.
const POINTS: readonly { title: string; body: string }[] = [
  {
    title: "We explain the job first",
    body: "The plumber tells you what the job needs and why, before anything starts.",
  },
  { title: "You agree the price first", body: "Nothing starts until you say yes to the price." },
  {
    title: "No surprise add-ons",
    body: "If the job turns out bigger, we stop and tell you before we carry on.",
  },
];

export default function PriceClarity() {
  const guaranteePublished = STATIC_ROUTE_BY_PATH["/guarantee"]?.published === true;

  return (
    <section id="pricing" className="bg-paper">
      <div className="mx-auto max-w-content px-5 py-20 sm:px-8 md:py-28">
        <AnimateIn>
          <SectionHeading eyebrow="The price" title="How the price works." sub={PRICE_NOTE} />
        </AnimateIn>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {POINTS.map((point, i) => (
            <AnimateIn key={point.title} delay={i * 90} className="h-full">
              <div className="flex h-full flex-col gap-2 rounded-card border border-line bg-white p-6 shadow-card">
                <h3 className="font-display text-[19px] font-bold leading-tight text-brand">{point.title}</h3>
                <p className="text-[14.5px] leading-[1.6] text-slate">{point.body}</p>
              </div>
            </AnimateIn>
          ))}
        </div>

        <AnimateIn delay={200}>
          <p className="mt-8 max-w-[62ch] text-[15.5px] leading-[1.7] text-slate">
            <strong className="font-semibold text-brand">{PAYMENT_ANSWER.q}</strong> {PAYMENT_ANSWER.lead}{" "}
            {PAYMENT_ANSWER.rest}
          </p>

          {/* Only when the page behind it is live: a link to an unpublished route is a 404. */}
          {guaranteePublished && (
            <a
              href="/guarantee"
              data-cta="nav"
              data-cta-location="pricing_clarity"
              data-cta-variant="text_link"
              className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-bold text-tint hover:underline hover:underline-offset-4"
            >
              Our 12-month guarantee <ArrowRight size={15} weight="bold" aria-hidden />
            </a>
          )}
        </AnimateIn>
      </div>
    </section>
  );
}
