import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MascotBubble from '../../../core/components/MascotBubble';
import BalanceSummaryCard from '../components/BalanceSummaryCard';
import ComboGuessPopup from '../../comboAlert/components/ComboGuessPopup';
import { useComboAlert } from '../../comboAlert/hooks/useComboAlert';
import { selectBalanceFeedback } from '../services/feedbackLibrary';
import { awardStars } from '../../../core/services/starAwardService';
import { useStars } from '../../../core/context/StarsContext';

export default function DailyResultScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setStars } = useStars();
  const [feedback, setFeedback] = useState(null);
  const [starsEarned, setStarsEarned] = useState(0);
  const { checkForComboAlert, comboAlertData, clearComboAlert } = useComboAlert();

  const result = location.state?.result || {
    coveredGroups: [],
    missingGroups: ['carbs', 'protein', 'vitamins'],
    whoaCount: 0,
    isBalanced: false,
  };
  const foodIds = location.state?.foodIds || [];

  useEffect(() => {
    const fb = selectBalanceFeedback(result);
    setFeedback(fb);

    if (result.isBalanced) {
      awardStars(3, 'daily-log', setStars);
      setStarsEarned(3);
    }

    if (foodIds.length >= 2) {
      checkForComboAlert(foodIds);
    }
  }, [result, setStars, foodIds, checkForComboAlert]);

  const handleContinue = () => {
    navigate('/home');
  };

  return (
    <div className="daily-result-screen">
      <div className="page-container">
        <MascotBubble text={feedback?.text || null} />

        <BalanceSummaryCard result={result} />

        {starsEarned > 0 && (
          <div className="stars-earned">
            +{starsEarned} Stars earned!
          </div>
        )}

        <div className="daily-result-feedback">
          {feedback?.text?.en || 'Great job checking in today!'}
        </div>

        <button className="btn-primary" onClick={handleContinue}>
          Continue
        </button>
      </div>

      {comboAlertData && (
        <ComboGuessPopup
          pair={comboAlertData.pair}
          foodAData={comboAlertData.foodAData}
          foodBData={comboAlertData.foodBData}
          triggerId={comboAlertData.triggerId}
          onDismiss={clearComboAlert}
        />
      )}
    </div>
  );
}
