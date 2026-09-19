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
  /**
   * Shorter vertical rhythm, for the long templates. Opt-in: no other page changes height.
   *
   * Since 19 September 2026 it also changes the PHONE layout: eight separate shadowed cards at
   * one per row measured about 2,400px on a 390px screen, which is three screenfuls of the page
   * spent on the section directly under the hero. Compact turns them into one bordered list with
   * hairline rules, smaller type and half the padding. Nothing is hidden and nothing is cut: all
   * eight terms and all eight answers stay in the document, unconditionally, because several of
   * them are MUST_RENDER text and one of them is PHONE_ANSWER.
   */
  compact?: boolean;
}

// The questions people ring with, in the order they ask them, each answered in one bite. The
// lead reads bold, so somebody who skims the bold alone still has the answer.
//
// The animated wrapper IS the card. The DOM has to stay dl > div > (dt + dd) with exactly one
// div level; anything else between the <dl> and its terms is a defect axe reports. That rule is
// why the phone layout is done with classes on the existing three elements and not by wrapping
// the list in anything.
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
        className={`mx-auto max-w-content px-5 sm:px-8 ${compact ? "py-10 sm:py-14 md:py-20" : "py-14 md:py-20"}`}
      >
        <AnimateIn>
          <SectionHeading eyebrow={eyebrow} title={title} />
        </AnimateIn>

        <dl
          className={
            compact
              ? // One bordered list on a phone; the card grid comes back at sm, unchanged.
                //
                // `max-sm:divide-*` rather than `divide-* sm:divide-y-0`. The divide selector is
                // `& > :not([hidden]) ~ :not([hidden])`, which outranks the single class on the
                // card, so a `sm:divide-y-0` would win over `sm:border` and strip the top and
                // bottom edge off seven of the eight cards at every desktop width.
                "mt-6 grid gap-0 rounded-card border border-line bg-white max-sm:divide-y max-sm:divide-line sm:mt-8 sm:grid-cols-2 sm:gap-5 sm:rounded-none sm:border-0 sm:bg-transparent"
              : "mt-10 grid gap-5 sm:grid-cols-2"
          }
        >
          {answers.map((answer, i) => (
            <AnimateIn
              key={answer.q}
              delay={i * 60}
              className={
                compact
                  ? "flex h-full flex-col gap-1 px-4 py-3.5 sm:gap-2 sm:rounded-card sm:border sm:border-line sm:bg-white sm:p-6 sm:shadow-card"
                  : "flex h-full flex-col gap-2 rounded-card border border-line bg-white p-6 shadow-card"
              }
            >
              <dt
                className={`font-display font-bold leading-snug text-brand ${
                  compact ? "text-[16px] sm:text-[19px]" : "text-[19px]"
                }`}
              >
                {answer.q}
              </dt>
              <dd
                className={`m-0 text-slate ${
                  compact ? "text-[13.5px] leading-[1.55] sm:text-[15px] sm:leading-[1.6]" : "text-[15px] leading-[1.6]"
                }`}
              >
                <strong className="font-bold text-ink">{answer.lead}</strong> {answer.rest}
              </dd>
            </AnimateIn>
          ))}
        </dl>

        {after && (
          <div
            className={`flex flex-col gap-5 sm:flex-row sm:items-center ${compact ? "mt-6 sm:mt-8" : "mt-10"}`}
          >
            <p className="max-w-[52ch] text-[16.5px] leading-[1.6] text-slate">{after.text}</p>
            <Button
              as="a"
              href="#book"
              variant="dark"
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
