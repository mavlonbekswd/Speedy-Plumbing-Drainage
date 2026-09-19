import type { City } from "../../lib/types";

// Skeleton. slug, name, county, tier, postcodeDistricts and nearbyTowns are facts and are set.
// blurb, localNote, serviceNotes, nearbyAreas and sources are written by the town-copy unit,
// each place name verified against a source before it is written. `published` flips to true
// only when all of them are filled: lib/towns.ts asserts that pairing at import.
const brandon: City = {
  slug: "brandon",
  name: "Brandon",
  county: "Suffolk",
  tier: 1,
  published: true,
  blurb:
    "Brandon and the IP27 villages are on our list for emergency plumbing, blocked drains and work you book for a set day.",
  metaTitle: "Emergency Plumber Brandon Suffolk | Drains and Leak Repairs",
  nearbyTowns: ["mildenhall", "thetford", "swaffham"],
  postcodeDistricts: ["IP27"],
  nearbyAreas: [
    "Lakenheath",
    "Weeting",
    "Santon Downham",
    "Eriswell",
    "Little Eriswell",
    "Wangford",
  ],
  localNote:
    "Brandon is IP27, and the town grew at a crossing of the Little Ouse. The district crosses the county line: Weeting is in Norfolk, while Lakenheath, Eriswell and Santon Downham are in Suffolk. The town is on the A1065 from Mildenhall to Fakenham, and Wangford is now part of Brandon parish.",
  serviceNotes: {
    emergency:
      "A leak that is spreading brings us to Lakenheath, Weeting, Santon Downham and Eriswell as well as to Brandon itself. Ring and tell us what is leaking, how fast, and whether the water has reached anything electrical.",
    drains:
      "Blocked drains in IP27 take us to Lakenheath, Weeting and Wangford, and the job starts with finding which run has stopped. Rods deal with most of it, and the jetter follows when a length needs scouring out rather than poking through.",
    booked:
      "Booked jobs here are taps, toilets, showers and hot water, fitted or repaired on a day you name. Eriswell and Santon Downham get the same slots as the town.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/IP_postcode_area",
    "https://en.wikipedia.org/wiki/Brandon,_Suffolk",
    "https://en.wikipedia.org/wiki/Lakenheath",
    "https://en.wikipedia.org/wiki/Weeting",
    "https://en.wikipedia.org/wiki/Santon_Downham",
    "https://en.wikipedia.org/wiki/Eriswell",
    "https://en.wikipedia.org/wiki/Wangford,_Forest_Heath",
    "https://www.streetlist.co.uk/ip/ip27",
  ],
};

export default brandon;
