"use client";

import { useState } from "react";
import { Minus, Plus } from "@phosphor-icons/react/dist/ssr";
import AnimateIn from "@/components/AnimateIn";
import SectionHeading from "@/components/ui/SectionHeading";
import type { Faq } from "@/lib/types";

interface Props {
  faqs: readonly Faq[];
  heading?: string;
  /** paper-2 with a hairline top, for alternating against the section above. */
  tinted?: boolean;
}

// Heading left, accordion right from lg. Every answer is in the server HTML and is toggled with
// the `hidden` attribute rather than unmounted: the page emits FAQPage schema from the same
// strings, and schema that names an answer the page does not render is a defect.
export default function ServiceFAQ({ faqs, heading = "Questions people ask us.", tinted = false }: Props) {
  const [open, setOpen] = useState(0);
  if (faqs.length === 0) return null;

  return (
    <section id="faqs" className={tinted ? "border-t border-line bg-paper-2" : "bg-paper"}>
      <div className="mx-auto max-w-content px-5 py-20 sm:px-8 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <AnimateIn>
            <SectionHeading eyebrow="Good to know" title={heading} />
          </AnimateIn>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => {
              const on = open === i;
              const bodyId = `faq-${i}-body`;
              return (
                <div
                  key={faq.q}
                  className={`rounded-card border bg-white shadow-card ${on ? "border-tint-soft" : "border-line"}`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(on ? -1 : i)}
                    aria-expanded={on}
                    aria-controls={bodyId}
                    className="flex w-full items-center justify-between gap-5 rounded-card px-5 py-5 text-left sm:px-6"
                  >
                    <span className="font-display text-[17px] font-bold leading-snug text-brand">{faq.q}</span>
                    <span
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-pill ${on ? "bg-brand text-cta" : "bg-paper-2 text-brand"}`}
                      aria-hidden
                    >
                      {on ? <Minus size={15} weight="bold" /> : <Plus size={15} weight="bold" />}
                    </span>
                  </button>
                  <p
                    id={bodyId}
                    hidden={!on}
                    className="-mt-1 max-w-[62ch] px-5 pb-6 text-[15px] leading-[1.7] text-slate sm:px-6"
                  >
                    {faq.a}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
