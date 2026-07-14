import { useEffect } from 'react'
import { businessConfig } from '../data/business'

const JSONLD_ATTR = 'data-seo-jsonld'

function upsertMeta(selector, create, content) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertNamedMeta(name, content) {
  upsertMeta(`meta[name="${name}"]`, () => {
    const m = document.createElement('meta')
    m.setAttribute('name', name)
    return m
  }, content)
}

function upsertOgMeta(property, content) {
  upsertMeta(`meta[property="${property}"]`, () => {
    const m = document.createElement('meta')
    m.setAttribute('property', property)
    return m
  }, content)
}

/**
 * Per-page SEO for the SPA: title, description, canonical, Open Graph and
 * JSON-LD structured data. Important content stays in the HTML of each page —
 * this only manages head metadata.
 */
export default function Seo({ title, description, path = '/', jsonLd = [] }) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | ${businessConfig.name}`
      : `${businessConfig.name} | Plumbing & Drainage Services in Cambridge`
    document.title = fullTitle
    upsertNamedMeta('description', description)

    const canonicalUrl = `${businessConfig.siteUrl}${path === '/' ? '/' : path}`
    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', canonicalUrl)

    upsertOgMeta('og:title', fullTitle)
    upsertOgMeta('og:description', description)
    upsertOgMeta('og:url', canonicalUrl)
    upsertOgMeta('og:type', 'website')
    upsertOgMeta('og:site_name', businessConfig.name)
    upsertOgMeta('og:locale', 'en_GB')
    upsertOgMeta('og:image', `${businessConfig.siteUrl}/images/og-card.svg`)
    upsertNamedMeta('twitter:card', 'summary_large_image')

    // Replace this page's JSON-LD blocks
    document.head.querySelectorAll(`script[${JSONLD_ATTR}]`).forEach((s) => s.remove())
    jsonLd.forEach((obj) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute(JSONLD_ATTR, 'true')
      script.textContent = JSON.stringify(obj)
      document.head.appendChild(script)
    })

    return () => {
      document.head.querySelectorAll(`script[${JSONLD_ATTR}]`).forEach((s) => s.remove())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, path, JSON.stringify(jsonLd)])

  return null
}
