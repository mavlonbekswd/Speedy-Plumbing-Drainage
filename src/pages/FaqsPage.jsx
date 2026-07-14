import { useState } from 'react'
import { ChevronDown, Phone } from 'lucide-react'
import Seo from '../lib/seo'
import { breadcrumbSchema, faqSchema } from '../lib/schema'
import { businessConfig } from '../data/business'
import { faqs } from '../data/faqs'
import PageHero from '../components/layout/PageHero'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'

function FaqItem({ faq, index, open, onToggle }) {
  const panelId = `faq-panel-${index}`
  const buttonId = `faq-button-${index}`
  return (
    <div className="border-b border-charcoal/10">
      <h2>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span className="text-lg font-semibold text-charcoal md:text-xl">{faq.q}</span>
          <ChevronDown
            className={`size-5 shrink-0 text-blue transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
      </h2>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!open}
        className="pb-7"
      >
        <p className="max-w-3xl text-base leading-relaxed text-steel-dark">{faq.a}</p>
      </div>
    </div>
  )
}

export default function FaqsPage() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <>
      <Seo
        title="FAQs — Plumbing & Drainage Questions"
        description="Answers to common plumbing and drainage questions — coverage areas, emergencies, pricing, recurring blockages and how to get a quote."
        path="/faqs"
        jsonLd={[faqSchema(faqs), breadcrumbSchema([{ name: 'FAQs', path: '/faqs' }])]}
      />

      <PageHero
        eyebrow="FAQs"
        title="Questions we hear every week."
        intro="Straight answers to the things customers most often ask — before, during and after a job."
        crumbs={[{ name: 'FAQs', path: '/faqs' }]}
      />

      <section className="bg-mist px-5 py-24 text-charcoal md:px-8 md:py-32">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <div>
              {faqs.map((faq, i) => (
                <FaqItem
                  key={faq.q}
                  faq={faq}
                  index={i}
                  open={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                />
              ))}
            </div>
          </Reveal>

          <Reveal className="mt-16">
            <div className="flex flex-col items-start gap-5 rounded-sm bg-charcoal p-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="display-md text-white">Still unsure?</p>
                <p className="mt-2 text-steel">Ask us directly — it costs nothing to check.</p>
              </div>
              <Button href={businessConfig.phoneHref} icon={Phone} size="lg">
                {businessConfig.phoneDisplay}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
