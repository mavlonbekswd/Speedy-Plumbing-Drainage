// The one client-side path from a filled booking form to /api/book.
//
// Multipart rather than JSON, because the form can carry photos of the leak.
// Nothing here validates: the API route re-validates independently and never
// trusts the browser.

import { readClickIds } from "@/lib/clickIds";

export interface BookingInput {
  name: string;
  phone: string;
  postcode: string;
  email?: string;
  service?: string;
  urgency?: string;
  details?: string;
  contactMethod?: string;
  /** Which form on which page produced this lead. */
  form_id: string;
  /** Honeypot. Empty for a human; see components/HoneypotField.tsx. */
  website?: string;
}

export interface BookingResult {
  ok: boolean;
  /** The HTTP status, or 0 if the request never completed. Without it a
   *  validation reject and a messaging outage produce the same error event,
   *  and a form quietly rejecting every postcode reads as a dead integration. */
  status: number;
  /** Set when the photos had to be abandoned to get the lead through. */
  photosDropped?: number;
}

const FIELDS = [
  "name",
  "phone",
  "postcode",
  "email",
  "service",
  "urgency",
  "details",
  "contactMethod",
  "form_id",
  "website",
] as const;

function buildForm(input: BookingInput, photos: File[]): FormData {
  const fd = new FormData();
  for (const field of FIELDS) {
    const value = input[field];
    // Empty optionals are left out rather than sent as "", so the server sees
    // "absent" and "cleared" as the same thing they are.
    if (value != null && value !== "") fd.append(field, value);
  }
  // Captured on the landing URL and held for Google's click window. This is
  // what makes an offline conversion import possible for this lead weeks from
  // now, once the job is actually paid for.
  for (const [key, value] of Object.entries(readClickIds())) {
    if (value) fd.append(key, value);
  }
  for (const photo of photos) fd.append("photos", photo);
  return fd;
}

export async function submitBooking(
  input: BookingInput,
  photos: File[] = [],
): Promise<BookingResult> {
  // No Content-Type header: the browser has to set it so it can include the
  // multipart boundary, and setting it by hand makes the body unparseable.
  try {
    const res = await fetch("/api/book", { method: "POST", body: buildForm(input, photos) });

    // 413 means the photos were too big for the platform's body limit. The
    // customer typed their details once and will not type them again, so the
    // lead goes through without the photos rather than being lost with them.
    if (res.status === 413 && photos.length) {
      const retry = await fetch("/api/book", { method: "POST", body: buildForm(input, []) });
      return { ok: retry.ok, status: retry.status, photosDropped: photos.length };
    }

    return { ok: res.ok, status: res.status };
  } catch {
    // Offline, or the request never completed. Status 0 marks it as a network
    // failure rather than a rejection by the server.
    return { ok: false, status: 0 };
  }
}
