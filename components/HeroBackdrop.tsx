import { HERO_IMAGE_BY_KEY, type HeroImageKey } from "@/lib/media";

// The photograph behind a page's first screen, at 50% opacity (owner, 19 Sept 2026; first 40%,
// then raised to 50% the same day).
//
// Rules this component exists to keep:
//  - It is decoration. `alt=""` plus `aria-hidden`, so a screen reader never meets it and nothing
//    about the page depends on seeing it.
//  - The picture is a generated scene, not a job we did. It is never captioned, never linked and
//    never reused in a proof strip or on /projects (lib/media.ts HERO_IMAGES).
//  - Text never sits on the photograph itself. A paper gradient covers the left two thirds, where
//    the H1, the buttons and the facts are, so their contrast is the same as on a plain page.
//  - It must not cost the first paint: a plain <img> with a 768px source for phones, a high fetch
//    priority and fixed intrinsic dimensions. No layout shift, because it is absolutely placed.
//
// The parent must be `relative isolate overflow-hidden`; its content needs no z-index.
export default function HeroBackdrop({ image, dark = false }: { image: HeroImageKey; dark?: boolean }) {
  const hero = HERO_IMAGE_BY_KEY[image];
  const small = hero.file.replace(/\.webp$/, "-768.webp");
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={hero.file}
        srcSet={`${small} 768w, ${hero.file} 1440w`}
        sizes="100vw"
        alt=""
        aria-hidden="true"
        width={hero.width}
        height={hero.height}
        fetchPriority="high"
        decoding="async"
        className="h-full w-full object-cover object-right opacity-50"
      />
      <div
        className={
          dark
            ? "absolute inset-0 bg-gradient-to-r from-brand via-brand/90 to-brand/40"
            : "absolute inset-0 bg-gradient-to-r from-paper via-paper/90 to-paper/30 max-lg:from-paper/95 max-lg:via-paper/90 max-lg:to-paper/80"
        }
      />
    </div>
  );
}
