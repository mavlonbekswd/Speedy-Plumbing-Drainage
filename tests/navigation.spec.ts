import { test, expect } from "@playwright/test";
import { blockThirdParties, gotoOk } from "./utils";

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
