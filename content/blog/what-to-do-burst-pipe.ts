import type { BlogPost } from "../../lib/blog";

// Rewritten 19 September 2026 on the owner's note that the advice pages read like copywriting.
// The order of the sections is the order a person standing in the water needs them: stop tap,
// taps, electrics, then the phone. Nothing here is a claim: no minutes, no price, no credential.
// The date and the slug are the original's.
//
// Each `p` holds its paragraphs separated by a blank line; app/blog/[slug]/page.tsx splits on
// that, so no paragraph runs past three sentences on the page.

const post: BlogPost = {
  slug: "what-to-do-burst-pipe",
  published: true,
  title: "Burst pipe? What to do right now",
  excerpt:
    "Where the stop tap is and which way it turns. Then the taps, the electrics, and what to leave alone until someone gets there.",
  date: "2026-09-19",
  readingTime: "2 min read",
  body: [
    {
      h: "Turn the water off first",
      p: [
        "The one that matters is the internal stop tap. In most houses it sits under the kitchen sink, at the back, behind the bin and the bottles.",
        "If it is not there, try under the stairs, a downstairs cupboard, or behind the bath panel. Older houses sometimes have it in the hall floor under a small hatch.",
        "Turn it clockwise and keep going until it stops. If yours is a lever rather than a tap head, a quarter turn across the pipe shuts it.",
        "A stop tap that has not moved in ten years often does not want to. Do not lean on it. Spindles snap, and then you are replacing the stop tap as well as the pipe.",
        "There is a second one outside, under a small metal or plastic cover near the boundary. It can sit a long way down, and you may need a stop tap key to reach it.",
      ].join("\n\n"),
    },
    {
      h: "Open the cold taps",
      p: [
        "With the mains off, open every cold tap in the house and flush the loo.",
        "The pipes above you are still full, and that water carries on out of the split until they are empty. Open taps empty them somewhere you have chosen.",
        "Leave them running until nothing comes out.",
      ].join("\n\n"),
    },
    {
      h: "If water is near a light fitting",
      p: [
        "This is the part that hurts people.",
        "Water running near sockets or a light fitting means switching off the circuits it can reach at the board. Nothing electrical gets touched with wet hands.",
        "Water coming through a ceiling is its own problem. A ceiling holding water gets heavy and drops with very little warning, so make the phone call from a different room.",
      ].join("\n\n"),
    },
    {
      h: "Leave the split alone",
      p: [
        "Tape and a rag wrapped round a pipe under mains pressure send the water somewhere you cannot watch it. Leave the pipe as it is.",
        "Turning the water back on to see whether it has stopped has the same problem. The pressure is back before anyone is standing there.",
        "Put a bucket under the drip. Roll the rug up and move anything with a plug on it.",
        "Photograph the water before you mop it up. Your insurer will ask, and a photo sent on WhatsApp tells the plumber what the job needs before the van sets off.",
      ].join("\n\n"),
    },
    {
      h: "When to ring",
      p: "Ring once the water is off, or straight away if the stop tap will not turn or you cannot find it.",
    },
  ],
};

export default post;
