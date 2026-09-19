import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// VERCEL_ENV is "production" | "preview" | "development" and is set by Vercel on every
// deployment, so anything that is not the production deployment refuses crawlers outright.
// A preview stays reachable for review and can never be indexed, so it can never compete with
// the real domain for the terms the real domain is buying.
//
// Belt and braces alongside the X-Robots-Tag header in next.config.ts, and deliberately
// independent of it: a header can be stripped by a proxy and a robots.txt can be ignored by a
// crawler, so neither is asked to be the only answer. Unset means a local build, which is
// treated as production so the file can be read in development and be the file that ships.
const IS_PRODUCTION_DEPLOYMENT = !process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production";

export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION_DEPLOYMENT) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
