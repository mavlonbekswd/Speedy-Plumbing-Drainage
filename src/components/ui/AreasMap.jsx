import { motion, useReducedMotion } from 'framer-motion'

// Stylised — deliberately not geographically exact — map of the service
// region. Points are AREAS SERVED, not offices; no pin implies a premises.
const points = [
  { name: 'Ely', x: 63, y: 16, major: true },
  { name: 'Huntingdon', x: 16, y: 28, major: true },
  { name: 'Cottenham', x: 47, y: 32 },
  { name: 'Waterbeach', x: 56, y: 36 },
  { name: 'Impington', x: 46, y: 43 },
  { name: 'Milton', x: 53, y: 43 },
  { name: 'Newmarket', x: 82, y: 44, major: true },
  { name: 'Cambourne', x: 28, y: 50 },
  { name: 'St Neots', x: 12, y: 54, major: true },
  { name: 'Cambridge', x: 50, y: 52, major: true, hub: true },
  { name: 'Fulbourn', x: 61, y: 55 },
  { name: 'Cherry Hinton', x: 56, y: 57 },
  { name: 'Great Shelford', x: 51, y: 63 },
  { name: 'Little Shelford', x: 47, y: 66 },
  { name: 'Sawston', x: 54, y: 71 },
  { name: 'Haverhill', x: 76, y: 76, major: true },
  { name: 'Royston', x: 30, y: 84, major: true },
]

const hub = points.find((p) => p.hub)

export default function AreasMap() {
  const reduced = useReducedMotion()

  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label="Stylised map of the Cambridgeshire region showing the areas Speedy Plumbing and Drain covers, centred on Cambridge"
      className="h-auto w-full max-w-2xl"
    >
      {/* Soft regional backdrop */}
      <defs>
        <radialGradient id="mapGlow" cx="50%" cy="52%" r="60%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.10" />
          <stop offset="60%" stopColor="#0e1a2e" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0b0d10" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="52" rx="48" ry="46" fill="url(#mapGlow)" />

      {/* Animated connection lines from the Cambridge hub */}
      {points
        .filter((p) => !p.hub)
        .map((p) => (
          <motion.line
            key={`line-${p.name}`}
            x1={hub.x}
            y1={hub.y}
            x2={p.x}
            y2={p.y}
            stroke="#38bdf8"
            strokeOpacity="0.22"
            strokeWidth="0.25"
            initial={reduced ? false : { pathLength: 0 }}
            whileInView={reduced ? undefined : { pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          />
        ))}

      {/* Location points */}
      {points.map((p, i) => (
        <motion.g
          key={p.name}
          initial={reduced ? false : { opacity: 0, scale: 0.6 }}
          whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.06 * i, ease: 'easeOut' }}
          style={{ transformOrigin: `${p.x}px ${p.y}px` }}
        >
          {/* Soft pulse */}
          <circle cx={p.x} cy={p.y} r={p.major ? 2.4 : 1.6} fill="#38bdf8" opacity="0.18">
            {!reduced && (
              <animate
                attributeName="r"
                values={p.major ? '2.4;4.4;2.4' : '1.6;3;1.6'}
                dur="3.2s"
                begin={`${(i % 5) * 0.5}s`}
                repeatCount="indefinite"
              />
            )}
          </circle>
          <circle
            cx={p.x}
            cy={p.y}
            r={p.hub ? 1.5 : p.major ? 1.1 : 0.8}
            fill={p.hub ? '#38bdf8' : p.major ? '#e8f4ff' : '#8b97a8'}
          />
          {p.major && (
            <text
              x={p.x}
              y={p.y - (p.hub ? 3.2 : 2.6)}
              textAnchor="middle"
              fill={p.hub ? '#38bdf8' : '#c7d2de'}
              fontSize={p.hub ? 3.4 : 2.8}
              fontFamily="Inter, sans-serif"
              fontWeight="600"
              letterSpacing="0.08"
            >
              {p.name}
            </text>
          )}
        </motion.g>
      ))}
    </svg>
  )
}

export const mapPointNames = points.map((p) => p.name)
