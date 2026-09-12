// Static world-map artwork. Never animated, transformed, or zoomed —
// islands and effects are separate layers rendered above it.
export default function MapBackground({ src, alt }) {
  return <img src={src} alt={alt} className="wm-background" draggable="false" />;
}
