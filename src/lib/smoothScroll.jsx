import { createContext, useContext, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from './hooks'

gsap.registerPlugin(ScrollTrigger)

const LenisContext = createContext(null)

export function useLenis() {
  return useContext(LenisContext)
}

/**
 * Site-wide smooth scrolling (Lenis) wired into GSAP ScrollTrigger.
 * Disabled entirely when the user prefers reduced motion — native scrolling
 * and all content remain fully functional.
 */
export function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return undefined

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      touchMultiplier: 1.4,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduced])

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
}
