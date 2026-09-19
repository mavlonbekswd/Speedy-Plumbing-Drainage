import { Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { MOBILE_CALL_BAR_LABEL } from "@/lib/claims";
import { CALL_HREF, CALL_NUMBER_DISPLAY, WHATSAPP_URL } from "@/lib/site";

// The fixed bar below 640px. On a phone the number has left the header, so this is where it
// lives, always visible rather than revealed after a scroll: someone standing in water should
// never have to hunt for it.
//
// FOR PAGE AUTHORS: a page that renders this must put the class `has-callbar` on its outermost
// wrapper (or on <main>). app/globals.css turns that into 76px of bottom padding below 640px,
// which is exactly this bar's height (52px pill + 12px padding top and bottom), so the bar
// never covers the last line of the page. Leave the bar off /privacy.
export default function MobileCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2.5 border-t border-line bg-paper/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-[10px] sm:hidden">
      <a
        href={CALL_HREF}
        aria-label={MOBILE_CALL_BAR_LABEL(CALL_NUMBER_DISPLAY)}
        data-cta="phone"
        data-cta-location="sticky_bar_mobile"
        data-cta-variant="primary_button"
        className="nums press flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-pill bg-cta text-[15.5px] font-bold text-ink"
      >
        <Phone size={20} weight="fill" aria-hidden />
        {MOBILE_CALL_BAR_LABEL(CALL_NUMBER_DISPLAY)}
      </a>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp us"
        data-cta="whatsapp"
        data-cta-location="sticky_bar_mobile"
        data-cta-variant="icon_button"
        className="press flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-pill bg-whatsapp text-ink"
      >
        <WhatsappLogo size={24} weight="fill" aria-hidden />
      </a>
    </div>
  );
}
