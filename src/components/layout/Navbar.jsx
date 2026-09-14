import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Mail, Menu, Phone, X } from 'lucide-react'
import { businessConfig } from '../../data/business'
import { prefetchRoute } from '../../lib/routes'
import { useLenis } from '../../lib/smoothScroll'
import Logo from './Logo'

// Warm the destination's JS chunk before the click lands. Hover/focus covers
// pointer + keyboard; touchstart covers touch devices (fires ~100ms before
// the click). Only the page module is fetched — never images or media.
function prefetchProps(to) {
  const warm = () => prefetchRoute(to)
  return { onPointerEnter: warm, onFocus: warm, onTouchStart: warm }
}

// One source of truth — the desktop bar and the mobile menu render the same
// destinations, so they must never be able to drift apart.
const navLinks = [
  { to: '/services', label: 'Services' },
  { to: '/services/emergency-plumbing', label: 'Emergency' },
  { to: '/areas-we-cover', label: 'Areas' },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()
  const { pathname } = useLocation()
  const lenisRef = useLenis()
  const panelRef = useRef(null)
  const toggleRef = useRef(null)

  // Belt-and-braces: any route change closes the mobile menu, even when a
  // navigation happens outside a menu link's own onClick.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock scrolling while the menu is open. body{overflow:hidden} alone is not
  // enough here: Lenis drives scrolling programmatically from wheel/touch
  // events, so it has to be stopped explicitly or the page keeps moving
  // behind the overlay.
  useEffect(() => {
    if (!open) return undefined
    const lenis = lenisRef?.current
    document.body.style.overflow = 'hidden'
    lenis?.stop()
    return () => {
      document.body.style.overflow = ''
      lenis?.start()
    }
  }, [open, lenisRef])

  // Modal behaviour for the full-screen menu: Escape closes it, Tab is trapped
  // inside it, focus moves in on open and returns to the toggle on close.
  useEffect(() => {
    if (!open) return undefined
    const opener = toggleRef.current

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (e.key !== 'Tab') return
      const focusables = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (!focusables?.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const id = requestAnimationFrame(() => {
      panelRef.current?.querySelector('a[href], button')?.focus()
    })
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      cancelAnimationFrame(id)
      opener?.focus()
    }
  }, [open])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-white/8 bg-charcoal/85 py-2.5 backdrop-blur-lg'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
          <Logo />

          <nav aria-label="Main navigation" className="hidden items-center gap-5 lg:flex xl:gap-7">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/services'}
                {...prefetchProps(link.to)}
                className={({ isActive }) =>
                  `text-sm font-medium tracking-wide transition-colors ${
                    isActive ? 'text-electric' : 'text-mist/80 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={businessConfig.phoneHref}
              className="hidden items-center gap-2 rounded-sm bg-electric px-4 py-2.5 text-sm font-semibold tracking-wide whitespace-nowrap text-charcoal uppercase transition-colors hover:bg-white sm:inline-flex xl:px-5"
            >
              <Phone className="size-4" aria-hidden="true" />
              {businessConfig.phoneDisplay}
            </a>
            <Link
              to="/quote"
              {...prefetchProps('/quote')}
              className="hidden items-center rounded-sm border border-white/25 px-4 py-2.5 text-sm font-semibold tracking-wide whitespace-nowrap text-white uppercase transition-colors hover:border-electric hover:text-electric lg:inline-flex xl:px-5"
            >
              Get Quote
            </Link>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-haspopup="dialog"
              className="flex size-11 items-center justify-center rounded-sm border border-white/20 text-white lg:hidden"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-charcoal"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: '-4%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: '-4%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <div className="flex items-center justify-between px-5 py-4 md:px-8">
              <Logo />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex size-11 items-center justify-center rounded-sm border border-white/20 text-white"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Mobile navigation" className="flex flex-1 flex-col justify-center gap-1 px-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={reduced ? false : { opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i + 0.1, duration: 0.4 }}
                >
                  <NavLink
                    to={link.to}
                    end={link.to === '/services'}
                    {...prefetchProps(link.to)}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `font-display block py-2.5 text-4xl uppercase transition-colors sm:text-5xl ${
                        isActive ? 'text-electric' : 'text-white hover:text-electric'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            {/* Inline padding, not a utility: env() has to clear the iOS home indicator. */}
            <div className="grid gap-3 px-6" style={{ paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom))' }}>
              <a
                href={businessConfig.phoneHref}
                className="flex min-h-13 items-center justify-center gap-2.5 rounded-sm bg-electric text-base font-semibold tracking-wide text-charcoal uppercase"
              >
                <Phone className="size-5" aria-hidden="true" />
                Call {businessConfig.phoneDisplay}
              </a>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/quote"
                  {...prefetchProps('/quote')}
                  onClick={() => setOpen(false)}
                  className="flex min-h-13 items-center justify-center rounded-sm border border-white/25 text-sm font-semibold tracking-wide text-white uppercase"
                >
                  Get Quote
                </Link>
                <a
                  href={businessConfig.emailHref}
                  className="flex min-h-13 items-center justify-center gap-2 rounded-sm border border-white/25 text-sm font-semibold tracking-wide text-white uppercase"
                >
                  <Mail className="size-4" aria-hidden="true" />
                  Email
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
