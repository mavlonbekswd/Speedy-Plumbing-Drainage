// The route table. Middleware's known-path list, the sitemap, the header, the footer, llms.txt
// and the test route list all read this file, because the specification's own warning is that
// those five drift apart the moment a route is added in one of them.
//
// `published` is false for everything except the home page. Later units flip a flag here on the
// day they ship the page behind it; nothing else needs changing for the route to appear in the
// sitemap, the nav and the tests at once.

import { PUBLISHED_SERVICES, serviceHref } from "./services";
import { PUBLISHED_TOWNS, townHref } from "./towns";
import { PUBLISHED_POSTS, blogHref } from "./blog";

export type PageType =
  | "home"
  | "service"
  | "service_hub"
  | "town"
  | "areas_hub"
  | "quote"
  | "blog_index"
  | "blog_post"
  | "legal"
  | "static";

export interface StaticRoute {
  path: string;
  pageType: PageType;
  /** false keeps the path out of sitemap.ts even once it is published. */
  inSitemap: boolean;
  /** The working title for the page, for the unit that builds it. Not the rendered <title>. */
  titleHint: string;
  published: boolean;
}

// /quote, /faqs and /reviews were removed on 19 Sept 2026 (owner). They are gone from this table
// rather than flipped to published: false, so they leave the sitemap, the nav, llms.txt, the
// middleware known-path set and the test route lists together. next.config.ts 308s the three old
// URLs to /contact#book, /#faq and /#reviews, and a redirect runs before middleware, so dropping
// them here does not turn them into unknown paths.
export const STATIC_ROUTES: readonly StaticRoute[] = [
  { path: "/", pageType: "home", inSitemap: true, titleHint: "Plumbing and drainage, 24/7", published: true },
  { path: "/services", pageType: "service_hub", inSitemap: true, titleHint: "Pick the service for your problem", published: true },
  { path: "/areas-we-cover", pageType: "areas_hub", inSitemap: true, titleHint: "Where we work", published: true },
  { path: "/about", pageType: "static", inSitemap: true, titleHint: "About Speedy", published: true },
  { path: "/guarantee", pageType: "static", inSitemap: true, titleHint: "Our 1-year guarantee", published: true },
  { path: "/contact", pageType: "static", inSitemap: true, titleHint: "Contact Speedy", published: true },
  { path: "/projects", pageType: "static", inSitemap: true, titleHint: "Work we have done", published: true },
  { path: "/blog", pageType: "blog_index", inSitemap: true, titleHint: "Advice from the tools", published: true },
  // Noindex, and out of the sitemap whatever its published flag says.
  { path: "/privacy", pageType: "legal", inSitemap: false, titleHint: "Privacy notice", published: true },
  { path: "/terms", pageType: "legal", inSitemap: true, titleHint: "Terms", published: true },
];

export const STATIC_ROUTE_BY_PATH: Readonly<Record<string, StaticRoute>> = Object.fromEntries(
  STATIC_ROUTES.map((route) => [route.path, route]),
);

export const PUBLISHED_STATIC_ROUTES: readonly StaticRoute[] = STATIC_ROUTES.filter((r) => r.published);

/** The three dynamic segments. Middleware treats anything else as an unknown path. */
export const KNOWN_PATH_PREFIXES: readonly string[] = ["/areas/", "/services/", "/blog/"];

/**
 * Every path the site actually serves today. A function rather than a constant so it is read
 * after the barrels have finished their own assertions, in whatever order a bundler picks.
 */
export function ALL_PUBLISHED_PATHS(): string[] {
  return [
    ...PUBLISHED_STATIC_ROUTES.map((route) => route.path),
    ...PUBLISHED_SERVICES.map((service) => serviceHref(service.slug)),
    ...PUBLISHED_TOWNS.map((town) => townHref(town.slug)),
    ...PUBLISHED_POSTS.map((post) => blogHref(post.slug)),
  ];
}

/** The sitemap's own list: published, and not the pages held out of it. */
export function SITEMAP_PATHS(): string[] {
  const held = new Set(STATIC_ROUTES.filter((route) => !route.inSitemap).map((route) => route.path));
  return ALL_PUBLISHED_PATHS().filter((path) => !held.has(path));
}

const SEEN = new Set<string>();
for (const route of STATIC_ROUTES) {
  if (SEEN.has(route.path)) throw new Error(`lib/routes.ts: ${route.path} is listed twice`);
  SEEN.add(route.path);
  if (!route.path.startsWith("/")) throw new Error(`lib/routes.ts: ${route.path} is not an absolute path`);
}
if (!STATIC_ROUTE_BY_PATH["/"].published) {
  throw new Error("lib/routes.ts: the home page has to be published");
}
