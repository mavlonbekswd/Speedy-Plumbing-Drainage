// POST /api/quote — receives the /quote form (multipart/form-data) and
// delivers it to the business Telegram group. Success (2xx) is returned only
// once Telegram accepted the message; the client fires the Google Ads
// conversion on that response and nothing earlier.

import { notifyQuoteTelegram } from './_lib/telegram.js'
import { clean, normalizeEmail, normalizePhone, normalizePostcode } from './_lib/validate.js'

const MAX_PHOTOS = 4
const MAX_PHOTO_BYTES = 10 * 1024 * 1024
const URGENCIES = new Set(['emergency', 'urgent', 'soon', 'planned'])

const json = (body, status = 200) => Response.json(body, { status })

// Cross-site posts are treated as spam. Compare against the Host header the
// browser actually addressed (x-forwarded-host first — Vercel terminates TLS).
function isCrossOrigin(request) {
  const origin = request.headers.get('origin')
  if (!origin) return false
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  if (!host) return false
  try {
    return new URL(origin).host.toLowerCase() !== host.toLowerCase()
  } catch {
    return true
  }
}

export async function POST(request) {
  let fd
  try {
    fd = await request.formData()
  } catch {
    return json({ error: 'Bad request' }, 400)
  }
  const get = (key) => fd.get(key)

  // Spam gets a fake success so bots can't tell they were filtered.
  if (String(get('company') ?? '').trim() !== '' || isCrossOrigin(request)) {
    return json({ ok: true })
  }

  const name = clean(get('name'), 120)
  const phone = normalizePhone(get('phone'))
  const email = normalizeEmail(get('email'))
  const postcode = normalizePostcode(get('postcode'))
  const details = clean(get('details'), 3000)
  const service = clean(get('service'), 120)
  const urgency = String(get('urgency') ?? '')

  const invalid = []
  if (!name || name.length < 2) invalid.push('name')
  if (!phone) invalid.push('phone')
  if (!email) invalid.push('email')
  if (!postcode) invalid.push('postcode')
  if (!details || details.length < 10) invalid.push('details')
  if (!service) invalid.push('service')
  if (!URGENCIES.has(urgency)) invalid.push('urgency')
  if (String(get('consent')) !== 'true') invalid.push('consent')
  if (invalid.length) return json({ error: 'Invalid fields', fields: invalid }, 422)

  const photos = fd
    .getAll('photos')
    .filter((f) => typeof f === 'object' && f && f.size > 0 && f.size <= MAX_PHOTO_BYTES && String(f.type).startsWith('image/'))
    .slice(0, MAX_PHOTOS)

  const quote = {
    name,
    phone,
    email,
    postcode,
    details,
    service,
    urgency,
    contactMethod: clean(get('contactMethod'), 40),
    photos,
    gclid: clean(get('gclid'), 255),
    gbraid: clean(get('gbraid'), 255),
    wbraid: clean(get('wbraid'), 255),
    landing_page: clean(get('landing_page'), 255),
  }

  const sent = await notifyQuoteTelegram(quote)
  if (!sent) {
    console.error('Quote NOT delivered to Telegram:', { name, phone, postcode })
    return json({ error: 'Failed to send quote request' }, 500)
  }
  return json({ ok: true })
}
