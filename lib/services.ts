// The service barrel. Ten leaves, one per slug in the ServiceSlug union, statically imported so
// the route list, the nav, the sitemap and the tests all read one array.
//
// Every assertion below runs on PUBLISHED services only. An unpublished leaf is a skeleton with
// empty fields by design, and holding it to the shape of a finished page would stop the build
// on work nobody has started. The one exception is the released blocked-drains line, which is
// checked on every leaf, published or not, because that rule is about where a claim may appear
// rather than about whether a page is ready.

import type { ServiceContent, ServiceSlug } from "./types";
import { BANNED_PATTERNS, RELEASED_BLOCKED_DRAINS_LINE } from "./claims";
import { PHOTO_BY_SLUG, VIDEO_BY_SLUG } from "./media";
import { ADS, KEYWORD_URL_OVERRIDES } from "../content/ads";

import emergencyPlumbing from "../content/services/emergency-plumbing";
import drainage from "../content/services/drainage";
import blockedDrains from "../content/services/blocked-drains";
import leakRepairs from "../content/services/leak-repairs";
import drainCleaning from "../content/services/drain-cleaning";
import toiletRepairs from "../content/services/toilet-repairs";
import bathroomPlumbing from "../content/services/bathroom-plumbing";
import hotWater from "../content/services/hot-water";
import sanifloAndMacerators from "../content/services/saniflo-and-macerators";
import boilerRepairs from "../content/services/boiler-repairs";

/** Typed by the union, so a missing or misspelled slug is a compile error, not a runtime one. */
const SERVICE_LEAVES: Readonly<Record<ServiceSlug, ServiceContent>> = {
  "emergency-plumbing": emergencyPlumbing,
  drainage,
  "blocked-drains": blockedDrains,
  "leak-repairs": leakRepairs,
  "drain-cleaning": drainCleaning,
  "toilet-repairs": toiletRepairs,
  "bathroom-plumbing": bathroomPlumbing,
  "hot-water": hotWater,
  "saniflo-and-macerators": sanifloAndMacerators,
  "boiler-repairs": boilerRepairs,
};

export const SERVICES: readonly ServiceContent[] = Object.values(SERVICE_LEAVES);

export const PUBLISHED_SERVICES: readonly ServiceContent[] = SERVICES.filter((s) => s.published);

export const SERVICE_BY_SLUG: Readonly<Record<ServiceSlug, ServiceContent>> = SERVICE_LEAVES;

/** For rendering, so both lists are published only. Route building uses PUBLISHED_SERVICES. */
export const URGENT_SERVICES: readonly ServiceContent[] = PUBLISHED_SERVICES.filter((s) => s.kind === "urgent");
export const BOOKED_SERVICES: readonly ServiceContent[] = PUBLISHED_SERVICES.filter((s) => s.kind === "booked");

export function serviceHref(slug: ServiceSlug): string {
  return `/services/${slug}`;
}

// ---------------------------------------------------------------------------
// Assertions
// ---------------------------------------------------------------------------

/** Every string reachable from a leaf. Functions such as townH1 are skipped: they need an
 *  argument, so the copy inside them is checked where it is rendered instead. */
function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") {
    out.push(value);
  } else if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, out);
  } else if (value && typeof value === "object") {
    for (const item of Object.values(value)) collectStrings(item, out);
  }
  return out;
}

// Which pinned lines each page is on the hook for. An ad group's Final URL puts its lines on
// that page; a keyword-level override puts the same group's lines on a second page as well.
const PINNED_BY_PAGE = new Map<string, Set<string>>();

function allowPinned(page: string, pinned: string): void {
  const set = PINNED_BY_PAGE.get(page) ?? new Set<string>();
  set.add(pinned);
  PINNED_BY_PAGE.set(page, set);
}

for (const ad of ADS) allowPinned(ad.finalUrl, ad.pinned);
for (const override of KEYWORD_URL_OVERRIDES) {
  for (const ad of ADS) {
    if (ad.group === override.group) allowPinned(override.finalUrl, ad.pinned);
  }
}

for (const [slug, service] of Object.entries(SERVICE_LEAVES) as [ServiceSlug, ServiceContent][]) {
  const where = `lib/services.ts: ${slug}`;

  if (service.slug !== slug) {
    throw new Error(`${where}: leaf content/services/${slug}.ts declares slug "${service.slug}"`);
  }

  // Where a claim may appear, checked on every leaf.
  if (slug !== "blocked-drains") {
    for (const text of collectStrings(service)) {
      if (text.includes(RELEASED_BLOCKED_DRAINS_LINE)) {
        throw new Error(`${where}: carries the released line, which runs on blocked-drains and nowhere else`);
      }
    }
  }

  if (!service.published) continue;

  if (service.answers.length !== 8) {
    throw new Error(`${where}: ${service.answers.length} straight-answer cards, the set is eight`);
  }
  if (!service.answers[0].rest.includes("your postcode")) {
    throw new Error(`${where}: the first answer must tell the reader an arrival time comes from your postcode`);
  }
  if (service.faqs.length < 3 || service.faqs.length > 5) {
    throw new Error(`${where}: ${service.faqs.length} FAQs, the page takes three to five`);
  }

  const href = serviceHref(service.slug);
  const allowed = PINNED_BY_PAGE.get(href) ?? new Set<string>();
  for (const line of service.adLines) {
    if (!allowed.has(line)) {
      throw new Error(`${where}: adLines carries a line no ad sends to ${href}: ${line}`);
    }
  }

  for (const text of collectStrings(service)) {
    for (const pattern of BANNED_PATTERNS) {
      if (pattern.re.test(text)) {
        throw new Error(`${where}: "${pattern.label}" in: ${text}`);
      }
    }
  }

  // Booked pages get a time and keep it; they never open on a same-day promise.
  if (service.kind === "booked") {
    const headline = `${service.hero.h1Top} ${service.hero.h1Bottom}`;
    if (/same\s+day/i.test(headline)) {
      throw new Error(`${where}: a booked page headline says same day`);
    }
  }

  for (const photo of service.proof.photos) {
    if (!PHOTO_BY_SLUG[photo]) throw new Error(`${where}: proof photo "${photo}" is not in lib/media.ts`);
  }
  if (service.proof.video && !VIDEO_BY_SLUG[service.proof.video]) {
    throw new Error(`${where}: proof video "${service.proof.video}" is not in lib/media.ts`);
  }
}

if (SERVICES.length !== 10) {
  throw new Error(`lib/services.ts: expected 10 services, found ${SERVICES.length}`);
}
