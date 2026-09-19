import { expect, type Page, type Response } from "@playwright/test";
import { BASE_URL } from "../playwright.config";
import { ALL_PUBLISHED_PATHS, PUBLISHED_STATIC_ROUTES, SITEMAP_PATHS, STATIC_ROUTES } from "../lib/routes";
import { PUBLISHED_SERVICES, SERVICES, serviceHref } from "../lib/services";
import { PUBLISHED_TOWNS, TIER1, TOWNS, townHref } from "../lib/towns";

// ---------------------------------------------------------------------------
// Route lists
//
// Read from the data barrels, never hand-kept. Pages publish progressively: each content leaf
// and each static route carries its own `published` flag, and today almost nothing is on. So
// EVERY per-route loop in this suite iterates the PUBLISHED lists below. A page that has not
// been built yet contributes no test rather than a red one, and the day its flag flips it
// contributes its full set of tests without a line of this directory changing.
//
// The one deliberate exception is tests/launch-gate.spec.ts, which asserts the flags themselves.
// ---------------------------------------------------------------------------

/** Published static routes, home first. */
export const staticRoutes: readonly string[] = PUBLISHED_STATIC_ROUTES.map((route) => route.path);

/** Published service pages, `/services/<slug>`. */
export const serviceRoutes: readonly string[] = PUBLISHED_SERVICES.map((service) => serviceHref(service.slug));

/** Published town pages, `/areas/<slug>`. */
export const townRoutes: readonly string[] = PUBLISHED_TOWNS.map((town) => townHref(town.slug));

/** Published blog posts, `/blog/<slug>`. Derived, so this file need not import the blog barrel. */
export const blogRoutes: readonly string[] = ALL_PUBLISHED_PATHS().filter((path) => path.startsWith("/blog/"));

/** Every path the site serves today. */
export const allRoutes: readonly string[] = ALL_PUBLISHED_PATHS();

/** The paths the generated sitemap is expected to carry: published, minus the held-out pages. */
export const sitemapRoutes: readonly string[] = SITEMAP_PATHS();

/** Every service and town page that is live, which is the set section 10 puts its nine lines on. */
export const serviceAndTownRoutes: readonly string[] = [...serviceRoutes, ...townRoutes];

// Re-exported so a spec needs one import for "the routes" and "the data behind them".
export { SERVICES, TOWNS, TIER1, STATIC_ROUTES, serviceHref, townHref };

// ---------------------------------------------------------------------------
// Test constants
//
// ⚠ Read these, do not import lib/site.ts for them. lib/site.ts freezes CALL_NUMBER, SITE_URL
// and everything derived from them at import time, and in the Playwright RUNNER process the
// webServer env does not apply: the runner would read a developer's .env.local or the real
// defaults, while the server under test rendered the fakes below. Assert against these, and
// against the `baseURL` fixture, never against lib/site.ts's derived values.
// ---------------------------------------------------------------------------

/** The value playwright.config.ts pins as NEXT_PUBLIC_CALL_NUMBER. */
export const TEST_CALL_NUMBER = "01223000000";

/** What the site actually renders: E.164, never the 0-leading national form. */
export const TEST_CALL_NUMBER_E164 = "+441223000000";
export const TEST_CALL_HREF = `tel:${TEST_CALL_NUMBER_E164}`;

/** How the number is shown to a reader: 5 digits, a space, the rest. */
export const TEST_CALL_NUMBER_DISPLAY = "01223 000000";

/** The origin the server under test was told to canonicalise to. */
export const TEST_SITE_URL = BASE_URL;

// ---------------------------------------------------------------------------
// Page helpers
// ---------------------------------------------------------------------------

const TEST_HOST = new URL(BASE_URL).host;

// A 1x1 transparent GIF, so a blocked image still decodes instead of logging a decode error.
const PIXEL = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");

/**
 * Stop every request that would leave the test server: googletagmanager, google-analytics,
 * doubleclick, PostHog, Google Fonts, anything.
 *
 * Requests are FULFILLED with an empty body of the right type rather than aborted. An aborted
 * request logs `net::ERR_FAILED` to the console, and tests/pages.spec.ts asserts zero console
 * errors on every route, so aborting would turn a working page red for a reason that has
 * nothing to do with the page.
 *
 * The ingest path is same-origin — next.config.ts rewrites it to PostHog on the SERVER — so a
 * host filter never sees it. It is stubbed separately, and registered last so it wins:
 * Playwright matches route handlers in reverse registration order. That also means a spec
 * (U8's tracking specs, for instance) can register its own ingest handler afterwards and take
 * over from this one.
 */
export async function blockThirdParties(page: Page): Promise<void> {
  await page.route("**/*", (route) => {
    const url = route.request().url();
    if (!/^https?:/i.test(url)) return route.continue();
    if (new URL(url).host === TEST_HOST) return route.continue();

    switch (route.request().resourceType()) {
      case "script":
        return route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
      case "stylesheet":
        return route.fulfill({ status: 200, contentType: "text/css", body: "" });
      case "font":
        return route.fulfill({ status: 200, contentType: "font/woff2", body: "" });
      case "image":
        return route.fulfill({ status: 200, contentType: "image/gif", body: PIXEL });
      default:
        return route.fulfill({ status: 204, body: "" });
    }
  });

  // posthog-js loads its own scripts (recorder, config) from /ingest/static/*.js. Those must get
  // JavaScript back: a JSON stub is parsed as a script and throws "Unexpected token ':'".
  await page.route("**/ingest/**", (route) =>
    /\.js(\?|$)/.test(route.request().url())
      ? route.fulfill({ status: 200, contentType: "application/javascript", body: "" })
      : route.fulfill({ status: 200, contentType: "application/json", body: '{"status":1}' }),
  );
}

/** Navigate and insist on a 200. Returns the response so a caller can read its headers. */
export async function gotoOk(page: Page, path: string): Promise<Response> {
  const response = await page.goto(path);
  expect(response, `no response at all for ${path}`).not.toBeNull();
  expect(response!.status(), `expected 200 for ${path}`).toBe(200);
  return response!;
}

/**
 * Attach the console and pageerror listeners BEFORE navigating, and return the array they fill.
 * Attaching after `goto` misses everything that happened during load, which is most of it.
 */
export function collectPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
  });
  page.on("pageerror", (err) => {
    errors.push(`pageerror: ${err.message}`);
  });
  return errors;
}

/** `/areas/ely` -> the town leaf, or undefined. Used by the specs that need the town behind a route. */
export function townForRoute(route: string) {
  const slug = route.startsWith("/areas/") ? route.slice("/areas/".length) : null;
  return slug ? TOWNS.find((town) => town.slug === slug) : undefined;
}

/** `/services/drainage` -> the service leaf, or undefined. */
export function serviceForRoute(route: string) {
  const slug = route.startsWith("/services/") ? route.slice("/services/".length) : null;
  return slug ? SERVICES.find((service) => service.slug === slug) : undefined;
}
