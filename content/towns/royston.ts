import type { City } from "../../lib/types";

// Skeleton. slug, name, county, tier, postcodeDistricts and nearbyTowns are facts and are set.
// blurb, localNote, serviceNotes, nearbyAreas and sources are written by the town-copy unit,
// each place name verified against a source before it is written. `published` flips to true
// only when all of them are filled: lib/towns.ts asserts that pairing at import.
const royston: City = {
  slug: "royston",
  name: "Royston",
  county: "Hertfordshire",
  tier: 1,
  published: true,
  blurb:
    "Royston is in Hertfordshire, and SG8 reaches well beyond it. We take emergency plumbing, drains and booked repairs in the town and its villages.",
  metaTitle: "Emergency Plumber Royston | Blocked Drains and Burst Pipes",
  nearbyTowns: ["cambridge", "saffron-walden", "biggleswade"],
  postcodeDistricts: ["SG8"],
  nearbyAreas: [
    "Melbourn",
    "Meldreth",
    "Shepreth",
    "Bassingbourn",
    "Kneesworth",
    "Barkway",
    "Barley",
    "Therfield",
    "Litlington",
    "Fowlmere",
  ],
  localNote:
    "Royston is a Hertfordshire town, and SG8 is its one postcode district. It crosses the county line: Bassingbourn, Kneesworth, Meldreth and Melbourn are in Cambridgeshire, while Barkway and Therfield stay in Hertfordshire. The A10 and A505 meet at the town, and the A1198 runs north along the line of Ermine Street.",
  serviceNotes: {
    emergency:
      "A burst pipe gets the same answer in Royston itself as it does out at Melbourn, Barkway or Litlington. Tell us the road, the SG8 postcode, and whether you have found the stop tap yet.",
    drains:
      "Blocked drains around Royston usually come down to fat, wipes or roots finding a way into the run. A camera down the line shows which of the three it is before anyone picks up a rod.",
    booked:
      "Booked work is the quiet half of the job: taps, toilets, showers and hot water, in Royston and out at Shepreth or Fowlmere.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/SG_postcode_area",
    "https://en.wikipedia.org/wiki/Royston,_Hertfordshire",
    "https://en.wikipedia.org/wiki/Melbourn",
    "https://en.wikipedia.org/wiki/Meldreth",
    "https://en.wikipedia.org/wiki/Bassingbourn",
    "https://en.wikipedia.org/wiki/Barkway",
    "https://en.wikipedia.org/wiki/Therfield",
    "https://en.wikipedia.org/wiki/Litlington,_Cambridgeshire",
  ],
};

export default royston;
