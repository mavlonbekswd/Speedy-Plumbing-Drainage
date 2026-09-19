import type { City } from "../../lib/types";

// Skeleton. slug, name, county, tier, postcodeDistricts and nearbyTowns are facts and are set.
// blurb, localNote, serviceNotes, nearbyAreas and sources are written by the town-copy unit,
// each place name verified against a source before it is written. `published` flips to true
// only when all of them are filled: lib/towns.ts asserts that pairing at import.
const haverhill: City = {
  slug: "haverhill",
  name: "Haverhill",
  county: "Suffolk",
  tier: 1,
  published: true,
  blurb:
    "Emergency plumbing, drains and booked repairs in Haverhill and the CB9 villages that ring it, from Withersfield to Steeple Bumpstead.",
  metaTitle: "Emergency Plumber Haverhill | Drains, Leaks and Taps",
  nearbyTowns: ["newmarket", "saffron-walden", "sudbury"],
  postcodeDistricts: ["CB9"],
  nearbyAreas: [
    "Withersfield",
    "Little Wratting",
    "Great Wratting",
    "Sturmer",
    "Steeple Bumpstead",
    "Helions Bumpstead",
    "Kedington",
    "Barnardiston",
    "Great Thurlow",
    "Little Thurlow",
  ],
  localNote:
    "Haverhill is CB9, and the district takes in villages at the meeting point of the Suffolk, Essex and Cambridgeshire borders. Withersfield is a mile north, Little Wratting lies on the north-eastern edge of the town, and Sturmer two miles south-east. Steeple Bumpstead is three miles south, Barnardiston four miles north-east off the A143, and Kedington sits on the way to Clare. Stour Brook runs through the town to join the River Stour, and the A1307 is the road to Cambridge, the A11 and the A14.",
  serviceNotes: {
    emergency:
      "When a pipe bursts, the job is the same in Haverhill as it is at Kedington, Sturmer or Steeple Bumpstead. Give us your road and the junction nearest to it, and tell us whether the water is off yet.",
    drains:
      "Rodding and jetting clear the same blocked runs in the town and out at Little Wratting, Withersfield and Great Thurlow. Where a drain blocks again within weeks, a camera goes down it, because a repeat like that usually has a cause you can see.",
    booked:
      "A tap that drips, a toilet that runs on, a weak shower, or hot water that has failed: each one gets a booked slot here.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/CB_postcode_area",
    "https://en.wikipedia.org/wiki/Haverhill,_Suffolk",
    "https://en.wikipedia.org/wiki/Withersfield",
    "https://en.wikipedia.org/wiki/Little_Wratting",
    "https://en.wikipedia.org/wiki/Great_Wratting",
    "https://en.wikipedia.org/wiki/Sturmer,_Essex",
    "https://en.wikipedia.org/wiki/Steeple_Bumpstead",
    "https://en.wikipedia.org/wiki/Helions_Bumpstead",
    "https://en.wikipedia.org/wiki/Kedington",
    "https://en.wikipedia.org/wiki/Barnardiston",
    "https://en.wikipedia.org/wiki/Great_Thurlow",
    "https://en.wikipedia.org/wiki/Little_Thurlow",
  ],
};

export default haverhill;
