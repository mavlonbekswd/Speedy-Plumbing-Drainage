import { Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import AnimateIn from "@/components/AnimateIn";
import Button from "@/components/ui/Button";
import { CALL_HREF, CALL_NUMBER_DISPLAY, WHATSAPP_URL } from "@/lib/site";

// The one action, repeated at scroll depth, on a full-bleed brand band so it reads as a break in
// the page rather than another card. No decoration: the band is the emphasis.
export default function CTABand({ heading, sub }: { heading: string; sub: string }) {
  return (
    <section className="bg-brand">
      <div className="mx-auto max-w-content px-5 py-14 sm:px-8 md:py-16">
        <AnimateIn>
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-pretty font-display text-[clamp(26px,3.2vw,38px)] font-extrabold leading-[1.05] text-white">
                {heading}
              </h2>
              <p className="mt-2 max-w-[48ch] text-[16px] leading-[1.6] text-white/80">{sub}</p>
            </div>

            <div className="flex flex-shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                as="a"
                href={CALL_HREF}
                variant="primary"
                size="lg"
                className="nums"
                data-cta="phone"
                data-cta-location="cta_band"
                data-cta-variant="primary_button"
              >
                <Phone size={20} weight="fill" aria-hidden />
                Call {CALL_NUMBER_DISPLAY}
              </Button>
              <Button
                as="a"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="ghost"
                size="lg"
                className="text-white"
                data-cta="whatsapp"
                data-cta-location="cta_band"
                data-cta-variant="secondary_button"
              >
                <WhatsappLogo size={20} weight="fill" aria-hidden />
                WhatsApp us
              </Button>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
