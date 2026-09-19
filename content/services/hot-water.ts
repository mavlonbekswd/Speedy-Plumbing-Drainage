import type { ServiceContent } from "../../lib/types";
import {
  COVERAGE_SHORT,
  GUARANTEE_SCOPE_LINE,
  INSURED_LEAD,
  OUT_OF_SCOPE_SENTENCE,
  PAYMENT_ANSWER,
  PAYMENT_FAQ,
} from "../../lib/claims";

// Eighteen live keywords point here and nothing on the old site named hot water, an immersion
// heater, a water heater or a radiator (RSA-REWRITE-2026-09-18.md, ad group H, item 4b).
//
// Scope, from the owner's decision of 19 September 2026: no hot water and hot water faults,
// immersion heaters, electric water heaters, and hot water cylinders repaired and replaced under
// the 12-month workmanship guarantee. Radiators are LEAKS AND VALVES only, which is what keeps
// this page plumbing-side (S-029). No gas wording, no boiler, no heating, no credential.
//
// kind is "booked", so no same-day or 45-minute wording in the hero. The urgent case is answered
// where it belongs, inside an answer and an FAQ: no hot water in winter is urgent to the customer.
const hotWater: ServiceContent = {
  slug: "hot-water",
  published: true,
  kind: "booked",
  navLabel: "Hot water",
  cardBlurb:
    "We find why the hot water has stopped and repair it. That means you get the hot water back without anyone guessing at it.",
  meta: {
    title: "No Hot Water? Hot Water Repairs Cambridgeshire | Speedy Plumbing & Drain",
    description: `No hot water, immersion heater or radiator leak? Hot water repairs across ${COVERAGE_SHORT}. A plumber answers, day or night.`,
  },
  hero: {
    eyebrow: `Hot water repairs across ${COVERAGE_SHORT}`,
    h1Top: "No hot water?",
    h1Bottom: "Ring us and tell us what it is doing.",
    // One short sub. The template prints the booked line directly under it, so this says what the
    // page covers instead of repeating it.
    sub: "Immersion heaters, water heaters, cylinders and leaking radiator valves, repaired or replaced.",
  },
  answers: [
    {
      q: "When can you come?",
      lead: "At a time that suits you.",
      rest: "Give us your postcode and you get a time, and we turn up at it. If it cannot wait, a plumber can be with you within 45 minutes.",
    },
    {
      q: "What does it cost?",
      lead: "The price is agreed before we start.",
      rest: "The plumber quotes on site before any work begins, or from a photo you send on WhatsApp, which is free.",
    },
    {
      q: "Any hidden fees?",
      lead: "None, and no extra charge at night or weekends.",
      rest: "Nothing changes without your say-so. If the job needs a part nobody expected, you hear about it first.",
    },
    {
      q: "Who answers the phone?",
      lead: "A plumber does, day or night.",
      rest: "Not a call centre. The person who answers is the person who comes.",
    },
    {
      q: "Are you insured?",
      lead: INSURED_LEAD,
      rest: "Every job is carried out safely, to standard, and your hot water is run and tested before we leave.",
    },
    {
      q: "Who is coming?",
      lead: "One of our own plumbers.",
      rest: "5+ years on the tools and 10,000 jobs between them, so they have seen your problem before.",
    },
    {
      q: "What if it fails?",
      lead: "Guaranteed for 12 months.",
      rest: `The guarantee covers our workmanship, including a cylinder we fit. ${GUARANTEE_SCOPE_LINE}`,
    },
    PAYMENT_ANSWER,
  ],
  afterAnswers: {
    text: "No hot water, a heater that keeps tripping, a cylinder leaking or a radiator valve weeping onto the floor. We take this work for landlords as well as homeowners. If you rent, tell us when you book: your landlord has to agree before we start. Most jobs are done the same day, depending on what the job turns out to be.",
    buttonLabel: "Book a callback",
  },
  problems: {
    heading: "What we get called out to",
    sub: "Start with what you can see. Open one for what we do about it.",
    cards: [
      {
        title: "No hot water at all",
        body: "We check the switch, the thermostat and the element before we touch anything else. That means you find out whether it is the heater or the wiring on the first visit.",
      },
      {
        title: "Immersion heater not working",
        body: "We test the element and the thermostat, then replace whichever has failed. That means your water heats again without a new cylinder going in.",
      },
      {
        title: "Electric water heater faults",
        body: "We work out why the unit has stopped, then repair or replace it. That means your hot water comes back without the kitchen being pulled about.",
      },
      {
        title: "Leaking or cold hot water cylinder",
        body: "We check the valves, the thermostat and the connections on your cylinder. That means a repair gets looked at before anyone talks you into a new cylinder.",
      },
      {
        title: "Hot water that runs out fast",
        body: "We look at the cylinder, the element and how your water is drawn off. That means you are told plainly whether a repair will fix it or not.",
      },
      {
        title: "Radiator valve weeping onto the floor",
        body: "We repack or replace the valve, then run it and watch the joint. That means the drip stops and your floorboards get a chance to dry out.",
      },
    ],
  },
  adLines: [
    "No hot water and the cold is fine? Ring us and describe what the switch is doing.",
    "A weeping radiator valve or no hot water at all. Describe it and we take it from there.",
  ],
  sections: [
    {
      id: "radiator-leaks",
      heading: "Radiator leaking?",
      paragraphs: [
        "A wet patch on the wall or the floor by a radiator almost always starts at a valve or a joint. That is a leak, and a leak is plumbing, so you are in the right place.",
        "A towel and a tray under it will catch the drips while you wait for us. Turn the valve off if you can reach it.",
        "We trace the weep back to the valve, the gland or the joint, repair that, then run it and watch the joint stay dry.",
      ],
      bullets: [
        "Weeping valve nuts and glands repaired",
        "Leaking joints traced and sealed",
        "Wet patches near a radiator looked at",
        "Your floor and wall left dry",
      ],
    },
    {
      id: "hot-water-cylinders",
      heading: "Hot water cylinders, repaired or replaced",
      paragraphs: [
        "A cylinder can often be repaired rather than swapped. A failed immersion element, a tired thermostat or a weeping valve is a repair, and you get told that on the first visit.",
        "When yours does need replacing, we take the old one out, fit the new one and run the hot water through it. Our workmanship is guaranteed for 12 months, and the cylinder itself is covered by its maker's warranty.",
      ],
      bullets: [
        "Elements and thermostats replaced",
        "Leaking valves and connections repaired",
        "Old cylinder out, new one fitted",
        "Hot water run and tested with you",
      ],
    },
  ],
  ctaBand: {
    heading: "Want the hot water back on?",
    sub: "Ring us, say what it is doing, and you agree the price before we start.",
  },
  steps: [
    {
      icon: "phone",
      title: "Ring us",
      body: "A plumber answers, day or night. Say what the switch or the tap is doing and give us your postcode, and you get a time.",
    },
    {
      icon: "clipboard",
      title: "Agree the price",
      body: "The plumber quotes on site before any work starts, or from a photo you send on WhatsApp, which is free. No extra charge at night or weekends.",
    },
    {
      icon: "wrench",
      title: "We sort the hot water",
      body: "We repair or replace the part that has failed, run your hot water and check it holds. Guaranteed for 12 months on our workmanship.",
    },
  ],
  faqs: [
    {
      q: "Is no hot water an emergency?",
      a: "Usually not, but it can be. If it cannot wait, a plumber can be with you within 45 minutes, and the phone is answered 24/7, including weekends and bank holidays. You can often have someone out the same day.",
    },
    {
      q: "Do you replace cylinders and immersion heaters?",
      a: "Yes. We repair and replace immersion heaters, electric water heaters and hot water cylinders. Our workmanship is guaranteed for 12 months and the unit itself is covered by its maker's warranty.",
    },
    {
      q: "Do you fit parts I have bought?",
      a: "Yes. We fit customer-supplied parts. The 12-month guarantee covers our workmanship, not the part itself.",
    },
    PAYMENT_FAQ,
    {
      q: "Do you do septic tanks, soakaways or drain relining?",
      a: `${OUT_OF_SCOPE_SENTENCE} Immersion heaters, water heaters, cylinders, radiator valves and pipework are.`,
    },
  ],
  closing: {
    heading: "Want your hot water sorted?",
    sub: "We answer our own phone, and nothing starts until you say yes.",
  },
  bookingHeading: "Ask us to ring you",
  proof: {
    photos: [
      "hot-water-system-cupboard",
      "hot-water-thermostat",
      "safety-valve",
      "hot-water-system-loft",
      "shower-over-bath",
    ],
    video: "electric-shower-test",
  },
  townLine:
    "No hot water, immersion heaters and leaking radiator valves, repaired by a plumber who answers the phone.",
};

export default hotWater;
