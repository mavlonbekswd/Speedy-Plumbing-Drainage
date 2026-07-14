import { BadgePoundSterling, MapPin, MessageSquare, Sparkles, Home, Wrench } from 'lucide-react'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'

const blocks = [
  {
    icon: MessageSquare,
    title: 'Fast communication',
    text: 'A real person answers, tells you honestly when we can attend, and keeps you informed until the job is done.',
    span: 'md:col-span-3',
  },
  {
    icon: BadgePoundSterling,
    title: 'Clear pricing',
    text: 'Costs agreed before work starts. No hidden extras, no surprises on the invoice.',
    span: 'md:col-span-3',
  },
  {
    icon: MapPin,
    title: 'Local service',
    text: 'Based in the Cambridge area and serving the towns and villages around it — short travel, local knowledge.',
    span: 'md:col-span-2',
  },
  {
    icon: Home,
    title: 'Respectful work',
    text: 'Dust sheets, tidy habits and consideration for your home from arrival to handshake.',
    span: 'md:col-span-2',
  },
  {
    icon: Wrench,
    title: 'Professional equipment',
    text: 'The right professional tools for diagnosis and repair — jobs done properly, first time.',
    span: 'md:col-span-2',
  },
  {
    icon: Sparkles,
    title: 'Clean finish',
    text: 'Every job ends with the area cleaned and the system tested in front of you.',
    span: 'md:col-span-6',
  },
]

/**
 * Asymmetric trust grid — deliberately not a row of small icon cards.
 */
export default function WhyUs() {
  return (
    <section className="bg-charcoal px-5 py-28 md:px-8 md:py-40" aria-labelledby="why-heading">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Why choose us"
          title={<span id="why-heading">Small team. High standard.</span>}
        />

        <div className="mt-16 grid gap-4 md:grid-cols-6">
          {blocks.map((block, i) => (
            <Reveal key={block.title} delay={0.05 * i} className={block.span}>
              <div className="group h-full rounded-sm border border-white/10 bg-ink p-8 transition-colors duration-300 hover:border-electric/40 md:p-10">
                <block.icon className="size-7 text-electric" aria-hidden="true" />
                <h3 className="display-md mt-5 text-white">{block.title}</h3>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-steel">{block.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
