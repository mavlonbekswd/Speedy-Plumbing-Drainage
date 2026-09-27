// FAQ copy, assembled from lib/claims.ts so a fact changes in one place and an answer cannot
// drift from the line the rest of the site renders. Every answer opens with the answer.
//
// Service and town pages carry three to five FAQs of their own and emit FAQPage schema; this
// file holds the shared questions, the per-page sets the static pages render (there is no
// separate questions page since 19 Sept 2026), and the town coverage question, built per town.

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
  NO_HIDDEN_FEES,
  PHONE_ANSWERED_SENTENCE,
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

// Opens with the answer, which is the process: there is no figure on this site to open with since
// the owner took the call-out fee off it on 27 September 2026. His line follows the process claim.
//
// ⚠ "You approve the cost first." is sitelink SL1's description line 1 in the live account, and
// this answer is its only support on the home page: the phrase left the page when the long-form
// price paragraph was cut, and ARIM/speedy/bulk-c2-2026-09-20/verify_c2.py and
// bulk-c3-2026-09-20/verify_c3.py both fail on HOME without it. PRICE_FAQ renders on /, /services
// and /contact. Do not drop the sentence. It is the same approved claim as PRICE_NOTE, which has
// carried the words since the build.
export const PRICE_FAQ: Faq = {
  q: "How is the price agreed?",
  a: `You approve the cost first. ${PRICE_PROCESS_LINE}. ${NO_HIDDEN_FEES} ${FREE_WHATSAPP_LINE} ${NIGHT_RATE_LINE}`,
};

/**
 * Added 27 September 2026 on the owner's instruction ("Add out of hours on wording on the FAQs").
 * The account bids on [out of hours plumber near me] and "out of hours plumber", and an ad may
 * only say what its landing page renders, so the literal words have to be ON the page: this
 * answer is the only place on the site that carries them.
 *
 * Every fact in it is already established elsewhere on the site — 24/7 including bank holidays,
 * a plumber answers, 45 minutes, no night or weekend surcharge — and nothing is added: no
 * credential, no review count, no figure, and "aim to" rather than a guaranteed time.
 */
export const OUT_OF_HOURS_FAQ: Faq = {
  q: "Do you do out of hours call-outs?",
  a: `Yes. We are an out of hours plumber every night, weekend and bank holiday. ${PHONE_ANSWERED_SENTENCE} We aim to be with you within 45 minutes. ${NIGHT_RATE_LINE}`,
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

// Per-page sets. /faqs was removed on 19 Sept 2026 (owner): each page now answers the questions
// that belong to it, and carries its own FAQPage schema over exactly the list it renders.
export const HOME_FAQS: readonly Faq[] = [PRICE_FAQ, ARRIVAL_FAQ, OUT_OF_HOURS_FAQ, COVERAGE_FAQ, GUARANTEE_FAQ, PAYMENT_FAQ, OUT_OF_SCOPE_FAQ];
export const SERVICES_HUB_FAQS: readonly Faq[] = [PRICE_FAQ, SMALL_JOBS_FAQ, PHOTO_QUOTE_FAQ, OUT_OF_SCOPE_FAQ];
export const AREAS_FAQS: readonly Faq[] = [COVERAGE_FAQ, ARRIVAL_FAQ, HOURS_FAQ];
export const ABOUT_FAQS: readonly Faq[] = [WHO_WORKS_FAQ, WHO_COMES_FAQ, INSURED_FAQ];
export const GUARANTEE_FAQS: readonly Faq[] = [GUARANTEE_FAQ, INSURED_FAQ, PAYMENT_FAQ];
export const CONTACT_FAQS: readonly Faq[] = [HOURS_FAQ, OUT_OF_HOURS_FAQ, PHOTO_QUOTE_FAQ, PRICE_FAQ, PAYMENT_FAQ];

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
