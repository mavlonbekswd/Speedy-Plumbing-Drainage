import { ArrowRight, Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import Button from "@/components/ui/Button";
import { PRICE_PROCESS_LINE } from "@/lib/claims";
import { PUBLISHED_SERVICES, serviceHref } from "@/lib/services";
import { CALL_HREF, CALL_NUMBER_DISPLAY, WHATSAPP_URL } from "@/lib/site";

// A real 404: Next serves this with a 404 status, which is the whole point of it existing
// alongside the middleware redirect. Middleware sends an unknown path to a service page, but
// it deliberately lets /areas/<slug>, /services/<slug> and /blog/<slug> through so an unknown
// town slug reaches Next and 404s honestly instead of being laundered into a 200.
//
// So this page is what a visitor sees when they mistype a town, which means the number and the
// service list matter more here than the apology does.
//
// No metadata export: Next does not run generateMetadata for the root not-found boundary, so
// the title here is the root layout's default. The status code is what matters.
export default function NotFound() {
  return (
    <div className="has-callbar">
      <Header />

      <main id="main" tabIndex={-1} className="bg-paper">
        <div className="mx-auto max-w-content px-5 pb-20 pt-16 sm:px-8 md:pb-28 md:pt-24">
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-tint">Error 404</p>

          <h1 className="mb-4 max-w-[18ch] font-display text-[clamp(34px,4.6vw,60px)] font-extrabold leading-[1.02] text-brand">
            We could not find that page.
          </h1>

          <p className="mb-8 max-w-[52ch] text-[17px] leading-[1.6] text-slate">
            The link is old or mistyped. Ring us and tell us what is happening. {PRICE_PROCESS_LINE}
          </p>

          <div className="mb-14 flex flex-col gap-3 sm:flex-row">
            <Button
              as="a"
              href={CALL_HREF}
              variant="primary"
              size="xl"
              className="nums w-full sm:w-auto"
              data-cta="phone"
              data-cta-location="not_found"
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
              data-cta-location="not_found"
              data-cta-variant="secondary_button"
            >
              <WhatsappLogo size={20} weight="fill" aria-hidden />
              WhatsApp us
            </Button>
          </div>

          {PUBLISHED_SERVICES.length > 0 && (
            <nav aria-label="Services">
              <h2 className="mb-4 font-display text-[19px] font-bold text-brand">What we do</h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {PUBLISHED_SERVICES.map((service) => (
                  <li key={service.slug}>
                    <a
                      href={serviceHref(service.slug)}
                      data-cta="nav"
                      data-cta-location="not_found"
                      data-cta-variant="secondary_button"
                      className="lift flex items-center justify-between gap-3 rounded-card border border-line bg-white p-5 font-display text-[17px] font-bold text-brand shadow-card"
                    >
                      {service.navLabel}
                      <ArrowRight size={16} weight="bold" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </main>

      <Footer />
      <MobileCallBar />
    </div>
  );
}
