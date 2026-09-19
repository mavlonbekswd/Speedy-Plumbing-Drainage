import type { BlogPost } from "../../lib/blog";

// Rewritten from the old site's post of the same slug against the claims gate. The meter test's
// thirty minutes survives because it is a step in a procedure the reader carries out, not a
// statistic about anything. The date is the original's. `published` stays false until the copy
// is signed off.
//
// Each `p` holds its paragraphs separated by a blank line; app/blog/[slug]/page.tsx splits on
// that, so no paragraph runs past three sentences on the page.

const post: BlogPost = {
  slug: "signs-of-hidden-leak",
  published: true,
  title: "Six early signs of a hidden water leak",
  excerpt:
    "A hidden leak can run for months before it shows on a ceiling. Six signs, and one meter test you can do yourself, to catch it while it is still small.",
  date: "2026-09-19",
  readingTime: "3 min read",
  body: [
    {
      h: "1. The bill climbs and nothing has changed",
      p: [
        "A water bill that jumps when nothing in the house has changed is the commonest first sign. Nobody moved in, the weather did nothing unusual, and the number still went up.",
        "Water leaving through a split under a floor is metered exactly like water leaving through a tap. Put the last three bills side by side before you decide it is nothing.",
      ].join("\n\n"),
    },
    {
      h: "2. The meter moves when everything is off",
      p: [
        "This is the test that settles it. Turn off every tap and every appliance plumbed into the mains, including the washing machine, then note the reading on your meter.",
        "Wait thirty minutes without using any water and read it again. Movement means water is going somewhere you have not asked it to go.",
        "The same test works if your meter is outside under a cover in the path. Lift the lid, read the dial, put the lid back.",
      ].join("\n\n"),
    },
    {
      h: "3. A damp, musty smell in one place",
      p: [
        "A leak under a floor or behind a wall smells long before it shows. The smell sits in one room, or in one corner of one room, and it does not shift when you open a window.",
        "Your nose is ahead of your eyes here. Plaster and timber hold water for weeks before anything appears on the surface.",
      ].join("\n\n"),
    },
    {
      h: "4. Paint, plaster or skirting that bubbles",
      p: [
        "Bubbling paint, a patch of plaster gone chalky, or a skirting board lifting away from the wall all say the same thing. Water has been sitting there a while.",
        "A stain that comes back after you have painted over it is not a decorating problem. It is a water problem with a decorating symptom.",
      ].join("\n\n"),
    },
    {
      h: "5. A warm patch on the floor",
      p: [
        "Warmth in one spot on a floor usually means a hot water pipe running underneath it is leaking. You feel it barefoot before you see anything at all.",
        "The patch is often nowhere near the tap or shower that pipe feeds, because water follows the pipe and then the joists.",
      ].join("\n\n"),
    },
    {
      h: "6. One tap or shower loses pressure",
      p: [
        "Pressure that has dropped at a single outlet, while the rest of the house is normal, points at something between the main and that fitting. A leak is one of the possibilities, and it is the one that costs you while you think about it.",
        "Pressure that has dropped everywhere is a different question, and it usually starts at the stop tap rather than at a split.",
      ].join("\n\n"),
    },
    {
      h: "Why catching it early matters",
      p: [
        "Water travels. It runs along joists and down inside cavities. The damp patch on your ceiling is often a long way from the split that made it.",
        "Tracing a leak while the evidence is a smell and a meter reading is a small, tidy job. Tracing it after a ceiling has come down is not, and by then a second trade is involved.",
      ].join("\n\n"),
    },
    {
      h: "When to ring a plumber",
      p: [
        "Ring when the meter test moves the dial, when a smell or stain keeps coming back, or when a floor has a warm patch. Each is worth a look on its own.",
        "If water is arriving faster than you can dry it, turn the water off at the stop tap first, then ring.",
        "A plumber answers the phone, day or night. Say which of the signs you have and what you have already tested, and the right kit for tracing it travels with the van.",
      ].join("\n\n"),
    },
  ],
};

export default post;
