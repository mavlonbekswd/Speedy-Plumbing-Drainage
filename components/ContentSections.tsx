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
export default function ContentSections({ sections, tinted = false }: Props) {
  if (sections.length === 0) return null;

  return (
    <div className={tinted ? "border-t border-line bg-paper-2" : "bg-paper"}>
      <div className="mx-auto max-w-content px-5 py-20 sm:px-8 md:py-28">
        <div className="flex flex-col gap-12 md:gap-14">
          {sections.map((section, i) => (
            <AnimateIn key={section.id} delay={i * 60}>
              <section id={section.id}>
                <h2 className="text-pretty font-display text-[clamp(24px,2.8vw,34px)] font-extrabold leading-[1.1] text-brand">
                  {section.heading}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-4 max-w-[62ch] text-[16px] leading-[1.7] text-slate">
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
              </section>
            </AnimateIn>
          ))}
        </div>
      </div>
    </div>
  );
}
