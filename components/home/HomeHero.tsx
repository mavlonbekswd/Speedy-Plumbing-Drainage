import { Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import Button from "@/components/ui/Button";
import CallbackInline from "@/components/CallbackInline";
import HeroBackdrop from "@/components/HeroBackdrop";
import { COVERAGE_SHORT, PRICE_PROCESS_LINE } from "@/lib/claims";
import { CALL_HREF, CALL_NUMBER_DISPLAY, WHATSAPP_URL } from "@/lib/site";

// The first screen of the home page, built to the same contract as components/ServiceHero.tsx:
// eyebrow, H1, the two pills, then the facts, with the callback card in the right column from lg
// and below everything on a phone.
//
// Deliberately NOT geo-personalised. Reading the geo header would take the whole route off the
// static path, and the owner's brief puts speed first on the page most visitors land on. The
// eyebrow therefore names the footprint rather than the visitor's town.
//
// The photograph behind it is decoration (components/HeroBackdrop.tsx): the section is
// `relative isolate overflow-hidden` so the backdrop's paper gradient sits under the text and
// nothing here needs a z-index. Text stays on the gradient side; the picture fills the right.
//
// The call link is server-rendered, is the page's only hero telephone link, and neither it nor
// any ancestor carries a fade class: `animate-fade-up*` sets opacity 0 through its backwards
// fill, and a call button nobody can see at 3am is not a call button. The H1 is left alone as
// well, so the largest paint is not held back for a flourish.

/** Bold the first sentence of a fact line, so the skim reader gets the fact and nothing else. */
function splitLead(line: string): { lead: string; rest: string } {
  const at = line.indexOf(". ");
  if (at === -1) return { lead: line, rest: "" };
  return { lead: line.slice(0, at + 1), rest: line.slice(at + 2) };
}

/** The one sentence that separates the urgent half of the work from the booked half. */
const WHEN_LINE =
  "Emergencies same day, with you within 45 minutes. Everything else booked for a time that suits you.";

// Two facts, not three. The owner's review of 19 September 2026 cut the answering sentence out of
// the first screen, and nothing was put back in its place: at 390x844 the first screen is a
// decision (the headline, the number, WhatsApp) and every line added to it pushes the number
// down the page.
const FACTS = [PRICE_PROCESS_LINE, WHEN_LINE];

export default function HomeHero() {
  return (
    <section id="hero" className="relative isolate overflow-hidden bg-paper">
      <HeroBackdrop image="home" />

      <div className="mx-auto grid max-w-content items-start gap-10 px-5 pb-14 pt-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-12 lg:pb-20 lg:pt-12">
        <div className="max-w-[38rem]">
          <p className="animate-fade-up mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-tint">
            Plumbing and drainage across {COVERAGE_SHORT}
          </p>

          <h1 className="mb-5 text-pretty font-display text-[clamp(38px,4.6vw,62px)] font-extrabold leading-[0.98] text-brand">
            Burst pipe or blocked drain? Ring us. We will be with you.
          </h1>

          <div className="mb-3 flex flex-col gap-3 sm:flex-row">
            <Button
              as="a"
              href={CALL_HREF}
              variant="primary"
              size="xl"
              className="nums w-full sm:w-auto"
              data-cta="phone"
              data-cta-location="hero"
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
              variant="whatsapp"
              size="xl"
              className="w-full sm:w-auto"
              data-cta="whatsapp"
              data-cta-location="hero"
              data-cta-variant="secondary_button"
            >
              <WhatsappLogo size={22} weight="fill" aria-hidden />
              WhatsApp us
            </Button>
          </div>

          {FACTS.map((fact) => {
            const { lead, rest } = splitLead(fact);
            return (
              <p key={fact} className="animate-fade-up-2 mb-1 text-[14.5px] leading-snug text-slate">
                <strong className="font-semibold text-brand">{lead}</strong>
                {rest ? ` ${rest}` : ""}
              </p>
            );
          })}
        </div>

        {/* After the call link in DOM order, and below the text on a phone: no form precedes the
            number a caller is looking for. data-hero-aside keeps the card out of the hero copy
            budget the first-screen test measures. */}
        <div data-hero-aside className="w-full lg:max-w-[440px] lg:justify-self-end">
          <CallbackInline formId="home_hero" idPrefix="home_hero" />
        </div>
      </div>
    </section>
  );
}
