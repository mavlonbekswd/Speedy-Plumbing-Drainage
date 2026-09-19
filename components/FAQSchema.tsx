import type { Faq } from "@/lib/types";

// FAQPage JSON-LD for a service or town page. Emitted only where the same questions and answers
// are visible in the page's own HTML, which is what the structured-data guidelines require.
//
// "<" is escaped so a stray angle bracket inside an answer can never close the script element
// early. JSON.stringify leaves it alone, so the replacement is done here.
export default function FAQSchema({ faqs }: { faqs: readonly Faq[] }) {
  if (faqs.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
    />
  );
}
