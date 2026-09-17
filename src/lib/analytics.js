// Product analytics: PostHog + GA4 custom events, one call site.
//
// trackEvent() fans each event out to PostHog (everything) and GA4 (custom
// events). Google Ads only receives the two conversions: a phone tap and a
// delivered quote request. No consent banner by owner decision — tracking runs
// for every visitor, matching the BeBest / Fixed Rate builds.
//
// Never put personal data (name, phone, email, postcode, free text) in event
// properties. identifyUser() is the single, deliberate exception, and it only
// goes to PostHog.

import posthog from 'posthog-js'
import { gaEvent, reportConversion, toE164UkPhone } from './gtag'

const POSTHOG_KEY = import.meta.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const POSTHOG_HOST = import.meta.env.NEXT_PUBLIC_POSTHOG_HOST

let posthogReady = false

export function initPosthog() {
  if (posthogReady || typeof window === 'undefined') return
  if (!POSTHOG_KEY) {
    console.warn('[tracking] NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is unset — PostHog is disabled.')
    return
  }
  posthog.init(POSTHOG_KEY, {
    // Same-origin reverse proxy (vercel.json in production, vite server.proxy
    // in dev) so ad blockers don't eat the events.
    api_host: '/ingest',
    ui_host: POSTHOG_HOST?.includes('eu.') ? 'https://eu.posthog.com' : 'https://us.posthog.com',
    person_profiles: 'always',
    capture_pageview: 'history_change',
    capture_pageleave: true,
    autocapture: true,
    capture_heatmaps: true,
    capture_performance: true,
    disable_session_recording: false,
    session_recording: {
      maskAllInputs: true,
      maskInputOptions: { password: true, email: true, tel: true },
    },
  })
  posthogReady = true
}

export function pageType(pathname = window.location.pathname) {
  if (pathname === '/') return 'home'
  if (pathname.startsWith('/services')) return pathname === '/services' ? 'services' : 'service'
  if (pathname.startsWith('/areas')) return 'area'
  if (pathname.startsWith('/blog')) return 'blog'
  const first = pathname.split('/')[1]
  return ['quote', 'contact', 'about', 'reviews', 'faqs', 'projects'].includes(first) ? first : 'other'
}

/** @param {{transport?: 'sendBeacon'}} [options] */
export function trackEvent(name, props = {}, options) {
  const payload = {
    page_path: window.location.pathname,
    page_type: pageType(),
    ...props,
  }
  if (posthogReady) posthog.capture(name, payload, options?.transport ? { transport: options.transport } : undefined)
  gaEvent(name, payload)
}

export function identifyUser({ name, phone, email, service }) {
  if (!posthogReady) return
  const e164 = toE164UkPhone(phone)
  const id = e164 || email
  if (!id) return
  posthog.identify(id, { name, phone: e164 ?? undefined, email, last_service_requested: service })
}

// ─── Delegated CTA clicks ────────────────────────────────────────────────────
// One capture-phase listener covers every tel:/mailto:/quote/WhatsApp link on
// the site, so new call sites are tracked without touching them. Optional
// data-cta-location="navbar" etc. names the section; data-cta overrides the
// inferred type.

const CTA_SELECTOR =
  '[data-cta], a[href^="tel:"], a[href^="mailto:"], a[href^="/quote"], a[href*="wa.me"]'

const CTA_EVENTS = {
  phone: 'phone_call_click',
  email: 'email_click',
  quote: 'quote_cta_click',
  whatsapp: 'whatsapp_click',
}

function ctaType(el) {
  if (el.dataset.cta) return el.dataset.cta
  const href = el.getAttribute('href') ?? ''
  if (href.startsWith('tel:')) return 'phone'
  if (href.startsWith('mailto:')) return 'email'
  if (href.startsWith('/quote')) return 'quote'
  if (href.includes('wa.me')) return 'whatsapp'
  return null
}

function scrollDepth() {
  const doc = document.documentElement
  const max = doc.scrollHeight - window.innerHeight
  return max > 0 ? Math.round((window.scrollY / max) * 100) : 100
}

function handleDelegatedClick(e) {
  const el = e.target instanceof Element ? e.target.closest(CTA_SELECTOR) : null
  if (!el) return
  const type = ctaType(el)
  const event = CTA_EVENTS[type]
  if (!event) return
  const located = el.closest('[data-cta-location]')
  trackEvent(event, {
    cta_type: type,
    cta_location: located?.dataset.ctaLocation ?? pageType(),
    cta_label: (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80),
    scroll_depth_at_click: scrollDepth(),
  })
  if (type === 'phone') reportConversion('phone')
}

let clicksInstalled = false
export function installClickTracking() {
  if (clicksInstalled) return
  clicksInstalled = true
  document.addEventListener('click', handleDelegatedClick, true)
}

// ─── Google click ids ────────────────────────────────────────────────────────
// Stored with the lead (Telegram message) so jobs can later be uploaded to
// Google Ads as offline conversions. 90 days = Google's click window.

const CLICK_ID_KEY = 'spd_gads_click_ids'
const CLICK_ID_TTL_MS = 90 * 24 * 60 * 60 * 1000

export function captureClickIds() {
  try {
    const params = new URLSearchParams(window.location.search)
    const ids = {}
    for (const key of ['gclid', 'gbraid', 'wbraid']) {
      const value = params.get(key)
      if (value) ids[key] = value.slice(0, 255)
    }
    if (!Object.keys(ids).length) return
    localStorage.setItem(
      CLICK_ID_KEY,
      JSON.stringify({ ids, landing_page: window.location.pathname, ts: Date.now() }),
    )
  } catch {
    // Storage unavailable (private mode) — nothing to keep.
  }
}

export function readClickIds() {
  try {
    const stored = JSON.parse(localStorage.getItem(CLICK_ID_KEY) ?? 'null')
    if (!stored || Date.now() - stored.ts > CLICK_ID_TTL_MS) return {}
    return { ...stored.ids, landing_page: stored.landing_page }
  } catch {
    return {}
  }
}
