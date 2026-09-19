import "server-only";

// Best-effort rate limiting for POST /api/book.
//
// HONEST LIMITS. This Map lives in one warm serverless instance. Vercel runs
// as many instances as it likes and discards them when they go cold, so the
// effective limit is "5 per 10 minutes per IP per instance", not a global
// budget, and a cold start resets it. It exists to stop a single script
// hammering one warm lambda and to keep the Telegram group readable. The real
// control for a determined flood is a Vercel Firewall rate-limit rule at the
// edge, which sees every request and costs no function invocations. Add one
// there before relying on this for anything.

const WINDOW_MS = 10 * 60 * 1000;
const DEFAULT_MAX = 5;

// Hard cap on tracked keys so a rotating-IP flood cannot grow the Map until
// the instance runs out of memory. Entries are evicted least-recently-seen
// first, which is the right way round: the noisy key is also the recent one.
const MAX_KEYS = 5_000;

const hits = new Map<string, number[]>();

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSeconds: number };

/** Read at call time, not at module load, so a test can set it per process. */
function limitMax(): number {
  const raw = Number(process.env.BOOK_RATE_LIMIT_MAX);
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : DEFAULT_MAX;
}

/** Drop every key whose newest hit has aged out, then evict oldest-seen keys
 *  until the Map is back under the cap. Runs on every call, so the Map can
 *  never grow without bound however the traffic arrives. */
function prune(now: number): void {
  const windowStart = now - WINDOW_MS;
  for (const [key, stamps] of hits) {
    const newest = stamps[stamps.length - 1];
    if (newest === undefined || newest <= windowStart) hits.delete(key);
  }
  if (hits.size <= MAX_KEYS) return;
  for (const key of hits.keys()) {
    if (hits.size <= MAX_KEYS) break;
    hits.delete(key);
  }
}

/** Sliding window. A blocked request is not recorded, so a caller that keeps
 *  retrying does not extend its own ban past the original window. */
export function checkRateLimit(key: string, now: number = Date.now()): RateLimitResult {
  prune(now);

  const windowStart = now - WINDOW_MS;
  const recent = (hits.get(key) ?? []).filter((t) => t > windowStart);

  // Re-insert rather than overwrite: Map keeps insertion order, so deleting
  // first moves this key to the end and makes prune()'s eviction order LRU.
  hits.delete(key);

  if (recent.length >= limitMax()) {
    hits.set(key, recent);
    const oldest = recent[0] ?? now;
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((oldest + WINDOW_MS - now) / 1000)),
    };
  }

  recent.push(now);
  hits.set(key, recent);
  return { ok: true };
}

/** First hop of x-forwarded-for is the client as the edge saw it; the rest of
 *  the chain is proxies. Falls back to x-real-ip, then to a shared "unknown"
 *  bucket, which is deliberately strict: an unidentifiable caller shares one
 *  budget with every other unidentifiable caller. */
export function clientKey(headers: Headers): string {
  // x-real-ip first: on Vercel it is set by the platform and cannot be supplied by the client.
  // x-forwarded-for is the fallback for other hosts and local runs, where its first hop is
  // whatever the caller chose to send, so it must never outrank the platform's own value.
  const real = headers.get("x-real-ip")?.trim();
  if (real) return real;
  const forwarded = headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  if (first) return first;
  return "unknown";
}
