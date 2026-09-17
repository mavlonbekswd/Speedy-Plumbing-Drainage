// Telegram delivery for quote requests. There is no database: the message in
// the business group IS the lead record, so a request only counts as received
// once Telegram has accepted it.
//
// Env (server-only, never VITE_-prefixed):
//   TELEGRAM_BOT_TOKEN       — from @BotFather
//   TELEGRAM_CHAT_ID         — the group's id once the bot has been added
//   TELEGRAM_ADMIN_MENTIONS  — optional, e.g. "@dave @sam"; added to emergencies

const TG_TIMEOUT_MS = 10_000
const TG_RETRY_DELAY_MS = 500

export function telegramConfigured() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID)
}

function tgUrl(method) {
  return `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${method}`
}

// One attempt. true on 2xx; throws on network error / timeout / 5xx so the
// caller retries; 4xx (bad token or chat id) is not retryable.
async function attempt(method, body) {
  const isForm = body instanceof FormData
  const res = await fetch(tgUrl(method), {
    method: 'POST',
    headers: isForm ? undefined : { 'Content-Type': 'application/json' },
    body: isForm ? body : JSON.stringify(body),
    signal: AbortSignal.timeout(TG_TIMEOUT_MS),
  })
  if (res.ok) return true
  const text = await res.text().catch(() => '')
  if (res.status >= 500) throw new Error(`Telegram ${method} ${res.status}: ${text}`)
  console.error(`Telegram ${method} failed:`, res.status, text)
  return false
}

// buildBody is a factory because a FormData body can't be safely re-sent.
async function tgCall(method, buildBody) {
  try {
    return await attempt(method, buildBody())
  } catch (err) {
    console.error(`Telegram ${method} failed (retrying once):`, err)
  }
  await new Promise((r) => setTimeout(r, TG_RETRY_DELAY_MS))
  try {
    return await attempt(method, buildBody())
  } catch (err) {
    console.error(`Telegram ${method} failed on retry:`, err)
    return false
  }
}

const escapeHtml = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const URGENCY_LABELS = {
  emergency: 'EMERGENCY — water flowing now',
  urgent: 'Urgent — within a day or two',
  soon: 'This week',
  planned: 'Planned work',
}

function quoteMessage(q) {
  const isEmergency = q.urgency === 'emergency'
  const mentions = isEmergency ? process.env.TELEGRAM_ADMIN_MENTIONS?.trim() : ''
  const clickId = q.gclid ? `gclid: ${q.gclid}` : q.gbraid ? `gbraid: ${q.gbraid}` : q.wbraid ? `wbraid: ${q.wbraid}` : null
  const line = (label, value) => (value ? `<b>${label}:</b> ${escapeHtml(value)}` : null)

  return [
    isEmergency
      ? '🚨 <b>EMERGENCY QUOTE REQUEST</b> — Speedy Plumbing &amp; Drain'
      : '🔧 <b>New quote request</b> — Speedy Plumbing &amp; Drain',
    '',
    line('Name', q.name),
    line('Phone', q.phone),
    line('Email', q.email),
    line('Postcode', q.postcode),
    line('Problem', q.service),
    line('Urgency', URGENCY_LABELS[q.urgency] ?? q.urgency),
    line('Preferred contact', q.contactMethod),
    line('Details', q.details),
    q.photos.length ? `<b>Photos:</b> ${q.photos.length} (sent below)` : null,
    clickId ? '' : null,
    clickId ? '<b>Source:</b> Google Ads click' : null,
    clickId ? escapeHtml(clickId) : null,
    line('Landed on', q.landing_page),
    mentions ? '' : null,
    mentions ? escapeHtml(mentions) : null,
  ]
    .filter((l) => l !== null)
    .join('\n')
}

/**
 * Sends the quote. Resolves true only if the text message was accepted.
 * Photos are best-effort: a photo failure is logged but does not fail the
 * lead, because the contact details already reached the group.
 */
export async function notifyQuoteTelegram(q) {
  if (!telegramConfigured()) {
    console.error('Telegram not configured: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are required')
    return false
  }
  const chatId = process.env.TELEGRAM_CHAT_ID

  const sent = await tgCall('sendMessage', () => ({
    chat_id: chatId,
    text: quoteMessage(q),
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  }))
  if (!sent || !q.photos.length) return sent

  const caption = `Photos from ${q.name} (${q.postcode})`
  // sendMediaGroup needs 2–10 items, so a single photo goes via sendPhoto.
  const photosOk = q.photos.length === 1
    ? await tgCall('sendPhoto', () => {
        const fd = new FormData()
        fd.append('chat_id', chatId)
        fd.append('caption', caption)
        fd.append('photo', q.photos[0], q.photos[0].name || 'photo.jpg')
        return fd
      })
    : await tgCall('sendMediaGroup', () => {
        const fd = new FormData()
        fd.append('chat_id', chatId)
        fd.append(
          'media',
          JSON.stringify(
            q.photos.map((_, i) => ({
              type: 'photo',
              media: `attach://photo${i}`,
              ...(i === 0 ? { caption } : {}),
            })),
          ),
        )
        q.photos.forEach((file, i) => fd.append(`photo${i}`, file, file.name || `photo${i}.jpg`))
        return fd
      })
  if (!photosOk) console.error('Telegram photos failed — text lead was delivered without them.')
  return true
}
