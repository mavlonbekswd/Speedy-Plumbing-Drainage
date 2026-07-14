# Speedy Plumbing & Drain — Design Concept & Build Plan

This document covers the ten pre-build items required by `instruction.md`, updated with the
confirmed business information in `Contact.md`.

---

## 1. Creative Design Concept

**"Engineered Flow."** The site borrows its visual language from premium architecture and
automotive marques rather than local-trade templates: near-black charcoal and deep navy
canvases, oversized condensed display type (Anton) set against quiet Inter body text,
restrained electric-blue accents, and warm amber reserved exclusively for emergency actions.

Every section is composed editorially — huge headlines, generous negative space, full-bleed
imagery, asymmetric grids — while the conversion layer (Call Now, quote requests, the mobile
contact bar) stays persistently one tap away. Dark industrial sections alternate with clean,
bright "finished bathroom" sections to mirror the company's promise: from problem to pristine.

## 2. 3D Scroll Story

A single continuous WebGL scene sits behind the hero and problem-introduction sections:

1. The camera rests inside a dark, metallic pipe environment (brushed steel, soft rim light).
2. As the user scrolls, the camera travels forward past flanged joints and side pipework.
3. A stream of water particles flows through a translucent inspection section.
4. Mid-journey, a dark blockage mass becomes visible and the flow stutters.
5. Continued scrolling clears the blockage — it dissolves and the flow returns, faster and
   brighter, the lighting shifting from cold steel to clean electric blue.
6. The scene brightens and fades out as the page transitions into the light services section —
   the "clean modern bathroom" resolution is carried by the page itself.

The story communicates the service (find the problem, clear it, leave it flowing) rather than
existing as decoration. Camera motion is slow, reversible, and subtle; no rapid rotation.

## 3. Homepage Wireframe

1. **Cinematic hero** — full-screen 3D/imagery, "Plumbing Problems Don't Wait.", Call Now +
   Get a Quote, Cambridge service line, availability indicator, scroll cue.
2. **Problem introduction** — "Leaks. Blockages. Low Pressure." editorial reveals over the
   continuing 3D scene.
3. **Main services** — six oversized alternating panels (image/text, full-bleed, dark 3D detail).
4. **Emergency section** — dramatic dark panel, amber accents, phone-first.
5. **Scroll story (pinned)** — the six-step job process, scrubbed by scroll.
6. **Before & after** — full-width drag comparison slider with project details.
7. **Why choose us** — asymmetric grid, six trust blocks.
8. **Reviews** — horizontal premium carousel (clearly-labelled placeholders until genuine
   reviews are supplied).
9. **Areas covered** — stylised Cambridgeshire map, pulsing points, postcode-check CTA.
10. **Final CTA** — full-screen "Need a Plumber Today?" with call/email/quote actions.

## 4. Mobile Layout Strategy

- Fixed bottom contact bar: **Call · Email · Get Quote** (per confirmed contact details;
  a WhatsApp slot exists in config and appears automatically once a number is confirmed).
- The full desktop 3D scene never loads on phones: reduced particle counts, capped device
  pixel ratio, no expensive transparency, and a static cinematic fallback on weak devices,
  when WebGL is unavailable, or when reduced motion is requested.
- Single-column editorial stacking, `clamp()`-driven type so headlines stay huge but never
  overflow, 48px+ touch targets, full-screen overlay navigation.
- The Call Now button is plain HTML rendered before any 3D loads.

## 5. Animation System

- **Lenis** provides smooth native scrolling (disabled under `prefers-reduced-motion`).
- **GSAP ScrollTrigger** drives scroll-scrubbed work: 3D camera progress, the pinned process
  story, text reveals and parallax. Triggers are created in `gsap.context()` and killed on
  unmount; all scrubbed animations are reversible.
- **Framer Motion** handles page transitions (fast fade + rise with a dark wipe), the mobile
  menu overlay, and micro-interactions.
- Only the process story is pinned; everything else scrolls naturally.
- Under reduced motion: no Lenis, no scrub animations, no parallax, static image instead of
  3D, content fully visible and functional.

## 6. Performance Strategy

- Route-based code splitting (`React.lazy`) for every page; the Three.js bundle is a separate
  lazy chunk that only loads for capable devices on the homepage.
- All geometry is procedural (no downloaded models), so there are no GLB payloads at all;
  if GLB assets are added later they must be Draco-compressed with KTX2 textures.
- Canvas rendering pauses (frameloop `never`) whenever the scene leaves the viewport.
- DPR capped (1.5 mobile / 2 desktop), shadows disabled on mobile, particle counts scaled.
- Images are lightweight SVG placeholders today; production photography should ship as
  AVIF/WebP with responsive `srcset` (documented in README).
- Content and headings live in HTML — nothing important is canvas-only.

## 7. Folder Structure

```
src/
  data/         business config, service areas, services, reviews, projects, FAQs, blog,
                location pages — single source of truth, no repeated hardcoding
  lib/          SEO component, schema.org builders, smooth-scroll + motion + capability hooks
  components/
    layout/     Navbar, Footer, MobileContactBar, Layout, ScrollToTop
    ui/         Buttons, section titles, reveals, postcode checker, comparison slider,
                review carousel, areas map
    home/       the ten homepage sections
    three/      lazy WebGL scene + capability gate + static fallback
  pages/        route components (all lazy)
public/
  images/       cinematic SVG placeholders (replace with real photography)
  robots.txt, sitemap.xml, favicon.svg
```

## 8. Required 3D Assets

None to purchase — the pipe environment is fully procedural (tunnel cylinder, torus flanges,
side pipe runs, particle water, displaced blockage mesh, PBR materials, fog). Optional future
upgrades: a Draco-compressed brushed-metal pipe junction GLB and a KTX2 metal normal map.

## 9. Required Photography

The build ships with premium abstract SVG placeholders. For production, source large
landscape photographs (≥2400px wide, AVIF/WebP) of: real pipework and drainage work in
progress, modern finished bathrooms, professional tools/equipment, clean uniforms and a
liveried van, and genuine before/after job pairs. Avoid staged stock, pointing-at-pipes
poses, and anything with embedded text or logos. Drop-in locations are listed in README.md.

## 10. Component Architecture

- `data/*` files feed everything: `businessConfig` (name, phone, email — one place),
  `serviceAreas` (17 confirmed areas + groups), `services`, `locationPages`, `faqs`,
  `projects`, `reviews` (placeholder-flagged), `blogPosts`.
- `lib/seo.jsx` sets per-page metadata, canonical URLs, Open Graph and JSON-LD
  (Plumber/LocalBusiness with `areaServed`, Service, FAQ, Breadcrumb — no address, hours,
  ratings or other unconfirmed claims).
- `components/three/SceneGate` decides 3D vs static per device capability; the scene reads a
  shared scroll-progress ref written by ScrollTrigger.
- Pages compose section components; service and location pages are data-driven templates
  with unique per-page content.
