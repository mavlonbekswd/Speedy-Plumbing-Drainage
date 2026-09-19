// Phone handling shared by the client forms and the API route.
//
// Client: the phone input only accepts digits and a leading "+", so letters
// and symbols are stripped as the user types.
// Server: the "+" (and anything else non-numeric) is dropped and the number
// is stored as plain digits; obviously-invalid lengths are rejected. The
// client-side sanitizer is a UX nicety only. The API route re-validates
// independently and never trusts what the browser sent.

export function sanitizePhoneInput(value: string): string {
  // Digits anywhere; "+" only as the first character.
  return value.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "").slice(0, 16);
}

export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15 ? digits : null;
}

/** UK national format to E.164, so "01234567890" becomes "+441234567890".
 *  Schema.org telephone and every Google-facing field want E.164, not the
 *  0-leading national format. Customer-submitted numbers go through
 *  normalizePhone above instead; this is for the business's own number. */
export function toE164Uk(digits: string): string {
  const clean = digits.replace(/\D/g, "");
  if (clean.startsWith("0")) return `+44${clean.slice(1)}`;
  if (clean.startsWith("44")) return `+${clean}`;
  return clean.startsWith("+") ? clean : `+${clean}`;
}

// Cosmetic display formatting for the business's own number, which is driven
// by an environment variable. Not used for customer-submitted numbers.
export function formatUkPhoneDisplay(digits: string): string {
  const clean = digits.replace(/\D/g, "");
  if (clean.length === 11 && clean.startsWith("0")) {
    // Standard UK grouping: a leading five digit code, then the remainder in
    // one block. A reasonable generic display for an unknown real number.
    return `${clean.slice(0, 5)} ${clean.slice(5)}`;
  }
  return digits;
}
