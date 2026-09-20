import Image from "next/image";
import ZoomableImage from "@/components/ZoomableImage";
import { ILLUSTRATION_BY_SLUG } from "@/lib/media";

// Pictures of the PROBLEM, from ILLUSTRATIONS in lib/media.ts. They are AI-generated scenes,
// photoreal since 19 September 2026, made because the owner has no photographs of an emergency
// or a blocked drain. They are never a job Speedy did, which is why this is a separate component
// from ProofStrip and why nothing here may ever appear in a proof strip or on /projects.
//
// The owner removed the visible "Illustration" badge on 19 September 2026. Two things carry the
// honesty now, and neither may be dropped:
//   - the heading, "What it can look like", which frames the whole group as a problem, not work;
//   - the caption from the data, which names the problem and claims no job, place, date or result.
// /terms says some pictures on the site are representative and that /projects is our own work.
//
// Two shapes. "section" is the standalone row. "aside" drops the section wrapper and the h2 so
// the pictures can sit inside the problem section, directly under the cards, which is where a
// reader who is trying to match what they can see actually wants them.
export default function IllustrationRow({
  slugs,
  heading = "What it can look like",
  tinted = false,
  variant = "section",
}: {
  slugs: readonly string[];
  heading?: string;
  tinted?: boolean;
  variant?: "section" | "aside";
}) {
  const items = slugs.map((slug) => ILLUSTRATION_BY_SLUG[slug]).filter(Boolean);
  if (items.length === 0) return null;

  if (variant === "aside") {
    return (
      <div>
        <h3 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-tint">{heading}</h3>
        <ul className={`mt-4 grid gap-2.5 sm:gap-4 ${items.length >= 3 ? "grid-cols-3" : "grid-cols-2"}`}>
          {items.map((item) => (
            <li key={item.slug}>
              <figure>
                <ZoomableImage src={item.file} alt={item.alt} caption={item.caption} location="scene_row">
                  <div className="overflow-hidden rounded-card border border-line bg-white">
                    <Image
                      src={item.file}
                      alt={item.alt}
                      width={item.width}
                      height={item.height}
                      sizes="(max-width: 639px) 50vw, 33vw"
                      loading="lazy"
                      className="h-auto w-full"
                    />
                  </div>
                </ZoomableImage>
                <figcaption className="mt-2 text-[13.5px] leading-[1.5] text-slate">{item.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="illustrations-heading"
      className={tinted ? "border-t border-line bg-paper-2" : "bg-paper"}
    >
      <div className="mx-auto max-w-content px-5 py-14 sm:px-8 md:py-20">
        <h2
          id="illustrations-heading"
          className="text-pretty font-display text-[clamp(22px,2.4vw,30px)] font-extrabold leading-[1.15] text-brand"
        >
          {heading}
        </h2>
        <ul className={`mt-6 grid gap-2.5 sm:gap-5 ${items.length >= 3 ? "grid-cols-3" : "grid-cols-2"}`}>
          {items.map((item) => (
            <li key={item.slug}>
              <figure>
                <ZoomableImage src={item.file} alt={item.alt} caption={item.caption} location="scene_row">
                  <div className="overflow-hidden rounded-card border border-line bg-white">
                    <Image
                      src={item.file}
                      alt={item.alt}
                      width={item.width}
                      height={item.height}
                      sizes="(max-width: 639px) 50vw, 33vw"
                      loading="lazy"
                      className="h-auto w-full"
                    />
                  </div>
                </ZoomableImage>
                <figcaption className="mt-2 text-[14px] leading-[1.5] text-slate">{item.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
