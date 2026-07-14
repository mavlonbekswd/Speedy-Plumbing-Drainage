/**
 * Static cinematic background used when WebGL is unavailable, the device is
 * low-powered, reduced motion is requested, or while the 3D chunk loads.
 * Content and CTAs never depend on the 3D scene.
 */
export default function StaticFallback() {
  return (
    <div
      aria-hidden="true"
      className="grain absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/hero-fallback.svg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal" />
    </div>
  )
}
