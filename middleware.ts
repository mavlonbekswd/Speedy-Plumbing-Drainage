import { NextResponse, type NextRequest } from "next/server";
import { ALL_PUBLISHED_PATHS, KNOWN_PATH_PREFIXES } from "@/lib/routes";

// Two jobs, and they pull in opposite directions, which is why the order of the checks below
// is the whole file.
//
// 1. A mistyped Google Ads Final URL must not dead-end. The account's own URLs are the risk:
//    a typo in one destroys every click it receives. So an unknown path is 307'd to the
//    emergency service page with the query string intact, which keeps gclid, gbraid, wbraid
//    and the UTMs alive so the click still attributes.
//
// 2. An unknown TOWN must 404 honestly. /areas/<slug> is the one thing that must never
//    redirect: laundering a town we do not cover into a 200 on a page about a different place
//    is a coverage claim the business cannot keep, and a soft 404 on a whole URL space is a
//    ranking problem as well as an honesty one. The same goes for /services/<slug> and
//    /blog/<slug>: if the slug is wrong, Next should say so.
//
// App Router's own not-found.tsx cannot do job 1: as the automatic boundary for an unmatched
// route it renders with a real 404 and no Location header, so a non-JS client, a crawler or a
// link checker sees the 404 and never learns where to go. Middleware runs before routing and
// so has no built-in way to know a path will 404, hence the explicit list; it is read from
// lib/routes.ts rather than typed out a second time, because a second copy is how the header,
// the footer, the sitemap and this file drift apart.

// Framework routes with no file extension in their URL, so the matcher's extension carve-out
// below does not already cover them. /sitemap.xml and /robots.txt do carry one, and are listed
// anyway so this set reads as the complete answer rather than as a partial one.
const FRAMEWORK_ROUTES: readonly string[] = [
  "/opengraph-image",
  "/icon.png",
  "/apple-icon.png",
  "/llms.txt",
  "/sitemap.xml",
  "/robots.txt",
];

const EMERGENCY_PATH = "/services/emergency-plumbing";

// ALL_PUBLISHED_PATHS is a function on purpose (lib/routes.ts): it has to be read after the
// content barrels have finished their own assertions, whatever order the bundler reached them
// in. Memoised here so the set is still built once per isolate rather than once per request.
let knownPaths: Set<string> | null = null;
let unknownPathTarget: string | null = null;

function routes(): { known: Set<string>; target: string } {
  if (!knownPaths || !unknownPathTarget) {
    const published = ALL_PUBLISHED_PATHS();
    knownPaths = new Set<string>([...published, ...FRAMEWORK_ROUTES]);
    // Home is the fallback while the emergency page is still unbuilt: redirecting to a path
    // that itself 404s would turn one soft 404 into two.
    unknownPathTarget = published.includes(EMERGENCY_PATH) ? EMERGENCY_PATH : "/";
  }
  return { known: knownPaths, target: unknownPathTarget };
}

// Runs on every request except: Next internals (_next), API routes (/api/book is a POST JSON
// endpoint and must never be redirected to an HTML page), the PostHog reverse proxy (/ingest),
// the favicon, and any path with a file extension.
//
// THE /ingest EXCLUSION IS LOAD-BEARING. next.config.ts rewrites /ingest/* to PostHog, and
// middleware runs BEFORE rewrites. Without it, /ingest/i/v0/e/ is an unknown path and every
// event POST is 307'd to an HTML page, which answers 405. The failure is invisible: the
// extension carve-out still lets /ingest/static/*.js through, so posthog-js loads,
// initialises, looks healthy, and every event it sends dies silently with no console error.
// There is no @vercel/analytics or @vercel/speed-insights here, so there is no /_vercel/* to
// exclude; add one if either is ever installed, because /_vercel does NOT match /_next.
export const config = {
  matcher: ["/((?!_next|api|ingest|favicon\\.ico|.*\\.[a-zA-Z0-9]+$).*)"],
};

/** A known path, forgiving one trailing slash. skipTrailingSlashRedirect is on, so "/about/"
 *  reaches us as itself and must not be treated as a typo. */
function isKnownPath(pathname: string): boolean {
  const { known } = routes();
  if (known.has(pathname)) return true;
  if (pathname.length > 1 && pathname.endsWith("/") && known.has(pathname.slice(0, -1))) return true;
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The home page is served as it is. It was going to carry a geo-personalised eyebrow, but
  // reading that header in the page needs headers(), which would make the most-visited page
  // dynamic. It stays static, so there is nothing to compute here (lib/geoTowns.ts is kept for
  // the day that trade-off is reversed).
  if (pathname === "/") return NextResponse.next();

  // Checked on the raw pathname and BEFORE the known-path test, so an unknown slug under one
  // of these three segments reaches Next and gets a real 404 from notFound(). This is the one
  // deliberate difference from the reference implementation, and it is the rule that keeps a
  // town we do not serve from being answered with a page about somewhere else.
  if (KNOWN_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  if (!isKnownPath(pathname)) {
    // clone() keeps the host and protocol of the request, so this works identically on the
    // canonical origin, a preview deployment and localhost. The search string is carried over
    // explicitly: new URL(path, request.url) drops it, and a dropped gclid means an ad click
    // that converted is reported as if it never happened.
    const target = request.nextUrl.clone();
    target.pathname = routes().target;
    target.search = request.nextUrl.search;
    target.hash = "";
    return NextResponse.redirect(target, 307);
  }

  return NextResponse.next();
}
