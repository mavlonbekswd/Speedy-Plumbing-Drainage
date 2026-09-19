import AnimateIn from "@/components/AnimateIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { ContentIcon } from "@/components/icons";
import type { Step } from "@/lib/types";

interface Props {
  steps: readonly Step[];
  eyebrow?: string;
  title?: string;
  /**
   * One line between the heading and the steps. Service pages put a pinned ad description here,
   * as a single string expression outside the reveal wrapper: see lib/claims.ts.
   */
  intro?: string;
  /** paper-2 with a hairline top, for alternating against the section above. */
  tinted?: boolean;
  /**
   * Shorter vertical rhythm, for the long templates. Opt-in: no other page changes height.
   *
   * From 19 September 2026 it also changes the PHONE layout: three tall white cards stacked one
   * per row measured about 900px, for three sentences. Compact renders them as a numbered list
   * instead: the numeral in the margin, the step title, the line under it. The cards come back
   * at sm. No words are cut and nothing is clamped: `intro` carries a pinned ad line on
   * some pages and every step body is the page's own copy.
   */
  compact?: boolean;
}

// What happens when you ring, in three steps. The numbering is honest here: it is a real
// sequence, so the list is an <ol> and the numerals mean something.
export default function HowItWorks({
  steps,
  eyebrow = "What happens when you ring",
  title = "How it works.",
  intro,
  tinted = false,
  compact = false,
}: Props) {
  if (steps.length === 0) return null;

  return (
    <section id="how-it-works" className={tinted ? "border-t border-line bg-paper-2" : "bg-paper"}>
      <div
        className={`mx-auto max-w-content px-5 sm:px-8 ${compact ? "py-10 sm:py-14 md:py-20" : "py-14 md:py-20"}`}
      >
        <AnimateIn>
          <SectionHeading eyebrow={eyebrow} title={title} />
        </AnimateIn>

        {/* Outside the reveal wrapper: a sentence an ad paid for may not wait on a script. */}
        {intro && (
          <p
            className={`max-w-[62ch] leading-[1.65] text-slate ${
              compact ? "mt-4 text-[15px] sm:mt-5 sm:text-[16px]" : "mt-5 text-[16px]"
            }`}
          >
            {intro}
          </p>
        )}

        <ol
          className={
            compact
              ? // max-sm, not sm:divide-y-0: the divide selector outranks a single class, so it
                // must not exist at all above the breakpoint. See StraightAnswers.
                "mt-6 grid gap-0 max-sm:divide-y max-sm:divide-line sm:mt-8 sm:gap-5 md:grid-cols-3 md:gap-6"
              : "mt-12 grid gap-5 md:grid-cols-3 md:gap-6"
          }
        >
          {steps.map((step, i) => (
            <li key={step.title} className="h-full">
              <AnimateIn
                delay={i * 90}
                // On a phone the numeral sits in a 44px margin and the step reads as a list row.
                // From sm the screen block below re-applies the full card padding.
                className={
                  compact
                    ? "relative flex h-full flex-col gap-1 py-4 pl-11 sm:gap-3 sm:rounded-card sm:border sm:border-line sm:bg-white sm:p-6 sm:shadow-card"
                    : "flex h-full flex-col gap-3 rounded-card border border-line bg-white p-6 shadow-card"
                }
              >
                <div className={`flex items-center gap-3 ${compact ? "absolute left-0 top-4 sm:static" : ""}`}>
                  <span
                    className={`nums flex items-center justify-center rounded-pill bg-brand font-display font-bold text-cta ${
                      compact ? "h-8 w-8 text-[13px] sm:h-9 sm:w-9 sm:text-[14px]" : "h-9 w-9 text-[14px]"
                    }`}
                    aria-hidden
                  >
                    0{i + 1}
                  </span>
                  <ContentIcon
                    name={step.icon}
                    size={22}
                    className={compact ? "hidden text-tint sm:block" : "text-tint"}
                  />
                </div>
                <h3
                  className={`font-display font-bold leading-snug text-brand ${
                    compact ? "text-[16.5px] sm:text-[19px]" : "text-[19px]"
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-slate ${
                    compact
                      ? "text-[13.5px] leading-[1.55] sm:text-[14.5px] sm:leading-[1.6]"
                      : "text-[14.5px] leading-[1.6]"
                  }`}
                >
                  {step.body}
                </p>
              </AnimateIn>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
