// FAQ copy, assembled from lib/claims.ts so a fact changes in one place and an answer cannot
// drift from the line the rest of the site renders. Every answer opens with the answer.
//
// Service and town pages carry three to five FAQs of their own and emit FAQPage schema; this
// file holds the sitewide set for /faqs, the five standard ones a page may reuse, and the town
// coverage question, which is built per town.

import type { Faq } from "./types";
import {
  ANSWERED_LINE,
  ARRIVAL_LINE,
  AVAILABILITY_LINE,
  COVERAGE_LINE,
  EXPERIENCE_LINE,
  FREE_WHATSAPP_LINE,
  GUARANTEE_LINE,
  GUARANTEE_SCOPE_LINE,
  INSURED_LOCKED_SENTENCE,
  NIGHT_RATE_LINE,
  OUT_OF_SCOPE_SENTENCE,
  PAYMENT_FAQ,
  PRICE_PROCESS_LINE,
  SAME_DAY_DETAIL_LINE,
  SAME_DAY_LINE,
  SMALL_JOBS_LINE,
} from "./claims";

export { PAYMENT_FAQ } from "./claims";

export const GUARANTEE_FAQ: Faq = {
  q: "Do you guarantee your work?",
  a: `Yes. ${GUARANTEE_LINE} ${GUARANTEE_SCOPE_LINE}`,
};

export const HOURS_FAQ: Faq = {
  q: "What hours do you actually answer?",
  a: `${AVAILABILITY_LINE} ${ANSWERED_LINE} ${NIGHT_RATE_LINE}`,
};

export const WHO_COMES_FAQ: Faq = {
  q: "Who comes, is it the person I spoke to?",
  a: `Yes. ${ANSWERED_LINE} Not a call centre, and nobody sells your job on.`,
};

export const COVERAGE_FAQ: Faq = {
  q: "Do you cover my postcode?",
  a: `Very likely. We cover ${COVERAGE_LINE} Tell us your postcode when you ring and you get a straight yes or no.`,
};

export const PRICE_FAQ: Faq = {
  q: "How is the price agreed?",
  a: `${PRICE_PROCESS_LINE} ${FREE_WHATSAPP_LINE} ${NIGHT_RATE_LINE}`,
};

/** The five from the specification, in the order the customer asks them. */
export const STANDARD_FAQS: readonly Faq[] = [
  GUARANTEE_FAQ,
  HOURS_FAQ,
  WHO_COMES_FAQ,
  COVERAGE_FAQ,
  PRICE_FAQ,
];

/** The out-of-scope list lives inside this answer and nowhere else on the site. */
export const OUT_OF_SCOPE_FAQ: Faq = {
  q: "Is there work you do not take on?",
  a: `${OUT_OF_SCOPE_SENTENCE} Taps, toilets, basins, showers, valves, radiators, pipework, drains and guttering are.`,
};

export const ARRIVAL_FAQ: Faq = {
  q: "How soon can you get here in an emergency?",
  a: `${SAME_DAY_LINE} ${ARRIVAL_LINE} ${SAME_DAY_DETAIL_LINE}`,
};

export const INSURED_FAQ: Faq = {
  q: "Are you insured?",
  a: INSURED_LOCKED_SENTENCE,
};

export const SMALL_JOBS_FAQ: Faq = {
  q: "Will you come out for one small job?",
  a: `Yes. ${SMALL_JOBS_LINE}`,
};

export const PHOTO_QUOTE_FAQ: Faq = {
  q: "Can you price it from a photo?",
  a: `Often, yes. ${FREE_WHATSAPP_LINE} ${PRICE_PROCESS_LINE}`,
};

export const WHO_WORKS_FAQ: Faq = {
  q: "Who will be working in my home?",
  a: `One of our own plumbers. ${EXPERIENCE_LINE}`,
};

/** The /faqs page, in decision order: coverage, speed, price, then the trust questions. */
export const SITE_FAQS: readonly Faq[] = [
  COVERAGE_FAQ,
  HOURS_FAQ,
  ARRIVAL_FAQ,
  PRICE_FAQ,
  PAYMENT_FAQ,
  GUARANTEE_FAQ,
  INSURED_FAQ,
  WHO_COMES_FAQ,
  WHO_WORKS_FAQ,
  SMALL_JOBS_FAQ,
  PHOTO_QUOTE_FAQ,
  OUT_OF_SCOPE_FAQ,
];

/**
 * FAQ 1 on every town page, built locally so each URL carries a sentence nothing else has.
 * `county` is the town's own county, never the label for the whole footprint.
 */
export function townCoverFaq(town: string, county: string, placeLabel?: string): Faq {
  // A placeLabel town is served in its surrounding districts only, so the answer names those and
  // never the town on its own.
  if (placeLabel) {
    const place = placeLabel.charAt(0).toUpperCase() + placeLabel.slice(1);
    return {
      q: `Do you cover ${placeLabel} 24 hours a day?`,
      a: `Yes. ${place}, nights and weekends included, with no extra charge for it. A plumber picks up, not a call centre.`,
    };
  }
  return {
    q: `Do you cover ${town} 24 hours a day?`,
    a: `Yes. ${town} and the ${county} villages around it, nights and weekends included, with no extra charge for it. A plumber picks up, not a call centre.`,
  };
}
