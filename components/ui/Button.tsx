import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "whatsapp" | "dark" | "light" | "ghost";
type Size = "md" | "lg" | "xl";

// Ink text on the CTA and WhatsApp colours, never white: both pass AA against ink and fail it against white.
const VARIANT: Record<Variant, string> = {
  primary: "bg-cta text-ink hover:bg-cta-deep",
  whatsapp: "bg-whatsapp text-ink hover:brightness-95",
  dark: "bg-brand text-white hover:bg-brand-2",
  light: "bg-white text-brand border border-line hover:bg-paper-2",
  ghost: "bg-transparent text-current border-[1.5px] border-current hover:bg-white/10",
};
// md is the 44px tap-target floor, lg the header and band size, xl the hero call pill.
const SIZE: Record<Size, string> = {
  md: "min-h-[44px] px-5 text-[14.5px]",
  lg: "min-h-[52px] px-7 text-[16px]",
  xl: "min-h-[60px] px-8 text-[18px] font-bold",
};
const BASE =
  "press inline-flex items-center justify-center gap-2 rounded-pill font-semibold whitespace-nowrap disabled:opacity-50";

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };
type AnchorProps = Common & { as: "a"; href: string } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "href" | "className" | "children"
  >;
type ButtonProps = Common & { as?: "button" } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "className" | "children"
  >;

// Every CTA on the site goes through this, so the pill radius, the tap-target floor and the press
// feedback cannot drift. data-cta attributes pass straight through to the element.
export default function Button(props: AnchorProps | ButtonProps) {
  const { variant = "primary", size = "lg", className = "", children } = props;
  const cls = `${BASE} ${VARIANT[variant]} ${SIZE[size]} ${className}`;
  if (props.as === "a") {
    const { as: _as, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
    return (
      <a className={cls} {...rest}>
        {children}
      </a>
    );
  }
  const { as: _as, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props as ButtonProps;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
