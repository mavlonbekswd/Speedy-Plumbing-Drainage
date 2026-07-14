import { Suspense, useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import MobileContactBar from './MobileContactBar'
import RouteErrorBoundary from './RouteErrorBoundary'
import ScrollToTop from './ScrollToTop'

function RouteFallback() {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center bg-charcoal pt-40 pb-24"
      role="status"
      aria-label="Loading page"
    >
      <div className="size-9 animate-spin rounded-full border-2 border-white/15 border-t-electric" />
    </div>
  )
}

export default function Layout() {
  const location = useLocation()
  const reduced = useReducedMotion()

  // Skip the entrance fade on the very first paint — only animate real
  // client-side navigations.
  const firstRender = useRef(true)
  useEffect(() => {
    firstRender.current = false
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only z-[70] rounded-sm bg-electric px-4 py-2 font-semibold text-charcoal focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to main content
      </a>

      <Navbar />
      <ScrollToTop />

      {/*
        Enter-only transition. No AnimatePresence exit phase: exit animations
        held the old page (with its pinned GSAP sections) hostage for 320ms on
        every navigation and raced React's unmount — navigation now swaps
        immediately and animates the new page in.
      */}
      <motion.main
        id="main-content"
        key={location.pathname}
        className="flex-1"
        initial={reduced || firstRender.current ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <RouteErrorBoundary key={location.pathname}>
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
        </RouteErrorBoundary>
      </motion.main>

      <Footer />
      <MobileContactBar />
    </div>
  )
}
