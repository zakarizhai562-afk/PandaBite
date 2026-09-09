export default function PauseOverlay({ onResume }) {
  return (
    <div className="puzzle-paused-overlay" onClick={onResume}>
      <h2>PAUSED</h2>
      <p>Press ESC (or tap here) to Resume</p>
    </div>
  );
}
