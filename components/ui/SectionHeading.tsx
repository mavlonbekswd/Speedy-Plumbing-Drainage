import type { ReactNode } from "react";

// Eyebrow, h2 and an optional sub-line. `dark` flips the colours for brand bands.
export default function SectionHeading({
  eyebrow,
  title,
  sub,
  dark = false,
  align = "left",
  className = "",
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  dark?: boolean;
  align?: "left" | "center";
  className?: string;
  id?: string;
}) {
  const centred = align === "center";
  return (
    <div className={`${centred ? "mx-auto max-w-[44rem] text-center" : ""} ${className}`}>
      {eyebrow && (
        <p
          className={`mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] ${dark ? "text-tint-bright" : "text-tint"}`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        className={`font-display text-[clamp(28px,3.4vw,42px)] font-extrabold leading-[1.05] text-pretty ${dark ? "text-white" : "text-brand"}`}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={`mt-4 max-w-[58ch] text-[16.5px] leading-[1.6] ${dark ? "text-white/80" : "text-slate"} ${centred ? "mx-auto" : ""}`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
