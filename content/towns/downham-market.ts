import type { City } from "../../lib/types";

// Skeleton. slug, name, county, tier, postcodeDistricts and nearbyTowns are facts and are set.
// blurb, localNote, serviceNotes, nearbyAreas and sources are written by the town-copy unit,
// each place name verified against a source before it is written. `published` flips to true
// only when all of them are filled: lib/towns.ts asserts that pairing at import.
const downhamMarket: City = {
  slug: "downham-market",
  name: "Downham Market",
  county: "Norfolk",
  tier: 1,
  published: true,
  blurb:
    "Downham Market is one of the Norfolk towns we work in, for emergency plumbing, drains and booked repairs, along with the PE38 villages.",
  metaTitle: "Emergency Plumber Downham Market | Drains and Hot Water",
  nearbyTowns: ["swaffham", "wisbech", "ely", "kings-lynn"],
  postcodeDistricts: ["PE38"],
  nearbyAreas: [
    "Denver",
    "Bexwell",
    "Ryston",
    "Hilgay",
    "Southery",
    "Fordham",
    "Nordelph",
    "Salters Lode",
  ],
  localNote:
    "Downham Market is PE38, on the edge of the Fens and on the River Great Ouse. Denver has the sluice that holds the line between the tidal and non-tidal Great Ouse. Bexwell, Ryston, Hilgay, Southery, Fordham, Nordelph and Salters Lode share the district. The A10 runs north and south through the town, and the east to west A1122 from Outwell to Swaffham passes south of it.",
  serviceNotes: {
    emergency:
      "Water where it should not be gets us out to Denver, Hilgay, Southery and Nordelph as well as the town. Say whether it is clean water or drain water, and give us the postcode when you ring.",
    drains:
      "The town is on the edge of the Fens, and a drain run laid on fen ground can settle and lose its fall. A camera survey is what shows it, and it tells a blockage apart from a run at fault.",
    booked:
      "A tap, a toilet, a shower or hot water goes in the diary for a set day, here or out at Hilgay and Denver.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/PE_postcode_area",
    "https://en.wikipedia.org/wiki/Downham_Market",
    "https://en.wikipedia.org/wiki/Denver,_Norfolk",
    "https://en.wikipedia.org/wiki/Bexwell",
    "https://en.wikipedia.org/wiki/Ryston",
    "https://en.wikipedia.org/wiki/Hilgay",
    "https://en.wikipedia.org/wiki/Southery",
    "https://en.wikipedia.org/wiki/Fordham,_Norfolk",
    "https://en.wikipedia.org/wiki/Nordelph",
    "https://en.wikipedia.org/wiki/Salters_Lode",
  ],
};

export default downhamMarket;
