import { useState, useCallback } from 'react';
import { getComboReaction } from '../models/comboPair';
import { awardStars } from '../../../core/services/starAwardService';
import { useStars } from '../../../core/context/StarsContext';
import { markAlertShown, getComboType } from '../services/comboAlertService';

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

export default function ComboGuessPopup({ pair, foodAData, foodBData, triggerId, onDismiss, onContinue, onBack }) {
  const [phase, setPhase] = useState('guessing');
  const [reaction, setReaction] = useState(null);
  const [comboType, setComboType] = useState(pair.type);
  const { setStars } = useStars();

  const handleAnswer = useCallback(async (childSaidYes) => {
    if (phase !== 'guessing') return;
    setPhase('checking');

    const resolvedType = (await getComboType(pair.foodA, pair.foodB)) || pair.type;
    const result = getComboReaction({ ...pair, type: resolvedType }, childSaidYes);

    setComboType(resolvedType);
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

  const isGuessing = phase !== 'revealed';
  const isGoodCombo = comboType === 'good';

  const pandaMood = isGuessing ? 'curious' : reaction?.isCorrect ? 'happy' : 'sad';


  return (
    <div className="combo-guess-overlay">
      <div className="combo-guess-scene">
        <button
          className="daily-log-back-btn combo-guess-back"
          onClick={onBack || handleDismiss}
          aria-label="Back"
        />

        <div className="combo-guess-stage">
          <div
            className={`combo-guess-panda combo-guess-panda--${pandaMood}`}
            role="img"
            aria-label="Red Panda"
          />

          <div className="combo-guess-content">
            <div className="combo-guess-speech">
              {isGuessing ? (
                <p className="combo-guess-question">
                  These two foods are often eaten together. Will you eat them together?
                </p>
              ) : (
                <>
                  <p className={`combo-guess-reveal combo-guess-reveal--${reaction?.isCorrect ? 'right' : 'wrong'}`}>
                    {reaction?.isCorrect ? "That's right!" : 'Wrong answer!'}
                  </p>
                  {reaction?.text?.my && (
                    <p className="combo-guess-explain combo-guess-explain--my">{reaction.text.my}</p>
                  )}
                  <p className="combo-guess-explain">{reaction?.text?.en}</p>
                </>
              )}
            </div>

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
