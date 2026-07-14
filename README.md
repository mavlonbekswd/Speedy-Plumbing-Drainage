# Speedy Plumbing & Drain — Website

Premium, cinematic multi-page website for **Speedy Plumbing & Drain** (Cambridge, UK).
Built with React + Vite + Tailwind CSS, React Router, Framer Motion, GSAP ScrollTrigger,
Three.js (React Three Fiber + Drei) and Lenis smooth scrolling.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # preview the production build
```

## Where everything lives

**All business information is in one place: [`src/data/business.js`](src/data/business.js).**
Change the phone number, email or name there and the whole site — navigation, hero,
emergency section, contact page, quote form, mobile bar, footer, structured data — updates.

| File | Contents |
| --- | --- |
| `src/data/business.js` | Name, phone, email, WhatsApp slot, hours, socials, site URL |
| `src/data/serviceAreas.js` | The 17 confirmed service areas, groupings, postcode districts |
| `src/data/services.js` | All service content (pages + homepage showcase) |
| `src/data/locationPages.js` | Unique content for the six location pages |
| `src/data/reviews.js` | Placeholder reviews (flagged) + Google review link slot |
| `src/data/projects.js` | Before/after projects (placeholder-flagged) |
| `src/data/faqs.js`, `src/data/blogPosts.js` | FAQs and advice articles |

## Before go-live checklist

1. **Domain** — set the real domain in `src/data/business.js` (`siteUrl`) and update
   `public/sitemap.xml` + `public/robots.txt`.
2. **Quote form backend** — the form currently simulates submission (see the `TODO` in
   `src/pages/Quote.jsx`). Connect it to an email service or serverless endpoint, and add
   real spam protection where the honeypot placeholder sits.
3. **Photography** — replace the SVG placeholders in `public/images/` with real
   photography (large landscape AVIF/WebP, ≥2400px wide): real pipework, drainage work,
   finished bathrooms, tools, uniforms, van, genuine before/after pairs.
4. **Reviews** — replace the samples in `src/data/reviews.js` with genuine reviews, set
   `reviewsArePlaceholders = false`, and add the Google Business Profile link.
5. **Projects** — replace placeholder projects with real jobs (with customer permission),
   set `projectsArePlaceholders = false`.
6. **Opening hours** — when confirmed, set `openingHours` in `business.js`. Do not claim
   24/7 unless the owner confirms it.
7. **WhatsApp** — when a number is confirmed, set `whatsappHref` (e.g. `https://wa.me/44…`)
   and WhatsApp buttons appear automatically (mobile bar + final CTA).
8. **Postcode checker** — currently a frontend demonstration matching postcode districts;
   connect a real coverage API in `src/components/ui/PostcodeChecker.jsx` if desired.
9. **Address** — no physical address is displayed or in schema by design; add to
   `business.js` and `src/lib/schema.js` only once a genuine address is confirmed.

## Accuracy guarantees built in

- Service areas are always presented as *areas served*, never as offices/branches.
- No fake reviews (samples are visibly labelled), ratings, hours, prices, awards,
  certifications, response-time promises or 24/7 claims.
- Structured data (Plumber/LocalBusiness with `areaServed`, Service, FAQ, Breadcrumb)
  contains only confirmed information.

## Performance & accessibility

- Route-based code splitting; the Three.js chunk loads only on capable devices.
- The 3D pipe scene is progressively enhanced: static cinematic fallback when WebGL is
  missing, on low-power devices, and under `prefers-reduced-motion`; rendering pauses
  off-screen; DPR capped; particle counts reduced on mobile.
- Full keyboard navigation, focus states, semantic HTML, skip link, aria labels,
  reduced-motion alternatives for every animation.
- All headings and copy are real HTML — nothing meaningful lives only in the canvas.
