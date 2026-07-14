import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '../../lib/hooks'
import { cinematicScroll } from '../three/scrollState'
import SceneGate from '../three/SceneGate'
import Hero from './Hero'
import ProblemIntro from './ProblemIntro'

gsap.registerPlugin(ScrollTrigger)

/**
 * The hero + problem sections share one sticky, scroll-driven 3D background.
 * Scroll progress across this whole block (0..1) drives the pipe-journey
 * camera; the scene fades out at the end into the bright services section.
 */
export default function CinematicIntro() {
  const wrapRef = useRef(null)
  const bgRef = useRef(null)
  const reduced = usePrefersReducedMotion()

  // Layout effect so ScrollTrigger cleanup runs before React removes DOM on
  // route change (see ProcessStory for the full explanation).
  useLayoutEffect(() => {
    if (reduced) return undefined
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          cinematicScroll.progress = self.progress
          // Fade the scene into the next (light) section over the last 10%.
          const fade = self.progress > 0.9 ? 1 - (self.progress - 0.9) / 0.1 : 1
          if (bgRef.current) bgRef.current.style.opacity = String(Math.max(0, fade))
        },
      })
    }, wrapRef)
    return () => {
      ctx.revert()
      cinematicScroll.progress = 0
    }
  }, [reduced])

  return (
    <div ref={wrapRef} className="relative bg-charcoal">
      <div ref={bgRef} className="sticky top-0 h-screen overflow-hidden">
        <SceneGate />
      </div>
      <div className="relative z-10 -mt-[100vh]">
        <Hero />
        <ProblemIntro />
      </div>
    </div>
  )
}
