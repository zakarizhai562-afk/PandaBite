// The small "✨ Title / PLAY ▶" tag that fades in near an island on hover/focus.
export default function IslandLabel({ title }) {
  return (
    <span className="wm-island-label">
      <span className="wm-island-label-name">✨ {title}</span>
      <span className="wm-island-label-cta">PLAY ▶</span>
    </span>
  );
}
