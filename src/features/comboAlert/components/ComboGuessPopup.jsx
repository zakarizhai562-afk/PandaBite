import { useState, useCallback } from 'react';
import MascotBubble from '../../../core/components/MascotBubble';
import { getComboReaction } from '../models/comboPair';
import { awardStars } from '../../../core/services/starAwardService';
import { useStars } from '../../../core/context/StarsContext';
import { markAlertShown } from '../services/comboAlertService';



function FoodImage({ foodId, image, name }) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return <div className="combo-guess-placeholder">{name?.en || foodId}</div>;
  }

  return (
    <img
      src={image}
      alt={name?.en || foodId}
      onError={() => setImgError(true)}
      className="combo-guess-food-img"
    />
  );
}

export default function ComboGuessPopup({ pair, foodAData, foodBData, triggerId, onDismiss }) {
  const [phase, setPhase] = useState('guessing');
  const [reaction, setReaction] = useState(null);
  const { setStars } = useStars();

  const handleAnswer = useCallback((childSaidYes) => {
    if (phase !== 'guessing') return;

    const result = getComboReaction(pair, childSaidYes);
    setReaction(result);
    setPhase('revealed');

    if (result.isCorrect) {
      awardStars(1, 'comboAlert', setStars);
    }

    markAlertShown(triggerId);
  }, [phase, pair, triggerId]);

  const handleDismiss = useCallback(() => {
    if (onDismiss) onDismiss();
  }, [onDismiss]);

  return (
    <div className="combo-guess-overlay">
      <div className="combo-guess-card">
        {reaction && (
          <div style={{ marginBottom: '16px' }}>
            <MascotBubble text={reaction.text} />
          </div>
        )}

        <div className="combo-guess-images">
          <FoodImage foodId={foodAData.id} image={foodAData.image} name={foodAData.name} />
          <div className="combo-guess-amp">&amp;</div>
          <FoodImage foodId={foodBData.id} image={foodBData.image} name={foodBData.name} />
        </div>

        {phase === 'guessing' ? (
          <p className="combo-guess-question">Would you eat these two together?</p>
        ) : (
          <p className="combo-guess-reveal">{reaction?.isCorrect ? 'Great instinct!' : 'Good try!'}</p>
        )}

        <div className="combo-guess-buttons">
          {phase === 'guessing' ? (
            <>
              <button className="combo-guess-btn combo-guess-btn--yes" onClick={() => handleAnswer(true)}>
                Yes, I would!
              </button>
              <button className="combo-guess-btn combo-guess-btn--no" onClick={() => handleAnswer(false)}>
                No, I wouldn't
              </button>
            </>
          ) : (
            <button className="combo-guess-btn combo-guess-btn--dismiss" onClick={handleDismiss}>
              Got it!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
