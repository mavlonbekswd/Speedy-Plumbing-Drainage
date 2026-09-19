// Frozen content contracts. Every content leaf, template and test builds against these, so a
// change here is a change to all of them. Dependency-free on purpose: no React, no "@/".

export type ServiceSlug =
  | "emergency-plumbing"
  | "drainage"
  | "blocked-drains"
  | "leak-repairs"
  | "drain-cleaning"
  | "toilet-repairs"
  | "bathroom-plumbing"
  | "hot-water"
  | "saniflo-and-macerators"
  | "boiler-repairs";

// urgent pages carry the same-day and 45-minute lines in the hero; booked pages never do. Three
// booked pages (hot-water, leak-repairs, toilet-repairs) carry the conditional SAME_DAY_DETAIL_LINE
// under their answer cards, because their ads say "we aim to finish the same day". Never in a
// booked hero, and never on bathroom-plumbing: a refit is not a same-day job.
export type ServiceKind = "urgent" | "booked";

// Icons are string keys resolved in components/icons.ts, so data files never import React.
export type IconKey =
  | "phone"
  | "clipboard"
  | "wrench"
  | "drop"
  | "camera"
  | "calendar"
  | "shield"
  | "clock"
  | "toilet"
  | "bath"
  | "flame"
  | "whatsapp";

/** `lead` renders bold, `rest` plain. A reader of the bold alone still gets the answer. */
export interface Answer {
  q: string;
  lead: string;
  rest: string;
}

/** `a` opens with the answer: "Yes.", "No.", "Usually...". */
export interface Faq {
  q: string;
  a: string;
}

/** Symptom-named. Body follows "We ... That means ...". */
export interface ProblemCard {
  title: string;
  body: string;
}

export interface Step {
  icon: IconKey;
  title: string;
  body: string;
}

/** Always-visible prose block, e.g. the radiator-leak section or the dripping-tap answer. */
export interface ContentSection {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface ServiceContent {
  slug: ServiceSlug;
  /** false keeps the page out of routing, nav, sitemap, schema and tests. */
  published: boolean;
  kind: ServiceKind;
  navLabel: string;
  cardBlurb: string;
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    h1Top: string;
    h1Bottom: string;
    sub: string;
    /** Rendered on the service page only, never by TownPage. Holds the one released line. */
    serviceOnlyLine?: string;
  };
  /** Emergency only: the town H1 with "in {town}" inside the question. */
  townH1?: (town: string) => { top: string; bottom: string };
  /** Eight cards: the seven from the spec plus the payment card. answers[0].rest contains "your postcode". */
  answers: Answer[];
  afterAnswers: { text: string; buttonLabel: string };
  problems: { heading: string; sub: string; cards: ProblemCard[] };
  sections?: ContentSection[];
  /**
   * The verbatim pinned descriptions of the ads that land here. Since 19 September 2026 they are
   * no longer boxed under an "In plain words" heading: `placeAdLines` in lib/claims.ts folds them
   * into ordinary page copy, one per slot, each as a single always-visible text node. Order
   * matters, because line 1 leads the problem grid and line 2 closes the page, so a leaf listing two
   * near-identical lines still reads as two separate sentences rather than a stutter.
   */
  adLines: string[];
  ctaBand: { heading: string; sub: string };
  steps: [Step, Step, Step];
  /** Three to five. The out-of-scope list lives only inside an answer here. */
  faqs: Faq[];
  closing: { heading: string; sub: string };
  bookingHeading: string;
  /**
   * Slugs from ILLUSTRATIONS in lib/media.ts: photoreal AI pictures of the PROBLEM a customer is
   * looking at. Since 19 September 2026 they render inside the problem section, directly under
   * the symptom cards, headed "What it can look like" and each with the caption that names the
   * problem. The owner removed the "Illustration" badge, so that heading and those captions are
   * now the whole of what stops a picture of a burst pipe being read as a job we did. Never in
   * the proof strip and never on /projects.
   */
  illustrations?: string[];
  /** Slugs from lib/media.ts shown in this page's proof strip, in order. */
  proof: { photos: string[]; video?: string };
  /** One sentence used on town pages. No geography-flavoured words. */
  townLine: string;
}

export type County =
  | "Cambridgeshire"
  | "Suffolk"
  | "Norfolk"
  | "Essex"
  | "Hertfordshire"
  | "Bedfordshire"
  | "Lincolnshire";

export interface City {
  slug: string;
  name: string;
  county: County;
  /** "organic" = page exists for search only: never an ad Final URL, never in areaServed. */
  tier: 1 | "organic";
  published: boolean;
  blurb: string;
  /**
   * What the templates say instead of "in {name}" when the town itself is NOT served. Bury St
   * Edmunds is targeted only in its village districts (IP28 to IP31, never IP32/IP33), and the
   * three organic towns sit beside districts the ad account excludes, so "Plumbing emergency in
   * Bury St Edmunds?" would claim a place we do not cover. Must still contain `name`, so the
   * page stays findable and the H1 test holds. Example: "the Bury St Edmunds villages".
   */
  placeLabel?: string;
  metaTitle?: string;
  nearbyTowns?: string[];
  /** Subset of lib/coverage.ts, asserted at import. Never a fetched list. */
  postcodeDistricts: string[];
  /** At least five, each verified against a source. */
  nearbyAreas: string[];
  localNote: string;
  serviceNotes: { emergency: string; drains: string; booked?: string };
  /** Verification URLs. Never rendered. */
  sources: string[];
}

export type MediaGroup = "bathroom" | "taps" | "toilets" | "hot-water" | "heating-parts" | "supply" | "drains" | "leaks" | "brand";

export interface WorkPhoto {
  slug: string;
  file: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  group: MediaGroup;
  /** true = AI-made brand graphic. Rendered with a visible "Illustration" label, never in a job gallery. */
  illustration?: true;
  provenance: {
    suppliedBy: "owner";
    suppliedOn: string;
    ownJob: boolean;
    consentOnFile: boolean;
    /** Set only when the job's town is evidenced. Captions never name a town otherwise. */
    townEvidenced?: string;
  };
}

/**
 * An AI-generated picture of a problem, photoreal since 19 September 2026. It carries no badge
 * any more: what keeps it honest is the row heading "What it can look like" and a caption that
 * names the problem and never claims a job, a place, a date or a result.
 */
export interface Illustration {
  slug: string;
  file: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
}

export interface WorkVideo {
  slug: string;
  file: string;
  poster: string;
  width: number;
  height: number;
  seconds: number;
  label: string;
  caption: string;
  group: MediaGroup;
  provenance: WorkPhoto["provenance"];
}

export type AdGroupKey = "E" | "D" | "DC" | "R" | "TR" | "I" | "H" | "B";

export interface AdFixture {
  id: string;
  group: AdGroupKey;
  campaign: 1 | 2 | 3 | 4;
  finalUrl: string;
  pinned: string;
  /** Line in ARIM/speedy/RSA-REWRITE-2026-09-18.md. */
  sourceLine: number;
  /** Page not built yet, so the join test reports it as pending instead of failing. */
  blocked?: true;
}

export interface TownKeywordFixture {
  keyword: string;
  match: "exact" | "phrase";
  group: "E" | "DC";
  finalUrl: `/areas/${string}`;
}
