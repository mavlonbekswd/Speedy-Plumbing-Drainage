// Confirmed service areas (Contact.md). These are AREAS SERVED, not offices or
// branches — never present them as physical locations.

export const serviceAreas = [
  { name: 'Cambridge', displayName: 'Cambridge, UK', slug: 'cambridge' },
  { name: 'Ely', displayName: 'Ely, UK', slug: 'ely' },
  { name: 'Huntingdon', displayName: 'Huntingdon, UK', slug: 'huntingdon' },
  { name: 'Royston', displayName: 'Royston, SG8', slug: 'royston' },
  { name: 'Haverhill', displayName: 'Haverhill, CB9', slug: 'haverhill' },
  { name: 'Newmarket', displayName: 'Newmarket, CB8', slug: 'newmarket' },
  { name: 'Milton', displayName: 'Milton, Cambridge', slug: 'milton' },
  { name: 'Fulbourn', displayName: 'Fulbourn, Cambridge', slug: 'fulbourn' },
  { name: 'Cottenham', displayName: 'Cottenham, Cambridge', slug: 'cottenham' },
  { name: 'Impington', displayName: 'Impington, Cambridge', slug: 'impington' },
  { name: 'Waterbeach', displayName: 'Waterbeach, Cambridge', slug: 'waterbeach' },
  { name: 'Sawston', displayName: 'Sawston, CB22', slug: 'sawston' },
  { name: 'St Neots', displayName: 'St Neots, PE19', slug: 'st-neots' },
  { name: 'Cambourne', displayName: 'Cambourne, CB23', slug: 'cambourne' },
  { name: 'Great Shelford', displayName: 'Great Shelford, Cambridge', slug: 'great-shelford' },
  { name: 'Cherry Hinton', displayName: 'Cherry Hinton, CB1', slug: 'cherry-hinton' },
  { name: 'Little Shelford', displayName: 'Little Shelford, CB22 5HL', slug: 'little-shelford' },
]

// Logical grouping for the Areas We Cover page (Contact.md).
export const areaGroups = [
  {
    title: 'Cambridge',
    slugs: [
      'cambridge',
      'cherry-hinton',
      'milton',
      'fulbourn',
      'cottenham',
      'impington',
      'waterbeach',
      'great-shelford',
      'little-shelford',
    ],
  },
  {
    title: 'South and West Cambridgeshire',
    slugs: ['sawston', 'cambourne', 'royston'],
  },
  {
    title: 'Surrounding Towns',
    slugs: ['ely', 'huntingdon', 'newmarket', 'haverhill', 'st-neots'],
  },
]

// Key areas shown in the footer (full list lives on /areas-we-cover).
export const footerAreaSlugs = ['cambridge', 'ely', 'huntingdon', 'newmarket', 'haverhill', 'st-neots']

// Areas with dedicated location pages (strong unique content only — no thin
// auto-generated pages).
export const locationPageSlugs = ['cambridge', 'ely', 'huntingdon', 'newmarket', 'haverhill', 'st-neots']

// FRONTEND DEMONSTRATION ONLY: rough postcode-district prefixes used by the
// postcode checker until a real coverage API is connected. An unmatched
// postcode is never told "not covered" — it is asked to call and confirm.
export const coveredPostcodeDistricts = [
  'CB1', 'CB2', 'CB3', 'CB4', 'CB5', // Cambridge city
  'CB6', 'CB7', // Ely area
  'CB8', // Newmarket
  'CB9', // Haverhill
  'CB21', 'CB22', 'CB23', 'CB24', 'CB25', // South/West Cambs villages
  'SG8', // Royston
  'PE19', // St Neots
  'PE26', 'PE28', 'PE29', // Huntingdon area
]

// ---------------------------------------------------------------------------
// Interactive coverage network (Areas We Cover page)
//
// A stylised spider-web — NOT a geographical map. Coordinates live in the
// SVG's 1000×700 viewBox so the network scales responsively. `relatedAreas`
// are the controlled connections drawn when a node is active (the hub
// additionally connects to everything). `districts` are the confirmed
// postcode districts each node represents — used to highlight nodes from the
// postcode checker. Never present these as offices or branches.
// ---------------------------------------------------------------------------

export const areaNetwork = [
  // Hub label sits to the right so it never collides with the village
  // cluster's labels directly above.
  { id: 'cambridge', name: 'Cambridge', type: 'hub', x: 500, y: 370, relatedAreas: [], districts: ['CB1', 'CB2', 'CB3', 'CB4', 'CB5'], labelDx: 26, labelDy: 8, labelAnchor: 'start' },

  // Main towns
  { id: 'ely', name: 'Ely', type: 'town', x: 640, y: 120, relatedAreas: ['cambridge', 'waterbeach', 'cottenham'], districts: ['CB6', 'CB7'] },
  { id: 'huntingdon', name: 'Huntingdon', type: 'town', x: 165, y: 175, relatedAreas: ['cambridge', 'st-neots', 'cambourne'], districts: ['PE26', 'PE28', 'PE29'] },
  { id: 'newmarket', name: 'Newmarket', type: 'town', x: 835, y: 295, relatedAreas: ['cambridge', 'fulbourn', 'haverhill'], districts: ['CB8'] },
  { id: 'st-neots', name: 'St Neots', type: 'town', x: 115, y: 390, relatedAreas: ['cambridge', 'huntingdon', 'cambourne'], districts: ['PE19'] },
  { id: 'haverhill', name: 'Haverhill', type: 'town', x: 775, y: 555, relatedAreas: ['cambridge', 'newmarket', 'fulbourn'], districts: ['CB9'] },
  { id: 'royston', name: 'Royston', type: 'town', x: 295, y: 600, relatedAreas: ['cambridge', 'sawston', 'great-shelford'], districts: ['SG8'] },

  // Surrounding villages — kept close to the hub, like real coverage
  { id: 'cottenham', name: 'Cottenham', type: 'village', x: 450, y: 240, relatedAreas: ['cambridge', 'impington', 'ely'], districts: ['CB24'] },
  { id: 'waterbeach', name: 'Waterbeach', type: 'village', x: 575, y: 250, relatedAreas: ['cambridge', 'milton', 'ely'], districts: ['CB25'] },
  { id: 'impington', name: 'Impington', type: 'village', x: 448, y: 318, relatedAreas: ['cambridge', 'milton', 'cottenham'], districts: ['CB24'] },
  { id: 'milton', name: 'Milton', type: 'village', x: 548, y: 312, relatedAreas: ['cambridge', 'impington', 'waterbeach'], districts: ['CB24'] },
  { id: 'cambourne', name: 'Cambourne', type: 'village', x: 285, y: 355, relatedAreas: ['cambridge', 'st-neots', 'huntingdon'], districts: ['CB23'] },
  { id: 'fulbourn', name: 'Fulbourn', type: 'village', x: 630, y: 400, relatedAreas: ['cambridge', 'cherry-hinton', 'newmarket'], districts: ['CB21'] },
  { id: 'cherry-hinton', name: 'Cherry Hinton', type: 'village', x: 560, y: 432, relatedAreas: ['cambridge', 'fulbourn', 'great-shelford'], districts: ['CB1'] },
  { id: 'great-shelford', name: 'Great Shelford', type: 'village', x: 498, y: 478, relatedAreas: ['cambridge', 'little-shelford', 'sawston'], districts: ['CB22'] },
  { id: 'little-shelford', name: 'Little Shelford', type: 'village', x: 448, y: 512, relatedAreas: ['cambridge', 'great-shelford', 'sawston'], districts: ['CB22'] },
  { id: 'sawston', name: 'Sawston', type: 'village', x: 552, y: 545, relatedAreas: ['cambridge', 'great-shelford', 'royston'], districts: ['CB22'] },
]

export function getNetworkArea(id) {
  return areaNetwork.find((a) => a.id === id)
}

/** district (e.g. "CB8") → array of network area ids it maps to. */
export const districtToAreaIds = areaNetwork.reduce((acc, area) => {
  for (const d of area.districts) {
    if (!acc[d]) acc[d] = []
    acc[d].push(area.id)
  }
  return acc
}, {})

export function getAreaBySlug(slug) {
  return serviceAreas.find((a) => a.slug === slug)
}

export function areaNamesSentence() {
  return 'Cambridge, Ely, Huntingdon, Newmarket, St Neots, Haverhill and surrounding communities'
}
