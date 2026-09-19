import type { City } from "../../lib/types";

// Skeleton. slug, name, county, tier, postcodeDistricts and nearbyTowns are facts and are set.
// blurb, localNote, serviceNotes, nearbyAreas and sources are written by the town-copy unit,
// each place name verified against a source before it is written. `published` flips to true
// only when all of them are filled: lib/towns.ts asserts that pairing at import.
const soham: City = {
  slug: "soham",
  name: "Soham",
  county: "Cambridgeshire",
  tier: 1,
  published: true,
  blurb:
    "Soham shares CB7 with the villages around it, and we work the lot: emergency plumbing, blocked drains and repairs you book for later.",
  metaTitle: "Emergency Plumber Soham | Leaks, Drains and Toilet Repairs",
  nearbyTowns: ["ely", "newmarket", "cambridge"],
  postcodeDistricts: ["CB7"],
  nearbyAreas: ["Barway", "Broad Hill", "Wicken", "Upware", "Fordham", "Isleham", "Chippenham"],
  localNote:
    "CB7 is a wide district, and the Soham end of it runs out in every direction. Barway lies north-west of the town on Soham Lode. Wicken and Upware are south-west towards the River Cam, while Fordham, Chippenham and Isleham lie south-east and east. The A142 between Ely and Newmarket runs past the town.",
  serviceNotes: {
    emergency:
      "A burst or a leak gets us moving in Soham and out to Barway, Wicken, Fordham or Isleham. Have the postcode ready, and tell us what is underneath the leak and how fast it is going.",
    drains:
      "In Soham, two different signs mean two different jobs: a gully brimming outdoors, or a toilet that empties and refills slowly. Telling us which one you have decides whether we arrive with rods or with the jetter.",
    booked:
      "A tap you have put up with, a toilet handle that sticks, a shower that never gets hot. Book those in, and tell us the make if you know it.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/CB_postcode_area",
    "https://en.wikipedia.org/wiki/Soham",
    "https://en.wikipedia.org/wiki/Barway",
    "https://en.wikipedia.org/wiki/Broad_Hill",
    "https://en.wikipedia.org/wiki/Wicken,_Cambridgeshire",
    "https://en.wikipedia.org/wiki/Upware",
    "https://en.wikipedia.org/wiki/Fordham,_Cambridgeshire",
    "https://en.wikipedia.org/wiki/Isleham",
    "https://en.wikipedia.org/wiki/Chippenham,_Cambridgeshire",
  ],
};

export default soham;
