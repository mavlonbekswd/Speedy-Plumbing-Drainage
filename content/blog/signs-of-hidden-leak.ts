import type { BlogPost } from "../../lib/blog";

// Rewritten 19 September 2026 on the owner's note that the advice pages read like copywriting.
// The meter test now leads, because it is the thing the reader can actually do; the six signs
// follow it. The half hour survives because it is a step in a procedure the reader carries out,
// not a statistic about anything. The date and the slug are the original's; the title changed
// with the shape.
//
// Each `p` holds its paragraphs separated by a blank line; app/blog/[slug]/page.tsx splits on
// that, so no paragraph runs past three sentences on the page.

const post: BlogPost = {
  slug: "signs-of-hidden-leak",
  published: true,
  title: "How to check for a hidden water leak",
  excerpt:
    "Start at the meter. Everything off, read it, wait half an hour, read it again. Then the stains and warm patches that give a leak away early.",
  date: "2026-09-19",
  readingTime: "2 min read",
  body: [
    {
      h: "Do the meter test first",
      p: [
        "If the house is on a water meter, this test tells you whether water is getting out somewhere. Turn off every tap. Switch off anything plumbed into the mains too, washing machine and dishwasher included.",
        "Read the meter and write the number down. Then leave it half an hour with nobody using any water at all.",
        "Read it again. If the dial has moved, water is leaving the pipes somewhere you did not send it.",
        "An outside meter works the same way. Lift the cover in the path, read the dial, put the cover back.",
      ].join("\n\n"),
    },
    {
      h: "What gives a leak away",
      p: [
        "A bill that climbs while nothing in the house has changed is what people usually notice first. Nobody moved in, nothing new got plumbed in, and the number went up anyway.",
        "Then there is the smell. Damp and musty, sitting in one room or one corner of it, and opening a window does nothing to it.",
        "Plaster and timber hold water for weeks before anything shows on the surface.",
        "After that it starts to show. Paint bubbling, a patch of plaster gone chalky, a skirting board pulling away from the wall. A stain that comes back through fresh paint has water behind it.",
        "A warm patch underfoot can be a hot pipe leaking under the floor. You feel that one barefoot before you see anything.",
        "Pressure gone at one tap while the rest of the house is fine is more often the tap itself, but it is worth a look.",
      ].join("\n\n"),
    },
    {
      h: "Where the water actually is",
      p: [
        "Water runs along joists and down inside cavities before it comes through anything.",
        "So the damp patch on the ceiling is often a long way from the split that made it. Lifting the boards under the stain is as likely to be wrong as right.",
      ].join("\n\n"),
    },
    {
      h: "When to ring",
      p: "Ring when the meter moves with everything off, or when a stain keeps coming back after you have painted over it.",
    },
  ],
};

export default post;
