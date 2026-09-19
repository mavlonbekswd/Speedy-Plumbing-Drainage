import AnimateIn from "@/components/AnimateIn";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  GUARANTEE_SCOPE_LINE,
  INSURED_LEAD,
  INSURED_LOCKED_SENTENCE,
  PRICE_NOTE,
} from "@/lib/claims";

// Five reasons, each a bold lead and one plain line, so a reader who reads only the headings
// still has the answer. No icons: an icon beside "Fully insured" adds a decoration, not a fact.
//
// Two of the five are sliced out of locked sentences rather than retyped, so a change in
// lib/claims.ts reaches this page and cannot drift from it:
//   - the insured line takes the half of INSURED_LOCKED_SENTENCE that follows its lead, because
//     the lead is already the card's own heading;
//   - the price line takes the first sentence of PRICE_NOTE, which keeps "free" and "WhatsApp"
//     inside one statement. The whole of PRICE_NOTE renders once, under "How the price works."
const INSURED_REST = INSURED_LOCKED_SENTENCE.slice(INSURED_LEAD.length).trim();
const PRICE_LEAD = `${PRICE_NOTE.split(". ")[0]}.`;

const REASONS: readonly { title: string; body: string }[] = [
  {
    title: "A plumber answers, not a call centre",
    body: "The person who answers is the person who comes. Nobody sells your job on to whoever is nearest.",
  },
  {
    title: "Nights and weekends too",
    body: "24/7, including bank holidays, and no extra charge for it.",
  },
  { title: "The price before we start", body: PRICE_LEAD },
  { title: "Fully insured", body: INSURED_REST },
  { title: "12 months on our workmanship", body: GUARANTEE_SCOPE_LINE },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="bg-paper">
      <div className="mx-auto max-w-content px-5 py-20 sm:px-8 md:py-28">
        <AnimateIn>
          <SectionHeading eyebrow="Why us" title="Why people ring us." />
        </AnimateIn>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason, i) => (
            <AnimateIn key={reason.title} delay={i * 80} className="h-full">
              <div className="flex h-full flex-col gap-2 rounded-card border border-line bg-white p-6 shadow-card">
                <h3 className="font-display text-[19px] font-bold leading-tight text-brand">{reason.title}</h3>
                <p className="text-[14.5px] leading-[1.6] text-slate">{reason.body}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
