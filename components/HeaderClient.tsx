"use client";

import { useCallback, useEffect, useRef, useState, type FocusEvent } from "react";
import { CaretDown, List, Phone, WhatsappLogo, X } from "@phosphor-icons/react/dist/ssr";
import Button from "@/components/ui/Button";
import Logo from "@/components/Logo";
import type { NavLink } from "@/lib/nav";
import { CALL_HREF, CALL_NUMBER_DISPLAY, WHATSAPP_URL } from "@/lib/site";

// Sticky paper bar, 64px, one hairline underneath and nothing else. No wash, no shadow: the
// only things allowed to draw the eye up here are the two pills on the right.
//
// The whole file is a client component because the burger cannot be anything else: it owns
// aria-expanded, Escape, the scroll lock, the focus trap and the return of focus. Every link
// in it is still a plain <a href> in the server-rendered HTML, so a crawler with no JavaScript
// reads the same nav a browser does, and the mobile menu's markup is simply absent until it is
// opened rather than hidden behind a class.
//
// Breakpoints, deliberately two rather than one: the pills appear at 640px (below that the
// number leaves the header entirely and lives in the call bar and the menu), the text nav at
// 768px, and the burger is present under 768px so the nav is reachable at every width.
//
// The one thing that is NOT unmounted is the desktop Services panel. It is rendered on the
// server and hidden with `invisible`, which keeps it out of the tab order and out of the
// accessibility tree while leaving its nine links in the HTML for a crawler, and which is also
// the only way to fade it. It is absolutely positioned, so opening it never moves the bar.

/** Tab and Shift+Tab inside the open panel wrap rather than escaping to the page behind it. */
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface HeaderServices {
  /** The /services hub. Its label is the drop-down's last link, not the button. */
  hub: NavLink;
  /** Every published service, already resolved to {label, href} by the server. */
  items: readonly NavLink[];
}

export default function HeaderClient({
  links,
  services,
}: {
  links: readonly NavLink[];
  services: HeaderServices | null;
}) {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const servicesButtonRef = useRef<HTMLButtonElement>(null);

  // Closing the burger also collapses the nested Services row, so reopening the menu always
  // shows the short version rather than whatever the last visit left expanded.
  const close = useCallback(() => {
    setOpen(false);
    setMobileServicesOpen(false);
  }, []);

  // Escape closes, Tab is trapped, and the body cannot scroll underneath. All three are undone
  // together, so nothing is left behind if the component unmounts while the panel is open.
  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setMobileServicesOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      // Read at keydown time, not at open time: expanding the Services row adds links to the
      // loop and the trap has to know about them.
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      // The burger stays in the loop: it is the control that closes the panel, so tabbing off
      // the last link should reach it rather than the page behind.
      if (burgerRef.current) items.unshift(burgerRef.current);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey && (active === first || !active || !items.includes(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Focus goes to the panel when it opens and back to the burger when it closes, so a keyboard
  // user is never dropped at the top of the document.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) {
      panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    } else if (wasOpen.current) {
      burgerRef.current?.focus();
    }
    wasOpen.current = open;
  }, [open]);

  // The desktop drop-down. Focus deliberately stays on the button when it opens, which is what
  // a disclosure does: Tab walks into the panel, Escape comes back out. Both listeners are
  // document-level so a click or an Escape anywhere closes it, including when the browser left
  // focus on the body after a mouse click (Safari does exactly that).
  useEffect(() => {
    if (!servicesOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setServicesOpen(false);
      servicesButtonRef.current?.focus();
    };
    const onPointerDown = (event: MouseEvent) => {
      const wrapper = servicesRef.current;
      if (wrapper && !wrapper.contains(event.target as Node)) setServicesOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [servicesOpen]);

  /** Tabbing off the last link in the panel closes it rather than leaving a card over the page. */
  const onServicesBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null;
    if (!next) return; // Focus left the document entirely; the click handler owns that case.
    if (!event.currentTarget.contains(next)) setServicesOpen(false);
  };

  const closeServices = useCallback(() => setServicesOpen(false), []);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-[12px]">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-4 px-5 sm:px-8 xl:gap-6">
        <Logo ctaLocation="header" />

        {links.length > 0 && (
          <nav aria-label="Primary" className="hidden items-center gap-7 xl:flex">
            {links.map((link) => {
              // The hub link becomes the drop-down, in place, so the nav keeps its order.
              if (services && link.href === services.hub.href) {
                return (
                  <div
                    key={link.href}
                    ref={servicesRef}
                    onBlur={onServicesBlur}
                    className="relative flex items-center"
                  >
                    <button
                      ref={servicesButtonRef}
                      type="button"
                      onClick={() => setServicesOpen((value) => !value)}
                      aria-expanded={servicesOpen}
                      aria-controls="header-services"
                      data-cta="menu"
                      data-cta-location="header"
                      data-cta-variant="text_link"
                      className="press inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-brand hover:text-tint"
                    >
                      {link.label}
                      <CaretDown
                        size={13}
                        weight="bold"
                        aria-hidden
                        className={servicesOpen ? "rotate-180" : undefined}
                      />
                    </button>

                    <div
                      id="header-services"
                      className={[
                        "absolute left-0 top-full z-50 mt-3 w-[30rem] max-w-[calc(100vw-2.5rem)] rounded-card border border-line bg-white p-3 shadow-card",
                        "transition-opacity duration-150 motion-reduce:transition-none",
                        servicesOpen ? "visible opacity-100" : "invisible opacity-0",
                      ].join(" ")}
                    >
                      <ul className="grid grid-cols-2 gap-x-2">
                        {services.items.map((service) => (
                          <li key={service.href}>
                            <a
                              href={service.href}
                              onClick={closeServices}
                              data-cta={service.cta ?? "nav"}
                              data-cta-location="header"
                              data-cta-variant="text_link"
                              className="flex min-h-[44px] items-center rounded-chip px-3 text-[14.5px] font-semibold text-brand hover:bg-paper-2 hover:text-tint"
                            >
                              {service.label}
                            </a>
                          </li>
                        ))}
                      </ul>

                      <a
                        href={services.hub.href}
                        onClick={closeServices}
                        data-cta="nav"
                        data-cta-location="header"
                        data-cta-variant="text_link"
                        className="mt-2 flex min-h-[44px] items-center rounded-chip border-t border-line px-3 text-[14.5px] font-semibold text-tint hover:bg-paper-2"
                      >
                        {services.hub.label}
                      </a>
                    </div>
                  </div>
                );
              }

              return (
                <a
                  key={link.href}
                  href={link.href}
                  data-cta={link.cta ?? "nav"}
                  data-cta-location="header"
                  data-cta-variant="text_link"
                  className="press text-[14.5px] font-semibold text-brand hover:text-tint"
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
        )}

        <div className="flex items-center gap-2.5">
          {/* Below 640px both pills leave the header: the number lives in the call bar and in
              the menu, which is where a phone user's thumb already is. */}
          <Button
            as="a"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="lg"
            className="hidden sm:inline-flex"
            data-cta="whatsapp"
            data-cta-location="header"
            data-cta-variant="secondary_button"
          >
            <WhatsappLogo size={18} weight="fill" aria-hidden />
            WhatsApp
          </Button>

          <Button
            as="a"
            href={CALL_HREF}
            variant="primary"
            size="lg"
            className="nums hidden sm:inline-flex"
            data-cta="phone"
            data-cta-location="header"
            data-cta-variant="primary_button"
          >
            <Phone size={18} weight="fill" aria-hidden />
            {CALL_NUMBER_DISPLAY}
          </Button>

          <button
            ref={burgerRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="header-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            data-cta="menu"
            data-cta-location="header"
            data-cta-variant="icon_button"
            className="press inline-flex h-11 w-11 items-center justify-center rounded-chip border border-line text-brand xl:hidden"
          >
            {open ? <X size={22} weight="bold" aria-hidden /> : <List size={22} weight="bold" aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="header-menu"
          ref={panelRef}
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-paper px-5 pb-8 pt-5 sm:px-8 xl:hidden"
        >
          {links.length > 0 && (
            <nav aria-label="Menu" className="flex flex-col">
              {links.map((link) => {
                // An expandable row rather than nine more lines: the menu stays one screen long
                // and the services are one tap away.
                if (services && link.href === services.hub.href) {
                  return (
                    <div key={link.href} className="border-b border-line">
                      <button
                        type="button"
                        onClick={() => setMobileServicesOpen((value) => !value)}
                        aria-expanded={mobileServicesOpen}
                        aria-controls="header-menu-services"
                        data-cta="menu"
                        data-cta-location="header_mobile_menu"
                        data-cta-variant="text_link"
                        className="flex min-h-[52px] w-full items-center justify-between gap-3 text-left text-[17px] font-semibold text-brand"
                      >
                        {link.label}
                        <CaretDown
                          size={15}
                          weight="bold"
                          aria-hidden
                          className={mobileServicesOpen ? "rotate-180" : undefined}
                        />
                      </button>

                      {mobileServicesOpen && (
                        <ul id="header-menu-services" className="pb-2 pl-3">
                          {services.items.map((service) => (
                            <li key={service.href}>
                              <a
                                href={service.href}
                                onClick={close}
                                data-cta={service.cta ?? "nav"}
                                data-cta-location="header_mobile_menu"
                                data-cta-variant="text_link"
                                className="flex min-h-[46px] items-center text-[16px] font-semibold text-slate"
                              >
                                {service.label}
                              </a>
                            </li>
                          ))}
                          <li>
                            <a
                              href={services.hub.href}
                              onClick={close}
                              data-cta="nav"
                              data-cta-location="header_mobile_menu"
                              data-cta-variant="text_link"
                              className="flex min-h-[46px] items-center text-[16px] font-semibold text-tint"
                            >
                              {services.hub.label}
                            </a>
                          </li>
                        </ul>
                      )}
                    </div>
                  );
                }

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={close}
                    data-cta={link.cta ?? "nav"}
                    data-cta-location="header_mobile_menu"
                    data-cta-variant="text_link"
                    className="flex min-h-[52px] items-center border-b border-line text-[17px] font-semibold text-brand"
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <Button
              as="a"
              href={CALL_HREF}
              onClick={close}
              variant="primary"
              size="lg"
              className="nums w-full"
              data-cta="phone"
              data-cta-location="header_mobile_menu"
              data-cta-variant="primary_button"
            >
              <Phone size={18} weight="fill" aria-hidden />
              Call {CALL_NUMBER_DISPLAY}
            </Button>
            <Button
              as="a"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              variant="whatsapp"
              size="lg"
              className="w-full"
              data-cta="whatsapp"
              data-cta-location="header_mobile_menu"
              data-cta-variant="secondary_button"
            >
              <WhatsappLogo size={18} weight="fill" aria-hidden />
              WhatsApp us
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
