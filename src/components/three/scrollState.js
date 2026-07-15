// Shared mutable state bridging GSAP ScrollTrigger (writer) and the R3F
// render loop (reader) without triggering React re-renders per frame.
export const cinematicScroll = {
  progress: 0, // 0..1 across the hero + problem sections (raw, from ScrollTrigger)
  smoothProgress: 0, // eased copy, written once per frame by the camera rig
  mouseX: 0, // -1..1 pointer parallax
  mouseY: 0,
}
