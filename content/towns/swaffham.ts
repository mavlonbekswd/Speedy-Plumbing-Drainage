import type { City } from "../../lib/types";

// Skeleton. slug, name, county, tier, postcodeDistricts and nearbyTowns are facts and are set.
// blurb, localNote, serviceNotes, nearbyAreas and sources are written by the town-copy unit,
// each place name verified against a source before it is written. `published` flips to true
// only when all of them are filled: lib/towns.ts asserts that pairing at import.
const swaffham: City = {
  slug: "swaffham",
  name: "Swaffham",
  county: "Norfolk",
  tier: 1,
  published: true,
  blurb:
    "In Swaffham we take the emergency work, the drains and the jobs you book in, across the town and the PE37 villages.",
  metaTitle: "Emergency Plumber Swaffham | Blocked Drains, Leaks, Taps",
  nearbyTowns: ["downham-market", "watton", "brandon", "kings-lynn"],
  postcodeDistricts: ["PE37"],
  nearbyAreas: [
    "Necton",
    "Beachamwell",
    "Cockley Cley",
    "North Pickenham",
    "South Pickenham",
  ],
  localNote:
    "PE37 is Swaffham's district, and it takes in Necton, on a turning off the A47 towards East Dereham. Beachamwell is five miles south-west of the town. Cockley Cley, North Pickenham and South Pickenham are in PE37 as well. The A47 bypasses Swaffham to the north, and the A1065 from Mildenhall to Fakenham runs through it north to south.",
  serviceNotes: {
    emergency:
      "A burst can mean Swaffham itself or Necton, Cockley Cley or one of the Pickenhams, and we come to all of them. When you ring, say what is coming from where, and have your postcode in front of you.",
    drains:
      "A gurgling sink or a slow bath is often the first sign, in the town and in the PE37 villages. We clear the blockage, then look at the line with a camera to see whether the pipe itself is at fault.",
    booked:
      "Booked work here is taps, toilets, showers and hot water, put in the diary at a time you agree.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/PE_postcode_area",
    "https://en.wikipedia.org/wiki/Swaffham",
    "https://en.wikipedia.org/wiki/Necton",
    "https://en.wikipedia.org/wiki/Beachamwell",
    "https://en.wikipedia.org/wiki/Cockley_Cley",
    "https://en.wikipedia.org/wiki/North_Pickenham",
    "https://en.wikipedia.org/wiki/South_Pickenham",
  ],
};

export default swaffham;
