import type { ServiceContent } from "../../lib/types";
import {
  COVERAGE_SHORT,
  GUARANTEE_SCOPE_LINE,
  INSURED_LEAD,
  PAYMENT_ANSWER,
  PAYMENT_FAQ,
  RELEASED_BLOCKED_DRAINS_LINE,
} from "../../lib/claims";

// "It is blocked now." Drainage ad A lands here, so the page carries D-A's pinned line verbatim.
// Copy follows SITE-BUILD-PROMPT section 6.3 and the scenarios it was written from: S-012 the
// overflowing patio gully, S-013 the only toilet in the flat, S-014 sewage in the shower tray,
// S-019 the manhole lifting on a bank holiday.
//
// This is the one leaf allowed to carry RELEASED_BLOCKED_DRAINS_LINE, and only in
// hero.serviceOnlyLine: lib/services.ts asserts that on every leaf, published or not. The
// conditional qualifier sits in the first answer card, which is always visible beside it.
const blockedDrains: ServiceContent = {
  slug: "blocked-drains",
  published: true,
  kind: "urgent",
  navLabel: "Blocked drains",
  cardBlurb:
    "We find where it is blocked, unblock it and run water through to check. That means the drain is back in use and you know the blockage has gone.",
  meta: {
    title: "Blocked Drains Cambridgeshire | 24/7 Unblocking | Speedy Plumbing & Drain",
    description: `Blocked sink, toilet or outside drain? We unblock drains across ${COVERAGE_SHORT}, with you within 45 minutes, day or night.`,
  },
  hero: {
    eyebrow: `Drain unblocking, day or night, across ${COVERAGE_SHORT}`,
    h1Top: "Blocked drain?",
    h1Bottom: "We will be with you within 45 minutes.",
    // No sub: the symptom list lives under the answer cards, which keeps the phone first screen
    // inside its word budget.
    sub: "",
    serviceOnlyLine: RELEASED_BLOCKED_DRAINS_LINE,
  },
  answers: [
    {
      q: "When will you get here?",
      lead: "Same day, within 45 minutes, 24/7.",
      rest: "You get an arrival time for your postcode when you ring. Most drains are cleared the same day, depending on what we find.",
    },
    {
      q: "What does it cost?",
      lead: "The price is agreed before we start.",
      rest: "The full price, including any camera survey or repair, is quoted on site before work starts.",
    },
    {
      q: "Any hidden fees?",
      lead: "None, and no extra charge at night or weekends.",
      rest: "Nothing changes without your say-so. If the blockage turns out to be something bigger, we stop and tell you first.",
    },
    {
      q: "Who answers the phone?",
      lead: "A plumber does, day or night.",
      rest: "Not a call centre. The person who answers is the person who comes.",
    },
    {
      q: "Are you insured?",
      lead: INSURED_LEAD,
      rest: "Every job is carried out safely, to standard, and flow tested before we leave.",
    },
    {
      q: "Who is coming?",
      lead: "One of our own plumbers.",
      rest: "5+ years on the tools and 10,000 jobs between them, so they have seen your blockage before.",
    },
    {
      q: "What if it fails?",
      lead: "Guaranteed for 12 months.",
      rest: `Every clearance is guaranteed for 12 months on our workmanship. ${GUARANTEE_SCOPE_LINE}`,
    },
    PAYMENT_ANSWER,
  ],
  afterAnswers: {
    text: "Slow sink, gurgling toilet, water backing up outside. We find the blockage, unblock it, and check it has gone.",
    buttonLabel: "Book a callback",
  },
  problems: {
    heading: "What we get called out to unblock",
    sub: "Start with what you can see. Open one for what we do on arrival.",
    cards: [
      {
        title: "Blocked kitchen or bathroom sink",
        body: "We take the trap off, clear the waste and run the water through to check it. That means your sink empties again and you can see the blockage has gone.",
      },
      {
        title: "Blocked toilet",
        body: "We clear the pan and the soil pipe without damaging either, then flush it through. That means your only toilet is back in use.",
      },
      {
        title: "Blocked shower or bath",
        body: "We pull the hair and grease out of the waste and the trap, then run it to check. That means you can shower without standing in water.",
      },
      {
        title: "Outside drain or gully backing up",
        body: "We lift the cover, find where the run is blocked and clear it by rodding or jetting. That means the water goes down the drain instead of across your patio.",
      },
      {
        title: "A drain that keeps blocking",
        body: "We clear it first, then tell you what a camera survey of the whole run would show. That means you can deal with the cause instead of paying for this twice.",
      },
      {
        title: "Sewage smell or a manhole lifting",
        body: "We open the manhole, find the blockage in the run and clear it. That means the sewage goes back where it belongs and your house stops smelling of it.",
      },
    ],
  },
  adLines: ["We arrive within 45 minutes. Open 24/7, including weekends and bank holidays."],
  ctaBand: {
    heading: "Blocked right now?",
    sub: "Ring, say what is blocked and where, and you agree the price before we start.",
  },
  steps: [
    {
      icon: "phone",
      title: "Ring us",
      body: "A plumber answers the phone, day or night. Say what is blocked and your postcode, and you get an arrival time.",
    },
    {
      icon: "clipboard",
      title: "Agree the price",
      body: "The plumber quotes on site before any work starts, or from a photo you send on WhatsApp, which is free. No extra charge at night or weekends.",
    },
    {
      icon: "wrench",
      title: "We unblock it",
      body: "We find the blockage, clear it by rodding or jetting, and run water through to check it has gone. Guaranteed for 12 months on our workmanship.",
    },
  ],
  faqs: [
    {
      q: "What causes a blocked drain?",
      a: "Fat, hair, leaves, roots and wipes, including the ones that say flushable. Fat sets hard on the wall of the pipe, and roots get into your run through a cracked joint.",
    },
    {
      q: "What should I do before you arrive?",
      a: "Stop running water into it and do not pour drain chemicals down it. They damage pipes and rarely clear a blockage.",
    },
    {
      q: "Is it my drain or the water company's?",
      a: "Usually yours, if it only serves your home and sits inside your boundary. Shared drains and public sewers are the water company's, so ring and describe it and we will tell you who to call.",
    },
    PAYMENT_FAQ,
  ],
  closing: {
    heading: "Need a drain unblocked now?",
    sub: "We answer our own phone, and nothing starts until you say yes.",
  },
  bookingHeading: "Ask us to ring you",
  illustrations: ["blocked-outside-drain", "blocked-kitchen-sink"],
  proof: {
    photos: ["drain-jetting-manhole", "drain-jetting-hose", "under-sink-wastes", "water-supply-pipe", "outside-tap"],
    video: "drain-jetting",
  },
  townLine: "Blocked sinks, toilets and garden drains cleared by rodding or jetting, day or night.",
};

export default blockedDrains;
