import type { ServiceContent } from "../../lib/types";
import {
  AVAILABILITY_LINE,
  COVERAGE_SHORT,
  EXPERIENCE_LINE,
  GUARANTEE_SCOPE_LINE,
  INSURED_LEAD,
  OUT_OF_SCOPE_SENTENCE,
  PAYMENT_ANSWER,
  PAYMENT_FAQ,
} from "../../lib/claims";

// The I ad group lands here, and two shower-repair keywords from the R group land here as well
// by keyword-level Final URL (content/ads.ts KEYWORD_URL_OVERRIDES), so this page carries four
// pinned lines: I-A, I-B, R-A and R-B. The shower-repair section and the first problem card give
// the two R lines a home the ad group can stand behind (S-027).
//
// No same-day wording anywhere on this page, by instruction: nobody fits a bathroom in a day.
// The availability facts still appear, framed for the case where something is leaking now.
const bathroomPlumbing: ServiceContent = {
  slug: "bathroom-plumbing",
  published: true,
  kind: "booked",
  navLabel: "Bathroom plumbing",
  cardBlurb:
    "We plumb in the bath, basin, toilet and shower, then test every joint. That means your pipework is sound before anything is tiled over it.",
  meta: {
    title: "Bathroom Plumbing & Refits Cambridgeshire | Speedy Plumbing & Drain",
    description: `New bathroom, new shower or a shower that has failed? Bathroom plumbing across ${COVERAGE_SHORT}, booked for a time that suits you.`,
  },
  hero: {
    eyebrow: `Bathroom plumbing and refits across ${COVERAGE_SHORT}`,
    h1Top: "New bathroom, new shower, new taps?",
    h1Bottom: "Booked for a time that suits you.",
    sub: "Baths, basins, toilets, showers, wastes and the pipework behind them.",
  },
  answers: [
    {
      q: "When can you come?",
      lead: "At a time that suits you.",
      rest: "Tell us your postcode and you get a slot, and we turn up at it. If something is leaking now, that is a same-day call and a plumber can be with you within 45 minutes.",
    },
    {
      q: "What does it cost?",
      lead: "The price is agreed before we start.",
      rest: "We quote from your photos on WhatsApp, which is free, or on site. You agree the scope before anything starts.",
    },
    {
      q: "Any hidden fees?",
      lead: "None, and no extra charge at night or weekends.",
      rest: "Nothing changes without your say-so. If the job changes once the floor is up, we stop and ask you first.",
    },
    {
      q: "Who answers the phone?",
      lead: "A plumber does, day or night.",
      rest: "Not a call centre. The person who answers is the person who comes.",
    },
    {
      q: "Are you insured?",
      lead: INSURED_LEAD,
      rest: "Every job is carried out safely, to standard, and tested before we leave.",
    },
    {
      q: "Do you do installations?",
      lead: "Yes.",
      rest: "New taps, toilets, showers, baths and basins, plus the plumbing for your washing machine and dishwasher.",
    },
    {
      q: "What if it fails?",
      lead: "Guaranteed for 12 months.",
      rest: `The guarantee covers our workmanship. ${GUARANTEE_SCOPE_LINE}`,
    },
    PAYMENT_ANSWER,
  ],
  afterAnswers: {
    text: "A full refit, one new shower, a tap swap, or a shower that has stopped working. Send your photos on WhatsApp and we quote from those, free.",
    buttonLabel: "Book a callback",
  },
  problems: {
    heading: "What we get called out to do",
    sub: "Start with what you want doing. Open one for how it is done.",
    cards: [
      {
        title: "Shower that has failed",
        body: "We strip the shower valve or mixer, fit a new cartridge or new seals, and test it hot and cold. That means you get the shower back without the tiling coming off.",
      },
      {
        title: "New bath, basin or toilet",
        body: "We take the old one out, plumb the new one in and test every joint under water. That means the wastes run and nothing weeps behind your bath panel.",
      },
      {
        title: "Tap and shower replacement",
        body: "We fit the taps or the shower you have chosen, on new valves where the old ones are seized. That means you get what you picked, fitted to work.",
      },
      {
        title: "Wastes and traps that smell or leak",
        body: "We rebuild the trap and the waste run to the right falls, then test it with water. That means the smell goes and your cupboard underneath stays dry.",
      },
      {
        title: "Weak pressure or poor flow",
        body: "We work back through the supply, the valves and the fittings to find the restriction, then put it right. That means your shower runs at the pressure the house can give.",
      },
      {
        title: "Washing machine and dishwasher plumbing",
        body: "We fit the supply valve and the waste connection, then run the machine through a fill. That means your machine works without a puddle behind it.",
      },
    ],
  },
  sections: [
    {
      id: "shower-repairs",
      heading: "Shower stopped working?",
      paragraphs: [
        "A shower that runs cold, drips between uses or has a handle that spins is a repair, not a refit. Ring us, describe it, and you will hear what it is likely to need.",
        "A wet patch under a shower often starts somewhere else, at a seal, a joint or a waste further back. We find where it starts before anything comes off the wall.",
      ],
      bullets: [
        "Cartridges, seals and shower valves replaced",
        "Leaks traced back to the joint at fault",
        "Small jobs booked, not bundled into a refit",
      ],
    },
    {
      id: "how-we-quote",
      heading: "Send your photos and we quote from those",
      paragraphs: [
        "Send photos on WhatsApp, with what you want doing, and we quote from those, free. If the job needs a look first, you get a visit before anything is agreed.",
        `We agree the scope before work starts, so the price you say yes to is the price you pay. ${EXPERIENCE_LINE}`,
      ],
      bullets: ["Scope agreed before anything comes out", "First-fix and final-fix pipework", "Installed, tested and left clean"],
    },
  ],
  adLines: [
    "Share your plans or the fault, photos help. We quote clearly and agree the scope first.",
    "We quote clearly and agree the scope before work starts, then install, test and finish.",
    "Water travels. Where a leak shows is often not where it starts. We trace it to the source.",
    "Small jobs are welcome. A dripping tap is a job, and we will come out for it.",
  ],
  ctaBand: {
    heading: "Ready when you are.",
    sub: "Ring us, say what you want doing, and you agree the price before we start.",
  },
  steps: [
    {
      icon: "phone",
      title: "Ring us or send photos",
      body: `A plumber answers, day or night. Tell us what you want doing and give your postcode, and you get a slot. ${AVAILABILITY_LINE}`,
    },
    {
      icon: "clipboard",
      title: "Agree the price",
      body: "Quotes come from your WhatsApp photos, free, or from a look on site, and we agree the scope before work starts. No extra charge at night or weekends.",
    },
    {
      icon: "wrench",
      title: "We install and test it",
      body: "We do the plumbing, run the water, check every joint and leave your room clean. Guaranteed for 12 months on our workmanship.",
    },
  ],
  faqs: [
    {
      q: "Can you plumb a new bathroom?",
      a: "Yes, the plumbing side. Send photos on WhatsApp and we quote from those, free.",
    },
    {
      q: "Will you fit things I have bought myself?",
      a: "Yes. We fit customer-supplied parts. The 12-month guarantee covers our workmanship, not the part itself.",
    },
    {
      q: "Do you do the tiling and the electrics?",
      a: "No. We do the plumbing side: baths, basins, toilets, showers, taps, wastes and pipework. Bring in your own tiler and electrician, and the plumbing works around them.",
    },
    {
      q: "Is there work you do not take on?",
      a: `${OUT_OF_SCOPE_SENTENCE} Taps, toilets, basins, baths, showers, wastes and pipework are.`,
    },
    PAYMENT_FAQ,
  ],
  closing: {
    heading: "Planning a bathroom, or stuck with a shower?",
    sub: "We answer our own phone, and nothing starts until you say yes.",
  },
  bookingHeading: "Ask us to ring you",
  proof: {
    photos: ["new-bath-white-tile", "shower-over-bath", "bath-shower-grey-tile", "shower-enclosure", "bath-taps-swap"],
    video: "bathroom-refit",
  },
  townLine: "Baths, basins, toilets and showers fitted, plus shower repairs when one stops working.",
};

export default bathroomPlumbing;
