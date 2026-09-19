import { test, expect } from "@playwright/test";
import { TOWN_BY_SLUG } from "../lib/towns";

// Two different behaviours, and the difference is the point.
//
// An unknown TOP-LEVEL path is a mistyped or stale URL — a Final URL that has changed, a link
// in someone's email — and it goes to Emergency Plumbing rather than dead-ending, server-side,
// with the query string kept so a stale gclid still attributes.
//
// An unknown path UNDER a known dynamic segment is a different animal. /areas/not-a-town is a
// town that does not exist; answering it with a 200, or redirecting it, tells Google the site
// has infinite pages. It must be a real 404: status 404, no Location header, not a 200.

test.describe("an unknown top-level path", () => {
  test("307s server-side to /services/emergency-plumbing", async ({ request }) => {
    // Via `request`, not `page`, and with maxRedirects 0: a crawler and a visitor with no
    // JavaScript must see the Location header. A client-side hop after hydration is not this.
    const response = await request.get("/this-route-does-not-exist", { maxRedirects: 0 });
    expect(response.status(), "not a server-side redirect").toBe(307);
    expect(new URL(response.headers()["location"], "http://x").pathname).toBe("/services/emergency-plumbing");
  });

  test("keeps the query string, so a stale gclid still attributes", async ({ request }) => {
    const response = await request.get("/mistyped-final-url?gclid=abc123&utm_source=google", {
      maxRedirects: 0,
    });
    expect(response.status()).toBe(307);
    const location = new URL(response.headers()["location"], "http://x");
    expect(location.pathname).toBe("/services/emergency-plumbing");
    expect(location.searchParams.get("gclid")).toBe("abc123");
    expect(location.searchParams.get("utm_source")).toBe("google");
  });
});

for (const path of ["/areas/not-a-town", "/services/not-a-service"]) {
  test(`${path} is a real 404, not a redirect and not a 200`, async ({ request }) => {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), `${path} should be 404`).toBe(404);
    expect(response.headers()["location"], `${path} carries a Location header`).toBeUndefined();
  });
}

test("a genuinely missing file still 404s rather than being answered with a service page", async ({ request }) => {
  const response = await request.get("/definitely-missing-file.txt", { maxRedirects: 0 });
  expect(response.status()).toBe(404);
});

// skipTrailingSlashRedirect is on (next.config.ts, required by the PostHog proxy), so a trailing
// slash must be served rather than bounced. Only assertable once the page exists.
if (TOWN_BY_SLUG["cambridge"].published) {
  test("/areas/cambridge/ with a trailing slash does not redirect", async ({ request }) => {
    const response = await request.get("/areas/cambridge/", { maxRedirects: 0 });
    expect(response.status(), "the trailing slash was redirected away").toBe(200);
    expect(response.headers()["location"]).toBeUndefined();
  });
}
