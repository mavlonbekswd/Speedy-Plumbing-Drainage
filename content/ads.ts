import type { AdFixture, TownKeywordFixture } from "../lib/types";

// The ad-to-page join. Source: ARIM/speedy/RSA-REWRITE-2026-09-18.md (16 ads, one pinned
// description each, no pinned headlines) and REBUILD-2026-09-18.md section 3 (the town rule).
// An ad may only promise what its own landing page renders, so every `pinned` string below
// must appear verbatim in the visible text of its `finalUrl`. tests/ad-page-join.spec.ts reads
// this file. Change a string here only when the ad itself changes in the account.
export const ADS: readonly AdFixture[] = [
  {
    id: "E-A",
    group: "E",
    campaign: 1,
    finalUrl: "/services/emergency-plumbing",
    pinned: "Open 24/7, including weekends and bank holidays. A plumber answers, day or night.",
    sourceLine: 118,
  },
  {
    id: "E-B",
    group: "E",
    campaign: 1,
    finalUrl: "/services/emergency-plumbing",
    pinned: "We arrive within 45 minutes. A plumber answers, day or night. Open 24/7 all year.",
    sourceLine: 181,
  },
  {
    id: "D-A",
    group: "D",
    campaign: 2,
    finalUrl: "/services/blocked-drains",
    pinned: "We arrive within 45 minutes. Open 24/7, including weekends and bank holidays.",
    sourceLine: 246,
  },
  {
    id: "D-B",
    group: "D",
    campaign: 2,
    finalUrl: "/services/drainage",
    pinned: "A drain that keeps blocking has a cause. We inspect the whole run, not just the symptom.",
    sourceLine: 286,
  },
  {
    id: "DC-A",
    group: "DC",
    campaign: 2,
    finalUrl: "/services/drain-cleaning",
    pinned: "We clean and descale the run with the right equipment for the pipework.",
    sourceLine: 343,
  },
  {
    id: "DC-B",
    group: "DC",
    campaign: 2,
    finalUrl: "/services/drain-cleaning",
    pinned: "Pre-purchase and landlord drain checks, with plain-English notes on their condition.",
    sourceLine: 383,
  },
  {
    id: "R-A",
    group: "R",
    campaign: 3,
    finalUrl: "/services/leak-repairs",
    pinned: "Water travels. Where a leak shows is often not where it starts. We trace it to the source.",
    sourceLine: 453,
  },
  {
    id: "R-B",
    group: "R",
    campaign: 3,
    finalUrl: "/services/leak-repairs",
    pinned: "Small jobs are welcome. A dripping tap is a job, and we will come out for it.",
    sourceLine: 493,
  },
  {
    id: "TR-A",
    group: "TR",
    campaign: 3,
    finalUrl: "/services/toilet-repairs",
    pinned: "Describe the fault, running water, weak flush or a visible leak. We repair and test it.",
    sourceLine: 552,
  },
  {
    id: "TR-B",
    group: "TR",
    campaign: 3,
    finalUrl: "/services/toilet-repairs",
    pinned: "We tell you honestly when replacement beats repair. Replacement advice without upselling.",
    sourceLine: 592,
  },
  {
    id: "I-A",
    group: "I",
    campaign: 3,
    finalUrl: "/services/bathroom-plumbing",
    pinned: "Share your plans or the fault, photos help. We quote clearly and agree the scope first.",
    sourceLine: 651,
  },
  {
    id: "I-B",
    group: "I",
    campaign: 3,
    finalUrl: "/services/bathroom-plumbing",
    pinned: "We quote clearly and agree the scope before work starts, then install, test and finish.",
    sourceLine: 691,
  },
  {
    id: "H-A",
    group: "H",
    campaign: 3,
    finalUrl: "/services/hot-water",
    pinned: "No hot water and the cold is fine? Ring us and describe what the switch is doing.",
    sourceLine: 752,
  },
  {
    id: "H-B",
    group: "H",
    campaign: 3,
    finalUrl: "/services/hot-water",
    pinned: "A weeping radiator valve or no hot water at all. Describe it and we take it from there.",
    sourceLine: 792,
  },
  // PROPOSED, not yet in the account (ADS-SIDE-ACTIONS-2026-09-19.md, action 5): the nine
  // Saniflo and macerator keywords get their own ad group, written to their own page. The page
  // renders this line already, so the join holds on the day the ad group is created.
  {
    id: "SM-A",
    group: "TR",
    campaign: 3,
    finalUrl: "/services/saniflo-and-macerators",
    pinned: "Saniflo or macerator humming, tripping, smelling or blocked? We repair or replace it.",
    sourceLine: 0,
  },
  {
    id: "B-A",
    group: "B",
    campaign: 4,
    finalUrl: "/services/boiler-repairs",
    pinned: "We cover boiler work and arrange boiler repairs. Ring and tell us what it is doing.",
    sourceLine: 864,
    blocked: true,
  },
  {
    id: "B-B",
    group: "B",
    campaign: 4,
    finalUrl: "/services/boiler-repairs",
    pinned: "Our workmanship is guaranteed for 12 months. Materials are covered by their maker.",
    sourceLine: 905,
    blocked: true,
  },
];

// Keyword-level Final URLs that land an ad group on a town page instead of its service page.
// The Saniflo and shower keywords land on service pages and are covered by KEYWORD_URL_OVERRIDES.
export const TOWN_KEYWORDS: readonly TownKeywordFixture[] = [
  { keyword: "[emergency plumber cambridge]", match: "exact", group: "E", finalUrl: "/areas/cambridge" },
  { keyword: '"emergency plumber cambridge"', match: "phrase", group: "E", finalUrl: "/areas/cambridge" },
  { keyword: "[emergency plumber ely]", match: "exact", group: "E", finalUrl: "/areas/ely" },
  { keyword: '"emergency plumber ely"', match: "phrase", group: "E", finalUrl: "/areas/ely" },
  { keyword: "[emergency plumber newmarket]", match: "exact", group: "E", finalUrl: "/areas/newmarket" },
  { keyword: '"emergency plumber newmarket"', match: "phrase", group: "E", finalUrl: "/areas/newmarket" },
  { keyword: "[emergency plumber huntingdon]", match: "exact", group: "E", finalUrl: "/areas/huntingdon" },
  { keyword: "[emergency plumber haverhill]", match: "exact", group: "E", finalUrl: "/areas/haverhill" },
  { keyword: "[emergency plumber st neots]", match: "exact", group: "E", finalUrl: "/areas/st-neots" },
  { keyword: "[drain cleaning cambridge]", match: "exact", group: "DC", finalUrl: "/areas/cambridge" },
  { keyword: "[drain unblocking cambridge]", match: "exact", group: "DC", finalUrl: "/areas/cambridge" },
];

// Service-page overrides: these ad groups send some keywords to a second service page, so that
// page must render the group's pinned lines too.
export const KEYWORD_URL_OVERRIDES: readonly { group: AdFixture["group"]; finalUrl: string; keywords: number }[] = [
  { group: "D", finalUrl: "/services/drainage", keywords: 7 },
  { group: "R", finalUrl: "/services/bathroom-plumbing", keywords: 2 },
  { group: "TR", finalUrl: "/services/saniflo-and-macerators", keywords: 9 },
];

// Organic-only town pages. No ad or keyword may ever point at these while the targeting stands.
export const NEVER_A_FINAL_URL = ["/areas/kings-lynn", "/areas/peterborough", "/areas/bedford"] as const;

// Pinned lines a town page must carry so any /areas/<slug> is a safe Final URL for the two
// ad groups that use town keywords today.
export const TOWN_AD_LINES: readonly string[] = ADS.filter(
  (ad) => !ad.blocked && (ad.group === "E" || ad.group === "DC"),
).map((ad) => ad.pinned);
