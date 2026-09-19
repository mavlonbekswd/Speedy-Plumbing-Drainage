import { test, expect } from "@playwright/test";
import { REGISTERED_NAME, TRADING_NAME } from "../lib/site";
import { COUNTY_ORDER, PUBLISHED_TOWNS, TOWNS } from "../lib/towns";
import { allRoutes, townForRoute } from "./utils";
import { canonicalOf, fetchAll, jsonLdBlocks, jsonLdObjects, titleOf } from "./html";

test.describe.configure({ timeout: 120_000 });

// A title under 20 characters is not a title. The cap is 75, not the usual 65: the owner-approved
// emergency title in SITE-BUILD-PROMPT 6.2 is 72 characters and is an ad-matched string.
const TITLE_MIN = 20;
const TITLE_MAX = 75;

let pages: Map<string, string>;

test.beforeAll(async ({ playwright, baseURL }) => {
  test.setTimeout(120_000);
  const request = await playwright.request.newContext({ baseURL });
  pages = await fetchAll(request, allRoutes);
  await request.dispose();
});

for (const route of allRoutes) {
  test(`title, canonical and JSON-LD — ${route}`, ({ baseURL }) => {
    const html = pages.get(route)!;

    const title = titleOf(html);
    expect(title, `no <title> on ${route}`).toBeTruthy();
    expect(
      title!.length,
      `title on ${route} is ${title!.length} characters, outside ${TITLE_MIN}-${TITLE_MAX}: "${title}"`,
    ).toBeGreaterThanOrEqual(TITLE_MIN);
    expect(
      title!.length,
      `title on ${route} is ${title!.length} characters, outside ${TITLE_MIN}-${TITLE_MAX}: "${title}"`,
    ).toBeLessThanOrEqual(TITLE_MAX);

    // A town page whose title does not carry its town is a national page with a town URL.
    const town = townForRoute(route);
    if (town) {
      expect(title!, `title on ${route} never names ${town.name}`).toContain(town.name);
    }

    // Exactly one canonical, and it points at this page's own absolute URL. Compared against
    // the baseURL fixture, not against lib/site.ts: SITE_URL is frozen in the runner process,
    // where the server's env never applied.
    const canonicals = [...html.matchAll(/<link[^>]*rel=["']canonical["'][^>]*>/gi)];
    expect(canonicals.length, `expected exactly one canonical on ${route}`).toBe(1);
    const canonical = canonicalOf(html)!;
    const expected = `${baseURL!.replace(/\/+$/, "")}${route === "/" ? "" : route}`;
    expect(canonical.replace(/\/+$/, "") || canonical, `canonical on ${route}`).toBe(
      expected.replace(/\/+$/, "") || expected,
    );

    // Every JSON-LD block parses. `jsonLdBlocks` throws with the block index if one does not.
    const blocks = jsonLdBlocks(html);
    expect(blocks.length, `no JSON-LD at all on ${route}`).toBeGreaterThan(0);
  });
}

test("every title on the site is distinct", () => {
  const seen = new Map<string, string[]>();
  for (const route of allRoutes) {
    const title = titleOf(pages.get(route)!) ?? "";
    seen.set(title, [...(seen.get(title) ?? []), route]);
  }
  const duplicated = [...seen.entries()].filter(([, routes]) => routes.length > 1);
  expect(
    duplicated.map(([title, routes]) => `"${title}" on ${routes.join(", ")}`),
    "two pages share a title, so one of them is competing with the other",
  ).toEqual([]);
});

test("the business schema names the registered company, and it is not the trading name", () => {
  const business = jsonLdObjects(jsonLdBlocks(pages.get("/")!)).find(
    (node) => typeof node.legalName === "string" || String(node["@type"] ?? "").includes("Plumber"),
  );
  expect(business, "no Plumber / LocalBusiness block on the home page").toBeTruthy();

  // legalName means the OFFICIAL registered name. The trading name carries no "Ltd" precisely
  // because it is not a registered company name, so the two must differ.
  expect(business!.legalName, "schema legalName").toBe(REGISTERED_NAME);
  expect(business!.name, "schema name").toBe(TRADING_NAME);
  expect(business!.legalName).not.toBe(business!.name);
});

test("no page anywhere carries an aggregateRating, a review or a priceRange", () => {
  // HAS_REVIEWS is false: four reviews is below the floor, so there is no rating to publish and
  // no rating may be implied. priceRange is the same failure in the other direction — there is
  // no fee and none may be stated, present or absent.
  const offenders: string[] = [];
  for (const route of allRoutes) {
    for (const node of jsonLdObjects(jsonLdBlocks(pages.get(route)!))) {
      for (const key of ["aggregateRating", "review", "reviews", "priceRange", "ratingValue", "reviewCount"]) {
        if (key in node) offenders.push(`${route}: ${key}`);
      }
    }
  }
  expect(offenders, `rating or price keys in JSON-LD: ${offenders.join(", ")}`).toEqual([]);
});

test("every areaServed entry has a published page, and no organic town is offered as coverage", () => {
  const counties = new Set<string>(COUNTY_ORDER);
  const publishedNames = new Set(PUBLISHED_TOWNS.map((town) => town.name));
  const organicNames = TOWNS.filter((town) => town.tier === "organic").map((town) => town.name);

  const business = jsonLdObjects(jsonLdBlocks(pages.get("/")!)).find((node) => "areaServed" in node);
  expect(business, "no areaServed anywhere in the home page schema").toBeTruthy();

  const raw = business!.areaServed;
  const areas = (Array.isArray(raw) ? raw : [raw]).map((entry) =>
    typeof entry === "string" ? entry : String((entry as Record<string, unknown>)?.name ?? ""),
  );
  expect(areas.length, "areaServed is empty").toBeGreaterThan(0);

  for (const area of areas) {
    if (counties.has(area)) continue;
    expect(
      publishedNames.has(area),
      `areaServed claims ${area}, which has no published page`,
    ).toBe(true);
  }

  // The three organic towns exist for search only: the ad account EXCLUDES their districts, so
  // naming them as coverage would put the site and the account in contradiction.
  for (const name of organicNames) {
    expect(areas, `areaServed names the organic town ${name}`).not.toContain(name);
  }
});
