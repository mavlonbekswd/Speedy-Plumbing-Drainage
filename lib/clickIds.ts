// Google Ads click identifiers (gclid / gbraid / wbraid), taken off the
// landing URL and kept for Google's 90-day click window.
//
// A click id that is not captured at the moment of the click is gone for good,
// and with it the ability to tell Google later that this particular ad click
// turned into a paying job. Offline conversion import cannot be done
// retroactively.
//
// The storage key is deliberately unchanged from the previous build of this
// site. Visitors who clicked an ad before the relaunch still hold an unexpired
// record under it, and renaming the key would throw away up to 90 days of
// live attribution on the day of the switch. The reader therefore accepts the
// old record shape as well as the one written today.

export const CLICK_ID_STORAGE_KEY = "spd_gads_click_ids";
export const CLICK_ID_TTL_MS = 90 * 24 * 60 * 60 * 1000;

const CLICK_ID_KEYS = ["gclid", "gbraid", "wbraid"] as const;

// Long enough for any real id; a cap so a crafted URL cannot fill the origin's
// storage quota and evict the record it is pretending to be.
const MAX_VALUE_LENGTH = 255;

export interface ClickIds {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  landing_page?: string;
}

/** What is written today: everything inside `ids`. The old build put
 *  landing_page a level up, so both positions are read back below. */
interface StoredClickIds {
  ids?: ClickIds;
  landing_page?: string;
  ts?: number;
}

/**
 * Called once per visit, on mount. If the visitor arrived from an ad, the
 * click id is on the landing URL.
 *
 * A page with no click id in its query string writes nothing at all, so an
 * ordinary internal navigation can never overwrite a stored, unexpired id with
 * an empty record.
 */
export function captureClickIds(): void {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const ids: ClickIds = {};
    for (const key of CLICK_ID_KEYS) {
      const value = params.get(key);
      if (value) ids[key] = value.slice(0, MAX_VALUE_LENGTH);
    }
    if (!Object.keys(ids).length) return;
    ids.landing_page = window.location.pathname.slice(0, MAX_VALUE_LENGTH);
    localStorage.setItem(CLICK_ID_STORAGE_KEY, JSON.stringify({ ids, ts: Date.now() }));
  } catch {
    // Private mode, a blocked origin or a full quota. The tag's own cookie
    // still covers browser-side attribution; only the offline import is lost.
  }
}

/**
 * The ids held for this visitor, flat, or {} once the window has run out. This
 * is exactly what the booking payload carries.
 *
 * The four fields are picked out by name rather than returned wholesale: a
 * record written by an older build can carry referrer and campaign fields, and
 * those must not leak into the booking payload just because the envelope and
 * the timestamp still match.
 */
export function readClickIds(): ClickIds {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CLICK_ID_STORAGE_KEY);
    if (!raw) return {};
    const stored = JSON.parse(raw) as StoredClickIds | null;
    if (!stored || typeof stored !== "object") return {};
    if (!stored.ts || Date.now() - stored.ts > CLICK_ID_TTL_MS) {
      localStorage.removeItem(CLICK_ID_STORAGE_KEY);
      return {};
    }
    const ids = stored.ids ?? {};
    // Inside `ids` first, then the old top-level position.
    const landingPage = ids.landing_page ?? stored.landing_page;
    return {
      ...(ids.gclid ? { gclid: ids.gclid } : {}),
      ...(ids.gbraid ? { gbraid: ids.gbraid } : {}),
      ...(ids.wbraid ? { wbraid: ids.wbraid } : {}),
      ...(landingPage ? { landing_page: landingPage } : {}),
    };
  } catch {
    return {};
  }
}
