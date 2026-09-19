"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { List, Phone, WhatsappLogo, X } from "@phosphor-icons/react/dist/ssr";
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

/** Tab and Shift+Tab inside the open panel wrap rather than escaping to the page behind it. */
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function HeaderClient({ links }: { links: readonly NavLink[] }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Escape closes, Tab is trapped, and the body cannot scroll underneath. All three are undone
  // together, so nothing is left behind if the component unmounts while the panel is open.
  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
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

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-[12px]">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-6 px-5 sm:px-8">
        <Logo ctaLocation="header" />

        {links.length > 0 && (
          <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-cta="nav"
                data-cta-location="header"
                data-cta-variant="text_link"
                className="press text-[14.5px] font-semibold text-brand hover:text-tint"
              >
                {link.label}
              </a>
            ))}
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
            data-cta="nav"
            data-cta-location="header"
            data-cta-variant="icon_button"
            className="press inline-flex h-11 w-11 items-center justify-center rounded-chip border border-line text-brand md:hidden"
          >
            {open ? <X size={22} weight="bold" aria-hidden /> : <List size={22} weight="bold" aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="header-menu"
          ref={panelRef}
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-paper px-5 pb-8 pt-5 sm:px-8 md:hidden"
        >
          {links.length > 0 && (
            <nav aria-label="Menu" className="flex flex-col gap-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  data-cta="nav"
                  data-cta-location="header_mobile_menu"
                  data-cta-variant="text_link"
                  className="text-[17px] font-semibold text-brand"
                >
                  {link.label}
                </a>
              ))}
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
