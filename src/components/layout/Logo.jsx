import { Link } from 'react-router-dom'
import { businessConfig } from '../../data/business'

export default function Logo({ compact = false }) {
  return (
    <Link
      to="/"
      className="group flex items-center gap-3"
      aria-label={`${businessConfig.name} — home`}
    >
      <svg viewBox="0 0 40 40" className="size-9 shrink-0" aria-hidden="true">
        <rect x="1" y="1" width="38" height="38" rx="6" fill="#12161d" stroke="#38bdf8" strokeOpacity="0.5" />
        {/* Pipe elbow with droplet */}
        <path
          d="M10 12 h10 a8 8 0 0 1 8 8 v8"
          fill="none"
          stroke="#8b97a8"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M10 12 h10 a8 8 0 0 1 8 8 v8"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="4 5"
        />
        <path d="M13 26 c0 -2.6 3 -6 3 -6 s3 3.4 3 6 a3 3 0 1 1 -6 0 Z" fill="#38bdf8" />
      </svg>
      {!compact && (
        <span className="leading-none">
          <span className="font-display block text-lg tracking-wide text-white uppercase">Speedy</span>
          <span className="mt-0.5 block text-[10px] font-semibold tracking-[0.22em] text-steel uppercase">
            Plumbing &amp; Drain
          </span>
        </span>
      )}
    </Link>
  )
}
