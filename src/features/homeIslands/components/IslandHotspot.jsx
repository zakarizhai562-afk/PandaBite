export default function IslandHotspot({ name, area, onActivate }) {
  return (
    <button
      type="button"
      className="island-hotspot"
      style={area}
      onClick={onActivate}
      aria-label={`Play ${name}`}
    >
      <span className="island-hotspot-idle">
        <span className="island-hotspot-body">
          <span className="island-hotspot-glow" aria-hidden="true" />
        </span>
      </span>
      <span className="island-hotspot-label">
        <span className="island-hotspot-name">✨ {name}</span>
        <span className="island-hotspot-cta">PLAY ▶</span>
      </span>
    </button>
  );
}
