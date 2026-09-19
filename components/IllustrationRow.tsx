import Image from "next/image";
import { ILLUSTRATION_BY_SLUG } from "@/lib/media";

// AI-made drawings of the PROBLEM, in their own row. Every tile carries a visible "Illustration"
// badge, because these are not photographs of jobs we did and must never read as if they were.
// That is also why this is a separate component from ProofStrip, which shows real work only.
export default function IllustrationRow({
  slugs,
  heading = "What it can look like",
  tinted = false,
}: {
  slugs: readonly string[];
  heading?: string;
  tinted?: boolean;
}) {
  const items = slugs.map((slug) => ILLUSTRATION_BY_SLUG[slug]).filter(Boolean);
  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="illustrations-heading"
      className={tinted ? "border-t border-line bg-paper-2" : "bg-paper"}
    >
      <div className="mx-auto max-w-content px-5 py-14 sm:px-8 md:py-16">
        <h2 id="illustrations-heading" className="font-display text-[clamp(22px,2.6vw,30px)] font-extrabold leading-[1.1] text-brand">
          {heading}
        </h2>
        <ul className={`mt-6 grid gap-5 ${items.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
          {items.map((item) => (
            <li key={item.slug}>
              <figure>
                <div className="relative overflow-hidden rounded-card border border-line bg-white">
                  <Image
                    src={item.file}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    sizes="(max-width: 639px) 100vw, 33vw"
                    loading="lazy"
                    className="h-auto w-full"
                  />
                  <span className="absolute left-3 top-3 rounded-chip bg-ink/85 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    Illustration
                  </span>
                </div>
                <figcaption className="mt-2 text-[14px] leading-[1.5] text-slate">{item.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
