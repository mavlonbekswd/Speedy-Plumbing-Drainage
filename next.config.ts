import type { NextConfig } from "next";

// Kept in sync with the canonical origin used by the app by hand: next.config.ts
// is loaded outside the app's module graph, so it cannot import from "@/lib".
const CANONICAL_ORIGIN = "https://www.speedyplumbingdrain.co.uk";

// Set this to the project's production Vercel alias host (for example
// "something.vercel.app") to redirect that duplicate of the live site away
// permanently. Left empty, no alias redirect is registered at all.
const VERCEL_ALIAS_HOST = "";

// Matches any Vercel deployment host, including the per-branch and per-commit
// preview URLs Vercel generates automatically. Next requires a named group.
const ANY_VERCEL_HOST = "(?<vercelHost>.*\\.vercel\\.app)";

// The production environment variables in Vercel still carry the legacy VITE_
// names from the previous build, so they are mapped here rather than renamed.
const pick = (...names: string[]): string =>
  names.map((n) => process.env[n]).find((v) => v && v.length) ?? "";

const nextConfig: NextConfig = {
  // The test suite builds into its own directory (playwright.config.ts sets NEXT_DIST_DIR), so a
  // `next dev` left running in an editor cannot overwrite the build the tests are serving.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Every *.vercel.app host is made non-indexable at the header level. A
  // genuine preview deployment stays reachable for review but can never be
  // indexed or pass link equity, so it can never compete with the real domain.
  async headers() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: ANY_VERCEL_HOST }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },

  // A production alias host is a duplicate of the live site rather than a
  // preview of anything, so it is redirected away permanently rather than
  // merely hidden from crawlers. 308 preserves the path, so /sitemap.xml,
  // /robots.txt and every page land on their real-domain equivalent.
  async redirects() {
    // Pages removed on 19 Sept 2026 (owner): the callback wizard moved onto /contact, the
    // questions moved onto the pages they belong to, and reviews moved onto the home page.
    // Redirects run before middleware, so these beat its catch-all.
    const removed = [
      { source: "/quote", destination: "/contact#book", permanent: true },
      { source: "/faqs", destination: "/#faq", permanent: true },
      { source: "/reviews", destination: "/#reviews", permanent: true },
    ];
    return VERCEL_ALIAS_HOST
      ? [
          {
            source: "/:path*",
            has: [{ type: "host", value: VERCEL_ALIAS_HOST }],
            destination: `${CANONICAL_ORIGIN}/:path*`,
            permanent: true,
          },
          ...removed,
        ]
      : removed;
  },

  // PostHog reverse proxy (US region): events go to /ingest on our own
  // domain so ad-blockers stop eating them. Static asset rewrite must come
  // before the catch-all.
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },

  // First name wins; the fallback is "" so no value is ever undefined.
  env: {
    NEXT_PUBLIC_GADS_ID: pick("NEXT_PUBLIC_GADS_ID", "VITE_GADS_ID"),
    NEXT_PUBLIC_GA4_ID: pick("NEXT_PUBLIC_GA4_ID", "VITE_GA4_ID"),
    NEXT_PUBLIC_GADS_LABEL_BOOKING: pick(
      "NEXT_PUBLIC_GADS_LABEL_BOOKING",
      "VITE_GADS_LABEL_QUOTE",
    ),
    NEXT_PUBLIC_GADS_LABEL_PHONE_TAP: pick(
      "NEXT_PUBLIC_GADS_LABEL_PHONE_TAP",
      "VITE_GADS_LABEL_PHONE",
    ),
    NEXT_PUBLIC_POSTHOG_KEY: pick(
      "NEXT_PUBLIC_POSTHOG_KEY",
      "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN",
    ),
  },

  // Required by PostHog: API requests can end in a trailing slash.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
