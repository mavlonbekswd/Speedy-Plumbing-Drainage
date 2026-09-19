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
  /** Shorter vertical rhythm, for the long templates. Opt-in: no other page changes height. */
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
        className={`mx-auto max-w-content px-5 sm:px-8 ${compact ? "py-14 md:py-20" : "py-20 md:py-28"}`}
      >
        <AnimateIn>
          <SectionHeading eyebrow={eyebrow} title={title} />
        </AnimateIn>

        {/* Outside the reveal wrapper: a sentence an ad paid for may not wait on a script. */}
        {intro && <p className="mt-5 max-w-[62ch] text-[16px] leading-[1.65] text-slate">{intro}</p>}

        <ol className={`grid gap-5 md:grid-cols-3 md:gap-6 ${compact ? "mt-8" : "mt-12"}`}>
          {steps.map((step, i) => (
            <li key={step.title} className="h-full">
              <AnimateIn
                delay={i * 90}
                className="flex h-full flex-col gap-3 rounded-card border border-line bg-white p-6 shadow-card"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="nums flex h-9 w-9 items-center justify-center rounded-pill bg-brand font-display text-[14px] font-bold text-cta"
                    aria-hidden
                  >
                    0{i + 1}
                  </span>
                  <ContentIcon name={step.icon} size={22} className="text-tint" />
                </div>
                <h3 className="font-display text-[19px] font-bold leading-tight text-brand">{step.title}</h3>
                <p className="text-[14.5px] leading-[1.6] text-slate">{step.body}</p>
              </AnimateIn>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
