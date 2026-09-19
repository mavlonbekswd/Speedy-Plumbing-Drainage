import { NextResponse, type NextRequest } from "next/server";

import { outwardCode, parseBooking } from "@/lib/bookingSchema";
import { isOutOfHoursUK } from "@/lib/hours";
import { checkRateLimit, clientKey } from "@/lib/rateLimit";
import { notifyBookingTelegram, type BookingPhoto } from "@/lib/telegram";

// POST /api/book. The booking form posts multipart/form-data (it can carry up
// to four photos); the small inline callback card posts JSON and never has
// any. Nothing is stored here or anywhere else: the Telegram message to the
// business group IS the booking record, so a 2xx is returned only once
// Telegram has accepted it. The client fires its Google Ads conversion on
// that response and on nothing earlier.
//
// Node runtime, not edge: the photo path reads file bytes and builds
// multipart bodies.
export const runtime = "nodejs";

// Vercel's own request ceiling for a serverless function body is 4.5 MB, so a
// larger upload is refused here rather than being read and then failing
// somewhere less explicable.
const MAX_BODY_BYTES = 4.5 * 1024 * 1024;

const MAX_PHOTOS = 4;
const MAX_PHOTO_BYTES = 1.5 * 1024 * 1024;
const MAX_PHOTOS_TOTAL_BYTES = 4 * 1024 * 1024;

function isBlobLike(value: unknown): value is Blob {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<Blob>;
  return (
    typeof candidate.size === "number" &&
    typeof candidate.slice === "function" &&
    typeof candidate.arrayBuffer === "function"
  );
}

/** Magic bytes, never the declared MIME type or the filename: both are
 *  attacker-chosen. Returns the extension we will name the upload, or null if
 *  these bytes are not one of the three formats Telegram renders reliably. */
function sniffImage(head: Uint8Array): string | null {
  if (head.length >= 3 && head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return "jpg";
  if (
    head.length >= 4 &&
    head[0] === 0x89 &&
    head[1] === 0x50 &&
    head[2] === 0x4e &&
    head[3] === 0x47
  ) {
    return "png";
  }
  // RIFF....WEBP
  if (
    head.length >= 12 &&
    head[0] === 0x52 &&
    head[1] === 0x49 &&
    head[2] === 0x46 &&
    head[3] === 0x46 &&
    head[8] === 0x57 &&
    head[9] === 0x45 &&
    head[10] === 0x42 &&
    head[11] === 0x50
  ) {
    return "webp";
  }
  return null;
}

/** Cross-site posts are treated as spam. Compared against the host the browser
 *  actually addressed (x-forwarded-host first, because Vercel terminates TLS
 *  in front of this), never against nextUrl.host, which is the bound hostname
 *  and can differ from the one the browser used. When it differs, a genuine
 *  booking is silently classified as spam and the customer is still shown
 *  "thanks, we've got it", which is the worst failure this route has. */
function isCrossOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  // No host header at all: we cannot verify, so do not discard a lead on a guess.
  if (!host) return false;
  try {
    return new URL(origin).host.toLowerCase() !== host.toLowerCase();
  } catch {
    // Not a URL (including the literal "null" some browsers send): not a
    // same-origin form post from our own page.
    return true;
  }
}

/** A filtered submission gets a response identical to a real one, so a bot
 *  cannot learn that it was caught. */
function fakeSuccess(): NextResponse {
  return NextResponse.json({ ok: true, photos_dropped: 0 });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Rate limit before anything reads the body, so a flood costs us a header
  // lookup rather than a multipart parse.
  const limit = checkRateLimit(clientKey(req.headers));
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  // 2. Declared size. Advisory only (a client can lie or omit it), which is
  // why the per-photo and total-photo caps below are enforced on real bytes.
  const declared = Number(req.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  }

  // 3. Parse. multipart is the form; JSON is the inline callback card, which
  // never carries photos.
  const contentType = req.headers.get("content-type") ?? "";
  // Null prototype: every key here comes from the request, so a "__proto__"
  // key must land as an ordinary own property rather than reaching
  // Object.prototype through the inherited setter.
  const fields: Record<string, unknown> = Object.create(null) as Record<string, unknown>;
  let photoParts: unknown[] = [];
  try {
    if (contentType.includes("application/json")) {
      const body: unknown = await req.json();
      if (typeof body !== "object" || body === null || Array.isArray(body)) {
        throw new Error("not an object");
      }
      Object.assign(fields, body);
    } else {
      const form = await req.formData();
      for (const [key, value] of form.entries()) {
        if (key !== "photos") fields[key] = value;
      }
      photoParts = form.getAll("photos");
    }
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  // 4. Spam screens. Both return a fake success and never reach Telegram.
  const honeypot = typeof fields.website === "string" ? fields.website.trim() : "";
  if (honeypot !== "" || isCrossOrigin(req)) return fakeSuccess();

  // 5. Validation.
  const parsed = parseBooking(fields);
  if (!parsed.ok) {
    return NextResponse.json({ error: "Invalid fields", fields: parsed.fields }, { status: 422 });
  }
  const booking = parsed.booking;

  // 6. Photos. A photo is a nice-to-have and the lead is not: anything
  // suspect is dropped silently and the count is reported back so the form can
  // tell the customer their photo did not go through.
  const photos: BookingPhoto[] = [];
  let photosDropped = 0;
  let totalBytes = 0;
  // An unselected <input type="file"> still posts an empty part. That is not a
  // dropped photo, so zero-length parts are discarded before anything is counted.
  const candidates = photoParts.filter((p): p is Blob => isBlobLike(p) && p.size > 0);
  for (const candidate of candidates) {
    if (photos.length >= MAX_PHOTOS || candidate.size > MAX_PHOTO_BYTES) {
      photosDropped += 1;
      continue;
    }
    let kind: string | null = null;
    try {
      kind = sniffImage(new Uint8Array(await candidate.slice(0, 12).arrayBuffer()));
    } catch {
      kind = null;
    }
    if (!kind || totalBytes + candidate.size > MAX_PHOTOS_TOTAL_BYTES) {
      photosDropped += 1;
      continue;
    }
    totalBytes += candidate.size;
    // Our own name. The customer's filename is never forwarded: it is
    // attacker-controlled text that would be rendered in the group.
    photos.push({ blob: candidate, filename: `photo${photos.length}.${kind}` });
  }

  // 7. Deliver. If Telegram will not take it the lead would simply be lost, so
  // the form is told to fail and show its "call us instead" state rather than
  // thanking a customer whose booking nobody will ever see.
  const sent = await notifyBookingTelegram(booking, photos, isOutOfHoursUK());
  if (!sent) {
    // Outward code only, never the full postcode, and never the name, phone,
    // email or details: this line exists to tell us a district's lead was lost,
    // not to reconstruct the customer in a log aggregator.
    console.error("Booking not delivered to Telegram", {
      status: 500,
      district: outwardCode(booking.postcode),
      photos: photos.length,
      form_id: booking.formId,
    });
    return NextResponse.json({ error: "Failed to send booking" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, photos_dropped: photosDropped + sent.photosLost });
}
