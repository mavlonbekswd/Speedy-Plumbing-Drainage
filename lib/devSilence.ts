// `next dev` reads .env.local, which holds the PRODUCTION PostHog key and Google ids. Without this
// switch every local click lands in the live PostHog project and the live Ads account: on
// 19 Sept 2026 the only traffic PostHog had ever recorded was localhost. So in development all
// measurement is off unless NEXT_PUBLIC_TRACK_IN_DEV=1 is set on purpose. A production build
// (next build, which is also what the Playwright suite serves) is never silenced.
export const DEV_SILENT: boolean =
  process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_TRACK_IN_DEV !== "1";
