// Header and footer links, generated from the barrels and filtered by `published`, so an
// unfinished page is never linked and a finished one is linked the day its flag flips. Nothing
// here is hand-listed except the order and the one anchor into the booking form on /contact,
// which is a section rather than a route and so cannot come from the route table.

import { PUBLISHED_SERVICES, serviceHref } from "./services";
import { COUNTY_ORDER, PUBLISHED_TOWNS, TOWNS_BY_COUNTY, townHref } from "./towns";
import { STATIC_ROUTE_BY_PATH } from "./routes";

export interface NavLink {
  href: string;
  label: string;
  /**
   * Overrides the default `data-cta="nav"` where the item is really a booking action wearing a
   * nav link's clothes, so the report can tell "went looking for a page" from "went to book".
   */
  cta?: "nav" | "book_anchor";
}

export interface NavGroup {
  heading: string;
  links: NavLink[];
}

function staticLink(path: string, label?: string): NavLink | null {
  const route = STATIC_ROUTE_BY_PATH[path];
  if (!route || !route.published) return null;
  return { href: path, label: label ?? route.titleHint };
}

function present(links: readonly (NavLink | null)[]): NavLink[] {
  return links.filter((link): link is NavLink => link !== null);
}

/** The top nav, in the order a customer scans it. Home is the wordmark, so it is not here. */
export const HEADER_LINKS: readonly NavLink[] = present([
  staticLink("/services", "Services"),
  staticLink("/areas-we-cover", "Areas we cover"),
  staticLink("/guarantee", "Guarantee"),
  staticLink("/about", "About"),
  staticLink("/contact", "Contact"),
]);

/**
 * Every published service, in barrel order. The footer's "What we do" column and the header's
 * Services drop-down are the same list, so a service that publishes appears in both at once.
 * Exported so `components/Header.tsx` (a server component) can hand it to `HeaderClient` as a
 * plain array: the client bundle must never import lib/services.
 */
export const SERVICE_NAV_LINKS: readonly NavLink[] = PUBLISHED_SERVICES.map((service) => ({
  href: serviceHref(service.slug),
  label: service.navLabel,
}));

/** The /services hub itself, or null while it is unpublished. The drop-down's "All services". */
export const SERVICES_HUB_LINK: NavLink | null = staticLink("/services", "All services");

/** Published Tier 1 towns, grouped by county in the fixed order, then the organic pages. */
const TOWN_LINKS: NavLink[] = [
  ...COUNTY_ORDER.flatMap((county) =>
    TOWNS_BY_COUNTY[county].map((town) => ({ href: townHref(town.slug), label: town.name })),
  ),
  ...PUBLISHED_TOWNS.filter((town) => town.tier === "organic").map((town) => ({
    href: townHref(town.slug),
    label: town.name,
  })),
];

/**
 * "Ask us to ring you" is no longer a page: the callback form lives in `section#book` on
 * /contact. It keeps its place in the footer because it is the third way to reach us, but it is
 * tagged as the booking action it is rather than as navigation. Null while /contact is unbuilt,
 * so the anchor can never point at a page that does not exist.
 */
const CALLBACK_LINK: NavLink | null = STATIC_ROUTE_BY_PATH["/contact"]?.published
  ? { href: "/contact#book", label: "Ask us to ring you", cta: "book_anchor" }
  : null;

const COMPANY_LINKS: NavLink[] = present([
  staticLink("/about", "About"),
  staticLink("/guarantee", "Guarantee"),
  staticLink("/projects", "Our work"),
  staticLink("/blog", "Advice"),
  staticLink("/contact", "Contact"),
  CALLBACK_LINK,
]);

const LEGAL_LINKS: NavLink[] = present([staticLink("/privacy", "Privacy"), staticLink("/terms", "Terms")]);

/** Empty groups are dropped rather than rendered as a heading with nothing under it. */
export const FOOTER_GROUPS: readonly NavGroup[] = [
  { heading: "What we do", links: [...SERVICE_NAV_LINKS] },
  { heading: "Where we work", links: TOWN_LINKS },
  { heading: "Speedy", links: COMPANY_LINKS },
  { heading: "Legal", links: LEGAL_LINKS },
].filter((group) => group.links.length > 0);
