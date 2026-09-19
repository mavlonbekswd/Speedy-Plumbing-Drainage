// Client-side PostHog helpers.
//
// Calls-to-action are tagged declaratively with data attributes and read by a
// single delegated listener, so a server component can be tracked without
// becoming a client component just to own an onClick:
//
//   data-cta           one of the keys of CTA_EVENTS below
//   data-cta-location  where it sits (header, hero, footer, sticky_bar...)
//   data-cta-variant   text_link, icon_button, primary_button, secondary_button
//   data-cta-position  numeric position where a CTA repeats down a page
//
// Every hand-written event carries page context derived from the pathname, so
// no page needs per-page wiring to be reportable by service or by town.

import { reportConversion } from "@/lib/gtag";
import { whenPosthog } from "@/lib/posthogClient";

export type PageType =
  | "home"
  | "service"
  | "area"
  | "services"
  | "areas_index"
  | "about"
  | "contact"
  | "guarantee"
  | "quote"
  | "projects"
  | "reviews"
  | "faqs"
  | "blog"
  | "blog_post"
  | "privacy"
  | "terms"
  | "other";

export interface PageContext {
  page_type: PageType;
  service?: string;
  city?: string;
}

// Pure path patterns, with no import from the content layer. Page context has
// to be resolvable in the browser bundle on any route, including one this file
// has never heard of, and pulling the service and city tables in here would
// ship the whole content layer to every visitor to get one string.
const SINGLE_SEGMENT: Record<string, PageType> = {
  services: "services",
  areas: "areas_index",
  about: "about",
  contact: "contact",
  guarantee: "guarantee",
  quote: "quote",
  projects: "projects",
  reviews: "reviews",
  faqs: "faqs",
  blog: "blog",
  privacy: "privacy",
  terms: "terms",
};

export function getPageContext(pathname: string): PageContext {
  const segs = pathname.split("/").filter(Boolean);
  if (segs.length === 0) return { page_type: "home" };

  if (segs.length === 1) {
    return { page_type: SINGLE_SEGMENT[segs[0]] ?? "other" };
  }

  if (segs.length === 2) {
    if (segs[0] === "services") return { page_type: "service", service: segs[1] };
    if (segs[0] === "areas") return { page_type: "area", city: segs[1] };
    if (segs[0] === "blog") return { page_type: "blog_post" };
  }

  return { page_type: "other" };
}

// posthog-js loads on demand (lib/posthogClient.ts), so capture goes through whenPosthog: it runs
// at once when the client is up, waits briefly when it is not, and is a no-op on the server or
// with no key. Page context is read NOW, not when the queue drains, so an event fired just
// before a navigation is still credited to the page it happened on.
export function trackEvent(
  name: string,
  props: Record<string, unknown> = {},
  options?: { transport?: "sendBeacon" },
): void {
  if (typeof window === "undefined") return;
  const payload = {
    ...getPageContext(window.location.pathname),
    page_path: window.location.pathname,
    ...props,
  };
  whenPosthog((posthog) => posthog.capture(name, payload, options));
}

// Every data-cta value used anywhere in the markup must have an entry here.
// An unmapped value fires nothing, which is the safe failure, but it is also a
// silent one, so development says so out loud.
export const CTA_EVENTS = {
  phone: "phone_call_click",
  whatsapp: "whatsapp_click",
  book_anchor: "book_anchor_click",
  nav: "nav_click",
  // Opening or closing a menu is not a navigation. Kept out of nav_click so
  // that event stays a count of pages people actually went to.
  menu: "menu_toggle",
  email: "email_click",
} as const;

export type CtaKey = keyof typeof CTA_EVENTS;

/** Where down the document the element sat, 0 at the top and 1 at the bottom.
 *  Answers "which placement actually earns the call". */
function viewportRatio(el: HTMLElement): number | undefined {
  try {
    const rect = el.getBoundingClientRect();
    const docHeight = Math.max(document.documentElement.scrollHeight, 1);
    return Math.round(((rect.top + window.scrollY) / docHeight) * 100) / 100;
  } catch {
    return undefined;
  }
}

/** How far down the visitor had scrolled at the moment of the click, 0 to 1.
 *  posthog-js reports max scroll for the page being left on its own, so this
 *  is a point-in-time reading on an event, not a second scroll tracker. */
export function scrollDepth(): number | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const doc = document.documentElement;
    const denom = Math.max(doc.scrollHeight - window.innerHeight, 1);
    return Math.min(1, Math.round((window.scrollY / denom) * 100) / 100);
  } catch {
    return undefined;
  }
}

const warnedCtaValues = new Set<string>();

/** The query string is dropped before the href is recorded. A WhatsApp link
 *  carries the prefilled message there and a booking link can carry whatever a
 *  campaign appended, none of which belongs in an event property. */
function hrefWithoutQuery(el: HTMLElement): string | undefined {
  const href = el.getAttribute("href");
  if (!href) return undefined;
  return href.split(/[?#]/)[0];
}

// Capture phase, so a tel: navigation cannot swallow the click before it is
// seen.
export function handleDelegatedClick(e: MouseEvent): void {
  const target = e.target as HTMLElement | null;
  const el = target?.closest?.("[data-cta]") as HTMLElement | null;
  if (!el) return;

  const key = el.dataset.cta ?? "";
  const event = CTA_EVENTS[key as CtaKey];
  if (!event) {
    if (process.env.NODE_ENV === "development" && key && !warnedCtaValues.has(key)) {
      warnedCtaValues.add(key);
      if (typeof console !== "undefined") {
        console.warn(
          `[analytics] data-cta="${key}" has no entry in CTA_EVENTS, so this click is not ` +
            "tracked. Add it to lib/analytics.ts or fix the attribute.",
        );
      }
    }
    return;
  }

  const ctaLabel = (el.getAttribute("aria-label") ?? el.textContent ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);

  const props: Record<string, unknown> = {
    cta: key,
    cta_location: el.dataset.ctaLocation,
    cta_variant: el.dataset.ctaVariant,
    cta_label: ctaLabel,
    cta_viewport_ratio: viewportRatio(el),
    scroll_depth_at_click: scrollDepth(),
    href: hrefWithoutQuery(el),
  };
  if (el.dataset.ctaPosition) props.cta_position = Number(el.dataset.ctaPosition);

  trackEvent(event, props);

  // A phone or WhatsApp tap is a micro-conversion and is treated as one: it
  // always reaches PostHog, and reaches Google only if a tap-specific label
  // exists. It is deliberately never sent to the call action, which counts
  // calls over a minimum duration and which a tap cannot satisfy.
  if (key === "phone") reportConversion("phone_tap");
  else if (key === "whatsapp") reportConversion("whatsapp");
}

// ─── Time to first interaction ────────────────────────────────────────────────
// How long the visitor looked at the page before doing anything at all. Once
// per pageview. On a page whose job is to produce a phone call, a long silence
// is the signal that the page is not doing it.

let firstInteractionSent = false;
let pageStartedAt = 0;
let isFirstPageOfVisit = true;

/** performance.now() counts from navigation start, so on the first page of a
 *  visit the clock starts at 0 rather than at React mount. Starting at mount
 *  would hide everything before hydration, which on a slow phone is exactly
 *  the part worth measuring. A later client-side navigation restarts it. */
function nowMs(): number {
  return typeof performance !== "undefined" ? performance.now() : 0;
}

export function resetFirstInteraction(): void {
  firstInteractionSent = false;
  pageStartedAt = isFirstPageOfVisit ? 0 : nowMs();
  isFirstPageOfVisit = false;
}

export function installFirstInteractionTracking(): () => void {
  if (typeof window === "undefined") return () => {};
  resetFirstInteraction();

  const onInteract = (e: Event) => {
    if (firstInteractionSent) return;
    firstInteractionSent = true;
    trackEvent("first_interaction", {
      seconds_since_load: Math.max(0, Math.round((nowMs() - pageStartedAt) / 10) / 100),
      interaction_type: e.type,
    });
  };

  const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "scroll"];
  for (const name of events) {
    window.addEventListener(name, onInteract, { capture: true, passive: true });
  }
  return () => {
    for (const name of events) window.removeEventListener(name, onInteract, true);
  };
}

/** A play on a job video. The proof strip is the one place on the site where a
 *  visitor spends attention rather than clicking, so it is worth its own
 *  event rather than leaving it to autocapture. */
export function trackVideoPlay(slug: string): void {
  trackEvent("video_play", { video_slug: slug });
}
