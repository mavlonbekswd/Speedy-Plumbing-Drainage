import { defineConfig, devices } from "@playwright/test";

// A fixed, dedicated port so the suite never collides with a `next dev` server someone already
// has running on 3000. Playwright owns the whole lifecycle (build + start), so the suite is
// self-contained and re-runnable by anyone with no manual server setup at all.
export const PORT = 4123;
export const BASE_URL = `http://127.0.0.1:${PORT}`;

// The port the mock Telegram API binds to (tests/mockTelegram.ts). Exported so the config and
// every spec that stands the mock up can never disagree about it.
export const MOCK_TELEGRAM_PORT = 4124;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  timeout: 30_000,
  expect: { timeout: 8_000 },

  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

  // A REAL production build, not `next dev`, so the verification run is against production
  // behaviour: the served HTML the specs parse is the HTML a crawler gets. The timeout is
  // generous because `next build` has to finish before `next start` can bind the port.
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 240_000,
    stdout: "pipe",
    stderr: "pipe",
    // Deterministic, obviously-fake values. They are pinned under the NEXT_PUBLIC_* names on
    // purpose: next.config.ts prefers NEXT_PUBLIC_* over the legacy VITE_* names, so these
    // always beat whatever a developer happens to have in a local .env.local. Nothing here is
    // a real id, a real key or a real token, and nothing in a test run can reach a real
    // account: the Google and PostHog hosts are blocked in-browser by
    // tests/utils.ts#blockThirdParties, and Telegram is pointed at a local mock.
    env: {
      NEXT_DIST_DIR: ".next-test",
      NEXT_PUBLIC_SITE_URL: BASE_URL,
      NEXT_PUBLIC_CALL_NUMBER: "01223000000",
      NEXT_PUBLIC_POSTHOG_KEY: "phc_test_key_not_real",
      NEXT_PUBLIC_GADS_ID: "AW-000000000",
      NEXT_PUBLIC_GADS_LABEL_BOOKING: "booking_label_test",
      NEXT_PUBLIC_GADS_LABEL_PHONE_TAP: "phone_tap_label_test",
      NEXT_PUBLIC_GADS_LABEL_PHONE_CALL: "phone_call_label_test",
      NEXT_PUBLIC_GADS_LABEL_WHATSAPP: "whatsapp_label_test",
      NEXT_PUBLIC_GA4_ID: "G-TEST000000",
      // TELEGRAM_API_BASE is unset in every real environment. Set here, the booking path posts
      // to tests/mockTelegram.ts instead of api.telegram.org, so the whole path is provable
      // end to end without a message ever reaching the client's group.
      TELEGRAM_BOT_TOKEN: "test-token",
      TELEGRAM_CHAT_ID: "1",
      TELEGRAM_API_BASE: `http://127.0.0.1:${MOCK_TELEGRAM_PORT}`,
      // The rate limiter must not be what fails a parallel suite.
      BOOK_RATE_LIMIT_MAX: "1000",
    },
  },
});
