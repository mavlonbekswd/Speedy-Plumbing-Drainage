import { Droplets, Gauge, CircleSlash } from 'lucide-react'
import Reveal from '../ui/Reveal'

const problems = [
  {
    icon: Droplets,
    word: 'Leaks.',
    text: 'Water travels far from its source. We trace every leak back to where it actually starts — then stop it for good.',
  },
  {
    icon: CircleSlash,
    word: 'Blockages.',
    text: 'A drain that keeps blocking has an underlying cause. We clear the blockage and diagnose why it happened.',
  },
  {
    icon: Gauge,
    word: 'Low Pressure.',
    text: 'Weak showers and slow-filling tanks point to hidden restrictions. We find them and restore full flow.',
  },
]

/**
 * Editorial problem introduction — rendered over the continuing 3D pipe
 * journey, so each problem lands as the camera approaches the blockage.
 */
export default function ProblemIntro() {
  return (
    <section className="relative px-5 py-32 md:px-8 md:py-44" aria-labelledby="problem-heading">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="eyebrow text-electric">The problems we end</p>
        </Reveal>
        <h2 id="problem-heading" className="sr-only">
          Leaks. Blockages. Low pressure. We fix the problem at its source.
        </h2>

        <div className="mt-10 space-y-24 md:space-y-36">
          {problems.map((p, i) => (
            <Reveal key={p.word} delay={0.05} className={i % 2 === 1 ? 'md:ml-[20%]' : ''}>
              <div className="max-w-3xl rounded-sm bg-charcoal/55 p-6 backdrop-blur-sm md:p-8">
                <p.icon className="mb-4 size-7 text-electric" aria-hidden="true" />
                <p className="display-xl text-white" aria-hidden="true">
                  {p.word}
                </p>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-mist/85">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-24 md:mt-36 md:text-right">
          <p className="display-lg text-white">
            We fix the problem <span className="text-electric">at its source.</span>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
