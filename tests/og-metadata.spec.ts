import { test, expect } from "@playwright/test";
import { allRoutes } from "./utils";
import { canonicalOf, fetchAll, meta } from "./html";

test.describe.configure({ timeout: 120_000 });

// A page-level `openGraph` object REPLACES the root one rather than merging with it, which is
// the defect this file exists for: on the BeBest build og:image was present on 5 of 28 pages,
// missing from every page an ad could land on, because each of those files set its own
// openGraph with no `images` key — and the same pages silently dropped from
// summary_large_image to summary, so a share of a money page rendered as a bare text link.
//
// og:url is the other half: absent, a shared link can be attributed to the wrong URL.

let pages: Map<string, string>;

test.beforeAll(async ({ playwright, baseURL }) => {
  test.setTimeout(120_000);
  const request = await playwright.request.newContext({ baseURL });
  pages = await fetchAll(request, allRoutes);
  await request.dispose();
});

for (const route of allRoutes) {
  test(`open graph and twitter card — ${route}`, () => {
    const html = pages.get(route)!;

    const ogTitle = meta(html, "og:title");
    expect(ogTitle, `og:title missing on ${route}`).toBeTruthy();
    expect(ogTitle!.trim().length, `og:title is empty on ${route}`).toBeGreaterThan(0);

    const ogDescription = meta(html, "og:description");
    expect(ogDescription, `og:description missing on ${route}`).toBeTruthy();
    expect(ogDescription!.trim().length, `og:description is empty on ${route}`).toBeGreaterThan(0);

    // Self-referencing, and compared against the page's own canonical rather than a hardcoded
    // host: NEXT_PUBLIC_SITE_URL is the Playwright server here and the www host in production.
    const ogUrl = meta(html, "og:url");
    const canonical = canonicalOf(html);
    expect(ogUrl, `og:url missing on ${route}`).toBeTruthy();
    expect(ogUrl!, `og:url on ${route} is not absolute`).toMatch(/^https?:\/\//);
    expect(canonical, `canonical missing on ${route}`).toBeTruthy();
    expect(ogUrl!.replace(/\/+$/, ""), `og:url does not match the canonical on ${route}`).toBe(
      canonical!.replace(/\/+$/, ""),
    );

    const ogImage = meta(html, "og:image");
    expect(ogImage, `og:image missing on ${route}`).toBeTruthy();
    expect(ogImage!, `og:image on ${route} is not an absolute URL`).toMatch(/^https?:\/\//);

    expect(meta(html, "twitter:card"), `twitter:card on ${route}`).toBe("summary_large_image");
  });
}

test("the og:image URL actually serves an image", async ({ request }) => {
  const image = meta(pages.get("/")!, "og:image")!;
  const response = await request.get(new URL(image).pathname);
  expect(response.status(), `${image} did not serve`).toBe(200);
  expect(response.headers()["content-type"], `${image} is not an image`).toContain("image/");
});
