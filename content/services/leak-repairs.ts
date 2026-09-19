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

// The R ad group lands here and its 14 keywords turn on one word: tap (S-024, S-049). The old
// site filed taps under the bathroom refit page, which is the wrong page for one dripping tap,
// so the `dripping-tap` section below exists to answer her first gate, "will you even come out
// for this", before anything else. The two adLines are the pinned descriptions of R-A and R-B
// and must stay verbatim: tests/ad-page-join.spec.ts.
const leakRepairs: ServiceContent = {
  slug: "leak-repairs",
  published: true,
  kind: "booked",
  navLabel: "Leak repairs",
  cardBlurb:
    "We trace the leak back to where it starts and repair it there. That means the damp stops instead of coming back in a fortnight.",
  meta: {
    title: "Leak Repairs & Dripping Taps Cambridgeshire | Speedy Plumbing & Drain",
    description: `Dripping tap, leaking shower or a leak you cannot find? Leak repairs across ${COVERAGE_SHORT}, booked for a time that suits you.`,
  },
  hero: {
    eyebrow: `Leak and tap repairs across ${COVERAGE_SHORT}`,
    h1Top: "Dripping tap or a leak you cannot find?",
    h1Bottom: "Booked for a time that suits you.",
    sub: "Taps, showers, waste pipes and hidden leaks, traced and repaired.",
  },
  answers: [
    {
      q: "When can you come?",
      lead: "At a time that suits you.",
      rest: "Tell us your postcode and we give you a slot, often the same day. If you cannot stop the water, a plumber can be with you within 45 minutes.",
    },
    {
      q: "What does it cost?",
      lead: "The price is agreed before we start.",
      rest: "The plumber quotes on site before any work starts, or from a photo you send on WhatsApp, which is free.",
    },
    {
      q: "Any hidden fees?",
      lead: "None, and no extra charge at night or weekends.",
      rest: "Nothing changes without your say-so. If the leak turns out to be a bigger job once we are in, we stop and tell you.",
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
      rest: "5+ years on the tools and 10,000 jobs between them, so they have seen your problem before.",
    },
    {
      q: "What if it fails?",
      lead: "Guaranteed for 12 months.",
      rest: `The guarantee covers our workmanship. ${GUARANTEE_SCOPE_LINE}`,
    },
    PAYMENT_ANSWER,
  ],
  afterAnswers: {
    text: "Dripping taps, leaking showers, leaks under the sink and damp you cannot explain. If water is coming through a ceiling now, that is an emergency, and our emergency plumbing page covers it. Most jobs are done the same day, depending on what the job turns out to be.",
    buttonLabel: "Book a callback",
  },
  problems: {
    heading: "What we get called out to fix.",
    sub: "Start with what you can see. Open one for what we do about it.",
    cards: [
      {
        title: "Dripping tap",
        body: "We change the washer, the cartridge or the whole tap, whichever the tap needs, and run it to check. That means the drip stops and you stop hearing it at night.",
      },
      {
        title: "Leaking shower or mixer",
        body: "We strip the mixer, fit a new cartridge or new seals, and test it hot and cold. That means you get the shower back, and it stops dripping between uses.",
      },
      {
        title: "Leak under the sink",
        body: "We work out which joint, trap or waste is leaking and repair that one. That means your cupboard dries out instead of going soft.",
      },
      {
        title: "A stain and nothing dripping",
        body: "We trace the leak back from the stain to the pipe or joint at fault, under floors and behind walls. That means you lose the boards over the leak, not the ones under the stain.",
      },
      {
        title: "Weeping joints and fittings",
        body: "We cut out the failed joint, remake it in new fittings and retest the pressure. That means the drip stops and your floor underneath stays dry.",
      },
      {
        title: "Pressure loss or a meter that turns",
        body: "We check the stopcock, the valves and the run for a leak, and watch the meter with everything off. That means you find out where the water is going before your bill does.",
      },
    ],
  },
  sections: [
    {
      id: "dripping-tap",
      heading: "Just a dripping tap?",
      paragraphs: [
        "That is a job, and we will come out for it. You do not need to save it up with other work to make the visit worth it.",
        "The plumber works out what the tap needs: a washer, a cartridge, or a new tap. You get the price for that before anything is taken apart.",
      ],
      bullets: [
        "Washer or cartridge changed in one visit",
        "Whole tap swapped where the tap is worn",
        "Kitchen, bathroom and garden taps",
        "Price agreed before the tap comes apart",
      ],
    },
    {
      id: "hidden-leaks",
      heading: "A stain on the ceiling and nothing to see",
      paragraphs: [
        "Water runs along joists and pipes before it shows, so the wet patch is often a long way from the fault. We start with what you can see and work back from there.",
        "We use the meter, the stopcock and access where it is needed, then repair the pipe or joint at fault and retest the pressure.",
      ],
      bullets: ["Traced under floors and behind walls", "Repaired at the fault, not at the stain", "Pressure retested before we leave"],
    },
  ],
  adLines: [
    "Water travels. Where a leak shows is often not where it starts. We trace it to the source.",
    "Small jobs are welcome. A dripping tap is a job, and we will come out for it.",
  ],
  ctaBand: {
    heading: "Ready when you are.",
    sub: "Ring us, say what is dripping or where the damp is, and you agree the price before we start.",
  },
  steps: [
    {
      icon: "phone",
      title: "Ring us",
      body: `A plumber answers, day or night. Tell us what you can see and give your postcode, and you get a slot. ${AVAILABILITY_LINE}`,
    },
    {
      icon: "clipboard",
      title: "Agree the price",
      body: "The plumber quotes on site before any work starts, or from a photo you send on WhatsApp, which is free. No extra charge at night or weekends.",
    },
    {
      icon: "wrench",
      title: "We do the repair",
      body: "We repair the leak, retest the pressure and check it is dry before leaving. Guaranteed for 12 months on our workmanship.",
    },
  ],
  faqs: [
    {
      q: "Will you come out for one dripping tap?",
      a: "Yes. A dripping tap is a job and we take it on its own. You will not be asked to find other work to go with it.",
    },
    {
      q: "I rent. Who books the plumber, and who pays?",
      a: "Either of you can ring, but tell us when you book that you rent. Your landlord has to agree to the work before we start, and we need to know who the bill goes to.",
    },
    {
      q: "Will you fit a tap I have bought myself?",
      a: "Yes. We fit customer-supplied parts. The 12-month guarantee covers our workmanship, not the part itself.",
    },
    PAYMENT_FAQ,
  ],
  closing: {
    heading: "Got a leak, or a tap that will not stop?",
    sub: "We answer our own phone, and nothing starts until you say yes.",
  },
  bookingHeading: "Ask us to ring you.",
  proof: {
    photos: ["kitchen-mixer-tap", "outside-tap", "under-sink-wastes", "water-supply-pipe", "bath-taps-swap"],
    video: "pipework-under-floor",
  },
  townLine: "Dripping taps, leaking showers and hidden leaks traced back to the pipe at fault.",
};

export default leakRepairs;
