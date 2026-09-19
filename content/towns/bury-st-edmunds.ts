import type { City } from "../../lib/types";

// Skeleton. slug, name, county, tier, postcodeDistricts and nearbyTowns are facts and are set.
// blurb, localNote, serviceNotes, nearbyAreas and sources are written by the town-copy unit,
// each place name verified against a source before it is written. `published` flips to true
// only when all of them are filled: lib/towns.ts asserts that pairing at import.
//
// The account targets IP28, IP29, IP30 and IP31 only. Those are the village districts that ring
// the town, so every field here is about the villages and never about the town's own districts.
const buryStEdmunds: City = {
  slug: "bury-st-edmunds",
  name: "Bury St Edmunds",
  county: "Suffolk",
  tier: 1,
  published: true,
  // The town itself is IP32/IP33, which the ad account does not target. Templates say this
  // instead of "in Bury St Edmunds", so no heading claims the town.
  placeLabel: "the Bury St Edmunds villages",
  blurb:
    "Our work around Bury St Edmunds is in the villages, across IP28, IP29, IP30 and IP31. Emergency plumbing, drains and booked jobs, out where those districts run.",
  metaTitle: "Plumber for the Bury St Edmunds Villages | Drains and Leaks",
  nearbyTowns: ["newmarket", "mildenhall", "stowmarket", "sudbury"],
  postcodeDistricts: ["IP28", "IP29", "IP30", "IP31"],
  nearbyAreas: [
    "Great Barton",
    "Ixworth",
    "Thurston",
    "Stanton",
    "Woolpit",
    "Elmswell",
    "Horringer",
    "Barrow",
    "Culford",
    "Risby",
  ],
  localNote:
    "We work the four village districts around the town: IP28, IP29, IP30 and IP31. IP31 runs north-east on the A143 through Great Barton, Ixworth and Stanton, and takes in Thurston east of the town. IP30 sits east toward Stowmarket, at Woolpit and Elmswell, while IP29 holds Barrow to the west and Horringer. IP28 reaches north and west to Culford and Risby, and the A14 runs east to west through the area.",
  serviceNotes: {
    emergency:
      "A burst pipe at Ixworth or Great Barton gets the same answer as one at Barrow or Woolpit. Tell us the village, the district letters and where the water is coming through.",
    drains:
      "Blocked drains bring us out to Elmswell and Woolpit in IP30, and to Barrow and Horringer in IP29. We put a camera down the run first, so the rods or the jetter go to the right length.",
    booked:
      "Booked jobs take a slot in the diary: a new tap, a toilet that will not fill, a shower swap, hot water put right. We do them at Thurston, Stanton and Culford the same as anywhere.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/IP_postcode_area",
    "https://en.wikipedia.org/wiki/Bury_St_Edmunds",
    "https://en.wikipedia.org/wiki/Stowmarket",
    "https://en.wikipedia.org/wiki/Great_Barton",
    "https://en.wikipedia.org/wiki/Ixworth",
    "https://en.wikipedia.org/wiki/Thurston,_Suffolk",
    "https://en.wikipedia.org/wiki/Stanton,_Suffolk",
    "https://en.wikipedia.org/wiki/Woolpit",
    "https://en.wikipedia.org/wiki/Elmswell",
    "https://en.wikipedia.org/wiki/Horringer",
    "https://en.wikipedia.org/wiki/Barrow,_Suffolk",
    "https://en.wikipedia.org/wiki/Culford",
    "https://en.wikipedia.org/wiki/Risby,_Suffolk",
  ],
};

export default buryStEdmunds;
