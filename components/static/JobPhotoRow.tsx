import Image from "next/image";
import AnimateIn from "@/components/AnimateIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { PHOTO_BY_SLUG } from "@/lib/media";

interface Props {
  /** Slugs from lib/media.ts. Unknown ones, and the brand graphic, are skipped. */
  slugs: readonly string[];
  eyebrow?: string;
  heading: string;
  /** paper-2 with a hairline top, for alternating against the section above. */
  tinted?: boolean;
}

// Two or three of our own job photos, for the static pages. The same contract as
// components/ProofStrip.tsx: first-party pictures only, with `alt` and the caption taken
// straight from the data and never rewritten. A shorter row, because the static pages are meant
// to be read in one scroll rather than to carry a gallery.
export default function JobPhotoRow({ slugs, eyebrow = "Our own jobs", heading, tinted = false }: Props) {
  const photos = slugs.map((slug) => PHOTO_BY_SLUG[slug]).filter((photo) => Boolean(photo) && !photo.illustration);
  if (photos.length === 0) return null;

  return (
    <section className={tinted ? "border-t border-line bg-paper-2" : "bg-paper"}>
      <div className="mx-auto max-w-content px-5 py-16 sm:px-8 md:py-20">
        <AnimateIn>
          <SectionHeading eyebrow={eyebrow} title={heading} />
        </AnimateIn>

        <div
          className={`mt-8 grid gap-3 md:gap-4 ${photos.length >= 4 ? "grid-cols-2 md:grid-cols-4" : photos.length === 3 ? "grid-cols-3" : "grid-cols-2 md:max-w-[40rem]"}`}
        >
          {photos.map((photo) => (
            <figure key={photo.slug} className="m-0">
              <div className="relative aspect-[3/4] overflow-hidden rounded-card border border-line bg-paper-2">
                <Image
                  src={photo.file}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes="(max-width: 767px) 50vw, 25vw"
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
