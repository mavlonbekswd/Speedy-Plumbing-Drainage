import AnimateIn from "@/components/AnimateIn";
import type { ContentSection } from "@/lib/types";

interface Props {
  sections: readonly ContentSection[];
  /** paper-2 with a hairline top, for alternating against the section above. */
  tinted?: boolean;
}

// Long-form answers that a page owes its reader in full: the radiator leak, the dripping tap.
// Always-visible prose, never an accordion, held to a 62ch measure so it stays readable on a
// phone at arm's length.
//
// Heading left, prose right from lg. The owner's complaint on 19 September 2026 was length, and
// the same words in two columns end about a third shorter on a desktop screen without a single
// sentence being cut. On a phone it stacks and nothing changes.
export default function ContentSections({ sections, tinted = false }: Props) {
  if (sections.length === 0) return null;

  return (
    <div className={tinted ? "border-t border-line bg-paper-2" : "bg-paper"}>
      <div className="mx-auto max-w-content px-5 py-14 sm:px-8 md:py-20">
        <div className="flex flex-col gap-10 md:gap-12">
          {sections.map((section, i) => (
            <AnimateIn key={section.id} delay={i * 60}>
              <section id={section.id} className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
                <h2 className="text-pretty font-display text-[clamp(22px,2.6vw,30px)] font-extrabold leading-[1.1] text-brand">
                  {section.heading}
                </h2>
                <div>
                  {section.paragraphs.map((paragraph, index) => (
                    <p
                      key={paragraph}
                      className={`max-w-[62ch] text-[16px] leading-[1.7] text-slate ${index === 0 ? "" : "mt-4"}`}
                    >
                      {paragraph}
                    </p>
                  ))}
                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="mt-4 flex max-w-[62ch] list-disc flex-col gap-2 pl-5 text-[15.5px] leading-[1.7] text-slate">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            </AnimateIn>
          ))}
        </div>
      </div>
    </div>
  );
}
