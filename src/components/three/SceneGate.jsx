import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { isLowPowerDevice, supportsWebGL, useIsMobile, usePrefersReducedMotion } from '../../lib/hooks'
import { cinematicScroll } from './scrollState'
import StaticFallback from './StaticFallback'

// The Three.js bundle only ever downloads if this device qualifies.
const PipeScene = lazy(() => import('./PipeScene'))

/**
 * Progressive-enhancement gate for the 3D experience:
 * - reduced motion, missing WebGL or a low-power device → static image
 * - otherwise the lazy 3D scene, with rendering paused off-screen
 * The hero content and CTAs never wait for this component.
 */
export default function SceneGate() {
  const reduced = usePrefersReducedMotion()
  const mobile = useIsMobile()
  const [enabled, setEnabled] = useState(false)
  const [inView, setInView] = useState(true)
  const hostRef = useRef(null)

  useEffect(() => {
    if (reduced) {
      setEnabled(false)
      return
    }
    setEnabled(supportsWebGL() && !isLowPowerDevice())
  }, [reduced])

  // Pause rendering entirely when the cinematic block is out of the viewport.
  useEffect(() => {
    const host = hostRef.current
    if (!host || !enabled) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(host)
    return () => observer.disconnect()
  }, [enabled])

  // Subtle pointer parallax — precision pointers only.
  useEffect(() => {
    if (!enabled || mobile) return undefined
    if (!window.matchMedia('(pointer: fine)').matches) return undefined
    const onMove = (e) => {
      cinematicScroll.mouseX = (e.clientX / window.innerWidth) * 2 - 1
      cinematicScroll.mouseY = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [enabled, mobile])

  return (
    <div ref={hostRef} className="absolute inset-0" aria-hidden="true">
      {enabled ? (
        <Suspense fallback={<StaticFallback />}>
          <PipeScene active={inView} mobile={mobile} />
        </Suspense>
      ) : (
        <StaticFallback />
      )}
    </div>
  )
}
