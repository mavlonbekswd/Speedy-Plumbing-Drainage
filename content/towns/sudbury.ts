import type { City } from "../../lib/types";

// Skeleton. slug, name, county, tier, postcodeDistricts and nearbyTowns are facts and are set.
// blurb, localNote, serviceNotes, nearbyAreas and sources are written by the town-copy unit,
// each place name verified against a source before it is written. `published` flips to true
// only when all of them are filled: lib/towns.ts asserts that pairing at import.
const sudbury: City = {
  slug: "sudbury",
  name: "Sudbury",
  county: "Suffolk",
  tier: 1,
  published: true,
  blurb:
    "Sudbury and the CO10 villages are ours for emergency plumbing, drains and booked work, from a leak tonight to a tap fitted later.",
  metaTitle: "Emergency Plumber Sudbury | Blocked Drains and Water Leaks",
  nearbyTowns: ["haverhill", "bury-st-edmunds", "braintree"],
  postcodeDistricts: ["CO10"],
  nearbyAreas: [
    "Great Cornard",
    "Long Melford",
    "Lavenham",
    "Clare",
    "Glemsford",
    "Cavendish",
    "Acton",
    "Boxford",
    "Great Waldingfield",
  ],
  localNote:
    "Sudbury is CO10, on the River Stour near the Essex border. The district takes in Long Melford, Glemsford, Cavendish and Clare, which stands on the north bank of the Stour nine miles from Sudbury. Great Cornard is part of the town, Great Waldingfield lies two miles north-east, and Lavenham, Acton and Boxford are CO10 as well. The A131 comes up from near Little Waltham, and the A134 runs from Colchester on to Bury St Edmunds.",
  serviceNotes: {
    emergency:
      "Water where it should not be gets us out to Great Cornard, Long Melford, Acton and Great Waldingfield. Ring us, give the village and the road, and say whether the leak is upstairs or below.",
    drains:
      "A blockage sits on the foul run or the rainwater run, and the two are cleared differently. In Sudbury, Clare and Cavendish we work out which one it is before anything starts.",
    booked:
      "Booked work here means taps, toilets, showers and hot water, arranged for a morning or an afternoon that suits you. Clare, Cavendish and Boxford are in the same diary as the town.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/CO_postcode_area",
    "https://en.wikipedia.org/wiki/Sudbury,_Suffolk",
    "https://en.wikipedia.org/wiki/Great_Cornard",
    "https://en.wikipedia.org/wiki/Long_Melford",
    "https://en.wikipedia.org/wiki/Lavenham",
    "https://en.wikipedia.org/wiki/Clare,_Suffolk",
    "https://en.wikipedia.org/wiki/Glemsford",
    "https://en.wikipedia.org/wiki/Cavendish,_Suffolk",
    "https://en.wikipedia.org/wiki/Acton,_Suffolk",
    "https://en.wikipedia.org/wiki/Boxford,_Suffolk",
    "https://en.wikipedia.org/wiki/Great_Waldingfield",
  ],
};

export default sudbury;
