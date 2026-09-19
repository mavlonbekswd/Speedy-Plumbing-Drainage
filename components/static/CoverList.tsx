import { Check, X } from "@phosphor-icons/react/dist/ssr";

export interface CoverItem {
  /** Rendered bold, so a reader who reads only the bold still has the list. */
  lead: string;
  rest?: string;
}

// One half of the guarantee scope: a tick list or a cross list, side by side with the other.
// The icon is the only decoration, and it carries no meaning a screen reader needs, because the
// card's own heading already says which list this is.
export default function CoverList({
  title,
  items,
  tone,
}: {
  title: string;
  items: readonly CoverItem[];
  tone: "yes" | "no";
}) {
  const Glyph = tone === "yes" ? Check : X;
  return (
    <div className="flex h-full flex-col gap-4 rounded-card border border-line bg-white p-6 shadow-card">
      <h3 className="font-display text-[19px] font-bold leading-snug text-brand">{title}</h3>
      <ul className="flex flex-col gap-3 text-[15.5px] leading-[1.6] text-slate">
        {items.map((item) => (
          <li key={item.lead} className="flex gap-3">
            <span
              aria-hidden
              className={`mt-[2px] flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-pill ${
                tone === "yes" ? "bg-tint-soft text-tint" : "bg-paper-2 text-steel"
              }`}
            >
              <Glyph size={14} weight="bold" />
            </span>
            <span>
              <strong className="font-semibold text-ink">{item.lead}</strong>
              {item.rest ? ` ${item.rest}` : ""}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
