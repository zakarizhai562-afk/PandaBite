export default function DailyLogDoneBar({ itemCount, onDone }) {
  return (
    <div className="daily-log-done-bar">
      <button className="btn-primary" type="button" onClick={onDone} disabled={itemCount === 0}>
        Check my meal
      </button>
    </div>
  );
}