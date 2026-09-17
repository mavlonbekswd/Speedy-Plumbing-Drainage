# Tracking: GA4, Google Ads and PostHog

This site copies the tracking setup used on the BeBest and Fixed Rate sites, adapted for Vite and a single-page app. There is no consent banner: every visitor is tracked from the first page load, as on the other two sites (owner's decision).

| Layer | Where | What it sends |
|---|---|---|
| Google tag (gtag.js) | `index.html` `<head>`, static | One loader for Google Ads (`VITE_GADS_ID`) and GA4 (`VITE_GA4_ID`). GA4 page views come from Enhanced Measurement. |
| GA4 custom events | `src/lib/gtag.js` → `gaEvent` | Every `trackEvent` below, sent only to the GA4 property. |
| Google Ads conversions | `src/lib/gtag.js` → `reportConversion` | `phone` (tap on a `tel:` link) and `quote` (request delivered). |
| PostHog | `src/lib/analytics.js` | Page views and page leaves, autocapture, heatmaps, session replay (inputs masked), and every event below. Sent through `/ingest`. |
| Click ids | `src/lib/analytics.js` → `captureClickIds` | `gclid`, `gbraid` and `wbraid` from the landing URL, kept 90 days and added to the Telegram lead for offline conversion import. |

All IDs, tokens and labels come from environment variables. Nothing is hardcoded. See [`.env.example`](../.env.example).

## Events

Events never carry name, phone, email, full postcode or free text. The one exception is PostHog `identify`, which runs on a delivered quote.

Every event includes `page_path` and `page_type`.

### Site-wide clicks

A single capture-phase listener in `analytics.js` handles these, so new links are tracked automatically.

| Event | Fires on | Properties | Google Ads |
|---|---|---|---|
| `phone_call_click` | Any `tel:` link | `cta_location`, `cta_label`, `scroll_depth_at_click` | **conversion `phone`** |
| `email_click` | Any `mailto:` link | same | — |
| `quote_cta_click` | Any link to `/quote` | same | — |
| `whatsapp_click` | Any `wa.me` link, once WhatsApp is configured | same | — |
| `postcode_check` | Postcode coverage checker submitted | `result` (`covered`, `unknown` or `invalid`), `district` (e.g. `CB1`) | — |

`cta_location` comes from the nearest `data-cta-location` attribute on the element or one of its parents. Current values:
- `navbar`, `mobile_menu`, `mobile_bar`, `footer`
- `hero`, `emergency_section`, `areas_section`, `final_cta`, `area_map`
- `quote_hero`, `quote_form`, `quote_success`

Without that attribute, `cta_location` falls back to `page_type`.

### Quote journey (`/quote`, all with `form_id: "quote"`)

| Event | Fires on | Properties | Google Ads |
|---|---|---|---|
| `quote_form_view` | Quote page opened | — | — |
| `quote_form_start` | First field interaction | — | — |
| `quote_step_complete` | "Continue" passes validation | `step_index`, `step_name`; `service` (step 0), `urgency` (1), `photo_count` (3), `contact_method` (4) | — |
| `quote_step_back` | "Back" clicked | `step_index`, `step_name` | — |
| `quote_validation_error` | A step fails validation | `step_index`, `step_name`, `fields` (comma-separated) | — |
| `quote_emergency_call_prompt_shown` | "Emergency" chosen; the call-now notice appears | — | — |
| `quote_photos_added` | Photos selected | `count` | — |
| `quote_form_submit` | "Submit Request" pressed and valid | `service`, `urgency`, `contact_method`, `photo_count` | — |
| `quote_form_success` | `/api/quote` returned 2xx, i.e. Telegram accepted the lead | the above plus `http_status` | **conversion `quote`**, with enhanced-conversion data |
| `quote_form_error` | `/api/quote` failed (`http_status` 0 means a network failure) | the above plus `http_status` | — |
| `quote_form_abandon` | Visitor left a started, unsent form (tab hidden, page closed or navigated away) | `last_step_index`, `last_step_name`, `steps_completed` | — |

Step names, in order: `Problem`, `Urgency`, `Postcode`, `Details`, `Contact`, `Confirm`.

Spam submissions (honeypot filled) get a fake success screen, fire **no** events and are never counted as conversions.

**Enhanced conversions.** Before the quote conversion fires, `setEnhancedConversionUserData` sends SHA-256 hashes of the email, the phone number (converted to `+44…` first), and the first and last name. The postcode and `GB` are sent unhashed, as Google requires.

## Environment variables

| Variable | Scope | Required | Purpose |
|---|---|---|---|
| `VITE_GADS_ID` | build | **yes**, the build fails without it | Google Ads tag, `AW-…` |
| `VITE_GA4_ID` | build | **yes**, the build fails without it | GA4 measurement id, `G-…` |
| `VITE_GADS_LABEL_QUOTE` | build | no | Label for the quote conversion action |
| `VITE_GADS_LABEL_PHONE` | build | no | Label for the phone-click conversion action |
| `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` | build | recommended | PostHog project token; PostHog is off if unset |
| `NEXT_PUBLIC_POSTHOG_HOST` | build and dev | no | PostHog host; used by the dev proxy |
| `TELEGRAM_BOT_TOKEN` | server | **yes**, for quotes | Bot that posts leads |
| `TELEGRAM_CHAT_ID` | server | **yes**, for quotes | Group that receives leads |
| `TELEGRAM_ADMIN_MENTIONS` | server | no | `@mentions` added to emergency requests |

Build-scope values are baked into the bundle, so **redeploy after changing them in Vercel**.

The `/ingest` proxy in `vercel.json` is fixed to PostHog's US region. If the project ever moves to the EU region, change both rewrites.

## Setup you still need to do

0. **Vercel → Settings → Environment Variables.** Add every variable above for **Production and Preview**, then redeploy. www.speedyplumbingdrain.co.uk already points at Vercel, so Google's tag checker finds the tag once the deploy is live. The "Misconfigured" campaign status usually clears within 24 hours; use **Test installation** or Tag Assistant to confirm sooner.
1. **GA4 → Admin → Data streams → Web → Enhanced measurement.** Make sure it is **on**, including "Page changes based on browser history events". This single-page app's page views depend on it.
2. **Google Ads conversion actions** (already created, 17 Sept 2026). Both fire as £1 GBP.

   | Action | Goal | Env var | Fires on |
   |---|---|---|---|
   | Lead form book (`7770190045`) | Book appointment, Primary | `VITE_GADS_LABEL_QUOTE` | `quote_form_success` |
   | Website phone call (`7773723323`) | Contact, Primary | `VITE_GADS_LABEL_PHONE` | `phone_call_click` |

   - **Change "Lead form book" Count from *Every* to *One*.** A plumbing enquiry isn't a repeat purchase, and "Every" lets one person inflate conversions by submitting twice.
   - "Website phone call" is a *tap* on the number, not a completed call. The ARIM playbook would make it Secondary so bidding optimises on real leads; it is Primary now by your choice.
   - For true call tracking later, add a "Calls from a website" action with a Google forwarding number, as on BeBest.
   - Enhanced conversions show "Managed through Google Tag". Make sure the account-level setting (Goals → Settings → Enhanced conversions) is **on**, which is what the hashed `user_data` feeds.
   - Google's `gtag_report_conversion` snippet is **not** pasted in on purpose. `reportConversion()` sends the same event, and the snippet's redirect callback isn't needed.
3. **GA4 → Admin → Events.** Once events have arrived, mark `quote_form_success` and `phone_call_click` as **key events**.
4. **Link GA4 to Google Ads** (GA4 → Admin → Product links), so GA4 audiences and key events are available in Ads.
5. **Telegram.** Create the bot with @BotFather, add it to the group, and set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`. Submit one test quote and confirm the message arrives.

## Testing locally

- `npm run dev`:
  - the Google tag and PostHog both work (PostHog goes through Vite's `/ingest` proxy);
  - `/api/quote` is **not** served, so submitting shows the error panel.
- `vercel dev` runs the site together with `/api/quote`. It needs the Vercel CLI: `npm i -g vercel && vercel link`.
- To check events, look at DevTools → Network for `collect?` (GA4) and `/ingest/` (PostHog), or run `window.dataLayer` in the console.
