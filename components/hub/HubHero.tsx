import type { ReactNode } from "react";
import StaticHero from "@/components/static/StaticHero";
import type { HeroImageKey } from "@/lib/media";

// The first screen of a hub page (/services, /areas-we-cover).
//
// It is now a thin name over components/static/StaticHero.tsx, which is the one hero every
// static page on the site renders. The pattern this file used to hold on its own is unchanged:
// breadcrumb, eyebrow, H1, the Call pill then the WhatsApp pill, then the one-line facts, over a
// decorative photograph. It simply lives in one place now, so a hub and a legal notice cannot
// drift apart again.
//
// The call for a hub still goes through the page's own `ctaLocation`, so the analytics that
// distinguish `services_hub` from `areas_index` are untouched.

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
  /** The callback card on /services. Right column from lg, below the text on a phone, and after
   *  the telephone link in DOM order: no form may precede the number a caller is looking for. */
  aside?: ReactNode;
}

export default function HubHero({ image, crumbs, eyebrow, h1, facts, sub, ctaLocation, aside }: Props) {
  return (
    <StaticHero
      image={image}
      crumbs={crumbs}
      eyebrow={eyebrow}
      h1={h1}
      facts={facts}
      sub={sub}
      ctaLocation={ctaLocation}
      aside={aside}
    />
  );
}
