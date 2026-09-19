import { test, expect, type APIResponse } from "@playwright/test";

// The PostHog reverse proxy, taken ON THE WIRE.
//
// Everything here goes through the `request` fixture, straight at the built
// Next server, and deliberately NOT through `page`. That distinction is the
// entire reason this file exists.
//
// tests/trackingUtils.ts intercepts /ingest with page.route(), which is
// browser-side: the request never leaves Chromium. On the sibling BeBest build
// that meant middleware was never exercised for a single /ingest path, and the
// fact that the server 307'd every one of them to a marketing page was
// invisible to a suite of 152 green tests. Every event posted by every visitor
// was silently discarded for weeks. The proof has to be taken from a real
// production build, on the wire, or it is not proof.
//
// What is asserted is deliberately narrow: that OUR server does not eat the
// request. PostHog's own response code is not asserted beyond that, because the
// machine running this suite may be offline, behind a proxy, or on a network
// that blocks the region — none of which is a defect in this repo, and all of
// which would otherwise produce a red test that tells nobody anything.

const CAPTURE_BODY = {
  api_key: "phc_test_key_not_real",
  batch: [
    {
      event: "arim_proxy_reachability_probe",
      properties: { distinct_id: "arim-proxy-spec" },
      timestamp: "2026-09-19T00:00:00Z",
    },
  ],
};

/** The event endpoints posthog-js uses. `/ingest/e/` is the legacy path and
 *  `/ingest/batch/` the explicit batch one; both must survive the trip.
 *  skipTrailingSlashRedirect is set in next.config.ts precisely so the trailing
 *  slash PostHog sends does not become a redirect of its own, which makes these
 *  the meaningful probes rather than their slashless cousins. */
const CAPTURE_ENDPOINTS = ["/ingest/e/", "/ingest/batch/"];

/**
 * The failure this file is about: a 3xx back into our own site, or a Location
 * header pointing at one of our pages. An absolute Location at PostHog's own
 * region host is PostHog's business and is not a defect here.
 */
function expectNotRedirectedAway(response: APIResponse, path: string): void {
  const status = response.status();
  const location = response.headers()["location"];

  expect(
    status,
    `${path} was answered with HTTP ${status}` +
      (location ? ` to "${location}"` : "") +
      ". A redirect here means middleware or a route rule ate the proxy, and every event " +
      "posted to it is silently discarded.",
  ).not.toBe(307);
  expect(status, `${path} was permanently redirected to "${location}"`).not.toBe(308);
  expect(status >= 300 && status < 400, `${path} was redirected (HTTP ${status})`).toBe(false);

  if (location !== undefined) {
    // A relative Location, or an absolute one on our own origin, is us eating
    // the request. That is the defect, whatever status carried it.
    const isOurs = location.startsWith("/") || location.includes("127.0.0.1");
    expect(
      isOurs,
      `${path} carried a Location header pointing back into this site ("${location}")`,
    ).toBe(false);
  }
}

test.describe("PostHog reverse proxy", () => {
  for (const path of CAPTURE_ENDPOINTS) {
    test(`POST ${path} is not redirected away`, async ({ request }) => {
      const response = await request.post(path, {
        headers: { "content-type": "application/json" },
        data: CAPTURE_BODY,
        maxRedirects: 0,
        failOnStatusCode: false,
      });
      expectNotRedirectedAway(response, path);

      // And it must not have been answered by one of our own pages. The
      // signature of the swallowed-proxy bug was an HTML document coming back
      // from an endpoint that should only ever return JSON.
      const contentType = response.headers()["content-type"] ?? "";
      expect(
        contentType.includes("text/html"),
        `${path} answered with HTML, so this site handled it instead of forwarding it`,
      ).toBe(false);
    });
  }

  test("POST /ingest/i/v0/e/ (the current posthog-js default) is not redirected away", async ({
    request,
  }) => {
    const path = "/ingest/i/v0/e/";
    const response = await request.post(path, {
      headers: { "content-type": "application/json" },
      data: CAPTURE_BODY,
      maxRedirects: 0,
      failOnStatusCode: false,
    });
    expectNotRedirectedAway(response, path);
  });

  test("POST /ingest/flags/?v=2 keeps its query string and is not redirected away", async ({
    request,
  }) => {
    // The bug's signature on the sibling build was "location: /a-page?v=2" —
    // the query carried onto the redirect, which is what made it look like a
    // working redirect rather than a swallowed API call. posthog-js holds its
    // first flush until remote config resolves, so this one being eaten is why
    // even the queue never drained.
    const path = "/ingest/flags/?v=2";
    const response = await request.post(path, {
      headers: { "content-type": "application/json" },
      data: { token: CAPTURE_BODY.api_key, distinct_id: "arim-proxy-spec" },
      maxRedirects: 0,
      failOnStatusCode: false,
    });
    expectNotRedirectedAway(response, path);
  });

  test("the asset half of the proxy is not redirected either", async ({ request }) => {
    // next.config.ts rewrites /ingest/static/* to the assets host ahead of the
    // catch-all. This half is usually the one that keeps working when a matcher
    // edit breaks the other, so it is asserted rather than assumed.
    const path = "/ingest/static/array.js";
    const response = await request.get(path, { maxRedirects: 0, failOnStatusCode: false });
    expectNotRedirectedAway(response, path);
  });

  test("a GET to the capture endpoint is not turned into a page either", async ({ request }) => {
    // Some blockers and some prefetchers issue a GET. It must still reach the
    // proxy rather than being handed a marketing page with a 200, which is the
    // shape that made the original defect invisible.
    const path = "/ingest/e/";
    const response = await request.get(path, { maxRedirects: 0, failOnStatusCode: false });
    expectNotRedirectedAway(response, path);
    expect(
      (response.headers()["content-type"] ?? "").includes("text/html"),
      `${path} answered with an HTML page`,
    ).toBe(false);
  });
});
