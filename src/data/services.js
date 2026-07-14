// All services, used by the homepage showcase, the services index and the
// individual service pages. Images are cinematic SVG placeholders — replace
// with real photography (see README.md).

export const services = [
  {
    slug: 'emergency-plumbing',
    name: 'Emergency Plumbing',
    icon: 'Siren',
    emergency: true,
    short: 'Burst pipes, major leaks and urgent failures handled fast across Cambridge.',
    heroLine: 'When water won’t stop, speed is everything.',
    image: '/images/emergency.svg',
    imageAlt: 'Dark industrial pipework under emergency lighting',
    description:
      'A burst pipe or uncontrollable leak can damage a home in minutes. Our emergency plumbing service prioritises rapid response across Cambridge and the surrounding areas: we isolate the problem, make it safe, and complete a lasting repair — not just a patch.',
    points: [
      'Burst and leaking pipes',
      'Uncontrollable water flow',
      'Failed stopcocks and valves',
      'Overflowing appliances and cisterns',
      'Emergency isolation and make-safe',
      'Permanent repair after the emergency is controlled',
    ],
    steps: [
      'Call us and describe the problem — we’ll talk you through turning off the water if needed.',
      'We confirm availability and travel time honestly before anything else.',
      'On arrival we isolate, diagnose and repair, then test the system properly.',
    ],
  },
  {
    slug: 'drainage',
    name: 'Drainage',
    icon: 'Waves',
    short: 'Complete drainage services — from slow drains to full system faults.',
    heroLine: 'Drainage problems, fixed at the source.',
    image: '/images/drainage.svg',
    imageAlt: 'Underground drainage channel with flowing water',
    description:
      'Drainage faults rarely fix themselves. We investigate the whole run — not just the visible symptom — to find where the system is failing, then clear, repair or advise on the right long-term fix for your property.',
    points: [
      'Slow-draining sinks, baths and showers',
      'Gully and outside drain problems',
      'Recurring blockages and bad smells',
      'Drainage inspections and diagnosis',
      'Advice on damaged or poorly laid drains',
    ],
    steps: [
      'Tell us the symptoms — where, how often, and how long it has been happening.',
      'We inspect the run to locate the actual cause.',
      'We clear or repair, then confirm the system flows correctly.',
    ],
  },
  {
    slug: 'blocked-drains',
    name: 'Blocked Drains',
    icon: 'CircleSlash',
    short: 'Fast clearance of blocked sinks, toilets, showers and outside drains.',
    heroLine: 'Blocked today. Cleared today.',
    image: '/images/blocked-drain.svg',
    imageAlt: 'Blocked pipe section before clearance',
    description:
      'From a single blocked sink to a backed-up external drain, we clear blockages properly and check the flow afterwards so the problem doesn’t come straight back. If a blockage keeps returning, we find out why.',
    points: [
      'Blocked kitchen and bathroom sinks',
      'Blocked toilets and showers',
      'External and boundary drain blockages',
      'Recurring blockage investigation',
      'Flow testing after every clearance',
    ],
    steps: [
      'Call or send a quote request with a photo if it’s safe to take one.',
      'We clear the blockage with professional equipment.',
      'We test the flow and tell you plainly if there’s an underlying fault.',
    ],
  },
  {
    slug: 'leak-repairs',
    name: 'Leak Repairs',
    icon: 'Droplets',
    short: 'Finding and fixing leaks — visible or hidden — before they spread.',
    heroLine: 'Small leaks become big problems. We stop them early.',
    image: '/images/leak.svg',
    imageAlt: 'Water tracing along a copper pipe joint',
    description:
      'Water travels, so where a leak shows is often not where it starts. We trace leaks to their true source — under floors, behind walls, at hidden joints — and repair them with minimal disruption to your home.',
    points: [
      'Visible pipe and joint leaks',
      'Hidden leak detection and tracing',
      'Dripping overflows and running cisterns',
      'Pressure loss investigation',
      'Repairs with minimal disruption',
    ],
    steps: [
      'Describe what you can see — stains, drips, pressure drops or meter movement.',
      'We trace the leak to its actual source.',
      'We repair, retest the pressure and confirm it’s dry.',
    ],
  },
  {
    slug: 'drain-cleaning',
    name: 'Drain Cleaning',
    icon: 'SprayCan',
    short: 'Preventative cleaning that keeps drains flowing and smells away.',
    heroLine: 'Keep the flow. Skip the emergency.',
    image: '/images/drain-cleaning.svg',
    imageAlt: 'Clean stainless drain channel after maintenance',
    description:
      'Regular drain cleaning prevents the slow build-up of grease, scale and debris that ends in a blocked drain at the worst possible moment. Ideal for busy family homes, rental properties and commercial kitchens.',
    points: [
      'Preventative maintenance cleans',
      'Grease and scale removal',
      'Odour investigation and elimination',
      'Pre-purchase and landlord drain checks',
      'Scheduled maintenance for businesses',
    ],
    steps: [
      'Tell us about the property and any recurring symptoms.',
      'We clean and descale the run with the right equipment for the pipework.',
      'You get plain-English notes on the condition of your drains.',
    ],
  },
  {
    slug: 'toilet-repairs',
    name: 'Toilet Repairs',
    icon: 'Wrench',
    short: 'Running, leaking, weak-flushing or broken toilets repaired properly.',
    heroLine: 'One of the most used fixtures in your home — fixed right.',
    image: '/images/toilet.svg',
    imageAlt: 'Modern bathroom with wall-hung toilet',
    description:
      'A constantly running toilet wastes hundreds of litres a day; a leaking one can quietly damage floors. We repair fill valves, flush mechanisms, seals and pans — and tell you honestly when replacement beats repair.',
    points: [
      'Constantly running or noisy cisterns',
      'Weak or failing flushes',
      'Leaks at the base or connections',
      'Cracked cisterns and pans',
      'Replacement advice without upselling',
    ],
    steps: [
      'Describe the fault — running water, weak flush, visible leak.',
      'We repair or replace the failed component.',
      'We test repeatedly and leave the bathroom clean.',
    ],
  },
  {
    slug: 'bathroom-plumbing',
    name: 'Bathroom Plumbing',
    icon: 'ShowerHead',
    short: 'Taps, showers, wastes and full bathroom plumbing installations.',
    heroLine: 'Precision plumbing behind beautiful bathrooms.',
    image: '/images/bathroom.svg',
    imageAlt: 'Bright modern bathroom with walk-in shower',
    description:
      'From replacing a dripping tap to first-fix and final-fix plumbing for a full bathroom refit, we deliver neat, reliable pipework that installers and tilers can build on — and that keeps working long after the sealant dries.',
    points: [
      'Tap and shower replacement',
      'Waste and trap problems',
      'Bath, basin and toilet installation',
      'Full refit first- and final-fix plumbing',
      'Water pressure and flow improvements',
    ],
    steps: [
      'Share your plans or the fault — photos help.',
      'We quote clearly and agree the scope before work starts.',
      'We install, test and leave a clean finish.',
    ],
  },
]

// Six services featured on the homepage showcase (per instruction.md).
export const homepageServiceSlugs = [
  'emergency-plumbing',
  'blocked-drains',
  'leak-repairs',
  'drain-cleaning',
  'toilet-repairs',
  'bathroom-plumbing',
]

export function getServiceBySlug(slug) {
  return services.find((s) => s.slug === slug)
}
