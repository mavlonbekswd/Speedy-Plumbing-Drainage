// The one accordion row, shared by the FAQ list and the problem grid.
//
// They were two rows in two sizes on the same page: 72px with a 17px title in components/
// ServiceFAQ.tsx and 64px with the same title in components/ProblemGrid.tsx. One role, one
// style, so the three class strings live here and neither file owns them.
//
// 64px on desktop: the 32px control plus py-4 top and bottom. The title sits inside that, so a
// wrapped question grows the row rather than the padding deciding it.
export const ACCORDION_ROW =
  "flex w-full items-center justify-between gap-4 rounded-card px-5 py-4 text-left sm:px-6";

/** Phone tightening for the ad templates. Desktop is the shared row, unchanged. */
export const ACCORDION_ROW_COMPACT =
  "flex w-full items-center justify-between gap-4 rounded-card px-4 py-3 text-left sm:px-6 sm:py-4";

export const ACCORDION_TITLE = "font-display text-[17px] font-bold leading-snug text-brand";

/** The plus/minus, filled navy when the row is open. */
export function accordionControl(open: boolean): string {
  return `flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-pill ${
    open ? "bg-brand text-cta" : "bg-paper-2 text-brand"
  }`;
}
