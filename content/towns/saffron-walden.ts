import type { City } from "../../lib/types";

// Skeleton. slug, name, county, tier, postcodeDistricts and nearbyTowns are facts and are set.
// blurb, localNote, serviceNotes, nearbyAreas and sources are written by the town-copy unit,
// each place name verified against a source before it is written. `published` flips to true
// only when all of them are filled: lib/towns.ts asserts that pairing at import.
const saffronWalden: City = {
  slug: "saffron-walden",
  name: "Saffron Walden",
  county: "Essex",
  tier: 1,
  published: true,
  blurb:
    "Saffron Walden is an Essex market town split across two postcode districts. Emergency plumbing, drains and booked repairs run through both of them, town and village alike.",
  metaTitle: "Emergency Plumber Saffron Walden | Blocked Drains, Leaks",
  nearbyTowns: ["royston", "haverhill", "bishops-stortford", "cambridge"],
  postcodeDistricts: ["CB10", "CB11"],
  nearbyAreas: [
    "Sewards End",
    "Ashdon",
    "Radwinter",
    "Wimbish",
    "Great Chesterford",
    "Little Walden",
    "Newport",
    "Littlebury",
    "Wendens Ambo",
    "Clavering",
  ],
  localNote:
    "Saffron Walden is an Uttlesford town in Essex, and it is split between CB10 in the north and CB11 in the south. CB10 takes in Ashdon, Radwinter, Wimbish, Sewards End, Little Walden and Great Chesterford, which stands on the River Cam, or Granta. CB11 is the southern half, with Newport, Littlebury, Wendens Ambo and Clavering. The town is reached from the M11, at junction 8 from the south and junction 10 from the north.",
  serviceNotes: {
    emergency:
      "A leak that is still running gets us moving, in the town and out at Newport, Ashdon or Radwinter. When you ring, give the village name first, then the postcode, then what you can see.",
    drains:
      "Drains here back up for ordinary reasons: fat down a kitchen sink, wipes down a toilet, silt after heavy rain. We rod or jet the run, then put a camera through it if the same gully fills again.",
    booked:
      "Booked jobs fit around you: a tap, a toilet, a shower, a hot water fault that can wait until Tuesday.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/CB_postcode_area",
    "https://en.wikipedia.org/wiki/Saffron_Walden",
    "https://en.wikipedia.org/wiki/Ashdon",
    "https://en.wikipedia.org/wiki/Great_Chesterford",
    "https://en.wikipedia.org/wiki/Newport,_Essex",
    "https://en.wikipedia.org/wiki/Clavering,_Essex",
  ],
};

export default saffronWalden;
