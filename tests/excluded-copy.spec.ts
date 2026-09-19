import { test, expect } from "@playwright/test";
import {
  GUARANTEE_LINE,
  GUARANTEE_SCOPE_LINE,
  INSURED_LOCKED_SENTENCE,
  PRICE_PROCESS_LINE,
} from "../lib/claims";
import { FOOTER_LEGAL_LINE } from "../lib/site";
import { SERVICE_BY_SLUG } from "../lib/services";
import { allRoutes, blockThirdParties, gotoOk } from "./utils";
import { fetchAll, visibleText } from "./html";

test.describe.configure({ timeout: 120_000 });

// A GUARD, not a fix.
//
// These four strings are settled. The price-process line is what stands where BeBest put a £49
// figure, and it is the answer to "what will it cost" — the gate the page still has to pass with
// no number available to pass it with. The guarantee scope sentence is the differentiator: no
// competitor states a scope, and a guarantee with no stated scope is read as covering the
// materials too, which it does not. The insured sentence is locked wording on one page. The
// footer disclosure is a statutory requirement.
//
// This file exists so a later refactor of a template cannot quietly edit any of them while
// claiming to be doing something else. If one of these fails, the change that broke it is out
// of scope, whatever else it was doing.

// The two pages that carry no sales copy at all: a legal notice and a gallery.
const WITHOUT_PRICE_LINE = new Set(["/privacy", "/projects"]);

// Whitespace-tolerant forms of the two guarantee lines, so an anchor, a <strong> or a line
// break inside either of them cannot make the pairing check pass by failing to trigger.
const GUARANTEE_TRIGGER = /12-month\s+guarantee\s+on\s+our\s+workmanship/i;
const GUARANTEE_SCOPE_TRIGGER = /Materials\s+are\s+covered\s+by\s+their\s+own\s+maker['’]s\s+warranty/i;

let pages: Map<string, string>;

test.beforeAll(async ({ playwright, baseURL }) => {
  test.setTimeout(120_000);
  const request = await playwright.request.newContext({ baseURL });
  pages = await fetchAll(request, allRoutes);
  await request.dispose();
});

for (const route of allRoutes) {
  test(`the price-process line is where it belongs — ${route}`, () => {
    const body = visibleText(pages.get(route)!);
    if (WITHOUT_PRICE_LINE.has(route)) {
      expect(body, `${route} gained the price-process line, which does not belong on it`).not.toContain(
        PRICE_PROCESS_LINE,
      );
    } else {
      expect(body, `${route} lost the price-process line, which is out of scope to remove`).toContain(
        PRICE_PROCESS_LINE,
      );
    }
  });

  test(`the guarantee never appears without its scope — ${route}`, () => {
    const body = visibleText(pages.get(route)!);
    // Matched loosely on purpose. GUARANTEE_LINE links to /guarantee wherever it renders, so
    // the anchor's closing tag puts a space before the full stop and an exact `includes` of the
    // constant is false — which would make this guard silently skip the one page it is for.
    if (!GUARANTEE_TRIGGER.test(body)) return;
    expect(
      body,
      `${route} states the 12-month guarantee without saying what it covers. A guarantee with ` +
        `no stated scope is read as covering the materials, and it does not.\n  wanted: ${GUARANTEE_SCOPE_LINE}`,
    ).toMatch(GUARANTEE_SCOPE_TRIGGER);
  });
}

if (SERVICE_BY_SLUG["emergency-plumbing"].published) {
  test("the locked insured sentence is verbatim on /services/emergency-plumbing", () => {
    expect(
      visibleText(pages.get("/services/emergency-plumbing")!),
      "the locked insurance wording on the emergency page changed",
    ).toContain(INSURED_LOCKED_SENTENCE);
  });
}

for (const route of allRoutes) {
  test(`the registered-office disclosure is a single text node — ${route}`, async ({ page }) => {
    await blockThirdParties(page);
    await gotoOk(page, route);

    // Deliberately in the browser and deliberately node-by-node. A disclosure broken across
    // several elements — a <strong> around the company number, a <span> around the office —
    // still LOOKS right and still reads right, and is still one string as far as a person is
    // concerned. But it is the composed string that the requirement is about, and the only way
    // to hold the authoring to "one JSX expression, no markup inside it" is to insist the DOM
    // carries it as one text node.
    const found = await page.evaluate((line) => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode()) !== null) {
        if ((node as Text).data === line) return true;
      }
      return false;
    }, FOOTER_LEGAL_LINE);

    expect(
      found,
      `${route} does not carry the registered-office disclosure as one text node:\n  ${FOOTER_LEGAL_LINE}`,
    ).toBe(true);
  });
}
