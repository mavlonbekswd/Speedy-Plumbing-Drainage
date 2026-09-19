import { test, expect } from "@playwright/test";
import { blockThirdParties, gotoOk, serviceRoutes } from "./utils";

test.use({ viewport: { width: 390, height: 844 } });

test.describe("the mobile header", () => {
  test("the burger opens the menu, Escape closes it, and focus comes back to the burger", async ({ page }) => {
    await blockThirdParties(page);
    await gotoOk(page, "/");

    const burger = page.getByRole("button", { name: /open menu/i });
    await expect(burger, "no button named 'open menu' in the header").toBeVisible();

    await burger.click();

    const close = page.getByRole("button", { name: /close menu/i });
    await expect(close, "the panel did not open").toBeVisible();

    await page.keyboard.press("Escape");

    // toBeHidden, not toHaveCount(0): a header that closes the panel with CSS rather than
    // unmounting it is just as closed to the visitor, and this assertion still fails if the
    // panel is left open either way.
    await expect(close, "Escape did not close the panel").toBeHidden();
    await expect(burger, "the burger did not come back").toBeVisible();
    // Focus has to return to the control that opened the panel, or a keyboard user is dropped
    // at the top of the document with no idea where they are.
    await expect(burger, "focus was not returned to the burger").toBeFocused();
  });
});

test.describe("the skip link", () => {
  test("is the very first Tab stop and moves focus to main", async ({ page }) => {
    await blockThirdParties(page);
    await gotoOk(page, "/");

    await page.keyboard.press("Tab");

    const skip = page.locator('a[href="#main"]');
    await expect(skip, "the first Tab stop is not the skip link").toBeFocused();
    await expect(skip).toHaveText(/skip to (main )?content/i);

    await page.keyboard.press("Enter");
    await expect(page.locator("main#main"), "activating the skip link did not focus main").toBeFocused();
  });
});

test.describe("the Services drop-down", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("opens on click, lists every published service, and Escape closes it and returns focus", async ({ page }) => {
    await page.goto("/");
    const button = page.locator('header button[aria-controls="header-services"]');
    const panel = page.locator("#header-services");

    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(panel).toBeHidden();

    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(panel).toBeVisible();

    const hrefs = await panel.locator("a").evaluateAll((links) => links.map((a) => a.getAttribute("href")));
    for (const path of serviceRoutes) expect(hrefs, `${path} is missing from the drop-down`).toContain(path);
    expect(hrefs, "the drop-down has no link to the services page").toContain("/services");

    await page.keyboard.press("Escape");
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(panel).toBeHidden();
    await expect(button).toBeFocused();
  });

  test("a click outside closes it", async ({ page }) => {
    await page.goto("/");
    const button = page.locator('header button[aria-controls="header-services"]');
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await page.locator("main").click({ position: { x: 5, y: 300 } });
    await expect(button).toHaveAttribute("aria-expanded", "false");
  });
});

test.describe("pages the owner removed", () => {
  for (const [from, to] of [
    ["/quote", "/contact"],
    ["/faqs", "/"],
    ["/reviews", "/"],
  ] as const) {
    test(`${from} redirects permanently to ${to}`, async ({ request }) => {
      const res = await request.get(from, { maxRedirects: 0 });
      expect(res.status()).toBe(308);
      expect(new URL(res.headers()["location"], "http://x").pathname).toBe(to);
    });
  }
});
