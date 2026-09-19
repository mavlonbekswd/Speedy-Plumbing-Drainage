import type { City } from "../../lib/types";

// Skeleton. slug, name, county, tier, postcodeDistricts and nearbyTowns are facts and are set.
// blurb, localNote, serviceNotes, nearbyAreas and sources are written by the town-copy unit,
// each place name verified against a source before it is written. `published` flips to true
// only when all of them are filled: lib/towns.ts asserts that pairing at import.
const biggleswade: City = {
  slug: "biggleswade",
  name: "Biggleswade",
  county: "Bedfordshire",
  tier: 1,
  published: true,
  blurb:
    "Biggleswade is in Bedfordshire, with SG18 as its postcode district. Emergency plumbing, drains and booked repairs, in the town and the villages that sit under it.",
  metaTitle: "Emergency Plumber Biggleswade | Drains, Leaks, Hot Water",
  nearbyTowns: ["st-neots", "royston", "bedford"],
  postcodeDistricts: ["SG18"],
  nearbyAreas: [
    "Stratton",
    "Holme",
    "Langford",
    "Northill",
    "Upper Caldecote",
    "Lower Caldecote",
    "Old Warden",
    "Dunton",
  ],
  localNote:
    "Biggleswade is a Bedfordshire market town on the River Ivel, and SG18 is the district around it. The parish takes in Stratton and the hamlet of Holme. SG18 also reaches Langford, Northill, Upper Caldecote, Lower Caldecote, Old Warden and Dunton. The A1 bypasses the town, its old course is numbered A6001, and the B659 runs south to Langford.",
  serviceNotes: {
    emergency:
      "An emergency in Biggleswade is the same job at Langford, Northill or Old Warden, and we treat it that way. Phone, say what has failed and where, and keep away from anything wet and electrical.",
    drains:
      "A blocked drain in Biggleswade shows first as a slow sink or a gully holding water after rain. Rods clear most of them; where they do not, jetting and a camera settle what is really in the run.",
    booked:
      "Not everything is an emergency. Showers, toilets, taps and hot water go in the diary for Biggleswade, Langford and Northill.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/SG_postcode_area",
    "https://en.wikipedia.org/wiki/Biggleswade",
    "https://en.wikipedia.org/wiki/Langford,_Bedfordshire",
    "https://en.wikipedia.org/wiki/Northill",
    "https://en.wikipedia.org/wiki/Old_Warden",
    "https://en.wikipedia.org/wiki/Dunton,_Bedfordshire",
  ],
};

export default biggleswade;
