import type { City } from "../../lib/types";

// Skeleton. slug, name, county, tier, postcodeDistricts and nearbyTowns are facts and are set.
// blurb, localNote, serviceNotes, nearbyAreas and sources are written by the town-copy unit,
// each place name verified against a source before it is written. `published` flips to true
// only when all of them are filled: lib/towns.ts asserts that pairing at import.
const newmarket: City = {
  slug: "newmarket",
  name: "Newmarket",
  county: "Suffolk",
  tier: 1,
  published: true,
  blurb:
    "For Newmarket and the CB8 villages, we handle emergency plumbing, blocked drains and the work you book into the diary.",
  metaTitle: "Emergency Plumber Newmarket | Blocked Drains and Leaks",
  nearbyTowns: ["cambridge", "soham", "haverhill", "bury-st-edmunds"],
  postcodeDistricts: ["CB8"],
  nearbyAreas: [
    "Exning",
    "Kentford",
    "Moulton",
    "Cheveley",
    "Ashley",
    "Dullingham",
    "Stetchworth",
    "Woodditton",
  ],
  localNote:
    "Newmarket and the villages round it share one district, CB8, and it crosses a county line. Exning lies north of the town in Suffolk, while Woodditton and Stetchworth are south in Cambridgeshire. Ashley and Cheveley sit east, Dullingham south, and Kentford north-east on the B1506 towards Bury St Edmunds, with Moulton close by. The A14 joins the A11 at the bypass here, and the A142 leaves the town for Ely and Chatteris.",
  serviceNotes: {
    emergency:
      "A leak that will not wait brings us out to the town, to Exning, Cheveley or Kentford. Say what is leaking and how fast, give us the road you are on, and keep the stop tap within reach.",
    drains:
      "A shower draining slowly and a toilet gurgling at the same moment point at the main run in Newmarket, not at the traps. We rod or jet from the manhole that still runs clear, because that is where the blocked length begins.",
    booked:
      "Booked work in CB8 means taps, toilets, showers and hot water, booked for Exning and Cheveley the way they are for the town.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/CB_postcode_area",
    "https://en.wikipedia.org/wiki/Newmarket,_Suffolk",
    "https://en.wikipedia.org/wiki/Exning",
    "https://en.wikipedia.org/wiki/Kentford",
    "https://en.wikipedia.org/wiki/Moulton,_Suffolk",
    "https://en.wikipedia.org/wiki/Cheveley",
    "https://en.wikipedia.org/wiki/Ashley,_Cambridgeshire",
    "https://en.wikipedia.org/wiki/Dullingham",
    "https://en.wikipedia.org/wiki/Stetchworth",
    "https://en.wikipedia.org/wiki/Woodditton",
    "https://en.wikipedia.org/wiki/A14_road_(England)",
    "https://en.wikipedia.org/wiki/A142_road",
  ],
};

export default newmarket;
