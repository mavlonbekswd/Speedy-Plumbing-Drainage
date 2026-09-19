// Hero personalisation from Vercel's detected city, read in middleware on the home page only.
//
// Two rules make this list shorter than it looks. A visitor is only ever named a town that has
// a real page, so the lookup returns a published Tier 1 town or nothing. And the organic towns
// are deliberately absent: King's Lynn, Peterborough and Bedford sit on districts the ad
// account excludes, so a visitor there must not be greeted as though we work in their street.
// An unmatched visitor gets the honest default copy, which is the point of returning null.
//
// Only the towns themselves are listed, with their spelling variants. Villages are not: naming
// one is a coverage claim about a place, and a claim about a place needs a source exactly as a
// claim about the business does.

import type { City } from "./types";
import { TOWN_BY_SLUG } from "./towns";

/** Detected city name, normalised, to the slug of its page. */
const GEO_TOWN_SLUGS: Readonly<Record<string, string>> = {
  cambridge: "cambridge",
  ely: "ely",
  huntingdon: "huntingdon",
  "st neots": "st-neots",
  "saint neots": "st-neots",
  wisbech: "wisbech",
  march: "march",
  chatteris: "chatteris",
  "st ives": "st-ives",
  "saint ives": "st-ives",
  soham: "soham",
  newmarket: "newmarket",
  "new market": "newmarket",
  haverhill: "haverhill",
  "bury st edmunds": "bury-st-edmunds",
  "bury saint edmunds": "bury-st-edmunds",
  mildenhall: "mildenhall",
  brandon: "brandon",
  stowmarket: "stowmarket",
  sudbury: "sudbury",
  thetford: "thetford",
  diss: "diss",
  attleborough: "attleborough",
  watton: "watton",
  "downham market": "downham-market",
  swaffham: "swaffham",
  "saffron walden": "saffron-walden",
  braintree: "braintree",
  royston: "royston",
  "bishops stortford": "bishops-stortford",
  "bishop stortford": "bishops-stortford",
  biggleswade: "biggleswade",
  stamford: "stamford",
};

/** Lowercase, no punctuation, single spaces, so "Bishop's Stortford" and "BISHOPS  STORTFORD" meet. */
function normaliseCity(raw: string): string {
  let value = raw;
  try {
    value = decodeURIComponent(raw);
  } catch {
    value = raw;
  }
  return value
    .toLowerCase()
    .replace(/[^a-z\s-]/g, "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * The town to name in the hero, or null. Never an organic town, and never a town whose page is
 * not published: the greeting and the link it carries have to point at something real.
 */
export function matchGeoTown(rawCity: string | undefined | null): City | null {
  if (!rawCity || typeof rawCity !== "string") return null;
  const slug = GEO_TOWN_SLUGS[normaliseCity(rawCity)];
  if (!slug) return null;
  const town = TOWN_BY_SLUG[slug];
  if (!town || !town.published || town.tier !== 1) return null;
  return town;
}

for (const slug of Object.values(GEO_TOWN_SLUGS)) {
  const town = TOWN_BY_SLUG[slug];
  if (!town) throw new Error(`lib/geoTowns.ts: no town leaf for "${slug}"`);
  if (town.tier !== 1) throw new Error(`lib/geoTowns.ts: "${slug}" is organic and must not be named in the hero`);
}
