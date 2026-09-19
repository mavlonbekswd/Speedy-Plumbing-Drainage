import type { City } from "../../lib/types";

// Organic only. No ad and no keyword may ever point at this page, and the districts below
// deliberately exclude the ones the account excludes, so the page never claims service the
// campaigns refuse. It covers the surrounding area honestly or it does not run at all.
const peterborough: City = {
  slug: "peterborough",
  name: "Peterborough",
  county: "Cambridgeshire",
  tier: "organic",
  published: true,
  blurb:
    "We work in the PE6, PE7 and PE8 villages around Peterborough, not in the city itself. Emergency plumbing, drains and booked repairs, out in those districts.",
  placeLabel: "the villages around Peterborough",
  metaTitle: "Plumber for the Villages Around Peterborough | Leaks and Drains",
  nearbyTowns: ["stamford", "march", "huntingdon", "chatteris"],
  postcodeDistricts: ["PE6", "PE7", "PE8"],
  nearbyAreas: [
    "Glinton",
    "Crowland",
    "Market Deeping",
    "Yaxley",
    "Stilton",
    "Whittlesey",
    "Oundle",
    "Wansford",
    "Nassington",
  ],
  localNote:
    "This page is PE6, PE7 and PE8 only, and the city districts are not among them. PE6 is the northern one, at Glinton and Crowland, and it reaches Market Deeping on the A15 by the River Welland. PE7 runs south to Yaxley and Stilton and east to Whittlesey, which the A605 serves. PE8 lies south-west at Oundle, and follows the River Nene through Nassington and Wansford, where the A1 passes.",
  serviceNotes: {
    emergency:
      "A burst pipe brings us out to Yaxley, Stilton, Whittlesey, Glinton and the PE8 villages along the Nene. When you ring, say which village you are in, give the full postcode, and say if water is still coming through.",
    drains:
      "Whittlesey and Crowland stand in the Fens, and a drain run on fen ground can move and drop out of line. A camera survey shows that, and it shows it before any guesswork starts.",
    booked:
      "A tap, a toilet, a shower or hot water can be booked ahead rather than rushed. We put those jobs in the diary for Oundle, Market Deeping and the PE7 villages.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/PE_postcode_area",
    "https://en.wikipedia.org/wiki/Glinton,_Cambridgeshire",
    "https://en.wikipedia.org/wiki/Crowland",
    "https://en.wikipedia.org/wiki/Market_Deeping",
    "https://en.wikipedia.org/wiki/Yaxley,_Cambridgeshire",
    "https://en.wikipedia.org/wiki/Stilton",
    "https://en.wikipedia.org/wiki/Whittlesey",
    "https://en.wikipedia.org/wiki/Oundle",
    "https://en.wikipedia.org/wiki/Wansford,_Cambridgeshire",
    "https://en.wikipedia.org/wiki/Nassington",
    "https://en.wikipedia.org/wiki/The_Fens",
  ],
};

export default peterborough;
