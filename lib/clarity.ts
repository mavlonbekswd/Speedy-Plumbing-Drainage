// Microsoft Clarity: heatmaps and session recordings.
//
// Same posture as lib/gtag.ts: a raw <script> in <head>, rendered only when there is a usable
// project id, and silenced in `next dev` by DEV_SILENT so local clicks never reach the live
// project. The id is public (it is printed in every page source), so the project's own id is the
// fallback; NEXT_PUBLIC_CLARITY_ID overrides it, and setting it to "off" removes the tag.

import { DEV_SILENT } from "@/lib/devSilence";

const DEFAULT_CLARITY_ID = "yvkq2qxhaj";

// A literal process.env read, so Next inlines it into the browser bundle.
const RAW_CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID?.trim() || DEFAULT_CLARITY_ID;

/** Clarity project ids are short lowercase alphanumerics. Anything else is treated as unset. */
export function isValidClarityId(id?: string): id is string {
  return /^[a-z0-9]{6,20}$/.test(id ?? "");
}

export const CLARITY_ID: string | undefined =
  !DEV_SILENT && isValidClarityId(RAW_CLARITY_ID) ? RAW_CLARITY_ID : undefined;

/** The body of the inline <script>, or null when nothing should be rendered. Microsoft's
 *  standard snippet; the id is validated above, so it needs no escaping. */
export function clarityInlineScript(): string | null {
  if (!CLARITY_ID) return null;
  return (
    "(function(c,l,a,r,i,t,y){" +
    "c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};" +
    't=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;' +
    "y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);" +
    `})(window,document,"clarity","script","${CLARITY_ID}");`
  );
}
