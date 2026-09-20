import { test, expect } from "@playwright/test";
import { BANNED_PATTERNS, RELEASED_BLOCKED_DRAINS_LINE } from "../lib/claims";
import { EXCLUDED_DISTRICTS } from "../lib/coverage";
import { allRoutes } from "./utils";
import { fetchAll, jsonLdStrings, textUnits, unescapeEntities, visibleText } from "./html";

test.describe.configure({ timeout: 120_000 });

// The claims gate, enforced against what the site actually served.
//
// lib/claims.ts already stops a banned string entering a content leaf, and lib/services.ts
// runs the same list over every published leaf at import. This file is the other end of the
// pipe, and it exists because those checks only see the data files. A claim can reach a page
// from a template, from a component's hard-coded string, from a meta description, from JSON-LD
// or from an alt attribute, and none of those is a content leaf.
//
// TWO INSTRUMENTS, on purpose:
//
//   RAW    — the served bytes, scripts and JSON-LD included. Used for the rules that are about
//            a string appearing ANYWHERE a machine can read it: a currency figure, the gas
//            credential, a fee, aggregateRating. A £ figure inside a JSON-LD offer is a price
//            claim in exactly the way a £ figure in a heading is.
//   READABLE — visible text plus the decoded text of every JSON-LD block. Used for the token
//            rules (postcode districts, G3) because a raw-bytes match there false-positives on
//            a Next build id in a /_next/static/<hash>/ URL, which is not a claim about
//            anything. Everything a reader or a crawler takes as meaning is still covered.

const RAW_RULES: { label: string; re: RegExp }[] = [
  // There is no fee, and none may be stated — as a number, as an absence, or as a discount.
  // Stating a sometimes-fee as absent is drip pricing under the DMCC, the more dangerous half.
  // One figure is allowed, in one wording: "£49 call-out fee" (owner, 20 Sept 2026;
  // lib/claims.ts CALL_OUT_FEE). Any other figure, or the fee named any other way, fails.
  { label: "a currency figure other than the call-out fee", re: /(?:£|&pound;)\s?(?!49 call-out fee\b)\d/ },
  // Registration is held by a BUSINESS. Claiming it is a per-se banned practice under the DMCC
  // Act 2024 Sch. 20 — criminal liability, not an ASA ruling. The denial is banned too: it is
  // true, but it contradicts the boiler and hot-water pages this site exists to sell, and the
  // owner never authorised the disclosure. One pattern covers both directions.
  { label: "the gas credential, in any casing and in either direction", re: /gas\s*safe/i },
  { label: "a call-out fee named without its figure, or denied", re: /(?<!£49 )call[-\s]?out\s+(fee|charge)|free\s+call[-\s]?out|no\s+call[-\s]?out/i },
  { label: "an aggregateRating", re: /aggregate\s?rating/i },
  // The `u` flag matters: without it the emoji is matched as two lone surrogates, so any other
  // emoji in the same plane — a flag, a house, a droplet — reports as a star rating.
  { label: "a star glyph", re: /[★☆⭐\u{1F31F}]/u },
  { label: "a rating asserted in prose", re: /\brated\b/i },
  { label: "a review count", re: /\b\d[\d,]*\s+reviews?\b/i },
];

const READABLE_RULES: { label: string; re: RegExp }[] = [
  // Districts the ad account actively EXCLUDES. A page claiming service where the account
  // excludes it puts the site and the account in contradiction, and the site is the one a
  // customer reads. PE30-32 are King's Lynn, which has a page for search only.
  ...[...EXCLUDED_DISTRICTS, "PE30", "PE31", "PE32"].map((district) => ({
    label: `the excluded district ${district}`,
    re: new RegExp(`\\b${district}\\b`, "i"),
  })),
  // Work the owner has ruled out of the wording. "cylinder" is allowed and must stay allowed.
  { label: "central heating", re: /\bcentral\s+heating\b/i },
  { label: "unvented", re: /\bunvented\b/i },
  { label: "the water regulation code G3", re: /\bG3\b/ },
];

let pages: Map<string, string>;

test.beforeAll(async ({ playwright, baseURL }) => {
  test.setTimeout(120_000);
  const request = await playwright.request.newContext({ baseURL });
  pages = await fetchAll(request, allRoutes);
  await request.dispose();
});

const readableOf = (html: string) =>
  [visibleText(html), ...jsonLdStrings(html).map(unescapeEntities)].join(" \n ");

for (const route of allRoutes) {
  test(`nothing forbidden reaches the served bytes — ${route}`, () => {
    const raw = pages.get(route)!;
    // Both spellings: `&pound;49` and `£49` are the same claim, and only one of them is a byte
    // match for the pattern.
    const decoded = unescapeEntities(raw);
    const hits = RAW_RULES.filter((rule) => rule.re.test(raw) || rule.re.test(decoded)).map((r) => r.label);
    expect(hits, `${route} carries: ${hits.join("; ")}`).toEqual([]);
  });

  test(`nothing forbidden reaches the readable text — ${route}`, () => {
    const readable = readableOf(pages.get(route)!);
    const hits = READABLE_RULES.filter((rule) => rule.re.test(readable)).map((r) => r.label);
    expect(hits, `${route} carries: ${hits.join("; ")}`).toEqual([]);
  });

  test(`the word "free" is only ever the WhatsApp photo quote — ${route}`, () => {
    // Per STATEMENT, not per page. The page-level form of this check is vacuous: one mention of
    // WhatsApp anywhere would license "free quote" in a heading three sections away. "Free"
    // belongs to the photo quote, which genuinely is free, and to nothing else on this site.
    //
    // `textUnits`, not `sentences`: a button reading "Free quote" is two words with no full
    // stop, and `sentences` would both drop it for being short and glue it to whatever follows.
    // A CTA is exactly where this claim goes wrong.
    const offenders = textUnits(pages.get(route)!).filter(
      (unit) => /\bfree\b/i.test(unit) && !/whats\s?app/i.test(unit),
    );
    expect(offenders, `${route} says "free" away from the WhatsApp photo quote:\n  ${offenders.join("\n  ")}`).toEqual(
      [],
    );
  });

  test(`no banned pattern survives into the visible text — ${route}`, () => {
    const body = visibleText(pages.get(route)!);
    const hits = BANNED_PATTERNS.filter((pattern) => pattern.re.test(body)).map((p) => p.label);
    expect(hits, `${route} trips: ${hits.join("; ")}`).toEqual([]);
  });
}

test("the released same-day line runs on /services/blocked-drains and nowhere else", () => {
  // Released by the owner on 18 September 2026 for one page. The release does not generalise:
  // no other service line carries a completion promise, conditional or otherwise.
  const carrying = allRoutes.filter((route) => visibleText(pages.get(route)!).includes(RELEASED_BLOCKED_DRAINS_LINE));

  expect(
    carrying.filter((route) => route !== "/services/blocked-drains"),
    `the released line escaped onto: ${carrying.filter((r) => r !== "/services/blocked-drains").join(", ")}`,
  ).toEqual([]);

  if (allRoutes.includes("/services/blocked-drains")) {
    expect(carrying, "/services/blocked-drains does not carry its own released line").toContain(
      "/services/blocked-drains",
    );
  }
});
