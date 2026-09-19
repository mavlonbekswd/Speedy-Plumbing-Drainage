// Header and footer links, generated from the barrels and filtered by `published`, so an
// unfinished page is never linked and a finished one is linked the day its flag flips. Nothing
// here is hand-listed except the order.

import { PUBLISHED_SERVICES, serviceHref } from "./services";
import { COUNTY_ORDER, PUBLISHED_TOWNS, TOWNS_BY_COUNTY, townHref } from "./towns";
import { STATIC_ROUTE_BY_PATH } from "./routes";

export interface NavLink {
  href: string;
  label: string;
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

const SERVICE_LINKS: NavLink[] = PUBLISHED_SERVICES.map((service) => ({
  href: serviceHref(service.slug),
  label: service.navLabel,
}));

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

const COMPANY_LINKS: NavLink[] = present([
  staticLink("/about", "About"),
  staticLink("/guarantee", "Guarantee"),
  staticLink("/projects", "Our work"),
  staticLink("/faqs", "Questions"),
  staticLink("/blog", "Advice"),
  staticLink("/reviews", "Reviews"),
  staticLink("/quote", "Ask us to ring you"),
  staticLink("/contact", "Contact"),
]);

const LEGAL_LINKS: NavLink[] = present([staticLink("/privacy", "Privacy"), staticLink("/terms", "Terms")]);

/** Empty groups are dropped rather than rendered as a heading with nothing under it. */
export const FOOTER_GROUPS: readonly NavGroup[] = [
  { heading: "What we do", links: SERVICE_LINKS },
  { heading: "Where we work", links: TOWN_LINKS },
  { heading: "Speedy", links: COMPANY_LINKS },
  { heading: "Legal", links: LEGAL_LINKS },
].filter((group) => group.links.length > 0);
