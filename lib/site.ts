// Site-wide identity. One fact, one place: footer, schema, privacy page and OG all read these.
// Data files stay dependency-free (relative imports only, no React) so the Playwright suite
// can import them directly.

// The www host, not the apex: the apex 308s to www, so a canonical on the apex would nominate
// a URL that redirects. next.config.ts repeats this string because it loads outside the module
// graph; change both together.
export const CANONICAL_ORIGIN = "https://www.speedyplumbingdrain.co.uk";

// Strips trailing slashes so `${SITE_URL}/path` never yields "//", and refuses any *.vercel.app
// value so a deployment host can never become the canonical origin, whatever the env var says.
// Localhost passes through so the test server asserts canonicals against its own origin.
export function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return CANONICAL_ORIGIN;
  const normalised = raw.replace(/\/+$/, "");
  if (/\/\/([^/]*\.)?vercel\.app(:\d+)?$/i.test(normalised)) return CANONICAL_ORIGIN;
  return normalised;
}

export const SITE_URL = resolveSiteUrl();

// Trading identity, deliberately without "Ltd". The registered name below is the legal entity
// and appears only in the footer disclosure, the privacy page and schema legalName.
export const TRADING_NAME = "Speedy Plumbing & Drain";
export const REGISTERED_NAME = "Speedy Plumbing & Drain Ltd";
export const COMPANY_NUMBER = "17293094";

// Registered office, held in parts so the schema PostalAddress and the footer cannot drift.
// Published on the owner's decision of 19 Sept 2026; it is already public on Companies House.
export const REGISTERED_STREET = "Flat 1, 24 Burleigh St";
export const REGISTERED_LOCALITY = "Cambridge";
export const REGISTERED_POSTCODE = "CB1 1DG";
export const REGISTERED_OFFICE = `${REGISTERED_STREET}, ${REGISTERED_LOCALITY} ${REGISTERED_POSTCODE}`;

// One template string, rendered as a single JSX expression so it stays a single text node.
// tests/excluded-copy.spec.ts locks it.
export const FOOTER_LEGAL_LINE = `${TRADING_NAME} is a trading name of ${REGISTERED_NAME}, registered in England & Wales, company no. ${COMPANY_NUMBER}. Registered office: ${REGISTERED_OFFICE}.`;

export const CONTACT_EMAIL = "Speedyplumbing01@gmail.com";

export const BASE_TOWN = "Cambridge";
export const BASE_COUNTY = "Cambridgeshire";
export const GEO = { latitude: 52.2076, longitude: 0.1313 } as const;

// Two numbers, never derived from each other. Calls go to the landline that is also the Google
// Ads call asset and the Google Business Profile number. WhatsApp is a separate mobile.
const RAW_CALL_NUMBER = (process.env.NEXT_PUBLIC_CALL_NUMBER ?? "").replace(/\D/g, "") || "01223482415";
export const CALL_NUMBER = RAW_CALL_NUMBER;
export const CALL_NUMBER_DISPLAY =
  RAW_CALL_NUMBER.length === 11
    ? `${RAW_CALL_NUMBER.slice(0, 5)} ${RAW_CALL_NUMBER.slice(5)}`
    : RAW_CALL_NUMBER;
export const CALL_NUMBER_E164 = `+44${RAW_CALL_NUMBER.replace(/^0/, "")}`;
export const CALL_HREF = `tel:${CALL_NUMBER_E164}`;

export const WHATSAPP_E164 = "447704960575";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_E164}`;

// Bumped when page content changes. A build-time new Date() would claim every page changed on
// every deploy, which is worse than saying nothing.
export const CONTENT_LAST_MODIFIED = "2026-09-19";

// A page-level openGraph object replaces the root one rather than merging, so every page
// composes its block from this helper and can never drop the image or the self-referencing url.
export const OG_IMAGE_PATH = "/opengraph-image";

export const OG_IMAGE = {
  url: `${SITE_URL}${OG_IMAGE_PATH}`,
  width: 1200,
  height: 630,
  alt: `${TRADING_NAME} | Plumbing and drainage, 24/7`,
};

/** `path` is the page's own path with a leading slash, or "" for home. It must equal the canonical. */
export function openGraphFor({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}) {
  return {
    title,
    description,
    url: `${SITE_URL}${path}`,
    type: "website" as const,
    locale: "en_GB",
    images: [OG_IMAGE],
  };
}

/**
 * The Google Business Profile's public link ("Share" on the profile, a g.page or maps.app.goo.gl
 * URL). Supplied by the owner on 19 Sept 2026. The home page's reviews section links to it and
 * never shows a count, a rating or a quote. Empty string hides the link.
 */
export const GOOGLE_PROFILE_URL: string = "https://share.google/4gcF41pCQiAxxriWN";
