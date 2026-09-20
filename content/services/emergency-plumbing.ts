import type { ServiceContent } from "../../lib/types";
import {
  ANSWERED_LINE,
  CALL_OUT_FEE_LEAD,
  COST_LEAD,
  COVERAGE_SHORT,
  GUARANTEE_SCOPE_LINE,
  HIDDEN_FEES_LEAD,
  INSURED_LEAD,
  NIGHT_RATE_LINE,
  PAYMENT_ANSWER,
  PAYMENT_FAQ,
  PHONE_ANSWER,
  PRICE_PROCESS_LINE,
} from "../../lib/claims";

// The money page: both Emergency ads land here, and six town keywords reuse its answers.
// Copy is the owner-approved wording of SITE-BUILD-PROMPT section 6.2. The two adLines are the
// pinned descriptions of ads E-A and E-B and must stay verbatim: tests/ad-page-join.spec.ts.
const emergencyPlumbing: ServiceContent = {
  slug: "emergency-plumbing",
  published: true,
  kind: "urgent",
  navLabel: "Emergency plumbing",
  cardBlurb:
    "We stop the water, find the fault and repair it. That means the damage stops getting worse while you wait.",
  meta: {
    title: "Emergency Plumber Cambridgeshire | 24/7 Call-Out | Speedy Plumbing & Drain",
    description: `Burst pipe, leak or no water? Emergency plumber across ${COVERAGE_SHORT}, with you within 45 minutes. A plumber answers, day or night.`,
  },
  hero: {
    eyebrow: `Emergency plumber, day or night, across ${COVERAGE_SHORT}`,
    h1Top: "Plumbing emergency?",
    h1Bottom: "We will be with you within 45 minutes.",
    // No sub on purpose: the spec gives this page none, and the symptom list is the sentence under
    // the answer cards. It keeps the phone first screen inside its word budget.
    sub: "",
  },
  townH1: (town) => ({
    top: `Plumbing emergency in ${town}?`,
    bottom: "We will be with you within 45 minutes.",
  }),
  answers: [
    {
      q: "When will you get here?",
      lead: "Same day, within 45 minutes, 24/7.",
      rest: "You get an arrival time for your postcode when you ring.",
    },
    {
      q: "What does it cost?",
      lead: COST_LEAD,
      rest: "The plumber quotes on site before any work begins, or from a photo you send on WhatsApp, which is free.",
    },
    {
      q: "Any hidden fees?",
      lead: HIDDEN_FEES_LEAD,
      rest: `${NIGHT_RATE_LINE} ` + "Nothing changes without your say-so. If the job turns out bigger once we are in, we stop and tell you first.",
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
    text: "Burst pipe, leak, no water, toilet that will not flush. Call us now and a plumber will be on site within 45 minutes.",
    buttonLabel: "Book a callback",
  },
  problems: {
    heading: "What we're called out for.",
    sub: "Start with what you can see. Open one for what we do about it.",
    cards: [
      {
        title: "Burst pipe repair",
        body: "We shut the water off at the stopcock, cut out the split section of pipe and fit new pipe. That means the leak stops and the ceiling below it can start drying out.",
      },
      {
        title: "Leak detection and repair",
        body: "We trace the leak back from the stain to the joint or pipe at fault, then repair that. That means the damp stops spreading instead of coming back in a fortnight.",
      },
      {
        title: "No water or loss of pressure",
        body: "We check the stopcock, the valves and the pipe for an airlock, in that order. That means you get the supply back without anyone guessing at it.",
      },
      {
        title: "Blocked toilet",
        body: "We clear the blockage without damaging the pan, then flush it through to check. That means the only bathroom in the house is back in use.",
      },
      {
        title: "Overflowing cistern or tank",
        body: "We replace the failed float valve and set the water level. That means the overflow pipe stops dripping and the tank stops filling itself.",
      },
      {
        title: "Failed stopcock or valve",
        body: "We replace the seized or leaking valve and test the isolation. That means you can turn your own water off next time.",
      },
    ],
  },
  adLines: [
    "Open 24/7, including weekends and bank holidays. A plumber answers, day or night.",
    "We arrive within 45 minutes. A plumber answers, day or night. Open 24/7 all year.",
  ],
  ctaBand: {
    heading: "Need us now?",
    sub: "Ring, say what's happening, and you agree the price before we start.",
  },
  steps: [
    {
      icon: "phone",
      title: "Ring us",
      body: "A plumber answers, day or night. Say what is happening and your postcode, and you get an arrival time.",
    },
    {
      icon: "clipboard",
      title: "Agree the price",
      body: "The plumber quotes on site before any work starts, or from a photo you send on WhatsApp, which is free. No extra charge at night or weekends.",
    },
    {
      icon: "wrench",
      title: "We get it sorted",
      body: "We fix it, run the water to check it, and leave it working. Guaranteed for 12 months on our workmanship.",
    },
  ],
  faqs: [
    {
      q: "What counts as a plumbing emergency?",
      a: "Water where it should not be, no water at all, or the only toilet in the house out of action. If you are not sure, ring and describe it. We will tell you if it can wait until morning.",
    },
    {
      q: "Do you answer at night and at weekends?",
      a: `Yes. 24/7, including bank holidays, and there is no extra charge for it. ${ANSWERED_LINE}`,
    },
    {
      q: "How is the price agreed?",
      a: `${CALL_OUT_FEE_LEAD} ${PRICE_PROCESS_LINE} The plumber looks at the job and gives you the price on site, and nothing starts until you say yes.`,
    },
    {
      q: "Do you guarantee your work?",
      a: `Yes. 12 months on our workmanship. ${GUARANTEE_SCOPE_LINE}`,
    },
    PAYMENT_FAQ,
  ],
  closing: {
    heading: "Need an emergency plumber now?",
    sub: "We answer our own phone, and nothing starts until you say yes.",
  },
  bookingHeading: "Ask us to ring you.",
  illustrations: ["burst-pipe-under-sink", "turning-off-the-stopcock", "water-through-the-ceiling"],
  proof: {
    photos: ["under-sink-wastes", "water-supply-pipe", "outside-tap", "kitchen-mixer-tap", "new-toilet"],
    video: "pipework-under-floor",
  },
  townLine: "Burst pipes, leaks you cannot stop and no water, answered by a plumber day or night.",
};

export default emergencyPlumbing;
