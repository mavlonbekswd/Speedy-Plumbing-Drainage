import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Mail, MessageCircle, Phone } from 'lucide-react'
import { businessConfig } from '../../data/business'
import { sharedImages } from '../../data/images'
import { usePrefersReducedMotion } from '../../lib/hooks'
import Button from '../ui/Button'
import Reveal from '../ui/Reveal'
import ResponsiveImage from '../ui/ResponsiveImage'

gsap.registerPlugin(ScrollTrigger)

export default function FinalCTA() {
  const sectionRef = useRef(null)
  const bgRef = useRef(null)
  const reduced = usePrefersReducedMotion()

  // Slow cinematic zoom on the background while the section scrolls through.
  // Layout effect so ScrollTrigger cleanup precedes React DOM removal.
  useLayoutEffect(() => {
    if (reduced) return undefined
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bgRef.current,
        { scale: 1.15 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden px-5 py-28 md:px-8"
      aria-labelledby="finalcta-heading"
    >
      <div
        ref={bgRef}
        className="absolute inset-0"
        aria-hidden="true"
      >
        <ResponsiveImage
          image={sharedImages.finalCta}
          alt=""
          sizes="100vw"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-charcoal/70" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-7xl text-center">
        <Reveal>
          <p className="eyebrow text-electric">{businessConfig.serviceRegion}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 id="finalcta-heading" className="display-hero mt-6 text-white">
            Need a plumber <span className="text-electric">today?</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-xl text-lg text-mist/85">
            {businessConfig.emergencyNote}
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href={businessConfig.phoneHref} size="lg" icon={Phone}>
              Call {businessConfig.phoneDisplay}
            </Button>
            {businessConfig.whatsappHref && (
              <Button
                href={businessConfig.whatsappHref}
                variant="outline"
                size="lg"
                icon={MessageCircle}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </Button>
            )}
            <Button href={businessConfig.emailHref} variant="outline" size="lg" icon={Mail}>
              Email Us
            </Button>
            <Button to="/quote" variant="light" size="lg">
              Request a Quote
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <a
            href={businessConfig.phoneHref}
            className="font-display mt-14 inline-block text-4xl text-white/90 transition-colors hover:text-electric sm:text-6xl"
          >
            {businessConfig.phoneDisplay}
          </a>
        </Reveal>
      </div>
    </section>
  )
}
