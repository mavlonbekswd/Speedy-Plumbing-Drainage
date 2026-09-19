import type { ReactNode } from "react";
import { Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import HeroBackdrop from "@/components/HeroBackdrop";
import Button from "@/components/ui/Button";
import type { HeroImageKey } from "@/lib/media";
import { CALL_HREF, CALL_NUMBER_DISPLAY, WHATSAPP_URL } from "@/lib/site";

// The first screen of a STATIC page: /about, /guarantee, /contact, /projects, /blog, a blog post,
// /terms, /privacy, and (through components/hub/HubHero.tsx) /services and /areas-we-cover.
//
// Why it exists. Those heroes were written by four different hands and drifted: three different
// top paddings, an eyebrow on some pages and not others, the sub sentence above the buttons on
// one page and below on the next. One component, one order, no drift.
//
// The order, every time: breadcrumb, eyebrow, H1, the Call pill then the WhatsApp pill, anything
// the page adds under them, the one-line facts, the sub. It is the order in
// components/ServiceHero.tsx and components/home/HomeHero.tsx, and it puts the number above the
// reading matter because the person on the other end of it has water coming through a ceiling.
//
// The Call link is FIRST in DOM order, is server-rendered, and neither it nor any ancestor of it
// carries a fade class: `animate-fade-up*` starts at opacity 0 through its backwards fill, and a
// call button nobody can see at 3am is not a call button. The H1 is left alone for the same
// reason, so the largest paint is not held back for a flourish.
//
// The photograph behind it is decoration (components/HeroBackdrop.tsx, 50% opacity since the
// owner's review of 19 September 2026), which is why the section is `relative isolate
// overflow-hidden` and why nothing here needs a z-index. It is never captioned and never alt'd.
//
// Server component. It renders no state and reads nothing from the request.

export interface StaticHeroProps {
  /** The decorative photograph behind the first screen. FALLBACK_HERO for a page with none. */
  image: HeroImageKey;
  /** Breadcrumb slot. A node, not data, so this component never imports the breadcrumb itself. */
  crumbs?: ReactNode;
  /** The 12px uppercase label above the H1. A node, so a blog post can put its date line here. */
  eyebrow?: ReactNode;
  /** The page's only H1. Every static H1 ends in a full stop except a blog post title. */
  h1: string;
  /** One sentence, or a node when the page needs two paragraphs. Rendered under the facts. */
  sub?: ReactNode;
  /** One to three one-line facts. Omitted entirely on /projects, which carries no price line. */
  facts?: readonly string[];
  /** snake_case area name, for data-cta-location. Kept verbatim per page: it is live analytics. */
  ctaLocation: string;
  /** /privacy and /contact carry no hero buttons; both flags go false there. */
  showCall?: boolean;
  showWhatsApp?: boolean;
  /**
   * Right column from lg, below everything on a phone, and after the telephone link in DOM
   * order: no form may precede the number a caller is looking for. `data-hero-aside` keeps a
   * callback card out of the hero copy budget tests/town-headline.spec.ts measures.
   */
  aside?: ReactNode;
  /** Anything the page adds under the buttons: the callback text link, a conditional notice. */
  children?: ReactNode;
}

/** Bold the first sentence of a fact line, so the skim reader gets the fact and nothing else. */
function splitLead(line: string): { lead: string; rest: string } {
  const at = line.indexOf(". ");
  if (at === -1) return { lead: line, rest: "" };
  return { lead: line.slice(0, at + 1), rest: line.slice(at + 2) };
}

export default function StaticHero({
  image,
  crumbs,
  eyebrow,
  h1,
  sub,
  facts,
  ctaLocation,
  showCall = true,
  showWhatsApp = true,
  aside,
  children,
}: StaticHeroProps) {
  const hasButtons = showCall || showWhatsApp;

  // The two-column grid only exists when there is a second column. A page with no aside keeps
  // the single measured column it had before, so nothing shifts on the pages that have none.
  const container = aside
    ? "mx-auto grid max-w-content items-start gap-10 px-5 pb-14 pt-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pb-20 lg:pt-12"
    : "mx-auto max-w-content px-5 pb-14 pt-8 sm:px-8 lg:pb-20 lg:pt-12";

  return (
    <section id="hero" className="relative isolate overflow-hidden bg-paper">
      <HeroBackdrop image={image} />

      <div className={container}>
        <div className="max-w-[38rem]">
          {crumbs && <div className="mb-5">{crumbs}</div>}

          {eyebrow && (
            <p className="animate-fade-up mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-tint">
              {eyebrow}
            </p>
          )}

          <h1 className="mb-5 max-w-[20ch] text-pretty font-display text-[clamp(34px,4.6vw,60px)] font-extrabold leading-[1.02] text-brand">
            {h1}
          </h1>

          {hasButtons && (
            <div className="mb-3 flex flex-col gap-3 sm:flex-row">
              {showCall && (
                <Button
                  as="a"
                  href={CALL_HREF}
                  variant="primary"
                  size="xl"
                  className="nums w-full sm:w-auto"
                  data-cta="phone"
                  data-cta-location={ctaLocation}
                  data-cta-variant="primary_button"
                >
                  <Phone size={20} weight="fill" aria-hidden />
                  Call {CALL_NUMBER_DISPLAY}
                </Button>
              )}
              {showWhatsApp && (
                <Button
                  as="a"
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="whatsapp"
                  size="xl"
                  className="w-full sm:w-auto"
                  data-cta="whatsapp"
                  data-cta-location={ctaLocation}
                  data-cta-variant="secondary_button"
                >
                  <WhatsappLogo size={22} weight="fill" aria-hidden />
                  WhatsApp us
                </Button>
              )}
            </div>
          )}

          {children && <div className="mb-3">{children}</div>}

          {facts?.map((fact) => {
            const { lead, rest } = splitLead(fact);
            return (
              <p key={fact} className="animate-fade-up-2 mb-1 text-[14.5px] leading-snug text-slate">
                <strong className="font-semibold text-brand">{lead}</strong>
                {rest ? ` ${rest}` : ""}
              </p>
            );
          })}

          {sub && (
            <div className="animate-fade-up-2 mt-4 flex max-w-[48ch] flex-col gap-3 text-[16px] leading-[1.6] text-slate">
              {typeof sub === "string" ? <p>{sub}</p> : sub}
            </div>
          )}
        </div>

        {aside && <div data-hero-aside className="w-full lg:max-w-[440px] lg:justify-self-end">{aside}</div>}
      </div>
    </section>
  );
}
