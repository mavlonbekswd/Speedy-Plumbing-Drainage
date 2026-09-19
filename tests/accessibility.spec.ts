import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { STATIC_ROUTE_BY_PATH } from "../lib/routes";
import { blockThirdParties, gotoOk, serviceRoutes, staticRoutes, townRoutes } from "./utils";

// One sample of each TEMPLATE, not of each page: the templates are what a violation lives in,
// and scanning 40 instances of the same component 40 times buys nothing but minutes.
//
// Every sample is chosen from the published lists, so a template that has not been built yet
// contributes no scan instead of a red one. The 404 is scanned unconditionally, because it is
// the one page nobody remembers to look at and the one page a broken link sends people to.

const OTHER_STATIC = staticRoutes.find((path) => path !== "/");

const SAMPLES: { label: string; path: string }[] = [
  { label: "home", path: "/" },
  ...(serviceRoutes.length > 0 ? [{ label: `service template (${serviceRoutes[0]})`, path: serviceRoutes[0] }] : []),
  ...(townRoutes.length > 0 ? [{ label: `town template (${townRoutes[0]})`, path: townRoutes[0] }] : []),
  ...(OTHER_STATIC ? [{ label: `static template (${OTHER_STATIC})`, path: OTHER_STATIC }] : []),
  // /contact carries the one full form outside a service page, so it gets its own scan.
  ...(STATIC_ROUTE_BY_PATH["/contact"]?.published ? [{ label: "contact form", path: "/contact" }] : []),
];

async function scan(page: import("@playwright/test").Page, label: string, path: string) {
  await page.waitForLoadState("networkidle");

  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  const blocking = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");

  if (blocking.length > 0) {
    const detail = blocking
      .map(
        (v) =>
          `- [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))\n` +
          v.nodes.map((n) => `    ${n.target.join(" ")} — ${n.failureSummary}`).join("\n"),
      )
      .join("\n");
    throw new Error(`${label} (${path}) has ${blocking.length} serious/critical axe violation(s):\n${detail}`);
  }

  expect(blocking).toEqual([]);
}

for (const { label, path } of SAMPLES) {
  test(`axe wcag2a/wcag2aa: zero serious or critical violations — ${label}`, async ({ page }) => {
    // Audit the settled page. A card caught in the first frame of its scroll fade measures as
    // text-on-same-colour (contrast 1.01), which says nothing about the design. With reduced
    // motion the reveal component renders static, so axe sees what a reader ends up seeing.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await blockThirdParties(page);
    await gotoOk(page, path);
    await scan(page, label, path);
  });
}

test("axe wcag2a/wcag2aa: zero serious or critical violations — 404", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await blockThirdParties(page);
  const response = await page.goto("/areas/not-a-town");
  expect(response, "no response for the 404 sample").not.toBeNull();
  expect(response!.status(), "the 404 sample must actually be a 404").toBe(404);
  await scan(page, "404", "/areas/not-a-town");
});
