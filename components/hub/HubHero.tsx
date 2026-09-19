import type { ReactNode } from "react";
import { Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import HeroBackdrop from "@/components/HeroBackdrop";
import Button from "@/components/ui/Button";
import type { HeroImageKey } from "@/lib/media";
import { CALL_HREF, CALL_NUMBER_DISPLAY, WHATSAPP_URL } from "@/lib/site";

// The first screen of a hub page (/services, /areas-we-cover), built to the same contract as
// components/ServiceHero.tsx and components/home/HomeHero.tsx: eyebrow, H1, the two pills, then
// the one-line facts. A hub page has no hero form, so the text column stands on its own and the
// photograph behind it fills the space the callback card takes on a service page.
//
// The section is `relative isolate overflow-hidden` because HeroBackdrop is absolutely placed
// inside it. The text stays in the left column, which is where the paper gradient is, so the
// contrast is the same as on a page with no picture at all.
//
// Neither the call button nor the H1 carries a fade class: an animated call button is a call
// button nobody can see for half a second, and the H1 is the largest paint.

interface Props {
  image: HeroImageKey;
  /** Breadcrumb slot. A node, not data, so this component never imports the breadcrumb itself. */
  crumbs?: ReactNode;
  eyebrow: string;
  h1: string;
  /** One-line facts under the buttons. The price-process line goes first on every hub. */
  facts: readonly string[];
  /** One sentence under the facts, for the page that needs to name its footprint. */
  sub?: string;
  /** snake_case area name, for data-cta-location. */
  ctaLocation: string;
}

/** Bold the first sentence of a fact line, so the skim reader gets the fact and nothing else. */
function splitLead(line: string): { lead: string; rest: string } {
  const at = line.indexOf(". ");
  if (at === -1) return { lead: line, rest: "" };
  return { lead: line.slice(0, at + 1), rest: line.slice(at + 2) };
}

export default function HubHero({ image, crumbs, eyebrow, h1, facts, sub, ctaLocation }: Props) {
  return (
    <section id="hero" className="relative isolate overflow-hidden bg-paper">
      <HeroBackdrop image={image} />

      <div className="mx-auto max-w-content px-5 pb-14 pt-8 sm:px-8 lg:px-12 lg:pb-20 lg:pt-12">
        <div className="max-w-[38rem]">
          {crumbs && <div className="mb-5">{crumbs}</div>}

          <p className="animate-fade-up mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-tint">
            {eyebrow}
          </p>

          <h1 className="mb-5 max-w-[20ch] text-pretty font-display text-[clamp(34px,4.6vw,58px)] font-extrabold leading-[1.02] text-brand">
            {h1}
          </h1>

          <div className="mb-3 flex flex-col gap-3 sm:flex-row">
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
          </div>

          {facts.map((fact) => {
            const { lead, rest } = splitLead(fact);
            return (
              <p key={fact} className="animate-fade-up-2 mb-1 text-[14.5px] leading-snug text-slate">
                <strong className="font-semibold text-brand">{lead}</strong>
                {rest ? ` ${rest}` : ""}
              </p>
            );
          })}

          {sub && (
            <p className="animate-fade-up-2 mt-4 max-w-[48ch] text-[16px] leading-[1.6] text-slate">{sub}</p>
          )}
        </div>
      </div>
    </section>
  );
}
