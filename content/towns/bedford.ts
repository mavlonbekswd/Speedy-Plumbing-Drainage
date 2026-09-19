import type { City } from "../../lib/types";

// Organic only. No ad and no keyword may ever point at this page, and the districts below
// deliberately exclude the ones the account excludes, so the page never claims service the
// campaigns refuse. It covers the surrounding area honestly or it does not run at all.
const bedford: City = {
  slug: "bedford",
  name: "Bedford",
  county: "Bedfordshire",
  tier: "organic",
  published: true,
  blurb:
    "Emergency plumbing, drains and booked repairs go to the MK43, MK44 and MK45 villages around Bedford. The town's own districts are not part of what we do.",
  placeLabel: "the villages around Bedford",
  metaTitle: "Plumber for the Villages Around Bedford | Drain and Leak Work",
  nearbyTowns: ["st-neots", "biggleswade", "huntingdon"],
  postcodeDistricts: ["MK43", "MK44", "MK45"],
  nearbyAreas: [
    "Bromham",
    "Oakley",
    "Turvey",
    "Harrold",
    "Sharnbrook",
    "Riseley",
    "Great Barford",
    "Ampthill",
    "Flitwick",
    "Silsoe",
  ],
  localNote:
    "Three districts make up this page: MK43, MK44 and MK45, and the town itself is in none of them. MK43 follows the Great Ouse west to Bromham and north-west to Oakley and Harrold, with the A428 running on through Turvey. MK44 reaches north to Sharnbrook and Riseley, and north-east to Great Barford, which the A421 bypasses. MK45 runs towards Luton, at Ampthill on the A507, at Flitwick, and at Silsoe, which the A6 once ran through.",
  serviceNotes: {
    emergency:
      "We turn out for burst pipes and leaks at Bromham, Oakley, Sharnbrook, Great Barford, Ampthill and the villages with them. Say the village name and the full postcode when you ring, and tell us if the stopcock is already off.",
    drains:
      "Drain work out here is village work, at Bromham, Riseley and Silsoe as much as at Great Barford. Rods reach a blockage near the house, jetting shifts what has built up along a run, and a camera settles the rest.",
    booked:
      "Booked jobs are the quiet half of the work: a tap, a mixer, a toilet, a shower, hot water. We fit them in at Ampthill, Flitwick, Turvey and Harrold.",
  },
  sources: [
    "https://en.wikipedia.org/wiki/MK_postcode_area",
    "https://en.wikipedia.org/wiki/Bromham,_Bedfordshire",
    "https://en.wikipedia.org/wiki/Oakley,_Bedfordshire",
    "https://en.wikipedia.org/wiki/Turvey,_Bedfordshire",
    "https://en.wikipedia.org/wiki/Harrold,_Bedfordshire",
    "https://en.wikipedia.org/wiki/Sharnbrook",
    "https://en.wikipedia.org/wiki/Riseley,_Bedfordshire",
    "https://en.wikipedia.org/wiki/Great_Barford",
    "https://en.wikipedia.org/wiki/Ampthill",
    "https://en.wikipedia.org/wiki/Flitwick",
    "https://en.wikipedia.org/wiki/Silsoe",
  ],
};

export default bedford;
