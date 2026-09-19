import type { City } from "../../lib/types";

// Skeleton. slug, name, county, tier, postcodeDistricts and nearbyTowns are facts and are set.
// blurb, localNote, serviceNotes, nearbyAreas and sources are written by the town-copy unit,
// each place name verified against a source before it is written. `published` flips to true
// only when all of them are filled: lib/towns.ts asserts that pairing at import.
const diss: City = {
  slug: "diss",
  name: "Diss",
  county: "Norfolk",
  tier: 1,
  published: true,
  blurb:
    "We work in Diss and the villages spread across its two districts, taking emergency plumbing, drain trouble and booked repairs as they come.",
  metaTitle: "Emergency Plumber Diss | Drain Clearing and Leak Repairs",
  nearbyTowns: ["attleborough", "thetford", "stowmarket"],
  postcodeDistricts: ["IP21", "IP22"],
  nearbyAreas: [
    "Roydon",
    "Bressingham",
    "Burston",
    "Winfarthing",
    "Garboldisham",
    "Scole",
    "Dickleburgh",
    "Pulham Market",
    "Pulham St Mary",
  ],
  localNote:
    "Diss lies in the Waveney valley around its mere, and the town is IP22 along with Roydon, Bressingham, Burston and Winfarthing. IP21 holds Scole on the north bank of the Waveney, and Pulham Market and Pulham St Mary to the north-east. Dickleburgh is three and a half miles east of Diss, in the same district. The A1066 runs through the town and on west through Roydon, Bressingham and Garboldisham, and the A140 passes just east.",
  serviceNotes: {
    emergency:
      "A burst pipe gets the same answer in Diss as it does out at Bressingham, Winfarthing or Pulham Market. Tell us the road name, your postcode, and whether you have found the stop tap.",
    drains:
      "Gullies and manholes fill up the same way in Diss as they do out in the IP21 villages. We rod first, and put a camera down when rodding tells us the run has a fault rather than a blockage.",
    booked:
      "Booked work in Diss is taps, toilets, showers and hot water, on a day you pick.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/IP_postcode_area",
    "https://en.wikipedia.org/wiki/Diss,_Norfolk",
    "https://en.wikipedia.org/wiki/Scole",
    "https://en.wikipedia.org/wiki/Dickleburgh",
    "https://en.wikipedia.org/wiki/Pulham_Market",
    "https://en.wikipedia.org/wiki/Pulham_St_Mary",
    "https://en.wikipedia.org/wiki/Roydon,_South_Norfolk",
    "https://en.wikipedia.org/wiki/Bressingham",
    "https://en.wikipedia.org/wiki/Burston_and_Shimpling",
    "https://en.wikipedia.org/wiki/Winfarthing",
    "https://en.wikipedia.org/wiki/Garboldisham",
  ],
};

export default diss;
