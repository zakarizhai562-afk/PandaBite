// Tiny shimmer sweeps and ripple rings over open water only — the sea
// artwork itself is never moved or distorted.
export default function WaterEffects() {
  return (
    <div className="wm-water-layer" aria-hidden="true">
      <span className="wm-water-shimmer wm-water-shimmer--1" />
      <span className="wm-water-shimmer wm-water-shimmer--2" />
      <span className="wm-water-ripple wm-water-ripple--1" />
      <span className="wm-water-ripple wm-water-ripple--2" />
      <span className="wm-water-sparkle wm-water-sparkle--1" />
      <span className="wm-water-sparkle wm-water-sparkle--2" />
      <span className="wm-water-sparkle wm-water-sparkle--3" />
    </div>
  );
}
