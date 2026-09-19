import type { ServiceContent } from "../../lib/types";
import {
  AVAILABILITY_LINE,
  COVERAGE_SHORT,
  GUARANTEE_SCOPE_LINE,
  INSURED_LEAD,
  OUT_OF_SCOPE_SENTENCE,
  PAYMENT_ANSWER,
  PAYMENT_FAQ,
  PHONE_ANSWER,
} from "../../lib/claims";

// "Why does it keep happening." Drainage ad B lands here, and seven survey and repair keywords
// from ad group D land here by keyword-level Final URL, so this page carries BOTH D pinned lines.
// Written from S-015 (the third blockage since January, "roots, probably", without looking),
// S-016 (the solicitor's drain survey before exchange) and S-021 (the cracked run under the
// footings, which is where the repair gets referred on).
//
// The scope boundary is the point of the page: Speedy surveys and diagnoses. Excavation and
// relining are out of scope, so no card, section or step offers them.
const drainage: ServiceContent = {
  slug: "drainage",
  published: true,
  kind: "urgent",
  navLabel: "Drainage",
  cardBlurb:
    "We inspect the whole run and tell you what is causing it. That means you deal with the cause instead of paying for the same clearance again.",
  meta: {
    title: "Drainage & Drain Surveys Cambridgeshire | Speedy Plumbing & Drain",
    description: `A drain that keeps blocking has a cause. Camera drain surveys and diagnosis across ${COVERAGE_SHORT}, with you within 45 minutes.`,
  },
  hero: {
    eyebrow: `Drainage, day or night, across ${COVERAGE_SHORT}`,
    h1Top: "Drain keeps blocking?",
    h1Bottom: "We will be with you within 45 minutes.",
    sub: "",
  },
  answers: [
    {
      q: "When will you get here?",
      lead: "Same day, within 45 minutes, 24/7.",
      rest: "You get an arrival time for your postcode when you ring. A survey can be booked for a time that suits you.",
    },
    {
      q: "What does it cost?",
      lead: "The price is agreed before we start.",
      rest: "The full price, including any camera survey, is quoted on site before work starts.",
    },
    {
      q: "Any hidden fees?",
      lead: "None, and no extra charge at night or weekends.",
      rest: "The survey price is the survey price. If what we find needs a different job, you hear about it before anything else happens.",
    },
    PHONE_ANSWER,
    {
      q: "Are you insured?",
      lead: INSURED_LEAD,
      rest: "Every job is carried out safely, to standard, and the run is flow tested before we leave.",
    },
    {
      q: "Who is coming?",
      lead: "One of our own plumbers.",
      rest: "5+ years on the tools and 10,000 jobs between them, so they know what a failing run looks like.",
    },
    {
      q: "What if it fails?",
      lead: "Guaranteed for 12 months.",
      rest: `Every clearance is guaranteed for 12 months on our workmanship. ${GUARANTEE_SCOPE_LINE}`,
    },
    PAYMENT_ANSWER,
  ],
  afterAnswers: {
    text: "Slow drains, smells, gurgling, or the same blockage back again. Tell us your symptoms, where, how often and how long, and you get the whole run looked at.",
    buttonLabel: "Book a callback",
  },
  problems: {
    heading: "Why does it keep happening?",
    sub: "Start with the symptom. Open one for what we do about it.",
    cards: [
      {
        title: "The same drain blocks again and again",
        body: "We inspect the whole run rather than clearing the same spot for the third time. That means you find out what is actually causing it.",
      },
      {
        title: "Slow sinks, baths and showers",
        body: "We check the waste, the trap and the run beyond them, in that order. That means your slow drain is traced back to a cause rather than guessed at.",
      },
      {
        title: "A drain smell that will not go away",
        body: "We look for the dry trap, the failed seal or the debris in the run that is making it. That means the smell goes because what is making it has been dealt with.",
      },
      {
        title: "Roots or a cracked drain under the garden",
        body: "We survey the run on camera, show you where it is cracked and tell you what it needs. That means you get a straight diagnosis, and we say plainly when the repair is someone else's trade.",
      },
      {
        title: "A manhole or gully that keeps backing up",
        body: "We open the manhole, test the flow through the run and find where it is holding water. That means you get a cause, not another clearance.",
      },
      {
        title: "Buying a house and the drains were flagged",
        body: "We survey the run before you exchange and write up what we found in plain English. That means you know what you are buying instead of hoping.",
      },
    ],
  },
  sections: [
    {
      id: "camera-survey",
      heading: "What a camera survey shows",
      paragraphs: [
        "A camera goes down the run and you watch it on a screen with the plumber. You see a fault where it is, and you get its depth and its distance.",
        "It is worth having when a drain has blocked more than once and nobody has looked, or before you buy a house. Afterwards you get plain-English notes on the condition of your drains, and a written quote for what will be done.",
        "We survey and diagnose. We do not dig, and if your drain needs digging you will hear that from us straight.",
      ],
      bullets: [
        "See the fault on screen yourself",
        "Know the depth and the distance",
        "Worth having before you buy a house",
        "Plain-English notes, not a jargon report",
      ],
    },
  ],
  adLines: [
    "A drain that keeps blocking has a cause. We inspect the whole run, not just the symptom.",
    "We arrive within 45 minutes. Open 24/7, including weekends and bank holidays.",
  ],
  ctaBand: {
    heading: "Want to know why it keeps blocking?",
    sub: "Ring, tell us what it is doing, and you agree the price before we start.",
  },
  steps: [
    {
      icon: "phone",
      title: "Ring us",
      body: "A plumber answers the phone, day or night. Tell us the symptoms, where, how often and how long, and give us your postcode.",
    },
    {
      icon: "clipboard",
      title: "Agree the price",
      body: "The plumber quotes on site before any work starts, or from a photo you send on WhatsApp, which is free. No extra charge at night or weekends.",
    },
    {
      icon: "wrench",
      title: "We find the cause",
      body: "We inspect the run, survey it on camera where it needs one, and give you plain-English notes on what we found. Guaranteed for 12 months on our workmanship.",
    },
  ],
  faqs: [
    {
      q: "Do you dig?",
      a: "No. We survey and diagnose. Excavation and relining are not our trade, and we will tell you straight if that is what it needs.",
    },
    {
      q: "Do you take on every kind of drainage job?",
      a: `${OUT_OF_SCOPE_SENTENCE} Drains, gullies, manholes, soil pipes and the wastes inside your home are.`,
    },
    {
      q: "When is a camera survey worth having?",
      a: "Usually when a drain has blocked more than once, or before you buy a house. If we do not think you need one, we will say so.",
    },
    {
      q: "Do you work at night and at weekends?",
      a: `Yes. ${AVAILABILITY_LINE} There is no extra charge for it.`,
    },
    PAYMENT_FAQ,
  ],
  closing: {
    heading: "Want the cause, not another clearance?",
    sub: "We answer our own phone, and nothing starts until you say yes.",
  },
  bookingHeading: "Ask us to ring you",
  illustrations: ["cctv-drain-survey", "blocked-outside-drain"],
  proof: {
    photos: ["drain-jetting-manhole", "under-sink-wastes", "drain-jetting-hose", "outside-tap", "water-supply-pipe"],
    video: "drain-jetting",
  },
  townLine: "Recurring blockages, slow drains and smells, traced back to a cause with a camera survey.",
};

export default drainage;
