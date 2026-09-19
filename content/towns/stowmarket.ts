import type { City } from "../../lib/types";

// Skeleton. slug, name, county, tier, postcodeDistricts and nearbyTowns are facts and are set.
// blurb, localNote, serviceNotes, nearbyAreas and sources are written by the town-copy unit,
// each place name verified against a source before it is written. `published` flips to true
// only when all of them are filled: lib/towns.ts asserts that pairing at import.
const stowmarket: City = {
  slug: "stowmarket",
  name: "Stowmarket",
  county: "Suffolk",
  tier: 1,
  published: true,
  blurb:
    "In Stowmarket and the IP14 villages we take emergency plumbing, drains and booked repairs, from a burst pipe to a shower you want changed.",
  metaTitle: "Emergency Plumber Stowmarket | Burst Pipes and Drain Work",
  nearbyTowns: ["bury-st-edmunds", "diss", "sudbury"],
  postcodeDistricts: ["IP14"],
  nearbyAreas: [
    "Stowupland",
    "Haughley",
    "Onehouse",
    "Combs",
    "Bacton",
    "Mendlesham",
    "Wetherden",
  ],
  localNote:
    "Stowmarket is IP14, on the River Gipping, which the River Rat joins south of the town. Stowmarket stands on the A14, with Bury St Edmunds west of here and Ipswich to the south-east. Stowupland is a mile east, Haughley two miles north-west and Onehouse about three miles west, all in the same district. Bacton, Wetherden, Mendlesham and Combs are IP14 as well.",
  serviceNotes: {
    emergency:
      "A burst pipe or a leak through a ceiling gets us out to Stowupland, Haughley, Wetherden and Bacton. When you ring, say what the water is doing now and whether anyone has turned the mains off.",
    drains:
      "A slow bath and a blocked drain run are two different jobs, and telling them apart comes before any tool comes out. We do that in Stowmarket, Stowupland and Haughley the same way, then clear the one that is actually blocked.",
    booked:
      "Booked work gets a date and a time we agree with you, at Mendlesham and Combs as much as in the town. Taps, toilets, showers and hot water all go in that way.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/IP_postcode_area",
    "https://en.wikipedia.org/wiki/Stowmarket",
    "https://en.wikipedia.org/wiki/Stowupland",
    "https://en.wikipedia.org/wiki/Haughley",
    "https://en.wikipedia.org/wiki/Onehouse",
    "https://en.wikipedia.org/wiki/Combs,_Suffolk",
    "https://en.wikipedia.org/wiki/Bacton,_Suffolk",
    "https://en.wikipedia.org/wiki/Mendlesham",
    "https://en.wikipedia.org/wiki/Wetherden",
  ],
};

export default stowmarket;
