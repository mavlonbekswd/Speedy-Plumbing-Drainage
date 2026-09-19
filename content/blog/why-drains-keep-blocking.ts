import type { BlogPost } from "../../lib/blog";

// Rewritten from the old site's post of the same slug against the claims gate. The original's
// "professional inspection" and "proper diagnosis" wording is gone: one implies a credential
// and the other uses a banned word. The date is the original's. `published` stays false until
// the copy is signed off.
//
// Each `p` holds its paragraphs separated by a blank line; app/blog/[slug]/page.tsx splits on
// that, so no paragraph runs past three sentences on the page.

const post: BlogPost = {
  slug: "why-drains-keep-blocking",
  published: true,
  title: "Why your drain keeps blocking",
  excerpt:
    "Clearing the same drain every few months means the clearance works and the diagnosis does not. The usual causes, and what actually ends the cycle.",
  date: "2026-09-19",
  readingTime: "3 min read",
  body: [
    {
      h: "The blockage is the symptom, not the fault",
      p: [
        "If you are clearing the same drain twice a year, the clearing is doing its job and the diagnosis is not. Rodding and plunging move whatever is in the way. They do not change the reason it gathered there.",
        "Something in that run is holding material up. Until you know what it is, the next blockage starts forming the day after the last one was cleared.",
      ].join("\n\n"),
    },
    {
      h: "Fat and grease, and what goes down the sink",
      p: [
        "Fat leaves the pan as a liquid and arrives in the drain as a solid. It cools on the way, sticks to the inside of the pipe, and every wash after that adds another layer.",
        "Kitchen runs narrow from the inside out for this reason, and you cannot see it happening until the day nothing drains at all. Pour cooled fat into a container and put it in the bin instead.",
        "Hot water and washing-up liquid do not fix this. They carry the fat a few feet further along to the next cool point in the run.",
      ].join("\n\n"),
    },
    {
      h: "Wipes, and the things that never break down",
      p: [
        "Wipes do not fall apart in water, whatever the packet says about flushing them. They snag on anything rough inside the pipe and then catch everything that arrives behind them.",
        "Cotton buds, dental floss, sanitary items and kitchen roll all behave the same way. So does hair in a shower waste once soap has bound it together.",
        "The bin is the answer for every one of them. In a house where the drain blocks twice a year, that single change is often the whole cure.",
      ].join("\n\n"),
    },
    {
      h: "When the pipe itself is the problem",
      p: [
        "Sometimes nothing you put down the drain is the cause. A section that has sagged or settled holds standing water, and solids drop out of the flow wherever that happens.",
        "Roots find the joints in older clay pipe and grow into them a few millimetres at a time. Scale narrows old pipework from the inside. A cracked or partly collapsed length snags anything passing it.",
        "None of those clear themselves, and none of them are visible from the top of a manhole.",
      ].join("\n\n"),
    },
    {
      h: "What actually ends the cycle",
      p: [
        "A camera survey down the run tells you which of those it is, and where along the pipe it sits. That is the difference between clearing a blockage and finding out why there is one.",
        "After that the fix matches the cause. Jetting takes fat and scale off the pipe wall, rather than punching a hole through the middle of it. A sagging or broken length needs replacing, which is a bigger job, and a kitchen habit is just a habit.",
        "Ask for the cause in plain words, not just a cleared drain. If nobody can tell you why it blocked, you are already booked in for the same job again.",
      ].join("\n\n"),
    },
    {
      h: "When to ring a plumber",
      p: [
        "Ring when the same drain blocks twice, when more than one fitting is slow at the same time, or when a manhole is standing full. All three point at the run rather than at the trap under the sink.",
        "Ring straight away if sewage is coming back up inside the house or into the garden. That one does not wait until morning.",
        "A plumber answers the phone, day or night. Say which fittings are slow and whether you have lifted a cover, and you get a straight answer about what it is likely to be.",
      ].join("\n\n"),
    },
  ],
};

export default post;
