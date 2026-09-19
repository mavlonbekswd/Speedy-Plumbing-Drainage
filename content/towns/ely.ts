import type { City } from "../../lib/types";

// Skeleton. slug, name, county, tier, postcodeDistricts and nearbyTowns are facts and are set.
// blurb, localNote, serviceNotes, nearbyAreas and sources are written by the town-copy unit,
// each place name verified against a source before it is written. `published` flips to true
// only when all of them are filled: lib/towns.ts asserts that pairing at import.
const ely: City = {
  slug: "ely",
  name: "Ely",
  county: "Cambridgeshire",
  tier: 1,
  published: true,
  blurb:
    "We work in Ely and the villages around it, on emergency plumbing, blocked drains and the jobs you book in ahead.",
  metaTitle: "Emergency Plumber Ely | Burst Pipes and Blocked Drains",
  nearbyTowns: ["cambridge", "soham", "march", "downham-market"],
  postcodeDistricts: ["CB6", "CB7"],
  nearbyAreas: [
    "Littleport",
    "Little Downham",
    "Witchford",
    "Haddenham",
    "Sutton",
    "Stretham",
    "Wilburton",
    "Little Thetford",
    "Prickwillow",
    "Queen Adelaide",
  ],
  localNote:
    "Ely splits between CB6 in the west and CB7 in the east. CB6 holds Witchford to the west, Little Downham to the north, and Little Thetford, Stretham and Wilburton to the south and south-west. Littleport is CB6 as well, north-east of the city, and CB7 takes in Prickwillow on the River Lark and Queen Adelaide. The A10 passes Stretham, where it crosses the River Great Ouse, and the A142 links Ely with Newmarket and Chatteris.",
  serviceNotes: {
    emergency:
      "Burst pipes and overflowing tanks bring us out to Littleport, Haddenham, Witchford and Queen Adelaide as well as the city itself. Ring us, say whether you are CB6 or CB7, give the road name, and tell us if the water is still running.",
    drains:
      "Ely stands in the Fens, and drain runs laid on fen ground can settle and drop out of line over the years. A camera survey shows that before anyone starts rodding, and it tells a fallen joint from grease or roots.",
    booked:
      "Booked work reads the same in Ely as in the villages: a tap, a toilet, a shower, or hot water that has stopped.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/CB_postcode_area",
    "https://en.wikipedia.org/wiki/Ely,_Cambridgeshire",
    "https://en.wikipedia.org/wiki/Littleport,_Cambridgeshire",
    "https://en.wikipedia.org/wiki/Little_Downham",
    "https://en.wikipedia.org/wiki/Witchford",
    "https://en.wikipedia.org/wiki/Haddenham,_Cambridgeshire",
    "https://en.wikipedia.org/wiki/Sutton-in-the-Isle",
    "https://en.wikipedia.org/wiki/Stretham",
    "https://en.wikipedia.org/wiki/Wilburton",
    "https://en.wikipedia.org/wiki/Little_Thetford",
    "https://en.wikipedia.org/wiki/Prickwillow",
    "https://en.wikipedia.org/wiki/Queen_Adelaide,_Cambridgeshire",
    "https://en.wikipedia.org/wiki/Stuntney",
    "https://en.wikipedia.org/wiki/A142_road",
  ],
};

export default ely;
