import { ARRIVAL_LINE, GUARANTEE_SCOPE_LINE, HOME_TRUST_LINE } from "@/lib/claims";

// Four facts under the hero. Every one has a file in ARIM/speedy/claims-evidence/, and nothing
// else may be added without one.
//
// The job count is the PLUMBERS', between them, and the label says so. The company was
// incorporated in June 2026 and is three months old, so "10,000 jobs" attributed to the firm
// would be a claim about the firm that is not true. It is attributed to the people instead,
// which is what the owner released.
//
// The guarantee is one of the four, so the scope sentence renders here too: a guarantee with no
// stated scope is read as covering the materials, and it does not.
const STATS: readonly { big: string; label: string }[] = [
  { big: "24/7", label: "Answered day and night" },
  { big: "45 min", label: ARRIVAL_LINE },
  { big: "1 year", label: "Guarantee on our workmanship" },
  { big: "10,000", label: "Jobs between our plumbers, 5+ years on the tools" },
];

export default function StatsStrip() {
  return (
    <section aria-label="Key facts" className="border-y border-line bg-paper-2">
      <div className="mx-auto grid max-w-content grid-cols-2 gap-6 px-5 py-8 sm:px-8 md:grid-cols-4 md:gap-8 md:py-10">
        {STATS.map((stat) => (
          <div key={stat.big}>
            <p className="nums font-display text-[clamp(28px,3vw,38px)] font-extrabold leading-none text-brand">
              {stat.big}
            </p>
            <p className="mt-2 text-[13.5px] leading-snug text-slate">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-content px-5 pb-7 sm:px-8">
        <p className="text-[14px] font-semibold text-brand">{HOME_TRUST_LINE}</p>
        <p className="mt-1 text-[14px] text-slate">{GUARANTEE_SCOPE_LINE}</p>
      </div>
    </section>
  );
}
