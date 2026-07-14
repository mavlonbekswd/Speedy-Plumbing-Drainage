import { memo, useCallback, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Phone, X } from 'lucide-react'
import { businessConfig } from '../../data/business'
import { areaNetwork } from '../../data/serviceAreas'
import { useIsMobile, useStartedHidden } from '../../lib/hooks'

// ---------------------------------------------------------------------------
// Interactive service-area network — a stylised spider web, not a literal
// map, with Cambridge as the central hub. Framer Motion only (no GSAP here),
// and no permanent animation loop: springs run on interaction, the only
// continuous motion is the CSS breathing halo on the hub.
// ---------------------------------------------------------------------------

const VB_W = 1000
const VB_H = 700

const HUB = areaNetwork.find((a) => a.type === 'hub')

const NODE_STYLE = {
  hub: { r: 13, inner: 5.5, halo: 26, hit: 56, font: 30, fill: '#38bdf8', label: '#38bdf8', weight: 700 },
  town: { r: 10, inner: 4.5, halo: 18, hit: 56, font: 25, fill: '#e8f2fc', label: '#d7e4f2', weight: 600 },
  village: { r: 6.5, inner: 3, halo: 12, hit: 40, font: 19, fill: '#a9b8c9', label: '#93a3b5', weight: 500 },
}

const SPRING = { type: 'spring', stiffness: 180, damping: 22 }

// Calm default web: towns tie to the hub visibly, villages faintly.
const baseConnections = areaNetwork
  .filter((a) => a.type !== 'hub')
  .map((a) => ({
    id: `base-${a.id}`,
    x1: HUB.x, y1: HUB.y, x2: a.x, y2: a.y,
    opacity: a.type === 'town' ? 0.16 : 0.09,
    width: a.type === 'town' ? 1.7 : 1.1,
  }))

/** Connections drawn when a node activates (source → target, per spec §7). */
function connectionsFor(area) {
  if (!area) return []
  if (area.type === 'hub') {
    // Cambridge: the full web expands outward, one line after another.
    return areaNetwork
      .filter((a) => a.type !== 'hub')
      .map((a, i) => ({ id: `act-${a.id}`, from: HUB, to: a, delay: i * 0.05 }))
  }
  const targets = [HUB.id, ...area.relatedAreas.filter((id) => id !== HUB.id)]
  return targets.map((id, i) => {
    const to = areaNetwork.find((a) => a.id === id)
    return { id: `act-${id}`, from: area, to, delay: i * 0.09 }
  })
}

/** Zoom origin follows the active node; magnitude stays premium-subtle. */
function zoomFor(area) {
  if (!area) return { scale: 1, origin: `${HUB.x}px ${HUB.y}px` }
  const scale = area.type === 'hub' ? 1.04 : area.type === 'town' ? 1.07 : 1.055
  return { scale, origin: `${area.x}px ${area.y}px` }
}

const AreaNode = memo(function AreaNode({
  area, state, showLabel, reduced,
  onActivate, onScheduleClear, onCancelClear,
}) {
  const s = NODE_STYLE[area.type]
  const { active, related, highlighted, dimmed } = state
  const labelX = area.x + (area.labelDx ?? 0)
  const labelY = area.labelDy != null ? area.y + area.labelDy : area.y - s.r - 12

  return (
    <motion.g
      data-area-node={area.id}
      role="button"
      tabIndex={0}
      aria-label={`View plumbing coverage in ${area.name}`}
      aria-pressed={active}
      className="cursor-pointer focus:outline-none"
      style={{ transformOrigin: `${area.x}px ${area.y}px` }}
      initial={false}
      animate={{
        scale: !reduced && active ? 1.16 : 1,
        opacity: dimmed ? 0.35 : 1,
      }}
      transition={reduced ? { duration: 0 } : SPRING}
      onPointerEnter={(e) => {
        if (e.pointerType === 'touch') return
        onCancelClear()
        onActivate(area.id)
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'touch') return
        onScheduleClear()
      }}
      onClick={(e) => {
        e.stopPropagation()
        onActivate(area.id)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onActivate(area.id)
        }
      }}
      onFocus={() => {
        onCancelClear()
        onActivate(area.id)
      }}
    >
      {/* Generous invisible hit area — keeps touch targets usable and stops
          hover flicker between circle and label (one group = one boundary). */}
      <circle cx={area.x} cy={area.y} r={s.hit} fill="transparent" stroke="none" />

      {/* Halo */}
      <circle
        cx={area.x}
        cy={area.y}
        r={s.halo}
        fill="#38bdf8"
        className={area.type === 'hub' && !reduced ? 'hub-breathe' : undefined}
        opacity={area.type === 'hub' ? 0.3 : active || related || highlighted ? 0.28 : 0.12}
      />

      {/* Postcode-match ring */}
      {highlighted && (
        <motion.circle
          cx={area.x}
          cy={area.y}
          r={s.halo + 6}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2"
          initial={reduced ? false : { scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.85 }}
          transition={reduced ? { duration: 0 } : SPRING}
          style={{ transformOrigin: `${area.x}px ${area.y}px` }}
        />
      )}

      {/* Node ring + inner point */}
      <circle
        cx={area.x}
        cy={area.y}
        r={s.r}
        fill="#0b1524"
        stroke={
          active || highlighted
            ? '#7dd8ff'
            : related || area.type === 'hub'
              ? '#38bdf8'
              : '#5d7a99'
        }
        strokeWidth={area.type === 'hub' ? 3 : 2}
      />
      <circle cx={area.x} cy={area.y} r={s.inner} fill={active || related || highlighted ? '#7dd8ff' : s.fill} />

      {showLabel && (
        <text
          x={labelX}
          y={labelY}
          textAnchor={area.labelAnchor ?? 'middle'}
          fill={active || highlighted ? '#e9f6ff' : s.label}
          fontSize={active ? s.font * 1.12 : s.font}
          fontFamily="Inter, sans-serif"
          fontWeight={active ? 700 : s.weight}
          letterSpacing="0.6"
          style={{ userSelect: 'none' }}
        >
          {area.name}
        </text>
      )}
    </motion.g>
  )
})

function AreaNetwork({ highlightedIds = [] }) {
  const reduced = useReducedMotion()
  // Hidden tabs pause rAF, freezing entrance animations invisibly — skip the
  // one-off entrance drawing there. Interactions stay fully animated.
  const startedHidden = useStartedHidden()
  const skipEntrance = reduced || startedHidden
  const mobile = useIsMobile(640)
  const [activeId, setActiveId] = useState(null)
  const [villagesRevealed, setVillagesRevealed] = useState(false)
  const clearTimer = useRef(null)

  const activeArea = useMemo(
    () => areaNetwork.find((a) => a.id === activeId) ?? null,
    [activeId]
  )

  // Small grace period so mouse can travel node → tooltip (or node → node)
  // without the whole network snapping shut and reopening.
  const cancelClear = useCallback(() => {
    if (clearTimer.current) {
      clearTimeout(clearTimer.current)
      clearTimer.current = null
    }
  }, [])
  const scheduleClear = useCallback(() => {
    cancelClear()
    clearTimer.current = setTimeout(() => setActiveId(null), 110)
  }, [cancelClear])

  const activate = useCallback((id) => {
    setActiveId(id)
    if (id === HUB.id) setVillagesRevealed(true)
  }, [])

  const reset = useCallback(() => {
    cancelClear()
    setActiveId(null)
  }, [cancelClear])

  const activeConnections = useMemo(() => connectionsFor(activeArea), [activeArea])
  const relatedSet = useMemo(() => {
    if (!activeArea) return new Set()
    if (activeArea.type === 'hub') return new Set(areaNetwork.map((a) => a.id))
    return new Set([HUB.id, ...activeArea.relatedAreas])
  }, [activeArea])
  const highlightSet = useMemo(() => new Set(highlightedIds), [highlightedIds])

  const zoom = zoomFor(activeArea)

  // Tooltip placement: follow the node but flip near edges so it can never
  // leave the container. Mobile gets a bottom card inside the map instead.
  const tooltipStyle = useMemo(() => {
    if (!activeArea || mobile) return null
    const xPct = (activeArea.x / VB_W) * 100
    const yPct = (activeArea.y / VB_H) * 100
    const style = {}
    if (xPct > 58) {
      style.right = `${Math.min(100 - xPct + 1.5, 60)}%`
    } else {
      style.left = `${Math.min(xPct + 1.5, 60)}%`
    }
    if (yPct > 58) {
      style.bottom = `${100 - yPct + 2}%`
    } else {
      style.top = `${yPct + 2}%`
    }
    return style
  }, [activeArea, mobile])

  return (
    <div
      className="relative w-full"
      onKeyDown={(e) => {
        if (e.key === 'Escape') reset()
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== 'touch') scheduleClear()
      }}
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid meet"
        role="group"
        aria-label="Interactive network of the areas Speedy Plumbing and Drain covers, centred on Cambridge. Use Tab to move between areas."
        className="h-auto w-full select-none"
        onClick={reset}
      >
        <defs>
          <radialGradient id="netGlow" cx="50%" cy="53%" r="62%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.09" />
            <stop offset="55%" stopColor="#0e1a2e" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0b0d10" stopOpacity="0" />
          </radialGradient>
          <filter id="lineGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        <ellipse cx={VB_W / 2} cy={VB_H / 2 + 20} rx={VB_W / 2 - 20} ry={VB_H / 2 - 20} fill="url(#netGlow)" />

        <motion.g
          style={{ transformOrigin: zoom.origin }}
          animate={{ scale: reduced ? 1 : zoom.scale }}
          transition={reduced ? { duration: 0 } : SPRING}
        >
          {/* Calm base web */}
          {baseConnections.map((c) => (
            <motion.line
              key={c.id}
              x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
              stroke="#38bdf8"
              strokeOpacity={activeId ? c.opacity * 0.55 : c.opacity}
              strokeWidth={c.width}
              initial={skipEntrance ? false : { pathLength: 0 }}
              whileInView={skipEntrance ? undefined : { pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            />
          ))}

          {/* Active connections: drawn source → target with stagger */}
          <AnimatePresence>
            {activeConnections.map((c) => (
              <g key={c.id}>
                {!reduced && (
                  <motion.line
                    x1={c.from.x} y1={c.from.y} x2={c.to.x} y2={c.to.y}
                    stroke="#38bdf8"
                    strokeWidth="6"
                    strokeLinecap="round"
                    filter="url(#lineGlow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.28 }}
                    exit={{ opacity: 0, transition: { duration: 0.18 } }}
                    transition={{ duration: 0.5, delay: c.delay, ease: 'easeOut' }}
                  />
                )}
                <motion.line
                  x1={c.from.x} y1={c.from.y} x2={c.to.x} y2={c.to.y}
                  stroke="#7dd8ff"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.9 }}
                  exit={{ opacity: 0, transition: { duration: 0.18 } }}
                  transition={reduced ? { duration: 0 } : { duration: 0.5, delay: c.delay, ease: 'easeOut' }}
                />
              </g>
            ))}
          </AnimatePresence>

          {/* Nodes — villages first so towns and the hub sit on top */}
          {[...areaNetwork].sort((a, b) => {
            const order = { village: 0, town: 1, hub: 2 }
            return order[a.type] - order[b.type]
          }).map((area) => {
            const showLabel =
              area.type !== 'village' ||
              !mobile ||
              villagesRevealed ||
              activeId === area.id ||
              highlightSet.has(area.id)
            return (
              <AreaNode
                key={area.id}
                area={area}
                reduced={reduced}
                showLabel={showLabel}
                state={{
                  active: activeId === area.id,
                  related: relatedSet.has(area.id) && activeId !== area.id,
                  highlighted: highlightSet.has(area.id),
                  dimmed:
                    (activeId && activeId !== area.id && !relatedSet.has(area.id)) ||
                    (!activeId && highlightSet.size > 0 && !highlightSet.has(area.id)),
                }}
                onActivate={activate}
                onScheduleClear={scheduleClear}
                onCancelClear={cancelClear}
              />
            )
          })}
        </motion.g>
      </svg>

      {/* Area details panel */}
      <AnimatePresence>
        {activeArea && (
          <motion.div
            key="area-tooltip"
            role="dialog"
            aria-label={`${activeArea.name} coverage details`}
            className={
              mobile
                ? 'relative z-10 mt-3' // in flow below the map — never covers it
                : 'absolute z-10 w-64'
            }
            style={tooltipStyle ?? undefined}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={reduced ? { duration: 0.1 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onPointerEnter={(e) => {
              if (e.pointerType !== 'touch') cancelClear()
            }}
            onPointerLeave={(e) => {
              if (e.pointerType !== 'touch') scheduleClear()
            }}
          >
            <div className="rounded-sm border border-electric/30 bg-[#0b1524]/95 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.55)] backdrop-blur-sm">
              <div className="flex items-start justify-between gap-3">
                <p className="font-display text-lg tracking-wide text-white uppercase">{activeArea.name}</p>
                <button
                  type="button"
                  onClick={reset}
                  aria-label="Close area details"
                  className="-mt-1 -mr-1 flex size-8 shrink-0 items-center justify-center rounded-sm text-steel transition-colors hover:text-white"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-steel">
                {activeArea.type === 'hub'
                  ? 'Our central service area — plumbing and drainage across the city and every surrounding village.'
                  : `Plumbing and drainage services available across ${activeArea.name} and nearby areas.`}
              </p>
              <div className="mt-3.5 grid grid-cols-2 gap-2">
                <Link
                  to="/quote"
                  className="inline-flex min-h-11 items-center justify-center rounded-sm bg-electric px-3 text-xs font-semibold tracking-wide text-charcoal uppercase transition-colors hover:bg-white"
                >
                  Request a Quote
                </Link>
                <a
                  href={businessConfig.phoneHref}
                  className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-sm border border-white/25 px-3 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:border-electric hover:text-electric"
                >
                  <Phone className="size-3.5" aria-hidden="true" />
                  Call us
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default memo(AreaNetwork)
