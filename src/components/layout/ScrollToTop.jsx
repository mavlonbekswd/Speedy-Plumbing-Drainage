import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from '../../lib/smoothScroll'

/**
 * Reusable route-change scroll reset. Jumps to the top on every pathname
 * change (Lenis-aware, so smooth scrolling never replays the old position)
 * and refreshes ScrollTrigger once the new page has painted.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()
  const lenisRef = useLenis()

  useEffect(() => {
    if (lenisRef?.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    }
    window.scrollTo(0, 0)
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [pathname, lenisRef])

  return null
}
