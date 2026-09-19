# Tracking

How this site measures itself, what it deliberately does not measure, and what still has to be
done inside the Google Ads account before some of it can work at all.

Everything below is configured by environment variable and every one of those variables may be
absent. With none of them set, the site renders and works exactly as it does with all of them,
simply unmeasured. Variable names are in the README; never write a value into a document.

---

## The layers

### 1. The Google tag, as a raw `<script>` in `<head>`

`lib/gtag.ts` builds the snippet and `app/layout.tsx` renders it as two plain `<script>` elements:
an `async src` loader and an inline block injected with `dangerouslySetInnerHTML`.

**Not `next/script`.** Google Ads' own tag checker and Tag Assistant read the initial HTML for the
standard snippet. `afterInteractive` leaves only a preload hint there, and the campaign
diagnostics then report the tag as missing although it loads perfectly well for visitors. The
inline half has to go through `dangerouslySetInnerHTML` for a second reason: as JSX children React
escapes the quotes and the script stops parsing. Anything interpolated into it is JSON-encoded and
then has `<` escaped as `<`, because `JSON.stringify` will happily pass `</script>` through.

The whole thing returns `null` when there is no valid Ads account id, in which case nothing at all
is rendered. The id is validated against `AW-` plus 6 or more digits rather than merely checked
for presence: the value most often pasted by mistake is a bare conversion **action** id, which
renders a tag that looks correct in the page source and reaches no account.

The inline block does, in order: initialise `dataLayer` and `gtag`, `gtag('js', new Date())`,
`gtag('config', <ads id>, { allow_enhanced_conversions: true })`, then `gtag('config', <ga4 id>)`
if GA4 is configured, then the number-swap config line if the phone-call label is configured.

**No `gtag('consent', ...)` call is made anywhere on this site**, and there is no consent banner,
by the owner's recorded decision.

### 2. Google Ads conversions

Four label variables exist. What each one is for, and what fires it, is the next section.

### 3. GA4

A measurement id, configured on the same tag load. Validated against `G-` plus 6 or more
characters; a malformed value is treated as unset. GA4 receives pageviews from the tag. Nothing on
this site sends GA4 a custom event, and Ads conversions are unaffected by its absence.

### 4. PostHog, through the `/ingest` same-origin proxy

`next.config.ts` rewrites, in this order:

1. `/ingest/static/:path*` to the PostHog static asset host;
2. `/ingest/:path*` to the PostHog ingestion host.

**The order matters.** The catch-all would otherwise swallow the static asset path and send the
scripts `posthog-js` fetches at runtime to the ingestion endpoint. The library itself is bundled
from npm through the dynamic import, not fetched from here. Events go to our own domain so
ad-blockers stop eating them; `api_host` is pinned to `/ingest` in
`components/PosthogProvider.tsx` and `ui_host` keeps toolbar and app links pointing at the real
instance.

`/ingest` is excluded from the middleware matcher, and that exclusion is load-bearing: middleware
runs before rewrites, so without it every event POST is 307'd to an HTML page which answers 405,
while `posthog-js` still loads through the extension carve-out and looks healthy. `skipTrailingSlashRedirect`
is on because PostHog's API requests can end in a trailing slash. `tests/proxy.spec.ts` proves all
of this on the wire against a real build.

### 5. Click ids

`lib/clickIds.ts`, below.

---

## The conversion posture as built

| Action | Google Ads label used | When | Notes |
| --- | --- | --- | --- |
| Booking delivered | booking | Once, on a 2xx from `POST /api/book`, after the enhanced-conversion user data has been set | `lib/formTracking.ts` |
| Tap on a `tel:` link | phone tap | On the click, from the delegated CTA listener | Never the phone-call label |
| Tap on a WhatsApp link | WhatsApp | On the click, from the same listener | |
| A connected call from the website | phone call | Never fired by any code path | Used only by the number-swap `gtag('config', ...)` line |

**Booking fires once, on delivery.** `lib/formTracking.ts` awaits `submitBooking`, and only on
`result.ok` does it `await setEnhancedConversionUserData(...)` and then `reportConversion("booking")`.
The await is not cosmetic: the hashing is asynchronous, and an unawaited call would let the
conversion fire before the identifiers were attached to it. A form start, a form submit and a form
error are PostHog events only. Nothing earlier than a 2xx is ever reported to Google.

**A `tel:` tap fires the phone-TAP label and never the phone-CALL label.** A tap has no duration.
The call action counts calls that ran past a minimum duration, and counting taps as calls trains
bidding on nothing. `lib/gtag.ts` keeps the call label in a separate export
(`GADS_LABEL_PHONE_CALL`) that `reportConversion` cannot reach, so the wiring cannot be done by
accident.

**The phone-CALL label is used only by the number-swap config.** When it is set, the inline tag
adds `gtag('config', '<ads id>/<call label>', { phone_conversion_number: <the number as printed> })`.
Google then swaps the displayed number for a forwarding number on paid sessions and reports the
calls itself; the real business number stays in the HTML for organic visitors and for
name-address-phone consistency. It also needs a forwarding number configured on the action, or
the tag has nothing to swap to.

### Silent versus loud

Read `reportConversion` in `lib/gtag.ts` for the exact behaviour; it has 3 cases.

- **No valid Ads account id: completely silent**, everywhere, including development. No tag is
  rendered, nothing is sent, nothing is logged. There is nothing to be wrong about, and the
  absence is obvious in the page source.
- **Valid account id, an optional label missing: no conversion is sent, and one `console.error`
  is logged per label per page load.** Nothing that had anywhere to go is discarded; there is
  simply no action to send it to. The message names the variable and its consequence, and the
  once-per-load guard keeps it from being buried in the noise it is meant to stand out from.
- **Valid account id, the booking label missing: loud.** This is the dangerous case, because the
  account looks measured while every completed booking is thrown away. When a booking conversion
  is attempted in that state, `reportConversion` **throws** if `NODE_ENV === "development"`
  (booking is the only entry in `REQUIRED_CONVERSIONS`), and otherwise logs the same error once.

`missingGoogleConfig()` and `misconfigurationMessage()` in `lib/gtag.ts` name every unusable
variable and what its absence actually costs, split into required and optional, so nobody spends
an afternoon on a signal they never wanted.

### Which labels come from legacy names

`next.config.ts` maps the previous build's variable names, because the production Vercel project
still carries them.

| Signal | Mapped from a legacy name? |
| --- | --- |
| Ads account id | Yes, from `VITE_GADS_ID` |
| GA4 measurement id | Yes, from `VITE_GA4_ID` |
| Booking label | Yes, from `VITE_GADS_LABEL_QUOTE` |
| Phone-tap label | Yes, from `VITE_GADS_LABEL_PHONE` |
| PostHog project key | Yes, from `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` |
| Phone-call label | **No legacy name.** Only takes effect if set under `NEXT_PUBLIC_GADS_LABEL_PHONE_CALL` |
| WhatsApp label | **No legacy name.** Only takes effect if set under `NEXT_PUBLIC_GADS_LABEL_WHATSAPP` |

What this table does and does not tell you. It shows that the phone-call and WhatsApp labels
cannot have been inherited from the previous build's variables, because no legacy name maps to
them; they exist only if somebody sets them under their own names. It tells you nothing about
what is actually set in the Vercel project, and nothing about which conversion actions exist in
the Ads account. The repository cannot answer either question. The last section lists the actions
known to be owed.

---

## Event taxonomy

Every hand-written event goes through `trackEvent()` in `lib/analytics.ts`, which adds the page
context **at the moment the event fires**, not when the queue drains, so an event fired just
before a navigation is still credited to the page it happened on:

| Property | Value |
| --- | --- |
| `page_type` | Derived from the pathname alone: `home`, `service`, `area`, `services`, `areas_index`, `about`, `contact`, `guarantee`, `quote`, `projects`, `reviews`, `faqs`, `blog`, `blog_post`, `privacy`, `terms`, `other` |
| `service` | The slug, on `/services/<slug>` only |
| `city` | The slug, on `/areas/<slug>` only |
| `page_path` | `window.location.pathname` |

The context is resolved from path patterns with no import from the content layer, so it works on a
route this file has never heard of and does not ship the content tables to the browser.

| Event | When it fires | Properties beyond the page context |
| --- | --- | --- |
| `$pageview` | `posthog-js` `capture_pageview: "history_change"`. Not `true`: this is an App Router site, so most movement between pages is a client-side navigation and `true` would capture only the first page of every visit | PostHog's own |
| `$pageleave` | `capture_pageleave: true` | PostHog's own |
| `phone_call_click` | `data-cta="phone"` clicked | The CTA property set below |
| `whatsapp_click` | `data-cta="whatsapp"` clicked | The CTA property set below |
| `book_anchor_click` | `data-cta="book_anchor"` clicked | The CTA property set below |
| `nav_click` | `data-cta="nav"` clicked | The CTA property set below |
| `menu_toggle` | `data-cta="menu"` clicked: the burger, the desktop Services drop-down button and the mobile Services row, all of which open or close a menu and navigate nowhere | The CTA property set below |
| `email_click` | `data-cta="email"` clicked | The CTA property set below |
| `first_interaction` | The first `pointerdown`, `keydown` or `scroll` of a pageview, once per pageview, reset on every client-side navigation | `seconds_since_load`, `interaction_type` |
| `booking_form_start` | First focus inside a booking form | `form_id`, `service` when known |
| `booking_form_submit` | Submit handler entered | `form_id`, `service`, `photo_count` |
| `booking_form_success` | The API answered 2xx | `form_id`, `service`, `photo_count` (photos actually sent), `photos_dropped` when any, `http_status` |
| `booking_form_error` | The API did not | Same set. `http_status` is 0 for a request that never completed |
| `booking_form_abandon` | A started form left unsettled, via `visibilitychange` to hidden, `pagehide` (with `sendBeacon`) or the effect cleanup on a client-side navigation. A `settled` guard means whichever arrives first is the only one to send | `form_id`, `service` |
| `postcode_check` | The postcode checker is submitted | `result` (`covered`, `not_covered` or `invalid`), `district` when one was parsed |
| `video_play` | A job video is played | `video_slug` |

`menu_toggle` exists because a menu opening is not a navigation: those three buttons used to carry
`data-cta="nav"`, so every visitor who merely opened the burger or the Services drop-down was
counted in `nav_click` and inflated the one report the business uses to see which pages people go
to.

A filled honeypot short-circuits everything: no event is tracked, nobody is identified, nothing is
posted, no conversion is reported, and the caller gets the ordinary success shape so the page
behaves exactly as it does for a human.

### The CTA attribute contract

Calls to action are tagged declaratively and read by a single delegated listener installed in
`components/PosthogProvider.tsx`, in the **capture** phase so a `tel:` navigation cannot swallow
the click first. This is what lets a server component be tracked without becoming a client
component just to own an `onClick`.

| Attribute | Meaning |
| --- | --- |
| `data-cta` | Required. One of the keys of `CTA_EVENTS`: `phone`, `whatsapp`, `book_anchor`, `nav`, `menu`, `email` |
| `data-cta-location` | Where it sits: `header`, `hero`, `footer`, `sticky_bar`, `postcode_check` and so on |
| `data-cta-variant` | `text_link`, `icon_button`, `primary_button`, `secondary_button` |
| `data-cta-position` | Numeric, where a CTA repeats down a page |

Every `data-cta` value used in the markup must have an entry in `CTA_EVENTS`. An unmapped value
fires nothing, which is the safe failure but also a silent one, so development warns once per
unknown value in the console.

Each CTA event carries: `cta` (the key), `cta_location`, `cta_variant`, `cta_label` (the
`aria-label` or text content, whitespace collapsed, truncated to 80 characters), `cta_position`
when the attribute is set, `cta_viewport_ratio` (how far down the document the element sat, 0 at
the top and 1 at the bottom, which answers "which placement actually earns the call"),
`scroll_depth_at_click` (how far the visitor had scrolled at that moment, 0 to 1) and `href`
**with the query string and fragment removed**.

---

## The privacy rules the code enforces

- **No event property may carry a name, a phone number, an email address, a full postcode or
  anything the customer typed as free text.** PostHog is for behaviour; the lead itself goes to
  the business over the API route. This is stated in the headers of `lib/formTracking.ts`
  and `components/PostcodeCheckClient.tsx`, and it is why the form
  events carry a `photo_count` and an `http_status` and nothing else.
- **`postcode_check` sends the district only.** A full postcode identifies a household. The
  district is enough to answer "do you cover me".
- **The CTA `href` is stripped of its query string.** A WhatsApp link carries a prefilled message
  there and a booking link can carry whatever a campaign appended.
- **Session recording is on with all inputs masked** (`session_recording: { maskAllInputs: true }`).
  The forms carry a name, a phone number and an address, and recording them being keyed in would
  put customer data in a replay. Autocapture, heatmaps and performance capture are on.
- **`identifyUser` is person data, not event data.** It is called from the submit handler, before
  the request goes out, so a failed delivery still identifies. It sends `posthog.identify()` with
  the customer's phone number in E.164 as the distinct id, and `name`, `phone`, `email` (when
  given) and `last_service` (when known) as person properties. The E.164 form comes from
  `customerE164` in `lib/gtag.ts`, the same normaliser the enhanced conversion uses, so one
  customer cannot become two people across the two systems.
- **The server logs no customer detail.** When Telegram refuses a booking, the route logs the
  outward code, the photo count and the form id, and nothing else. `lib/telegram.ts` never logs
  the bot token, never logs a request URL (the token is in it) and discards Telegram's own error
  bodies unread, because they quote the message text back.

### Enhanced conversions: exactly what is sent

From `setEnhancedConversionUserData` in `lib/gtag.ts`. Values are trimmed and lower-cased before
hashing; the digest is SHA-256, hex-encoded.

| Field | Sent as |
| --- | --- |
| Phone number | `sha256_phone_number`. Converted to E.164 **before** hashing, or it never matches |
| First name | `address.sha256_first_name` (the first whitespace-separated part of the name) |
| Last name | `address.sha256_last_name` (everything after the first part) |
| Email address | `sha256_email_address`, when one was given |
| Postcode | `address.postal_code`, **not hashed**, upper-cased |
| Country | `address.country`, **not hashed**, the literal `GB` |

The postcode and the country are never hashed because hashed they match nothing. Empty fields are
omitted rather than sent blank, and the `gtag("set", "user_data", ...)` call is skipped entirely
if nothing survives.

If `SubtleCrypto` is unavailable (an insecure context, or a browser old enough to lack it),
**nothing at all is sent**. There is no plaintext fallback: the point of this payload is that the
identifiers never travel readable. The conversion still fires, without the identifiers.

Pre-hashing in our own code, rather than letting `gtag` hash raw values, means the customer's
phone number and name never enter `window.dataLayer` in the clear.

This needs "Enhanced conversions for leads" switched on for the booking action in Google Ads.

---

## Click ids

`lib/clickIds.ts`. A click id that is not captured at the moment of the click is gone for good,
and with it the ability to tell Google later that this particular ad click turned into a paid job.
Offline conversion import cannot be done retroactively.

| | |
| --- | --- |
| Storage | `localStorage`, key `spd_gads_click_ids` |
| Ids kept | `gclid`, `gbraid`, `wbraid`, each truncated to 255 characters |
| Also kept | `landing_page`, the pathname of the page the click landed on |
| Shape written today | `{ ids: { gclid?, gbraid?, wbraid?, landing_page? }, ts }` |
| Shape also read | The previous build's record, which put `landing_page` a level up. Both positions are read |
| TTL | 90 days, matching Google's click window. An expired record is removed on read |

The key is deliberately unchanged from the previous build of this site: visitors who clicked an ad
before the relaunch still hold an unexpired record under it, and renaming it would throw away up
to 90 days of live attribution on the day of the switch. The reader picks the four fields out by
name rather than returning the stored object wholesale, so referrer and campaign fields written by
an older build cannot leak into the booking payload.

`captureClickIds()` runs once per visit on mount. A page with no click id in its query string
writes nothing at all, so an ordinary internal navigation can never overwrite a stored, unexpired
id with an empty record. Everything is wrapped in `try`/`catch`: private mode, a blocked origin or
a full quota costs the offline import and nothing else.

**Click ids are never appended to links.** They are read by `lib/book.ts` and appended to the
booking's multipart body, so the lead arrives with the click that produced it. The middleware
preserves them in a different way: when it 307s an unknown path it carries the search string over
explicitly, because `new URL(path, request.url)` drops it and a dropped `gclid` means an ad click
that converted is reported as if it never happened.

---

## How PostHog is loaded

`posthog-js` is the largest script on the site and no visitor needs it to read the page or ring
us, so it is **never imported at runtime by anything except the provider's mount effect**.

`lib/posthogClient.ts` is the seam. `whenPosthog(work)` runs `work` immediately if the client is
up, and otherwise queues it, capped at 50 entries so a page that never loads the client cannot
hold memory. `setPosthog(ph)` is called once by the provider after `posthog.init` and flushes the
queue in order. A tap on the call button that lands before the client has loaded is therefore
captured rather than lost. When there is no project key, `whenPosthog` returns immediately and the
provider renders its children with no `<Tracking>` element at all.

**`posthog.init` must happen inside a mount effect and never at module load.** Next patches
`history.pushState` during hydration. A `posthog-js` started before that keeps a reference to the
unpatched version, never sees a client-side navigation, and so stops reporting `history_change`
pageviews after the first page. A module-scope `initialised` flag stops React's strict-mode double
mount from starting it twice.

The same effect also calls `captureClickIds()` and installs the delegated CTA click listener. A
second effect keyed on the pathname restarts the time-to-first-interaction clock on every
client-side navigation, so the metric describes the page actually being looked at.

---

## Verifying after a deploy

**1. The tag is in the served HTML.** Ask for the bytes, not the rendered page: the whole reason
the tag is a plain `<script>` is that Google's checkers read the initial HTML.

```bash
curl -s https://www.speedyplumbingdrain.co.uk/ | grep -o "googletagmanager[^\"]*"
curl -s https://www.speedyplumbingdrain.co.uk/ | grep -o "gtag('config'[^;]*;"
```

Expect the loader `src` and the config lines: the Ads account config with
`allow_enhanced_conversions`, the GA4 config if GA4 is configured, and the
`phone_conversion_number` line if the number-swap label is configured. If nothing comes back at
all, the account id is absent or malformed and no tag was rendered.

**2. The proxy is alive.** `/ingest/static/...` must serve the PostHog asset and `/ingest/...`
must not be redirected. A 307 to an HTML page here is the silent failure described above.

**3. PostHog.** Open the Speedy PostHog project (the project id is recorded in the ARIM dossier;
do not invent one). Look for `$pageview` on the routes you expect, then the CTA events, then a
`booking_form_submit` followed by a `booking_form_success`. **Confirm the `$host` property before
trusting any number.** Preview deployments and local runs report into the same project unless the
key is absent, so a count that has not been filtered by host is not a count of the live site.

**4. Google Ads, a day later.** Conversion status for the booking action should move off "No
recent conversions". Ads reporting lags, so same-day silence means nothing either way. Check that
the booking action shows enhanced conversions as receiving data, and that the number-swap action,
if it exists, shows the forwarding number in use.

---

## Account-side work the site cannot do

The code is ready for all of these; each needs a conversion action created in Google Ads and its
label added as an environment variable in the Vercel project. Until then the site simply does not
send them, and says so in the console rather than pretending.

| Owed | Consequence while it is missing, from `lib/gtag.ts` |
| --- | --- |
| A **phone-tap** conversion action, then `NEXT_PUBLIC_GADS_LABEL_PHONE_TAP` | A tap on the phone number is a PostHog event only and reaches no Ads conversion action. Nothing is discarded; there is no action to send it to |
| A **WhatsApp** conversion action, then `NEXT_PUBLIC_GADS_LABEL_WHATSAPP` | A WhatsApp tap is a PostHog event only and reaches no Ads conversion action |
| A **calls-from-website** (number swap) action, with a forwarding number on it, then `NEXT_PUBLIC_GADS_LABEL_PHONE_CALL` | The displayed number is never swapped for a Google forwarding number, so no website call conversion can fire. On a call-led trade this is the largest single revenue signal |

Also owed on the booking action itself: **"Enhanced conversions for leads" switched on**, or the
hashed identifiers the site already sends are ignored.

If `NEXT_PUBLIC_GA4_ID` is left unset, no GA4 property receives pageviews. Ads conversions are
unaffected. That is a choice, not a fault.
