import type { City } from "../../lib/types";

// Skeleton. slug, name, county, tier, postcodeDistricts and nearbyTowns are facts and are set.
// blurb, localNote, serviceNotes, nearbyAreas and sources are written by the town-copy unit,
// each place name verified against a source before it is written. `published` flips to true
// only when all of them are filled: lib/towns.ts asserts that pairing at import.
const cambridge: City = {
  slug: "cambridge",
  name: "Cambridge",
  county: "Cambridgeshire",
  tier: 1,
  published: true,
  blurb:
    "Speedy is a Cambridge business. We work across the city and the villages around it, for emergency plumbing, drains and jobs you book in.",
  metaTitle: "Emergency Plumber Cambridge | Blocked Drains and Leak Repairs",
  nearbyTowns: ["ely", "newmarket", "royston", "st-ives"],
  postcodeDistricts: ["CB1", "CB2", "CB3", "CB4", "CB5"],
  nearbyAreas: [
    "Cherry Hinton",
    "Trumpington",
    "Chesterton",
    "Arbury",
    "King's Hedges",
    "Barnwell",
    "Fen Ditton",
    "Girton",
    "Grantchester",
  ],
  localNote:
    "The city runs from CB1 to CB5. CB4 is the north of it, at Arbury, King's Hedges and Chesterton, and CB5 is the east, at Barnwell and Fen Ditton. CB3 reaches north-west to Girton and south to Grantchester, while CB1 holds Cherry Hinton and CB2 holds Trumpington. The M11 ends north-west of the city where it meets the A14, and the A428 runs out to the A1 at St Neots.",
  serviceNotes: {
    emergency:
      "Burst pipes and leaks bring us out right across CB1 to CB5, and out to Girton, Grantchester and Fen Ditton beyond the city edge. Give us the road name and the postcode when you ring, and say whether the water is still running.",
    drains:
      "The River Cam runs through Cambridge, and a blocked drain near it still starts with the same three things: grease, wipes and roots. Where a run passes close to mature trees, a camera survey tells root ingress from an ordinary blockage before the rods come out.",
    booked:
      "Taps, toilets, showers and hot water are booked for a day that suits you, in Chesterton and Trumpington as readily as out at Girton.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/CB_postcode_area",
    "https://en.wikipedia.org/wiki/Cambridge",
    "https://en.wikipedia.org/wiki/Cherry_Hinton",
    "https://en.wikipedia.org/wiki/Trumpington",
    "https://en.wikipedia.org/wiki/Chesterton,_Cambridge",
    "https://en.wikipedia.org/wiki/Arbury",
    "https://en.wikipedia.org/wiki/King%27s_Hedges",
    "https://en.wikipedia.org/wiki/Barnwell,_Cambridgeshire",
    "https://en.wikipedia.org/wiki/Fen_Ditton",
    "https://en.wikipedia.org/wiki/Girton,_Cambridgeshire",
    "https://en.wikipedia.org/wiki/Grantchester",
  ],
};

export default cambridge;
