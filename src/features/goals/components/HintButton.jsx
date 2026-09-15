export default function HintButton({ foodId, goalId, onClue }) {
  return (
    <div className="hint-button" style={{ position: 'relative' }}>
      <button
        className="btn-primary goals-hint-btn"
        onClick={() => onClue(foodId, goalId)}
        type="button"
      >
        Hint
      </button>
    </div>
  );
}
