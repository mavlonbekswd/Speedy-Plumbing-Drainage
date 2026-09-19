// The locked geography. The site does not change it: the 66 targeted districts and the eight
// exclusions are the Google Ads account's own targeting, recorded in ARIM/speedy/engagement.md,
// and a page that claims service where the account excludes it puts the two in contradiction.
//
// This file imports nothing. lib/towns.ts imports it, registers a town lookup on the way past,
// and re-exports checkPostcode. Importing this file on its own therefore works and returns
// district-level answers; importing it through lib/towns.ts adds the town. Keeping the arrow
// pointing one way is deliberate: a cycle here crashes at module evaluation depending only on
// which file the bundler reaches first.

/**
 * The 66 outward codes the campaigns target. Order is the account's: by prefix, then numerically.
 */
export const TARGETED_DISTRICTS: readonly string[] = [
  "CB1", "CB3", "CB4", "CB5", "CB6", "CB7", "CB8", "CB9", "CB10", "CB11",
  "CB21", "CB22", "CB23", "CB24", "CB25",
  "CM6", "CM7", "CM22", "CM23", "CM24",
  "CO6", "CO9", "CO10",
  "IP6", "IP7", "IP14", "IP21", "IP22", "IP23", "IP24", "IP25", "IP26", "IP27",
  "IP28", "IP29", "IP30", "IP31",
  "MK43", "MK44", "MK45",
  "NR16", "NR17", "NR18",
  "PE6", "PE7", "PE8", "PE9", "PE13", "PE14", "PE15", "PE16", "PE19",
  "PE26", "PE27", "PE28", "PE29", "PE33", "PE34", "PE37", "PE38",
  "SG7", "SG8", "SG9", "SG11", "SG18", "SG19",
];

/**
 * CB2 is south Cambridge and the villages under it. The site covers it, because the Cambridge
 * page covers the whole city, but it is not in the ad targeting and the owner did not add it,
 * so it stays out of TARGETED_DISTRICTS and the postcode checker still answers "yes" to it.
 */
export const SITE_ONLY_DISTRICTS: readonly string[] = ["CB2"];

/**
 * Actively excluded in the account. Peterborough city and Bedford town have site pages for
 * search only, and those pages must not claim service in these districts.
 */
export const EXCLUDED_DISTRICTS: readonly string[] = [
  "PE1", "PE2", "PE3", "PE4", "PE5",
  "MK40", "MK41", "MK42",
];

export const COVERED_DISTRICTS: readonly string[] = [...TARGETED_DISTRICTS, ...SITE_ONLY_DISTRICTS];

const COVERED = new Set(COVERED_DISTRICTS);

if (TARGETED_DISTRICTS.length !== 66) {
  throw new Error(`lib/coverage.ts: TARGETED_DISTRICTS must hold 66 districts, found ${TARGETED_DISTRICTS.length}`);
}

const DUPLICATES = COVERED_DISTRICTS.filter((d, i) => COVERED_DISTRICTS.indexOf(d) !== i);
if (DUPLICATES.length > 0) {
  throw new Error(`lib/coverage.ts: duplicate districts ${DUPLICATES.join(", ")}`);
}

for (const district of EXCLUDED_DISTRICTS) {
  if (COVERED.has(district)) {
    throw new Error(`lib/coverage.ts: ${district} is both covered and excluded`);
  }
}

const FULL_POSTCODE = /^([A-Z]{1,2}\d[A-Z\d]?)(\d[A-Z]{2})$/;
const OUTWARD_ONLY = /^[A-Z]{1,2}\d[A-Z\d]?$/;

/**
 * The outward code of a full or partial UK postcode, uppercased. "cb1 2ab" and "CB1" both give
 * "CB1". A compacted value that is ambiguous, "CB12", is read as the district CB12 rather than
 * guessed at, so it comes back as not covered instead of as Cambridge.
 */
export function extractDistrict(input: string): string | null {
  if (typeof input !== "string") return null;
  const cleaned = input.toUpperCase().replace(/[^A-Z0-9 ]/g, " ").trim();
  if (cleaned === "") return null;

  // A space the visitor typed is evidence, so it is read before the value is compacted. It is
  // what tells "CB1 2", half way through typing, from the district CB12.
  const tokens = cleaned.split(/\s+/);
  if (tokens.length > 1 && OUTWARD_ONLY.test(tokens[0])) return tokens[0];

  const compact = cleaned.replace(/\s+/g, "");
  const full = FULL_POSTCODE.exec(compact);
  if (full) return full[1];
  if (OUTWARD_ONLY.test(compact)) return compact;

  return null;
}

export function isCoveredDistrict(district: string): boolean {
  return COVERED.has(district.toUpperCase());
}

export interface TownRef {
  slug: string;
  name: string;
}

export interface PostcodeCheck {
  status: "covered" | "not_covered" | "invalid";
  district?: string;
  town?: TownRef;
}

type TownLookup = (district: string) => TownRef | null;

let townLookup: TownLookup | null = null;

/**
 * lib/towns.ts calls this at module scope. Nothing else should: the lookup is the published
 * Tier 1 list, and a second source for it would let the checker and the pages disagree.
 */
export function registerTownLookup(lookup: TownLookup): void {
  townLookup = lookup;
}

/**
 * Answers the first question a customer asks. The town is filled in only when lib/towns.ts is
 * in the module graph, so import checkPostcode from lib/towns.ts in anything that links to a
 * town page.
 */
export function checkPostcode(input: string): PostcodeCheck {
  const district = extractDistrict(input);
  if (!district) return { status: "invalid" };
  if (!COVERED.has(district)) return { status: "not_covered", district };

  const town = townLookup ? townLookup(district) : null;
  return town ? { status: "covered", district, town } : { status: "covered", district };
}
