import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";

export interface Crumb {
  name: string;
  /** Absent on the last crumb, which is the current page. */
  href?: string;
}

/**
 * The visible trail and its BreadcrumbList in one component, so a page cannot ship one without
 * the other and the two can never disagree about the order.
 *
 * FOR PAGE AUTHORS: pass the whole trail including Home and including the current page, with
 * the current page's href left out:
 *
 *   <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Services", href: "/services" },
 *                       { name: "Emergency plumbing" }]} />
 */
export default function Breadcrumb({ items, className = "" }: { items: Crumb[]; className?: string }) {
  // Absolute URLs, because a BreadcrumbList item id has to resolve on its own. "/" becomes the
  // bare origin rather than origin + "/", which is the form every canonical on the site uses.
  const absolute = (href: string) => (href === "/" ? SITE_URL : `${SITE_URL}${href}`);

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      ...(crumb.href ? { item: absolute(crumb.href) } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className={`text-[13px] font-medium text-steel ${className}`}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((crumb, index) => (
          <li key={`${crumb.name}-${index}`} className="inline-flex items-center gap-2">
            {crumb.href ? (
              <a
                href={crumb.href}
                data-cta="nav"
                data-cta-location="breadcrumb"
                data-cta-variant="text_link"
                className="text-slate hover:text-tint"
              >
                {crumb.name}
              </a>
            ) : (
              <span
                aria-current={index === items.length - 1 ? "page" : undefined}
                className={index === items.length - 1 ? "text-brand" : "text-slate"}
              >
                {crumb.name}
              </span>
            )}
            {index < items.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
      <JsonLd data={schema} />
    </nav>
  );
}
