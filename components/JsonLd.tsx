// One place that turns a structured-data object into a <script type="application/ld+json">.
//
// JSON.stringify happily passes the two characters "</" straight through, so a string in the
// data that contained "</script>" would end the element early and put the rest of the graph
// into the document as markup. Escaping "<" as its < escape is valid JSON, valid
// JSON-LD, and impossible to close a script tag with. lib/gtag.ts does the same thing to the
// inline Google tag for the same reason; the two are deliberately separate so neither file
// has to import the other.
//
// Server component on purpose: schema belongs in the served HTML, not in a hydration payload.
export default function JsonLd({ data, id }: { data: unknown; id?: string }) {
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
