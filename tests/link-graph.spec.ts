import { test, expect } from "@playwright/test";
import { TIER1, TOWN_BY_SLUG, townHref } from "../lib/towns";
import { allRoutes, serviceRoutes, sitemapRoutes, townRoutes } from "./utils";
import { fetchAll, inboundLinkCounts, internalHrefs, stripScripts } from "./html";

test.describe.configure({ timeout: 120_000 });

// The whole file measures the link graph from SERVED MARKUP WITH SCRIPTS STRIPPED. That is the
// load-bearing decision, not a detail: a Next.js App Router document repeats every href inside
// its inlined RSC flight payload, so a naive grep reports a page as linked when nothing on the
// page links to it. The BeBest audit found /crawley orphaned by stripping first, and this file
// reproduces the instrument rather than reading the source.

let pages: Map<string, string>;

test.beforeAll(async ({ playwright, baseURL }) => {
  test.setTimeout(120_000);
  const request = await playwright.request.newContext({ baseURL });
  pages = await fetchAll(request, allRoutes);
  await request.dispose();
});

test("no published page is an orphan", () => {
  // The home page is excluded by definition: it is the root of the crawl, not a page that needs
  // discovering. Every other published page must be reachable by following a rendered anchor.
  const counts = inboundLinkCounts(pages);
  const orphans = [...counts.entries()]
    .filter(([route, n]) => route !== "/" && n === 0)
    .map(([route]) => route);
  expect(orphans, `orphaned routes, zero inbound internal links: ${orphans.join(", ")}`).toEqual([]);
});

test("every sitemap page is within two clicks of the home page", () => {
  const linksFrom = (route: string) => new Set(internalHrefs(pages.get(route) ?? ""));

  const oneClick = linksFrom("/");
  const twoClicks = new Set(oneClick);
  for (const route of oneClick) for (const next of linksFrom(route)) twoClicks.add(next);

  const unreachable = sitemapRoutes.filter((route) => route !== "/" && !twoClicks.has(route));
  expect(unreachable, `more than two clicks from home: ${unreachable.join(", ")}`).toEqual([]);
});

test("no internal link points at a redirect or a 404", async ({ playwright, baseURL }) => {
  test.setTimeout(120_000);
  const targets = new Set<string>();
  for (const html of pages.values()) for (const href of internalHrefs(html)) targets.add(href);

  const request = await playwright.request.newContext({ baseURL });
  const broken: string[] = [];
  try {
    for (const target of [...targets].sort()) {
      const response = await request.get(target, { maxRedirects: 0 });
      if (response.status() !== 200) broken.push(`${target} -> ${response.status()}`);
    }
  } finally {
    await request.dispose();
  }
  // A link to a redirect hands a crawler and a visitor an avoidable hop; a link to a 404 hands
  // them nothing at all. Both are the site's own fault, and both are cheap to not do.
  expect(broken, `internal links that do not answer 200 directly: ${broken.join(", ")}`).toEqual([]);
});

const PUBLISHED_TIER1 = TIER1.filter((town) => town.published);

for (const route of serviceRoutes) {
  test(`links every published tier-1 town — ${route}`, () => {
    const hrefs = new Set(internalHrefs(pages.get(route)!));
    const missing = PUBLISHED_TIER1.filter((town) => !hrefs.has(townHref(town.slug))).map((t) => t.name);
    expect(missing, `${route} does not link to: ${missing.join(", ")}`).toEqual([]);
  });
}

for (const route of townRoutes) {
  test(`links its published neighbours — ${route}`, () => {
    const slug = route.slice("/areas/".length);
    const nearby = (TOWN_BY_SLUG[slug].nearbyTowns ?? []).filter((s) => TOWN_BY_SLUG[s]?.published);
    if (nearby.length === 0) {
      // Nothing to assert yet: none of this town's neighbours has published. Still a real pass,
      // because the rule is "link the ones that exist", not "have neighbours".
      return;
    }
    const hrefs = new Set(internalHrefs(pages.get(route)!));
    const missing = nearby.filter((s) => !hrefs.has(townHref(s)));
    expect(missing, `${route} does not link its published neighbours: ${missing.join(", ")}`).toEqual([]);
  });
}

test("the crawl path is in the rendered markup, not only in the flight payload", () => {
  // Belt and braces on the instrument itself. If this ever passes only because the RSC payload
  // mentions a link, the stripping in tests/html.ts has stopped working and every assertion
  // above it is worthless.
  const rendered = stripScripts(pages.get("/")!);
  expect(rendered, "the home page renders no internal anchor at all").toMatch(/<a\b[^>]*href="\//);
});
