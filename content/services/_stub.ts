import type { ServiceContent, ServiceKind, ServiceSlug, Step } from "../../lib/types";

// Skeleton factory. A service leaf starts as its three facts, slug, kind and navLabel, and
// nothing else: the copy unit replaces each leaf wholesale rather than filling this in field by
// field. Every string and array below is empty on purpose, and `published` stays false until
// one of them is a real page, because lib/services.ts only asserts the shape of published ones.
//
// The three step icons are the sequence every page uses, ring then agree then fix. They carry
// no copy, so they are safe to set here; the titles and bodies are not.
const STEP_ICONS: readonly ["phone", "clipboard", "wrench"] = ["phone", "clipboard", "wrench"];

function emptySteps(): [Step, Step, Step] {
  const [first, second, third] = STEP_ICONS.map((icon) => ({ icon, title: "", body: "" }));
  return [first, second, third] as [Step, Step, Step];
}

export function stubService(slug: ServiceSlug, kind: ServiceKind, navLabel: string): ServiceContent {
  return {
    slug,
    published: false,
    kind,
    navLabel,
    cardBlurb: "",
    meta: { title: "", description: "" },
    hero: { eyebrow: "", h1Top: "", h1Bottom: "", sub: "" },
    answers: [],
    afterAnswers: { text: "", buttonLabel: "" },
    problems: { heading: "", sub: "", cards: [] },
    adLines: [],
    ctaBand: { heading: "", sub: "" },
    steps: emptySteps(),
    faqs: [],
    closing: { heading: "", sub: "" },
    bookingHeading: "",
    proof: { photos: [] },
    townLine: "",
  };
}
