import type { ServiceContent } from "../../lib/types";
import {
  COVERAGE_SHORT,
  GUARANTEE_SCOPE_LINE,
  INSURED_LEAD,
  PAYMENT_ANSWER,
  PAYMENT_FAQ,
  PHONE_ANSWER,
} from "../../lib/claims";

// Nine live keywords land here by keyword-level Final URL, so this page carries BOTH pinned lines
// of the TR ad group (content/ads.ts, KEYWORD_URL_OVERRIDES). S-028: the third-largest cluster on
// the toilet line, and the buyer's first gate is "do you even work on these", because most
// plumbers will not touch one.
//
// "Saniflo" is SFA's trade mark and is used here only as the customer's word for the unit, which
// is how they type it. No approved, authorised or accredited wording, and no other brand name.
const sanifloAndMacerators: ServiceContent = {
  slug: "saniflo-and-macerators",
  published: true,
  kind: "booked",
  navLabel: "Saniflo and macerators",
  cardBlurb:
    "We repair, unblock or replace the macerator unit and test it under a full flush. That means your toilet works again without the bathroom being pulled apart.",
  meta: {
    title: "Saniflo and Macerator Repairs Cambridgeshire | Speedy Plumbing & Drain",
    description: `Saniflo and macerator units repaired, unblocked, replaced or installed across ${COVERAGE_SHORT}. A plumber answers the phone.`,
  },
  hero: {
    eyebrow: `Saniflo and macerator repairs across ${COVERAGE_SHORT}`,
    h1Top: "Saniflo or macerator playing up?",
    h1Bottom: "Booked for a time that suits you.",
    sub: "Humming, running on, tripping, smelling or blocked. We repair, unblock, replace and install them.",
  },
  answers: [
    {
      q: "When can you come?",
      lead: "At a time that suits you.",
      rest: "Give us your postcode and you get a time, and we turn up at it. If it is your only toilet, a plumber can be with you within 45 minutes.",
    },
    {
      q: "What does it cost?",
      lead: "The price is agreed before we start.",
      rest: "The plumber quotes on site before any work begins, or from a photo you send on WhatsApp, which is free.",
    },
    {
      q: "Any hidden fees?",
      lead: "None, and no extra charge at night or weekends.",
      rest: "Nothing changes without your say-so. If the unit turns out to need replacing, you hear that before anything else happens.",
    },
    PHONE_ANSWER,
    {
      q: "Are you insured?",
      lead: INSURED_LEAD,
      rest: "Every job is carried out safely, to standard, and your unit is run and tested before we leave.",
    },
    {
      q: "Who is coming?",
      lead: "One of our own plumbers.",
      rest: "5+ years on the tools and 10,000 jobs between them, so they have worked on these units before.",
    },
    {
      q: "What if it fails?",
      lead: "Guaranteed for 12 months.",
      rest: `The guarantee covers our workmanship, on a repair and on a new unit. ${GUARANTEE_SCOPE_LINE}`,
    },
    PAYMENT_ANSWER,
  ],
  afterAnswers: {
    text: "A unit that hums, runs on, trips out, smells or will not clear. Tell us what yours is doing and you get a time that suits you.",
    buttonLabel: "Book a callback",
  },
  problems: {
    heading: "What goes wrong with these units",
    sub: "Start with what you can hear or see. Open one for what we do about it.",
    cards: [
      {
        title: "It hums but will not cut",
        body: "We open the unit, clear what has jammed the blade and test it under a full flush. That means your toilet empties again instead of filling up.",
      },
      {
        title: "It runs on and will not stop",
        body: "We check the pressure switch and the membrane, then replace whichever has failed. That means the noise stops and your unit is not wearing itself out.",
      },
      {
        title: "It keeps tripping the electrics",
        body: "We work out whether the fault is the unit or the spur feeding it. That means you are not paying two trades to guess at the same thing.",
      },
      {
        title: "Blocked with wipes or sanitary items",
        body: "We strip the unit down, take out what is wrapped round the blade and flush it through. That means the blockage is gone rather than pushed further along.",
      },
      {
        title: "A smell coming off the unit",
        body: "We clean it out, check the seals and the vent, then refit it. That means the smell goes instead of being masked with bleach.",
      },
      {
        title: "Water leaking underneath",
        body: "We trace the leak to the seal, the hose or the connection and repair it. That means your floor stays dry and the unit is not sitting in water.",
      },
    ],
  },
  adLines: [
    "Saniflo or macerator humming, tripping, smelling or blocked? We repair or replace it.",
    "Describe the fault, running water, weak flush or a visible leak. We repair and test it.",
    "We tell you honestly when replacement beats repair. Replacement advice without upselling.",
  ],
  ctaBand: {
    heading: "Want it looked at?",
    sub: "Ring us, say what the unit is doing, and you agree the price before we start.",
  },
  steps: [
    {
      icon: "phone",
      title: "Ring us",
      body: "A plumber answers, day or night. Say what the unit is doing and give us your postcode, and you get a time.",
    },
    {
      icon: "clipboard",
      title: "Agree the price",
      body: "The plumber quotes on site before any work starts, or from a photo you send on WhatsApp, which is free. No extra charge at night or weekends.",
    },
    {
      icon: "wrench",
      title: "We get it running",
      body: "We repair or replace what has failed, then flush it through and test it in front of you. Guaranteed for 12 months on our workmanship.",
    },
  ],
  faqs: [
    {
      q: "What can and cannot go down a macerator toilet?",
      a: "Only human waste and toilet paper. Wipes, sanitary items, kitchen roll and cotton buds wrap round the blade and stop it. If yours is blocked, stop using the toilet and do not put anything else down it until it is looked at.",
    },
    {
      q: "Is it worth repairing, or do I need a new one?",
      a: "Usually a repair. Most faults are a jammed blade, a pressure switch or a seal, and those are parts rather than a whole new unit. We tell you honestly when replacement beats repair, and you hear it on the first visit.",
    },
    {
      q: "Can you fit one where there is no soil pipe nearby?",
      a: "Usually yes. That is what these units are for: they pump waste along small-bore pipe to where the drain actually is. We look at the route for the small-bore pipe first, then quote.",
    },
    {
      q: "Do you answer at night and at weekends?",
      a: "Yes. We answer 24/7, including weekends and bank holidays, and there is no extra charge for it. If the macerator toilet is the only one you have, you can often have someone out the same day.",
    },
    PAYMENT_FAQ,
  ],
  closing: {
    heading: "Want your macerator looked at?",
    sub: "We answer our own phone, and nothing starts until you say yes.",
  },
  bookingHeading: "Ask us to ring you",
  proof: {
    photos: ["new-toilet", "under-sink-wastes", "bath-taps-swap", "shower-enclosure", "washing-machine"],
    video: "toilet-flush-test",
  },
  townLine:
    "Saniflo and macerator units repaired, unblocked and replaced, by a plumber who answers the phone.",
};

export default sanifloAndMacerators;
