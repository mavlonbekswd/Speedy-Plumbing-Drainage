import { test, expect } from "@playwright/test";
import { blockThirdParties, gotoOk } from "./utils";

// Tapping a job photo has to enlarge it, and getting back out has to be possible three ways.
// PostHog's first evening of live data recorded several dead clicks on <img> elements: visitors
// were already trying this, and nothing happened.
//
// /projects is the sample because it is the page made of nothing but photographs. Desktop width,
// so the fixed mobile call bar is not over the tile being clicked, and reduced motion so the
// AnimateIn reveal and the dialog's own fade are both settled before anything is asserted.
test.use({ viewport: { width: 1280, height: 800 } });

const DIALOG = "dialog[open]";

test.describe("the photo lightbox", () => {
  test("a photo opens the dialog, and Escape closes it and gives focus back", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await blockThirdParties(page);
    await gotoOk(page, "/projects");

    const trigger = page.locator("[data-zoom-src]").first();
    await expect(trigger, "no [data-zoom-src] trigger on /projects").toBeVisible();

    await trigger.click();

    const dialog = page.locator(DIALOG);
    await expect(dialog, "clicking a photo did not open a modal dialog").toHaveCount(1);
    const alt = await dialog.locator("img").first().getAttribute("alt");
    expect(alt, "the enlarged picture has no alt text").toBeTruthy();

    await page.keyboard.press("Escape");
    await expect(dialog, "Escape did not close the dialog").toHaveCount(0);
    // Or a keyboard visitor is dropped at the top of the document with no idea where they were.
    await expect(trigger, "focus was not returned to the tile that opened it").toBeFocused();
  });

  test("the close button closes it, and a closed dialog holds no picture at all", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await blockThirdParties(page);
    await gotoOk(page, "/projects");

    await page.locator("[data-zoom-src]").first().click();
    await expect(page.locator(DIALOG)).toHaveCount(1);

    await page.locator(DIALOG).getByRole("button", { name: "Close" }).click();
    await expect(page.locator(DIALOG), "the close button did not close the dialog").toHaveCount(0);

    // The picture is rendered only while the dialog is open. tests/pages.spec.ts requires alt
    // text on every <img> on every route, and an <img> with an empty src must never be served.
    await expect(
      page.locator("dialog img"),
      "a closed dialog still holds an <img>",
    ).toHaveCount(0);
  });
});
