import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MascotBubble from '../../../core/components/MascotBubble';
import BalanceSummaryCard from '../components/BalanceSummaryCard';
import { selectBalanceFeedback } from '../services/feedbackLibrary';
import { awardStars } from '../../../core/services/starAwardService';
import { useStars } from '../../../core/context/StarsContext';

export default function DailyResultScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setStars } = useStars();
  const [feedback, setFeedback] = useState(null);
  const [starsEarned, setStarsEarned] = useState(0);

  const result = location.state?.result || {
    coveredGroups: [],
    missingGroups: ['carbs', 'protein', 'vitamins'],
    whoaCount: 0,
    isBalanced: false,
  };

  useEffect(() => {
    const fb = selectBalanceFeedback(result);
    setFeedback(fb);

    if (result.isBalanced) {
      const newTotal = awardStars(3, 'daily-log');
      setStars(newTotal);
      setStarsEarned(3);
    }
  }, [result, setStars]);

  const handleContinue = () => {
    navigate('/home');
  };

  return (
    <div className="daily-result-screen">
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
  );
}
