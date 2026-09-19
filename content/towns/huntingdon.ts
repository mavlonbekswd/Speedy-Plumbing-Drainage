import type { City } from "../../lib/types";

// Skeleton. slug, name, county, tier, postcodeDistricts and nearbyTowns are facts and are set.
// blurb, localNote, serviceNotes, nearbyAreas and sources are written by the town-copy unit,
// each place name verified against a source before it is written. `published` flips to true
// only when all of them are filled: lib/towns.ts asserts that pairing at import.
const huntingdon: City = {
  slug: "huntingdon",
  name: "Huntingdon",
  county: "Cambridgeshire",
  tier: 1,
  published: true,
  blurb:
    "Speedy takes on emergency plumbing, drain work and booked repairs in Huntingdon, Godmanchester and the PE28 villages around them.",
  metaTitle: "Emergency Plumber Huntingdon | Drain Clearing and Leaks",
  nearbyTowns: ["st-ives", "st-neots", "chatteris"],
  postcodeDistricts: ["PE28", "PE29"],
  nearbyAreas: [
    "Godmanchester",
    "Hartford",
    "Brampton",
    "Alconbury",
    "Great Stukeley",
    "Little Stukeley",
    "Houghton",
    "Warboys",
    "Somersham",
  ],
  localNote:
    "Most of Huntingdon is PE29, while PE28 takes the outskirts and the villages past them. Hartford is east of the town on the A141, and Godmanchester lies south, over the River Great Ouse. PE28 reaches north-west to Great Stukeley, Little Stukeley and Alconbury, south-west to Brampton, and north-east to Warboys, with Houghton and Somersham east. The A14 now bypasses the town and runs parallel to the A1 past Brampton, while the A1307 crosses to Godmanchester.",
  serviceNotes: {
    emergency:
      "A pipe that has let go floods a house quickly, in Hartford or Godmanchester as much as out at Brampton and Alconbury. Tell us the road, whether it is PE28 or PE29, and whether you have found the stop tap yet.",
    drains:
      "A Huntingdon drain that gurgles at one gully and backs up at another is telling you the blockage lies further down the run. We open the last manhole and work back up the line, so the rods or the jet go in at the right point.",
    booked:
      "Booked jobs get a date and a slot in Huntingdon: a tap that drips, a toilet that keeps filling, a shower, or hot water.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/PE_postcode_area",
    "https://en.wikipedia.org/wiki/Huntingdon",
    "https://en.wikipedia.org/wiki/Godmanchester",
    "https://en.wikipedia.org/wiki/Hartford,_Cambridgeshire",
    "https://en.wikipedia.org/wiki/Brampton,_Cambridgeshire",
    "https://en.wikipedia.org/wiki/Alconbury",
    "https://en.wikipedia.org/wiki/Great_Stukeley",
    "https://en.wikipedia.org/wiki/Little_Stukeley",
    "https://en.wikipedia.org/wiki/Houghton,_Cambridgeshire",
    "https://en.wikipedia.org/wiki/Warboys",
    "https://en.wikipedia.org/wiki/Somersham,_Cambridgeshire",
    "https://en.wikipedia.org/wiki/A14_road_(England)",
  ],
};

export default huntingdon;
