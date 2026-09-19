// The town barrel. Static imports of all 31 leaves, so the list is one thing the bundler,
// the sitemap, the schema and the tests all read, and no page can invent a town.
//
// Imports coverage.ts and registers the town lookup on it. The arrow only ever points this
// way: coverage.ts imports nothing, which is what keeps this pair out of a module cycle.

import type { City, County } from "./types";
import { COVERAGE_LINE } from "./claims";
import {
  COVERED_DISTRICTS,
  EXCLUDED_DISTRICTS,
  registerTownLookup,
  type TownRef,
} from "./coverage";

import cambridge from "../content/towns/cambridge";
import ely from "../content/towns/ely";
import huntingdon from "../content/towns/huntingdon";
import stNeots from "../content/towns/st-neots";
import wisbech from "../content/towns/wisbech";
import march from "../content/towns/march";
import chatteris from "../content/towns/chatteris";
import stIves from "../content/towns/st-ives";
import soham from "../content/towns/soham";
import newmarket from "../content/towns/newmarket";
import haverhill from "../content/towns/haverhill";
import buryStEdmunds from "../content/towns/bury-st-edmunds";
import mildenhall from "../content/towns/mildenhall";
import brandon from "../content/towns/brandon";
import stowmarket from "../content/towns/stowmarket";
import sudbury from "../content/towns/sudbury";
import thetford from "../content/towns/thetford";
import diss from "../content/towns/diss";
import attleborough from "../content/towns/attleborough";
import watton from "../content/towns/watton";
import downhamMarket from "../content/towns/downham-market";
import swaffham from "../content/towns/swaffham";
import saffronWalden from "../content/towns/saffron-walden";
import braintree from "../content/towns/braintree";
import royston from "../content/towns/royston";
import bishopsStortford from "../content/towns/bishops-stortford";
import biggleswade from "../content/towns/biggleswade";
import stamford from "../content/towns/stamford";
import kingsLynn from "../content/towns/kings-lynn";
import peterborough from "../content/towns/peterborough";
import bedford from "../content/towns/bedford";

/** Keyed by the leaf's filename. The key is asserted against the leaf's own slug below. */
const TOWN_LEAVES: Readonly<Record<string, City>> = {
  cambridge,
  ely,
  huntingdon,
  "st-neots": stNeots,
  wisbech,
  march,
  chatteris,
  "st-ives": stIves,
  soham,
  newmarket,
  haverhill,
  "bury-st-edmunds": buryStEdmunds,
  mildenhall,
  brandon,
  stowmarket,
  sudbury,
  thetford,
  diss,
  attleborough,
  watton,
  "downham-market": downhamMarket,
  swaffham,
  "saffron-walden": saffronWalden,
  braintree,
  royston,
  "bishops-stortford": bishopsStortford,
  biggleswade,
  stamford,
  "kings-lynn": kingsLynn,
  peterborough,
  bedford,
};

export const TOWNS: readonly City[] = Object.values(TOWN_LEAVES);

export const PUBLISHED_TOWNS: readonly City[] = TOWNS.filter((town) => town.published);

/** All Tier 1 towns, published or not. The coverage label is built from these. */
export const TIER1: readonly City[] = TOWNS.filter((town) => town.tier === 1);

export const TOWN_BY_SLUG: Readonly<Record<string, City>> = TOWN_LEAVES;

/** The order counties appear in every generated list, label and county grouping. */
export const COUNTY_ORDER: readonly County[] = [
  "Cambridgeshire",
  "Suffolk",
  "Norfolk",
  "Essex",
  "Hertfordshire",
  "Bedfordshire",
  "Lincolnshire",
];

/** The phrase templates put after "in": the town, or its placeLabel where the town itself is not served. */
export function placeOf(city: City): string {
  return city.placeLabel ?? city.name;
}

export function townHref(slug: string): string {
  return `/areas/${slug}`;
}

// ---------------------------------------------------------------------------
// Assertions. Each throws with the town it is complaining about, because a list this long is
// edited by hand and a silent mistake here becomes a wrong claim on a live page.
// ---------------------------------------------------------------------------

const COVERED = new Set(COVERED_DISTRICTS);
const EXCLUDED = new Set(EXCLUDED_DISTRICTS);

/** Every rule a single town must satisfy. Exported so a test can drive it with a bad object. */
export function assertTown(city: City, knownSlugs: ReadonlySet<string>): void {
  if (city.placeLabel !== undefined && !city.placeLabel.includes(city.name)) {
    throw new Error(`lib/towns.ts: ${city.slug}: placeLabel "${city.placeLabel}" must contain the town name`);
  }
  if (city.tier === "organic" && city.published && !city.placeLabel) {
    throw new Error(`lib/towns.ts: ${city.slug}: an organic town must set placeLabel, its own districts are not served`);
  }
  const where = `lib/towns.ts: ${city.slug}`;

  if (!city.name.trim()) throw new Error(`${where}: name is empty`);
  if (city.postcodeDistricts.length === 0) throw new Error(`${where}: no postcode districts`);

  for (const district of city.postcodeDistricts) {
    if (!COVERED.has(district)) {
      throw new Error(`${where}: district ${district} is not in COVERED_DISTRICTS`);
    }
    if (EXCLUDED.has(district)) {
      throw new Error(`${where}: district ${district} is excluded in the ad account`);
    }
  }

  for (const slug of city.nearbyTowns ?? []) {
    if (!knownSlugs.has(slug)) throw new Error(`${where}: nearbyTowns names ${slug}, which has no leaf`);
    if (slug === city.slug) throw new Error(`${where}: nearbyTowns names itself`);
  }

  if (!city.published) return;

  if (!city.blurb.trim()) throw new Error(`${where}: published with an empty blurb`);
  if (!city.localNote.trim()) throw new Error(`${where}: published with an empty localNote`);
  if (!city.serviceNotes.emergency.trim()) throw new Error(`${where}: published with an empty serviceNotes.emergency`);
  if (!city.serviceNotes.drains.trim()) throw new Error(`${where}: published with an empty serviceNotes.drains`);
  // Three, matching tests/town-content.spec.ts. It was five, but a small single-district town
  // (Chatteris PE16, St Ives PE27) has only a handful of verifiable named places, and a short
  // honest list beats one padded with map labels nobody lives in.
  if (city.nearbyAreas.length < 3) {
    throw new Error(`${where}: published with ${city.nearbyAreas.length} nearby areas, three is the floor`);
  }
  if (city.sources.length < 1) throw new Error(`${where}: published with no source to verify it against`);
}

const SLUGS = new Set(Object.keys(TOWN_LEAVES));

for (const [key, city] of Object.entries(TOWN_LEAVES)) {
  if (city.slug !== key) {
    throw new Error(`lib/towns.ts: leaf content/towns/${key}.ts declares slug "${city.slug}"`);
  }
  assertTown(city, SLUGS);
}

if (TOWNS.length !== 31) {
  throw new Error(`lib/towns.ts: expected 31 towns, found ${TOWNS.length}`);
}
if (TIER1.length !== 28) {
  throw new Error(`lib/towns.ts: expected 28 Tier 1 towns, found ${TIER1.length}`);
}

// ---------------------------------------------------------------------------
// Groupings and the generated coverage label
// ---------------------------------------------------------------------------

/** Published Tier 1 towns only: an organic page is never offered as coverage. */
export const TOWNS_BY_COUNTY: Readonly<Record<County, City[]>> = COUNTY_ORDER.reduce(
  (acc, county) => {
    acc[county] = TIER1.filter((town) => town.published && town.county === county);
    return acc;
  },
  {} as Record<County, City[]>,
);

/**
 * Schema areaServed. Published Tier 1 town names plus the seven counties, and the organic towns
 * are excluded on purpose: the account excludes their districts.
 */
export const AREA_SERVED: readonly string[] = [
  ...TIER1.filter((town) => town.published).map((town) => town.name),
  ...COUNTY_ORDER,
];

/** Essex is reached at its northern end only, and the label has to say so. */
const COUNTY_LABEL: Readonly<Record<County, string>> = {
  Cambridgeshire: "Cambridgeshire",
  Suffolk: "Suffolk",
  Norfolk: "Norfolk",
  Essex: "north Essex",
  Hertfordshire: "Hertfordshire",
  Bedfordshire: "Bedfordshire",
  Lincolnshire: "Lincolnshire",
};

function joinWithAnd(items: readonly string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

const TIER1_COUNTIES = COUNTY_ORDER.filter((county) => TIER1.some((town) => town.county === county));

/**
 * Built from the counties the Tier 1 towns actually sit in, not typed out, so a town added in
 * an eighth county changes the sitewide line instead of contradicting it. The first four are
 * the body of the footprint; the rest are reached in part.
 */
export const COVERAGE_LINE_GENERATED = `${joinWithAnd(
  TIER1_COUNTIES.slice(0, 4).map((county) => COUNTY_LABEL[county]),
)}, plus parts of ${joinWithAnd(TIER1_COUNTIES.slice(4).map((county) => COUNTY_LABEL[county]))}.`;

if (COVERAGE_LINE_GENERATED !== COVERAGE_LINE) {
  throw new Error(
    `lib/towns.ts: the generated coverage label and lib/claims.ts disagree.\n  generated: ${COVERAGE_LINE_GENERATED}\n  claims:    ${COVERAGE_LINE}`,
  );
}

// ---------------------------------------------------------------------------
// The postcode checker's town lookup
// ---------------------------------------------------------------------------

/**
 * Two districts are shared by two towns each: CB7 by Ely and Soham, IP28 by Bury St Edmunds and
 * Mildenhall. The tie is broken by barrel order, which is the order the towns are listed in the
 * build brief, so the answer is stable rather than merely correct on the day.
 */
function lookupTown(district: string): TownRef | null {
  const match = TIER1.find((town) => town.published && town.postcodeDistricts.includes(district));
  return match ? { slug: match.slug, name: match.name } : null;
}

registerTownLookup(lookupTown);

/** Re-exported so anything importing the towns gets the town-aware checker for free. */
export { checkPostcode, extractDistrict, isCoveredDistrict } from "./coverage";
export type { PostcodeCheck, TownRef } from "./coverage";
