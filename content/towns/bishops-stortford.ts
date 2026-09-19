import type { City } from "../../lib/types";

// Skeleton. slug, name, county, tier, postcodeDistricts and nearbyTowns are facts and are set.
// blurb, localNote, serviceNotes, nearbyAreas and sources are written by the town-copy unit,
// each place name verified against a source before it is written. `published` flips to true
// only when all of them are filled: lib/towns.ts asserts that pairing at import.
const bishopsStortford: City = {
  slug: "bishops-stortford",
  name: "Bishop's Stortford",
  county: "Hertfordshire",
  tier: 1,
  published: true,
  blurb:
    "We handle emergency plumbing, drains and booked repairs in Bishop's Stortford and the villages that share its two postcode districts.",
  metaTitle: "Emergency Plumber Bishop's Stortford | Drains and Leaks",
  nearbyTowns: ["saffron-walden", "braintree"],
  postcodeDistricts: ["CM22", "CM23"],
  nearbyAreas: [
    "Thorley",
    "Hockerill",
    "Silverleys",
    "Farnham",
    "Manuden",
    "Birchanger",
    "Little Hallingbury",
    "Great Hallingbury",
    "Hatfield Heath",
    "Sheering",
  ],
  localNote:
    "Bishop's Stortford is CM22 and CM23, with Hockerill east of the old town and Silverleys among its own wards. CM23 runs north to Farnham and Manuden, north-east to Birchanger, and holds Thorley immediately south of the town. CM22 is the ground south and south-east: Little Hallingbury, Great Hallingbury and Sheering. The A120 runs east to west along the northern edge, the M11 lies east of the town, and the B1383 leads to Stansted Mountfitchet.",
  serviceNotes: {
    emergency:
      "Water coming through a ceiling is the same job at Hockerill as it is out at Manuden, Birchanger or Little Hallingbury. Ring, say which road you are on and whether it is CM22 or CM23, and we will take it from there.",
    drains:
      "Drain work in Bishop's Stortford runs from the streets by the River Stort out to Thorley and Sheering. Lifting the manhole at the boundary first tells you whether a blockage is yours or shared, and whether rodding or jetting is the tool.",
    booked:
      "A tap that will not stop, a toilet that keeps running, a shower with no pressure: all get a slot in the diary. Same for hot water, in the town or out in the CM22 villages.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/CM_postcode_area",
    "https://en.wikipedia.org/wiki/Bishop%27s_Stortford",
    "https://en.wikipedia.org/wiki/Thorley,_Hertfordshire",
    "https://en.wikipedia.org/wiki/Manuden",
    "https://en.wikipedia.org/wiki/Farnham,_Essex",
    "https://en.wikipedia.org/wiki/Birchanger",
    "https://en.wikipedia.org/wiki/Little_Hallingbury",
    "https://en.wikipedia.org/wiki/Great_Hallingbury",
    "https://en.wikipedia.org/wiki/Hatfield_Heath",
    "https://en.wikipedia.org/wiki/Sheering",
  ],
};

export default bishopsStortford;
