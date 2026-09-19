"use client";

import { useState } from "react";
import { Minus, Plus } from "@phosphor-icons/react/dist/ssr";
import AnimateIn from "@/components/AnimateIn";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import type { ProblemCard } from "@/lib/types";

interface Props {
  heading: string;
  sub: string;
  cards: readonly ProblemCard[];
  /** One line under the grid for the reader whose symptom is not listed. */
  note?: string;
  /** Anchor for the section itself; the cards take their own ids from their titles. */
  id?: string;
  /** paper-2 with a hairline top, for alternating against the section above. */
  tinted?: boolean;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Ids have to be unique on the page, so a repeated title takes a numeric suffix. */
function cardIds(cards: readonly ProblemCard[]): string[] {
  const taken = new Set<string>();
  return cards.map((card) => {
    const base = slugify(card.title) || "problem";
    let id = base;
    let n = 2;
    while (taken.has(id)) {
      id = `${base}-${n}`;
      n += 1;
    }
    taken.add(id);
    return id;
  });
}

// Symptom-named cards: the reader matches what they can see, not what the trade calls it.
//
// Every body is in the served HTML at all times and is toggled with the `hidden` attribute
// rather than unmounted, because this copy is the page's own words and a crawler, a text audit
// and a browser find all have to reach it whether or not a card happens to be open.
export default function ProblemGrid({ heading, sub, cards, note, id = "problems", tinted = true }: Props) {
  const [open, setOpen] = useState(0);
  const ids = cardIds(cards);

  if (cards.length === 0) return null;

  return (
    <section id={id} className={tinted ? "border-t border-line bg-paper-2" : "bg-paper"}>
      <div className="mx-auto max-w-content px-5 py-20 sm:px-8 md:py-28">
        <AnimateIn>
          <SectionHeading eyebrow="Start with what you can see" title={heading} sub={sub} />
        </AnimateIn>

        <div className="mt-10 grid gap-3 md:grid-cols-2 md:gap-4">
          {cards.map((card, i) => {
            const on = open === i;
            const cardId = ids[i];
            return (
              <div
                key={cardId}
                id={cardId}
                className={`scroll-mt-24 rounded-card border bg-white shadow-card ${on ? "border-tint-soft" : "border-line"}`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(on ? -1 : i)}
                  aria-expanded={on}
                  aria-controls={`${cardId}-body`}
                  className="flex w-full items-center justify-between gap-4 rounded-card px-5 py-4 text-left"
                >
                  <span className="font-display text-[17px] font-bold leading-snug text-brand">{card.title}</span>
                  <span
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-pill ${on ? "bg-brand text-cta" : "bg-paper-2 text-brand"}`}
                    aria-hidden
                  >
                    {on ? <Minus size={15} weight="bold" /> : <Plus size={15} weight="bold" />}
                  </span>
                </button>
                <p
                  id={`${cardId}-body`}
                  hidden={!on}
                  className="-mt-1 max-w-[62ch] px-5 pb-5 text-[14.5px] leading-[1.65] text-slate"
                >
                  {card.body}
                </p>
              </div>
            );
          })}
        </div>

        {note && (
          <AnimateIn delay={120}>
            <div className="mt-8 flex flex-col gap-4 rounded-card bg-tint-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[14.5px] font-medium text-brand">{note}</p>
              <Button
                as="a"
                href="#book"
                variant="dark"
                size="md"
                className="flex-shrink-0"
                data-cta="book_anchor"
                data-cta-location="problem_grid"
                data-cta-variant="primary_button"
              >
                Book a callback
              </Button>
            </div>
          </AnimateIn>
        )}
      </div>
    </section>
  );
}
