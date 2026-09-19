import { test, expect } from "@playwright/test";
import { SITEMAP_PATHS } from "../lib/routes";
import { allRoutes, blockThirdParties, collectPageErrors, gotoOk } from "./utils";

// The drift guard first. The sitemap is generated from the same barrels this suite reads, so
// this test is not asserting that two lists agree by luck — it is asserting that the generator
// exists and reads the barrel rather than a hand-kept list of its own. That is the failure it
// is here to catch: a route added to lib/routes.ts that never appears in /sitemap.xml.
test("the generated sitemap lists exactly the routes the data barrels publish", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status(), "/sitemap.xml must be served").toBe(200);

  const xml = await response.text();
  const served = new Set(
    [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1].trim()).pathname.replace(/\/+$/, "") || "/"),
  );
  const expected = new Set(SITEMAP_PATHS());

  const missing = [...expected].filter((p) => !served.has(p));
  const extra = [...served].filter((p) => !expected.has(p));

  expect(missing, `published routes absent from the sitemap: ${missing.join(", ")}`).toEqual([]);
  expect(extra, `sitemap entries that are not published routes: ${extra.join(", ")}`).toEqual([]);
});

for (const route of allRoutes) {
  test(`loads cleanly, with landmarks, one h1 and alt text on every image — ${route}`, async ({ page }) => {
    const errors = collectPageErrors(page);
    await blockThirdParties(page);
    await gotoOk(page, route);
    await page.waitForLoadState("networkidle");

    await expect(page.locator("h1"), `exactly one h1 on ${route}`).toHaveCount(1);
    await expect(page.locator("header"), `one header landmark on ${route}`).toHaveCount(1);
    await expect(page.locator("main"), `one main landmark on ${route}`).toHaveCount(1);
    await expect(page.locator("footer"), `one footer landmark on ${route}`).toHaveCount(1);

    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt, `img #${i} on ${route} has no alt attribute`).not.toBeNull();
      if (alt === "") {
        // An empty alt is right in exactly one place: a decorative mark inside a link or button
        // that already has its own name (the logo). Anywhere else it hides a real picture.
        const named = await images.nth(i).evaluate((el) => el.closest("a[aria-label], button[aria-label]") !== null);
        expect(named, `img #${i} on ${route} has an empty alt outside a labelled link`).toBe(true);
      }
    }

    expect(errors, `console or page errors on ${route}:\n${errors.join("\n")}`).toEqual([]);
  });
}
