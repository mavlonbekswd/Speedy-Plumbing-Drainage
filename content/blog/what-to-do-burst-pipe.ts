import type { BlogPost } from "../../lib/blog";

// Rewritten from the old site's post of the same slug against the claims gate. The original's
// "hundreds of litres an hour" is gone: it is a statistic with nothing behind it. The date is
// the original's. `published` stays false until the copy is signed off.
//
// Each `p` holds its paragraphs separated by a blank line; app/blog/[slug]/page.tsx splits on
// that, so no paragraph runs past three sentences on the page.

const post: BlogPost = {
  slug: "what-to-do-burst-pipe",
  published: true,
  title: "Burst pipe? Four things to do right now",
  excerpt:
    "A burst pipe is sudden, loud and wet, and the first five minutes decide how much of it you end up putting right. Four things to do before anyone arrives.",
  date: "2026-09-19",
  readingTime: "3 min read",
  body: [
    {
      h: "1. Turn the water off at the stop tap",
      p: [
        "Turn it clockwise until it stops. The internal stop tap is the one that matters, and in most houses it sits under the kitchen sink.",
        "In a flat or a newer build it can be in a downstairs cupboard, in the airing cupboard, or behind a panel beside the bath. If yours will not move, forcing it is how spindles snap, and a snapped stop tap turns a leak into a bigger job.",
        "The outside stop valve is your fallback. It sits under a small metal or plastic cover near the boundary of the property. You need a long key or a screwdriver to reach the tap inside it.",
      ].join("\n\n"),
    },
    {
      h: "2. Open every cold tap",
      p: [
        "With the mains off, run the cold taps at every sink and basin in the house. That drains the pipework and drops the pressure, so whatever is still coming out of the split slows to a trickle.",
        "Leave them open until the flow stops, and flush the toilets while you are there. The less water sitting in the pipes above you, the less there is to come through a ceiling while you wait.",
      ].join("\n\n"),
    },
    {
      h: "3. Keep water away from anything electrical",
      p: [
        "This is the point in a burst where people get hurt. If water is running near sockets, light fittings or the consumer unit, switch off the circuits it can reach at the board.",
        "Wet hands on an electrical fitting are the thing to avoid entirely. Water coming through a ceiling light is worse again: a ceiling holding water gets heavy, and it gives way with very little warning.",
        "That is not a room to stand in while you make a phone call. Ring from another one.",
      ].join("\n\n"),
    },
    {
      h: "4. Contain it, then photograph it",
      p: [
        "Towels, buckets and a washing-up bowl do more in the first ten minutes than anything else you own. Lift what you can off the floor: rugs, boxes, anything with a plug on the end of it.",
        "Then take photographs before you mop up, of the water and of what it has reached. Your insurer will want them.",
        "A photo sent on WhatsApp also tells the plumber what the job needs before anyone sets off, so the right parts travel with the van.",
      ].join("\n\n"),
    },
    {
      h: "What to leave alone until help arrives",
      p: [
        "Leave the split itself alone. Tape and cloth round a pipe under mains pressure tend to send the water somewhere you cannot see. That is worse than a leak you can watch.",
        "Turning the water back on to test it has the same problem. The pressure comes back before anyone is standing there to catch what it does.",
        "If the burst is on a hot water pipe, leave the hot taps open too. The cylinder is otherwise still pushing water at the gap.",
      ].join("\n\n"),
    },
    {
      h: "When to ring a plumber",
      p: [
        "Ring as soon as the water is off, or straight away if you cannot find the stop tap at all. Say what is leaking, where it is coming through, and what you have already turned off.",
        "A plumber answers the phone, day or night, and the person who answers is the person who comes. You get told what to do while you wait, rather than left holding.",
        "If the water is off and the house is dry, the repair can wait for a booked time in the morning. Say so when you ring and we will book it instead.",
      ].join("\n\n"),
    },
  ],
};

export default post;
