"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Minus, Plus } from "@phosphor-icons/react/dist/ssr";
import AnimateIn from "@/components/AnimateIn";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import {
  ACCORDION_ROW,
  ACCORDION_ROW_COMPACT,
  ACCORDION_TITLE,
  accordionControl,
} from "@/components/ui/accordion";
import type { ProblemCard } from "@/lib/types";

interface Props {
  heading: string;
  sub: string;
  cards: readonly ProblemCard[];
  /**
   * Always-visible paragraphs between the heading and the cards. Service pages pass their pinned
   * ad descriptions here, one string expression each, so the sentences an ad promises are read
   * before the accordion rather than in a box at the foot of the page. See lib/claims.ts.
   */
  lead?: readonly string[];
  /** Pictures of the problem, rendered inside this section directly under the cards. */
  aside?: ReactNode;
  /** One line under the grid for the reader whose symptom is not listed. */
  note?: string;
  /** Anchor for the section itself; the cards take their own ids from their titles. */
  id?: string;
  /** paper-2 with a hairline top, for alternating against the section above. */
  tinted?: boolean;
  /**
   * Shorter vertical rhythm, for the long templates. Opt-in: no other page changes height.
   * From 19 September 2026 the phone measure is tighter still: less section padding, a smaller
   * card rail and smaller card type. No card is removed and no body is unmounted.
   */
  compact?: boolean;
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
export default function ProblemGrid({
  heading,
  sub,
  cards,
  lead,
  aside,
  note,
  id = "problems",
  tinted = true,
  compact = false,
}: Props) {
  const [open, setOpen] = useState(0);
  const ids = cardIds(cards);
  const hasLead = Boolean(lead && lead.length > 0);

  if (cards.length === 0) return null;

  return (
    <section id={id} className={tinted ? "border-t border-line bg-paper-2" : "bg-paper"}>
      <div
        className={`mx-auto max-w-content px-5 sm:px-8 ${compact ? "py-10 sm:py-14 md:py-20" : "py-14 md:py-20"}`}
      >
        <AnimateIn>
          {/* When a lead is passed, the sub moves below it and sits directly above the cards:
              "Open one for what we do about it" is an instruction, and an instruction has to be
              next to the thing it points at. */}
          <SectionHeading
            eyebrow="Start with what you can see"
            title={heading}
            sub={hasLead ? undefined : sub}
          />
        </AnimateIn>

        {/* Outside the reveal wrapper on purpose: these are the pinned ad lines, and a sentence
            an ad paid for may not depend on a script running. One <p> per string. */}
        {hasLead && (
          <div className="mt-5 flex flex-col gap-2">
            {lead!.map((line) => (
              <p key={line} className="max-w-[62ch] text-[16px] leading-[1.65] text-slate">
                {line}
              </p>
            ))}
          </div>
        )}

        <div className={compact ? (hasLead ? "mt-6 sm:mt-8" : "mt-8 sm:mt-10") : hasLead ? "mt-8" : "mt-10"}>
          {hasLead && sub && <p className="mb-4 text-[14.5px] leading-[1.6] text-steel">{sub}</p>}

          <div
            className={`grid items-start md:grid-cols-2 md:gap-4 ${compact ? "gap-2.5 sm:gap-3" : "gap-3"}`}
          >
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
                    className={compact ? ACCORDION_ROW_COMPACT : ACCORDION_ROW}
                  >
                    <span className={ACCORDION_TITLE}>{card.title}</span>
                    <span className={accordionControl(on)} aria-hidden>
                      {on ? <Minus size={15} weight="bold" /> : <Plus size={15} weight="bold" />}
                    </span>
                  </button>
                  <p
                    id={`${cardId}-body`}
                    hidden={!on}
                    className={`-mt-1 max-w-[62ch] text-slate ${
                      compact
                        ? "px-4 pb-4 text-[13.5px] leading-[1.6] sm:px-6 sm:pb-5 sm:text-[15px] sm:leading-[1.7]"
                        : "px-5 pb-5 text-[15px] leading-[1.7] sm:px-6"
                    }`}
                  >
                    {card.body}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Pictures of the problem, directly under the cards and inside the same section, so a
              reader matching what they can see never has to scroll to another heading for it. */}
          {aside && <div className="mt-8">{aside}</div>}
        </div>

        {note && (
          <AnimateIn delay={120}>
            <div className="mt-8 flex flex-col gap-4 rounded-card bg-tint-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[14.5px] font-medium text-brand">{note}</p>
              <Button
                as="a"
                href="#book"
                variant="dark"
                size="lg"
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
