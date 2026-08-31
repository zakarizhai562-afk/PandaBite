import { useState, useCallback } from 'react';
import MascotBubble from '../../../core/components/MascotBubble';
import { getComboReaction } from '../models/comboPair';
import { awardStars } from '../../../core/services/starAwardService';
import { useStars } from '../../../core/context/StarsContext';
import { markAlertShown } from '../services/comboAlertService';

const PLACEHOLDER_STYLES = {
  width: '100px',
  height: '100px',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  fontWeight: 'bold',
  color: '#FFF3E0',
  textAlign: 'center',
  padding: '8px',
};

function FoodImage({ foodId, image, name }) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div
        style={{
          ...PLACEHOLDER_STYLES,
          backgroundColor: '#2D6A4F',
        }}
      >
        {name?.en || foodId}
      </div>
    );
  }

  return (
    <img
      src={image}
      alt={name?.en || foodId}
      onError={() => setImgError(true)}
      style={{
        width: '100px',
        height: '100px',
        objectFit: 'contain',
        borderRadius: '16px',
        border: '3px solid #FFF3E0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}
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
    <div
      className="combo-guess-popup"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: '#EAF4EE',
          borderRadius: '24px',
          padding: '24px',
          maxWidth: '360px',
          width: '100%',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          position: 'relative',
        }}
      >
        {/* Mascot reaction bubble */}
        {reaction && (
          <div style={{ marginBottom: '16px' }}>
            <MascotBubble text={reaction.text} />
          </div>
        )}

        {/* Two food images side by side */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '16px',
          }}
        >
          <FoodImage
            foodId={foodAData.id}
            image={foodAData.image}
            name={foodAData.name}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '24px',
              color: '#FF8C42',
              fontWeight: 'bold',
            }}
          >
            &amp;
          </div>
          <FoodImage
            foodId={foodBData.id}
            image={foodBData.image}
            name={foodBData.name}
          />
        </div>

        {/* Question or result */}
        {phase === 'guessing' ? (
          <p
            style={{
              textAlign: 'center',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '16px',
              color: '#1B2B22',
              marginBottom: '16px',
              lineHeight: '1.4',
            }}
          >
            Would you eat these two together?
          </p>
        ) : (
          <p
            style={{
              textAlign: 'center',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '14px',
              color: '#5B6B61',
              marginBottom: '16px',
              lineHeight: '1.4',
            }}
          >
            {reaction?.isCorrect ? 'Great instinct!' : 'Good try!'}
          </p>
        )}

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          {phase === 'guessing' ? (
            <>
              <button
                onClick={() => handleAnswer(true)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#2D6A4F',
                  color: '#FFF3E0',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                Yes, I would!
              </button>
              <button
                onClick={() => handleAnswer(false)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#FF8C42',
                  color: '#FFF3E0',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                No, I wouldn't
              </button>
            </>
          ) : (
            <button
              onClick={handleDismiss}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: '#2D6A4F',
                color: '#FFF3E0',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                minHeight: '44px',
              }}
            >
              Got it!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
