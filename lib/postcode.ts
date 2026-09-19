// Postcode handling shared by the client forms and the API route, mirroring
// lib/phone.ts.
//
// Client: the postcode input only accepts letters, digits and spaces, so
// anything else is stripped as the user types.
// Server: the value is validated against a standard UK postcode pattern and
// normalized to "CB1 2AB" form; obviously-invalid input is rejected. The
// server never trusts the client-side sanitizer alone.

export function sanitizePostcodeInput(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9 ]/g, "").slice(0, 8);
}

const UK_POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/;

export function normalizePostcode(raw: string): string | null {
  const upper = raw.toUpperCase().trim();
  if (!UK_POSTCODE_RE.test(upper)) return null;
  const compact = upper.replace(/\s+/g, "");
  if (compact.length < 5 || compact.length > 7) return null;
  return `${compact.slice(0, -3)} ${compact.slice(-3)}`;
}
