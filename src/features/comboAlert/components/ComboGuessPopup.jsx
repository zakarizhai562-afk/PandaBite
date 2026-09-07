import { useState, useCallback } from 'react';
import { getComboReaction } from '../models/comboPair';
import { awardStars } from '../../../core/services/starAwardService';
import { useStars } from '../../../core/context/StarsContext';
import { markAlertShown } from '../services/comboAlertService';

function FoodImage({ foodId, image, name, withLabel }) {
  const [imgError, setImgError] = useState(false);
  const label = name?.en || foodId;

  if (imgError) {
    return <div className="combo-guess-placeholder">{label}</div>;
  }

  return (
    <>
      <img
        src={image}
        alt={label}
        onError={() => setImgError(true)}
        className="combo-guess-food-img"
      />
      {withLabel && <span className="combo-guess-food-name">{label}</span>}
    </>
  );
}

export default function ComboGuessPopup({ pair, foodAData, foodBData, triggerId, onDismiss, onContinue }) {
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
  }, [phase, pair, triggerId, setStars]);

  const handleDismiss = useCallback(() => {
    if (onDismiss) onDismiss();
  }, [onDismiss]);

  const isGuessing = phase === 'guessing';
  const isGoodCombo = pair.type === 'good';

  const pandaSrc = isGuessing
    ? '/panda/panda_thinking.png'
    : reaction?.isCorrect
      ? '/panda/panda_celebrating.png'
      : '/panda/panda_nudge.png';

  return (
    <div className="combo-guess-overlay">
      <div className="combo-guess-scene">
        <button
          className="daily-log-back-btn combo-guess-back"
          onClick={handleDismiss}
          aria-label="Back"
        />

        <div className="combo-guess-speech">
          {isGuessing ? (
            <p className="combo-guess-question">
              These two foods are often eaten together. Will you eat them together?
            </p>
          ) : (
            <>
              <p className="combo-guess-reveal">
                {reaction?.isCorrect ? "That's right!" : 'Good try!'}
              </p>
              {reaction?.text?.my && (
                <p className="combo-guess-explain combo-guess-explain--my">{reaction.text.my}</p>
              )}
              <p className="combo-guess-explain">{reaction?.text?.en}</p>
            </>
          )}
        </div>

        <div className="combo-guess-stage">
          <img className="combo-guess-panda" src={pandaSrc} alt="Red Panda" />

          <div className="combo-guess-content">
            {isGuessing ? (
              <div className="combo-guess-foods">
                <div className="combo-guess-card">
                  <FoodImage
                    foodId={foodAData.id}
                    image={foodAData.image}
                    name={foodAData.name}
                    withLabel
                  />
                </div>
                <div className="combo-guess-card">
                  <FoodImage
                    foodId={foodBData.id}
                    image={foodBData.image}
                    name={foodBData.name}
                    withLabel
                  />
                </div>
              </div>
            ) : (
              <div className="combo-guess-panel">
                <div className="combo-guess-result-foods">
                  <FoodImage
                    foodId={foodAData.id}
                    image={foodAData.image}
                    name={foodAData.name}
                  />
                  <span className="combo-guess-plus" aria-hidden="true">+</span>
                  <FoodImage
                    foodId={foodBData.id}
                    image={foodBData.image}
                    name={foodBData.name}
                  />
                </div>
                <div className={`combo-guess-badge combo-guess-badge--${isGoodCombo ? 'good' : 'bad'}`}>
                  <span className="combo-guess-badge-icon" aria-hidden="true">
                    {isGoodCombo ? '★' : '♥'}
                  </span>
                  {isGoodCombo ? 'Great Combo!' : 'Not a good combo'}
                </div>
              </div>
            )}

            <div className="combo-guess-buttons">
              {isGuessing ? (
                <>
                  <button
                    className="combo-guess-btn combo-guess-btn--yes"
                    onClick={() => handleAnswer(true)}
                  >
                    Yes
                  </button>
                  <button
                    className="combo-guess-btn combo-guess-btn--no"
                    onClick={() => handleAnswer(false)}
                  >
                    No
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="combo-guess-btn combo-guess-btn--dismiss"
                    onClick={handleDismiss}
                  >
                    Got it!
                  </button>
                  {onContinue && (
                    <button
                      className="combo-guess-btn combo-guess-btn--continue"
                      onClick={onContinue}
                    >
                      Continue
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
