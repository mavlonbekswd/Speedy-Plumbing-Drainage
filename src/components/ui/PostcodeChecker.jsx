import { useState } from 'react'
import { CheckCircle2, MapPin, PhoneCall, Search } from 'lucide-react'
import { businessConfig } from '../../data/business'
import { coveredPostcodeDistricts, districtToAreaIds, getNetworkArea } from '../../data/serviceAreas'

const POSTCODE_RE = /^([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})?$/i

function extractDistrict(value) {
  const cleaned = value.trim().toUpperCase().replace(/\s+/g, ' ')
  if (!cleaned) return null
  const match = cleaned.match(POSTCODE_RE)
  if (!match) return null
  return match[1]
}

/**
 * Instant frontend coverage check against the confirmed postcode districts.
 * It never claims an area is NOT covered — unmatched postcodes are asked to
 * call and confirm. `onResult` reports the outcome (or null when the input
 * resets) so the Areas page can highlight matching nodes on the network map.
 */
export default function PostcodeChecker({ dark = true, onResult }) {
  const [value, setValue] = useState('')
  const [state, setState] = useState('idle') // idle | covered | unknown | invalid
  const [matchedNames, setMatchedNames] = useState([])

  function check(e) {
    e.preventDefault()
    const district = extractDistrict(value)
    if (!district) {
      setState('invalid')
      setMatchedNames([])
      onResult?.(null)
      return
    }
    const covered = coveredPostcodeDistricts.includes(district)
    const areaIds = covered ? (districtToAreaIds[district] ?? []) : []
    const names = areaIds.map((id) => getNetworkArea(id)?.name).filter(Boolean)
    setState(covered ? 'covered' : 'unknown')
    setMatchedNames(names)
    onResult?.({ status: covered ? 'covered' : 'unknown', district, areaIds, areaNames: names })
  }

  const inputCls = dark
    ? 'bg-white/5 border-white/15 text-white placeholder:text-steel'
    : 'bg-white border-charcoal/15 text-charcoal placeholder:text-steel-dark'

  return (
    <div className="w-full max-w-xl">
      <form onSubmit={check} className="flex flex-col gap-3 sm:flex-row" noValidate>
        <label htmlFor="postcode-check" className="sr-only">
          Enter your postcode to check coverage
        </label>
        <input
          id="postcode-check"
          type="text"
          inputMode="text"
          autoComplete="postal-code"
          autoCapitalize="characters"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            if (state !== 'idle') {
              setState('idle')
              setMatchedNames([])
              onResult?.(null)
            }
          }}
          placeholder="Enter your postcode, e.g. CB1 2AB"
          className={`min-h-12 flex-1 rounded-sm border px-5 py-3 text-base outline-none transition-colors focus:border-electric ${inputCls}`}
        />
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-electric px-6 py-3 text-sm font-semibold tracking-wide text-charcoal uppercase transition-colors hover:bg-white"
        >
          <Search className="size-4" aria-hidden="true" />
          Check Coverage
        </button>
      </form>

      <div aria-live="polite" className="mt-4 min-h-6 text-sm">
        {state === 'invalid' && (
          <p className="text-amber">
            That doesn’t look like a UK postcode — please check and try again.
          </p>
        )}
        {state === 'covered' && (
          <p className="flex items-start gap-2 text-electric">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>
              Great news — {businessConfig.name} serves your area. Final availability is confirmed by
              phone.
              {matchedNames.length > 0 && (
                <span className={dark ? 'block text-mist/70' : 'block text-steel-dark'}>
                  Highlighted on the map: {matchedNames.join(', ')}.
                </span>
              )}
            </span>
          </p>
        )}
        {state === 'unknown' && (
          <p className={`flex items-start gap-2 ${dark ? 'text-steel' : 'text-steel-dark'}`}>
            <PhoneCall className="mt-0.5 size-4 shrink-0 text-amber" aria-hidden="true" />
            <span>
              Your area may still be covered. Please call{' '}
              <a
                href={businessConfig.phoneHref}
                className={`font-semibold underline underline-offset-2 ${dark ? 'text-white' : 'text-charcoal'}`}
              >
                {businessConfig.phoneDisplay}
              </a>{' '}
              to confirm.
            </span>
          </p>
        )}
      </div>

      <p className={`mt-2 flex items-center gap-1.5 text-xs ${dark ? 'text-steel/70' : 'text-steel-dark/70'}`}>
        <MapPin className="size-3" aria-hidden="true" />
        Instant check by postcode district — final confirmation is always by phone.
      </p>
    </div>
  )
}
