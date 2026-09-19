import type { City } from "../../lib/types";

// Skeleton. slug, name, county, tier, postcodeDistricts and nearbyTowns are facts and are set.
// blurb, localNote, serviceNotes, nearbyAreas and sources are written by the town-copy unit,
// each place name verified against a source before it is written. `published` flips to true
// only when all of them are filled: lib/towns.ts asserts that pairing at import.
const thetford: City = {
  slug: "thetford",
  name: "Thetford",
  county: "Norfolk",
  tier: 1,
  published: true,
  blurb:
    "We take emergency plumbing, drains and booked repairs in Thetford and the IP24 villages around it, in Norfolk and over the Suffolk line.",
  metaTitle: "Emergency Plumber Thetford | Drain Clearing and Pipe Repairs",
  nearbyTowns: ["brandon", "attleborough", "diss", "watton"],
  postcodeDistricts: ["IP24"],
  nearbyAreas: [
    "Barnham",
    "Euston",
    "Elveden",
    "Kilverstone",
    "Brettenham",
    "Rushford",
    "Wretham",
    "Great Hockham",
  ],
  localNote:
    "Thetford is IP24, on the River Little Ouse, with the A11 running past toward Norwich and London. The A134 from Colchester to King's Lynn and the A1066 toward Diss also reach the town. IP24 goes south into Suffolk at Barnham on the A134 and Euston on the A1088, and takes in Elveden by the A11. East of the town it holds Brettenham and Rushford, with Kilverstone, Wretham and Great Hockham also in the district.",
  serviceNotes: {
    emergency:
      "A burst pipe brings us out to Barnham, Euston, Brettenham and Great Hockham, whichever county you are in. Tell us the village and the road, and whether the water is clean or coming from a waste pipe.",
    drains:
      "When a Thetford drain backs up into a shower tray or a downstairs toilet, the blockage is past the fittings, in the run. We clear it from the chamber on that run, at Barnham, Euston and Great Hockham as readily as in the town.",
    booked:
      "Booked work is the unhurried half of the job: fitting taps, swapping a shower, sorting a toilet, putting hot water right. Elveden, Kilverstone and Wretham are in that diary too.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/IP_postcode_area",
    "https://en.wikipedia.org/wiki/Thetford",
    "https://en.wikipedia.org/wiki/Barnham,_Suffolk",
    "https://en.wikipedia.org/wiki/Euston,_Suffolk",
    "https://en.wikipedia.org/wiki/Elveden",
    "https://en.wikipedia.org/wiki/Kilverstone",
    "https://en.wikipedia.org/wiki/Brettenham,_Norfolk",
    "https://en.wikipedia.org/wiki/Rushford,_Norfolk",
    "https://en.wikipedia.org/wiki/East_Wretham",
    "https://en.wikipedia.org/wiki/Great_Hockham",
  ],
};

export default thetford;
