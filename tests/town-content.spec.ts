import { test, expect } from "@playwright/test";
import { PUBLISHED_TOWNS, TOWNS, townHref } from "../lib/towns";
import { alphanumericTypes, fetchAll, sentences, visibleText, wordTypes } from "./html";

// The anti-doorway measure.
//
// A doorway page is a page that is another page with the name swapped. The honest instrument
// for that is: mask the variable, then count what is left. So every town name and every
// postcode district is masked before a single word is counted, and what survives the mask is
// the town's own content — its villages, its roads, its river, the thing a local recognises.
//
// THE MASK IS WORD-BOUNDED ON PURPOSE. Ely, Diss, March, Watton, Brandon, Bedford and Stamford
// are all ordinary English words or fragments of them before they are towns. An unbounded
// replace turns "marching" into "TOWNing" and "merely" into "mErely", which corrupts every
// count downstream and does it silently. Apostrophes are matched in both spellings because
// "Bishop's Stortford" and "King's Lynn" render as U+2019 or as &#x27; depending on the author.
//
// Uniqueness is measured PAIRWISE — against the single closest sibling, not against the union
// of the other thirty. That number is independent of how many towns exist. A union measure
// falls as the town count rises for a reason that has nothing to do with thinness: with thirty
// other pages, an ordinary word two towns happen to share stops counting for either.

test.describe.configure({ timeout: 120_000 });

const MIN_UNIQUE_TYPES = 20;
const MIN_UNIQUE_WORDS = 15;
const MIN_UNIQUE_SENTENCES = 2;
const MIN_NEARBY_AREAS_NAMED = 3;

const ROUTES = PUBLISHED_TOWNS.map((town) => townHref(town.slug));

function escapeRegExp(literal: string): string {
  return literal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Every town name and every postcode district on the site, longest first so CB10 beats CB1. */
const MASKED_TERMS = [
  ...TOWNS.map((town) => town.name),
  ...TOWNS.flatMap((town) => town.postcodeDistricts),
]
  .sort((a, b) => b.length - a.length)
  .map((term) => escapeRegExp(term).replace(/'/g, "['’]"));

const MASK = new RegExp(`\\b(?:${MASKED_TERMS.join("|")})\\b`, "gi");

const maskPlaces = (text: string) => text.replace(MASK, "TOWN");

let pages: Map<string, string>;
let masked: Map<string, string>;

test.beforeAll(async ({ playwright, baseURL }) => {
  test.setTimeout(120_000);
  const request = await playwright.request.newContext({ baseURL });
  pages = await fetchAll(request, ROUTES);
  await request.dispose();
  masked = new Map([...pages].map(([route, html]) => [route, maskPlaces(visibleText(html))]));
});

/** The count against the CLOSEST sibling: the smallest "types mine has that theirs lacks". */
function uniqueAgainstClosest(route: string, tokenise: (t: string) => Set<string>): string[] {
  const mine = tokenise(masked.get(route)!);
  let worst: string[] | undefined;
  for (const other of ROUTES) {
    if (other === route) continue;
    const theirs = tokenise(masked.get(other)!);
    const unique = [...mine].filter((word) => !theirs.has(word)).sort();
    if (!worst || unique.length < worst.length) worst = unique;
  }
  return worst ?? [...mine].sort();
}

// Grouped per town rather than run as one loop inside a single test: with up to 31 pages, one
// slow page timing out inside a shared test hides the result for every page after it.
for (const town of PUBLISHED_TOWNS) {
  const route = townHref(town.slug);

  test.describe(`${route}`, () => {
    test(`carries content of its own, not a name swap — ${route}`, () => {
      const types = uniqueAgainstClosest(route, alphanumericTypes);
      expect(
        types.length,
        `${route} has only ${types.length} alphanumeric types its closest sibling lacks: ${types.join(", ")}`,
      ).toBeGreaterThanOrEqual(MIN_UNIQUE_TYPES);

      const words = uniqueAgainstClosest(route, wordTypes);
      expect(
        words.length,
        `${route} has only ${words.length} letters-only word types its closest sibling lacks: ${words.join(", ")}`,
      ).toBeGreaterThanOrEqual(MIN_UNIQUE_WORDS);
    });

    test(`carries sentences that exist on no other town page — ${route}`, () => {
      const mine = sentences(masked.get(route)!);
      const elsewhere = new Set<string>();
      for (const other of ROUTES) {
        if (other === route) continue;
        for (const sentence of sentences(masked.get(other)!)) elsewhere.add(sentence);
      }
      const onlyHere = mine.filter((sentence) => !elsewhere.has(sentence));
      expect(
        onlyHere.length,
        `${route} carries ${onlyHere.length} sentences of its own. The template is not content: ` +
          `a town URL with nothing but the shared copy is a doorway page whatever its H1 says.`,
      ).toBeGreaterThanOrEqual(MIN_UNIQUE_SENTENCES);
    });

    test(`names its postcode districts and the areas around it — ${route}`, () => {
      // Measured on the UNMASKED text, obviously: this is the one assertion about the names.
      const body = visibleText(pages.get(route)!);

      for (const district of town.postcodeDistricts) {
        expect(body, `${route} never names postcode district ${district}`).toContain(district);
      }

      const named = town.nearbyAreas.filter((area) => body.includes(area));
      expect(
        named.length,
        `${route} names only ${named.length} of the ${town.nearbyAreas.length} areas around ${town.name}`,
      ).toBeGreaterThanOrEqual(MIN_NEARBY_AREAS_NAMED);
    });
  });
}
