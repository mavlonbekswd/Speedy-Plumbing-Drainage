import type { City } from "../../lib/types";

// Skeleton. slug, name, county, tier, postcodeDistricts and nearbyTowns are facts and are set.
// blurb, localNote, serviceNotes, nearbyAreas and sources are written by the town-copy unit,
// each place name verified against a source before it is written. `published` flips to true
// only when all of them are filled: lib/towns.ts asserts that pairing at import.
const stIves: City = {
  slug: "st-ives",
  name: "St Ives",
  county: "Cambridgeshire",
  tier: 1,
  published: true,
  blurb:
    "Speedy takes emergency plumbing, drains and booked repairs in St Ives and in the two villages that share PE27 with it.",
  metaTitle: "Emergency Plumber St Ives | Blocked Drains and Leak Repair",
  nearbyTowns: ["huntingdon", "cambridge", "st-neots"],
  postcodeDistricts: ["PE27"],
  nearbyAreas: ["Needingworth", "Holywell", "Slepe Meadow", "The Spires"],
  localNote:
    "PE27 is a small district: St Ives on the River Great Ouse, with Needingworth east and Holywell just south-east of it. Within the town it takes in Slepe Meadow and The Spires. The A1307 links the town to the A14 to the south, and the guided busway runs from here to Cambridge.",
  serviceNotes: {
    emergency:
      "A pipe that has let go does not wait, in the town or out at Needingworth and Holywell. Ring us, give the road and postcode, and say whether you can reach the stop tap.",
    drains:
      "Where several houses share one drain run, a blockage shows up at the lowest gully first, which is rarely where the trouble started. We camera the run before deciding whether rods or a jet is the right tool.",
    booked:
      "Booked work here means taps, toilets, showers and hot water, arranged in advance so you are not waiting in all day.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/PE_postcode_area",
    "https://en.wikipedia.org/wiki/St_Ives,_Cambridgeshire",
    "https://en.wikipedia.org/wiki/Needingworth",
    "https://en.wikipedia.org/wiki/Holywell,_Cambridgeshire",
    "https://api.postcodes.io/places?q=Needingworth",
    "https://nominatim.openstreetmap.org/search?q=Slepe+Meadow%2C+St+Ives%2C+Cambridgeshire&format=jsonv2",
    "https://nominatim.openstreetmap.org/search?q=The+Spires%2C+St+Ives%2C+Cambridgeshire&format=jsonv2",
    "https://api.postcodes.io/postcodes?lon=-0.0946701&lat=52.3339189",
    "https://api.postcodes.io/postcodes?lon=-0.0906086&lat=52.3315906",
    "https://api.openstreetmap.org/api/0.6/map?bbox=-0.1050,52.3270,-0.0900,52.3390",
    "https://api.postcodes.io/postcodes?lon=-0.0946531&lat=52.3271932",
  ],
};

export default stIves;
