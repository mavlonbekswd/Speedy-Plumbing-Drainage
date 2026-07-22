import { useCallback, useRef, useState } from 'react'
import { ChevronsLeftRight } from 'lucide-react'
import ResponsiveImage from './ResponsiveImage'

/**
 * Accessible drag before/after comparison. Pointer-driven with a keyboard
 * fallback (the handle is a range slider for screen readers / keyboards).
 */
export default function ComparisonSlider({ before, after }) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef(null)
  const draggingRef = useRef(false)

  const updateFromClientX = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(100, Math.max(0, pct)))
  }, [])

  function onPointerDown(e) {
    draggingRef.current = true
    e.currentTarget.setPointerCapture?.(e.pointerId)
    updateFromClientX(e.clientX)
  }
  function onPointerMove(e) {
    if (draggingRef.current) updateFromClientX(e.clientX)
  }
  function endDrag() {
    draggingRef.current = false
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-[16/10] w-full touch-pan-y overflow-hidden rounded-sm select-none md:aspect-[21/9]"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <ResponsiveImage
        image={after}
        sizes="(min-width: 1280px) 1280px, 100vw"
        className="absolute inset-0 h-full w-full object-cover"
        draggable="false"
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        aria-hidden="true"
      >
        <ResponsiveImage
          image={before}
          alt=""
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="absolute inset-0 h-full w-full object-cover"
          draggable="false"
        />
      </div>
      <span className="sr-only">{before.alt}</span>

      {/* Divider + handle */}
      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-white/90"
        style={{ left: `${position}%` }}
        aria-hidden="true"
      >
        <span className="absolute top-1/2 left-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-charcoal shadow-lg">
          <ChevronsLeftRight className="size-5" />
        </span>
      </div>

      {/* Labels */}
      <span className="absolute top-4 left-4 rounded-sm bg-charcoal/70 px-3 py-1 text-xs font-semibold tracking-widest text-white uppercase">
        Before
      </span>
      <span className="absolute top-4 right-4 rounded-sm bg-electric/90 px-3 py-1 text-xs font-semibold tracking-widest text-charcoal uppercase">
        After
      </span>

      {/* Keyboard / SR control */}
      <input
        type="range"
        min="0"
        max="100"
        value={Math.round(position)}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-label="Reveal before and after comparison"
        className="absolute bottom-3 left-1/2 w-1/2 -translate-x-1/2 opacity-0 focus-visible:opacity-100"
      />
    </div>
  )
}
