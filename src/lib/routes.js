// Single source of truth for route-level code splitting. App.jsx builds its
// lazy components from these loaders, and the navbar warms them up on
// hover/focus/touchstart so navigation feels immediate — the browser caches
// the module, so calling a loader twice never double-fetches.

export const routeLoaders = {
  home: () => import('../pages/Home'),
  services: () => import('../pages/Services'),
  servicePage: () => import('../pages/ServicePage'),
  projects: () => import('../pages/Projects'),
  areasWeCover: () => import('../pages/AreasWeCover'),
  locationPage: () => import('../pages/LocationPage'),
  about: () => import('../pages/About'),
  reviews: () => import('../pages/ReviewsPage'),
  faqs: () => import('../pages/FaqsPage'),
  blog: () => import('../pages/Blog'),
  blogPost: () => import('../pages/BlogPost'),
  contact: () => import('../pages/Contact'),
  quote: () => import('../pages/Quote'),
  notFound: () => import('../pages/NotFound'),
}

// Ordered: first match wins. Only the page JS module is fetched — no images
// or animation assets.
const pathMatchers = [
  [/^\/$/, 'home'],
  [/^\/services\/.+/, 'servicePage'],
  [/^\/services$/, 'services'],
  [/^\/projects$/, 'projects'],
  [/^\/areas-we-cover$/, 'areasWeCover'],
  [/^\/areas\/.+/, 'locationPage'],
  [/^\/about$/, 'about'],
  [/^\/reviews$/, 'reviews'],
  [/^\/faqs$/, 'faqs'],
  [/^\/blog\/.+/, 'blogPost'],
  [/^\/blog$/, 'blog'],
  [/^\/contact$/, 'contact'],
  [/^\/quote$/, 'quote'],
]

const prefetched = new Set()

/** Preload the JS chunk for an internal path. Safe to call repeatedly. */
export function prefetchRoute(path) {
  const match = pathMatchers.find(([re]) => re.test(path))
  const key = match ? match[1] : null
  if (!key || prefetched.has(key)) return
  prefetched.add(key)
  routeLoaders[key]().catch(() => {
    // Allow a retry (e.g. flaky connection) — real navigation still works
    // through React.lazy regardless.
    prefetched.delete(key)
  })
}
