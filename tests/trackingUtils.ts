import type { Page, Request, Route } from "@playwright/test";
import zlib from "node:zlib";

// The shared measurement harness for tests/tracking.spec.ts and
// tests/forms.spec.ts.
//
// Doctrine: what a tracking test proves is what the browser actually PUT ON
// THE WIRE, never what a component says it did. So the PostHog half is read
// off intercepted requests and the Google half is read off window.dataLayer,
// which is the same surface Google's own Tag Assistant reads.
//
// Nothing here may reach a real third party. Every PostHog request is
// fulfilled locally and every Google host is blocked, so a test run can never
// write to project 614087 or to the Ads account.

/** The fake project key playwright.config.ts sets. Nothing reaches a real project. */
export const PH_TEST_TOKEN = "phc_test_key_not_real";

/** The fake Ads account id playwright.config.ts sets. */
export const AW_TEST_ID = "AW-000000000";

/** The remote-config document a real PostHog project returns. posthog-js holds
 *  its event queue until this resolves, so getting the shape right is what
 *  makes "what reached PostHog" observable at all: a blanket 204 means no
 *  event is ever sent and every assertion about the wire passes vacuously. */
const REMOTE_CONFIG = {
  token: PH_TEST_TOKEN,
  supportedCompression: ["gzip-js"],
  autocapture_opt_out: false,
  captureDeadClicks: false,
  autocaptureExceptions: false,
  surveys: false,
  heatmaps: true,
  sessionRecording: false,
  defaultIdentifiedOnly: true,
  hasFeatureFlags: false,
  siteApps: [],
};

// ─── PostHog ingest capture ──────────────────────────────────────────────────

export interface PhEvent {
  event: string;
  properties: Record<string, unknown>;
  distinct_id?: string;
  $set?: Record<string, unknown>;
  $set_once?: Record<string, unknown>;
}

/**
 * posthog-js POSTs a batch to the proxy. The body is gzip by default
 * (`compression=gzip-js`), falls back to plain JSON, and on older paths to a
 * form-encoded `data=<base64>`. All three shapes are decoded here rather than
 * turning compression off in production code just to make a test easier.
 */
function decodeIngestBody(req: Request): PhEvent[] {
  let buf: Buffer | null = null;
  try {
    buf = req.postDataBuffer();
  } catch {
    return [];
  }
  if (!buf) return [];

  let text: string;
  try {
    text = zlib.gunzipSync(buf).toString("utf8");
  } catch {
    text = buf.toString("utf8");
  }

  if (text.startsWith("data=")) {
    const raw = decodeURIComponent(text.slice(5).replace(/\+/g, " "));
    try {
      text = Buffer.from(raw, "base64").toString("utf8");
    } catch {
      text = raw;
    }
  }

  try {
    const parsed: unknown = JSON.parse(text);
    // posthog-js posts {"api_key":"...","batch":[event, ...]}. Older shapes are
    // a bare array or a single event object; all three are handled so a library
    // upgrade cannot quietly empty this harness.
    const list: unknown[] = Array.isArray(parsed)
      ? parsed
      : Array.isArray((parsed as { batch?: unknown[] } | null)?.batch)
        ? (parsed as { batch: unknown[] }).batch
        : [parsed];
    return list
      .filter((e): e is PhEvent => Boolean(e && typeof e === "object" && "event" in (e as object)))
      .map((e) => ({ ...e, properties: (e.properties ?? {}) as Record<string, unknown> }));
  } catch {
    return [];
  }
}

export interface IngestRecorder {
  /** Every event PostHog actually put on the wire, in order. */
  events: PhEvent[];
  /** Every /ingest/ URL requested, including flags and static assets. */
  urls: string[];
  /** Waits until an event with this name has been sent, or throws after `timeout`. */
  waitFor(name: string, timeout?: number): Promise<PhEvent>;
  named(name: string): PhEvent[];
}

/**
 * Intercepts the same-origin PostHog proxy. Nothing leaves the machine: every
 * request is fulfilled locally, so a test can never write to the real project.
 *
 * NOTE: never wait on networkidle to decide "nothing was sent". posthog-js
 * batches and flushes on a timer, so networkidle passes happily with a full
 * queue. Wait for the event itself (waitFor) or for a deliberate settle().
 */
export async function recordIngest(page: Page): Promise<IngestRecorder> {
  const events: PhEvent[] = [];
  const urls: string[] = [];

  // posthog-js refuses to capture anything when navigator.webdriver is true,
  // and Playwright sets that flag on every page. Without this mask the whole
  // suite would prove only that PostHog drops robots, and every "nothing was
  // sent" assertion would pass for the wrong reason. Nothing in the site's own
  // code is changed by it.
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false, configurable: true });
    // Headless Chromium also advertises "HeadlessChrome" in
    // navigator.userAgentData.brands, which is on posthog-js's blocked-bot
    // list. Present a plain Chromium brand set instead.
    try {
      Object.defineProperty(navigator, "userAgentData", {
        configurable: true,
        get: () => ({
          brands: [
            { brand: "Chromium", version: "140" },
            { brand: "Not;A=Brand", version: "24" },
          ],
          mobile: false,
          platform: "macOS",
          getHighEntropyValues: async () => ({ model: "" }),
        }),
      });
    } catch {
      /* not defined in this browser */
    }
  });

  await page.route("**/ingest/**", async (route: Route) => {
    const req = route.request();
    const url = req.url();
    urls.push(url);

    if (req.method() === "POST" && /\/ingest\/(e|batch|i\/v0\/e)/.test(url)) {
      events.push(...decodeIngestBody(req));
    }

    // Everything below stands in for the PostHog region. The shapes matter:
    // posthog-js holds its queue until remote config resolves.
    if (/\/ingest\/static\//.test(url)) {
      return route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
    }
    if (/\/ingest\/array\/.*\/config\.js/.test(url)) {
      return route.fulfill({
        status: 200,
        contentType: "application/javascript",
        body: `window._POSTHOG_REMOTE_CONFIG = ${JSON.stringify({
          [PH_TEST_TOKEN]: { config: REMOTE_CONFIG, siteApps: [] },
        })};`,
      });
    }
    if (/\/ingest\/array\/.*\/config/.test(url)) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(REMOTE_CONFIG),
      });
    }
    if (/\/ingest\/(flags|decide)/.test(url)) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          featureFlags: {},
          errorsWhileComputingFlags: false,
          sessionRecording: false,
          quotaLimited: [],
        }),
      });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ status: 1 }),
    });
  });

  return {
    events,
    urls,
    named: (name) => events.filter((e) => e.event === name),
    async waitFor(name, timeout = 10_000) {
      const deadline = Date.now() + timeout;
      for (;;) {
        const hit = events.find((e) => e.event === name);
        if (hit) return hit;
        if (Date.now() > deadline) {
          throw new Error(
            `PostHog event "${name}" never arrived. Seen: ` +
              JSON.stringify([...new Set(events.map((e) => e.event))]),
          );
        }
        await page.waitForTimeout(100);
      }
    },
  };
}

// ─── Google ──────────────────────────────────────────────────────────────────

/**
 * Blocks Google's own hosts so no test run can talk to googletagmanager.com,
 * and installs the window.dataLayer spy BEFORE any page script runs.
 *
 * The site's head script does `window.dataLayer = window.dataLayer || []`, so
 * seeding the array here means the real gtag() keeps pushing into it. The push
 * override copies each call into a plain-array mirror, because gtag pushes an
 * `arguments` object and a later `dataLayer = []` (or a gtag.js that rewrites
 * the array) would otherwise lose the record of what was already sent.
 *
 * Returns the (growing) list of blocked Google URLs, so a test can assert that
 * the loader was at least requested.
 */
export async function blockGoogleTag(page: Page): Promise<string[]> {
  const seen: string[] = [];

  await page.addInitScript(() => {
    const w = window as unknown as { dataLayer?: unknown[]; __dlCalls?: unknown[][] };
    const mirror: unknown[][] = [];
    w.__dlCalls = mirror;
    const layer: unknown[] = [];
    const nativePush = Array.prototype.push;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (layer as any).push = function (...items: unknown[]) {
      for (const item of items) {
        try {
          mirror.push(Array.prototype.slice.call(item as ArrayLike<unknown>) as unknown[]);
        } catch {
          mirror.push([item]);
        }
      }
      return nativePush.apply(this, items as never[]);
    };
    w.dataLayer = layer;
  });

  await page.route(
    /googletagmanager\.com|google-analytics\.com|googleads\.g\.doubleclick\.net|googleadservices\.com|google\.com\/(ads|pagead)/,
    (route) => {
      seen.push(route.request().url());
      return route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
    },
  );

  return seen;
}

/** Blocks every third-party host a page might reach, beyond Google's. Kept
 *  separate from blockGoogleTag so a spec can state which one it relies on. */
export async function blockOtherThirdParties(page: Page): Promise<void> {
  await page.route(
    /fonts\.googleapis\.com|fonts\.gstatic\.com|api\.telegram\.org|wa\.me|web\.whatsapp\.com|us\.i\.posthog\.com|us-assets\.i\.posthog\.com/,
    (route) => route.fulfill({ status: 200, contentType: "text/plain", body: "" }),
  );
}

export type DataLayerCall = unknown[];

/** Every gtag() call made so far, in order, each as a plain array. */
export async function dataLayer(page: Page): Promise<DataLayerCall[]> {
  return page.evaluate(() => {
    const w = window as unknown as { dataLayer?: unknown[]; __dlCalls?: unknown[][] };
    if (Array.isArray(w.__dlCalls) && w.__dlCalls.length) return w.__dlCalls;
    // The spy was not installed (or the page replaced the array wholesale):
    // fall back to reading whatever is in dataLayer now.
    return (w.dataLayer ?? []).map(
      (entry) => Array.prototype.slice.call(entry as ArrayLike<unknown>) as unknown[],
    );
  });
}

/** gtag('event','conversion',{send_to}) pushes seen so far. */
export async function conversionCalls(page: Page): Promise<Record<string, unknown>[]> {
  const calls = await dataLayer(page);
  return calls
    .filter((args) => args[0] === "event" && args[1] === "conversion")
    .map((args) => (args[2] ?? {}) as Record<string, unknown>);
}

/** gtag('set','user_data',{...}) pushes seen so far (enhanced conversions). */
export async function userDataCalls(page: Page): Promise<Record<string, unknown>[]> {
  const calls = await dataLayer(page);
  return calls
    .filter((args) => args[0] === "set" && args[1] === "user_data")
    .map((args) => (args[2] ?? {}) as Record<string, unknown>);
}

/** The index of the first gtag call matching a predicate, or -1. Used to prove
 *  ORDER: the hashed identifiers have to be set before the conversion fires, or
 *  the conversion goes without them. */
export async function dataLayerIndexOf(
  page: Page,
  match: (args: unknown[]) => boolean,
): Promise<number> {
  const calls = await dataLayer(page);
  return calls.findIndex(match);
}

// ─── Device storage ──────────────────────────────────────────────────────────

export interface DeviceStorage {
  cookies: string[];
  localStorage: string[];
  sessionStorage: string[];
}

/** Every key written to the visitor's device, from the page's own point of view. */
export async function readDeviceStorage(page: Page): Promise<DeviceStorage> {
  return page.evaluate(() => {
    const keysOf = (s: Storage) => {
      const out: string[] = [];
      try {
        for (let i = 0; i < s.length; i++) {
          const k = s.key(i);
          if (k) out.push(k);
        }
      } catch {
        /* blocked */
      }
      return out.sort();
    };
    const cookies = document.cookie
      ? document.cookie
          .split(";")
          .map((c) => c.split("=")[0].trim())
          .filter(Boolean)
          .sort()
      : [];
    return {
      cookies,
      localStorage: keysOf(window.localStorage),
      sessionStorage: keysOf(window.sessionStorage),
    };
  });
}

/** Give batched senders and effects a fixed moment to have done their worst.
 *  Used only for negative assertions ("nothing was sent"), never to decide that
 *  something positive has happened. */
export async function settle(page: Page, ms = 2500): Promise<void> {
  await page.waitForTimeout(ms);
}

// ─── /api/book stub ──────────────────────────────────────────────────────────

/** One parsed multipart field. Photo parts keep their filename and byte length
 *  but not their bytes: nothing here needs megabytes held in memory. */
export interface PostedBooking {
  /** Text fields, by name. A repeated name keeps the last value. */
  fields: Record<string, string>;
  /** One entry per file part, in order. */
  photos: { filename: string; size: number; contentType: string }[];
  /** The exact number of bytes the browser put on the wire for this request. */
  bodyBytes: number;
  contentType: string;
}

function parseMultipart(buf: Buffer, contentType: string): PostedBooking {
  const result: PostedBooking = { fields: {}, photos: [], bodyBytes: buf.length, contentType };
  const boundaryMatch = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType);
  const boundary = (boundaryMatch?.[1] ?? boundaryMatch?.[2] ?? "").trim();
  if (!boundary) return result;

  const sep = Buffer.from(`--${boundary}`);
  const chunks: Buffer[] = [];
  let from = buf.indexOf(sep);
  while (from !== -1) {
    const next = buf.indexOf(sep, from + sep.length);
    if (next === -1) break;
    // Skip the CRLF after the boundary and the CRLF before the next one.
    chunks.push(buf.subarray(from + sep.length + 2, next - 2));
    from = next;
  }

  for (const chunk of chunks) {
    const headEnd = chunk.indexOf("\r\n\r\n");
    if (headEnd === -1) continue;
    const headers = chunk.subarray(0, headEnd).toString("utf8");
    const body = chunk.subarray(headEnd + 4);
    const name = /name="([^"]*)"/i.exec(headers)?.[1];
    if (!name) continue;
    const filename = /filename="([^"]*)"/i.exec(headers)?.[1];
    if (filename === undefined) {
      result.fields[name] = body.toString("utf8");
    } else {
      result.photos.push({
        filename,
        size: body.length,
        contentType: /content-type:\s*([^\r\n]+)/i.exec(headers)?.[1]?.trim() ?? "",
      });
    }
  }
  return result;
}

/**
 * Stands in for POST /api/book, so the tracking assertions are about tracking
 * rather than about whether the mock Telegram server happens to be listening.
 *
 * lib/book.ts posts multipart/form-data, not JSON: a JSON.parse() stub would
 * record `{}` for every submission and quietly turn "the click ids reached the
 * API" into a test that cannot fail. The body is parsed properly instead.
 *
 * Returns the (growing) list of submissions the browser made.
 */
export async function stubBookingApi(
  page: Page,
  status = 200,
  body?: Record<string, unknown>,
): Promise<PostedBooking[]> {
  const posted: PostedBooking[] = [];

  await page.route("**/api/book", async (route: Route) => {
    const req = route.request();
    const contentType = (await req.allHeaders())["content-type"] ?? "";
    let buf: Buffer | null = null;
    try {
      buf = req.postDataBuffer();
    } catch {
      buf = null;
    }
    if (buf && /multipart\/form-data/i.test(contentType)) {
      posted.push(parseMultipart(buf, contentType));
    } else if (buf) {
      // The inline callback card may post JSON; keep the same shape either way.
      let fields: Record<string, string> = {};
      try {
        const parsed: unknown = JSON.parse(buf.toString("utf8"));
        if (parsed && typeof parsed === "object") {
          fields = Object.fromEntries(
            Object.entries(parsed as Record<string, unknown>).map(([k, v]) => [k, String(v)]),
          );
        }
      } catch {
        /* unparseable: recorded as an empty submission, with its byte count */
      }
      posted.push({ fields, photos: [], bodyBytes: buf.length, contentType });
    } else {
      posted.push({ fields: {}, photos: [], bodyBytes: 0, contentType });
    }

    const payload =
      body ?? (status === 200 ? { ok: true, photos_dropped: 0 } : { error: "stubbed failure" });
    await route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(payload),
    });
  });

  return posted;
}

/** Makes the booking request fail at the transport layer, the way a phone with
 *  no signal does. Distinct from a 500: lib/book.ts reports status 0 for it,
 *  and the customer must still be shown the error state and the number. */
export async function failBookingApi(page: Page): Promise<{ attempts: number }> {
  const state = { attempts: 0 };
  await page.route("**/api/book", async (route: Route) => {
    state.attempts += 1;
    await route.abort("failed");
  });
  return state;
}

/** Counts requests to /api/book without answering them differently from the
 *  server: used by the negative assertions ("an empty submit sends nothing"). */
export async function countBookingRequests(page: Page): Promise<{ count: number }> {
  const state = { count: 0 };
  await page.route("**/api/book", async (route: Route) => {
    state.count += 1;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, photos_dropped: 0 }),
    });
  });
  return state;
}

// ─── PII sweep ───────────────────────────────────────────────────────────────

/**
 * Every PostHog event property that is supposed to describe BEHAVIOUR, with
 * the identity surfaces removed.
 *
 * `identifyUser()` sends the customer's name, phone and email to PostHog on
 * purpose (spec section 8.4, the owner's recorded decision), and after an
 * identify the person reference travels on `distinct_id`. So a naive "no typed
 * value appears anywhere" sweep would fail against a correct build. What must
 * stay clean is everything else: no event PROPERTY may carry a name, a phone,
 * an email, a full postcode or free text the customer typed.
 */
export function behaviourProperties(events: PhEvent[]): Record<string, unknown>[] {
  return events
    .filter((e) => e.event !== "$identify" && e.event !== "$set")
    .map((e) => {
      const props = { ...e.properties };
      for (const key of ["distinct_id", "$anon_distinct_id", "$set", "$set_once", "$user_id"]) {
        delete props[key];
      }
      return props;
    });
}
