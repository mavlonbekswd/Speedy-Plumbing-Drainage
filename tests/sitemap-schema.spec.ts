import { test, expect } from "@playwright/test";
import { STATIC_ROUTE_BY_PATH } from "../lib/routes";
import { REGISTERED_LOCALITY, REGISTERED_POSTCODE, REGISTERED_STREET } from "../lib/site";
import { fetchHtml, jsonLdBlocks, jsonLdObjects, robotsOf, visibleText } from "./html";

test("every sitemap entry declares a real lastmod", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);
  expect(entries.length, "no <url> entries in the sitemap").toBeGreaterThan(0);

  for (const entry of entries) {
    const loc = entry.match(/<loc>([^<]+)<\/loc>/)?.[1];
    expect(entry, `no <lastmod> for ${loc}`).toMatch(/<lastmod>/);
    const lastmod = entry.match(/<lastmod>([^<]+)<\/lastmod>/)![1];
    expect(lastmod, `unparseable lastmod for ${loc}`).toMatch(/^\d{4}-\d{2}-\d{2}/);
    expect(Number.isNaN(Date.parse(lastmod)), `lastmod for ${loc} is not a real date`).toBe(false);
  }
});

test("/privacy is absent from the sitemap", async ({ request }) => {
  // lib/routes.ts holds it out with inSitemap: false whatever its published flag says. A legal
  // notice competing for a query is a page working against the pages that matter.
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml, "/privacy is in the sitemap").not.toMatch(/<loc>[^<]*\/privacy\b/);
});

// Only meaningful once the page exists; until then it 404s and there is no meta to read.
if (STATIC_ROUTE_BY_PATH["/privacy"].published) {
  test("/privacy carries noindex", async ({ request }) => {
    const robots = robotsOf(await fetchHtml(request, "/privacy"));
    expect(robots, "no robots meta on /privacy").toBeTruthy();
    expect(robots!.toLowerCase(), "/privacy is indexable").toContain("noindex");
  });
}

test("the schema PostalAddress is complete and agrees with the footer disclosure", async ({ request }) => {
  // Two statements of the registered office on one page. If they disagree, one of them is wrong
  // and a reader cannot tell which — and the footer one is the one with legal weight.
  const html = await fetchHtml(request, "/");
  const address = jsonLdObjects(jsonLdBlocks(html)).find(
    (node) => String(node["@type"] ?? "") === "PostalAddress",
  );
  expect(address, "no PostalAddress anywhere in the home page schema").toBeTruthy();

  expect(address!.streetAddress, "schema streetAddress").toBe(REGISTERED_STREET);
  expect(address!.addressLocality, "schema addressLocality").toBe(REGISTERED_LOCALITY);
  expect(address!.postalCode, "schema postalCode").toBe(REGISTERED_POSTCODE);

  const body = visibleText(html);
  expect(body, "the footer does not carry the registered street").toContain(REGISTERED_STREET);
  expect(body, "the footer does not carry the registered postcode").toContain(REGISTERED_POSTCODE);
});
