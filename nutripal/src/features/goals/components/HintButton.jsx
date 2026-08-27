import { useState } from 'react';
import { spendPoints, HINT_COST } from '../../../core/services/spendPointsService';
import { useStars } from '../../../core/context/StarsContext';

export default function HintButton({ foodId, goalId, onClue, onReveal }) {
  const { stars } = useStars();
  const [showTiers, setShowTiers] = useState(false);

  const canAffordClue = stars >= HINT_COST.CLUE;
  const canAffordReveal = stars >= HINT_COST.REVEAL;

  const handleClue = () => {
    if (!canAffordClue) return;
    const result = spendPoints(HINT_COST.CLUE, 'goals-hint');
    if (result.success) {
      onClue(foodId, goalId);
    }
    setShowTiers(false);
  };

  const handleReveal = () => {
    if (!canAffordReveal) return;
    const result = spendPoints(HINT_COST.REVEAL, 'goals-hint');
    if (result.success) {
      onReveal(foodId, goalId);
    }
    setShowTiers(false);
  };

  return (
    <div className="hint-button" style={{ position: 'relative' }}>
      {!showTiers ? (
        <button
          onClick={() => setShowTiers(true)}
          style={{
            padding: '8px 16px',
            borderRadius: '12px',
            border: '2px solid #FF8C42',
            backgroundColor: 'transparent',
            color: '#FF8C42',
            fontSize: '13px',
            fontWeight: 'bold',
            cursor: 'pointer',
            minHeight: '44px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          Hint
        </button>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            backgroundColor: '#FFF3E0',
            padding: '12px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            position: 'absolute',
            bottom: '50px',
            right: 0,
            zIndex: 10,
            minWidth: '150px',
          }}
        >
          <button
            onClick={handleClue}
            disabled={!canAffordClue}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: canAffordClue ? '#2D6A4F' : '#ccc',
              color: '#FFF3E0',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: canAffordClue ? 'pointer' : 'not-allowed',
              textAlign: 'left',
              minHeight: '44px',
            }}
          >
            Clue ({HINT_COST.CLUE} &#11088;)
          </button>
          <button
            onClick={handleReveal}
            disabled={!canAffordReveal}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: canAffordReveal ? '#FF8C42' : '#ccc',
              color: '#FFF3E0',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: canAffordReveal ? 'pointer' : 'not-allowed',
              textAlign: 'left',
              minHeight: '44px',
            }}
          >
            Reveal ({HINT_COST.REVEAL} &#11088;)
          </button>
          <button
            onClick={() => setShowTiers(false)}
            style={{
              padding: '6px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#5B6B61',
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          {!canAffordClue && !canAffordReveal && (
            <p style={{ fontSize: '11px', color: '#5B6B61', margin: 0, textAlign: 'center' }}>
              Not enough points yet
            </p>
          )}
        </div>
      )}
    </div>
  );
}
