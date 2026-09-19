import type { City } from "../../lib/types";

// Skeleton. slug, name, county, tier, postcodeDistricts and nearbyTowns are facts and are set.
// blurb, localNote, serviceNotes, nearbyAreas and sources are written by the town-copy unit,
// each place name verified against a source before it is written. `published` flips to true
// only when all of them are filled: lib/towns.ts asserts that pairing at import.
//
// IP28 is shared with Bury St Edmunds. The names here are the ones at Mildenhall's end of the
// district; the Bury leaf takes the ones nearer the town, and the two lists do not overlap.
const mildenhall: City = {
  slug: "mildenhall",
  name: "Mildenhall",
  county: "Suffolk",
  tier: 1,
  published: true,
  blurb:
    "Mildenhall and the IP28 villages around it get the same service from us: emergency plumbing, drains, and the jobs you book in advance.",
  metaTitle: "Emergency Plumber Mildenhall | Burst Pipes and Blocked Drains",
  nearbyTowns: ["brandon", "newmarket", "bury-st-edmunds"],
  postcodeDistricts: ["IP28"],
  nearbyAreas: [
    "Beck Row",
    "West Row",
    "Barton Mills",
    "Worlington",
    "Icklingham",
    "Red Lodge",
    "Freckenham",
  ],
  localNote:
    "Mildenhall sits in IP28, where the River Lark flows through the town and the A11 runs near it. The district reaches out to Beck Row and West Row, to Barton Mills and Worlington, and on to Icklingham. Red Lodge lies between Mildenhall and Newmarket, close to the A11 and the A14, and Freckenham is IP28 too.",
  serviceNotes: {
    emergency:
      "When water is running and will not stop, we come out to Beck Row, West Row, Barton Mills and Worlington. Say which room it is in and whether you can reach the stop tap.",
    drains:
      "Mildenhall is widely reckoned the start of the Fens, and a drain run on fen ground can shift and drop out of line. A camera survey shows whether that is what you have, or whether it is an ordinary blockage in IP28.",
    booked:
      "Book us for a tap that drips, a toilet that runs on, a shower that has quit, or hot water gone off. Red Lodge, Icklingham and Freckenham are all in the diary the same way.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/IP_postcode_area",
    "https://en.wikipedia.org/wiki/Mildenhall,_Suffolk",
    "https://en.wikipedia.org/wiki/Beck_Row",
    "https://en.wikipedia.org/wiki/West_Row",
    "https://en.wikipedia.org/wiki/Barton_Mills",
    "https://en.wikipedia.org/wiki/Worlington,_Suffolk",
    "https://en.wikipedia.org/wiki/Icklingham",
    "https://en.wikipedia.org/wiki/Red_Lodge,_Suffolk",
    "https://en.wikipedia.org/wiki/Freckenham",
  ],
};

export default mildenhall;
