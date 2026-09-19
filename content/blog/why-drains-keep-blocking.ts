import type { BlogPost } from "../../lib/blog";

// Rewritten 19 September 2026 on the owner's note that the advice pages read like copywriting.
// The old opener about symptoms and diagnosis was scene-setting and has gone: the post now starts
// at the thing the reader is doing wrong in their own kitchen. No claim, no figure, no timing.
// The date and the slug are the original's.
//
// Each `p` holds its paragraphs separated by a blank line; app/blog/[slug]/page.tsx splits on
// that, so no paragraph runs past three sentences on the page.

const post: BlogPost = {
  slug: "why-drains-keep-blocking",
  published: true,
  title: "Why your drain keeps blocking",
  excerpt:
    "Fat sets hard on the wall of the pipe and wipes catch on anything rough. Sometimes it is the pipe. What to change at the sink, and what a camera finds.",
  date: "2026-09-19",
  readingTime: "2 min read",
  body: [
    {
      h: "Fat is the usual one",
      p: [
        "Fat goes down the sink as a liquid and does not stay one. It cools on the way along the pipe, sets on the wall of it, and the next wash-up lays down a bit more.",
        "None of that is visible from the kitchen. You find out when the water stops going down.",
        "Hot water and washing-up liquid do not deal with it either. They move it along to the next cold stretch of pipe and leave it there.",
        "Let it go hard in an old tin or a jar and put it in the bin.",
      ].join("\n\n"),
    },
    {
      h: "Wipes do not break down",
      p: [
        "Whatever the packet says about flushing them, wipes come out of a drain in one piece. They catch on anything rough inside the pipe and then hold on to everything arriving behind them.",
        "Cotton buds and dental floss do the same. So does hair, once shower soap has bound it together.",
        "All of it belongs in the bin. In a house that blocks twice a year that one change is often the whole fix.",
      ].join("\n\n"),
    },
    {
      h: "When the pipe itself is the problem",
      p: [
        "Sometimes nothing going down the sink is the cause.",
        "A length that has settled or sagged holds standing water, and solids drop out of the flow wherever that happens. Roots get into the joints of old clay pipe. Scale narrows old pipework from the inside, and a cracked length snags whatever tries to pass it.",
        "You cannot see any of that standing over an open manhole.",
      ].join("\n\n"),
    },
    {
      h: "A camera tells you which it is",
      p: [
        "A camera down the run shows what is holding things up and how far along it sits.",
        "The fix then follows what the camera found. Jetting takes fat and scale back off the wall of the pipe. A dropped or broken length has to come out and be replaced, which is a bigger job and a longer day.",
        "Ask what was on the screen before anyone packs up.",
      ].join("\n\n"),
    },
    {
      h: "When to ring",
      p: "Ring when the same drain goes twice in a year, when two fittings are slow at once, or the moment anything comes back up indoors.",
    },
  ],
};

export default post;
