// The Google tag: Google Ads conversions, plus an optional GA4 property on the
// same tag load.
//
// Every id and label here comes from an environment variable and every one of
// them may be an empty string, because next.config.ts maps the legacy variable
// names through a helper whose fallback is "". So the whole module is built to
// go silent rather than to guess: with nothing configured the tag is never
// rendered and each exported function is a no-op. The site sells plumbing with
// zero tracking env.
//
// The one thing it will not do is fail quietly where the failure is invisible.
// A conversion label that is absent looks exactly like an account that is
// measuring fine, so an Ads account can run for months on spend and report
// nothing. That case is loud: it throws in development and logs once in
// production.

import { toE164Uk } from "@/lib/phone";
import { DEV_SILENT } from "@/lib/devSilence";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// Read as literal process.env.NEXT_PUBLIC_* expressions. Next inlines only
// literal reads into the browser bundle; a dynamic process.env[name] lookup
// comes back undefined on the client, so nothing here may be indexed.
const RAW_GADS_ID = DEV_SILENT ? undefined : process.env.NEXT_PUBLIC_GADS_ID;
const RAW_GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
const RAW_LABEL_BOOKING = process.env.NEXT_PUBLIC_GADS_LABEL_BOOKING;
const RAW_LABEL_PHONE_TAP = process.env.NEXT_PUBLIC_GADS_LABEL_PHONE_TAP;
const RAW_LABEL_PHONE_CALL = process.env.NEXT_PUBLIC_GADS_LABEL_PHONE_CALL;
const RAW_LABEL_WHATSAPP = process.env.NEXT_PUBLIC_GADS_LABEL_WHATSAPP;

/** The Ads account tag id: "AW-" then the account's conversion id digits. The
 *  shape is checked, not just the presence, because the value most often
 *  pasted here by mistake is a bare conversion ACTION id (the number in the
 *  URL of one action inside the account). That renders a tag which looks
 *  correct in the page source and reaches no account at all. */
export function isValidGadsId(id?: string): id is string {
  return /^AW-\d{6,}$/.test(id ?? "");
}

/** The GA4 measurement id. Same reasoning: a wrong shape is not a destination. */
export function isValidGa4Id(id?: string): id is string {
  return /^G-[A-Z0-9]{6,}$/.test(id ?? "");
}

// A malformed id is treated exactly like an unset one everywhere below.
// Sending to a non-existent account is not "better than nothing"; it is the
// same nothing with a healthier-looking page source.
export const GADS_ID: string | undefined = isValidGadsId(RAW_GADS_ID) ? RAW_GADS_ID : undefined;
export const GA4_ID: string | undefined = isValidGa4Id(RAW_GA4_ID) ? RAW_GA4_ID : undefined;

const label = (raw?: string): string | undefined => (raw && raw.trim() ? raw.trim() : undefined);

export type ConversionName = "booking" | "phone_tap" | "whatsapp";

// "phone_tap" is a tap on a tel: link, which has no duration. It must never be
// wired to the call action below, which counts calls that ran past a minimum
// duration; counting taps as calls trains bidding on nothing.
export const GADS_LABELS: Record<ConversionName, string | undefined> = {
  booking: label(RAW_LABEL_BOOKING),
  phone_tap: label(RAW_LABEL_PHONE_TAP),
  whatsapp: label(RAW_LABEL_WHATSAPP),
};

/** Used ONLY by the number-swap config line. Google reports the call itself;
 *  no tap is involved and no code path fires a conversion against it. */
export const GADS_LABEL_PHONE_CALL: string | undefined = label(RAW_LABEL_PHONE_CALL);

// The site's job in a development build is to take a booking and report it.
// Everything else is a micro-signal that may legitimately not exist yet.
const REQUIRED_CONVERSIONS: ConversionName[] = ["booking"];

const LABEL_ENV_NAME: Record<ConversionName, string> = {
  booking: "NEXT_PUBLIC_GADS_LABEL_BOOKING",
  phone_tap: "NEXT_PUBLIC_GADS_LABEL_PHONE_TAP",
  whatsapp: "NEXT_PUBLIC_GADS_LABEL_WHATSAPP",
};

export interface GoogleConfig {
  id?: string;
  booking?: string;
  ga4?: string;
  phoneTap?: string;
  phoneCall?: string;
  whatsapp?: string;
}

/** Required entries stop the site doing its job. Optional entries are signals
 *  the account may simply not have an action for yet, and are never an error. */
export interface MissingGoogleConfig {
  required: string[];
  optional: string[];
}

/**
 * Names every Google variable that is not usable, split by whether its absence
 * is a fault. Takes an explicit config so the logic is provable: in the browser
 * bundle these reads are inlined at build time and cannot be re-stubbed.
 */
export function missingGoogleConfig(
  cfg: GoogleConfig = {
    id: RAW_GADS_ID,
    booking: GADS_LABELS.booking,
    ga4: RAW_GA4_ID,
    phoneTap: GADS_LABELS.phone_tap,
    phoneCall: GADS_LABEL_PHONE_CALL,
    whatsapp: GADS_LABELS.whatsapp,
  },
): MissingGoogleConfig {
  const required: string[] = [];
  const optional: string[] = [];

  if (!cfg.id) required.push("NEXT_PUBLIC_GADS_ID");
  // A set-but-wrong value gets its own entry so the message can say what is
  // really wrong instead of sending someone to add a variable already there.
  else if (!isValidGadsId(cfg.id)) required.push("NEXT_PUBLIC_GADS_ID (malformed)");
  if (!cfg.booking) required.push("NEXT_PUBLIC_GADS_LABEL_BOOKING");

  if (!cfg.ga4) optional.push("NEXT_PUBLIC_GA4_ID");
  else if (!isValidGa4Id(cfg.ga4)) optional.push("NEXT_PUBLIC_GA4_ID (malformed)");
  if (!cfg.phoneTap) optional.push("NEXT_PUBLIC_GADS_LABEL_PHONE_TAP");
  if (!cfg.phoneCall) optional.push("NEXT_PUBLIC_GADS_LABEL_PHONE_CALL");
  if (!cfg.whatsapp) optional.push("NEXT_PUBLIC_GADS_LABEL_WHATSAPP");

  return { required, optional };
}

// Each variable names its own consequence. A warning that overstates gets read
// as boilerplate and then ignored, which is how a loud failure quietly becomes
// a silent one.
const CONSEQUENCE: Record<string, string> = {
  NEXT_PUBLIC_GADS_ID:
    "no Google tag is rendered at all, so nothing reaches the Ads account: no conversions " +
    "and no remarketing audiences",
  "NEXT_PUBLIC_GADS_ID (malformed)":
    "the value must be \"AW-\" followed by the account's conversion id digits. A bare " +
    "10-digit number is usually a conversion ACTION id pasted by mistake. Copy the id from " +
    "Google Ads > Goals > Conversions > any action > \"Use Google tag\", the part before " +
    "the slash",
  NEXT_PUBLIC_GADS_LABEL_BOOKING:
    "every completed booking is DISCARDED instead of being reported as a conversion, while " +
    "the account still looks tagged",
  NEXT_PUBLIC_GA4_ID:
    "no GA4 property receives pageviews. Ads conversions are unaffected",
  "NEXT_PUBLIC_GA4_ID (malformed)":
    "the value must be \"G-\" followed by the measurement id characters. Nothing reaches " +
    "GA4; Ads conversions are unaffected",
  NEXT_PUBLIC_GADS_LABEL_PHONE_TAP:
    "a tap on the phone number is a PostHog event only and reaches no Ads conversion " +
    "action. Nothing is discarded; there is simply no action to send it to",
  NEXT_PUBLIC_GADS_LABEL_PHONE_CALL:
    "the displayed number is never swapped for a Google forwarding number, so no website " +
    "call conversion can fire. Nothing is discarded and nothing else on the site is " +
    "affected, but on a call-led trade this is the largest single revenue signal. It also " +
    "needs a forwarding number on the action, or the tag has nothing to swap to",
  NEXT_PUBLIC_GADS_LABEL_WHATSAPP:
    "a WhatsApp tap is a PostHog event only and reaches no Ads conversion action",
};

function describe(names: string[]): string {
  return names
    .map((name) => {
      const state = name.endsWith("(malformed)") ? "is set but malformed" : "is unset";
      return `${name} ${state}: ${CONSEQUENCE[name] ?? "unknown effect"}.`;
    })
    .join(" ");
}

/** One sentence per variable, with the optional ones stated plainly as
 *  optional so nobody spends an afternoon on a signal they never wanted. */
export function misconfigurationMessage(missing: MissingGoogleConfig = missingGoogleConfig()): string {
  const parts: string[] = [];
  if (missing.required.length) {
    parts.push(`Google Ads conversion tracking is not fully configured. ${describe(missing.required)}`);
  }
  if (missing.optional.length) {
    parts.push(`Optional and not an error, listed so the gap is known: ${describe(missing.optional)}`);
  }
  if (!parts.length) return "Google tag configuration is complete.";
  parts.push("Set these in .env.local (see .env.local.example) or in the Vercel project.");
  return parts.join(" ");
}

// Logged at most once per variable, per page load. Repeating it on every tap
// would bury it in the console noise it is meant to stand out from.
const alreadyLogged = new Set<string>();

function logOnce(key: string, message: string): void {
  if (alreadyLogged.has(key) || typeof console === "undefined") return;
  alreadyLogged.add(key);
  console.error(message);
}

function gtag(...args: unknown[]): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag(...args);
}

export function reportConversion(name: ConversionName): void {
  const conversionLabel = GADS_LABELS[name];
  if (!GADS_ID || !conversionLabel) {
    // No valid account id means there is no tracking at all, which is loud by
    // itself and true of a local build with a clean env. The dangerous case is
    // a VALID id with a missing label: the account looks measured and this one
    // action is quietly thrown away, which is the fault worth shouting about.
    if (GADS_ID && !conversionLabel) {
      const message =
        `${LABEL_ENV_NAME[name]} is unset: a "${name}" conversion was just discarded. ` +
        `${CONSEQUENCE[LABEL_ENV_NAME[name]] ?? ""}`;
      if (process.env.NODE_ENV === "development" && REQUIRED_CONVERSIONS.includes(name)) {
        throw new Error(message);
      }
      logOnce(LABEL_ENV_NAME[name], message);
    }
    return;
  }
  gtag("event", "conversion", { send_to: `${GADS_ID}/${conversionLabel}` });
}

// ─── Head scripts ─────────────────────────────────────────────────────────────

/** Anything interpolated into the inline script is JSON-encoded, then "<" is
 *  escaped as well, because JSON.stringify happily passes "</script>" through
 *  and that would end the element early. Labels have no fixed shape and are
 *  never validated, so this is the only thing between a bad paste and a broken
 *  document head. */
function js(value: string): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export interface GoogleTagHeadScripts {
  /** For <script async src={loaderSrc} />. */
  loaderSrc: string;
  /** The body of the inline <script>. It must be injected with
   *  dangerouslySetInnerHTML: as JSX children React escapes the quotes and the
   *  script stops parsing. Plain <script> elements, not next/script, so the
   *  tag is in the served HTML where Google's tag checker looks for it. */
  inline: string;
}

/**
 * Everything the layout needs to render the Google tag, or null when there is
 * no valid Ads account id, in which case nothing at all should be rendered.
 *
 * `displayNumber` is the phone number as it is printed on the page. Google
 * swaps it for a forwarding number on paid sessions and reports the calls that
 * ran past the action's minimum duration; the real business number stays in
 * the HTML for organic visitors and for name-address-phone consistency.
 */
export function googleTagHeadScripts(displayNumber: string): GoogleTagHeadScripts | null {
  if (!GADS_ID) return null;

  const lines = [
    "window.dataLayer=window.dataLayer||[];",
    "function gtag(){dataLayer.push(arguments);}",
    "window.gtag=gtag;",
    "gtag('js',new Date());",
    // allow_enhanced_conversions lets the hashed identifiers set below be
    // attached to the booking conversion.
    `gtag('config',${js(GADS_ID)},{allow_enhanced_conversions:true});`,
  ];
  if (GA4_ID) lines.push(`gtag('config',${js(GA4_ID)});`);
  if (GADS_LABEL_PHONE_CALL) {
    lines.push(
      `gtag('config',${js(`${GADS_ID}/${GADS_LABEL_PHONE_CALL}`)},` +
        `{phone_conversion_number:${js(displayNumber)}});`,
    );
  }

  return {
    loaderSrc: `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GADS_ID)}`,
    inline: lines.join(""),
  };
}

// ─── Enhanced conversions ─────────────────────────────────────────────────────
//
// Hashing rules that are easy to get wrong and silent when wrong:
//   - SHA-256 the email, the phone and the name parts.
//   - NEVER hash the postcode or the country. Hashed, they match nothing.
//   - The phone must be E.164 BEFORE hashing, or it never matches either.
//
// gtag can hash raw values itself. Pre-hashing here means the customer's phone
// number and name never enter window.dataLayer in the clear at all.

/** One customer phone number, one E.164 string. Exported because PostHog uses
 *  the same value as the person's distinct id: if the two normalisers ever
 *  disagreed, one customer would become two people in the analytics. toE164Uk
 *  works from digits, so an international-prefix "00" is dropped first. */
export function customerE164(phone: string): string {
  return toE164Uk(phone.trim().replace(/^\+?00/, ""));
}

async function sha256Hex(subtle: SubtleCrypto, value: string): Promise<string | null> {
  const normalised = value.trim().toLowerCase();
  if (!normalised) return null;
  const digest = await subtle.digest("SHA-256", new TextEncoder().encode(normalised));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export interface EnhancedConversionUser {
  name: string;
  phone: string;
  email?: string;
  postcode: string;
}

/**
 * Attaches the lead's hashed identifiers to the next conversion event. Must be
 * awaited before reportConversion("booking") or the conversion goes without
 * them. Needs "Enhanced conversions for leads" switched on for the action.
 */
export async function setEnhancedConversionUserData(user: EnhancedConversionUser): Promise<void> {
  if (!GADS_ID) return;

  // No SubtleCrypto (an insecure context, or a browser old enough to lack it)
  // means no way to hash. Send NOTHING rather than fall back to plaintext: the
  // point of this payload is that the identifiers never travel readable.
  const subtle = typeof crypto !== "undefined" ? crypto.subtle : undefined;
  if (!subtle) return;

  const parts = user.name.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ");
  const e164 = user.phone.trim() ? customerE164(user.phone) : "";

  const [phoneHash, firstHash, lastHash, emailHash] = await Promise.all([
    e164 ? sha256Hex(subtle, e164) : null,
    firstName ? sha256Hex(subtle, firstName) : null,
    lastName ? sha256Hex(subtle, lastName) : null,
    user.email?.trim() ? sha256Hex(subtle, user.email) : null,
  ]);

  const address: Record<string, unknown> = {};
  if (firstHash) address.sha256_first_name = firstHash;
  if (lastHash) address.sha256_last_name = lastHash;
  const postcode = user.postcode.trim();
  if (postcode) {
    address.postal_code = postcode.toUpperCase();
    address.country = "GB";
  }

  const userData: Record<string, unknown> = {};
  if (phoneHash) userData.sha256_phone_number = phoneHash;
  if (emailHash) userData.sha256_email_address = emailHash;
  if (Object.keys(address).length) userData.address = address;

  if (Object.keys(userData).length) gtag("set", "user_data", userData);
}
