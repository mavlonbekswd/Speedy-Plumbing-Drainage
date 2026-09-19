import type { City } from "../../lib/types";

// Skeleton. slug, name, county, tier, postcodeDistricts and nearbyTowns are facts and are set.
// blurb, localNote, serviceNotes, nearbyAreas and sources are written by the town-copy unit,
// each place name verified against a source before it is written. `published` flips to true
// only when all of them are filled: lib/towns.ts asserts that pairing at import.
const stamford: City = {
  slug: "stamford",
  name: "Stamford",
  county: "Lincolnshire",
  tier: 1,
  published: true,
  blurb:
    "Stamford is the Lincolnshire end of our map. Emergency plumbing, drains and booked repairs run through PE9, in the town and the villages round it.",
  metaTitle: "Emergency Plumber Stamford | Leaks, Drains and Hot Water",
  nearbyTowns: ["peterborough", "huntingdon", "st-neots"],
  postcodeDistricts: ["PE9"],
  nearbyAreas: [
    "Ketton",
    "Barnack",
    "Ryhall",
    "Uffington",
    "Tallington",
    "Great Casterton",
    "Little Casterton",
    "Easton on the Hill",
    "Collyweston",
    "Tinwell",
  ],
  localNote:
    "Stamford is a Lincolnshire town on the River Welland, and PE9 is its only postcode district. PE9 crosses county lines: Uffington and Tallington stay in Lincolnshire, while Ketton, Ryhall and Great Casterton sit in Rutland. Easton on the Hill is in Northamptonshire, and Barnack, Tinwell, Collyweston and Little Casterton fall under PE9 as well. The A1 runs past on the line of the old Great North Road, and the A43 enters the town as Kettering Road.",
  serviceNotes: {
    emergency:
      "Leaks and bursts bring us out to Stamford and to Ketton, Ryhall and Barnack under the same district. Two things help before we set off: the postcode, and whether the water is still coming.",
    drains:
      "A drain that gurgles before it blocks is telling you the run is already part full. We jet it, then send a camera through so the cause is named rather than guessed.",
    booked:
      "Booked work in Stamford is the ordinary list: a dripping tap, a running toilet, a weak shower, hot water that has gone cold.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/PE_postcode_area",
    "https://en.wikipedia.org/wiki/Stamford,_Lincolnshire",
    "https://en.wikipedia.org/wiki/Ketton",
    "https://en.wikipedia.org/wiki/Barnack",
    "https://en.wikipedia.org/wiki/Ryhall",
    "https://en.wikipedia.org/wiki/Uffington,_Lincolnshire",
    "https://en.wikipedia.org/wiki/Tallington",
    "https://en.wikipedia.org/wiki/Great_Casterton",
    "https://en.wikipedia.org/wiki/Easton_on_the_Hill",
  ],
};

export default stamford;
