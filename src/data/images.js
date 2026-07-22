function imageAsset(basePath, alt, width, height, options = {}) {
  return {
    basePath,
    alt,
    width,
    height,
    widths: options.widths ?? [640, 960, 1280, width],
    objectPosition: options.objectPosition ?? '50% 50%',
    isIllustrative: options.isIllustrative ?? true,
  }
}

const card = (name, alt, objectPosition) =>
  imageAsset(`/images/services/cards/${name}-card`, alt, 1440, 1080, { objectPosition })

const hero = (name, alt, objectPosition) =>
  imageAsset(`/images/services/heroes/${name}-hero`, alt, 1600, 900, { objectPosition })

export const serviceImages = {
  'emergency-plumbing': {
    card: card(
      'emergency-plumbing',
      'Emergency repair of a leaking pipe beneath a kitchen sink',
      '58% 50%'
    ),
    hero: hero(
      'emergency-plumbing',
      'Emergency repair of a burst appliance hose in a modern utility room',
      '62% 50%'
    ),
  },
  drainage: {
    card: card(
      'drainage',
      'Camera inspection of a residential drainage chamber',
      '52% 54%'
    ),
    hero: hero(
      'drainage',
      'Professional CCTV inspection of an underground residential drain',
      '48% 54%'
    ),
  },
  'blocked-drains': {
    card: card(
      'blocked-drains',
      'Professional clearance equipment beside a blocked kitchen sink',
      '50% 48%'
    ),
    hero: hero(
      'blocked-drains',
      'Blocked external gully with drain clearance equipment ready nearby',
      '50% 56%'
    ),
  },
  'leak-repairs': {
    card: card(
      'leak-repairs',
      'Close-up of a leaking copper compression joint and moisture detector',
      '50% 48%'
    ),
    hero: hero(
      'leak-repairs',
      'Hidden leaking pipe being traced beneath a timber floor',
      '56% 58%'
    ),
  },
  'drain-cleaning': {
    card: card(
      'drain-cleaning',
      'Professional high-pressure cleaning of an external residential drain',
      '50% 54%'
    ),
    hero: hero(
      'drain-cleaning',
      'Preventative cleaning of an indoor drainage access point',
      '48% 55%'
    ),
  },
  'toilet-repairs': {
    card: card(
      'toilet-repairs',
      'Modern toilet cistern open for a professional repair',
      '50% 48%'
    ),
    hero: hero(
      'toilet-repairs',
      'Concealed toilet cistern mechanism being professionally adjusted',
      '58% 50%'
    ),
  },
  'bathroom-plumbing': {
    card: card(
      'bathroom-plumbing',
      'Modern basin and shower installation with tidy pipework visible',
      '44% 50%'
    ),
    hero: hero(
      'bathroom-plumbing',
      'New bathroom plumbing installation being checked beneath a basin',
      '60% 54%'
    ),
  },
}

const project = (name, alt) =>
  imageAsset(`/images/projects/before-after/${name}`, alt, 1584, 990, {
    objectPosition: '50% 50%',
    isIllustrative: true,
  })

export const projectImages = {
  externalDrainClearance: {
    before: project(
      'external-drain-clearance-before',
      'External residential gully blocked by leaves and shallow rainwater'
    ),
    after: project(
      'external-drain-clearance-after',
      'The same external gully clear, clean and draining normally'
    ),
  },
  bathroomPipeworkRefresh: {
    before: project(
      'bathroom-pipework-refresh-before',
      'Ageing untidy pipework beneath a bathroom basin before replacement'
    ),
    after: project(
      'bathroom-pipework-refresh-after',
      'The same bathroom vanity with neat new pipework and a dry cabinet base'
    ),
  },
  hiddenLeakTraceRepair: {
    before: project(
      'hidden-leak-trace-repair-before',
      'Leaking compression joint beneath a kitchen sink before repair'
    ),
    after: project(
      'hidden-leak-trace-repair-after',
      'The same compression joint dry and secure after repair'
    ),
  },
}

const blog = (name, alt, objectPosition = '50% 50%') =>
  imageAsset(`/images/blog/${name}`, alt, 1600, 900, { objectPosition })

export const blogImages = {
  whatToDoBurstPipe: blog(
    'what-to-do-burst-pipe',
    'Controlled sink leak with a stopcock, towels and tools ready',
    '52% 54%'
  ),
  whyDrainsKeepBlocking: blog(
    'why-drains-keep-blocking',
    'Damaged drain section and camera equipment used to diagnose repeat blockages',
    '48% 52%'
  ),
  signsOfHiddenLeak: blog(
    'signs-of-hidden-leak',
    'Water meter and moisture detector beside an early damp mark',
    '54% 52%'
  ),
}

export const sharedImages = {
  homeHeroFallback: imageAsset(
    '/images/shared/home-hero-fallback',
    '',
    1600,
    900,
    { objectPosition: '62% 50%' }
  ),
  finalCta: imageAsset(
    '/images/shared/final-cta-background',
    '',
    1600,
    900,
    { objectPosition: '62% 50%' }
  ),
}
