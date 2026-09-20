import { test, expect, type Locator, type Page } from "@playwright/test";
import { CLICK_ID_STORAGE_KEY } from "../lib/clickIds";
import { FORM_COPY } from "../lib/claims";
import { allRoutes, blockThirdParties, gotoOk, TEST_CALL_NUMBER } from "./utils";
import {
  AW_TEST_ID,
  behaviourProperties,
  blockGoogleTag,
  conversionCalls,
  dataLayer,
  recordIngest,
  readDeviceStorage,
  settle,
  stubBookingApi,
  userDataCalls,
  type IngestRecorder,
} from "./trackingUtils";

// What this site measures, established by observation rather than by reading
// the components:
//
//   1. what PostHog was actually sent (decoded off intercepted /ingest POSTs);
//   2. what was written to the visitor's device;
//   3. what reached Google (every window.dataLayer push, in order);
//   4. what is in the SERVED HTML, which is where Google's tag checker looks
//      and which the DOM cannot stand in for.
//
// Consent is settled and is not relitigated here: no banner, no Consent Mode,
// measurement from the first page load (Maher, 18 September). The privacy
// describe block at the end holds the notice to that build rather than the
// other way round.
//
// Every test picks its page from the published route list and skips, with the
// reason, when the page it needs does not exist yet.

// From tests/utils.ts, not process.env: the Playwright runner does not receive
// the webServer env, so reading it here would assert against a developer's own
// local values while the server under test rendered the fakes.
const GA4_ID = "G-TEST000000";
const BOOKING_LABEL = "booking_label_test";
const PHONE_TAP_LABEL = "phone_tap_label_test";
const PHONE_CALL_LABEL = "phone_call_label_test";
const WHATSAPP_LABEL = "whatsapp_label_test";

/** The seven keys of CTA_EVENTS in lib/analytics.ts. Hard-coded rather than
 *  imported because that module pulls in posthog-js and an "@/" alias, neither
 *  of which belongs in a Playwright process; a value rendered in markup that is
 *  missing here fires nothing at all, which is exactly the silent failure this
 *  sweep exists to catch. */
const CTA_KEYS = ["phone", "whatsapp", "book_anchor", "nav", "menu", "email", "photo"] as const;

const TYPED = {
  name: "Jane Smith",
  phone: "07700900123",
  email: "jane.smith@example.com",
  postcode: "CB1 2AB",
  details: "Water is coming through the kitchen ceiling",
} as const;

function published(): readonly string[] {
  return allRoutes;
}

function isPublished(path: string): boolean {
  return allRoutes.includes(path);
}

/** The first published path out of the candidates, or null. */
function firstPublished(...candidates: string[]): string | null {
  return candidates.find(isPublished) ?? null;
}

/** Installs the whole harness, lands, and waits for the first pageview so every
 *  test is comparing like with like. Third parties are blocked first so the
 *  recorders registered afterwards take precedence. */
async function land(page: Page, url: string): Promise<IngestRecorder> {
  await blockThirdParties(page);
  await blockGoogleTag(page);
  const rec = await recordIngest(page);
  await gotoOk(page, url);
  await rec.waitFor("$pageview");
  return rec;
}

/** The full booking form on the first published page that has one. */
async function openBookingForm(page: Page): Promise<string> {
  const path = firstPublished("/services/emergency-plumbing", "/");
  test.skip(path === null, "no page carrying the full booking form is published yet");
  return path as string;
}

async function requireForm(page: Page): Promise<void> {
  const form = page.locator("section#book form");
  test.skip(
    (await form.count()) === 0,
    "the published page has no <form> inside section#book yet",
  );
}

/**
 * The FULL form's submit button, scoped to `section#book`.
 *
 * FORM_COPY.full.submit and FORM_COPY.inline.submit are the same words, "Ask us
 * to ring you", and a service page legitimately carries both the hero callback
 * card and the full booking form. An unscoped getByRole therefore matches two
 * buttons and trips strict mode. The page is right; the locator was not.
 */
function bookingSubmit(page: Page): Locator {
  return page.locator("section#book").getByRole("button", { name: FORM_COPY.full.submit });
}

async function fillBooking(page: Page): Promise<void> {
  await page.fill("#f-phone", TYPED.phone);
  await page.fill("#f-postcode", TYPED.postcode);
  await page.fill("#f-name", TYPED.name);
  if (await page.locator("#f-details").count()) await page.fill("#f-details", TYPED.details);
}

// ─── Pageviews ───────────────────────────────────────────────────────────────

test.describe("pageviews", () => {
  test("a $pageview reaches PostHog on load", async ({ page }) => {
    const rec = await land(page, "/");
    expect(rec.named("$pageview").length, "no pageview reached PostHog").toBeGreaterThan(0);
  });

  test("a client-side navigation produces a SECOND pageview", async ({ page }) => {
    // The failure this guards is specific and silent: posthog.init() run at
    // module load keeps a reference to the pushState Next patched during
    // hydration, so every page after the first goes unreported and the site
    // looks like it has a 100% bounce rate.
    const paths = published().filter((p) => p !== "/");
    test.skip(
      paths.length === 0,
      "only the home page is published, so there is no second page to navigate to",
    );

    const rec = await land(page, "/");
    // The first published path with a link a visitor can actually see. `:visible` matters: the
    // first /services link in the DOM sits in the closed Services drop-down, which is in the
    // HTML for crawlers and cannot be clicked until it is opened.
    let link = page.locator("a[href='/__none__']");
    for (const candidate of paths) {
      const visible = page.locator(`a[href="${candidate}"]:visible`).first();
      if ((await visible.count()) > 0) {
        link = visible;
        break;
      }
    }
    test.skip((await link.count()) === 0, "no visible internal link on the home page to click yet");

    await link.click();
    await expect
      .poll(() => rec.named("$pageview").length, {
        message: "a client-side navigation produced no second pageview",
        timeout: 10_000,
      })
      .toBeGreaterThan(1);
  });
});

// ─── Click ids ───────────────────────────────────────────────────────────────

test.describe("click ids", () => {
  test("landing with a click id writes the agreed record, before any interaction", async ({
    page,
  }) => {
    await land(page, "/?gclid=landing_gclid&gbraid=landing_gbraid&wbraid=landing_wbraid");
    await settle(page, 1500);

    const store = await readDeviceStorage(page);
    expect(store.localStorage, "no click id record was written on landing").toContain(
      CLICK_ID_STORAGE_KEY,
    );

    const parsed = await page.evaluate((key) => {
      try {
        return JSON.parse(localStorage.getItem(key) ?? "{}") as {
          ids?: Record<string, string>;
          ts?: number;
        };
      } catch {
        return {};
      }
    }, CLICK_ID_STORAGE_KEY);

    expect(parsed.ids?.gclid).toBe("landing_gclid");
    expect(parsed.ids?.gbraid).toBe("landing_gbraid");
    expect(parsed.ids?.wbraid).toBe("landing_wbraid");
    expect(parsed.ids?.landing_page).toBe("/");
    expect(typeof parsed.ts, "no timestamp, so the 90-day window cannot be enforced").toBe("number");
  });

  test("the record survives a full reload", async ({ page }) => {
    await land(page, "/?gclid=reload_gclid");
    await settle(page, 1500);
    await gotoOk(page, "/");
    await settle(page, 1000);

    const gclid = await page.evaluate((key) => {
      try {
        return (JSON.parse(localStorage.getItem(key) ?? "{}") as { ids?: { gclid?: string } }).ids
          ?.gclid;
      } catch {
        return undefined;
      }
    }, CLICK_ID_STORAGE_KEY);
    expect(gclid, "a plain internal visit wiped the stored click id").toBe("reload_gclid");
  });

  test("no click id is ever appended to a link on the page", async ({ page }) => {
    // Decorated internal links split PostHog sessions, poison the canonical
    // URL a crawler sees and leak the identifier into anything that copies a
    // link. The id belongs in storage and on the booking payload, nowhere else.
    await land(page, "/?gclid=no_decoration&gbraid=no_decoration_b&wbraid=no_decoration_w");
    await settle(page, 1500);

    const decorated = await page.$$eval("a[href]", (nodes) =>
      nodes
        .map((n) => (n as HTMLAnchorElement).getAttribute("href") ?? "")
        .filter((href) => /[?&](gclid|gbraid|wbraid)=/.test(href)),
    );
    expect(decorated, "a link was decorated with the click id").toEqual([]);
  });

  test("the click ids reach /api/book, so a job can be reported back to Google", async ({
    page,
  }) => {
    const path = await openBookingForm(page);
    await blockThirdParties(page);
    await blockGoogleTag(page);
    const posted = await stubBookingApi(page, 200);
    await gotoOk(page, `${path}?gclid=trace_me&wbraid=trace_wbraid`);
    await requireForm(page);

    await fillBooking(page);
    await bookingSubmit(page).click();
    await expect.poll(() => posted.length, { timeout: 15_000 }).toBeGreaterThan(0);

    expect(posted[0].fields.gclid).toBe("trace_me");
    expect(posted[0].fields.wbraid).toBe("trace_wbraid");
    expect(posted[0].fields.landing_page).toBe(path);
  });

  test("a record written by the OLD build is still read and still sent", async ({ page }) => {
    // The storage key is deliberately unchanged from the previous site, so a
    // visitor who clicked an ad before the relaunch still holds an unexpired
    // record — in the old shape, with landing_page a level up. Dropping it
    // would throw away up to 90 days of live attribution on switchover day.
    const path = await openBookingForm(page);
    await blockThirdParties(page);
    await blockGoogleTag(page);
    await page.addInitScript(
      ([key, value]) => {
        try {
          localStorage.setItem(key, value);
        } catch {
          /* private mode */
        }
      },
      [
        CLICK_ID_STORAGE_KEY,
        JSON.stringify({ ids: { gclid: "legacy_gclid" }, landing_page: "/old-landing", ts: Date.now() }),
      ] as const,
    );
    const posted = await stubBookingApi(page, 200);
    // No click id on this URL, so nothing overwrites the seeded record.
    await gotoOk(page, path);
    await requireForm(page);

    await fillBooking(page);
    await bookingSubmit(page).click();
    await expect.poll(() => posted.length, { timeout: 15_000 }).toBeGreaterThan(0);

    expect(posted[0].fields.gclid, "a pre-relaunch click id was thrown away").toBe("legacy_gclid");
    expect(posted[0].fields.landing_page, "the old top-level landing_page was not read").toBe(
      "/old-landing",
    );
  });
});

// ─── Page context on every hand-written event ────────────────────────────────

test.describe("page context", () => {
  test("events on the home page carry page_type", async ({ page }) => {
    const rec = await land(page, "/");
    const cta = page.locator('a[data-cta="phone"]').first();
    test.skip((await cta.count()) === 0, 'the home page has no a[data-cta="phone"] yet');

    await cta.click({ force: true, noWaitAfter: true });
    const ev = await rec.waitFor("phone_call_click");
    expect(ev.properties.page_type).toBe("home");
    expect(ev.properties.cta_location, "cta_location is missing").toBeTruthy();
  });

  test("events on a service page carry the service", async ({ page }) => {
    const path = firstPublished("/services/emergency-plumbing");
    test.skip(path === null, "/services/emergency-plumbing is not published yet");

    const rec = await land(page, path as string);
    const cta = page.locator('a[data-cta="phone"]').first();
    test.skip((await cta.count()) === 0, `${path} has no a[data-cta="phone"] yet`);

    await cta.click({ force: true, noWaitAfter: true });
    const ev = await rec.waitFor("phone_call_click");
    expect(ev.properties.page_type).toBe("service");
    expect(ev.properties.service).toBe("emergency-plumbing");
  });

  test("events on a town page carry the city", async ({ page }) => {
    const town = published().find((p) => p.startsWith("/areas/"));
    test.skip(town === undefined, "no town page is published yet");

    const rec = await land(page, town as string);
    const cta = page.locator('a[data-cta="phone"]').first();
    test.skip((await cta.count()) === 0, `${town} has no a[data-cta="phone"] yet`);

    await cta.click({ force: true, noWaitAfter: true });
    const ev = await rec.waitFor("phone_call_click");
    expect(ev.properties.page_type).toBe("area");
    expect(ev.properties.city).toBe((town as string).split("/")[2]);
  });

  test("every data-cta in the markup is one the event map knows, and says where it sits", async ({
    page,
  }) => {
    // An unmapped value fires nothing. That is the safe failure and also a
    // silent one: the CTA looks tracked and reports zero for ever.
    const targets = ["/", "/services/emergency-plumbing", "/contact"].filter(isPublished);
    expect(targets.length, "no page to sweep").toBeGreaterThan(0);

    for (const path of targets) {
      await blockThirdParties(page);
      await gotoOk(page, path);
      const found = await page.$$eval("[data-cta]", (nodes) =>
        nodes.map((n) => ({
          cta: n.getAttribute("data-cta") ?? "",
          location: n.getAttribute("data-cta-location") ?? "",
          text: (n.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 40),
        })),
      );

      for (const el of found) {
        expect(
          CTA_KEYS as readonly string[],
          `${path}: data-cta="${el.cta}" on "${el.text}" has no entry in CTA_EVENTS, so every ` +
            "click on it is lost",
        ).toContain(el.cta);
        expect(
          el.location,
          `${path}: data-cta="${el.cta}" on "${el.text}" has no data-cta-location, so the ` +
            "report cannot say which placement earned the call",
        ).not.toBe("");
      }
    }
  });
});

// ─── Opening a menu is not a navigation ──────────────────────────────────────

test.describe("menus versus navigations", () => {
  // The desktop drop-down is in the HTML at every width, for crawlers, but is only visible
  // and clickable above the 768px nav breakpoint.
  test.use({ viewport: { width: 1280, height: 800 } });

  test("the desktop Services button reports a menu_toggle and never a nav_click", async ({
    page,
  }) => {
    // The button opens a panel and goes nowhere. Counting it as a navigation
    // inflated nav_click, which is the report the business reads to see which
    // pages people actually go to.
    const rec = await land(page, "/");
    const button = page.locator('header button[aria-controls="header-services"]');
    test.skip((await button.count()) === 0, "the header has no Services drop-down button yet");

    await button.click();

    const ev = await rec.waitFor("menu_toggle");
    expect(ev.properties.cta).toBe("menu");
    expect(ev.properties.cta_location, "cta_location is missing").toBeTruthy();

    // Negative assertion, so a fixed moment rather than a wait for something:
    // posthog-js batches, and nav_click would arrive in the same flush.
    await settle(page, 800);
    expect(
      rec.named("nav_click"),
      "opening the Services menu was still counted as a navigation",
    ).toHaveLength(0);
  });
});

// ─── The booking form's lifecycle ────────────────────────────────────────────

test.describe("form lifecycle", () => {
  test("start, submit and success fire in that order, each carrying the form_id", async ({
    page,
  }) => {
    const path = await openBookingForm(page);
    await blockThirdParties(page);
    await blockGoogleTag(page);
    const rec = await recordIngest(page);
    await stubBookingApi(page, 200);
    await gotoOk(page, path);
    await rec.waitFor("$pageview");
    await requireForm(page);

    await page.focus("#f-phone");
    const start = await rec.waitFor("booking_form_start");
    expect(start.properties.form_id, "booking_form_start carries no form_id").toBeTruthy();
    const formId = String(start.properties.form_id);
    expect(formId, "the form_id is not one of the agreed shapes").toMatch(/_booking$/);

    await fillBooking(page);
    await bookingSubmit(page).click();

    const submit = await rec.waitFor("booking_form_submit");
    expect(submit.properties.form_id).toBe(formId);
    expect(typeof submit.properties.photo_count).toBe("number");

    const success = await rec.waitFor("booking_form_success");
    expect(success.properties.form_id).toBe(formId);
    expect(success.properties.http_status, "the HTTP status is not on the outcome event").toBe(200);

    const order = rec.events
      .map((e) => e.event)
      .filter((n) => n.startsWith("booking_form_"));
    expect(order.indexOf("booking_form_start")).toBeLessThan(order.indexOf("booking_form_submit"));
    expect(order.indexOf("booking_form_submit")).toBeLessThan(
      order.indexOf("booking_form_success"),
    );
    expect(order, "a completed booking was also counted as an abandonment").not.toContain(
      "booking_form_abandon",
    );
  });

  test("a failed booking is an error event carrying the status, not a success", async ({ page }) => {
    const path = await openBookingForm(page);
    await blockThirdParties(page);
    await blockGoogleTag(page);
    const rec = await recordIngest(page);
    await stubBookingApi(page, 500);
    await gotoOk(page, path);
    await rec.waitFor("$pageview");
    await requireForm(page);

    await fillBooking(page);
    await bookingSubmit(page).click();

    const err = await rec.waitFor("booking_form_error");
    expect(
      err.properties.http_status,
      "without the status a 422 is indistinguishable from a messaging outage",
    ).toBe(500);
    expect(rec.named("booking_form_success"), "a failure was reported as a success").toHaveLength(0);
  });

  test("no event property carries anything the customer typed", async ({ page }) => {
    // identifyUser() sends the name, phone and email to PostHog on purpose
    // (section 8.4, the owner's decision), and after an identify the person
    // reference travels on distinct_id. Everything ELSE is behaviour and must
    // stay clean: PostHog is not where a lead is kept.
    const path = await openBookingForm(page);
    await blockThirdParties(page);
    await blockGoogleTag(page);
    const rec = await recordIngest(page);
    await stubBookingApi(page, 200);
    await gotoOk(page, path);
    await rec.waitFor("$pageview");
    await requireForm(page);

    await fillBooking(page);
    if (await page.locator("#f-email").count()) await page.fill("#f-email", TYPED.email);
    await bookingSubmit(page).click();
    await rec.waitFor("booking_form_success");
    await settle(page, 2000);

    const dump = JSON.stringify(behaviourProperties(rec.events));
    for (const [field, value] of Object.entries(TYPED)) {
      expect(dump, `the typed ${field} appears in a PostHog event property`).not.toContain(value);
    }
    expect(dump, "the full postcode appears in a PostHog event property").not.toContain("CB12AB");
    expect(dump).not.toContain("+447700900123");
  });
});

// ─── What reaches Google ─────────────────────────────────────────────────────

test.describe("what reaches Google", () => {
  test("a phone tap fires the TAP conversion and never the duration-qualified call action", async ({
    page,
  }) => {
    // This is the correction the account needs: the live build fires the call
    // action on every tel: tap, Count = Every, Primary. One frustrated mobile
    // user then registers many "calls", and bidding is trained on nothing.
    await land(page, "/");
    const cta = page.locator('a[data-cta="phone"]').first();
    test.skip((await cta.count()) === 0, 'no a[data-cta="phone"] on the home page yet');

    await cta.click({ force: true, noWaitAfter: true });
    await settle(page, 800);

    const conversions = await conversionCalls(page);
    const tap = conversions.find((c) => String(c.send_to).endsWith(`/${PHONE_TAP_LABEL}`));
    expect(tap, "a phone tap sent no Google Ads conversion at all").toBeTruthy();
    expect(String(tap!.send_to)).toContain(AW_TEST_ID);
    expect(
      conversions.filter((c) => String(c.send_to).endsWith(`/${PHONE_CALL_LABEL}`)),
      "a tap was reported against the duration-qualified call action",
    ).toHaveLength(0);
    expect(
      await userDataCalls(page),
      "personal data was handed to Google on a tap, which carries no lead",
    ).toEqual([]);
  });

  test("a WhatsApp tap fires its own conversion", async ({ page }) => {
    const path = firstPublished("/services/emergency-plumbing", "/");
    test.skip(path === null, "no page with a WhatsApp CTA is published yet");
    await land(page, path as string);

    const cta = page.locator('a[data-cta="whatsapp"]').first();
    test.skip((await cta.count()) === 0, `no a[data-cta="whatsapp"] on ${path} yet`);

    await cta.click({ force: true, noWaitAfter: true });
    await settle(page, 800);

    const conversions = await conversionCalls(page);
    expect(
      conversions.find((c) => String(c.send_to).endsWith(`/${WHATSAPP_LABEL}`)),
      "a WhatsApp tap sent no Google Ads conversion",
    ).toBeTruthy();
    expect(
      conversions.filter((c) => String(c.send_to).endsWith(`/${PHONE_CALL_LABEL}`)),
      "a WhatsApp tap was reported against the call action",
    ).toHaveLength(0);
  });

  test("a completed booking fires the booking conversion once, AFTER the hashed identifiers", async ({
    page,
  }) => {
    const path = await openBookingForm(page);
    await blockThirdParties(page);
    await blockGoogleTag(page);
    await stubBookingApi(page, 200);
    await gotoOk(page, path);
    await requireForm(page);

    await fillBooking(page);
    if (await page.locator("#f-email").count()) await page.fill("#f-email", TYPED.email);
    await bookingSubmit(page).click();
    await expect(page.getByText(FORM_COPY.full.successHeading)).toBeVisible({ timeout: 20_000 });
    await settle(page, 1500);

    const calls = await dataLayer(page);
    const userDataAt = calls.findIndex((a) => a[0] === "set" && a[1] === "user_data");
    const bookingIndexes = calls
      .map((a, i) => ({ a, i }))
      .filter(
        ({ a }) =>
          a[0] === "event" &&
          a[1] === "conversion" &&
          String((a[2] as Record<string, unknown> | undefined)?.send_to ?? "").endsWith(
            `/${BOOKING_LABEL}`,
          ),
      )
      .map(({ i }) => i);

    expect(bookingIndexes.length, "the booking conversion did not fire exactly once").toBe(1);
    expect(userDataAt, "no enhanced conversion data was set").toBeGreaterThanOrEqual(0);
    expect(
      userDataAt,
      "the conversion fired before the identifiers were attached, so it went without them",
    ).toBeLessThan(bookingIndexes[0]);

    const ud = await userDataCalls(page);
    const data = ud[ud.length - 1];
    const address = (data.address ?? {}) as Record<string, unknown>;
    expect(String(data.sha256_phone_number), "the phone is not a sha256 hex digest").toMatch(
      /^[0-9a-f]{64}$/,
    );
    expect(String(address.sha256_first_name)).toMatch(/^[0-9a-f]{64}$/);
    expect(String(address.sha256_last_name)).toMatch(/^[0-9a-f]{64}$/);
    // Hashing the postcode or the country matches nothing at Google's end.
    expect(address.postal_code).toBe(TYPED.postcode);
    expect(address.country).toBe("GB");

    const dump = JSON.stringify(calls);
    expect(dump, "the raw phone number was handed to Google").not.toContain(TYPED.phone);
    expect(dump, "the raw phone number was handed to Google").not.toContain("+447700900123");
    expect(dump, "the raw name was handed to Google").not.toContain("Jane");
    expect(dump, "the raw email was handed to Google").not.toContain(TYPED.email);
  });

  test("the Google tag is a real <script> in the SERVED head, with both config lines", async ({
    request,
  }) => {
    // 17 September: Ads diagnostics reported "missing Google tag" while the tag
    // loaded fine for visitors, because next/script put only a preload link in
    // the HTML. The checker reads the initial <head>, so the assertion is made
    // on fetched HTML and deliberately NOT on the DOM.
    const html = await (await request.get("/")).text();
    const head = html.split("<body")[0];

    expect(head, "no gtag.js <script src> element in the served <head>").toMatch(
      new RegExp(
        `<script[^>]*src="https://www\\.googletagmanager\\.com/gtag/js\\?id=${AW_TEST_ID}"`,
      ),
    );
    expect(head, "the loader is not async, so it blocks the first render").toMatch(
      /<script[^>]*\basync\b[^>]*googletagmanager\.com\/gtag\/js/,
    );
    expect(head).toContain("window.dataLayer=window.dataLayer||[]");
    // Quote-agnostic: lib/gtag.ts JSON-encodes every interpolated value.
    expect(head, "the Ads account is not configured in the served head").toMatch(
      new RegExp(`gtag\\('config',\\s*['"]${AW_TEST_ID}['"]`),
    );
    expect(
      head,
      "allow_enhanced_conversions is absent, so the hashed identifiers are discarded",
    ).toContain("allow_enhanced_conversions");
    expect(head, "the GA4 property is not configured on the shared tag").toMatch(
      new RegExp(`gtag\\('config',\\s*['"]${GA4_ID}['"]`),
    );
  });

  test("the call conversion is wired as a number swap, never as a tap", async ({ request }) => {
    const html = await (await request.get("/")).text();
    expect(html, "the website call conversion is not configured at all").toContain(
      "phone_conversion_number",
    );
    expect(html).toContain(PHONE_CALL_LABEL);
    const match = /phone_conversion_number:\s*['"]([^'"]+)['"]/.exec(html);
    expect(match, "no phone_conversion_number value in the served HTML").toBeTruthy();
    expect(
      match![1].replace(/\D/g, ""),
      "the swap points at a different number from the one on the page",
    ).toBe(TEST_CALL_NUMBER.replace(/\D/g, ""));
  });
});

// ─── Coverage checker ────────────────────────────────────────────────────────

test.describe("postcode check", () => {
  test("reports the district and never the full postcode", async ({ page }) => {
    // Contract: the coverage widget's wrapper carries data-postcode-check. Its input id comes
    // from useId() so two checkers can share a page, so the input is found inside the wrapper.
    const path = firstPublished("/", "/areas-we-cover", "/services/emergency-plumbing");
    test.skip(path === null, "no page that could carry the coverage checker is published yet");

    const rec = await land(page, path as string);
    const widget = page.locator("[data-postcode-check]").first();
    test.skip(
      (await widget.count()) === 0,
      `${path} has no [data-postcode-check] widget yet`,
    );

    await widget.locator("input").first().fill(TYPED.postcode);
    await widget.getByRole("button").first().click();

    const ev = await rec.waitFor("postcode_check");
    expect(ev.properties.district, "the district is missing").toBe("CB1");
    expect(ev.properties.result, "the verdict is missing").toBeTruthy();
    const dump = JSON.stringify(ev.properties);
    expect(dump, "a full postcode reached the analytics; the district is what is needed").not.toContain(
      TYPED.postcode,
    );
    expect(dump).not.toContain("CB12AB");
  });
});

// ─── The privacy notice must describe the build ──────────────────────────────

test.describe("the privacy notice matches what was actually built", () => {
  test("it names every tool, the transfer and the storage period", async ({ page }) => {
    test.skip(!isPublished("/privacy"), "/privacy is not published yet");
    await blockThirdParties(page);
    await gotoOk(page, "/privacy");
    const text = (await page.locator("main").innerText()).toLowerCase();

    for (const required of [
      "posthog",
      "united states",
      "session recording",
      "google ads",
      "google analytics",
      "telegram",
      "90 days",
    ]) {
      expect(text, `the notice does not mention ${required}`).toContain(required);
    }
  });

  test("it does not claim a consent choice this site never offers", async ({ page }) => {
    test.skip(!isPublished("/privacy"), "/privacy is not published yet");
    await blockThirdParties(page);
    await gotoOk(page, "/privacy");
    const text = (await page.locator("main").innerText()).toLowerCase();

    // Note the asymmetry on purpose: saying "there is no cookie banner" is
    // exactly right, so the banned strings are the ones that claim consent IS
    // collected, not the word "banner".
    for (const banned of [
      "reject non-essential",
      "accept all cookies",
      "consent mode",
      "we ask for your consent",
      "by continuing you consent",
      "before you answer the banner",
      "manage your cookie preferences",
    ]) {
      expect(text, `the notice describes "${banned}", which this build does not do`).not.toContain(
        banned,
      );
    }
  });
});
