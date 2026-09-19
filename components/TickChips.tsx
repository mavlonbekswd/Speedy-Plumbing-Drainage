import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import {
  ARRIVAL_LINE,
  GUARANTEE_LINE,
  GUARANTEE_SCOPE_LINE,
  PRICE_BLOCK_LINE,
  TICK_CHIPS,
} from "@/lib/claims";

// The key facts, in two bands (owner, 19 September 2026: "that strip should be divided into 2, so
// you have 4 figures and lower on the page you should have tick points").
//
//  - `part="figures"`: the four figures, directly under the hero.
//  - `part="ticks"`: the four tick points, the price sentence and the guarantee line with its
//    scope, lower on the page, just before the page asks for the call.
//
// Both render on every page that has the strip (home, /services, every service page, every town
// page), in the same two places, so the pages stay one design. A page must render BOTH parts:
// "1 year" is one of the figures, and a guarantee with no stated scope is read as covering the
// materials, which it does not. The scope sentence lives in the ticks part.
//
// History: merged earlier the same day from two strips that did the same job in two designs
// (four centred tick chips here, four left-aligned figures in components/home/StatsStrip.tsx).
//
// Every claim here has a file in ARIM/speedy/claims-evidence/, and nothing else may be added
// without one. The job count is the PLUMBERS', between them, and the label says so: the company
// was incorporated in June 2026, so "10,000 jobs" attributed to the firm would not be true.
//
// The blocks below the ticks are paragraphs, not list items: a <p> inside a <ul> is a defect axe
// reports, and these two sentences are not ticks.
const STATS: readonly { big: string; label: string }[] = [
  { big: "24/7", label: "Answered day and night" },
  { big: "45 min", label: ARRIVAL_LINE },
  { big: "1 year", label: "Guarantee on our workmanship" },
  { big: "10,000", label: "Jobs between our plumbers, 5+ years on the tools" },
];

export default function TickChips({
  guaranteeHref,
  part,
}: {
  guaranteeHref?: string;
  /** Which band to render. A page renders both, in two places. */
  part: "figures" | "ticks";
}) {
  if (part === "figures") {
    return (
      <section aria-label="Key figures" className="border-t border-line bg-paper-2">
        <div className="mx-auto max-w-content px-5 py-10 sm:px-8 md:py-12">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {STATS.map((stat) => (
              <div key={stat.big}>
                <p className="nums font-display text-[clamp(28px,3vw,38px)] font-extrabold leading-none text-brand">
                  {stat.big}
                </p>
                <p className="mt-2 text-[13.5px] leading-snug text-slate">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Key facts" className="border-t border-line bg-paper-2">
      <div className="mx-auto max-w-content px-5 py-10 sm:px-8 md:py-12">
        <ul className="grid grid-cols-2 gap-x-8 gap-y-3 md:grid-cols-4">
          {TICK_CHIPS.map((tick) => (
            <li key={tick} className="inline-flex items-center gap-2 text-[15px] font-semibold text-brand">
              <CheckCircle size={20} weight="fill" className="flex-shrink-0 text-cta-deep" aria-hidden />
              {tick}
            </li>
          ))}
        </ul>

        <p className="mt-5 max-w-[68ch] text-[14px] leading-[1.6] text-slate">{PRICE_BLOCK_LINE}</p>

        <p className="mt-1 max-w-[68ch] text-[14px] leading-[1.6] text-slate">
          {guaranteeHref ? (
            <a
              href={guaranteeHref}
              data-cta="nav"
              data-cta-location="tick_chips"
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
      </div>
    </section>
  );
}
