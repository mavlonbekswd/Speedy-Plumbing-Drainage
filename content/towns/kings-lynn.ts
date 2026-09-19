import type { City } from "../../lib/types";

// Organic only. No ad and no keyword may ever point at this page, and the districts below
// deliberately exclude the ones the account excludes, so the page never claims service the
// campaigns refuse. It covers the surrounding area honestly or it does not run at all.
const kingsLynn: City = {
  slug: "kings-lynn",
  name: "King's Lynn",
  county: "Norfolk",
  tier: "organic",
  published: true,
  blurb:
    "Our work here is in the PE33 and PE34 villages around King's Lynn, not in the town. Emergencies, drains and booked jobs, out in the surrounding parishes.",
  placeLabel: "the villages around King's Lynn",
  metaTitle: "Plumber for the Villages Around King's Lynn | Drains, Leaks",
  nearbyTowns: ["downham-market", "swaffham", "wisbech"],
  postcodeDistricts: ["PE33", "PE34"],
  nearbyAreas: [
    "Fincham",
    "Barton Bendish",
    "Oxborough",
    "Stow Bardolph",
    "Clenchwarton",
    "Terrington St Clement",
    "Tilney All Saints",
    "Walpole Cross Keys",
  ],
  localNote:
    "PE33 and PE34 are the two districts here, and the town's own districts are not among them. PE33 sits south, at Fincham and Barton Bendish, where the A1122 crosses the parish, and out at Oxborough in Breckland. PE34 lies west, at Clenchwarton across the Great Ouse and at Terrington St Clement, and it takes in Tilney All Saints and Walpole Cross Keys. The A17 forms Clenchwarton's southern boundary, and the A10 carries on to Stow Bardolph.",
  serviceNotes: {
    emergency:
      "A leak that will not stop brings us out to Clenchwarton, Terrington St Clement, Fincham and the rest of PE33 and PE34. Ring and tell us the parish, the postcode, and where the water is showing.",
    drains:
      "Terrington St Clement sits in drained marshland south of the Wash, on alluvial silt and clay reclaimed from the sea. A blockage out here is still fat, wipes or a broken joint, and a camera survey tells them apart.",
    booked:
      "Booked work runs the same way out here: a tap, a toilet, a shower or hot water, on a date you pick. We take those jobs at Fincham, Stow Bardolph and Walpole Cross Keys.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/PE_postcode_area",
    "https://en.wikipedia.org/wiki/Fincham,_Norfolk",
    "https://en.wikipedia.org/wiki/Barton_Bendish",
    "https://en.wikipedia.org/wiki/Oxborough",
    "https://en.wikipedia.org/wiki/Stow_Bardolph",
    "https://en.wikipedia.org/wiki/Clenchwarton",
    "https://en.wikipedia.org/wiki/Terrington_St_Clement",
    "https://en.wikipedia.org/wiki/Tilney_All_Saints",
    "https://en.wikipedia.org/wiki/Walpole_Cross_Keys",
  ],
};

export default kingsLynn;
