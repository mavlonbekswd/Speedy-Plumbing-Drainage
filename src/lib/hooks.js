import { useEffect, useState } from 'react'

/**
 * True when the component mounted into a hidden document (background tab,
 * battery-saver throttling). Browsers pause requestAnimationFrame there, so
 * entrance animations would freeze at opacity 0 — callers should render the
 * final state instead of animating.
 */
export function useStartedHidden() {
  const [startedHidden] = useState(
    () => typeof document !== 'undefined' && document.visibilityState === 'hidden'
  )
  return startedHidden
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/**
 * Width-only breakpoint check. matchMedia — not a resize listener — because on
 * mobile every URL-bar show/hide fires `resize` with an unchanged width, which
 * re-rendered the whole subscriber tree on each scroll gesture.
 */
export function useIsMobile(breakpoint = 768) {
  const query = `(max-width: ${breakpoint - 0.02}px)`
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return isMobile
}

/** Detect WebGL availability for progressive enhancement of 3D scenes. */
export function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    )
  } catch {
    return false
  }
}

/**
 * Heuristic: is this device likely too weak for the full 3D experience?
 * Weak devices get the static cinematic fallback instead.
 */
export function isLowPowerDevice() {
  const cores = navigator.hardwareConcurrency || 4
  const memory = navigator.deviceMemory // undefined in Safari/Firefox
  const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  if (memory !== undefined && memory <= 2) return true
  if (mobile && cores <= 3) return true
  return false
}
