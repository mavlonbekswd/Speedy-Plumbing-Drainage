import Image from "next/image";
import AnimateIn from "@/components/AnimateIn";
import SectionHeading from "@/components/ui/SectionHeading";
import WorkVideo from "@/components/WorkVideo";
import { PHOTO_BY_SLUG, VIDEO_BY_SLUG } from "@/lib/media";

interface Props {
  /** Slugs from lib/media.ts. Unknown ones are skipped without complaint. */
  photoSlugs: readonly string[];
  /** When set, the clip leads the grid and the photo count drops to five, so the grid is six tiles. */
  videoSlug?: string;
  heading?: string;
  /** paper-2 with a hairline top, for alternating against the section above. */
  tinted?: boolean;
  /** Shorter vertical rhythm, for the long templates. Opt-in: no other page changes height. */
  compact?: boolean;
}

// The page's own work, photographed on the job. Every tile is first-party: the brand graphic in
// lib/media.ts is marked `illustration` and is filtered out here, because a drawing in a gallery
// of real jobs is exactly the thing this section exists to avoid.
//
// Portrait boxes with object-cover, so phone-shot photos of different shapes still line up.
export default function ProofStrip({
  photoSlugs,
  videoSlug,
  heading = "Recent work",
  tinted = true,
  compact = false,
}: Props) {
  const video = videoSlug ? VIDEO_BY_SLUG[videoSlug] : undefined;
  const photos = photoSlugs
    .map((slug) => PHOTO_BY_SLUG[slug])
    .filter((photo) => Boolean(photo) && !photo.illustration)
    .slice(0, video ? 5 : 6);

  if (photos.length === 0 && !video) return null;

  return (
    <section id="work" className={tinted ? "border-t border-line bg-paper-2" : "bg-paper"}>
      <div
        className={`mx-auto max-w-content px-5 sm:px-8 ${compact ? "py-14 md:py-20" : "py-20 md:py-28"}`}
      >
        <AnimateIn>
          <SectionHeading eyebrow="Our own jobs" title={heading} />
        </AnimateIn>

        <div className={`grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 ${compact ? "mt-8" : "mt-10"}`}>
          {video && <WorkVideo slug={video.slug} />}
          {photos.map((photo) => (
            <figure key={photo.slug} className="m-0">
              <div className="relative aspect-[3/4] overflow-hidden rounded-card border border-line bg-paper-2">
                <Image
                  src={photo.file}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes="(max-width: 767px) 50vw, 33vw"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-2 text-[13.5px] leading-snug text-slate">{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
