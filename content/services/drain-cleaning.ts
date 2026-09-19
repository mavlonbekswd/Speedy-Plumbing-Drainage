import type { ServiceContent } from "../../lib/types";
import {
  AVAILABILITY_LINE,
  COVERAGE_SHORT,
  GUARANTEE_SCOPE_LINE,
  INSURED_LEAD,
  PAYMENT_ANSWER,
  PAYMENT_FAQ,
  PHONE_ANSWER,
} from "../../lib/claims";

// "Stop it happening, or check it before you buy or let." Both Drain Cleaning ads land here, so
// the page carries DC-A and DC-B's pinned lines verbatim.
//
// This is a maintenance buyer, not a panic buyer: S-020 the slow kitchen sink with a four-pound
// bottle under it, S-018 the six-bed HMO between tenancies, S-017 the restaurant floor gully.
// RSA-REWRITE is explicit that emergency copy on a considered buyer is a verified mismatch, so
// the cards, the section and the FAQs carry no urgency device, no threat and no imperative. The
// hero keeps the 45-minute line because the page is kind "urgent" and the template renders the
// same-day line either way.
const drainCleaning: ServiceContent = {
  slug: "drain-cleaning",
  published: true,
  kind: "urgent",
  navLabel: "Drain cleaning",
  cardBlurb:
    "We clean and descale the run before grease and scale build up into a blockage. That means you keep the drains flowing instead of waiting for them to stop.",
  meta: {
    title: "Drain Cleaning & Descaling Cambridgeshire | Speedy Plumbing & Drain",
    description: `Drain cleaning and descaling, landlord and pre-purchase drain checks across ${COVERAGE_SHORT}, with plain-English notes.`,
  },
  hero: {
    eyebrow: `Drain cleaning, day or night, across ${COVERAGE_SHORT}`,
    h1Top: "Slow drain or a smell?",
    h1Bottom: "We will be with you within 45 minutes.",
    sub: "",
  },
  answers: [
    {
      q: "When will you get here?",
      lead: "Same day, within 45 minutes, 24/7.",
      rest: "You get an arrival time for your postcode when you ring. A clean can also be booked for a time that suits you.",
    },
    {
      q: "What does it cost?",
      lead: "The price is agreed before we start.",
      rest: "The full price of the clean, including any descaling, is quoted on site before work starts.",
    },
    {
      q: "Any hidden fees?",
      lead: "None, and no extra charge at night or weekends.",
      rest: "Nothing changes without your say-so. If the run needs more than a clean, we tell you before we do it.",
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
      rest: "5+ years on the tools and 10,000 jobs between them, so they know what a kitchen run collects.",
    },
    {
      q: "What if it fails?",
      lead: "Guaranteed for 12 months.",
      rest: `Our workmanship is guaranteed for 12 months. ${GUARANTEE_SCOPE_LINE}`,
    },
    PAYMENT_ANSWER,
  ],
  afterAnswers: {
    text: "A slow kitchen sink, a smell when the dishwasher runs, or a rental you want checked. Tell us about the property and any symptoms that keep coming back.",
    buttonLabel: "Book a callback",
  },
  problems: {
    heading: "What a drain clean deals with.",
    sub: "Tell us what your drains are doing. Open one for what we do about it.",
    cards: [
      {
        title: "Grease and fat building up in the kitchen run",
        body: "We clean and descale the run with the right equipment for the pipework. That means the grease comes out before it sets hard enough to stop the flow.",
      },
      {
        title: "Scale narrowing an older pipe",
        body: "We descale the bore of the pipe instead of punching a hole through what is in it. That means the run goes back to the size it was built at.",
      },
      {
        title: "A smell you cannot trace",
        body: "We clean the run and check the traps and the seals around it. That means the smell is dealt with where it starts rather than masked.",
      },
      {
        title: "A rental property between tenancies",
        body: "We clean the drains, check the runs and write up their condition before the tenants move in. That means you hand over a property with the drainage in order.",
      },
      {
        title: "Drains to check before you buy",
        body: "We check the runs, clean them where they need it, and note their condition in plain English. That means you know what the drains are like before you commit.",
      },
      {
        title: "A commercial kitchen gully filling up",
        body: "We clean the floor gullies and the grease run, and we can come back on a schedule you set. That means the kitchen keeps working and you are not waiting on a blockage.",
      },
    ],
  },
  sections: [
    {
      id: "landlords-and-buyers",
      heading: "Landlord checks and pre-purchase checks",
      paragraphs: [
        "If you let a property, the drains are usually yours to keep in repair. We check them between tenancies, clean what needs it and write down what we found.",
        "If you are buying, we check the drains before you commit, so a fault is something you know about rather than inherit. You get plain-English notes on the condition of your drains, not a jargon report.",
        "The same check suits a business that would rather book the drains in than react to them. Tell us the property and how often you want us, and we work to that.",
      ],
      bullets: [
        "Checked between tenancies, written up",
        "Cleaned and descaled where it needs it",
        "Plain-English notes on their condition",
        "Booked for a time that suits you",
      ],
    },
  ],
  adLines: [
    "We clean and descale the run with the right equipment for the pipework.",
    "Pre-purchase and landlord drain checks, with plain-English notes on their condition.",
  ],
  ctaBand: {
    heading: "Want the drains looked at?",
    sub: "Ring, tell us about the property, and you agree the price before we start.",
  },
  steps: [
    {
      icon: "phone",
      title: "Ring us",
      body: "A plumber answers the phone, day or night. Tell us about the property, any recurring symptoms and your postcode.",
    },
    {
      icon: "clipboard",
      title: "Agree the price",
      body: "The plumber quotes on site before any work starts, or from a photo you send on WhatsApp, which is free. No extra charge at night or weekends.",
    },
    {
      icon: "wrench",
      title: "We clean and descale",
      body: "We clean and descale the run with the right equipment for the pipework, then flow test it. You get plain-English notes on the condition of your drains, and 12 months on our workmanship.",
    },
  ],
  faqs: [
    {
      q: "How often should drains be cleaned?",
      a: "It depends on what goes down them. A busy kitchen needs it far more often than a family home, and if yours do not need it yet we will say so.",
    },
    {
      q: "Do you work on commercial kitchens and rental properties?",
      a: "Yes. Commercial kitchens, rental properties and businesses that want a schedule, with visits at set intervals rather than when something stops.",
    },
    {
      q: "What do I get in writing?",
      a: "Plain-English notes on the condition of your drains, and a written quote for anything that needs doing. What we found, what we cleaned, and what will be done.",
    },
    {
      q: "Do you answer at night and at weekends?",
      a: `Yes. ${AVAILABILITY_LINE} There is no extra charge for it.`,
    },
    PAYMENT_FAQ,
  ],
  closing: {
    heading: "Want your drains cleaned and written up?",
    sub: "We answer our own phone, and nothing starts until you say yes.",
  },
  bookingHeading: "Ask us to ring you.",
  illustrations: ["cctv-drain-survey", "blocked-kitchen-sink"],
  proof: {
    photos: ["drain-jetting-hose", "drain-jetting-manhole", "under-sink-wastes", "kitchen-mixer-tap", "outside-tap"],
    video: "drain-jetting",
  },
  townLine: "Preventative drain cleaning, descaling and landlord or pre-purchase drain checks, written up in plain English.",
};

export default drainCleaning;
