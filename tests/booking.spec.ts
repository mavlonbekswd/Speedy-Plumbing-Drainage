import { test, expect, type Locator, type Page } from "@playwright/test";
import zlib from "node:zlib";
import { MOCK_TELEGRAM_PORT } from "../playwright.config";
import { startMockTelegram, type MockTelegram, type MockTelegramCall } from "./mockTelegram";
import { FORM_COPY } from "../lib/claims";
import { isOutOfHoursUK } from "../lib/hours";
import { allRoutes, blockThirdParties, gotoOk, TEST_CALL_NUMBER } from "./utils";

// The booking path, end to end, against a local mock standing in for
// api.telegram.org.
//
// There is no database on this site. The Telegram message IS the lead record,
// so "the booking worked" can only mean: the browser posted, the route
// validated, Telegram accepted, and the customer was told so — in that order,
// with the customer told nothing until Telegram had it.
//
// What this file CANNOT prove, and nothing automated can: that the
// TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in the live project are the client's
// own and that the message lands in the client's group. That needs a real
// message sent to real people and is Maher's to confirm. The mock is reached
// only through TELEGRAM_API_BASE, which playwright.config.ts sets and which
// lib/telegram.ts ignores outright when VERCEL_ENV === "production".

test.describe.configure({ mode: "serial" });

let mock: MockTelegram;

test.beforeAll(async () => {
  mock = await startMockTelegram(MOCK_TELEGRAM_PORT);
});

test.afterAll(async () => {
  await mock.close();
});

test.beforeEach(() => {
  mock.reset();
});

const LEAD = { name: "Jane Smith", phone: "07700900123", postcode: "CB1 2AB" };

/** The phone as lib/telegram.ts writes it: normalised to digits by the schema,
 *  then E.164 so the group can tap it straight through to a call. */
const LEAD_E164 = "+447700900123";

// From tests/utils.ts, not process.env: the runner does not receive the
// webServer env, so reading it here would compare against a developer's own.
const CALL_DIGITS = TEST_CALL_NUMBER.replace(/\D/g, "").replace(/^(?:0044|44|0)/, "");

/** The message text. The mock parses a body only for application/json, which is
 *  what lib/telegram.ts sends for sendMessage. */
function textOf(call: MockTelegramCall): string {
  const text = call.body?.text;
  return typeof text === "string" ? text : "";
}

function methods(): string[] {
  return mock.calls.map((c) => c.method);
}

function firstMessage(): string {
  const call = mock.calls.find((c) => c.method === "sendMessage");
  expect(call, `no sendMessage reached Telegram; saw ${JSON.stringify(methods())}`).toBeTruthy();
  return textOf(call!);
}

function isPublished(path: string): boolean {
  return allRoutes.includes(path);
}

// ─── The route on its own, on the wire ───────────────────────────────────────
//
// These go through the `request` fixture rather than a page: they are about
// what the server does with a request, and a browser in the middle would only
// add ways for the test to be wrong.

test.describe("POST /api/book", () => {
  test("a bad phone and a bad postcode are rejected with 422 before Telegram is touched", async ({
    request,
    baseURL,
  }) => {
    const badPhone = await request.post("/api/book", {
      headers: { origin: baseURL! },
      multipart: { ...LEAD, phone: "abc" },
    });
    expect(badPhone.status()).toBe(422);
    const phoneBody = (await badPhone.json()) as { error?: string; fields?: string[] };
    expect(phoneBody.fields, "the 422 must name the field that is wrong").toContain("phone");

    const badPostcode = await request.post("/api/book", {
      headers: { origin: baseURL! },
      multipart: { ...LEAD, postcode: "NOTAPOSTCODE" },
    });
    expect(badPostcode.status()).toBe(422);
    const postcodeBody = (await badPostcode.json()) as { error?: string; fields?: string[] };
    expect(postcodeBody.fields).toContain("postcode");

    expect(
      mock.calls.length,
      "an invalid submission reached the business group; validation is running too late",
    ).toBe(0);
  });

  test("a cross-origin post gets a normal-looking 200 and reaches nobody", async ({ request }) => {
    const res = await request.post("/api/book", {
      headers: { origin: "https://not-our-site.example" },
      multipart: LEAD,
    });
    // A bot must not be able to tell that it was filtered.
    expect(res.status()).toBe(200);
    expect((await res.json()).ok).toBe(true);
    expect(mock.calls.length, "a cross-origin submission reached the group").toBe(0);
  });

  test("a filled honeypot gets the same 200 and reaches nobody", async ({ request, baseURL }) => {
    const res = await request.post("/api/book", {
      headers: { origin: baseURL! },
      multipart: { ...LEAD, website: "http://spam.example" },
    });
    expect(res.status()).toBe(200);
    expect(mock.calls.length, "a honeypot submission reached the group").toBe(0);
  });

  test("a name that looks like HTML arrives escaped, not as markup", async ({
    request,
    baseURL,
  }) => {
    // The message is sent with parse_mode HTML. An unescaped "<b>" would at
    // best mangle the message and at worst fail the send outright, losing the
    // lead to a customer whose surname contains an ampersand.
    const res = await request.post("/api/book", {
      headers: { origin: baseURL! },
      multipart: { ...LEAD, name: "<b>x</b>" },
    });
    expect(res.status()).toBe(200);

    const text = firstMessage();
    expect(text).toContain("&lt;b&gt;x&lt;/b&gt;");
    expect(text, "raw markup from a customer reached the group unescaped").not.toContain("<b>x</b>");
  });

  test("the message header is one of the two the group can receive, and is the first line", async ({
    request,
    baseURL,
  }) => {
    // OOH_ALERT_FORCE is a server-side variable and cannot be flipped from
    // here, and isOutOfHoursUK() is clock-dependent, so this pins the two
    // shapes rather than the machine's local time — plus the one implication
    // that holds either way: out of hours, the header MUST be the loud one.
    const res = await request.post("/api/book", { headers: { origin: baseURL! }, multipart: LEAD });
    expect(res.status()).toBe(200);

    const text = firstMessage();
    const header = text.split("\n")[0];
    expect(["NEW BOOKING", "OUT-OF-HOURS BOOKING"]).toContain(header);
    if (isOutOfHoursUK()) {
      expect(
        header,
        "a 3am booking was not marked out of hours, so nobody is notified in a muted group",
      ).toBe("OUT-OF-HOURS BOOKING");
    }
  });

  test("the lead itself, every field of it, reaches the group", async ({ request, baseURL }) => {
    const res = await request.post("/api/book", {
      headers: { origin: baseURL! },
      multipart: {
        ...LEAD,
        email: "jane@example.com",
        service: "emergency-plumbing",
        urgency: "emergency",
        details: "Water through the kitchen ceiling",
        contactMethod: "phone",
        form_id: "emergency-plumbing_booking",
        gclid: "TESTGCLID123",
        landing_page: "/services/emergency-plumbing",
      },
    });
    expect(res.status()).toBe(200);

    const text = firstMessage();
    expect(text).toContain(`<b>Name:</b> ${LEAD.name}`);
    expect(text, "the phone must be E.164 so the group can tap it").toContain(
      `<b>Phone:</b> ${LEAD_E164}`,
    );
    expect(text).toContain(`<b>Postcode:</b> ${LEAD.postcode}`);
    expect(text).toContain("<b>Email:</b> jane@example.com");
    expect(text).toContain("<b>Form:</b> emergency-plumbing_booking");
    expect(text, "without the click id VALUE this lead can never be reported to Google").toContain(
      "<b>Click id:</b> gclid TESTGCLID123",
    );
    expect(text).toContain("<b>Landed on:</b> /services/emergency-plumbing");
    expect(text).toContain("<b>Photos:</b> 0");
  });

  test("a text file wearing a .jpg name is dropped, and the lead still goes through", async ({
    request,
    baseURL,
  }) => {
    // The declared MIME type and the filename are both attacker-chosen, so the
    // route sniffs the bytes. A photo is a nice-to-have; the lead is not.
    const res = await request.post("/api/book", {
      headers: { origin: baseURL! },
      multipart: {
        ...LEAD,
        photos: {
          name: "definitely-a-photo.jpg",
          mimeType: "image/jpeg",
          buffer: Buffer.from("this is not an image, it is a sentence"),
        },
      },
    });
    expect(res.status()).toBe(200);
    expect((await res.json()).photos_dropped).toBe(1);

    expect(methods(), "a file that is not an image was forwarded to Telegram").toEqual([
      "sendMessage",
    ]);
  });

  test("a photo Telegram refuses is reported as not received, and the lead still goes through", async ({
    request,
    baseURL,
  }) => {
    // Found on the live test of 19 Sept 2026: Telegram took the text and refused the image, and
    // the customer was told everything had arrived. The lead is safe, so it is still a 200, but
    // the count has to go back so the form can say the photo did not make it.
    mock.setFailure("sendPhoto", 400);
    const res = await request.post("/api/book", {
      headers: { origin: baseURL! },
      multipart: {
        ...LEAD,
        photos: {
          name: "leak.jpg",
          mimeType: "image/jpeg",
          buffer: Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(256)]),
        },
      },
    });
    expect(res.status(), "a lead that landed was reported as lost").toBe(200);
    expect((await res.json()).photos_dropped, "a refused photo was reported as delivered").toBe(1);
    expect(methods()[0]).toBe("sendMessage");
    mock.setFailure(null, 200);
  });

  test("when Telegram will not take it, the route says 500 rather than inventing a success", async ({
    request,
    baseURL,
  }) => {
    mock.setFailure("sendMessage", 500);
    const res = await request.post("/api/book", { headers: { origin: baseURL! }, multipart: LEAD });
    expect(res.status(), "a lead nobody will ever see was reported as delivered").toBe(500);
    // One attempt plus the single retry in lib/telegram.ts.
    expect(
      mock.calls.filter((c) => c.method === "sendMessage").length,
      "the one retry did not happen",
    ).toBe(2);
    mock.setFailure(null, 200);
  });
});

// ─── The rate limiter ────────────────────────────────────────────────────────

test.describe("rate limiting", () => {
  test("the sliding window is exercised directly", async () => {
    // BOOK_RATE_LIMIT_MAX is 1000 for the suite, deliberately: every other
    // spec in this repo posts bookings, and a real limit would make them fail
    // in whatever order they happened to run. So the limiter would have to be
    // proved as a unit — except that lib/rateLimit.ts opens with
    // `import "server-only"`, whose Node entry point throws on import, so it
    // cannot be pulled into a Playwright test at all.
    //
    // Left as a stated gap rather than a deleted one: the honest cover for it
    // is a Vercel Firewall rate-limit rule at the edge, which is where the
    // module's own comment says the real control belongs.
    test.skip(
      true,
      'lib/rateLimit.ts imports "server-only", which throws under Node, so it cannot be ' +
        "unit-tested from Playwright; and BOOK_RATE_LIMIT_MAX=1000 makes it untestable over HTTP",
    );
  });
});

// ─── In a real browser ───────────────────────────────────────────────────────

/** The full booking form, on the first published page that carries one. */
async function openBookingForm(page: Page, query = ""): Promise<string> {
  const path = ["/services/emergency-plumbing", "/"].find(isPublished);
  test.skip(
    path === undefined,
    "neither /services/emergency-plumbing nor / is published yet",
  );
  await blockThirdParties(page);
  await gotoOk(page, `${path}${query}`);
  const form = page.locator("section#book form");
  test.skip(
    (await form.count()) === 0,
    `${path} is published but has no <form> inside section#book yet`,
  );
  return path as string;
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

test.describe("a booking made in a browser", () => {
  test("reaches the group with the lead, the click id and the landing page", async ({ page }) => {
    const path = await openBookingForm(page, "?gclid=TESTGCLID123");

    await page.fill("#f-phone", LEAD.phone);
    await page.fill("#f-postcode", LEAD.postcode);
    await page.fill("#f-name", LEAD.name);
    await page.fill("#f-details", "Water through the kitchen ceiling");
    await bookingSubmit(page).click();

    // The customer is told it worked only once Telegram has accepted it.
    await expect(page.getByText(FORM_COPY.full.successHeading)).toBeVisible();

    expect(methods()).toEqual(["sendMessage"]);
    const text = firstMessage();
    expect(text).toContain(`<b>Name:</b> ${LEAD.name}`);
    expect(text).toContain(`<b>Phone:</b> ${LEAD_E164}`);
    expect(text).toContain(`<b>Postcode:</b> ${LEAD.postcode}`);
    expect(text).toContain("<b>Click id:</b> gclid TESTGCLID123");
    expect(text).toContain(`<b>Landed on:</b> ${path}`);
    expect(text, "the form did not say which form produced the lead").toMatch(
      /<b>Form:<\/b> \S+_booking/,
    );
  });

  test("a Telegram outage shows the error state and a number that dials, not a false success", async ({
    page,
  }) => {
    mock.setFailure("sendMessage", 500);
    await openBookingForm(page);

    await page.fill("#f-phone", LEAD.phone);
    await page.fill("#f-postcode", LEAD.postcode);
    await page.fill("#f-name", LEAD.name);
    await bookingSubmit(page).click();

    const scope = page.locator("section#book");
    await expect(scope.getByRole("alert")).toBeVisible();
    await expect(scope.getByRole("alert")).toContainText(
      FORM_COPY.full.error("\u0000").split("\u0000")[0].trim(),
    );
    const tel = scope.locator('a[href^="tel:"][data-cta-location="form_error"]');
    await expect(tel).toBeVisible();
    expect(((await tel.getAttribute("href")) ?? "").replace(/\D/g, "").endsWith(CALL_DIGITS)).toBe(
      true,
    );
    await expect(page.getByText(FORM_COPY.full.successHeading)).toHaveCount(0);
    mock.setFailure(null, 200);
  });
});

// ─── The photo case ──────────────────────────────────────────────────────────
//
// Two phone-sized photos are what a customer standing over a leak actually
// attaches, and the previous build let 4 x 10 MB through against Vercel's
// ~4.5 MB body cap: two photos 413'd, and the lead and the conversion were
// lost together. The site now compresses in the browser, and the only honest
// proof of that is to measure the bytes the browser put on the wire.
//
// A local `next start` has no 4.5 MB ceiling, so it would happily accept a
// 6 MB body and this test would pass on a build that dies in production. The
// SIZE assertion is therefore the 413 guard, not the status code.

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, "latin1"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([length, body, crc]);
}

/**
 * A real, browser-decodable PNG of roughly `width * height * 3` bytes.
 *
 * Two deliberate choices. The IDAT is deflated at level 0 (stored), so the
 * file is the size of its pixels whatever they are: a compression setting
 * cannot quietly shrink the fixture until the test stops testing anything.
 * And the pixels are a smooth gradient carrying per-pixel noise, so the image
 * is neither a flat colour (which any encoder erases) nor pure static (which
 * no JPEG encoder can shrink, and which would make the fixture, rather than
 * the code under test, decide the result).
 */
function noisyPng(width: number, height: number, seed: number): Buffer {
  const stride = width * 3;
  const raw = Buffer.alloc((stride + 1) * height);
  let rnd = seed >>> 0;
  for (let y = 0; y < height; y++) {
    const rowStart = y * (stride + 1);
    raw[rowStart] = 0; // filter type 0: none
    for (let x = 0; x < width; x++) {
      // xorshift32, so the fixture is deterministic across runs and machines.
      rnd ^= rnd << 13;
      rnd >>>= 0;
      rnd ^= rnd >> 17;
      rnd ^= rnd << 5;
      rnd >>>= 0;
      const jitter = (rnd & 0x1f) - 16;
      const i = rowStart + 1 + x * 3;
      const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
      raw[i] = clamp((x * 255) / width + jitter);
      raw[i + 1] = clamp((y * 255) / height + jitter);
      raw[i + 2] = clamp(((x + y) * 255) / (width + height) + jitter);
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type 2: truecolour RGB
  ihdr[10] = 0; // deflate
  ihdr[11] = 0; // adaptive filtering
  ihdr[12] = 0; // no interlace

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", zlib.deflateSync(raw, { level: 0 })),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

const VERCEL_BODY_CAP = 4.5 * 1024 * 1024;

test.describe("two phone photos", () => {
  test("upload without ever putting more than Vercel's body cap on the wire", async ({ page }) => {
    // ~3 MB each: 1000 x 1000 x 3 bytes, stored uncompressed inside the PNG.
    const photos = [
      { name: "leak-1.png", mimeType: "image/png", buffer: noisyPng(1000, 1000, 0x9e3779b9) },
      { name: "leak-2.png", mimeType: "image/png", buffer: noisyPng(1000, 1000, 0x85ebca6b) },
    ];
    for (const photo of photos) {
      expect(photo.buffer.length, "the fixture is not a realistic phone photo").toBeGreaterThan(
        2.5 * 1024 * 1024,
      );
    }
    expect(
      photos[0].buffer.length + photos[1].buffer.length,
      "the fixture must exceed the cap, or this test proves nothing",
    ).toBeGreaterThan(VERCEL_BODY_CAP);

    await openBookingForm(page);
    const upload = page.locator("#f-photos");
    test.skip((await upload.count()) === 0, "the booking form has no #f-photos control yet");

    const bodySizes: number[] = [];
    page.on("request", (req) => {
      if (req.method() !== "POST" || !req.url().includes("/api/book")) return;
      const buf = req.postDataBuffer();
      // -1 marks "the browser sent a body we could not measure", asserted on
      // below rather than silently treated as zero.
      bodySizes.push(buf ? buf.length : -1);
    });

    await upload.setInputFiles(photos);
    await page.fill("#f-phone", LEAD.phone);
    await page.fill("#f-postcode", LEAD.postcode);
    await page.fill("#f-name", LEAD.name);
    await page.fill("#f-details", "Two photos of the leak under the sink");

    const posted = page.waitForResponse(
      (res) => res.url().includes("/api/book") && res.request().method() === "POST",
      { timeout: 60_000 },
    );
    await bookingSubmit(page).click();
    const response = await posted;

    expect(response.status(), "the upload was rejected").toBe(200);
    expect((await response.json()).photos_dropped, "a photo was dropped on the way").toBe(0);
    await expect(page.getByText(FORM_COPY.full.successHeading)).toBeVisible({ timeout: 30_000 });

    // Exactly one POST: two would mean lib/book.ts took its 413 retry, i.e.
    // the first attempt was too big and the photos were abandoned to save the
    // lead. That is the right fallback and the wrong outcome for this test.
    expect(
      bodySizes.length,
      `expected one POST to /api/book, saw ${bodySizes.length} (a second means a 413 retry)`,
    ).toBe(1);
    expect(
      bodySizes[0],
      "the request body could not be measured, so the size guard proved nothing",
    ).toBeGreaterThan(0);
    expect(
      bodySizes[0],
      `the browser put ${(bodySizes[0] / 1024 / 1024).toFixed(2)} MB on the wire; Vercel ` +
        "rejects anything over 4.5 MB, so in production this lead and its conversion are lost",
    ).toBeLessThan(VERCEL_BODY_CAP);

    // And the photos actually arrived: text first, because the lead is the
    // point and a failed upload must never cost it.
    expect(methods()).toEqual(["sendMessage", "sendMediaGroup"]);
  });
});
