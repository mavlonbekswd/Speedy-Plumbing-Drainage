import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ClipboardList, MessageSquare, Search, SprayCan, ThumbsUp, Wrench } from 'lucide-react'
import { usePrefersReducedMotion } from '../../lib/hooks'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    icon: MessageSquare,
    title: 'You report the issue',
    text: 'Call, email or send a quote request. Photos help — we start diagnosing before we arrive.',
  },
  {
    icon: Search,
    title: 'We inspect the problem',
    text: 'A proper look at the symptom and the system around it, not a glance and a guess.',
  },
  {
    icon: ClipboardList,
    title: 'The cause is identified',
    text: 'You get a plain-English explanation of what failed, why, and what fixing it involves.',
  },
  {
    icon: Wrench,
    title: 'The repair is completed',
    text: 'Professional equipment, quality parts, and a repair designed to last — agreed before we start.',
  },
  {
    icon: SprayCan,
    title: 'The area is cleaned',
    text: 'Dust sheets down, mess cleared, everything wiped — your home left the way we found it.',
  },
  {
    icon: ThumbsUp,
    title: 'You get clear guidance',
    text: 'What we did, what to watch for, and honest advice on preventing the problem coming back.',
  },
]

/**
 * The single pinned section on the site: a scroll-scrubbed walkthrough of a
 * job from first contact to clean finish. Under reduced motion it renders as
 * a static, fully readable list.
 */
export default function ProcessStory() {
  const sectionRef = useRef(null)
  const reduced = usePrefersReducedMotion()

  // useLayoutEffect (not useEffect): pinning re-parents this section into a
  // GSAP pin-spacer. Layout-effect cleanup runs BEFORE React detaches DOM on
  // unmount, so ctx.revert() restores the original tree in time — with
  // useEffect the cleanup runs too late and React crashes with removeChild
  // NotFoundError when navigating away mid-scroll.
  useLayoutEffect(() => {
    if (reduced) return undefined
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.process-step')
      const dots = gsap.utils.toArray('.process-dot')
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${items.length * 55}%`,
          scrub: 0.6,
          pin: true,
        },
      })
      items.forEach((item, i) => {
        tl.fromTo(item, { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, duration: 1 })
        tl.to(dots[i], { backgroundColor: '#38bdf8', scale: 1.4, duration: 0.3 }, '<')
        if (i < items.length - 1) {
          tl.to(item, { autoAlpha: 0, y: -70, duration: 1 }, '+=0.6')
        }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [reduced])

  if (reduced) {
    return (
      <section className="bg-navy-deep px-5 py-28 md:px-8" aria-labelledby="process-heading">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow text-electric">How a job runs</p>
          <h2 id="process-heading" className="display-xl mt-5 text-white">
            From first call to clean finish.
          </h2>
          <ol className="mt-14 grid gap-10 md:grid-cols-2">
            {steps.map((step, i) => (
              <li key={step.title} className="rounded-sm border border-white/10 p-7">
                <step.icon className="size-6 text-electric" aria-hidden="true" />
                <h3 className="display-md mt-4 text-white">
                  {i + 1}. {step.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-steel">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      className="grain relative flex h-screen flex-col justify-center overflow-hidden bg-navy-deep px-5 md:px-8"
      aria-labelledby="process-heading"
    >
      <div className="mx-auto w-full max-w-7xl">
        <p className="eyebrow text-electric">How a job runs</p>
        <h2 id="process-heading" className="display-xl mt-4 max-w-3xl text-white">
          From first call to clean finish.
        </h2>

        <div className="relative mt-14 min-h-64 md:mt-20 md:min-h-56">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="process-step absolute inset-x-0 top-0 opacity-0"
              style={{ visibility: 'hidden' }}
            >
              <div className="flex max-w-3xl items-start gap-6">
                <span
                  className="font-display text-7xl leading-none text-white/15 md:text-9xl"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="pt-2 md:pt-5">
                  <step.icon className="size-7 text-electric" aria-hidden="true" />
                  <h3 className="display-md mt-3 text-white">{step.title}</h3>
                  <p className="mt-4 max-w-lg text-lg leading-relaxed text-steel">{step.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress dots */}
        <div className="mt-10 flex gap-3" aria-hidden="true">
          {steps.map((step) => (
            <span key={step.title} className="process-dot size-2 rounded-full bg-white/20" />
          ))}
        </div>
      </div>
    </section>
  )
}
