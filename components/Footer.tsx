import { EnvelopeSimple, Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import Logo from "@/components/Logo";
import { FOOTER_GROUPS } from "@/lib/nav";
import { AVAILABILITY_LINE, COVERAGE_LINE, WHO_WE_WORK_FOR_LINE } from "@/lib/claims";
import {
  CALL_HREF,
  CALL_NUMBER_DISPLAY,
  CONTACT_EMAIL,
  FOOTER_LEGAL_LINE,
  TRADING_NAME,
  WHATSAPP_URL,
} from "@/lib/site";

// The dark band the site ends on. Navy, white type, no decoration of any kind.
//
// Every link comes from lib/nav, which filters by `published`, so a group whose pages are all
// still unbuilt renders as nothing rather than as a heading over an empty list. The town group
// is tagged footer_areas so the report can tell "someone went looking for their town" from
// "someone went looking for a service".
//
// One item carries its own data-cta: "Ask us to ring you" is an anchor into the booking form on
// /contact, not navigation, so lib/nav marks it book_anchor and this component honours it.
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-2 text-white">
      <div className="mx-auto max-w-content px-5 pb-10 pt-16 sm:px-8">
        <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-[1.3fr_2fr] md:gap-12">
          <div>
            <Logo dark ctaLocation="footer" className="mb-5" />

            <p className="mb-2 max-w-[42ch] text-base leading-[1.6] text-white/80">
              {/* LOCKED with the line below it: six ad descriptions rest on these two sentences
                  alone (see WHO_WE_WORK_FOR_LINE in lib/claims.ts). */}
              Plumbing and drainage across {COVERAGE_LINE}
            </p>
            <p className="mb-6 max-w-[42ch] text-base leading-[1.6] text-white/80">
              {AVAILABILITY_LINE} {WHO_WE_WORK_FOR_LINE}
            </p>

            <ul className="flex flex-col gap-1 text-[0.90625rem]">
              <li>
                <a
                  href={CALL_HREF}
                  data-cta="phone"
                  data-cta-location="footer"
                  data-cta-variant="text_link"
                  className="nums press inline-flex min-h-[44px] items-center gap-2.5 font-semibold text-white hover:text-cta"
                >
                  <Phone size={16} weight="fill" aria-hidden className="text-cta" />
                  {CALL_NUMBER_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta="whatsapp"
                  data-cta-location="footer"
                  data-cta-variant="text_link"
                  className="press inline-flex min-h-[44px] items-center gap-2.5 font-semibold text-white hover:text-cta"
                >
                  <WhatsappLogo size={16} weight="fill" aria-hidden className="text-whatsapp" />
                  WhatsApp us
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  data-cta="email"
                  data-cta-location="footer"
                  data-cta-variant="text_link"
                  className="press inline-flex min-h-[44px] items-center gap-2.5 text-white/80 hover:text-white"
                >
                  <EnvelopeSimple size={16} weight="fill" aria-hidden className="text-tint-bright" />
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>

          {FOOTER_GROUPS.length > 0 && (
            <nav aria-label="Footer" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {FOOTER_GROUPS.map((group) => {
                // Detected from the hrefs, not the heading: the heading is display copy in a
                // file this component does not own, and a rename of it would silently collapse
                // footer_areas into footer in the report.
                const areas = group.links.some((link) => link.href.startsWith("/areas/"));
                return (
                  <div key={group.heading}>
                    <p className="mb-4 font-display text-[0.9375rem] font-bold text-white">{group.heading}</p>
                    <ul className={areas ? "flex flex-wrap gap-x-4" : "flex flex-col"}>
                      {group.links.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            data-cta={link.cta ?? "nav"}
                            data-cta-location={areas ? "footer_areas" : "footer"}
                            data-cta-variant="text_link"
                            className={`inline-flex min-h-[36px] items-center text-[0.875rem] text-white/80 hover:text-white ${
                              // Town names can be three letters ("Ely", "Diss"). The padding
                              // widens the tap area into the gap without moving the text.
                              areas ? "-mx-2 px-2" : ""
                            }`}
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </nav>
          )}
        </div>

        <p className="mt-8 text-[0.8125rem] text-white/70">
          &copy; {year} {TRADING_NAME}
        </p>

        {/* Company, LLP and Business (Names and Trading Disclosures) Regulations 2015: the
            registered name, the country of registration, the company number and the registered
            office all have to appear because the trading name differs from the registered one.
            One constant, one JSX expression, so the rendered paragraph is a single text node
            and the excluded-copy spec can match it whole. Do not split it. */}
        <p className="mt-3 text-[0.8125rem] leading-relaxed text-white/70">{FOOTER_LEGAL_LINE}</p>
      </div>
    </footer>
  );
}
