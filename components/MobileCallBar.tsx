"use client";

import { useEffect, useState } from "react";
import { Phone } from "@phosphor-icons/react/dist/ssr";
import { MOBILE_CALL_BAR_LABEL } from "@/lib/claims";
import { CALL_HREF, CALL_NUMBER_DISPLAY } from "@/lib/site";

// The fixed bar below 640px. On a phone the number has left the header, so this is where it
// lives: someone standing in water should never have to hunt for it.
//
// Since 9 Oct 2026 (design review) the bar steps aside while another Call button is fully on
// screen, which on most pages is the hero's. Two identical yellow pills on one screen was one too
// many, and the bar sat on top of the hero form's submit button. The rule the bar exists for still
// holds: there is always a Call button in view, because the bar comes back the moment the other
// one leaves. Without JavaScript the bar simply stays, as it always did.
//
// FOR PAGE AUTHORS: a page that renders this must put the class `has-callbar` on its outermost
// wrapper (or on <main>). app/globals.css turns that into 76px of bottom padding below 640px,
// which is exactly this bar's height (52px pill + 12px padding top and bottom), so the bar
// never covers the last line of the page. Leave the bar off /privacy. One pill only since
// 30 Sept 2026: the WhatsApp round button came out so the number is the whole bar.
export default function MobileCallBar() {
  const [stepAside, setStepAside] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const others = Array.from(
      document.querySelectorAll<HTMLElement>('a[data-cta="phone"]:not([data-cta-location="sticky_bar_mobile"])'),
    ).filter((el) => el.offsetWidth >= 44 && el.offsetHeight >= 44);
    if (others.length === 0) return;

    const inView = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio >= 0.99) inView.add(entry.target);
          else inView.delete(entry.target);
        }
        setStepAside(inView.size > 0);
      },
      // The bottom 76px is where the bar sits, so a button under it does not count as in view.
      { threshold: [0, 0.99, 1], rootMargin: "0px 0px -76px 0px" },
    );
    others.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden={stepAside || undefined}
      inert={stepAside || undefined}
      className={`fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-paper/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-[10px] transition-transform duration-200 ease-out sm:hidden ${
        stepAside ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <a
        href={CALL_HREF}
        aria-label={MOBILE_CALL_BAR_LABEL(CALL_NUMBER_DISPLAY)}
        data-cta="phone"
        data-cta-location="sticky_bar_mobile"
        data-cta-variant="primary_button"
        tabIndex={stepAside ? -1 : undefined}
        className="nums press flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-pill bg-cta text-[0.96875rem] font-bold text-ink"
      >
        <Phone size={20} weight="fill" aria-hidden />
        {MOBILE_CALL_BAR_LABEL(CALL_NUMBER_DISPLAY)}
      </a>
    </div>
  );
}
