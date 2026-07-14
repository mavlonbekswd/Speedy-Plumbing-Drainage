import { AlertTriangle, Phone } from 'lucide-react'
import { businessConfig } from '../../data/business'
import Button from '../ui/Button'
import Reveal from '../ui/Reveal'

const handled = [
  'Burst and leaking pipes',
  'Uncontrollable water flow',
  'Blocked toilets and drains',
  'Failed stopcocks and valves',
  'Overflowing cisterns and appliances',
]

const instructions = [
  'Turn off the water at your internal stopcock — usually under the kitchen sink.',
  'Open cold taps to drain the system and drop the pressure.',
  'Switch off electrics near any water.',
  'Call us and describe exactly what you can see.',
]

/**
 * The one place on the site that uses warm amber — reserved for emergencies.
 */
export default function EmergencySection() {
  return (
    <section
      className="grain relative overflow-hidden bg-charcoal px-5 py-28 md:px-8 md:py-40"
      aria-labelledby="emergency-heading"
    >
      {/* Amber hazard glow */}
      <div
        className="pointer-events-none absolute -top-32 right-0 size-[34rem] rounded-full bg-amber/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <p className="eyebrow flex items-center gap-2 text-amber">
            <AlertTriangle className="size-4" aria-hidden="true" />
            Emergency plumbing
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 id="emergency-heading" className="display-xl mt-5 max-w-4xl text-white">
            When water won’t stop, <span className="text-amber">neither do we.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-3">
          <Reveal delay={0.1}>
            <div>
              <h3 className="eyebrow text-steel">Problems we handle</h3>
              <ul className="mt-5 space-y-3">
                {handled.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-base text-mist/85">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-amber" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <div>
              <h3 className="eyebrow text-steel">While you wait</h3>
              <ol className="mt-5 space-y-3">
                {instructions.map((step, i) => (
                  <li key={step} className="flex items-start gap-3 text-base text-mist/85">
                    <span className="font-display mt-0.5 text-amber" aria-hidden="true">
                      {i + 1}.
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={0.26}>
            <div className="flex flex-col justify-between rounded-sm border border-amber/25 bg-ink p-8">
              <div>
                <p className="text-sm text-steel">Emergency line — Cambridge &amp; surrounding areas</p>
                <a
                  href={businessConfig.phoneHref}
                  className="font-display mt-3 block text-4xl text-white transition-colors hover:text-amber sm:text-5xl"
                >
                  {businessConfig.phoneDisplay}
                </a>
                <p className="mt-4 text-sm leading-relaxed text-steel">{businessConfig.emergencyNote}</p>
              </div>
              <Button href={businessConfig.phoneHref} variant="emergency" size="lg" icon={Phone} className="mt-8 w-full">
                Call Now
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
