import type { Illustration, WorkPhoto, WorkVideo } from "./types";

// PROVENANCE
// Supplied by the owner on 18 and 19 September 2026 as Speedy's own plumbers' work, from
// ~/Downloads/telegram/untitled folder (recorded in ARIM/speedy/claims-evidence/real-job-photos.md).
// Written customer consent to publish is still owed, so `consentOnFile` is false throughout.
//
// CAPTION RULES (owner decisions 12, 13, 15 of 19 Sept, plus the claims register)
// - A caption says what is in the frame and nothing else.
// - Never a town, a brand, a date, a response time or a price. No town is evidenced for any job.
// - Never "boiler", "gas", "central heating", "unvented", "G3" or any credential word.
//   "Hot water cylinder" is allowed: cylinders are in scope and under the guarantee.
// - Three files are crops: another firm's sticker, a supplier's phone label and an oil boiler
//   were cut out of frame. Stills prefixed drain-jetting- and pipework-under-floor come from
//   the owner's own video clips.
// - van-illustration is AI-made. It renders only with a visible "Illustration" label, never in a
//   job gallery, and nothing in this folder goes to Google Ads as an image asset unlabelled.
const SEPT_18 = { suppliedBy: "owner", suppliedOn: "2026-09-18", ownJob: true, consentOnFile: false } as const;
const SEPT_19 = { suppliedBy: "owner", suppliedOn: "2026-09-19", ownJob: true, consentOnFile: false } as const;

const portrait = { width: 960, height: 1280 } as const;

export const WORK_PHOTOS: readonly WorkPhoto[] = [
  { slug: "new-bath-white-tile", file: "/work/new-bath-white-tile.webp", ...portrait, group: "bathroom", caption: "New bath and mixer taps fitted", alt: "A new white bath with chrome mixer taps and a shower hose, fitted against white tiled walls", provenance: SEPT_18 },
  { slug: "shower-over-bath", file: "/work/shower-over-bath.webp", ...portrait, group: "bathroom", caption: "Shower fitted over a new bath", alt: "A chrome bar shower and riser rail fitted above a new bath with grey tiled walls", provenance: SEPT_19 },
  { slug: "bath-shower-grey-tile", file: "/work/bath-shower-grey-tile.webp", width: 1280, height: 960, group: "bathroom", caption: "Bath, screen and shower installed", alt: "A finished bath with a glass screen, bar shower and grey wall tiles", provenance: SEPT_18 },
  { slug: "shower-enclosure", file: "/work/shower-enclosure.webp", ...portrait, group: "bathroom", caption: "Shower enclosure being finished", alt: "A new shower enclosure with marble-effect wall panels and a chrome shower, tools still in the tray", provenance: SEPT_19 },
  { slug: "bath-taps-swap", file: "/work/bath-taps-swap.webp", ...portrait, group: "taps", caption: "Bath taps being replaced", alt: "A new brass tap set laid out beside a bath with its panel removed for access to the pipework", provenance: SEPT_18 },
  { slug: "kitchen-mixer-tap", file: "/work/kitchen-mixer-tap.webp", ...portrait, group: "taps", caption: "Kitchen mixer tap fitted and running", alt: "A black kitchen mixer tap running into a white ceramic sink", provenance: SEPT_18 },
  { slug: "outside-tap", file: "/work/outside-tap.webp", ...portrait, group: "taps", caption: "Outside tap being fitted", alt: "A gloved hand holding a new brass outside tap next to its wall plate on a brick wall", provenance: SEPT_19 },
  { slug: "new-toilet", file: "/work/new-toilet.webp", ...portrait, group: "toilets", caption: "New toilet and cistern fitted", alt: "A new white close-coupled toilet fitted in a small cloakroom", provenance: SEPT_18 },
  { slug: "under-sink-wastes", file: "/work/under-sink-wastes.webp", ...portrait, group: "leaks", caption: "Waste pipes and valves under a kitchen sink", alt: "White waste pipes, traps and isolation valves neatly plumbed under a double kitchen sink", provenance: SEPT_19 },
  { slug: "water-supply-pipe", file: "/work/water-supply-pipe.webp", ...portrait, group: "supply", caption: "Leaking water supply pipe replaced", alt: "A new length of blue water supply pipe joined into the old pipe at the bottom of a hand-dug hole", provenance: SEPT_19 },
  { slug: "pipework-under-floor", file: "/work/pipework-under-floor.webp", width: 720, height: 1280, group: "leaks", caption: "Pipework exposed under the floorboards", alt: "Copper pipes running between floor joists with the floorboards lifted to reach them", provenance: SEPT_18 },
  { slug: "drain-jetting-manhole", file: "/work/drain-jetting-manhole.webp", width: 464, height: 848, group: "drains", caption: "Drain being jetted through an open manhole", alt: "A jetting hose running into a brick inspection chamber with its cover lifted", provenance: SEPT_18 },
  { slug: "drain-jetting-hose", file: "/work/drain-jetting-hose.webp", width: 464, height: 848, group: "drains", caption: "Jetting hose clearing the drain run", alt: "A high-pressure hose feeding down the channel of an open inspection chamber in a paved path", provenance: SEPT_18 },
  { slug: "hot-water-system-cupboard", file: "/work/hot-water-system-cupboard.webp", ...portrait, group: "hot-water", caption: "Hot water cylinder and pipework", alt: "A white hot water cylinder in an airing cupboard with copper pipework and valves", provenance: SEPT_18 },
  { slug: "hot-water-system-loft", file: "/work/hot-water-system-loft.webp", ...portrait, group: "hot-water", caption: "Hot water cylinders with insulated pipework", alt: "Two grey hot water cylinders with insulated pipes in a loft cupboard", provenance: SEPT_19 },
  { slug: "hot-water-thermostat", file: "/work/hot-water-thermostat.webp", width: 720, height: 1280, group: "hot-water", caption: "Immersion heater thermostat on a hot water cylinder", alt: "The thermostat of an immersion heater with its cover off, mounted on a hot water cylinder", provenance: SEPT_18 },
  { slug: "safety-valve", file: "/work/safety-valve.webp", ...portrait, group: "hot-water", caption: "Replacement safety valve beside the old one", alt: "A hand holding a new brass safety valve next to the one it replaces on insulated pipework", provenance: SEPT_19 },
  { slug: "pump-and-pipework", file: "/work/pump-and-pipework.webp", ...portrait, group: "heating-parts", caption: "Pump and valves beside a hot water cylinder", alt: "A pump, a gate valve and pipework in a cupboard beside a hot water cylinder", provenance: SEPT_18 },
  { slug: "pump-and-valves", file: "/work/pump-and-valves.webp", width: 530, height: 1180, group: "heating-parts", caption: "Pump and isolation valves", alt: "A red pump with brass isolation valves on painted steel pipework", provenance: SEPT_18 },
  { slug: "motorised-valves", file: "/work/motorised-valves.webp", ...portrait, group: "heating-parts", caption: "Two motorised valves on steel pipework", alt: "Two white motorised valves fitted to painted steel pipes above a carpeted floor", provenance: SEPT_18 },
  { slug: "pressure-gauge", file: "/work/pressure-gauge.webp", ...portrait, group: "heating-parts", caption: "Pressure gauge and relief valve", alt: "A pressure gauge and a red-capped relief valve on copper pipework", provenance: SEPT_19 },
  { slug: "washing-machine", file: "/work/washing-machine.webp", width: 450, height: 900, group: "taps", caption: "Washing machine plumbed in", alt: "A white washing machine plumbed in under a worktop on a wood-effect floor", provenance: SEPT_19 },
  { slug: "water-filter-housing", file: "/work/water-filter-housing.webp", width: 520, height: 690, group: "taps", caption: "Water filter housing ready to fit", alt: "A blue and white water filter housing on a kitchen worktop before fitting", provenance: SEPT_18 },
  { slug: "van-illustration", file: "/work/van-illustration.webp", width: 1280, height: 853, group: "brand", illustration: true, caption: "Illustration", alt: "An illustration of a white Speedy Plumbing & Drain van parked on a residential street", provenance: { ...SEPT_18, ownJob: false } },
];

const clip = { width: 464, height: 848 } as const;

export const WORK_VIDEOS: readonly WorkVideo[] = [
  { slug: "drain-jetting", file: "/work/drain-jetting.mp4", poster: "/work/drain-jetting-poster.webp", ...clip, seconds: 16, group: "drains", label: "Watch a drain being jetted", caption: "A blocked drain being jetted through the manhole", provenance: SEPT_18 },
  { slug: "pipework-under-floor", file: "/work/pipework-under-floor.mp4", poster: "/work/pipework-under-floor-poster.webp", width: 464, height: 824, seconds: 5, group: "leaks", label: "Watch the pipework under a lifted floor", caption: "Copper pipework reached by lifting the floorboards", provenance: SEPT_18 },
  { slug: "toilet-flush-test", file: "/work/toilet-flush-test.mp4", poster: "/work/toilet-flush-test-poster.webp", ...clip, seconds: 10, group: "toilets", label: "Watch a repaired toilet being flush tested", caption: "A high-level cistern toilet flush tested after repair", provenance: SEPT_18 },
  { slug: "electric-shower-test", file: "/work/electric-shower-test.mp4", poster: "/work/electric-shower-test-poster.webp", ...clip, seconds: 38, group: "bathroom", label: "Watch a new shower being tested", caption: "An electric shower run and tested after fitting", provenance: SEPT_19 },
  { slug: "bathroom-refit", file: "/work/bathroom-refit.mp4", poster: "/work/bathroom-refit-poster.webp", ...clip, seconds: 9, group: "bathroom", label: "Watch a finished bathroom refit", caption: "New toilet, basin and bath in a refitted bathroom", provenance: SEPT_19 },
  { slug: "downpipe-fitted", file: "/work/downpipe-fitted.mp4", poster: "/work/downpipe-fitted-poster.webp", ...clip, seconds: 4, group: "supply", label: "Watch a new downpipe", caption: "A new gutter downpipe fitted to a brick wall", provenance: SEPT_19 },
];

export const PHOTO_BY_SLUG: Readonly<Record<string, WorkPhoto>> = Object.fromEntries(
  WORK_PHOTOS.map((p) => [p.slug, p]),
);
export const VIDEO_BY_SLUG: Readonly<Record<string, WorkVideo>> = Object.fromEntries(
  WORK_VIDEOS.map((v) => [v.slug, v]),
);

/** Job photos only. The illustration is never part of a gallery. */
export const JOB_PHOTOS: readonly WorkPhoto[] = WORK_PHOTOS.filter((p) => !p.illustration);

// Six for the home page and any page without its own set: strongest first and last.
export const FEATURED_PHOTO_SLUGS = [
  "new-bath-white-tile",
  "drain-jetting-manhole",
  "kitchen-mixer-tap",
  "new-toilet",
  "pipework-under-floor",
  "shower-over-bath",
] as const;

// ILLUSTRATIONS
// AI-generated drawings (Higgsfield, 19 Sept 2026), made because the owner has no photographs of
// an emergency or a blocked drain. They show the PROBLEM a customer is looking at, never a job
// Speedy did, and they are drawn, flat and in the brand colours so nobody could take one for a
// photograph. Rules: always under a visible "Illustration" label; never inside a proof strip or
// on /projects; never a caption that claims a job, a place or a result; and never uploaded to
// Google Ads as an image asset without an in-creative AI label (Google policy, July 2026).
const drawn = { width: 1200, height: 904 } as const;

export const ILLUSTRATIONS: readonly Illustration[] = [
  { slug: "burst-pipe-under-sink", file: "/illustrations/burst-pipe-under-sink.webp", ...drawn, caption: "A split pipe under the sink", alt: "Illustration of a split copper pipe spraying water under a kitchen sink, with a bucket and towels catching it" },
  { slug: "turning-off-the-stopcock", file: "/illustrations/turning-off-the-stopcock.webp", ...drawn, caption: "Turning the water off at the stopcock", alt: "Illustration of a gloved hand turning a brass stopcock on a copper pipe to shut the water off" },
  { slug: "water-through-the-ceiling", file: "/illustrations/water-through-the-ceiling.webp", ...drawn, caption: "Water coming through a ceiling", alt: "Illustration of a water stain on a living room ceiling dripping into a bucket on the floor" },
  { slug: "blocked-outside-drain", file: "/illustrations/blocked-outside-drain.webp", ...drawn, caption: "A blocked outside drain backing up", alt: "Illustration of a blocked gully at the foot of a brick wall overflowing across paving slabs" },
  { slug: "cctv-drain-survey", file: "/illustrations/cctv-drain-survey.webp", ...drawn, caption: "A camera survey of a drain run", alt: "Illustration of a drain camera reel feeding a cable into an open manhole, with a screen showing the inside of the pipe" },
  { slug: "blocked-kitchen-sink", file: "/illustrations/blocked-kitchen-sink.webp", ...drawn, caption: "A sink that will not drain", alt: "Illustration of a kitchen sink full of murky standing water with a plunger on the worktop" },
];

export const ILLUSTRATION_BY_SLUG: Readonly<Record<string, Illustration>> = Object.fromEntries(
  ILLUSTRATIONS.map((i) => [i.slug, i]),
);
