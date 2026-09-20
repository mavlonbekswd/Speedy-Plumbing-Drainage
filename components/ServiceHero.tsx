import type { ReactNode } from "react";
import { Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import Button from "@/components/ui/Button";
import HeroBackdrop from "@/components/HeroBackdrop";
import { BOOKED_WORK_LINE, FREE_WHATSAPP_LINE, PRICE_FACT_LINE, SAME_DAY_LINE } from "@/lib/claims";
import type { HeroImageKey } from "@/lib/media";
import { CALL_HREF, CALL_NUMBER_DISPLAY, WHATSAPP_URL } from "@/lib/site";

interface Props {
  /** Breadcrumb slot. A node, not data, so this component never imports the breadcrumb itself. */
  crumbs?: ReactNode;
  eyebrow: string;
  h1Top: string;
  h1Bottom: string;
  sub: string;
  /** Urgent pages carry the same-day line; booked pages carry the appointment line instead. */
  urgent: boolean;
  /**
   * A service page for work you book a time for, rather than an emergency: a tap, a toilet, a
   * bathroom, hot water, a macerator. Owner review, 19 September 2026: somebody booking a tap
   * would rather send a picture and be told the price than ring and describe it. So on these
   * pages, and ONLY these, the WhatsApp button says what it does and FREE_WHATSAPP_LINE reads
   * directly under the buttons.
   *
   * The call still comes first in DOM order and is still the primary button: that is a contract
   * (tests/town-headline.spec.ts wants the telephone link before any form), not a preference.
   * Urgent service pages and every town page are untouched. There the call IS the action, and
   * their first screen is measured against a 60-word budget this line would spend.
   */
  booked?: boolean;
  /** A released line shown on the service page only, never on a town page. */
  serviceOnlyLine?: string;
  /** The decorative photograph behind the first screen, at 50% opacity. Never captioned. */
  heroImage?: HeroImageKey;
  /** The callback card. Right column from lg, below everything on a phone, and after the
   *  telephone link in DOM order: no form may precede the number a caller is looking for. */
  aside?: ReactNode;
}

/** Bold the first sentence of a fact line, so the skim reader gets the fact and nothing else. */
function splitLead(line: string): { lead: string; rest: string } {
  const at = line.indexOf(". ");
  if (at === -1) return { lead: line, rest: "" };
  return { lead: line.slice(0, at + 1), rest: line.slice(at + 2) };
}

// The first screen of a service or town page.
//
// Order, urgent and booked alike: eyebrow, H1, the buttons, then the two one-line facts, then
// the sub sentence. The buttons come before the reading matter because the person on the other
// end of it has water coming through a ceiling.
//
// The call link is server-rendered, is the page's only hero telephone link, and neither it nor
// any ancestor is animated: the fade classes go on text elements only, and the H1 is left alone
// as well so the largest paint is not delayed by half a second for a flourish.
//
// A photograph sits behind all of it at 50% opacity (owner, 19 September 2026) with a paper
// gradient under the text, which is why the section is `relative isolate overflow-hidden`. The
// picture is decoration: no alt, no caption, and the callback card stays opaque white over it.
export default function ServiceHero({
  crumbs,
  eyebrow,
  h1Top,
  h1Bottom,
  sub,
  urgent,
  booked = false,
  serviceOnlyLine,
  heroImage,
  aside,
}: Props) {
  // Two facts on an urgent page, not three. The owner removed "A plumber answers the phone, day or night." from
  // every hero on 19 September 2026; it and its second sentence now render together in answer
  // card 4 (PHONE_ANSWER), which is always in the document and never collapsed. At 390x844 the
  // first screen is a decision, not a page: hero copy is budgeted at 60 words
  // (tests/town-headline.spec.ts), and this change spends less of it.
  //
  // On a booked page a third line joins them, first, so it sits directly under the button it
  // belongs to. It adds nothing to either page the first-screen budget is measured on, and it
  // takes nothing away: PRICE_PROCESS_LINE and the appointment line both stay.
  const facts = booked
    ? [FREE_WHATSAPP_LINE, PRICE_FACT_LINE, BOOKED_WORK_LINE]
    : [PRICE_FACT_LINE, urgent ? SAME_DAY_LINE : BOOKED_WORK_LINE];

  return (
    <section id="hero" className="relative isolate overflow-hidden bg-paper">
      {heroImage && <HeroBackdrop image={heroImage} />}
      <div className="mx-auto grid max-w-content items-start gap-10 px-5 pb-14 pt-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pb-20 lg:pt-12">
        <div className="max-w-[38rem]">
          {crumbs && <div className="mb-5">{crumbs}</div>}

          {/* One eyebrow size everywhere, urgent or booked: 12px. The urgent pages ran 11px. */}
          <p className="animate-fade-up mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-tint">
            {eyebrow}
          </p>

          <h1
            className={`text-pretty font-display font-extrabold text-brand ${
              urgent
                ? "mb-4 text-[clamp(28px,3.6vw,46px)] leading-[1.02]"
                : "mb-5 text-[clamp(34px,4.4vw,58px)] leading-[1.04]"
            }`}
          >
            {h1Top}
            <br />
            {h1Bottom}
          </h1>

          {serviceOnlyLine && (
            <p className="animate-fade-up-1 mb-4 font-display text-[20px] font-extrabold leading-tight text-brand">
              {serviceOnlyLine}
            </p>
          )}

          {/* The booked label is longer, so the pair stays stacked until md rather than sm: two
              pills side by side at 640px would need more room than a 640px screen has. */}
          <div className={`mb-3 flex flex-col gap-3 ${booked ? "md:flex-row" : "sm:flex-row"}`}>
            <Button
              as="a"
              href={CALL_HREF}
              variant="primary"
              size="xl"
              className={`nums w-full ${booked ? "md:w-auto" : "sm:w-auto"}`}
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
              // The booked label is long enough to overflow a narrow phone against the pill's
              // default `whitespace-nowrap`, so on those pages it is allowed to wrap instead.
              className={`w-full ${booked ? "!whitespace-normal text-center md:w-auto" : "sm:w-auto"}`}
              data-cta="whatsapp"
              data-cta-location="hero"
              data-cta-variant="secondary_button"
            >
              <WhatsappLogo size={22} weight="fill" aria-hidden />
              {booked ? "Send a photo for a quote" : "WhatsApp us"}
            </Button>
          </div>

          {facts.map((fact) => {
            const { lead, rest } = splitLead(fact);
            return (
              <p key={fact} className="animate-fade-up-2 mb-1 text-[14.5px] leading-snug text-slate">
                <strong className="font-semibold text-brand">{lead}</strong>
                {rest ? ` ${rest}` : ""}
              </p>
            );
          })}

          {sub && <p className="animate-fade-up-2 mt-4 max-w-[48ch] text-[16px] leading-[1.6] text-slate">{sub}</p>}
        </div>

        {aside && <div data-hero-aside className="w-full lg:max-w-[440px] lg:justify-self-end">{aside}</div>}
      </div>
    </section>
  );
}
