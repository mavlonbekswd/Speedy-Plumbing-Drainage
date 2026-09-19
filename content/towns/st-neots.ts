import type { City } from "../../lib/types";

// Skeleton. slug, name, county, tier, postcodeDistricts and nearbyTowns are facts and are set.
// blurb, localNote, serviceNotes, nearbyAreas and sources are written by the town-copy unit,
// each place name verified against a source before it is written. `published` flips to true
// only when all of them are filled: lib/towns.ts asserts that pairing at import.
const stNeots: City = {
  slug: "st-neots",
  name: "St Neots",
  county: "Cambridgeshire",
  tier: 1,
  published: true,
  blurb:
    "We answer emergency plumbing, drain and booked work in St Neots, Eynesbury, the two Eatons and the PE19 villages north of them.",
  metaTitle: "Emergency Plumber St Neots | Leaks, Drains and Repairs",
  nearbyTowns: ["huntingdon", "st-ives", "biggleswade", "bedford"],
  postcodeDistricts: ["PE19"],
  nearbyAreas: [
    "Eynesbury",
    "Eaton Ford",
    "Eaton Socon",
    "Love's Farm",
    "Wintringham",
    "Little Paxton",
    "Great Paxton",
    "Buckden",
    "Abbotsley",
    "Hail Weston",
  ],
  localNote:
    "St Neots has one postcode district, PE19, and the whole town falls within it. Eynesbury, Eaton Ford, Eaton Socon, Love's Farm and Wintringham are all part of the town, with Eaton Socon west of the River Great Ouse. PE19 then runs north to Little Paxton, Great Paxton and Buckden, and out to Abbotsley and Hail Weston. The A1 runs along the west of Eaton Socon, and the A428 bypass to its south links Cambridge with Bedford.",
  serviceNotes: {
    emergency:
      "When water is running where it should not, we come out through PE19, at Eynesbury and Eaton Ford and away out to Buckden. Ring and say what has failed, where the water is coming from, and whether you can reach the stop tap.",
    drains:
      "St Neots lies in the valley of the River Great Ouse, and a drain blocked in the road backs up at the lowest gully. Clearing it starts at that manhole, then works up towards the house, not down from the sink.",
    booked:
      "Taps, toilets, showers and hot water are booked for a morning or an afternoon that suits you, in town or out at Great Paxton.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/PE_postcode_area",
    "https://en.wikipedia.org/wiki/St_Neots",
    "https://en.wikipedia.org/wiki/Eaton_Socon",
    "https://en.wikipedia.org/wiki/Little_Paxton",
    "https://en.wikipedia.org/wiki/Great_Paxton",
    "https://en.wikipedia.org/wiki/Buckden,_Cambridgeshire",
    "https://en.wikipedia.org/wiki/Abbotsley",
    "https://en.wikipedia.org/wiki/Hail_Weston",
  ],
};

export default stNeots;
