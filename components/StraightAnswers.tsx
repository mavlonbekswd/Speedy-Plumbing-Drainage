import AnimateIn from "@/components/AnimateIn";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import type { Answer } from "@/lib/types";

interface Props {
  eyebrow?: string;
  title?: string;
  answers: readonly Answer[];
  /** One sentence and the callback pill, directly under the grid. */
  after?: { text: string; buttonLabel: string };
  /** paper-2 with a hairline top, for alternating against the section above. */
  tinted?: boolean;
  /** Shorter vertical rhythm, for the long templates. Opt-in: no other page changes height. */
  compact?: boolean;
}

// The questions people ring with, in the order they ask them, each answered in one bite. The
// lead reads bold, so somebody who skims the bold alone still has the answer.
//
// The animated wrapper IS the card. The DOM has to stay dl > div > (dt + dd) with exactly one
// div level; anything else between the <dl> and its terms is a defect axe reports.
export default function StraightAnswers({
  eyebrow = "Before you ring",
  title = "Straight answers.",
  answers,
  after,
  tinted = false,
  compact = false,
}: Props) {
  if (answers.length === 0) return null;

  return (
    <section id="answers" className={tinted ? "border-t border-line bg-paper-2" : "bg-paper"}>
      <div
        className={`mx-auto max-w-content px-5 sm:px-8 ${compact ? "py-14 md:py-20" : "py-20 md:py-28"}`}
      >
        <AnimateIn>
          <SectionHeading eyebrow={eyebrow} title={title} />
        </AnimateIn>

        <dl className={`grid gap-5 sm:grid-cols-2 ${compact ? "mt-8" : "mt-10"}`}>
          {answers.map((answer, i) => (
            <AnimateIn
              key={answer.q}
              delay={i * 60}
              className="flex h-full flex-col gap-2 rounded-card border border-line bg-white p-6 shadow-card"
            >
              <dt className="font-display text-[19px] font-bold leading-tight text-brand">{answer.q}</dt>
              <dd className="m-0 text-[15px] leading-[1.6] text-slate">
                <strong className="font-bold text-ink">{answer.lead}</strong> {answer.rest}
              </dd>
            </AnimateIn>
          ))}
        </dl>

        {after && (
          <div className={`flex flex-col gap-5 sm:flex-row sm:items-center ${compact ? "mt-8" : "mt-10"}`}>
            <p className="max-w-[52ch] text-[16.5px] leading-[1.6] text-slate">{after.text}</p>
            <Button
              as="a"
              href="#book"
              variant="light"
              size="lg"
              className="flex-shrink-0"
              data-cta="book_anchor"
              data-cta-location="after_answers"
              data-cta-variant="secondary_button"
            >
              {after.buttonLabel}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
