import { TRADING_NAME } from "@/lib/site";

// The roadrunner mark plus an HTML wordmark, wrapped in the link home.
//
// The mark is an original drawing of the real roadrunner bird, generated for this business on
// 19 Sept 2026 (public/brand/roadrunner*.webp). It is deliberately NOT the animated film
// character of the same name, which is a third party's trademark: never swap that in.
//
// The wordmark is HTML rather than part of the image, so it takes the loaded display face and
// scales with the rest of the type. `dark` is the footer: a white mark and a white wordmark.
// `ctaLocation` exists because the same link sits in more than one place and the tracking has
// to say which. Plain <img> with explicit dimensions: it is 12 KB, above the fold on every page,
// and needs neither the image optimiser nor lazy loading.
export default function Logo({
  dark = false,
  className = "",
  ctaLocation = "header",
}: {
  dark?: boolean;
  className?: string;
  /** Where this instance sits, for the click event. */
  ctaLocation?: "header" | "footer" | "header_mobile_menu";
}) {
  return (
    <a
      href="/"
      aria-label={`${TRADING_NAME}, home`}
      data-cta="nav"
      data-cta-location={ctaLocation}
      data-cta-variant="text_link"
      className={`inline-flex flex-shrink-0 items-center gap-2.5 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dark ? "/brand/roadrunner-white.webp" : "/brand/roadrunner.webp"}
        srcSet={dark ? undefined : "/brand/roadrunner.webp 1x, /brand/roadrunner@2x.webp 2x"}
        alt=""
        width={72}
        height={36}
        decoding="async"
        className="h-9 w-[72px] flex-shrink-0"
      />

      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[21px] font-extrabold italic leading-none tracking-[-0.02em] ${
            dark ? "text-white" : "text-brand"
          }`}
        >
          SPEEDY
        </span>
        <span
          className={`mt-[3px] text-[9.5px] font-bold uppercase leading-none tracking-[0.13em] ${
            dark ? "text-white/70" : "text-slate"
          }`}
        >
          Plumbing &amp; Drain
        </span>
      </span>
    </a>
  );
}
