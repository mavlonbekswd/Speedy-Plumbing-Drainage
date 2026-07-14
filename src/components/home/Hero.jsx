import { motion, useReducedMotion } from 'framer-motion'
import { ChevronDown, MapPin, Phone } from 'lucide-react'
import { businessConfig } from '../../data/business'
import Button from '../ui/Button'

export default function Hero() {
  const reduced = useReducedMotion()

  const fadeUp = (delay) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 40 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
        }

  return (
    <section className="relative flex min-h-screen flex-col justify-end px-5 pb-24 md:px-8 lg:justify-center lg:pb-0">
      {/* Readability overlay above the 3D scene */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-charcoal/55 via-transparent to-charcoal/70" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-7xl">
        <motion.div {...fadeUp(0.1)} className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="flex items-center gap-2 text-sm font-medium text-mist/85">
            <MapPin className="size-4 text-electric" aria-hidden="true" />
            Cambridge &amp; surrounding areas
          </span>
          <span className="flex items-center gap-2 text-sm font-medium text-mist/85">
            <span className="relative flex size-2.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric opacity-60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-electric" />
            </span>
            {businessConfig.emergencyNote}
          </span>
        </motion.div>

        <motion.h1 {...fadeUp(0.25)} className="display-hero max-w-6xl text-white">
          Plumbing Problems
          <br />
          <span className="text-electric">Don’t Wait.</span>
        </motion.h1>

        <motion.p {...fadeUp(0.45)} className="mt-7 max-w-xl text-lg leading-relaxed text-mist/85 md:text-xl">
          Fast, professional plumbing and drainage services across Cambridge.
        </motion.p>

        <motion.div {...fadeUp(0.6)} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button href={businessConfig.phoneHref} icon={Phone} size="lg">
            Call Now — {businessConfig.phoneDisplay}
          </Button>
          <Button to="/quote" variant="outline" size="lg">
            Get a Quote
          </Button>
        </motion.div>

        <motion.p {...fadeUp(0.75)} className="mt-8 text-sm text-steel">
          Trusted local team · Clear pricing before work starts · Respectful, clean workmanship
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        {...(reduced
          ? {}
          : {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 1.4, duration: 1 },
            })}
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-steel lg:flex"
        aria-hidden="true"
      >
        <span className="text-[10px] font-semibold tracking-[0.3em] uppercase">Scroll</span>
        <ChevronDown className={`size-4 ${reduced ? '' : 'animate-bounce'}`} />
      </motion.div>
    </section>
  )
}
