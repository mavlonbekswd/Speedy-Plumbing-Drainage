import type { City } from "../../lib/types";

// Skeleton. slug, name, county, tier, postcodeDistricts and nearbyTowns are facts and are set.
// blurb, localNote, serviceNotes, nearbyAreas and sources are written by the town-copy unit,
// each place name verified against a source before it is written. `published` flips to true
// only when all of them are filled: lib/towns.ts asserts that pairing at import.
const braintree: City = {
  slug: "braintree",
  name: "Braintree",
  county: "Essex",
  tier: 1,
  published: true,
  blurb:
    "CM7 is the Braintree district we work in. Emergency plumbing, drains and booked repairs go to the town and to every village that shares it.",
  metaTitle: "Emergency Plumber Braintree | Drains, Burst Pipes, Repairs",
  nearbyTowns: ["bishops-stortford", "sudbury", "saffron-walden"],
  postcodeDistricts: ["CM7"],
  nearbyAreas: [
    "Bocking",
    "Panfield",
    "Wethersfield",
    "Finchingfield",
    "Great Bardfield",
    "Little Bardfield",
    "Bardfield Saling",
  ],
  localNote:
    "Braintree is in Essex, and CM7 is the postcode district we work across here. Bocking joins the town along its northern edge, and CM7 also holds Panfield, Wethersfield, Finchingfield, Great Bardfield, Little Bardfield and Bardfield Saling. The A120 and the A131 both bypass the town, and the River Pant, also known as the Blackwater, runs through the north of Bocking.",
  serviceNotes: {
    emergency:
      "A pipe that has let go does not wait, whether it is in Bocking, Panfield or out at Finchingfield. Ring us, name the road, and say if you have already turned the water off.",
    drains:
      "Braintree drainage work starts at the gully, the gutter or the run between a house and the boundary manhole. We clear it, then check the fall with a camera so the same blockage does not come back in a month.",
    booked:
      "Hot water, a new tap, a toilet swap or a shower that needs sorting: we give you a slot in Braintree or the Bardfields.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/CM_postcode_area",
    "https://en.wikipedia.org/wiki/Braintree,_Essex",
    "https://en.wikipedia.org/wiki/Bocking,_Essex",
    "https://en.wikipedia.org/wiki/Panfield",
    "https://en.wikipedia.org/wiki/Wethersfield,_Essex",
    "https://en.wikipedia.org/wiki/Finchingfield",
    "https://en.wikipedia.org/wiki/Great_Bardfield",
    "https://en.wikipedia.org/wiki/Little_Bardfield",
    "https://en.wikipedia.org/wiki/Bardfield_Saling",
  ],
};

export default braintree;
