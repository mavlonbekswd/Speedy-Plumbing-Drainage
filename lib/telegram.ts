import "server-only";

import type { Booking } from "@/lib/bookingSchema";
import { toE164Uk } from "@/lib/phone";

// Telegram delivery for bookings. There is no database on this site: the
// message in the business group IS the lead record, so a booking only counts
// as received once Telegram has accepted the text message.
//
// Env (server only, never NEXT_PUBLIC_):
//   TELEGRAM_BOT_TOKEN       from @BotFather
//   TELEGRAM_CHAT_ID         the group's id once the bot has been added
//   TELEGRAM_ADMIN_MENTIONS  optional, e.g. "@dave @sam"; added out of hours
//   TELEGRAM_API_BASE        test only, ignored in production (see apiBase)
//
// Nothing in this file logs a customer's details or the bot token. The token
// is embedded in every request URL, so the URL is never logged either, and
// Telegram's own error bodies quote the message text back, so they are
// discarded unread.

const TG_TIMEOUT_MS = 10_000;
const TG_RETRY_DELAY_MS = 500;
const TG_DEFAULT_BASE = "https://api.telegram.org";

/** Photo to upload. The route sniffs the bytes and names the file; the
 *  customer's own filename is never forwarded. */
export interface BookingPhoto {
  blob: Blob;
  /** Our name, e.g. "photo0.jpg", derived from the sniffed magic bytes. */
  filename: string;
}

/** Overridable so the booking path can be proven end to end against a local
 *  mock without messaging the client's group. The override is ignored outright
 *  in production: a stray environment variable must never be able to redirect
 *  real customer contact details to somebody else's server. */
function apiBase(): string {
  if (process.env.VERCEL_ENV === "production") return TG_DEFAULT_BASE;
  return process.env.TELEGRAM_API_BASE || TG_DEFAULT_BASE;
}

function apiUrl(method: string): string | null {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  return token ? `${apiBase()}/bot${token}/${method}` : null;
}

/** A 5xx or a transport failure: worth one more go. Carries the status as a
 *  number so the log line can stay a static string plus a small object. */
class TelegramRetryable extends Error {
  readonly status: number;
  constructor(status: number) {
    super("telegram-retryable");
    this.name = "TelegramRetryable";
    this.status = status;
  }
}

function reasonOf(err: unknown): string {
  if (err instanceof TelegramRetryable) return `http_${err.status}`;
  return err instanceof Error ? err.name : "unknown";
}

/** One attempt. True on 2xx. Throws on network error, timeout or 5xx so the
 *  caller can retry; a 4xx (bad token, bad chat id, bad markup) is a
 *  configuration fault that a retry cannot fix. */
async function attempt(url: string, method: string, body: FormData | Record<string, unknown>): Promise<boolean> {
  const isForm = body instanceof FormData;
  const res = await fetch(url, {
    method: "POST",
    headers: isForm ? undefined : { "Content-Type": "application/json" },
    body: isForm ? body : JSON.stringify(body),
    signal: AbortSignal.timeout(TG_TIMEOUT_MS),
  });
  if (res.ok) return true;

  // Discarded unread on purpose. Telegram quotes the offending message text
  // back in its error bodies, so logging one would log the customer's
  // details; cancelling releases the connection instead of leaking it.
  void res.body?.cancel().catch(() => undefined);

  if (res.status >= 500) throw new TelegramRetryable(res.status);
  console.error("Telegram call rejected", { method, status: res.status });
  return false;
}

/** buildBody is a factory because a FormData body is a one-shot stream and
 *  cannot be replayed on the retry. */
async function tgCall(method: string, buildBody: () => FormData | Record<string, unknown>): Promise<boolean> {
  const url = apiUrl(method);
  if (!url) return false;

  try {
    return await attempt(url, method, buildBody());
  } catch (err) {
    console.error("Telegram call failed, retrying once", { method, reason: reasonOf(err) });
  }

  await new Promise((r) => setTimeout(r, TG_RETRY_DELAY_MS));

  try {
    return await attempt(url, method, buildBody());
  } catch (err) {
    console.error("Telegram call failed on retry", { method, reason: reasonOf(err) });
    return false;
  }
}

/** All four characters that matter inside an HTML-parsed Telegram message.
 *  "&" first, or the escapes would be escaped again. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const URGENCY_LABELS: Record<string, string> = {
  emergency: "EMERGENCY, water flowing now",
  urgent: "Urgent, within a day or two",
  soon: "This week",
  planned: "Planned work",
};

function line(label: string, value: string | null): string | null {
  return value ? `<b>${escapeHtml(label)}:</b> ${escapeHtml(value)}` : null;
}

function bookingMessage(b: Booking, photoCount: number, isOutOfHours: boolean): string {
  // Out-of-hours bookings get the loud header plus mentions, because a
  // mention notifies even in a muted group.
  const mentions = isOutOfHours ? process.env.TELEGRAM_ADMIN_MENTIONS?.trim() : "";

  const clickId = b.gclid
    ? `gclid ${b.gclid}`
    : b.gbraid
      ? `gbraid ${b.gbraid}`
      : b.wbraid
        ? `wbraid ${b.wbraid}`
        : null;

  return [
    isOutOfHours ? "OUT-OF-HOURS BOOKING" : "NEW BOOKING",
    mentions ? escapeHtml(mentions) : null,
    "",
    line("Name", b.name),
    // E.164 so the group can tap the number straight through to a call.
    line("Phone", toE164Uk(b.phone)),
    line("Postcode", b.postcode),
    line("Email", b.email),
    line("Service", b.service),
    line("Urgency", b.urgency ? (URGENCY_LABELS[b.urgency] ?? b.urgency) : null),
    line("Details", b.details),
    line("Preferred contact", b.contactMethod),
    line("Form", b.formId),
    line("Click id", clickId),
    line("Landed on", b.landingPage),
    `<b>Photos:</b> ${photoCount}`,
  ]
    .filter((l): l is string => l !== null)
    .join("\n");
}

/**
 * Sends the booking. Resolves false unless Telegram has accepted the text
 * message, which is the lead itself; otherwise resolves how many photos were lost. Photos are best effort and are attempted
 * only after the text has landed: a failed upload is logged without any
 * personal detail and the lead still counts as delivered, because the contact
 * details are already in the group.
 */
export async function notifyBookingTelegram(
  booking: Booking,
  photos: BookingPhoto[],
  isOutOfHours = false,
): Promise<false | { photosLost: number }> {
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!chatId || !process.env.TELEGRAM_BOT_TOKEN) {
    console.error("Telegram not configured: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are required");
    return false;
  }

  const forceOoh = process.env.OOH_ALERT_FORCE === "1";
  const loud = isOutOfHours || forceOoh;
  const text = bookingMessage(booking, photos.length, loud);

  const sent = await tgCall("sendMessage", () => ({
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  }));
  if (!sent) return false;
  if (photos.length === 0) return { photosLost: 0 };

  // Plain text, sent without parse_mode, so it needs no escaping and cannot
  // fail the upload on a stray "<" in a customer's name.
  const caption = `Photos from ${booking.name} (${booking.postcode})`;

  // sendMediaGroup takes 2 to 10 items, so a lone photo has to go via sendPhoto.
  const single = photos.length === 1 ? photos[0] : undefined;

  const photosOk = single
    ? await tgCall("sendPhoto", () => {
          const fd = new FormData();
          fd.append("chat_id", chatId);
          fd.append("caption", caption);
          fd.append("photo", single.blob, single.filename);
          return fd;
        })
      : await tgCall("sendMediaGroup", () => {
          const fd = new FormData();
          fd.append("chat_id", chatId);
          fd.append(
            "media",
            JSON.stringify(
              photos.map((_, i) => ({
                type: "photo",
                media: `attach://photo${i}`,
                ...(i === 0 ? { caption } : {}),
              })),
            ),
          );
          photos.forEach((p, i) => fd.append(`photo${i}`, p.blob, p.filename));
          return fd;
        });

  if (!photosOk) {
    console.error("Telegram photo upload failed, text lead was delivered without it", {
      photos: photos.length,
    });
    // The lead itself landed, so this is still a success. The count goes back to the form so the
    // customer is told the photos did not arrive, instead of assuming we have seen them.
    return { photosLost: photos.length };
  }
  return { photosLost: 0 };
}
