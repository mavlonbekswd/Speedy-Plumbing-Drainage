// Invisible spam trap: humans never see or fill this field, but naive bots
// auto-complete every input. The API silently flags any submission where it
// has a value. Positioned off-screen (not display:none) so bots don't skip it.
export default function HoneypotField() {
  return (
    <input
      type="text"
      name="website"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        width: "1px",
        height: "1px",
        opacity: 0,
        pointerEvents: "none",
      }}
    />
  );
}
