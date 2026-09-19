import type { City } from "../../lib/types";

// Skeleton. slug, name, county, tier, postcodeDistricts and nearbyTowns are facts and are set.
// blurb, localNote, serviceNotes, nearbyAreas and sources are written by the town-copy unit,
// each place name verified against a source before it is written. `published` flips to true
// only when all of them are filled: lib/towns.ts asserts that pairing at import.
const march: City = {
  slug: "march",
  name: "March",
  county: "Cambridgeshire",
  tier: 1,
  published: true,
  blurb:
    "March and the rest of PE15 get emergency plumbing, drain work and booked repairs from us, taps and toilets included.",
  metaTitle: "Emergency Plumber March, Cambridgeshire | Drains and Leaks",
  nearbyTowns: ["chatteris", "wisbech", "ely", "peterborough"],
  postcodeDistricts: ["PE15"],
  nearbyAreas: [
    "Westry",
    "Knight's End",
    "Wimblington",
    "Doddington",
    "Manea",
    "Benwick",
    "Stonea",
    "Eastwood End",
  ],
  localNote:
    "PE15 is the one district here, and it holds March itself along with Westry and Knight's End. South of the town it reaches Wimblington and Doddington, and Eastwood End in the Wimblington parish. Benwick lies south-west on the old course of the River Nene, Manea and Stonea south-east. The A141 skirts the town on a bypass, while the B1099 and B1101 run through it.",
  serviceNotes: {
    emergency:
      "Water running where it should not is the same call from Westry or Knight's End as it is from Manea or Benwick. Say what you can see, and whether you have already turned the water off at the stopcock.",
    drains:
      "March is a Fenland town, and a drain run on flat fen ground often has little fall in it, so waste moves slowly. Silt settles in a run like that, which is why jetting clears it where rods only push the blockage along.",
    booked:
      "Booked jobs here are taps, toilets, showers and hot water, fitted or repaired on a day you choose rather than a day we choose.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/PE_postcode_area",
    "https://en.wikipedia.org/wiki/March,_Cambridgeshire",
    "https://en.wikipedia.org/wiki/Wimblington",
    "https://en.wikipedia.org/wiki/Doddington,_Cambridgeshire",
    "https://en.wikipedia.org/wiki/Manea,_Cambridgeshire",
    "https://en.wikipedia.org/wiki/Benwick",
    "https://en.wikipedia.org/wiki/Stonea",
    "https://api.postcodes.io/places?q=Westry",
    "https://api.postcodes.io/places?q=Knights%20End",
    "https://api.postcodes.io/places?q=Stonea",
    "https://api.openstreetmap.org/api/0.6/map?bbox=0.0900,52.5090,0.1050,52.5200",
    "https://api.postcodes.io/postcodes?lon=0.0940812&lat=52.5153378",
  ],
};

export default march;
