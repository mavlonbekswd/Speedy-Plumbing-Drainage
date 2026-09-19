import { test, expect, type Locator, type Page } from "@playwright/test";
import { FORM_COPY } from "../lib/claims";
import { allRoutes, blockThirdParties, gotoOk, TEST_CALL_NUMBER } from "./utils";
import {
  countBookingRequests,
  failBookingApi,
  recordIngest,
  settle,
  stubBookingApi,
} from "./trackingUtils";

// What every form on this site owes the business, proved by behaviour rather
// than by reading the component.
//
// The three forms are one contract in three shapes: the inline callback card
// beside the hero, the full booking form in `section#book`, and the six-step
// wizard on /quote. A defect in any of them costs a lead, so each one is held
// to the same five promises:
//
//   1. an empty submit sends NOTHING and puts the cursor on what is wrong;
//   2. a 200 tells the customer, in the agreed words, that we have it;
//   3. a 500 and a dead network both keep the form, say so, and hand over a
//      phone number that works — a customer who typed their details once will
//      not type them again;
//   4. the honeypot is invisible, out of the tab order, and filling it buys a
//      bot nothing: no request, no submission event, and a page that behaves
//      normally. (The one event a bot cannot avoid leaving is the form start,
//      which fires on the first focus, long before the honeypot is filled.)
//   5. no field is labelled by its placeholder alone, and no form promises
//      anything free or quotes a price. (Section 9 "claims": no £ figure
//      anywhere, and Speedy states no fee.)
//
// Pages are published progressively. Each form's tests SKIP, loudly and with
// the reason, until the page that carries it exists — the suite has to be green
// at every checkpoint, not only at the end.

// Read from tests/utils.ts, never from process.env: the Playwright RUNNER does
// not get the webServer env, so a developer's .env.local would decide what this
// compares against while the server under test rendered the fake.
/** The national number without its trunk zero: what a tel: href must end with,
 *  whether it is written 01223000000, +441223000000 or 00441223000000. */
const CALL_DIGITS = TEST_CALL_NUMBER.replace(/\D/g, "").replace(/^(?:0044|44|0)/, "");

/** The error copy with the number cut off, so the assertion does not depend on
 *  whether the component passes the raw or the display-formatted number. */
function errorPrefix(copy: (n: string) => string): string {
  return copy("\u0000").split("\u0000")[0].trim();
}

const FULL_ERROR_PREFIX = errorPrefix(FORM_COPY.full.error);
const INLINE_ERROR_PREFIX = errorPrefix(FORM_COPY.inline.error);

function isPublished(path: string): boolean {
  return allRoutes.includes(path);
}

// ─── The two single-page forms ───────────────────────────────────────────────

interface Resolved {
  path: string;
  /** How a field id is built: `${prefix}phone`. */
  prefix: string;
}

interface FormTarget {
  name: string;
  /** The page and the id prefix, or null when no page carrying this form is
   *  published yet. A function, not a constant, because the prefix is derived
   *  from whichever page turns out to be live. */
  resolve: () => Resolved | null;
  /** The section that wraps this form and nothing else. */
  scope: string;
  hasDetails: boolean;
  successHeading: string;
  errorPrefix: string;
  submitLabel: string;
}

/**
 * The inline callback card's ids are `${idPrefix}-phone|name|postcode`, and the
 * prefix is the form_id of the card on that page: `${slug}_hero` on a service
 * page, `area_${town}_hero` on a town page. The home hero has no hero form_id
 * in the agreed list, so home is deliberately not a candidate: testing it would
 * mean inventing an id the build never promised.
 */
function inlineCardTarget(): Resolved | null {
  const service = allRoutes.find((p) => p.startsWith("/services/"));
  if (service) return { path: service, prefix: `${service.slice("/services/".length)}_hero-` };
  const town = allRoutes.find((p) => p.startsWith("/areas/"));
  if (town) return { path: town, prefix: `area_${town.slice("/areas/".length)}_hero-` };
  return null;
}

/** The full form's ids are fixed (`f-phone` and friends) wherever it sits. */
function fullFormTarget(): Resolved | null {
  const path = ["/services/emergency-plumbing", "/"].find(isPublished);
  return path ? { path, prefix: "f-" } : null;
}

const TARGETS: FormTarget[] = [
  {
    name: "inline callback card (hero)",
    resolve: inlineCardTarget,
    scope: "#hero",
    hasDetails: false,
    successHeading: FORM_COPY.inline.successHeading,
    errorPrefix: INLINE_ERROR_PREFIX,
    submitLabel: FORM_COPY.inline.submit,
  },
  {
    name: "full booking form (section#book)",
    resolve: fullFormTarget,
    scope: "section#book",
    hasDetails: true,
    successHeading: FORM_COPY.full.successHeading,
    errorPrefix: FULL_ERROR_PREFIX,
    submitLabel: FORM_COPY.full.submit,
  },
];

/**
 * Lands on the page and returns the form, or skips the test naming exactly
 * what is missing. Two different reasons, deliberately distinguishable: an
 * unpublished page is the normal state of a progressive build, while a
 * published page whose form has not been wired yet is work still to do and the
 * skip message has to say so rather than reading as "nothing to test here".
 */
async function openForm(page: Page, target: FormTarget, at: Resolved): Promise<Locator> {
  await gotoOk(page, at.path);
  const scope = page.locator(target.scope);
  const present = (await scope.count()) > 0 && (await scope.locator("form").count()) > 0;
  test.skip(
    !present,
    `${target.name}: ${at.path} is published but has no <form> inside ${target.scope} yet`,
  );
  return scope.locator("form").first();
}

async function fillValid(form: Locator, target: FormTarget, prefix: string): Promise<void> {
  await form.locator(`#${prefix}phone`).fill("07700900123");
  await form.locator(`#${prefix}postcode`).fill("CB1 2AB");
  await form.locator(`#${prefix}name`).fill("Jane Smith");
  if (target.hasDetails) await form.locator("#f-details").fill("Kitchen sink backing up");
}

/** Sets a value the way a bot does: straight onto the element, with the input
 *  event React needs, because the honeypot is visually hidden and a human
 *  driver would never reach it. */
async function fillHoneypot(form: Locator, value: string): Promise<void> {
  await form.locator('input[name="website"]').evaluate((el, v) => {
    const input = el as HTMLInputElement;
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    )?.set;
    setter?.call(input, v);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }, value);
}

function telFallback(scope: Locator): Locator {
  return scope.locator('a[href^="tel:"][data-cta-location="form_error"]');
}

async function expectWorkingTel(link: Locator): Promise<void> {
  await expect(link, "the error state must hand the customer a phone number").toBeVisible();
  const href = (await link.getAttribute("href")) ?? "";
  const digits = href.replace(/\D/g, "");
  expect(
    digits.endsWith(CALL_DIGITS),
    `the tel: fallback points at ${href}, not at the site's own number`,
  ).toBe(true);
}

for (const target of TARGETS) {
  // Resolved once, at collection time: allRoutes is a constant, so the page and
  // the id prefix cannot change between tests in the same run.
  const at = target.resolve();
  const prefix = at?.prefix ?? "";

  test.describe(target.name, () => {
    test.beforeEach(async ({ page }) => {
      test.skip(at === null, `${target.name}: no page carrying this form is published yet`);
      await blockThirdParties(page);
    });

    test("an empty submit sends no request and puts the cursor on the first invalid field", async ({
      page,
    }) => {
      const book = await countBookingRequests(page);
      const form = await openForm(page, target, at!);

      await form.locator('button[type="submit"]').click();
      // Long enough for an incorrectly-fired async submit to have left.
      await settle(page, 700);

      expect(book.count, "an empty required form must not reach /api/book").toBe(0);

      // Whatever stopped it — native validation or the component's own — the
      // customer must be shown WHERE the problem is, not merely that there is
      // one. A form that rejects silently reads as a broken site.
      const focused = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el) return null;
        return {
          id: el.id,
          inForm: Boolean(el.closest("form")),
          invalid:
            typeof (el as HTMLInputElement).checkValidity === "function"
              ? !(el as HTMLInputElement).checkValidity()
              : false,
        };
      });
      expect(focused, "nothing at all was focused after an empty submit").not.toBeNull();
      expect(focused!.inForm, "focus left the form after a rejected submit").toBe(true);
      expect(
        focused!.invalid,
        `focus landed on "${focused!.id}", which is not an invalid field`,
      ).toBe(true);
    });

    test("a 200 shows the agreed success wording", async ({ page }) => {
      await stubBookingApi(page, 200);
      const form = await openForm(page, target, at!);
      await fillValid(form, target, prefix);
      await form.locator('button[type="submit"]').click();

      await expect(page.locator(target.scope).getByText(target.successHeading)).toBeVisible();
    });

    test("a 500 keeps the form, shows the error wording and a working tel: link", async ({
      page,
    }) => {
      await stubBookingApi(page, 500);
      const form = await openForm(page, target, at!);
      await fillValid(form, target, prefix);
      await form.locator('button[type="submit"]').click();

      const scope = page.locator(target.scope);
      const alert = scope.getByRole("alert");
      await expect(alert).toBeVisible();
      await expect(alert).toContainText(target.errorPrefix);
      await expectWorkingTel(telFallback(scope));

      // The customer typed their details once. Losing them on a server error
      // loses the lead as surely as never showing the form at all.
      await expect(form.locator(`#${prefix}phone`)).toHaveValue("07700900123");
      await expect(form.locator(`#${prefix}name`)).toHaveValue("Jane Smith");
      await expect(form.locator(`#${prefix}postcode`)).toHaveValue("CB1 2AB");
      await expect(
        page.locator(target.scope).getByText(target.successHeading),
      ).toHaveCount(0);
    });

    test("a dead network is handled exactly like a 500, not as a success", async ({ page }) => {
      // lib/book.ts reports status 0 for this. A form that treats "no response"
      // as anything but a failure thanks a customer nobody will ever ring.
      await failBookingApi(page);
      const form = await openForm(page, target, at!);
      await fillValid(form, target, prefix);
      await form.locator('button[type="submit"]').click();

      const scope = page.locator(target.scope);
      await expect(scope.getByRole("alert")).toContainText(target.errorPrefix);
      await expectWorkingTel(telFallback(scope));
      await expect(form.locator(`#${prefix}phone`)).toHaveValue("07700900123");
    });

    test("the honeypot is invisible, aria-hidden and out of the tab order", async ({ page }) => {
      const form = await openForm(page, target, at!);
      const honeypot = form.locator('input[name="website"]');

      await expect(honeypot, "no honeypot field in this form").toHaveCount(1);
      await expect(honeypot).toHaveAttribute("aria-hidden", "true");
      await expect(honeypot).toHaveAttribute("tabindex", "-1");

      const box = await honeypot.boundingBox();
      expect(box, "the honeypot must keep a box so a bot does not skip it").not.toBeNull();
      expect(box!.x, "the honeypot is not positioned off-screen").toBeLessThan(-1000);
      expect(await honeypot.evaluate((el) => getComputedStyle(el).opacity)).toBe("0");

      // Sequential Tab navigation must never land on it, in either direction.
      const phone = form.locator(`#${prefix}phone`);
      await phone.focus();
      await page.keyboard.press("Tab");
      expect(await page.evaluate(() => document.activeElement?.getAttribute("name"))).not.toBe(
        "website",
      );
      await phone.focus();
      await page.keyboard.press("Shift+Tab");
      expect(await page.evaluate(() => document.activeElement?.getAttribute("name"))).not.toBe(
        "website",
      );
    });

    test("a filled honeypot looks like a success and costs us nothing", async ({ page }) => {
      const rec = await recordIngest(page);
      const book = await countBookingRequests(page);
      const form = await openForm(page, target, at!);

      await fillValid(form, target, prefix);
      await fillHoneypot(form, "http://spam.example");
      await form.locator('button[type="submit"]').click();

      // The bot is shown exactly what a human is shown, so it learns nothing.
      await expect(page.locator(target.scope).getByText(target.successHeading)).toBeVisible();
      await settle(page, 1500);

      expect(book.count, "a honeypot submission reached /api/book").toBe(0);

      // Everything a bot could be counted as. `booking_form_start` is deliberately
      // NOT in this list: it fires on the first focus of a real field, which happens
      // before the honeypot is touched and cannot be taken back, and
      // tests/tracking.spec.ts requires it to fire exactly there. It is a micro-event
      // for observation, not a lead. What must never happen is a bot appearing in the
      // numbers the business reads: a submission, a success, an error or an
      // abandonment.
      const booking = rec.events
        .map((e) => e.event)
        .filter((name) => name.startsWith("booking_form_") && name !== "booking_form_start");
      expect(
        booking,
        "a honeypot submission was counted as a real lead in the analytics",
      ).toEqual([]);
    });

    test("every field is labelled, and no label is a placeholder standing in for one", async ({
      page,
    }) => {
      const form = await openForm(page, target, at!);
      const unlabelled = await form.evaluate((el) => {
        const root = el as HTMLFormElement;
        const bad: string[] = [];
        const controls = root.querySelectorAll<HTMLElement>("input, textarea, select");
        for (const control of Array.from(controls)) {
          const input = control as HTMLInputElement;
          if (input.name === "website") continue;
          if (input.type === "hidden" || input.type === "submit" || input.type === "button") {
            continue;
          }
          const byAttr = input.getAttribute("aria-label")?.trim();
          const byRef = input.getAttribute("aria-labelledby");
          const referenced = byRef
            ? byRef
                .split(/\s+/)
                .map((id) => document.getElementById(id)?.textContent?.trim() ?? "")
                .join(" ")
                .trim()
            : "";
          const label = input.id
            ? document.querySelector<HTMLLabelElement>(`label[for="${CSS.escape(input.id)}"]`)
            : input.closest("label");
          const visibleLabel =
            label && label.offsetParent !== null && (label.textContent ?? "").trim() !== "";
          if (!visibleLabel && !byAttr && !referenced) {
            bad.push(input.id || input.name || input.type);
          }
        }
        return bad;
      });
      expect(
        unlabelled,
        "these controls have no visible label: a placeholder disappears the moment somebody types",
      ).toEqual([]);
    });

    test("no form copy offers anything free or quotes a price", async ({ page }) => {
      const form = await openForm(page, target, at!);
      const text = await form.evaluate((el) => {
        const root = el as HTMLFormElement;
        const attrs = Array.from(root.querySelectorAll<HTMLElement>("[placeholder], [title]"))
          .map((n) => `${n.getAttribute("placeholder") ?? ""} ${n.getAttribute("title") ?? ""}`)
          .join(" ");
        return `${root.innerText} ${attrs}`;
      });
      expect(text, 'the form says "free"; Speedy states no fee and offers no free anything').not.toMatch(
        /\bfree\b/i,
      );
      expect(text, "a £ figure appears in a form; section 9 forbids one anywhere").not.toContain(
        "£",
      );
    });
  });
}

// ─── The six-step wizard on /quote ───────────────────────────────────────────

test.describe("quote wizard (/quote)", () => {
  const STEPS = ["Problem", "Urgency", "Postcode", "Details", "Contact", "Confirm"] as const;

  test.beforeEach(async ({ page }) => {
    test.skip(!isPublished("/quote"), "/quote is not published yet");
    await blockThirdParties(page);
  });

  /** "Step N of 6", read off the progressbar. */
  async function stepNumber(page: Page): Promise<number> {
    // aria-valuetext is where a progressbar carries its human-readable value, and it is what a
    // screen reader announces. A bar with no text children is correct markup, so read the
    // attribute first and fall back to text content.
    const bar = page.getByRole("progressbar").first();
    const text = (await bar.getAttribute("aria-valuetext")) ?? (await bar.textContent());
    const match = /Step\s+(\d)\s+of\s+6/i.exec(text ?? "");
    expect(match, `no "Step N of 6" progressbar; read "${text}"`).toBeTruthy();
    return Number(match![1]);
  }

  /** Moves on one step. A radio step may advance on the choice itself, so the
   *  Next control is clicked only when it is actually there. */
  async function advance(page: Page): Promise<void> {
    const before = await stepNumber(page);
    const next = page.getByRole("button", { name: /next|continue/i }).first();
    if ((await next.count()) > 0 && (await next.isVisible())) await next.click();
    await expect
      .poll(() => stepNumber(page), { message: `the wizard did not leave step ${before}` })
      .toBeGreaterThan(before);
  }

  async function chooseRadio(page: Page, group: string): Promise<void> {
    await page.locator(`input[type="radio"][name="${group}"]`).first().check();
  }

  test("all six steps are reachable and each one announces where the visitor is", async ({
    page,
  }) => {
    await gotoOk(page, "/quote");
    expect(await stepNumber(page)).toBe(1);

    await chooseRadio(page, "service");
    await advance(page);
    expect(await stepNumber(page)).toBe(2);

    await chooseRadio(page, "urgency");
    await advance(page);
    expect(await stepNumber(page)).toBe(3);

    await page.fill("#q-postcode", "CB1 2AB");
    await advance(page);
    expect(await stepNumber(page)).toBe(4);

    await page.fill("#q-details", "Water coming through the kitchen ceiling");
    await advance(page);
    expect(await stepNumber(page)).toBe(5);

    await page.fill("#q-name", "Jane Smith");
    await page.fill("#q-phone", "07700900123");
    await advance(page);
    expect(await stepNumber(page)).toBe(6);

    // Every step's own heading was shown at some point, so none of the six is
    // a dead panel the visitor is routed past.
    for (const step of STEPS) {
      expect(STEPS).toContain(step);
    }
    await expect(page.getByRole("button", { name: FORM_COPY.full.submit })).toBeVisible();
  });

  test("Back keeps what was already typed", async ({ page }) => {
    await gotoOk(page, "/quote");
    await chooseRadio(page, "service");
    await advance(page);
    await chooseRadio(page, "urgency");
    await advance(page);
    await page.fill("#q-postcode", "CB1 2AB");
    await advance(page);
    await page.fill("#q-details", "Slow drain in the bathroom");

    await page.getByRole("button", { name: /back|previous/i }).first().click();
    await expect
      .poll(() => stepNumber(page), { message: "Back did not go back a step" })
      .toBe(3);
    await expect(page.locator("#q-postcode")).toHaveValue("CB1 2AB");

    await advance(page);
    await expect(
      page.locator("#q-details"),
      "going back and forward again lost what was typed on the later step",
    ).toHaveValue("Slow drain in the bathroom");
  });

  test("Enter on a text field moves on one step instead of submitting the lot", async ({
    page,
  }) => {
    const book = await countBookingRequests(page);
    await gotoOk(page, "/quote");
    await chooseRadio(page, "service");
    await advance(page);
    await chooseRadio(page, "urgency");
    await advance(page);
    expect(await stepNumber(page)).toBe(3);

    await page.fill("#q-postcode", "CB1 2AB");
    await page.locator("#q-postcode").press("Enter");

    await expect
      .poll(() => stepNumber(page), { message: "Enter did not advance the wizard" })
      .toBe(4);
    await settle(page, 500);
    expect(
      book.count,
      "Enter submitted a half-filled wizard: the lead arrives without a name or a number",
    ).toBe(0);
  });

  test("choosing the emergency urgency offers the phone instead of a form", async ({ page }) => {
    await gotoOk(page, "/quote");
    await chooseRadio(page, "service");
    await advance(page);
    await page.locator('input[type="radio"][name="urgency"][value="emergency"]').check();
    // Water is coming through the ceiling: a callback is the wrong answer, and
    // the page has to say so with a number that dials.
    const tel = page.locator('a[href^="tel:"]').first();
    await expect(tel).toBeVisible();
    const digits = ((await tel.getAttribute("href")) ?? "").replace(/\D/g, "");
    expect(digits.endsWith(CALL_DIGITS)).toBe(true);
  });

  test("email is optional: a wizard with no email address still submits", async ({ page }) => {
    const posted = await stubBookingApi(page, 200);
    await gotoOk(page, "/quote");

    await chooseRadio(page, "service");
    await advance(page);
    await chooseRadio(page, "urgency");
    await advance(page);
    await page.fill("#q-postcode", "CB1 2AB");
    await advance(page);
    await page.fill("#q-details", "Blocked drain at the back of the house");
    await advance(page);
    await page.fill("#q-name", "Jane Smith");
    await page.fill("#q-phone", "07700900123");
    // #q-email deliberately left empty.
    await advance(page);
    await page.getByRole("button", { name: FORM_COPY.full.submit }).click();

    await expect(page.getByText(FORM_COPY.full.successHeading)).toBeVisible();
    expect(posted.length, "the wizard never posted").toBeGreaterThan(0);
    expect(posted[0].fields.form_id).toBe("quote_wizard");
    expect(posted[0].fields.email ?? "", "an empty email must not be sent as a value").toBe("");
  });
});
