import "server-only";

import { normalizePhone } from "@/lib/phone";
import { normalizePostcode } from "@/lib/postcode";

// Pure validation for POST /api/book. No I/O, no logging, no environment:
// the route decides what to do with the verdict. The browser's own checks are
// a UX nicety, so nothing here trusts the shape of what was posted; every
// value arrives as `unknown` because a multipart part can be a File and a
// JSON body can carry a number, an array or null.

export const URGENCIES = ["emergency", "urgent", "soon", "planned"] as const;
export type Urgency = (typeof URGENCIES)[number];

const URGENCY_SET: ReadonlySet<string> = new Set<string>(URGENCIES);

// Deliberately loose. A stricter pattern rejects real addresses, and the only
// thing this field buys us is a way to reply by email; the phone number is the
// contact that matters, and it is validated properly.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX = {
  name: 120,
  service: 120,
  details: 2000,
  email: 254,
  contactMethod: 40,
  formId: 80,
  // Click identifiers and the landing URL.
  tracking: 255,
} as const;

/** The validated lead. Optional fields are null rather than absent so the
 *  message builder never has to distinguish "missing" from "empty". */
export interface Booking {
  name: string;
  /** Plain digits, from normalizePhone. */
  phone: string;
  /** "CB1 2AB" form, from normalizePostcode. */
  postcode: string;
  email: string | null;
  service: string | null;
  urgency: Urgency | null;
  details: string | null;
  contactMethod: string | null;
  formId: string | null;
  // Google click identifiers, captured on landing. There is no database here,
  // so the Telegram message is the only place a lead is stored: without these
  // the job can never be reported back to Google as an offline conversion.
  gclid: string | null;
  gbraid: string | null;
  wbraid: string | null;
  landingPage: string | null;
}

export type ParseResult =
  | { ok: true; booking: Booking }
  | { ok: false; fields: string[] };

/** Trim, truncate, and collapse "nothing useful" to null. Non-strings are
 *  rejected outright rather than stringified: `String(file)` yields
 *  "[object File]", which would sail through a length check. */
export function clean(raw: unknown, max: number): string | null {
  if (typeof raw !== "string") return null;
  const value = raw.trim().slice(0, max);
  return value === "" ? null : value;
}

export function parseBooking(fields: Record<string, unknown>): ParseResult {
  const invalid: string[] = [];

  const name = clean(fields.name, MAX.name);
  if (!name || name.length < 2) invalid.push("name");

  const phoneRaw = clean(fields.phone, 40);
  const phone = phoneRaw ? normalizePhone(phoneRaw) : null;
  if (!phone) invalid.push("phone");

  const postcodeRaw = clean(fields.postcode, 16);
  const postcode = postcodeRaw ? normalizePostcode(postcodeRaw) : null;
  if (!postcode) invalid.push("postcode");

  // Optional, but wrong-if-supplied. Length is checked before truncation so a
  // 500-character address cannot be silently cut down into a valid-looking one.
  const emailRaw = typeof fields.email === "string" ? fields.email.trim() : "";
  let email: string | null = null;
  if (emailRaw !== "") {
    if (emailRaw.length > MAX.email || !EMAIL_RE.test(emailRaw)) invalid.push("email");
    else email = emailRaw;
  }

  const urgencyRaw = clean(fields.urgency, 20);
  let urgency: Urgency | null = null;
  if (urgencyRaw !== null) {
    if (URGENCY_SET.has(urgencyRaw)) urgency = urgencyRaw as Urgency;
    else invalid.push("urgency");
  }

  // The three null checks are redundant with `invalid.length` and are there so
  // the required fields narrow to string without a cast.
  if (invalid.length || !name || !phone || !postcode) return { ok: false, fields: invalid };

  return {
    ok: true,
    booking: {
      name,
      phone,
      postcode,
      email,
      service: clean(fields.service, MAX.service),
      urgency,
      details: clean(fields.details, MAX.details),
      contactMethod: clean(fields.contactMethod, MAX.contactMethod),
      formId: clean(fields.form_id, MAX.formId),
      gclid: clean(fields.gclid, MAX.tracking),
      gbraid: clean(fields.gbraid, MAX.tracking),
      wbraid: clean(fields.wbraid, MAX.tracking),
      landingPage: clean(fields.landing_page, MAX.tracking),
    },
  };
}

/** Outward code only ("CB1 2AB" -> "CB1"). The one part of a lead that is safe
 *  to log: it names a district, not a household. */
export function outwardCode(postcode: string): string {
  return postcode.split(" ")[0] ?? "";
}
