// Google tag helpers (Google Ads conversions + GA4 custom events).
//
// The tag itself is loaded statically in index.html (%VITE_GADS_ID% /
// %VITE_GA4_ID% are substituted at build time) so Google's tag checker sees it
// in the served HTML. That script defines window.dataLayer and window.gtag;
// every helper here no-ops safely if it is missing (ad blockers, tests).
//
// Every id and label comes from env — nothing is hardcoded. See .env.example.

const env = import.meta.env

export const GADS_ID = /^AW-\d{6,}$/.test(env.VITE_GADS_ID ?? '') ? env.VITE_GADS_ID : undefined
export const GA4_ID = /^G-[A-Z0-9]{6,}$/.test(env.VITE_GA4_ID ?? '') ? env.VITE_GA4_ID : undefined

// Conversion action labels (the part after the slash in "AW-xxx/label").
// While unset, the matching conversion is skipped with a single console
// warning naming the variable.
//   quote → Google Ads action "Lead form book" (Book appointment, Primary)
//   phone → Google Ads action "Website phone call" (Contact, Primary)
// Both actions default to £1 per conversion, matching Google's snippets.
const LABELS = {
  quote: { value: env.VITE_GADS_LABEL_QUOTE, envName: 'VITE_GADS_LABEL_QUOTE' },
  phone: { value: env.VITE_GADS_LABEL_PHONE, envName: 'VITE_GADS_LABEL_PHONE' },
}
const CONVERSION_VALUE = { value: 1.0, currency: 'GBP' }

const warned = new Set()
function warnOnce(key, message) {
  if (warned.has(key)) return
  warned.add(key)
  console.warn(`[tracking] ${message}`)
}

function gtag(...args) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag(...args)
}

/** Google Ads conversion. `name` is a key of LABELS. */
export function reportConversion(name) {
  const label = LABELS[name]
  if (!GADS_ID) {
    warnOnce('gads-id', 'VITE_GADS_ID is unset or malformed — Google Ads conversions are disabled.')
    return
  }
  if (!label?.value) {
    warnOnce(`label-${name}`, `${label?.envName ?? name} is unset — the "${name}" conversion was skipped.`)
    return
  }
  gtag('event', 'conversion', { send_to: `${GADS_ID}/${label.value}`, ...CONVERSION_VALUE })
}

// GA4 wants flat scalar params, 100 chars max for values.
function toGaParams(params) {
  const out = {}
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined || value === null) continue
    if (typeof value === 'number' || typeof value === 'boolean') out[key] = value
    else out[key] = (Array.isArray(value) ? value.join(',') : String(value)).slice(0, 100)
  }
  return out
}

/** GA4 custom event, routed only to the GA4 property (not the Ads tag). */
export function gaEvent(name, params) {
  if (!GA4_ID) return
  gtag('event', name, { ...toGaParams(params), send_to: GA4_ID })
}

// ─── Enhanced conversions ────────────────────────────────────────────────────
// SHA-256 on phone/names; phone normalised to E.164 first or it never matches.
// Postcode and country go plaintext — hashing them yields zero matches.

export function toE164UkPhone(phone) {
  const digits = String(phone ?? '').replace(/[^\d+]/g, '')
  if (digits.startsWith('+')) return digits
  if (digits.startsWith('00')) return `+${digits.slice(2)}`
  if (digits.startsWith('0')) return `+44${digits.slice(1)}`
  if (digits.startsWith('44')) return `+${digits}`
  return digits.length >= 10 ? `+44${digits}` : null
}

async function sha256Hex(value) {
  const normalised = String(value ?? '').trim().toLowerCase()
  const subtle = globalThis.crypto?.subtle
  // No SubtleCrypto (insecure context): send nothing rather than raw values.
  if (!normalised || !subtle) return null
  const digest = await subtle.digest('SHA-256', new TextEncoder().encode(normalised))
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}

/** Must be awaited before reportConversion('quote'). */
export async function setEnhancedConversionUserData({ name, phone, email, postcode }) {
  if (!GADS_ID) return
  const e164 = toE164UkPhone(phone)
  const [firstName, ...rest] = String(name ?? '').trim().split(/\s+/)
  const lastName = rest.join(' ')

  const [phoneHash, emailHash, firstHash, lastHash] = await Promise.all([
    e164 ? sha256Hex(e164) : null,
    email ? sha256Hex(email) : null,
    firstName ? sha256Hex(firstName) : null,
    lastName ? sha256Hex(lastName) : null,
  ])

  const address = {}
  if (firstHash) address.sha256_first_name = firstHash
  if (lastHash) address.sha256_last_name = lastHash
  if (postcode?.trim()) {
    address.postal_code = postcode.trim().toUpperCase()
    address.country = 'GB'
  }

  const userData = {}
  if (emailHash) userData.sha256_email_address = emailHash
  if (phoneHash) userData.sha256_phone_number = phoneHash
  if (Object.keys(address).length) userData.address = address

  if (Object.keys(userData).length) gtag('set', 'user_data', userData)
}
