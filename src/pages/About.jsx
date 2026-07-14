import { BadgePoundSterling, MapPin, Phone, Sparkles, Wrench } from 'lucide-react'
import Seo from '../lib/seo'
import { breadcrumbSchema, plumberSchema } from '../lib/schema'
import { businessConfig } from '../data/business'
import PageHero from '../components/layout/PageHero'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'

const values = [
  {
    icon: Wrench,
    title: 'Fix it properly',
    text: 'A repair that lasts beats a patch that doesn’t. We diagnose the cause, explain it plainly, and fix what actually failed.',
  },
  {
    icon: BadgePoundSterling,
    title: 'Price it honestly',
    text: 'Costs agreed before work starts. If we find something unexpected, we stop and talk to you before it changes the bill.',
  },
  {
    icon: MapPin,
    title: 'Stay local',
    text: 'We serve Cambridge and the towns and villages around it — close enough to come back quickly if you ever need us again.',
  },
  {
    icon: Sparkles,
    title: 'Leave it clean',
    text: 'Dust sheets down, mess cleared, systems tested in front of you. Your home is treated like it matters — because it does.',
  },
]

export default function About() {
  return (
    <>
      <Seo
        title="About Us"
        description="Speedy Plumbing & Drain is a local plumbing and drainage team serving Cambridge and surrounding areas — honest pricing, professional equipment and a clean finish on every job."
        path="/about"
        jsonLd={[plumberSchema(), breadcrumbSchema([{ name: 'About', path: '/about' }])]}
      />

      <PageHero
        eyebrow="About us"
        title="A local team that treats your home like its reputation depends on it."
        intro="Because it does. Speedy Plumbing & Drain is built on the jobs we’ve already done — every repair, clearance and installation across the Cambridge area is a reference for the next one."
        crumbs={[{ name: 'About', path: '/about' }]}
      />

      <section className="bg-mist px-5 py-24 text-charcoal md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="How we work"
            title="Four rules on every job."
            dark={false}
          />
          <div className="mt-16 grid gap-4 md:grid-cols-2">
            {values.map((value, i) => (
              <Reveal key={value.title} delay={0.06 * i}>
                <div className="h-full rounded-sm border border-charcoal/10 bg-white p-8 md:p-10">
                  <value.icon className="size-7 text-blue" aria-hidden="true" />
                  <h2 className="display-md mt-5">{value.title}</h2>
                  <p className="mt-4 text-base leading-relaxed text-steel-dark">{value.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-charcoal px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <h2 className="display-lg text-white">
                Straightforward people. <span className="text-electric">Straightforward plumbing.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <p className="text-lg leading-relaxed text-steel">
                  We keep it simple: answer the phone, turn up when we say we will, fix the problem at
                  its source, and leave the place clean. If a job needs a specialist we don’t pretend
                  otherwise — we tell you straight and point you in the right direction.
                </p>
                <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                  <Button href={businessConfig.phoneHref} icon={Phone} size="lg">
                    Call {businessConfig.phoneDisplay}
                  </Button>
                  <Button to="/quote" variant="outline" size="lg">
                    Request a Quote
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
