// The pinned ad descriptions, in the page's own visible text.
//
// An ad may only promise what its landing page says, so these sentences are a compliance
// surface, not decoration. They are therefore always-visible paragraphs: never inside an
// accordion, never behind `hidden`, never truncated, and each one rendered from a single
// string expression so it stays one text node a crawler and an audit can both read.
export default function PlainWords({
  lines,
  heading = "In plain words",
}: {
  lines: readonly string[];
  heading?: string;
}) {
  if (lines.length === 0) return null;

  return (
    <div className="rounded-card border border-line bg-white p-6 shadow-card">
      <h3 className="font-display text-[13px] font-bold uppercase tracking-[0.16em] text-tint">{heading}</h3>
      <div className="mt-3 flex flex-col gap-2">
        {lines.map((line) => (
          <p key={line} className="max-w-[62ch] text-[15px] leading-[1.7] text-slate">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
