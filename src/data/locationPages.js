// Dedicated location pages — strong, unique content for the six primary towns
// only (Contact.md: no thin auto-generated pages). Each page describes the
// AREA WE SERVE; none implies a local office or branch.

export const locationPages = [
  {
    slug: 'cambridge',
    town: 'Cambridge',
    title: 'Plumber in Cambridge',
    metaDescription:
      'Professional plumbing and drainage services across Cambridge — emergency plumbing, blocked drains, leak repairs and bathroom plumbing. Call 01223 482415.',
    intro:
      'Cambridge is our home patch. From Victorian terraces off Mill Road to new-build apartments in Eddington and student lets across the city, we work in Cambridge properties every week and know the quirks each era of housing brings.',
    localDetail:
      'Older Cambridge homes often combine original lead or iron pipework with decades of partial updates, which is where hidden leaks and pressure problems love to live. The city’s hard water also scales pipework and drains faster than most owners expect — regular drain cleaning genuinely pays for itself here. We cover the whole city, including Chesterton, Cherry Hinton, Trumpington, Arbury, Romsey and the surrounding villages.',
    commonJobs: [
      'Emergency leak and burst pipe response in the city',
      'Blocked drains in older terraced properties',
      'Limescale-related pressure and flow problems',
      'Bathroom plumbing for renovations and refits',
      'Landlord and letting-agent repairs for student properties',
    ],
    nearby: ['Cherry Hinton', 'Milton', 'Impington', 'Great Shelford', 'Fulbourn'],
  },
  {
    slug: 'ely',
    town: 'Ely',
    title: 'Plumber in Ely',
    metaDescription:
      'Reliable plumbing and drainage services in Ely and the surrounding Fenland villages — emergency call-outs, blocked drains and leak repairs. Call 01223 482415.',
    intro:
      'We regularly work across Ely and the surrounding Fenland villages, from period cottages near the cathedral to modern estates on the city’s growing edges.',
    localDetail:
      'Fenland ground conditions can be unkind to underground drainage — movement in the soil leads to displaced joints and back-falls that cause repeat blockages. If a drain in Ely keeps blocking, it usually deserves a proper look rather than another clearance. We also handle the full range of domestic plumbing, from running toilets to complete bathroom pipework.',
    commonJobs: [
      'Repeat drain blockage investigation',
      'Emergency plumbing response',
      'Leak tracing in period properties',
      'Toilet and cistern repairs',
      'Bathroom refit plumbing',
    ],
    nearby: ['Waterbeach', 'Cottenham', 'Newmarket'],
  },
  {
    slug: 'huntingdon',
    town: 'Huntingdon',
    title: 'Plumber in Huntingdon',
    metaDescription:
      'Plumbing and drainage services in Huntingdon, Godmanchester and nearby villages — emergencies, blocked drains, leaks and bathrooms. Call 01223 482415.',
    intro:
      'Huntingdon, Godmanchester and the villages along the A14 corridor are firmly inside our service area, and we plan routes so travel time never becomes your problem.',
    localDetail:
      'The mix of 1960s–80s estates around Huntingdon brings its own patterns: original steel or early plastic pipework reaching end of life, ageing stopcocks that seize exactly when you need them, and bathroom plumbing from a previous era. We repair what’s repairable and tell you straight when replacement is the smarter spend.',
    commonJobs: [
      'Ageing pipework repairs and replacement',
      'Seized stopcock and valve replacement',
      'Blocked drains and slow-running waste',
      'Emergency leak response',
      'Bathroom modernisation plumbing',
    ],
    nearby: ['St Neots', 'Cambourne'],
  },
  {
    slug: 'newmarket',
    town: 'Newmarket',
    title: 'Plumber in Newmarket',
    metaDescription:
      'Plumbing and drainage services in Newmarket and the CB8 area — emergency plumbing, blocked drains, leak detection and repairs. Call 01223 482415.',
    intro:
      'We cover Newmarket and the wider CB8 area, serving homes, rental properties and small businesses across the town.',
    localDetail:
      'Newmarket’s housing runs from Victorian terraces near the town centre to large modern developments, and its very hard water is a common thread — scale shortens the life of valves, restricts showers and narrows old pipework. We deal with the symptoms and advise honestly on prevention.',
    commonJobs: [
      'Hard-water scale and pressure problems',
      'Blocked drains and gullies',
      'Emergency plumbing call-outs',
      'Tap, shower and valve replacement',
      'Leak detection and repair',
    ],
    nearby: ['Fulbourn', 'Ely', 'Haverhill'],
  },
  {
    slug: 'haverhill',
    town: 'Haverhill',
    title: 'Plumber in Haverhill',
    metaDescription:
      'Plumbing and drainage services in Haverhill and the CB9 area — emergencies, blocked drains, toilet repairs and bathroom plumbing. Call 01223 482415.',
    intro:
      'Haverhill and the CB9 area sit comfortably within our coverage, and we support a growing base of homeowners and landlords across the town.',
    localDetail:
      'Much of Haverhill grew quickly in the 1960s and 70s, and plumbing of that generation is now well past its design life — we see a steady run of failing gate valves, tired cisterns and waste runs laid with optimistic falls. We modernise the failure points without selling you work you don’t need.',
    commonJobs: [
      'Replacing end-of-life valves and fittings',
      'Toilet and cistern repairs',
      'Blocked drains and slow wastes',
      'Emergency leak response',
      'Bathroom plumbing upgrades',
    ],
    nearby: ['Sawston', 'Great Shelford', 'Newmarket'],
  },
  {
    slug: 'st-neots',
    town: 'St Neots',
    title: 'Plumber in St Neots',
    metaDescription:
      'Plumbing and drainage services in St Neots and the PE19 area — emergency plumbing, blocked drains, leak repairs and more. Call 01223 482415.',
    intro:
      'St Neots and the PE19 area — including Eynesbury, Eaton Ford and Eaton Socon — are part of our regular patch, with the fast-growing developments east of the river adding new homes every year.',
    localDetail:
      'New-build plumbing brings its own issues: plastic push-fit systems are reliable but unforgiving of rushed installation, and we’re often called to weeping joints, poorly clipped pipework and builder-grade fittings failing early. We also serve the town’s established streets with the full range of drainage and repair work.',
    commonJobs: [
      'New-build plumbing snags and push-fit failures',
      'Emergency leak response',
      'Blocked drains and external gullies',
      'Tap, shower and toilet repairs',
      'Bathroom refit plumbing',
    ],
    nearby: ['Cambourne', 'Huntingdon'],
  },
]

export function getLocationBySlug(slug) {
  return locationPages.find((l) => l.slug === slug)
}
