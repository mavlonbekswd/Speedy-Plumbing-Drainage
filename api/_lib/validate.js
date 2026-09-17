// Server-side validation for quote requests. The browser checks are UX only;
// these are the ones that count. (Files under api/_lib are not routes.)

const UK_POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Plain digits, 10–15 long, or null. */
export function normalizePhone(raw) {
  const digits = String(raw ?? '').replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 15 ? digits : null
}

/** "cb12ab" → "CB1 2AB", or null. */
export function normalizePostcode(raw) {
  const upper = String(raw ?? '').toUpperCase().trim()
  if (!UK_POSTCODE_RE.test(upper)) return null
  const compact = upper.replace(/\s+/g, '')
  if (compact.length < 5 || compact.length > 7) return null
  return `${compact.slice(0, -3)} ${compact.slice(-3)}`
}

export function normalizeEmail(raw) {
  const email = String(raw ?? '').trim().slice(0, 254)
  return EMAIL_RE.test(email) ? email : null
}

export function clean(raw, max) {
  const value = String(raw ?? '').trim().slice(0, max)
  return value || null
}
