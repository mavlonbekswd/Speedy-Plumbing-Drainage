import { test, expect } from "@playwright/test";
import { PRICE_PROCESS_LINE } from "../lib/claims";
import { PUBLISHED_TOWNS, TOWN_BY_SLUG, townHref } from "../lib/towns";
import { SERVICE_BY_SLUG } from "../lib/services";
import { allRoutes, blockThirdParties, gotoOk } from "./utils";

// Two rules, and they pull against each other, which is why they are in one file.
//
// The first is about the sentence. A stacked H1 built by passing the town in as the second line
// produces this, on every town page at once:
//
//   <h1>Plumbing emergency?<!-- --> <br/>in Bishop's Stortford</h1>
//
// A lower-case prepositional fragment presented as its own sentence after a question mark. The
// rule is stated generally rather than as a string match, because the wording will change and
// the defect will not.
//
// The second is about the first screen. These are ad landing pages; the tap-to-call link has to
// be inside the first viewport on a 390x844 phone, and a longer headline is exactly what pushes
// it out. "Plumbing emergency in Bishop's Stortford?" is 41 characters against 19, so the two
// rules are in direct tension and both have to hold at once.

const FIRST_SCREEN = { width: 390, height: 844 };
const MIN_TAP_TARGET = 44;
const MAX_FIRST_SCREEN_WORDS = 60;
const ARRIVAL_PROMISE = "45 minutes";

// ---------------------------------------------------------------------------
// Every H1 on the site reads as a sentence
// ---------------------------------------------------------------------------

for (const route of allRoutes) {
  test(`every line of the H1 reads as a sentence — ${route}`, async ({ page }) => {
    await blockThirdParties(page);
    await gotoOk(page, route);

    const h1 = await page.locator("h1").innerText();
    const lines = h1.split("\n").map((line) => line.trim()).filter(Boolean);
    expect(lines.length, `no H1 text on ${route}`).toBeGreaterThan(0);

    lines.forEach((line, index) => {
      // A line may continue the previous one across the break. What may not happen is a line
      // that begins AFTER a full stop or a question mark and then starts lower case, because
      // that line is a fragment dressed as a sentence.
      if (index > 0 && /[.?!]$/.test(lines[index - 1])) {
        expect(line, `H1 line on ${route} follows a sentence end but starts lower case: "${line}"`).toMatch(
          /^[A-Z0-9"'‘“]/,
        );
      }
      // And no line of any H1 opens with a bare preposition, whatever precedes it.
      expect(line, `H1 line on ${route} opens with a bare preposition: "${line}"`).not.toMatch(
        /^(in|at|near|for)\b/i,
      );
    });

    expect(h1.replace(/\s+/g, " "), `H1 on ${route} is a broken sentence: "${h1}"`).not.toMatch(
      /[.?!]\s*(in|at|near|for)\b/i,
    );
  });
}

for (const town of PUBLISHED_TOWNS) {
  test(`the town H1 names the town — ${town.slug}`, async ({ page }) => {
    await blockThirdParties(page);
    await gotoOk(page, townHref(town.slug));
    const h1 = await page.locator("h1").innerText();
    // Message match: an ad for a town that lands on a page whose headline never says the town
    // is the gap the eleven held town keywords exist because of.
    expect(h1.replace(/’/g, "'"), `H1 on ${townHref(town.slug)} never names ${town.name}`).toContain(
      town.name.replace(/’/g, "'"),
    );
  });
}

// ---------------------------------------------------------------------------
// The 390x844 first-screen contract
// ---------------------------------------------------------------------------

// The two pages the contract names: the longest town name on the site, and the service page
// every emergency keyword lands on. Both are gated on `published`, so they appear the day the
// page does.
const FIRST_SCREEN_ROUTES: string[] = [
  ...(TOWN_BY_SLUG["bishops-stortford"].published ? ["/areas/bishops-stortford"] : []),
  ...(SERVICE_BY_SLUG["emergency-plumbing"].published ? ["/services/emergency-plumbing"] : []),
];

test.describe("the first screen on a 390x844 phone", () => {
  test.use({ viewport: FIRST_SCREEN });

  for (const route of FIRST_SCREEN_ROUTES) {
    test(`the hero call link is served, visible and above the fold — ${route}`, async ({ page, request }) => {
      // First, in the SERVED HTML. A CTA that only exists after hydration is not a CTA for the
      // visitor whose JavaScript has not arrived yet, and it is invisible to anything that does
      // not run scripts.
      const served = await (await request.get(route)).text();
      const serverSide = [
        ...served.matchAll(/<a\b[^>]*data-cta-location=["']hero["'][^>]*>/gi),
      ].filter((m) => /href=["']tel:/i.test(m[0]));
      expect(
        serverSide.length,
        `${route} does not serve exactly one a[data-cta-location="hero"][href^="tel:"] in its HTML`,
      ).toBe(1);

      await blockThirdParties(page);
      await gotoOk(page, route);

      const cta = page.locator('a[data-cta-location="hero"][href^="tel:"]');
      await expect(cta, `${route} should render exactly one hero tel: link`).toHaveCount(1);

      // Auto-retries, which is what makes this safe with an entrance animation: the assertion
      // is that the link SETTLES at full opacity, not that it started there.
      await expect(cta, `the hero call link on ${route} never reaches full opacity`).toHaveCSS("opacity", "1");

      const box = (await cta.boundingBox())!;
      expect(box, `no hero call button on ${route}`).toBeTruthy();
      expect(box.height, `the hero call link on ${route} is ${box.height}px tall`).toBeGreaterThanOrEqual(
        MIN_TAP_TARGET,
      );
      expect(
        box.y + box.height,
        `the hero call link on ${route} falls below the fold at 390x844`,
      ).toBeLessThanOrEqual(FIRST_SCREEN.height);

      const h1Box = (await page.locator("h1").boundingBox())!;
      expect(h1Box.y, `the H1 on ${route} is not above the call link`).toBeLessThan(box.y);

      // No form before it in DOM order. A form above the primary CTA makes the visitor read a
      // questionnaire before they find the one action that works at 3am.
      const formsBefore = await page.evaluate(() => {
        const cta = document.querySelector('a[data-cta-location="hero"][href^="tel:"]');
        if (!cta) return -1;
        return [...document.querySelectorAll("form")].filter(
          (form) => form.compareDocumentPosition(cta) & Node.DOCUMENT_POSITION_FOLLOWING,
        ).length;
      });
      expect(formsBefore, `${route} puts ${formsBefore} form(s) before the hero call link`).toBe(0);
    });

    test(`the first screen answers price and arrival, and stays short — ${route}`, async ({ page }) => {
      // Hero copy fades up over 0.8s. Measured mid-fade, a paragraph is transparent while its bold
      // child is not, so the contract is judged with motion off: what the customer ends up seeing.
      await page.emulateMedia({ reducedMotion: "reduce" });
      await blockThirdParties(page);
      await gotoOk(page, route);

      const aboveFold = await page.evaluate((foldY) => {
        // Hero copy only. Page chrome (skip link, logo, breadcrumb, the fixed call bar) is the same
        // 17 words on every route and no copy decision can move it, and the callback card is a form,
        // not reading matter, so neither counts against the budget. Everything else in the hero does.
        const hero = document.querySelector("#hero");
        if (!hero) return "";
        const walker = document.createTreeWalker(hero, NodeFilter.SHOW_TEXT, {
          acceptNode: (n) =>
            n.parentElement?.closest("[data-hero-aside], nav") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
        });
        const parts: string[] = [];
        let node: Node | null;
        while ((node = walker.nextNode()) !== null) {
          const text = (node.nodeValue ?? "").trim();
          if (!text) continue;
          const parent = node.parentElement;
          if (!parent) continue;
          const style = getComputedStyle(parent);
          if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) continue;
          const range = document.createRange();
          range.selectNodeContents(node);
          const rect = range.getBoundingClientRect();
          if (rect.width === 0 && rect.height === 0) continue;
          if (rect.top >= foldY) continue;
          parts.push(text);
        }
        return parts.join(" ").replace(/\s+/g, " ").trim();
      }, FIRST_SCREEN.height);

      // Gate 4 of the five dealbreakers, answered with process certainty instead of a number,
      // because Speedy has no fee and the owner has forbidden stating one in either direction.
      expect(aboveFold, `the price-process line is not in the first screen on ${route}`).toContain(
        PRICE_PROCESS_LINE,
      );
      expect(aboveFold, `the arrival promise is not in the first screen on ${route}`).toContain(
        ARRIVAL_PROMISE,
      );

      const words = aboveFold.split(/\s+/).filter(Boolean).length;
      expect(
        words,
        `the first screen on ${route} carries ${words} words. Above the fold is a decision, not a page.`,
      ).toBeLessThan(MAX_FIRST_SCREEN_WORDS);
    });
  }
});
