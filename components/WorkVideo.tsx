"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "@phosphor-icons/react/dist/ssr";
import { VIDEO_BY_SLUG } from "@/lib/media";
import { trackVideoPlay } from "@/lib/analytics";

// One job clip as a proof tile. Nothing but the poster is fetched on load: the <video> element
// is not in the DOM at all until the visitor presses play, so the page costs a poster image and
// no more. autoplay only ever follows that press, which is why muted autoplay here does not
// fight prefers-reduced-motion.
export default function WorkVideo({ slug, className = "" }: { slug: string; className?: string }) {
  const [playing, setPlaying] = useState(false);
  const video = VIDEO_BY_SLUG[slug];
  if (!video) return null;

  return (
    <figure className={`m-0 ${className}`}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-card border border-line bg-paper-2">
        {playing ? (
          <video
            controls
            autoPlay
            muted
            playsInline
            preload="none"
            poster={video.poster}
            width={video.width}
            height={video.height}
            className="h-full w-full object-cover"
          >
            <source src={video.file} type="video/mp4" />
          </video>
        ) : (
          <>
            <Image
              src={video.poster}
              alt={video.caption}
              width={video.width}
              height={video.height}
              sizes="(max-width: 767px) 50vw, 33vw"
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              aria-label={video.label}
              onClick={() => {
                setPlaying(true);
                trackVideoPlay(video.slug);
              }}
              className="press absolute inset-0 flex items-center justify-center bg-ink/25"
            >
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-pill bg-white shadow-lift">
                <Play size={26} weight="fill" className="text-brand" aria-hidden />
              </span>
            </button>
          </>
        )}
      </div>
      <figcaption className="mt-2 text-[13.5px] leading-snug text-slate">{video.caption}</figcaption>
    </figure>
  );
}
