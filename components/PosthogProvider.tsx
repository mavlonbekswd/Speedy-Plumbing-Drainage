"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { handleDelegatedClick, installFirstInteractionTracking } from "@/lib/analytics";
import { captureClickIds } from "@/lib/clickIds";
import { customerE164 } from "@/lib/gtag";
import { setPosthog, whenPosthog } from "@/lib/posthogClient";
import { DEV_SILENT } from "@/lib/devSilence";

// Every visitor is tracked from arrival, with no consent gate anywhere in this
// file: that is the owner's recorded decision for this site.
//
// Requests go to the same-origin /ingest proxy configured in next.config.ts,
// so the host is not read here.
const POSTHOG_KEY = DEV_SILENT ? undefined : process.env.NEXT_PUBLIC_POSTHOG_KEY;

export const posthogEnabled = Boolean(POSTHOG_KEY);

// Module scope, so React's strict-mode double mount cannot start posthog-js
// twice.
let initialised = false;

export function identifyUser({
  name,
  phone,
  email,
  service,
}: {
  name: string;
  phone: string;
  email?: string;
  service?: string;
}): void {
  // The phone number in E.164 is the distinct id: it is the one identifier the
  // business already uses for a customer, so a repeat caller is one person
  // here whether they typed it with a space, a leading zero or a +44.
  whenPosthog((posthog) =>
    posthog.identify(customerE164(phone), {
      name,
      phone,
      ...(email ? { email } : {}),
      ...(service ? { last_service: service } : {}),
    }),
  );
}

function Tracking() {
  const pathname = usePathname();

  useEffect(() => {
    // One effect, in this order, on purpose. posthog.init MUST happen inside a
    // mount effect and never at module load: Next patches history.pushState
    // during hydration, and a posthog-js started before that keeps a reference
    // to the unpatched version, never sees a client-side navigation, and so
    // stops reporting history_change pageviews after the first page.
    if (!initialised) {
      initialised = true;
      // Loaded on demand, after hydration: posthog-js is the largest script on the site and no
      // visitor needs it to read the page or ring us. Events fired meanwhile wait in the queue.
      // ...and only once the browser is idle, so it never competes with the headline painting or
      // with hydration of the call button. The 2 s ceiling keeps short visits measurable. Events
      // fired before then wait in lib/posthogClient's queue and are replayed in order.
      const whenIdle = (work: () => void) =>
        typeof window.requestIdleCallback === "function"
          ? window.requestIdleCallback(work, { timeout: 2000 })
          : window.setTimeout(work, 1);
      whenIdle(() => void import("posthog-js").then(({ default: posthog }) => {
        posthog.init(POSTHOG_KEY as string, {
          // Reverse-proxied through our own domain so ad-blockers cannot drop
          // the requests; ui_host keeps toolbar and app links pointing at the
          // real instance.
          api_host: "/ingest",
          ui_host: "https://us.posthog.com",
          person_profiles: "always",
          // Not `true`: this is an App Router site, so most movement between
          // pages is a client-side navigation and `true` would capture only the
          // first page of every visit.
          capture_pageview: "history_change",
          capture_pageleave: true,
          autocapture: true,
          capture_heatmaps: true,
          capture_performance: true,
          disable_session_recording: false,
          session_recording: {
            // The forms carry a name, a phone number and an address. Recording
            // them keyed in would put customer data in a replay.
            maskAllInputs: true,
          },
        });
        setPosthog(posthog);
      }));
    }

    // Keep any Google Ads click id from the landing URL, so a booking days
    // later can still be attributed to the ad click that produced it.
    captureClickIds();

    // Capture phase, so a tel: navigation cannot swallow the click first.
    document.addEventListener("click", handleDelegatedClick, true);
    return () => document.removeEventListener("click", handleDelegatedClick, true);
  }, []);

  // Restart the time-to-first-interaction clock on every client-side
  // navigation, so the metric describes the page actually being looked at.
  useEffect(() => installFirstInteractionTracking(), [pathname]);

  return null;
}

export default function PosthogProvider({ children }: { children: React.ReactNode }) {
  // No project key: the site renders and works exactly as it does with one,
  // simply unmeasured. Nothing is initialised and no listener is installed.
  if (!POSTHOG_KEY) return <>{children}</>;

  return (
    <>
      <Tracking />
      {children}
    </>
  );
}
