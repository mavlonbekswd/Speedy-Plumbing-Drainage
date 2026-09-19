import type { PostHog } from "posthog-js";

// posthog-js is the largest script on the site, so it is loaded on demand after hydration
// (components/PosthogProvider.tsx) instead of being bundled into every page that tracks an event.
// This module is the seam: callers hand over work, and it runs at once if the client is up or
// waits in a short queue until it is. Nothing here imports posthog-js at runtime.

const ENABLED = Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);

// A tap on the call button can land before the client has loaded. Those few events are held and
// replayed in order; the cap stops a page that never loads it from holding on to memory.
const MAX_QUEUED = 50;

let client: PostHog | null = null;
const queue: ((ph: PostHog) => void)[] = [];

/** Runs `work` with the PostHog client: now if it is loaded, otherwise as soon as it is. */
export function whenPosthog(work: (ph: PostHog) => void): void {
  if (!ENABLED || typeof window === "undefined") return;
  if (client) {
    work(client);
    return;
  }
  if (queue.length < MAX_QUEUED) queue.push(work);
}

/** Called once by the provider after posthog.init. Flushes whatever was waiting, in order. */
export function setPosthog(ph: PostHog): void {
  client = ph;
  for (const work of queue.splice(0)) work(ph);
}
