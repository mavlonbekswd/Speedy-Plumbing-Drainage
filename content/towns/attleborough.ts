import type { City } from "../../lib/types";

// Skeleton. slug, name, county, tier, postcodeDistricts and nearbyTowns are facts and are set.
// blurb, localNote, serviceNotes, nearbyAreas and sources are written by the town-copy unit,
// each place name verified against a source before it is written. `published` flips to true
// only when all of them are filled: lib/towns.ts asserts that pairing at import.
const attleborough: City = {
  slug: "attleborough",
  name: "Attleborough",
  county: "Norfolk",
  tier: 1,
  published: true,
  blurb:
    "Attleborough and the parishes that share NR17 get the same from us: emergency plumbing, drain work and repairs you book ahead.",
  metaTitle: "Emergency Plumber Attleborough | Drains, Leaks and Taps",
  nearbyTowns: ["thetford", "diss", "watton"],
  postcodeDistricts: ["NR17"],
  nearbyAreas: [
    "Besthorpe",
    "Great Ellingham",
    "Little Ellingham",
    "Old Buckenham",
    "Caston",
    "Rockland All Saints",
    "Stow Bedon",
  ],
  localNote:
    "Attleborough and the parishes around it share a single postcode district, NR17. Besthorpe is about a mile east of the town on the A11, the road between Norwich and Thetford. Great Ellingham, Little Ellingham, Caston, Stow Bedon, Rockland All Saints and Old Buckenham are in NR17 as well. The A11 has bypassed the town since 1984, and the B1077 links it to Old Buckenham and on towards Ipswich.",
  serviceNotes: {
    emergency:
      "When a pipe lets go we come out to Attleborough itself, and to Besthorpe, Great Ellingham and Old Buckenham. Say which room the water is in, give us the postcode, and tell us if a ceiling is holding it.",
    drains:
      "Kitchen waste is the usual cause of a blocked drain, in the town and in the NR17 villages alike. We jet the line and then check it with a camera, so you know it is clear and not just moved along.",
    booked:
      "Taps that drip, toilets that run and showers that have gone cold are booked in advance, here and out in the villages.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/NR_postcode_area",
    "https://en.wikipedia.org/wiki/Attleborough,_Norfolk",
    "https://en.wikipedia.org/wiki/Besthorpe,_Norfolk",
    "https://en.wikipedia.org/wiki/Great_Ellingham",
    "https://en.wikipedia.org/wiki/Little_Ellingham",
    "https://en.wikipedia.org/wiki/Old_Buckenham",
    "https://en.wikipedia.org/wiki/Caston",
    "https://en.wikipedia.org/wiki/Rockland_All_Saints",
    "https://en.wikipedia.org/wiki/Stow_Bedon",
    "https://en.wikipedia.org/wiki/Diss,_Norfolk",
  ],
};

export default attleborough;
