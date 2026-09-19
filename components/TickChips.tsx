import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { GUARANTEE_LINE, GUARANTEE_SCOPE_LINE, PRICE_BLOCK_LINE, TICK_CHIPS } from "@/lib/claims";

// The strip under the hero: four ticks, then how the price is agreed, then the guarantee and the
// one thing no rival says, its scope. Every item is a claim with a proof file behind it.
//
// The blocks below the list are paragraphs, not list items: a <p> inside a <ul> is a defect axe
// reports, and these two sentences are not ticks.
export default function TickChips({ guaranteeHref }: { guaranteeHref?: string }) {
  return (
    <div className="border-t border-line bg-paper-2">
      <div className="mx-auto max-w-content px-5 py-8 sm:px-8 md:py-10">
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          {TICK_CHIPS.map((tick) => (
            <li key={tick} className="inline-flex items-center gap-2 text-[14.5px] font-semibold text-brand">
              <CheckCircle size={18} weight="fill" className="text-cta-deep" aria-hidden />
              {tick}
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-5 max-w-[62ch] text-center text-[14.5px] leading-[1.6] text-slate">
          {PRICE_BLOCK_LINE}
        </p>

        <p className="mx-auto mt-2 max-w-[62ch] text-center text-[14.5px] leading-[1.6] text-slate">
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
    </div>
  );
}
