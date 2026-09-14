# Speedy Plumbing & Drain — Website

Multi-page marketing site for **Speedy Plumbing & Drain** (Cambridge, UK): 7 services,
17 service areas, 6 dedicated location pages, an interactive coverage map, a six-step
quote wizard and a scroll-driven 3D hero.

**Stack:** React 18 · Vite 5 · Tailwind CSS 4 · React Router 6 · Framer Motion ·
GSAP ScrollTrigger · Three.js (React Three Fiber + Drei) · Lenis smooth scrolling.

---

## Quick start

Requires Node 18+ (developed on Node 21).

```bash
npm install
npm run dev      # http://localhost:5173  (override with PORT=5176 npm run dev)
npm run build    # production bundle in dist/
npm run preview  # serve the production build locally
```

---

## Deployment

The site is a **single-page app**: every route below `/` is rendered by React Router on
the client, and the server only ever has one real file to serve — `index.html`.

[`vercel.json`](vercel.json) is what makes that work. It rewrites every non-asset request
to `/index.html` so `/contact`, `/services/drainage` and every other deep link resolve on
a hard refresh, from a search result, or from a shared link. **Without it the homepage
works and every other URL returns 404.** If you move off Vercel, the new host needs the
same SPA fallback (Netlify: `_redirects` with `/* /index.html 200`; nginx:
`try_files $uri /index.html`).

The same file sets long-lived immutable caching on `/assets` and `/images` (both are
content-hashed or stable) plus `X-Content-Type-Options`, `Referrer-Policy` and
`X-Frame-Options`.

---

## Where everything lives

**All business information is in one place: [`src/data/business.js`](src/data/business.js).**
Change the phone number, email or name there and the whole site — navigation, hero,
emergency section, contact page, quote form, mobile bar, footer, structured data —
updates with it.

| File | Contents |
| --- | --- |
| `src/data/business.js` | Name, phone, email, WhatsApp slot, hours, socials, site URL |
| `src/data/serviceAreas.js` | The 17 confirmed service areas, groupings, postcode districts, network graph |
| `src/data/services.js` | All service content (pages + homepage showcase) |
| `src/data/images.js` | Responsive image sources, dimensions, crop positions and alt text |
| `src/data/locationPages.js` | Unique content for the six location pages |
| `src/data/reviews.js` | Placeholder reviews (flagged) + Google review link slot |
| `src/data/projects.js` | Clearly disclosed illustrative before/after service examples |
| `src/data/faqs.js`, `src/data/blogPosts.js` | 8 FAQs and 3 advice articles |
| `src/lib/routes.js` | Single source of truth for route code-splitting + navbar prefetch |
| `src/lib/seo.jsx` | Per-page title, description, canonical, Open Graph and JSON-LD |
| `src/lib/schema.js` | schema.org builders (Plumber, Service, FAQPage, BreadcrumbList) |

---

## Responsive behaviour

Tailwind's default breakpoints are used throughout (`sm` 640 · `md` 768 · `lg` 1024 ·
`xl` 1280). Layout is verified with no horizontal overflow on every route at **320, 375,
768, 1024 and full desktop width**.

Things worth knowing before you edit layout:

- **Heroes use `min-h-[100svh]`, not `min-h-screen`.** On mobile `100vh` is the *largest*
  viewport — the CTAs end up underneath the browser's URL bar. `svh` is the smallest
  viewport, so the call button is always reachable without scrolling.
- **`Hero` carries `pt-28`** purely to clear the fixed 84px header. Without it, on short
  viewports (iPhone SE, landscape phones) the content column starts at the very top of
  the section and slides underneath the navbar.
- **The one exception is `CinematicIntro`.** Its sticky 3D backdrop is `h-screen` paired
  with `-mt-[100vh]` on the content that overlays it. Those two must always match, and
  `vh` is correct there: a background wants the *largest* viewport so it can never leave
  a gap when the URL bar retracts.
- **The header CTAs are `whitespace-nowrap` with tighter padding below `xl`.** At exactly
  1024px the six nav links plus both buttons are a close fit; without this the labels
  wrap to two lines and the header grows by 20px.
- **`MobileContactBar` is fixed at the bottom below `lg`**, so `Footer` carries
  `pb-28 lg:pb-12` to stay clear of it. Anything else pinned to the bottom of a page
  needs the same allowance.
- **`useIsMobile` uses `matchMedia`, not a resize listener.** On mobile every URL-bar
  show/hide fires `resize` with an unchanged width; a listener re-rendered the whole
  subscriber tree on each scroll gesture.

---

## Accessibility

- Skip link, semantic landmarks, real heading hierarchy, visible `:focus-visible` rings.
- The mobile menu is a proper modal: `Escape` closes it, `Tab` is trapped inside it,
  focus moves in on open and returns to the toggle button on close, and scrolling is
  locked — including Lenis, which drives scroll programmatically and has to be
  `stop()`ped explicitly rather than relying on `overflow: hidden` alone.
- Every animation has a reduced-motion path. `ProcessStory` renders as a plain static
  list instead of a pinned scroll sequence; the 3D scene falls back to a static image;
  CSS animations are neutralised globally in `index.css`.
- Touch targets are at least 44px. Both CTA buttons and form controls use `min-h-12`/`min-h-13`.
- Nothing meaningful lives only inside the canvas — all headings and copy are real HTML.

---

## Performance

- Route-based code splitting (`src/lib/routes.js`); the navbar prefetches a route's chunk
  on hover, focus and `touchstart`.
- `three` is a separate ~950kB chunk (263kB gzipped) that is **never** on the critical
  path — `SceneGate` only imports it on devices that pass a WebGL and power check. The
  build's `chunkSizeWarningLimit` is raised to 1000kB for exactly this reason.
- Responsive AVIF/WebP images with explicit `width`/`height` (no layout shift),
  per-image crop positioning, lazy loading below the fold and `fetchpriority="high"` on
  page heroes.
- The 3D scene pauses when off-screen, caps DPR, and reduces particle counts on mobile.

---

## SEO

Per-page titles, descriptions, canonicals, Open Graph tags and JSON-LD
(`Plumber`/`LocalBusiness` with `areaServed`, `Service`, `FAQPage`, `BreadcrumbList`)
are managed by `src/lib/seo.jsx`. The 404 page opts into `noindex, follow` via the
`noIndex` prop so it can never enter the index.

`index.html` carries a **static** baseline title, description and Open Graph card
(`/images/og-card.png`, 1200×630). This matters: social crawlers (Facebook, LinkedIn,
WhatsApp, X) do not execute JavaScript, so anything injected only by `seo.jsx` is
invisible to them.

> **Known limitation.** Because the runtime meta is client-side, every shared link
> currently previews with the *same* homepage card regardless of which page was shared,
> and non-JS crawlers see one title for the whole site. Google renders JavaScript and
> does pick up the per-page values. Fixing this properly means prerendering the routes at
> build time (`vite build --ssr` + a prerender script) or moving to a framework with SSR.
> It is the single largest remaining item if organic search matters.

---

## Before go-live

1. **Domain** — `siteUrl` in `src/data/business.js` is still the placeholder
   `www.speedyplumbinganddrain.co.uk`, which does not currently resolve (NXDOMAIN).
   Canonical URLs and the absolute `og:image` URL are both built from it, so **social
   previews stay blank and canonicals point at nothing until this is set.** Update it
   together with `public/sitemap.xml` and `public/robots.txt`.
2. **Quote form backend** — ⚠️ **the form does not send anything yet.** `submit()` in
   [`src/pages/Quote.jsx`](src/pages/Quote.jsx) logs the enquiry to the console, waits
   900ms and shows "Request received". A customer filling it in today gets a success
   screen and nobody is notified. Wire it to a serverless endpoint or email service, and
   replace the honeypot with real spam protection, **before this site takes traffic.**
   Uploaded photos are collected in state but never transmitted — the backend needs to
   accept them too.
3. **Photography** — the site uses generated, photorealistic illustrative imagery in
   responsive AVIF/WebP variants. Replace with genuine company photography when
   available, keeping the same filenames and crop ratios where practical.
4. **Reviews** — replace the samples in `src/data/reviews.js` with genuine reviews, set
   `reviewsArePlaceholders = false`, and add the Google Business Profile link.
5. **Projects** — replace the disclosed illustrative examples with real jobs (with
   customer permission), then remove the illustrative disclosure flag.
6. **Opening hours** — when confirmed, set `openingHours` in `business.js`. Do not claim
   24/7 unless the owner confirms it.
7. **WhatsApp** — when a number is confirmed, set `whatsappHref` (e.g. `https://wa.me/44…`)
   and WhatsApp buttons appear automatically (mobile bar + final CTA).
8. **Postcode checker** — currently a frontend demonstration matching postcode districts;
   connect a real coverage API in `src/components/ui/PostcodeChecker.jsx` if desired.
9. **Address** — no physical address is displayed or in schema by design; add to
   `business.js` and `src/lib/schema.js` only once a genuine address is confirmed.

---

## Content accuracy rules

These are deliberate and should survive future edits:

- Service areas are always presented as *areas served*, never as offices or branches.
- No fake reviews (samples are visibly labelled), ratings, hours, prices, awards,
  certifications, response-time promises or 24/7 claims.
- Structured data contains only confirmed information — address, opening hours,
  aggregate ratings and prices are intentionally absent until the owner supplies them.
