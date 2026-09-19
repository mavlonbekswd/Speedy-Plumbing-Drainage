import { test, expect } from "@playwright/test";
import { ADS, KEYWORD_URL_OVERRIDES, TOWN_KEYWORDS } from "../content/ads";
import { STATIC_ROUTES } from "../lib/routes";
import { SERVICES, serviceHref } from "../lib/services";
import { TIER1, TOWNS, townHref } from "../lib/towns";
import { allRoutes } from "./utils";

// ⚠ THE ONE DELIBERATELY RED SPEC.
//
// Every other file in this directory iterates the PUBLISHED lists, so an unbuilt page
// contributes no test rather than a failing one and the suite stays green at every checkpoint
// while the site is assembled. That design has one hole in it, and it is a serious one: a suite
// that is green because nothing is published looks exactly like a suite that is green because
// everything works.
//
// This file is the hole, made visible. It asserts the FLAGS, not the pages, and it is expected
// to fail every day until launch. Its failure message is the build's remaining work, printed as
// a list. On the day it passes, the site is complete and the ads can run.
//
// It is not `test.fixme`: a fixme is a thing someone decided not to do. This is a thing that has
// to be done, and the count going down is the progress report.

const ORGANIC = TOWNS.filter((town) => town.tier === "organic");

test("every non-boiler service is published", () => {
  // Nine of the ten. /services/boiler-repairs is held pending the credential decision — three
  // lawful routes exist and which one is true has not been answered — so it is excluded here
  // rather than counted as outstanding work.
  const outstanding = SERVICES.filter((s) => s.slug !== "boiler-repairs" && !s.published).map((s) =>
    serviceHref(s.slug),
  );
  expect(
    outstanding,
    `${outstanding.length} of 9 non-boiler service pages are not published yet:\n  ${outstanding.join("\n  ")}`,
  ).toEqual([]);
});

test("all 28 tier-1 towns are published", () => {
  const outstanding = TIER1.filter((town) => !town.published).map((town) => townHref(town.slug));
  expect(
    outstanding,
    `${outstanding.length} of 28 tier-1 town pages are not published yet:\n  ${outstanding.join("\n  ")}`,
  ).toEqual([]);
});

test("the three organic towns are published", () => {
  // They carry no ad and never appear in areaServed, but they are the search-only pages for
  // King's Lynn, Peterborough and Bedford and the site is not finished without them.
  const outstanding = ORGANIC.filter((town) => !town.published).map((town) => townHref(town.slug));
  expect(
    outstanding,
    `${outstanding.length} of ${ORGANIC.length} organic town pages are not published yet:\n  ${outstanding.join("\n  ")}`,
  ).toEqual([]);
});

test("every static route is published", () => {
  const outstanding = STATIC_ROUTES.filter((route) => !route.published).map(
    (route) => `${route.path} (${route.titleHint})`,
  );
  expect(
    outstanding,
    `${outstanding.length} static pages are not published yet:\n  ${outstanding.join("\n  ")}`,
  ).toEqual([]);
});

test("every page a non-blocked ad or keyword can land on is published", () => {
  // The join from the other side: not "does the page render the line" — tests/ad-page-join.spec.ts
  // asks that — but "does the page exist at all". A live ad pointing at an unpublished Final URL
  // pays for a 404.
  const published = new Set(allRoutes);
  const targets = new Map<string, string[]>();

  const claim = (url: string, why: string) => targets.set(url, [...(targets.get(url) ?? []), why]);

  for (const ad of ADS) if (!ad.blocked) claim(ad.finalUrl, `ad ${ad.id}`);
  for (const override of KEYWORD_URL_OVERRIDES) {
    if (ADS.some((ad) => ad.group === override.group && !ad.blocked)) {
      claim(override.finalUrl, `keyword override for group ${override.group}`);
    }
  }
  for (const keyword of TOWN_KEYWORDS) claim(keyword.finalUrl, `keyword ${keyword.keyword}`);

  const outstanding = [...targets.entries()]
    .filter(([url]) => !published.has(url))
    .map(([url, reasons]) => `${url} — needed by ${reasons.length} entr${reasons.length === 1 ? "y" : "ies"}: ${reasons[0]}${reasons.length > 1 ? ", ..." : ""}`);

  expect(
    outstanding,
    `${outstanding.length} live ad targets have no published page:\n  ${outstanding.join("\n  ")}`,
  ).toEqual([]);
});
