import type { City } from "../../lib/types";

// Skeleton. slug, name, county, tier, postcodeDistricts and nearbyTowns are facts and are set.
// blurb, localNote, serviceNotes, nearbyAreas and sources are written by the town-copy unit,
// each place name verified against a source before it is written. `published` flips to true
// only when all of them are filled: lib/towns.ts asserts that pairing at import.
const wisbech: City = {
  slug: "wisbech",
  name: "Wisbech",
  county: "Cambridgeshire",
  tier: 1,
  published: true,
  blurb:
    "Speedy works across Wisbech and the fen villages in PE13 and PE14, taking emergency plumbing, drain work and jobs you book in advance.",
  metaTitle: "Emergency Plumber Wisbech | Burst Pipes and Blocked Drains",
  nearbyTowns: ["march", "downham-market", "kings-lynn", "chatteris"],
  postcodeDistricts: ["PE13", "PE14"],
  nearbyAreas: [
    "Walsoken",
    "West Walton",
    "Elm",
    "Emneth",
    "Outwell",
    "Upwell",
    "Guyhirn",
    "Murrow",
    "Parson Drove",
    "Wisbech St Mary",
  ],
  localNote:
    "Wisbech is PE13 and PE14, split by the tidal River Nene. PE13 reaches west and south-west to Parson Drove, Murrow, Wisbech St Mary and Guyhirn, where the A141 meets the A47. PE14 takes in Walsoken and West Walton to the north-east and north. It then runs south through Elm and Emneth, and down the A1101 to Outwell and Upwell.",
  serviceNotes: {
    emergency:
      "A burst pipe gets the same answer in the streets by the Nene as it does out at Parson Drove, Emneth or Upwell. Tell us the road, whether it is PE13 or PE14, and where your stopcock is.",
    drains:
      "Wisbech sits in the Fens, and a drain run laid on fen ground can move and drop out of line over the years. A camera survey shows that before anyone starts rodding, so the work matches what the pipe is doing.",
    booked:
      "A dripping tap, a toilet that will not stop filling, a shower running cold: these get booked in across Wisbech and the PE14 villages.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/PE_postcode_area",
    "https://en.wikipedia.org/wiki/Wisbech",
    "https://en.wikipedia.org/wiki/Walsoken",
    "https://en.wikipedia.org/wiki/West_Walton",
    "https://en.wikipedia.org/wiki/Elm,_Cambridgeshire",
    "https://en.wikipedia.org/wiki/Emneth",
    "https://en.wikipedia.org/wiki/Outwell",
    "https://en.wikipedia.org/wiki/Upwell",
    "https://en.wikipedia.org/wiki/Guyhirn",
    "https://en.wikipedia.org/wiki/Murrow,_Cambridgeshire",
    "https://en.wikipedia.org/wiki/Parson_Drove",
    "https://en.wikipedia.org/wiki/Wisbech_St_Mary",
    "https://en.wikipedia.org/wiki/A1101_road",
    "https://en.wikipedia.org/wiki/A_roads_in_Zone_1_of_the_Great_Britain_numbering_scheme",
  ],
};

export default wisbech;
