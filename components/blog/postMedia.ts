import type { HeroImageKey } from "@/lib/media";
import { FALLBACK_HERO } from "@/lib/media";

// Which picture belongs to which advice post.
//
// Two separate things live here and they are not interchangeable:
//
//  - HERO_BY_POST is a HERO_IMAGES key. That picture is decoration behind the first screen. It
//    is generated, not a job we did, so HeroBackdrop gives it no alt text and no caption and
//    nothing on the page refers to it.
//  - PHOTOS_BY_POST names REAL job photos from lib/media.ts by slug. Those carry their own alt
//    and their own claims-reviewed caption, which is never rewritten here. `after` is the index
//    of the body block the figure follows, so a post is not a wall of text.
//
// Data only: no React, so a client component could import it without dragging content in.

export const HERO_BY_POST: Readonly<Record<string, HeroImageKey>> = {
  "what-to-do-burst-pipe": "emergency-plumbing",
  "why-drains-keep-blocking": "blocked-drains",
  "signs-of-hidden-leak": "leak-repairs",
};

export function heroForPost(slug: string): HeroImageKey {
  return HERO_BY_POST[slug] ?? FALLBACK_HERO;
}

export interface PostPhoto {
  /** Index of the body block this figure is placed after. */
  after: number;
  /** A slug in PHOTO_BY_SLUG. An unknown one is skipped rather than rendered empty. */
  slug: string;
}

export const PHOTOS_BY_POST: Readonly<Record<string, readonly PostPhoto[]>> = {
  "what-to-do-burst-pipe": [
    { after: 0, slug: "under-sink-wastes" },
    { after: 2, slug: "pipework-under-floor" },
  ],
  "why-drains-keep-blocking": [
    { after: 1, slug: "drain-jetting-manhole" },
    { after: 3, slug: "drain-jetting-hose" },
  ],
  "signs-of-hidden-leak": [
    { after: 0, slug: "water-supply-pipe" },
    { after: 2, slug: "pipework-under-floor" },
  ],
};

export function photosForPost(slug: string): readonly PostPhoto[] {
  return PHOTOS_BY_POST[slug] ?? [];
}
