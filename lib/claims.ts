// Every shared claim string, in one place, so a fact changes once. Data only: relative imports,
// no React, no "@/". The Playwright suite imports this file directly under Node.
//
// Wording comes from SITE-BUILD-PROMPT-2026-09-19.md section 6.1, taken verbatim, with the
// owner's decisions of 19 September 2026 overriding the spec where they differ:
//   - the job count runs, attributed to the plumbers (EXPERIENCE_LINE);
//   - payment is settled, so the straight-answers set has eight cards (PAYMENT_ANSWER);
//   - guttering is in scope, so it is absent from OUT_OF_SCOPE;
//   - same-day wording stays conditional everywhere except the one released blocked-drains line.
//
// No claim may appear in copy without a proof file in ARIM/speedy/claims-evidence/.

import type { Answer, Faq } from "./types";
import { ADS } from "../content/ads";

// ---------------------------------------------------------------------------
// Section 6.1 shared constants, verbatim
// ---------------------------------------------------------------------------

/** Speedy has no fee and states none. Process certainty stands where a figure would. */
export const PRICE_PROCESS_LINE = "The price is agreed before we start. You approve the cost first.";

/** The full footprint, derived from the locked 66 districts. lib/towns.ts regenerates and asserts it. */
export const COVERAGE_LINE =
  "Cambridgeshire, Suffolk, Norfolk and north Essex, plus parts of Hertfordshire, Bedfordshire and Lincolnshire.";

/** Eyebrows and meta descriptions only. Never a bare county name on a page listing other counties. */
export const COVERAGE_SHORT = "Cambridgeshire and the surrounding counties";

export const NIGHT_RATE_LINE = "No extra charge at night or weekends.";

/** Urgent pages only. Booked pages never carry same-day wording in the hero. */
export const SAME_DAY_LINE = "Same day, on site within 45 minutes, 24/7.";

/**
 * Two sentences, held apart as constants because MUST_RENDER rule 2 wants BOTH of them, word
 * for word, somewhere on every service and town page. The owner took the first of them out of
 * the hero on 19 September 2026, so their one always-in-the-document home is now answer card 4,
 * PHONE_ANSWER below. Never retype either of them into a leaf.
 */
export const PHONE_ANSWERED_SENTENCE = "A plumber answers the phone, day or night.";
export const SAME_PERSON_SENTENCE = "The person who answers is the person who comes.";

export const ANSWERED_LINE = `${PHONE_ANSWERED_SENTENCE} ${SAME_PERSON_SENTENCE}`;

export const ARRIVAL_LINE = "With you within 45 minutes, day or night.";

export const PRICE_NOTE =
  "The plumber quotes on site before any work starts, or from a photo you send on WhatsApp, which is free. You approve the cost first, and there is no extra charge at night or weekends.";

export const PRICE_BLOCK_LINE =
  "The price is agreed before we start. Nothing begins until you say yes. No extra charge at night or weekends.";

/** Links to /guarantee wherever it renders. */
export const GUARANTEE_LINE = "12-month guarantee on our workmanship.";

/** The differentiator: no competitor states a scope. It renders wherever the guarantee does. */
export const GUARANTEE_SCOPE_LINE = "Materials are covered by their own maker's warranty.";

export const HOME_TRUST_LINE =
  "Price agreed before we start · No night or weekend surcharge · 12-month guarantee on our workmanship";

export const URGENT_GRID_NOTE =
  "Not on the list? Tell us what is happening and we will tell you the sensible thing to do.";

/**
 * Owner decision, 19 September 2026: the job count runs, attributed to the plumbers between them.
 * Never "10,000+", and never the company's: the company is three months old.
 */
export const EXPERIENCE_LINE =
  "Our plumbers bring 5+ years' hands-on trade experience and 10,000 jobs between them.";

export const BOOKED_WORK_LINE =
  "We give you a time and we turn up at it. Small jobs are welcome; a dripping tap is a job.";

/** Four ticks under the hero, in this order. */
export const TICK_CHIPS: readonly string[] = [
  "Local plumbers",
  "Price agreed before we start",
  "Fully insured",
  "24/7, and a plumber answers",
];

/** The fixed bar below 640px. Takes the display number so this file stays free of site identity. */
export function MOBILE_CALL_BAR_LABEL(displayNumber: string): string {
  return `Call ${displayNumber}, 24/7`;
}

// ---------------------------------------------------------------------------
// Additions the owner settled on 19 September 2026
// ---------------------------------------------------------------------------

/** The pinned line of the emergency ad. Every service and town page must render it. */
export const AVAILABILITY_LINE = "Open 24/7, including weekends and bank holidays.";

/** Owner, 19 Sept 2026: commercial kitchens, landlord and business work are all in scope. Sitewide,
 *  in the footer, so the ads' "homes and businesses" line is true of every landing page. */
export const WHO_WE_WORK_FOR_LINE = "We work for homes, landlords and businesses.";

export const INSURED_LEAD = "Fully insured, every plumber and every job.";

/** Locked by the excluded-copy spec on /services/emergency-plumbing. Lead plus its rest. */
export const INSURED_LOCKED_SENTENCE = `${INSURED_LEAD} Every job is carried out safely, to standard, and tested before we leave.`;

/** The only place the word "free" is allowed: the photo quote genuinely is one. */
export const FREE_WHATSAPP_LINE = "Send a photo on WhatsApp for a free quote.";

export const SMALL_JOBS_LINE = "Small jobs are welcome. A dripping tap is a job, and we will come out for it.";

/** Conditional by design. The unconditional form is released for one page only, below. */
export const SAME_DAY_DETAIL_LINE =
  "Most jobs are done the same day, depending on what the job turns out to be.";

/**
 * Released by the owner on 18 September 2026 for /services/blocked-drains and nowhere else.
 * lib/services.ts asserts that no other leaf carries it.
 */
export const RELEASED_BLOCKED_DRAINS_LINE = "Blocked today. Cleared today.";

/**
 * Guttering is in scope from 19 September 2026 and is deliberately absent here.
 * This list lives only inside an FAQ answer, never in a heading or in body copy.
 */
export const OUT_OF_SCOPE: readonly string[] = [
  "septic tanks",
  "cesspits",
  "soakaways",
  "land drainage",
  "excavation",
  "relining",
  "roofing",
];

function sentenceList(items: readonly string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

const outOfScopeList = sentenceList(OUT_OF_SCOPE);

/** Opens with the answer, as every FAQ answer must. */
export const OUT_OF_SCOPE_SENTENCE = `No. ${outOfScopeList.charAt(0).toUpperCase()}${outOfScopeList.slice(1)} are not our trade.`;

/**
 * Card 4 of the straight-answers set, on every service leaf and on the town template. It is the
 * only place both ANSWERED_LINE sentences are certain to render now that the hero carries
 * neither, and the card is never collapsed, so the wording here is load-bearing: MUST_RENDER
 * rule 2, checked on every service and town route by tests/ad-page-join.spec.ts.
 */
export const PHONE_ANSWER: Answer = {
  q: "Who answers the phone?",
  lead: PHONE_ANSWERED_SENTENCE,
  rest: `Not a call centre. ${SAME_PERSON_SENTENCE}`,
};

/**
 * Card 8 of the straight-answers set. Payment was settled on 19 September 2026: paid once the
 * work is finished, by cash, card or bank transfer.
 */
export const PAYMENT_ANSWER: Answer = {
  q: "How do I pay?",
  lead: "Once the work is finished.",
  rest: "Cash, card or bank transfer. The price is the one you agreed before we started.",
};

export const PAYMENT_FAQ: Faq = {
  q: "How do I pay?",
  a: `${PAYMENT_ANSWER.lead} ${PAYMENT_ANSWER.rest}`,
};

/** Four Google reviews at 5.0, below the floor of 20. No count, no stars, no rating schema. */
export const HAS_REVIEWS = false;

// ---------------------------------------------------------------------------
// The nine lines every service and town page must render (section 10)
// ---------------------------------------------------------------------------

function escapeForRegExp(literal: string): string {
  return literal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Wording is fixed; only casing and run-together whitespace are forgiven. */
function phrase(literal: string): string {
  return escapeForRegExp(literal).replace(/\s+/g, "\\s+");
}

function anywhere(literal: string): RegExp {
  return new RegExp(phrase(literal), "i");
}

/** Both fragments somewhere in the text, in any order, so split markup still passes. */
function bothAnywhere(first: string, second: string): RegExp {
  return new RegExp(`(?=[\\s\\S]*${phrase(first)})(?=[\\s\\S]*${phrase(second)})`, "i");
}

export interface MustRenderRule {
  label: string;
  test: RegExp;
}

export const MUST_RENDER: readonly MustRenderRule[] = [
  { label: "Availability, 24/7 including weekends and bank holidays", test: anywhere("24/7, including weekends and bank holidays") },
  {
    label: "A plumber answers, and the person who answers is the person who comes",
    test: bothAnywhere(PHONE_ANSWERED_SENTENCE, SAME_PERSON_SENTENCE),
  },
  { label: "No extra charge at night or weekends", test: anywhere("No extra charge at night or weekends") },
  { label: "The price is agreed before we start", test: anywhere("The price is agreed before we start") },
  {
    label: "12-month guarantee on our workmanship, with the materials scope beside it",
    test: bothAnywhere("12-month guarantee on our workmanship", "Materials are covered by their own maker's warranty"),
  },
  { label: "5+ years, the plumbers' experience and never the company's", test: anywhere("5+ years") },
  { label: "Arrival within 45 minutes", test: anywhere("within 45 minutes") },
  { label: "Fully insured", test: anywhere("Fully insured") },
  // "same day" or the adjectival "same-day": the rule is about the wording, not the hyphen.
  { label: "Same day service, arrival and intent", test: /same[\s-]+day/i },
];

// ---------------------------------------------------------------------------
// Where the pinned ad descriptions land on a page
// ---------------------------------------------------------------------------

/**
 * THESE STRINGS ARE VERBATIM AND STAY VERBATIM.
 *
 * Every string in a service leaf's `adLines`, and every string in TOWN_AD_LINES, is the pinned
 * description of a Google ad that lands on that page. An ad may only promise what its own
 * landing page says, so each line has to render there word for word, as ONE text node from ONE
 * string expression, in markup that is always in the document: never inside a disclosure, never
 * behind `hidden`, never truncated, never reworded and never twice on the same page.
 * tests/ad-page-join.spec.ts is the gate, and it costs money when it breaks.
 *
 * The owner removed the boxed "In plain words" card on 19 September 2026. The sentences stayed,
 * folded into the page as ordinary copy, and this function decides where from the data alone so
 * that adding an ad line never means editing a template.
 */
export type AdSlot = "problemLead" | "closingSub" | "howIntro" | "ctaSub";

/**
 * The order the slots fill. Line 1 goes high on the page and line 2 goes to the very bottom,
 * because two ads in one group often overlap almost word for word (both Emergency lines say
 * "A plumber answers, day or night"), and two near-identical sentences in neighbouring sections
 * read as a stutter. The middle slots take the third and fourth lines, which by then belong to
 * a different ad group and no longer repeat each other.
 */
const AD_SLOT_FILL_ORDER: readonly AdSlot[] = ["problemLead", "closingSub", "howIntro", "ctaSub"];

export interface AdLinePlacement {
  /** Lead paragraphs under the problem grid's heading: line 1, plus anything past line 4. */
  problemLead: string[];
  /** The navy closing band's sub line. */
  closingSub?: string;
  /** One line above the three how-it-works steps. */
  howIntro?: string;
  /** The navy CTA band's sub line. */
  ctaSub?: string;
}

/** Duplicates are dropped first, so no page can render the same pinned sentence twice. */
export function placeAdLines(lines: readonly string[]): AdLinePlacement {
  const placement: AdLinePlacement = { problemLead: [] };
  [...new Set(lines)].forEach((line, index) => {
    switch (AD_SLOT_FILL_ORDER[index]) {
      case "closingSub":
        placement.closingSub = line;
        break;
      case "howIntro":
        placement.howIntro = line;
        break;
      case "ctaSub":
        placement.ctaSub = line;
        break;
      // "problemLead" and the overflow past the fourth line both land here, so a fifth line is
      // published rather than silently dropped.
      default:
        placement.problemLead.push(line);
    }
  });
  return placement;
}

// ---------------------------------------------------------------------------
// Form copy (section 6.6). Number-bearing strings are functions of the display number.
// ---------------------------------------------------------------------------

export const FORM_COPY = {
  /** The full booking form, components/BookingForm.tsx. Its shape is settled; it should not grow. */
  full: {
    heading: "Ask us to ring you",
    sub: `Leave your number and postcode and we'll ring you back. If water is coming through the ceiling, ring us now instead. ${PRICE_PROCESS_LINE}`,
    phoneLabel: "Phone number (required)",
    postcodeLabel: "Postcode (required)",
    nameLabel: "Your name (required)",
    problemLabel: "Help us prepare: what's the problem?",
    /** No spec string for the upload control. Written here so the two forms cannot drift. */
    photoLabel: "Add a photo (optional)",
    photoHint: "A photo of the problem helps the plumber work out what the job needs.",
    /** Never a button label carrying the word the WhatsApp photo quote owns. */
    submit: "Ask us to ring you",
    submitting: "Sending...",
    preferToCall: (displayNumber: string) => `Prefer to call? ${displayNumber}`,
    successHeading: "Thanks, we've got your request.",
    successBody: "One of the team will ring you back, check the details and agree the price with you.",
    error: (displayNumber: string) =>
      `Something went wrong sending your request. Please try again, or call us on ${displayNumber}.`,
  },
  /** The card beside the hero on desktop and inside sections lower down. */
  inline: {
    heading: "Let us call you",
    sub: "Leave your number. We'll ring you back.",
    finePrint: "No-obligation. A plumber answers, day or night.",
    submit: "Ask us to ring you",
    submitting: "Sending...",
    successHeading: "Got it. We're on it.",
    error: (displayNumber: string) =>
      `Something went wrong sending your request. Please try again, or call us on ${displayNumber}.`,
  },
} as const;

// ---------------------------------------------------------------------------
// Bands
// ---------------------------------------------------------------------------

export const DEFAULT_CTA_BAND = {
  heading: "Ready when you are.",
  sub: "Ring us, say what's happening, and you agree the price before we start.",
} as const;

export function TOWN_CTA_BAND(town: string): { heading: string; sub: string } {
  return { heading: `Need us in ${town}?`, sub: DEFAULT_CTA_BAND.sub };
}

/** The spec gives the town closing heading only; the sub is the emergency closing sub. */
export function TOWN_CLOSING(town: string): { heading: string; sub: string } {
  return {
    heading: `Ready when you are in ${town}.`,
    sub: "We answer our own phone, and nothing starts until you say yes.",
  };
}

// ---------------------------------------------------------------------------
// The banned list (section 4, plus the owner's decision of 19 September)
// ---------------------------------------------------------------------------

export interface BannedPattern {
  label: string;
  re: RegExp;
}

export const BANNED_PATTERNS: readonly BannedPattern[] = [
  // Price. There is no fee and none may be stated, present or absent.
  { label: "a currency figure", re: /£\s?\d/ },
  { label: "the fee, in any direction", re: /\bno\s+call[-\s]?out\s+fee\b/i },
  { label: "the fee named at all", re: /\bcall[-\s]?out\s+(fee|charge)\b/i },
  { label: "a fee said to be absent", re: /\bfree\s+call[-\s]?out\b/i },
  { label: "a visit said to be free", re: /\bfree\s+(visit|survey|quotation)\b/i },
  { label: "fixed price", re: /\bfixed\s+price\b/i },
  { label: "from a figure", re: /\bfrom\s+£/i },
  // "Free" belongs to the WhatsApp photo quote alone. A string that says free and never says
  // WhatsApp is the failure this catches; the anchor keeps it to one attempt per string.
  { label: '"free" away from the WhatsApp photo quote', re: /^(?![\s\S]*whats\s?app)[\s\S]*\bfree\b/i },

  // Credentials. None are held and none may be implied.
  { label: "the gas credential, any casing", re: /gas\s*safe/i },
  { label: "the gas credential, denied", re: /\bnot\s+gas\s*safe\s+registered\b/i },
  { label: "registered engineers", re: /\bregistered\s+engineers?\b/i },
  { label: "certified or gas-certified", re: /\b(certified|certification)\b/i },
  { label: "accredited", re: /\baccredit(ed|ation|ations)\b/i },
  { label: "an approved-trader badge", re: /\bapproved\s+(installer|contractor|trader)\b/i },
  { label: "a trade body we do not belong to", re: /\b(checkatrade|trustatrader|which\?\s*trusted\s*trader|citb|nvq|city\s*&\s*guilds)\b/i },

  // Work the owner has ruled out of the wording.
  { label: "central heating", re: /\bcentral\s+heating\b/i },
  { label: "unvented", re: /\bunvented\b/i },
  { label: "the water regulation code", re: /\bG3\b/ },

  // Reviews and ratings. HAS_REVIEWS is false.
  { label: "testimonials", re: /\btestimonials?\b/i },
  { label: "a star rating", re: /\b\d\s*[-\s]?star\b|\bstar\s+ratings?\b|\bfive[-\s]star\b/i },
  { label: "a rating", re: /\bratings\b|\baggregate\s?rating\b/i },
  { label: "a review count", re: /\breview\s+count\b|\b\d+\s+reviews\b|\b(customer|google|verified)\s+reviews\b/i },

  // Guaranteed times. "Guaranteed for 12 months" is allowed and must keep passing.
  { label: "a guaranteed time or outcome", re: /\bguaranteed\s+(arrival|response|call[-\s]?out|fix|same[-\s]day|within|in\s+\d)/i },
  { label: "a guaranteed number of minutes or hours", re: /\bguaranteed\s+\d+\s*(min|minute|hour)/i },
  { label: "lifetime or total satisfaction", re: /\blifetime\s+guarantee\b|\b100%\s+satisfaction\b/i },

  // Marketing filler from the section 4 list. Word boundaries throughout, so "beats" and
  // "bestow" are not casualties of banning "best".
  { label: "trusted", re: /\btrusted\b/i },
  { label: "proven", re: /\bproven\b/i },
  { label: "instantly", re: /\binstantly\b/i },
  { label: "on time every time", re: /\bon\s+time\s+every\s+time\b/i },
  { label: "peace of mind", re: /\bpeace\s+of\s+mind\b/i },
  { label: "genuinely", re: /\bgenuinely\b/i },
  { label: "properly", re: /\bproperly\b/i },
  { label: "clear quote", re: /\bclear\s+quote\b/i },
  { label: "transparent pricing", re: /\btransparent\s+pricing\b/i },
  { label: "quick response", re: /\bquick\s+response\b/i },
  { label: "affordable", re: /\baffordable\b/i },
  { label: "cheap", re: /\bcheap(er|est)?\b/i },
  { label: "best", re: /\bbest\b/i },
  { label: "leading", re: /\bleading\b/i },
  { label: "rest assured", re: /\brest\s+assured\b/i },
  { label: "seamless", re: /\bseamless(ly)?\b/i },
  { label: "ensure", re: /\bensur(e|es|ed|ing)\b/i },
  { label: "solutions", re: /\bsolutions?\b/i },
  { label: "dedicated", re: /\bdedicated\b/i },
  { label: "look no further", re: /\blook\s+no\s+further\b/i },
  { label: "delve", re: /\bdelve[sd]?\b/i },
  { label: "elevate", re: /\belevate[sd]?\b/i },
  { label: "tapestry", re: /\btapestry\b/i },
  { label: "in order to", re: /\bin\s+order\s+to\b/i },
  { label: "furthermore", re: /\bfurthermore\b/i },
  { label: "testament", re: /\btestament\b/i },
  { label: "proudly", re: /\bproudly\b/i },

  // Americanisms. The live ad ran all four in a British auction.
  { label: "faucet", re: /\bfaucets?\b/i },
  { label: "unclog", re: /\bunclog(s|ged|ging)?\b/i },
  { label: "prioritize", re: /\bprioritiz(e|es|ed|ing|ation)\b/i },
  { label: "minimize", re: /\bminimiz(e|es|ed|ing|ation)\b/i },

  // Typography.
  { label: "an em-dash", re: new RegExp("\\u2014") },
];

/** The first pattern a string trips, or null. */
export function findBanned(text: string): BannedPattern | null {
  for (const pattern of BANNED_PATTERNS) {
    if (pattern.re.test(text)) return pattern;
  }
  return null;
}

// An ad may only promise what its page renders, so every pinned line has to be sayable. If one
// of them trips the list, the list and the account disagree and the build stops here rather
// than at a deploy.
for (const ad of ADS) {
  const hit = findBanned(ad.pinned);
  if (hit) {
    throw new Error(
      `content/ads.ts: pinned line of ad ${ad.id} trips the banned pattern "${hit.label}": ${ad.pinned}`,
    );
  }
}
