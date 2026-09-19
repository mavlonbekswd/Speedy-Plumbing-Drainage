import type { ServiceContent } from "../../lib/types";
import {
  AVAILABILITY_LINE,
  COVERAGE_SHORT,
  GUARANTEE_SCOPE_LINE,
  INSURED_LEAD,
  PAYMENT_ANSWER,
  PAYMENT_FAQ,
  PHONE_ANSWER,
  PRICE_PROCESS_LINE,
} from "../../lib/claims";

// The TR ad group lands here: the repair buyer, not the blockage buyer. A toilet that is blocked
// or overflowing is bought in campaign 2 and lives on blocked drains, so this page keeps to the
// fault the handle makes, the cistern that runs all night, the leak at the base, the failed
// syphon and the macerator unit (S-022, S-023, S-028). The two adLines are the pinned
// descriptions of TR-A and TR-B and must stay verbatim: tests/ad-page-join.spec.ts.
const toiletRepairs: ServiceContent = {
  slug: "toilet-repairs",
  published: true,
  kind: "booked",
  navLabel: "Toilet repairs",
  cardBlurb:
    "We change the valve, the flush part or the seal that has failed and test it. That means the toilet works again without a bucket beside it.",
  meta: {
    title: "Toilet Repairs & Running Cisterns Cambridgeshire | Speedy Plumbing & Drain",
    description: `Running cistern, weak flush or a leak at the base? Toilet repairs across ${COVERAGE_SHORT}, booked for a time that suits you.`,
  },
  hero: {
    eyebrow: `Toilet repairs across ${COVERAGE_SHORT}`,
    h1Top: "Running cistern or a flush that will not work?",
    h1Bottom: "Booked for a time that suits you.",
    sub: "Cisterns, flushes, syphons, fill valves, seals and leaks at the base.",
  },
  answers: [
    {
      q: "When can you come?",
      lead: "At a time that suits you.",
      rest: "Tell us your postcode and we give you a slot, often the same day. If it is the only toilet in the house, a plumber can be with you within 45 minutes.",
    },
    {
      q: "What does it cost?",
      lead: "The price is agreed before we start.",
      rest: "The plumber quotes on site before any work starts, or from a photo you send on WhatsApp, which is free.",
    },
    {
      q: "Any hidden fees?",
      lead: "None, and no extra charge at night or weekends.",
      rest: "Nothing changes without your say-so. If the part it needs turns it into a bigger job, we stop and tell you.",
    },
    PHONE_ANSWER,
    {
      q: "Are you insured?",
      lead: INSURED_LEAD,
      rest: "Every job is carried out safely, to standard, and tested before we leave.",
    },
    {
      q: "Who is coming?",
      lead: "One of our own plumbers.",
      rest: "5+ years on the tools and 10,000 jobs between them, so they have seen this fault before.",
    },
    {
      q: "What if it fails?",
      lead: "Guaranteed for 12 months.",
      rest: `The guarantee covers our workmanship. ${GUARANTEE_SCOPE_LINE}`,
    },
    PAYMENT_ANSWER,
  ],
  afterAnswers: {
    text: "Running cistern, weak flush, a leak at the base, a blocked pan or a macerator that has stopped cutting. Tell us what it is doing, and you get told what it needs. Most jobs are done the same day, depending on what the job turns out to be.",
    buttonLabel: "Book a callback",
  },
  problems: {
    heading: "What we get called out to fix",
    sub: "Start with what you can see. Open one for what we do about it.",
    cards: [
      {
        title: "Cistern that runs or fills noisily",
        body: "We fit a new fill valve or washer and set the water level where it belongs. That means the filling stops and your water bill stops climbing with it.",
      },
      {
        title: "Weak or failing flush",
        body: "We check the syphon, the flush valve and the handle linkage, and change the part that has gone. That means you get one pull of the handle and the pan clears.",
      },
      {
        title: "Leak at the base or the joints",
        body: "We lift or reseat the pan, renew the seal or the pan connector, and test it repeatedly. That means the wet patch on your floor stops coming back.",
      },
      {
        title: "Saniflo or macerator that hums",
        body: "We open the macerator unit, clear or replace what has failed, and run it through a full cycle. That means you get the only toilet on that floor back in use.",
      },
      {
        title: "Cracked cistern or pan",
        body: "We tell you when a repair will hold and when a new pan or cistern costs you less in the end. That means you are not sold a new toilet you do not need.",
      },
      {
        title: "Blocked toilet",
        body: "We clear what is stuck, then flush it through to check the pan empties as it should. That means you watch it working before the plumber leaves.",
      },
    ],
  },
  sections: [
    {
      id: "saniflo-and-macerators",
      heading: "Saniflo and macerator units",
      paragraphs: [
        "We repair, install and service macerator units, Saniflo included. If yours hums, fills and will not empty, ring us and say it is a macerator, so the plumber brings what the unit takes.",
        "There is a page on this site for Saniflo and macerator work, listed under Services, with more on what that work involves.",
      ],
      bullets: ["Repaired, installed and serviced", "Blades and pump cleared or replaced", "Run through a full cycle and tested"],
    },
    {
      id: "repair-or-replace",
      heading: "Repair it or replace it?",
      paragraphs: [
        "Most toilets need a part, not a new toilet. A fill valve, a syphon, a flush mechanism or a seal is a repair, and that is where we start.",
        "When a pan or cistern is cracked, or its parts have not been made for years, we say so. You get told what a new one involves, and nothing is ordered until you say yes.",
      ],
    },
  ],
  adLines: [
    "Describe the fault, running water, weak flush or a visible leak. We repair and test it.",
    "We tell you honestly when replacement beats repair. Replacement advice without upselling.",
  ],
  ctaBand: {
    heading: "Ready when you are.",
    sub: "Ring us, say what the toilet is doing, and you agree the price before we start.",
  },
  steps: [
    {
      icon: "phone",
      title: "Ring us",
      body: `A plumber answers, day or night. Describe the fault and give your postcode, and you get a slot. ${AVAILABILITY_LINE}`,
    },
    {
      icon: "clipboard",
      title: "Agree the price",
      body: "The plumber quotes on site before any work starts, or from a photo you send on WhatsApp, which is free. No extra charge at night or weekends.",
    },
    {
      icon: "wrench",
      title: "We repair and test it",
      body: "We change the part that has failed, test the flush repeatedly and leave the bathroom clean. Guaranteed for 12 months on our workmanship.",
    },
  ],
  faqs: [
    {
      q: "Should I repair it or replace it?",
      a: "Usually repair. A fill valve, a syphon, a flush mechanism or a seal is a part, not a new toilet. We say so when a new pan or cistern makes more sense, and we will not sell you one you do not need.",
    },
    {
      q: "How long does a toilet repair take?",
      a: "Most are done in one visit, depending on the part it needs. The plumber carries the common fill valves, flush parts and seals, and tells you on site if yours has to be ordered.",
    },
    {
      q: "Will a small job turn into a big bill?",
      a: `No. ${PRICE_PROCESS_LINE} If we find something unexpected, we stop and talk to you before it changes the bill.`,
    },
    PAYMENT_FAQ,
  ],
  closing: {
    heading: "Toilet not working as it should?",
    sub: "We answer our own phone, and nothing starts until you say yes.",
  },
  bookingHeading: "Ask us to ring you",
  proof: {
    photos: ["new-toilet", "shower-over-bath", "new-bath-white-tile", "under-sink-wastes", "bath-taps-swap"],
    video: "toilet-flush-test",
  },
  townLine: "Running cisterns, weak flushes, leaks at the base and macerator units repaired and tested.",
};

export default toiletRepairs;
