import { businessConfig } from '../data/business'
import { serviceAreas } from '../data/serviceAreas'

// schema.org builders. Deliberately excluded until confirmed by the owner:
// address, opening hours, ratings/review counts, prices, awards, certifications.

export function plumberSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Plumber', // subtype of LocalBusiness
    '@id': `${businessConfig.siteUrl}/#business`,
    name: businessConfig.name,
    telephone: businessConfig.phoneE164,
    email: businessConfig.email,
    url: businessConfig.siteUrl,
    description: businessConfig.tagline,
    areaServed: serviceAreas.map((a) => ({ '@type': 'Place', name: a.displayName })),
  }
}

export function serviceSchema(service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    serviceType: service.name,
    description: service.short,
    url: `${businessConfig.siteUrl}/services/${service.slug}`,
    provider: { '@id': `${businessConfig.siteUrl}/#business` },
    areaServed: serviceAreas.map((a) => ({ '@type': 'Place', name: a.displayName })),
  }
}

export function faqSchema(faqList) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqList.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function breadcrumbSchema(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${businessConfig.siteUrl}${c.path}`,
    })),
  }
}
