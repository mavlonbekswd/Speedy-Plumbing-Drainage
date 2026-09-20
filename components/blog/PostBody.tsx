import Image from "next/image";
import ZoomableImage from "@/components/ZoomableImage";
import { PHOTO_BY_SLUG } from "@/lib/media";
import { photosForPost } from "@/components/blog/postMedia";

// The body of an advice post: the sections, with one or two of our own job photographs dropped
// in where the text is about the thing in the frame.
//
// The captions and the alt text come from lib/media.ts exactly as written there. They are
// claims-reviewed and they say what is in the frame and nothing else, so nothing on this page
// may reword one into a story about a customer, a town or a time.

/** A section's `p` holds its paragraphs separated by a blank line, so each stays its own <p>. */
function paragraphsOf(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function JobPhoto({ slug }: { slug: string }) {
  const photo = PHOTO_BY_SLUG[slug];
  if (!photo || photo.illustration) return null;

  // Every job photograph in lib/media.ts is portrait, shot on a phone. A 4:5 box at a modest
  // width keeps the subject in frame, which a wide crop of a 9:16 original would not.
  return (
    <figure className="m-0 max-w-[24rem]">
      <ZoomableImage src={photo.file} alt={photo.alt} caption={photo.caption} location="blog_post">
        <div className="relative aspect-[4/5] overflow-hidden rounded-card border border-line bg-paper">
          <Image
            src={photo.file}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 767px) 100vw, 384px"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </ZoomableImage>
      <figcaption className="mt-2 text-[13.5px] leading-snug text-slate">{photo.caption}</figcaption>
    </figure>
  );
}

export default function PostBody({
  slug,
  body,
}: {
  slug: string;
  body: readonly { h: string; p: string }[];
}) {
  const photos = photosForPost(slug);

  return (
    <div className="flex max-w-[66ch] flex-col gap-10">
      {body.map((block, index) => (
        <div key={block.h} className="flex flex-col gap-4">
          <h2 className="font-display text-[clamp(22px,2.4vw,30px)] font-extrabold leading-[1.15] text-brand">
            {block.h}
          </h2>

          {paragraphsOf(block.p).map((paragraph) => (
            <p key={paragraph} className="text-[16.5px] leading-[1.75] text-slate">
              {paragraph}
            </p>
          ))}

          {photos
            .filter((photo) => photo.after === index)
            .map((photo) => (
              <JobPhoto key={photo.slug} slug={photo.slug} />
            ))}
        </div>
      ))}
    </div>
  );
}
