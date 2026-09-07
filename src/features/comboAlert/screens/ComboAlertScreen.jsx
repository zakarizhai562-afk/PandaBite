import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FeatureLoadingScreen from '../../../core/components/FeatureLoadingScreen';
import ComboGuessPopup from '../components/ComboGuessPopup';
import { buildTriggerId } from '../services/comboAlertService';
import comboAlertPairs from '../../../data/comboAlertPairs.json';
import foodDatabase from '../../../data/foodDatabase.json';

function pickRound(excludeTriggerId) {
  const playable = comboAlertPairs.pairs
    .map((pair) => ({
      pair,
      foodAData: foodDatabase.foods.find((f) => f.id === pair.foodA),
      foodBData: foodDatabase.foods.find((f) => f.id === pair.foodB),
      triggerId: buildTriggerId(pair.foodA, pair.foodB),
    }))
    .filter((round) => round.foodAData && round.foodBData);

  if (playable.length === 0) return null;

  const choices = playable.filter((round) => round.triggerId !== excludeTriggerId);
  const pool = choices.length > 0 ? choices : playable;

  return pool[Math.floor(Math.random() * pool.length)];
}

export default function ComboAlertScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [round, setRound] = useState(() => pickRound());
  const [roundKey, setRoundKey] = useState(0);

  const handleContinue = () => {
    setRound(pickRound(round?.triggerId));
    setRoundKey((key) => key + 1);
  };

  if (loading) {
    return (
      <FeatureLoadingScreen
        image="/world_art/loading_combo.png"
        label="Combo Alert"
        onDone={() => setLoading(false)}
      />
    );
  }

  if (!round) {
    return (
      <div className="combo-guess-overlay">
        <div className="combo-guess-scene">
          <div className="combo-guess-speech">
            <p className="combo-guess-question">No food combos to try yet.</p>
          </div>
          <div className="combo-guess-buttons">
            <button
              className="combo-guess-btn combo-guess-btn--dismiss"
              onClick={() => navigate('/home')}
            >
              Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ComboGuessPopup
      key={roundKey}
      pair={round.pair}
      foodAData={round.foodAData}
      foodBData={round.foodBData}
      triggerId={round.triggerId}
      onDismiss={() => navigate('/home')}
      onContinue={handleContinue}
    />
  );
}
