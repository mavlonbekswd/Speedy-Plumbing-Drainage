import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";
import PosthogProvider from "@/components/PosthogProvider";
import JsonLd from "@/components/JsonLd";
import PhotoLightbox from "@/components/PhotoLightbox";
import { googleTagHeadScripts } from "@/lib/gtag";
import { AVAILABILITY_LINE, COVERAGE_SHORT } from "@/lib/claims";
import { PUBLISHED_SERVICES } from "@/lib/services";
import { AREA_SERVED, COUNTY_ORDER } from "@/lib/towns";
import {
  CALL_NUMBER_DISPLAY,
  CALL_NUMBER_E164,
  CONTACT_EMAIL,
  GEO,
  OG_IMAGE_PATH,
  REGISTERED_LOCALITY,
  REGISTERED_NAME,
  REGISTERED_POSTCODE,
  REGISTERED_STREET,
  SITE_URL,
  TRADING_NAME,
  openGraphFor,
} from "@/lib/site";

const display = Archivo({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-body",
});

const DEFAULT_TITLE = `${TRADING_NAME} | Plumbing and drainage, 24/7`;

// Both sentences are lib/claims.ts constants: the description is the one piece of copy a page
// cannot proof-read on screen, so it is assembled rather than written. 122 characters, inside
// the length Google will render.
const DEFAULT_DESCRIPTION = `Plumbing and drainage across ${COVERAGE_SHORT}. ${AVAILABILITY_LINE}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    // Every page supplies its own subject and gets the firm's name appended once.
    template: `%s | ${TRADING_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  // A page-level openGraph object REPLACES this one rather than merging with it, which is why
  // every page composes its own through the same helper: see lib/site.ts.
  openGraph: openGraphFor({ path: "", title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION }),
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#10296B",
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const COUNTIES = new Set<string>(COUNTY_ORDER);

// The sitewide business graph. Built only from facts that have a proof file. It carries no
// rating and no review field of any kind (four Google reviews is below the floor, and
// HAS_REVIEWS in lib/claims.ts is false), no price field and no price, and no credential.
//
// `name` is the trading name, which is what a customer searches for. `legalName` is the
// registered entity, which is what schema.org means by the field and what Companies House
// holds; the two differ and the footer discloses exactly that. The address is composed from
// the same constants the footer prints, so the two cannot drift.
const BUSINESS = {
  "@context": "https://schema.org",
  "@type": "Plumber",
  "@id": `${SITE_URL}#business`,
  name: TRADING_NAME,
  legalName: REGISTERED_NAME,
  url: SITE_URL,
  telephone: CALL_NUMBER_E164,
  email: CONTACT_EMAIL,
  image: `${SITE_URL}${OG_IMAGE_PATH}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: REGISTERED_STREET,
    addressLocality: REGISTERED_LOCALITY,
    postalCode: REGISTERED_POSTCODE,
    addressCountry: "GB",
  },
  geo: { "@type": "GeoCoordinates", latitude: GEO.latitude, longitude: GEO.longitude },
  openingHoursSpecification: DAYS.map((day) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: day,
    opens: "00:00",
    closes: "23:59",
  })),
  // lib/towns.ts guarantees every non-county entry here is a published Tier 1 town with its
  // own page, which is the rule that stopped the reference site claiming four towns it had no
  // page for. Counties are administrative areas; towns are cities.
  areaServed: AREA_SERVED.map((place) =>
    COUNTIES.has(place)
      ? { "@type": "AdministrativeArea", name: place }
      : { "@type": "City", name: place },
  ),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Plumbing and drainage",
    itemListElement: PUBLISHED_SERVICES.map((service) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: service.navLabel },
    })),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Null whenever there is no valid Ads account id, in which case nothing at all is rendered
  // and every conversion helper in lib/gtag.ts is already a no-op.
  const google = googleTagHeadScripts(CALL_NUMBER_DISPLAY);

  return (
    <html lang="en-GB" className={`${display.variable} ${body.variable}`}>
      <head>
        {/* Plain <script> elements, NOT next/script. Google Ads' own tag checker and Tag
            Assistant read the initial HTML for the standard snippet; afterInteractive leaves
            only a preload hint there and the campaign diagnostics then report the tag missing
            although it loads fine for visitors. The inline half must go through
            dangerouslySetInnerHTML: as JSX children React escapes the quotes and the script
            stops parsing. No gtag('consent', ...) call is made anywhere on this site. */}
        {google && (
          <>
            <script async src={google.loaderSrc} />
            <script id="google-tag" dangerouslySetInnerHTML={{ __html: google.inline }} />
          </>
        )}
      </head>
      <body className="bg-paper font-sans text-ink antialiased">
        {/* First focusable element in the document, invisible until it has focus. Every page
            puts id="main" on its <main>. */}
        <a
          href="#main"
          className="sr-only rounded-chip bg-brand px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
        >
          Skip to content
        </a>

        <PosthogProvider>{children}</PosthogProvider>

        {/* One <dialog> for the whole site, and one delegated listener with it. Every photo tile
            that enlarges is a server-rendered button carrying data-zoom-src; nothing per tile is
            a client component. Closed, it holds no picture at all. */}
        <PhotoLightbox />

        <JsonLd data={BUSINESS} id="business-schema" />
      </body>
    </html>
  );
}
