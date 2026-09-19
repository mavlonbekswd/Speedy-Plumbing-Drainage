import type { City } from "../../lib/types";

// Skeleton. slug, name, county, tier, postcodeDistricts and nearbyTowns are facts and are set.
// blurb, localNote, serviceNotes, nearbyAreas and sources are written by the town-copy unit,
// each place name verified against a source before it is written. `published` flips to true
// only when all of them are filled: lib/towns.ts asserts that pairing at import.
const chatteris: City = {
  slug: "chatteris",
  name: "Chatteris",
  county: "Cambridgeshire",
  tier: 1,
  published: true,
  blurb:
    "Chatteris is PE16, and we work all of it: emergency plumbing when something bursts, drain clearing, and the smaller jobs you book ahead.",
  metaTitle: "Emergency Plumber Chatteris | Drain Clearing and Leak Repair",
  nearbyTowns: ["march", "ely", "huntingdon"],
  postcodeDistricts: ["PE16"],
  nearbyAreas: ["Swingbrow", "Horseley Fen", "Wenny Severals", "Horseway"],
  localNote:
    "One district, PE16, holds Chatteris and the fen around it. Swingbrow lies north-west of the town, along the Forty Foot Drain. Horseley Fen is south, Wenny Severals south-east, and Horseway east over towards Manea. Chatteris is a turning point on the A141, the A142 starts here for Ely, and the B1050 runs to Bar Hill.",
  serviceNotes: {
    emergency:
      "A leak that will not wait brings us into Chatteris and out to Horseway, Swingbrow or Wenny Severals. When you ring, give us the postcode and say which room the water is coming into.",
    drains:
      "The Forty Foot and Sixteen Foot Drains take the land water here, but they do nothing for the foul run from your house. A blocked gully or a slow toilet is a job for rods, a jet or a camera, and we bring all three.",
    booked:
      "Plenty of work in Chatteris is not urgent at all. A new tap, a toilet reseated, a shower that has lost its pressure, a hot water fault: these are booked in. You pick the morning or the afternoon.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/PE_postcode_area",
    "https://en.wikipedia.org/wiki/Chatteris",
    "https://en.wikipedia.org/wiki/Swingbrow",
    "https://api.postcodes.io/places?q=Swingbrow",
    "https://api.postcodes.io/places?q=Wenny",
    "https://api.postcodes.io/places?q=Horseway",
    "https://nominatim.openstreetmap.org/search?q=Horseley+Fen%2C+Cambridgeshire&format=jsonv2",
  ],
};

export default chatteris;
