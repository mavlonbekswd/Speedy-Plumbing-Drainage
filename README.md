# Speedy Plumbing & Drain

The marketing site for Speedy Plumbing & Drain, a plumbing and drainage firm working out of
Cambridge. It exists to take a phone call or a booking from someone with water coming through a
ceiling, and to be the landing page a Google Ads click can safely be sent to.

Every service page and every town page is a statically generated file. There is no CMS and no
database: the page copy lives in typed data files in `content/`, and a booking is delivered to a
Telegram group and nowhere else.

**Stack:** Next.js 15 (App Router, React 19), TypeScript, Tailwind CSS 3, `@phosphor-icons/react`,
`posthog-js`, Playwright for the end-to-end suite. Deployed on Vercel.

---

## Quick start

Node 22 (`.nvmrc`). `package.json` `engines` requires `>=20.9`.

```bash
npm install
npm run dev     # next dev
npm run build   # next build
npm run start   # next start, serves the last build
npm run test:e2e  # playwright test; builds and starts its own server, see Tests
```

**The site runs with no environment variables set at all.** With an empty environment:

- `lib/site.ts` falls back to the canonical origin and the phone number written into that file;
- no Google tag is rendered (`lib/gtag.ts` refuses to render one without a valid Ads account id)
  and every conversion helper is a no-op;
- `components/PosthogProvider.tsx` returns its children untouched, `posthog-js` is never
  imported, and no listener is installed;
- `POST /api/book` answers 500, because `notifyBookingTelegram` returns `false` when the bot
  token or the chat id is missing. The form therefore shows its error state, which tells the
  customer to ring instead.

That is deliberate. The pages, the copy, the routing and the guard rails do not depend on any
measurement being configured.

---

## Environment variables

Names only. Never commit a value. `.env.local` is git-ignored, and `.env.local.example` is the
only place in the repository where the full set of names is listed with what each one is for.

| Name | Scope | What it does |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | public | Canonical origin, no trailing slash. `resolveSiteUrl()` in `lib/site.ts` strips trailing slashes and refuses any `*.vercel.app` value, so a deployment host can never become the canonical origin. Unset means the constant in that file. |
| `NEXT_PUBLIC_CALL_NUMBER` | public | The public phone number in UK national format. Non-digits are stripped; unset means the number written into `lib/site.ts`. |
| `TELEGRAM_BOT_TOKEN` | server | The bot that posts bookings. Missing means `/api/book` answers 500. |
| `TELEGRAM_CHAT_ID` | server | The group the bot posts into. Missing means `/api/book` answers 500. |
| `TELEGRAM_ADMIN_MENTIONS` | server | Handles to mention on an out-of-hours booking, appended by `lib/telegram.ts`. |
| `OOH_ALERT_FORCE` | server | Set to `1` to force the out-of-hours escalation path whatever the clock says. The window itself is 22:00 to 08:00 Europe/London (`lib/hours.ts`). |
| `TELEGRAM_API_BASE` | server | Overrides the Telegram API base. Ignored outright when `VERCEL_ENV` is `production`, so a stray value can never redirect real customer details elsewhere. Tests only. |
| `BOOK_RATE_LIMIT_MAX` | server | Overrides the booking rate-limit ceiling, read at call time. Tests only. |
| `NEXT_PUBLIC_POSTHOG_KEY` | public | PostHog project API key. Absent means no PostHog at all. |
| `NEXT_PUBLIC_POSTHOG_HOST` | public | Listed in `.env.local.example`, but **no code reads it**. `components/PosthogProvider.tsx` pins `api_host` to the same-origin `/ingest` proxy. |
| `NEXT_PUBLIC_GADS_ID` | public | Google Ads account tag id. Validated against `AW-` plus 6 or more digits; a malformed value is treated exactly like an unset one. |
| `NEXT_PUBLIC_GADS_LABEL_BOOKING` | public | Conversion label for a delivered booking. |
| `NEXT_PUBLIC_GADS_LABEL_PHONE_TAP` | public | Conversion label for a tap on a `tel:` link. |
| `NEXT_PUBLIC_GADS_LABEL_PHONE_CALL` | public | Conversion label for the calls-from-website action. Used **only** by the number-swap config line; no code path fires a conversion against it. |
| `NEXT_PUBLIC_GADS_LABEL_WHATSAPP` | public | Conversion label for a WhatsApp tap. |
| `NEXT_PUBLIC_GA4_ID` | public | GA4 measurement id, configured on the same tag load. Validated against `G-` plus 6 or more characters. |

`VERCEL_ENV` is set by the platform, not by you. `app/robots.ts` and `lib/telegram.ts` both read
it.

### Local development never reports

`next dev` reads `.env.local`, which holds the production PostHog key and Google ids. `lib/devSilence.ts`
turns all measurement off in development, so a local click cannot land in the live PostHog project
or the live Ads account. Set `NEXT_PUBLIC_TRACK_IN_DEV=1` to switch it back on deliberately. A
production build is never silenced.

### Vercel project settings

`vercel.json` pins `framework: nextjs`, the build command and the output directory. The Vercel
project was created for the previous Vite build of this site, and a project that still expects a
`dist` folder fails every deployment of this one.

### Legacy names still accepted

The production Vercel project still carries the variable names from the previous build of this
site, so `next.config.ts` maps them through a `pick()` helper rather than anyone renaming them in
the dashboard and risking a gap between the rename and the deploy. First name wins; the fallback
is the empty string, so no value is ever `undefined`.

| Current name | Legacy name also accepted |
| --- | --- |
| `NEXT_PUBLIC_GADS_ID` | `VITE_GADS_ID` |
| `NEXT_PUBLIC_GA4_ID` | `VITE_GA4_ID` |
| `NEXT_PUBLIC_GADS_LABEL_BOOKING` | `VITE_GADS_LABEL_QUOTE` |
| `NEXT_PUBLIC_GADS_LABEL_PHONE_TAP` | `VITE_GADS_LABEL_PHONE` |
| `NEXT_PUBLIC_POSTHOG_KEY` | `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` |

`NEXT_PUBLIC_GADS_LABEL_PHONE_CALL` and `NEXT_PUBLIC_GADS_LABEL_WHATSAPP` have no legacy name in
the map, so they only take effect if they are set under their own names.

---

## Where everything lives

The rule the whole repository is built around: **content is data, not components.** One fact,
one place. A copy change is an edit to a data file; the templates are not touched.

| Path | What it holds |
| --- | --- |
| `lib/claims.ts` | Every shared sentence on the site, plus `BANNED_PATTERNS` and the `MUST_RENDER` rules. Data only: relative imports, no React, so Playwright can import it under Node. |
| `lib/site.ts` | Identity. Trading name, registered name and company number, registered office in parts, contact email, geo, the canonical origin, the two phone numbers, the OpenGraph helper. |
| `lib/types.ts` | The frozen content contracts (`ServiceContent`, `City`, `WorkPhoto`, `AdFixture` and the rest). Every leaf, template and test builds against these. |
| `content/services/<slug>.ts` | One service page's entire copy, as a default-exported `ServiceContent`. |
| `content/towns/<slug>.ts` | One town's facts and copy, as a default-exported `City`. |
| `lib/services.ts` | The service barrel: 10 static leaf imports, the derived lists, and the import-time assertions. |
| `lib/towns.ts` | The town barrel: 31 static leaf imports, the county groupings, the generated coverage label, the postcode checker's town lookup, and the assertions. |
| `lib/coverage.ts` | The locked geography: the 66 targeted postcode districts, the site-only district, the 8 excluded districts, and the postcode parser. Imports nothing. |
| `lib/routes.ts` | `STATIC_ROUTES`, the route table for every non-dynamic page, and the generated path lists. |
| `lib/nav.ts` | Header and footer links, generated from the barrels and filtered by `published`. |
| `lib/media.ts` | Every job photo and video, with its caption, alt text and provenance. |
| `content/ads.ts` | The live ad fixtures: each ad's pinned description and its Final URL. |
| `components/` | Templates and UI. `ServicePage.tsx` renders every `/services/<slug>`, `TownPage.tsx` every `/areas/<slug>`. Server components unless they need state. |
| `app/` | Routing, metadata, `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, and `api/book/route.ts`. |
| `scripts/` | `site-claims-audit.py` and the URL list it reads. |
| `tests/` | The Playwright suite. |

### The `published` flag

Each service leaf, each town leaf and each entry in `STATIC_ROUTES` carries its own `published`
boolean. Everything downstream is generated from it, so flipping one flag is the entire act of
shipping or withdrawing a page:

- the route list, through `ALL_PUBLISHED_PATHS()` in `lib/routes.ts`;
- `generateStaticParams()` on `/services/[slug]`, `/areas/[slug]` and `/blog/[slug]`;
- the header and footer links (`lib/nav.ts`);
- the sitemap (`SITEMAP_PATHS()`, which also drops anything with `inSitemap: false`);
- the `areaServed` array on the business schema in `app/layout.tsx`;
- the middleware's known-path set;
- every per-route loop in the Playwright suite (`tests/utils.ts`).

There is no second, hand-kept list anywhere. That is the point: a header, a footer, a sitemap and
a middleware allow-list drift apart the moment a route is added to only one of them.

### The two phone numbers

`CALL_NUMBER` and `WHATSAPP_E164` in `lib/site.ts` are **different numbers on purpose** and
neither is derived from the other. Calls go to the landline that is also the Google Ads call
asset and the Google Business Profile number; WhatsApp goes to a separate mobile. Do not
"tidy up" one into the other.

---

## How to add or change things

### (a) Change a claim sentence

Edit the constant in `lib/claims.ts`. It is the only copy of that sentence; every page that shows
it reads the constant. If the sentence is also checked by `MUST_RENDER`, by
`tests/excluded-copy.spec.ts` or by `scripts/site-claims-audit.py`, update those in the same
change. Before you write a new claim, read the claims rule below.

### (b) Add a town

1. Create `content/towns/<slug>.ts` exporting a `City` as default.
2. Import it in `lib/towns.ts`, add it to `TOWN_LEAVES` under its slug, and bump the expected
   counts at the foot of that file.
3. Fill the fields: `slug`, `name`, `county`, `tier`, `published`, `blurb`, `metaTitle`,
   `nearbyTowns` (slugs of other leaves), `postcodeDistricts`, `nearbyAreas`, `localNote`,
   `serviceNotes` and `sources`.

**The district rule.** `postcodeDistricts` must be a subset of `COVERED_DISTRICTS` in
`lib/coverage.ts`, and must contain nothing from `EXCLUDED_DISTRICTS`. That file mirrors the
locked Google Ads targeting. A page that claims service where the account excludes it puts the
site and the account in contradiction, so the barrel throws at import rather than letting it
build.

**When to set `placeLabel`.** Set it whenever the town's own districts are not served, so the
templates say something true instead of "in `<town>`". `placeOf(city)` returns
`city.placeLabel ?? city.name`, and the templates use it wherever they put a place after "in".
Bury St Edmunds is the worked example: the account targets IP28 to IP31 and never IP32 or IP33,
so its leaf sets `placeLabel: "the Bury St Edmunds villages"` and no heading claims the town
itself. The label must still contain the town's name, and an organic town that is published must
have one; both are asserted.

Finally, regenerate `scripts/site-urls.txt` so the post-deploy claims audit covers the new page (it should list exactly what `SITEMAP_PATHS()` in `lib/routes.ts` returns, on the `www` origin).

### (c) Add a service page

1. Add the slug to the `ServiceSlug` union in `lib/types.ts`.
2. Create `content/services/<slug>.ts`. Start from `content/services/_stub.ts`
   (`stubService(slug, kind, navLabel)`) if the copy is not written yet: a stub is
   `published: false` with empty fields, which the assertions skip on purpose.
3. Import it in `lib/services.ts`, add it to `SERVICE_LEAVES`, and bump the expected count.
4. `kind` is `"urgent"` or `"booked"`. Urgent pages carry the same-day and 45-minute lines;
   a booked page's headline may never say "same day", which is asserted.
5. Add the URL to `scripts/site-urls.txt`.

### (d) Publish or unpublish a page

Flip `published` on the leaf, or on the `STATIC_ROUTES` entry. Nothing else needs changing for
the route, the nav, the sitemap, the schema, the middleware and the tests to follow. A newly
published leaf must satisfy the full set of assertions listed below, so expect the build to tell
you what is still missing.

### (e) Add a job photo

Add an entry to `WORK_PHOTOS` in `lib/media.ts`: `slug`, `file` (under `/work/`), `width`,
`height`, `alt`, `caption`, `group`, and a `provenance` object. Then reference the slug from a
service leaf's `proof.photos`; `lib/services.ts` asserts that every referenced slug exists.

The caption rules are in that file's header and are not stylistic:

- a caption says what is in the frame and nothing else;
- never a town, a brand, a date, a response time or a price. No town is evidenced for any job,
  so `provenance.townEvidenced` is unset throughout;
- never "boiler", "gas", "central heating", "unvented", "G3" or any credential word. "Hot water
  cylinder" is allowed, because cylinders are in scope and under the guarantee;
- an AI-made graphic sets `illustration: true` and never appears in a job gallery. `JOB_PHOTOS` filters it out.

### Generated pictures and the logo

Two kinds of AI-generated, photorealistic picture are on the site, by the owner's instruction of
19 Sept 2026, and neither carries a visible label:

- **Header backdrops.** `HERO_IMAGES` in `lib/media.ts`, files in `public/hero/` (each with a
  `-768.webp` sibling for phones), rendered by `components/HeroBackdrop.tsx` at 50% opacity
  behind a page's first screen, under a paper gradient so the text contrast is unchanged. They
  are decoration: `alt=""`, `aria-hidden`, no caption, no link. Scenes of fixtures, tools and
  gloved hands only, never a face, because a photoreal plumber reads as a member of staff.
- **Problem pictures.** `ILLUSTRATIONS` (the name is historical), files in `public/scenes/`,
  listed by a service leaf in `illustrations` and rendered by `components/IllustrationRow.tsx`
  under the heading "What it can look like". They show the problem, never a job we did.

What keeps both honest: neither ever goes in `proof`, on `/projects` or into a Google Ads image
asset; `/projects` says every photo and clip on it is from our own jobs; and `/terms` says some
pictures on the site are representative. `SERVICE_CARD_PHOTO` picks the one REAL job photo that
stands for each service on a card.

### Pages that were removed

`/quote`, `/faqs` and `/reviews` were removed on 19 Sept 2026 and 308-redirect (in
`next.config.ts`) to `/contact#book`, `/#faq` and `/#reviews`. The callback form lives on
`/contact` and on every service page; each static page renders its own question set from
`lib/faqs.ts` inside `id="faq"`. The pinned Google Ads descriptions (`adLines`) no longer sit in
an "In plain words" box: `placeAdLines()` in `lib/claims.ts` folds each one, verbatim, into the
problem section's lead, the closing band, the how-it-works intro and the call band, and
`tests/ad-page-join.spec.ts` still fails the build if one goes missing.

The logo (`components/Logo.tsx`, `public/brand/roadrunner*.webp`, `app/icon.png`,
`app/apple-icon.png`) is an original drawing of a real roadrunner bird. It is deliberately not
the Warner Bros. cartoon character, which is a registered trademark. Do not swap it for the
character or anything traced from it.

---

## Guard rails, and why they exist

### Assertions that fail the build

These run at module import, so they fail `next build` rather than producing a wrong live page.
Each throws naming the file and the item it is complaining about.

| File | What it checks |
| --- | --- |
| `lib/routes.ts` | No duplicate path; every path absolute; the home page is published. |
| `lib/coverage.ts` | Exactly 66 targeted districts; no duplicates across the covered list; nothing both covered and excluded. |
| `lib/claims.ts` | Every ad's pinned description in `content/ads.ts` passes `BANNED_PATTERNS`. An ad may only promise what the site is allowed to say. |
| `lib/services.ts` | Leaf slug matches its key. The released blocked-drains line appears on no other leaf, published or not. For published leaves: exactly 8 straight-answer cards; `answers[0].rest` mentions "your postcode"; 3 to 5 FAQs; every string in `adLines` is a pinned line of an ad that actually lands on that URL; every string anywhere in the leaf passes `BANNED_PATTERNS`; a booked headline never says "same day"; every `proof` photo and video slug exists in `lib/media.ts`. Exactly 10 services. |
| `lib/towns.ts` | `placeLabel`, where set, contains the town name; a published organic town must set one. Districts non-empty, each in `COVERED_DISTRICTS`, none in `EXCLUDED_DISTRICTS`. `nearbyTowns` names real leaves and never itself. For published towns: non-empty blurb, `localNote` and `serviceNotes`; at least 3 `nearbyAreas`; at least one source. Exactly 31 towns, 28 of them Tier 1. The coverage label generated from the counties the Tier 1 towns sit in equals `COVERAGE_LINE`. |

### `BANNED_PATTERNS`

A list of regular expressions in `lib/claims.ts` covering price wording, credentials, reviews and
ratings, guaranteed times, marketing filler, Americanisms and the em-dash. It is applied in 2
places: over every string of every published service leaf at import, and over the served HTML of
every published route by `tests/claims.spec.ts`. The second is not redundant. A claim can reach a
page from a template, a hard-coded component string, a meta description, JSON-LD or an `alt`
attribute, and none of those is a content leaf.

### The claims rule

From `CLAUDE.md`: **no claim may appear in copy without a proof file in the ARIM client's
`claims-evidence/` folder.** No accreditation, review count, years-in-business, response-time or
price claim without one. If you cannot point at the file, the sentence does not ship.

### The ones a newcomer trips first

- **No price figure anywhere.** Not in a heading, not in copy, not in a JSON-LD offer. There is
  no call-out fee and none may be stated in either direction, present or absent.
- **Never "Gas Safe", in any casing or direction.** Not "Gas Safe registered", not "not Gas Safe
  registered". The credential is not held.
- **"Free" belongs to the WhatsApp photo quote alone.** The pattern catches any string that says
  "free" without also saying WhatsApp.
- **"Blocked today. Cleared today."** was released by the owner for `/services/blocked-drains`
  and nowhere else. Every other leaf is checked for it, published or not, because that rule is
  about where a claim may appear rather than about whether a page is ready.
- **`/areas/<slug>` must never redirect.** Answering a town we do not cover with a page about
  somewhere else is a coverage claim the business cannot keep, and a soft 404 over a whole URL
  space is a ranking problem as well as an honesty one. Unknown town slugs are real 404s.
- **The organic towns.** King's Lynn, Peterborough and Bedford sit beside districts the ad
  account excludes. Their pages exist for search only: they are `tier: "organic"`, they are kept
  out of `AREA_SERVED`, they must never claim the excluded districts, and they must never be an
  ad or keyword Final URL (`NEVER_A_FINAL_URL` in `content/ads.ts`).
- **`/services/boiler-repairs` is deliberately unpublished**, pending the owner's decision. Its
  leaf is still the stub, its two ads are marked `blocked: true` so the join test reports them as
  pending rather than failing, and the URL is absent from `scripts/site-urls.txt`.

---

## The ad-to-page join

`content/ads.ts` is the site's copy of the live Google Ads account: 16 responsive search ads,
each with its `group`, `campaign`, `finalUrl` and its single pinned description, plus the town-level
keyword Final URLs (`TOWN_KEYWORDS`), the ad groups whose keywords send a second page traffic
(`KEYWORD_URL_OVERRIDES`), and the organic-only pages (`NEVER_A_FINAL_URL`).

**Every ad's pinned description must render verbatim, in visible text, on its Final URL.** An ad
may only promise what its own landing page renders, and the page alone can be perfect while the
money still burns, because the gap is in the join rather than in either half.

Two specs enforce it: `tests/ad-page-join.spec.ts` checks the pinned lines against the served
markup of each Final URL and the town pages, and `tests/launch-gate.spec.ts` asserts the
`published` flags themselves so a suite cannot be green merely because nothing has shipped.
`lib/services.ts` closes the loop from the other side by refusing an `adLines` entry that no ad
sends to that page.

If an ad changes in the account, this file changes with it, in the same piece of work.

---

## Routing

Everything is statically generated. `/services/[slug]`, `/areas/[slug]` and `/blog/[slug]` each
set `export const dynamicParams = false` and build their params from the published lists, so an
unknown or unpublished slug is a real 404 from Next rather than a rendered page or a redirect.

### Middleware

`middleware.ts` does two jobs that pull in opposite directions, and the order of its checks is the
whole file.

1. **An unknown top-level path is 307'd to `/services/emergency-plumbing`, query string kept.**
   The risk being managed is a typo in one of the account's own Final URLs, which would destroy
   every click it receives. The search string is carried over explicitly so `gclid`, `gbraid`,
   `wbraid` and the UTMs survive and the click still attributes. `not-found.tsx` cannot do this:
   as the automatic boundary it renders with a real 404 and no `Location` header, so a crawler or
   a non-JS client never learns where to go.
2. **A path under `/areas/`, `/services/` or `/blog/` is passed straight through**, checked
   before the known-path test, so a wrong slug reaches Next and gets its honest 404.

The known-path set is read from `lib/routes.ts`, memoised per isolate, and forgives one trailing
slash because `skipTrailingSlashRedirect` is on. The home page is passed straight through. A
geo-personalised eyebrow was considered and dropped: reading the visitor's town in the page needs
`headers()`, which would make the most-visited page dynamic, and the brief puts speed first.
`lib/geoTowns.ts` is kept for the day that trade-off is reversed.

**`/ingest` is excluded from the matcher, and that exclusion is load-bearing.** `next.config.ts`
rewrites `/ingest/*` to PostHog, and middleware runs before rewrites. Without the exclusion,
`/ingest/i/v0/e/` is an unknown path, every event POST is 307'd to an HTML page, and the page
answers 405. The failure is invisible: the extension carve-out still lets `/ingest/static/*.js`
through, so `posthog-js` loads, initialises, looks healthy, and drops every event with no console
error. `tests/proxy.spec.ts` takes that proof on the wire against a real build for exactly this
reason. `_next`, `/api`, the favicon and any path with a file extension are excluded too.

### Robots and noindex

- `next.config.ts` sets `X-Robots-Tag: noindex, nofollow` on every response whose host matches
  `*.vercel.app`, so a preview stays reachable for review and can never be indexed or compete
  with the real domain.
- `app/robots.ts` disallows everything whenever `VERCEL_ENV` is set to anything other than
  `production`. Unset is treated as production, so a local build serves the file that ships.
- The two are deliberately independent: a header can be stripped by a proxy and a `robots.txt` can
  be ignored by a crawler, so neither is asked to be the only answer.
- `next.config.ts` also carries an optional `VERCEL_ALIAS_HOST` constant. Set it to the project's
  production alias host and that duplicate of the live site is 308'd to the canonical origin with
  its path preserved. It is empty today, so no alias redirect is registered.
- Security headers (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`) are set on
  every path.

---

## Lead delivery

`POST /api/book` (`app/api/book/route.ts`, Node runtime) is the only server endpoint. The booking
form posts `multipart/form-data` because it can carry up to four photos, which
`lib/imageCompress.ts` re-encodes and downscales in the browser first and drops rather than
letting them fail the submission; the small inline callback card posts JSON and never has any.
The route rate-limits before reading the body, refuses a declared body over 4.5 MB with a 413
(which `lib/book.ts` answers by retrying once without the photos, so the lead survives), parses
into a null-prototype object, then applies two spam screens: a filled honeypot field and a
cross-origin POST both return a response identical to a real success, so a bot learns nothing.
Validation is independent of the browser (`lib/bookingSchema.ts`) and a failure is a 422. Photos
are accepted on sniffed magic bytes only, never on the declared type or the filename, and are
renamed by us. Delivery is a Telegram message to the business group, and **that message is the
only record of the lead**: there is no database. If Telegram will not take it the route logs the
outward code and nothing else identifying, and answers 500, so the form shows its "call us
instead" state rather than thanking a customer whose booking nobody will ever see. The client
fires its Google Ads conversion on a 2xx and on nothing earlier. `lib/rateLimit.ts` is a
best-effort sliding window, 5 requests per 10 minutes per IP, held in a `Map` in one warm
serverless instance, with a 5,000-key cap and LRU eviction; a blocked request is not recorded, so
retrying does not extend the ban. It is not a global budget and a cold start resets it. **A
Vercel Firewall rate-limit rule at the edge is the real control** and should exist before anyone
relies on this.

Measurement of all of this is documented separately in [docs/tracking.md](docs/tracking.md).

---

## Performance notes

Only what is verifiable from the code:

- **There is no hero image.** Neither `components/home/HomeHero.tsx` nor
  `components/ServiceHero.tsx` uses `next/image` or an `<img>` element. `next/image` appears only
  in the proof strip, the work video poster and `/projects`.
- **`posthog-js` is loaded on demand after hydration.** `components/PosthogProvider.tsx` does a
  dynamic `import("posthog-js")` inside a mount effect; `lib/posthogClient.ts` is the seam, and
  nothing imports `posthog-js` at runtime. Events fired before it lands wait in a queue capped at
  50 and are replayed in order.
- **`components/AnimateIn.tsx` uses the browser's own `IntersectionObserver` and a CSS
  transition** rather than an animation library. Reduced motion, a missing observer and anything
  already on screen at load all render immediately, so content is never left waiting on a script.
- **Client components never import the content barrels.** Importing `lib/towns.ts` in the browser
  would ship all 31 town leaves, research notes and sources included, to every visitor.
  `components/PostcodeCheck.tsx` is a server wrapper that builds a district-to-town map and hands
  it down as a prop to `PostcodeCheckClient`, and `components/Header.tsx` passes `HeaderClient` the
  Services drop-down as plain `{label, href}` pairs for the same reason. `lib/analytics.ts` derives page context from the
  pathname alone for the same reason again.
- The call link in the hero is server-rendered and carries no fade class: `animate-fade-up` sets
  opacity 0 through its backwards fill, and a call button nobody can see at 3am is not a call
  button.

No bundle sizes or Lighthouse scores are stated here, because none are recorded in the
repository.

---

## Tests

```bash
npm run test:e2e
```

Playwright owns the whole server lifecycle: `playwright.config.ts` runs
`npm run build && npm run start -- -p 4123` itself, against a **real production build**, so the
HTML the specs parse is the HTML a crawler gets. The port is fixed and dedicated so the suite
never collides with a `next dev` server on 3000.

The `webServer` environment is a set of deterministic, obviously fake values, pinned under the
`NEXT_PUBLIC_*` names so they always beat whatever is in a local `.env.local`. Nothing in a run
can reach a real account: third-party hosts are blocked in-browser by
`tests/utils.ts#blockThirdParties`, and `TELEGRAM_API_BASE` points the booking path at
`tests/mockTelegram.ts` on a local port instead of `api.telegram.org`.

**Rebuild before using `npm run start` after a test run.** `NEXT_PUBLIC_*` values are inlined
into the browser bundle at build time (see the note at the top of `lib/gtag.ts`), and the test
run's `next build` writes the fake ids into the same `.next` directory. Serving that build
outside the suite serves the fakes.

**Every per-route loop iterates the published route lists** exported by `tests/utils.ts`. A page
that has not been built yet contributes no test rather than a red one, and the day its flag flips
it contributes its full set without a line of `tests/` changing. The one deliberate exception is
`tests/launch-gate.spec.ts`, which asserts the flags themselves.

Specs may import `lib/site.ts` for constants that do not depend on the environment (the trading
name, the registered address). They must **not** read `CALL_NUMBER`, `SITE_URL` or anything
derived from them out of that module: those freeze at import, and in the Playwright runner
process the `webServer` environment does not apply, so the runner would read a developer's
`.env.local` while the server under test rendered the fakes. Assert against the constants in
`tests/utils.ts` and against the `baseURL` fixture instead.

| Spec | What it proves |
| --- | --- |
| `accessibility.spec.ts` | An axe scan of one sample of each template, plus the 404 page unconditionally. |
| `ad-page-join.spec.ts` | Every ad's pinned description renders verbatim on its Final URL, every town keyword's target is safe, and the organic pages are never a Final URL. Gates launch. |
| `booking.spec.ts` | The booking path end to end against the local Telegram mock: the browser posted, the route validated, Telegram accepted, and only then was the customer told. |
| `claims.spec.ts` | `BANNED_PATTERNS` over the served HTML of every published route, including JSON-LD and attributes. |
| `excluded-copy.spec.ts` | A guard rather than a fix: the locked sentences (the footer legal line, the insured sentence, the guarantee pair, the price line) render exactly where they must. |
| `forms.spec.ts` | What each of the 3 forms owes the business, proved by behaviour rather than by reading the component. |
| `launch-gate.spec.ts` | The `published` flags themselves. The one deliberately red spec while the site is assembled. |
| `link-graph.spec.ts` | Internal links measured from served markup with scripts stripped, so an RSC flight payload cannot make an orphan look linked. |
| `navigation.spec.ts` | The mobile header: the burger opens, Escape closes, focus returns. |
| `notfound.spec.ts` | An unknown top-level path 307s server-side with its query string; an unknown slug under a known segment is a real 404 with no `Location`. |
| `og-metadata.spec.ts` | Every page carries its own `og:image`, `og:url` and `summary_large_image`, since a page-level `openGraph` replaces the root one rather than merging. |
| `pages.spec.ts` | The generated sitemap lists exactly the routes the barrels publish, and every page loads with no console errors. |
| `proxy.spec.ts` | The `/ingest` proxy taken on the wire, straight at the built server, never through a browser intercept. |
| `seo.spec.ts` | Titles, canonicals and JSON-LD across every published route. |
| `site-url.spec.ts` | `resolveSiteUrl()` unit cases, in the runner process. |
| `sitemap-schema.spec.ts` | Every sitemap entry has a real `lastmod`; the business schema carries the registered address. |
| `town-content.spec.ts` | The anti-doorway measure: mask every town name and district, then count what is left. |
| `town-headline.spec.ts` | A town H1 is a sentence with the town inside the question, not a stacked prepositional fragment. |
| `tracking.spec.ts` | What the browser actually put on the wire: PostHog events off intercepted requests, Google conversions off `window.dataLayer`. |

Helpers: `tests/utils.ts` (route lists, test constants, third-party blocking), `tests/html.ts`
(served-HTML parsing, scripts stripped first), `tests/trackingUtils.ts` (the measurement
harness), `tests/mockTelegram.ts` (the local Telegram stand-in).

---

## Deploying

Pushing `main` deploys on Vercel. There is no other deploy step.

After a deploy, run the claims audit against the live site:

```bash
python3 scripts/site-claims-audit.py
```

Expect it to print `ALL CLAIMS PRESENT` and exit 0. It curls every URL in
`scripts/site-urls.txt` with no `-L`, so a redirect is a failure rather than a hop to follow; a
non-200 is its own failure category. Required claims are matched against the stripped, readable
text, and forbidden claims against the raw bytes, script blocks included, because review schema
and price figures hide inside JSON-LD. Python 3 standard library only, so it runs from a laptop
or a deploy hook with nothing installed.

`scripts/site-urls.txt` is one absolute `www` URL per line, regenerated by hand when a route is
added. A URL listed there that has not shipped is reported as a failure, which is the point.

---

## Known limitations and owed items

- **`/services/boiler-repairs` is blocked.** The leaf is still a stub and `published` is false,
  pending the owner's decision. Its two ads carry `blocked: true`.
- **Photo consent is not on file.** Every entry in `lib/media.ts` sets `consentOnFile: false`.
  The photos were supplied by the owner as Speedy's own plumbers' work; written customer consent
  to publish is still owed.
- **The rate limiter is per warm instance**, not a global budget, and a cold start resets it. A
  Vercel Firewall rule is the real control.
- **There is no consent banner**, by the owner's recorded decision, and no `gtag('consent', ...)`
  call is made anywhere on the site.
- **No reviews are claimed.** `HAS_REVIEWS` in `lib/claims.ts` is false, so no page carries a
  review count, stars, quote or rating schema. The reviews section on the home page (`/#reviews`)
  says where reviews live and shows a Google link only once `GOOGLE_PROFILE_URL` in `lib/site.ts`
  is filled in.
- **No production alias redirect is registered.** `VERCEL_ALIAS_HOST` in `next.config.ts` is
  empty; set it if the project gains a production `*.vercel.app` alias.
- **`scripts/site-urls.txt` is not generated.** It has to be edited by hand when a route ships.
- **`next.config.ts` repeats the canonical origin** as a literal, because it loads outside the
  app's module graph and cannot import from `lib/`. Change it and `lib/site.ts` together.
- **Google Ads account-side work is still owed** before the tap, WhatsApp and calls-from-website
  signals can exist at all. See the last section of [docs/tracking.md](docs/tracking.md).
