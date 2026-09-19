import type { MetadataRoute } from "next";
import { SITEMAP_PATHS } from "@/lib/routes";
import { CONTENT_LAST_MODIFIED, SITE_URL } from "@/lib/site";

// One list, read from lib/routes.ts, so the sitemap cannot fall behind the pages. SITEMAP_PATHS
// already drops anything held out of the sitemap by its route entry, which today is /privacy
// (noindex, and out whatever its published flag says); verified against STATIC_ROUTES.
//
// One date for every entry, bumped in lib/site.ts when the content changes, rather than a
// build-time new Date(). The latter tells Google that every page changed on every deploy,
// which is precisely why Google ignores most of the lastmod values it is given.
const lastModified = CONTENT_LAST_MODIFIED;

function priorityFor(path: string): number {
  if (path === "/") return 1.0;
  if (path.startsWith("/services/")) return 0.9;
  if (path === "/services" || path === "/areas-we-cover") return 0.8;
  if (path.startsWith("/areas/")) return 0.7;
  if (path.startsWith("/blog/")) return 0.5;
  return 0.6;
}

function changeFrequencyFor(path: string): "weekly" | "monthly" {
  return path === "/" || path.startsWith("/services/") ? "weekly" : "monthly";
}

export default function sitemap(): MetadataRoute.Sitemap {
  return SITEMAP_PATHS().map((path) => ({
    // The home entry is the bare origin, not origin + "/", so it matches the canonical the
    // page itself declares. A sitemap URL that differs from the canonical by one character is
    // a second URL as far as a crawler is concerned.
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: changeFrequencyFor(path),
    priority: priorityFor(path),
  }));
}
