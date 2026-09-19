import type { City } from "../../lib/types";

// Skeleton. slug, name, county, tier, postcodeDistricts and nearbyTowns are facts and are set.
// blurb, localNote, serviceNotes, nearbyAreas and sources are written by the town-copy unit,
// each place name verified against a source before it is written. `published` flips to true
// only when all of them are filled: lib/towns.ts asserts that pairing at import.
const watton: City = {
  slug: "watton",
  name: "Watton",
  county: "Norfolk",
  tier: 1,
  published: true,
  blurb:
    "Watton and the IP25 villages get emergency plumbing, drain clearing and booked repairs from us, whichever of them you are ringing from.",
  metaTitle: "Emergency Plumber Watton | Blocked Drains and Burst Pipes",
  nearbyTowns: ["swaffham", "thetford", "attleborough"],
  postcodeDistricts: ["IP25"],
  nearbyAreas: [
    "Saham Toney",
    "Ovington",
    "Carbrooke",
    "Griston",
    "Shipdham",
    "Ashill",
    "Merton",
    "Little Cressingham",
    "Great Cressingham",
  ],
  localNote:
    "IP25 is addressed through Thetford, though Watton lies about fifteen miles north-east of it. Saham Toney lies north-west of the town, Ovington north, Carbrooke north-east and Griston south-east. The same district reaches out to Shipdham, Ashill, Merton and both Cressinghams. The A1075 from Dereham to Thetford and the B1108 from Brandon to Norwich cross at Watton.",
  serviceNotes: {
    emergency:
      "A leak that will not stop brings us to Watton, Saham Toney, Carbrooke and Griston alike. Ring us, say what is leaking and where the water is going, and keep your postcode to hand.",
    drains:
      "A village run can be a long one, so in IP25 we work out where the blockage sits before choosing rods or the jet. Getting that order right means the drain is cleared once rather than disturbed twice.",
    booked:
      "Hot water, taps, toilets and showers are booked work rather than emergencies. You pick the day, in Watton or out in the villages.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/IP_postcode_area",
    "https://en.wikipedia.org/wiki/Watton,_Norfolk",
    "https://en.wikipedia.org/wiki/Saham_Toney",
    "https://en.wikipedia.org/wiki/Ovington,_Norfolk",
    "https://en.wikipedia.org/wiki/Carbrooke",
    "https://en.wikipedia.org/wiki/Griston",
    "https://en.wikipedia.org/wiki/Shipdham",
    "https://en.wikipedia.org/wiki/Ashill,_Norfolk",
    "https://en.wikipedia.org/wiki/Merton,_Norfolk",
    "https://en.wikipedia.org/wiki/Little_Cressingham",
    "https://en.wikipedia.org/wiki/Great_Cressingham",
  ],
};

export default watton;
