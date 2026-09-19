import { test, expect } from "@playwright/test";
import { ADS, KEYWORD_URL_OVERRIDES, NEVER_A_FINAL_URL, TOWN_KEYWORDS } from "../content/ads";
import { MUST_RENDER } from "../lib/claims";
import { allRoutes, serviceAndTownRoutes } from "./utils";
import { fetchAll, visibleText, visibleTextExcludingHidden } from "./html";

test.describe.configure({ timeout: 120_000 });

// ⚠ THE TEST THAT GATES LAUNCH.
//
// An ad may only promise what its own landing page renders. This is the join — ad to page —
// and the join is what costs money when it breaks, because the page alone can be perfect and
// the money still burns. The worked example from the brief: the Emergency ad's pinned
// description is "Open 24/7, including weekends and bank holidays. A plumber answers, day or
// night." The old town template did not render that line. That single gap is why eleven town
// keywords are built and held. When a town page renders the pinned line of the ad that lands
// on it, the hold lifts.
//
// The instrument is `visibleTextExcludingHidden`, not `visibleText`. A pinned line tucked
// inside a closed disclosure panel is in the HTML and is not on the page. The visitor arriving
// from that ad has to SEE the thing the ad said, above or below the fold but without opening
// anything. (The consequence for page authors: the line must be in unconditionally rendered
// markup, not behind a `hidden` attribute and not in a wrapper this instrument cannot evaluate,
// such as a responsive `md:hidden` class.)

const PUBLISHED = new Set(allRoutes);

const normalise = (text: string) => text.replace(/\s+/g, " ").trim();

let pages: Map<string, string>;

test.beforeAll(async ({ playwright, baseURL }) => {
  test.setTimeout(120_000);
  const request = await playwright.request.newContext({ baseURL });
  pages = await fetchAll(request, allRoutes);
  await request.dispose();
});

function expectPinned(route: string, pinned: string, adId: string) {
  const body = normalise(visibleTextExcludingHidden(pages.get(route)!));
  expect(
    body,
    `${route} does not render, in always-visible text, the pinned description of ad ${adId}:\n  ${pinned}`,
  ).toContain(normalise(pinned));
}

// ---------------------------------------------------------------------------
// Every ad's own Final URL
// ---------------------------------------------------------------------------

for (const ad of ADS) {
  const title = `${ad.finalUrl} renders the pinned line of ad ${ad.id}`;

  if (ad.blocked) {
    // /services/boiler-repairs is blocked: three lawful routes exist for the gas credential and
    // which one is true has not been answered. Its ad group is paused, so waiting costs nothing.
    test.fixme(`${title} — BLOCKED: ${ad.finalUrl} is held pending the credential decision`, () => {});
  } else if (!PUBLISHED.has(ad.finalUrl)) {
    test.fixme(`${title} — PENDING: ${ad.finalUrl} is not published yet`, () => {});
  } else {
    test(title, () => expectPinned(ad.finalUrl, ad.pinned, ad.id));
  }
}

// ---------------------------------------------------------------------------
// Keyword-level Final URLs that send an ad group to a SECOND page
// ---------------------------------------------------------------------------

for (const override of KEYWORD_URL_OVERRIDES) {
  const group = ADS.filter((ad) => ad.group === override.group);
  const live = group.filter((ad) => !ad.blocked);
  const title = `${override.finalUrl} renders every pinned line of group ${override.group} (${override.keywords} keywords)`;

  if (live.length === 0) {
    test.fixme(`${title} — BLOCKED: every ad in group ${override.group} is held`, () => {});
  } else if (!PUBLISHED.has(override.finalUrl)) {
    test.fixme(`${title} — PENDING: ${override.finalUrl} is not published yet`, () => {});
  } else {
    test(title, () => {
      for (const ad of live) expectPinned(override.finalUrl, ad.pinned, ad.id);
    });
  }
}

// ---------------------------------------------------------------------------
// Town keywords: the eleven that are built and held
// ---------------------------------------------------------------------------

const TOWN_TARGETS = [...new Set(TOWN_KEYWORDS.map((keyword) => keyword.finalUrl))];

for (const target of TOWN_TARGETS) {
  const groups = [...new Set(TOWN_KEYWORDS.filter((k) => k.finalUrl === target).map((k) => k.group))];
  const live = ADS.filter((ad) => !ad.blocked && groups.includes(ad.group as "E" | "DC"));
  const title = `${target} renders every pinned line of the groups that land on it (${groups.join(", ")})`;

  if (!PUBLISHED.has(target)) {
    test.fixme(`${title} — PENDING: ${target} is not published yet, so its keywords stay held`, () => {});
  } else {
    test(title, () => {
      for (const ad of live) expectPinned(target, ad.pinned, ad.id);
    });
  }
}

// ---------------------------------------------------------------------------
// The two rules that need no page at all
// ---------------------------------------------------------------------------

test("no ad, override or town keyword points at an organic-only town page", () => {
  // The three organic towns exist for search only: the ad account EXCLUDES their districts, so
  // paying for a click that lands on one is paying to send a customer somewhere the account
  // says it does not work.
  const forbidden = new Set<string>(NEVER_A_FINAL_URL);
  const offenders = [
    ...ADS.filter((ad) => forbidden.has(ad.finalUrl)).map((ad) => `ad ${ad.id} -> ${ad.finalUrl}`),
    ...KEYWORD_URL_OVERRIDES.filter((o) => forbidden.has(o.finalUrl)).map(
      (o) => `override ${o.group} -> ${o.finalUrl}`,
    ),
    ...TOWN_KEYWORDS.filter((k) => forbidden.has(k.finalUrl)).map((k) => `keyword ${k.keyword} -> ${k.finalUrl}`),
  ];
  expect(offenders, `Final URLs that must never be one: ${offenders.join("; ")}`).toEqual([]);
});

// ---------------------------------------------------------------------------
// Section 10: the nine lines every service and town page must render
// ---------------------------------------------------------------------------

for (const route of serviceAndTownRoutes) {
  test(`renders all nine section-10 lines — ${route}`, () => {
    // Measured on `visibleText` rather than the stricter instrument above: several of these
    // legitimately live inside an answer card or an FAQ, which is where a reader looks for
    // them. The pinned AD lines are the ones held to always-visible text, because those are
    // the ones someone paid for.
    const body = visibleText(pages.get(route)!);
    const missing = MUST_RENDER.filter((rule) => !rule.test.test(body)).map((rule) => rule.label);
    expect(missing, `${route} is missing:\n  - ${missing.join("\n  - ")}`).toEqual([]);
  });
}
