import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BalanceSummaryCard from '../components/BalanceSummaryCard';
import ComboGuessPopup from '../../comboAlert/components/ComboGuessPopup';
import { useComboAlert } from '../../comboAlert/hooks/useComboAlert';
import { selectBalanceFeedback } from '../services/feedbackLibrary';
import { awardStars } from '../../../core/services/starAwardService';
import { useStars } from '../../../core/context/StarsContext';

function getResultPandaImage(coveredCount) {
  if (coveredCount >= 3) return '/images/combobox/happy.png';
  if (coveredCount === 2) return '/images/combobox/excited.png';
  if (coveredCount === 1) return '/images/combobox/thinking.png';
  return '/images/combobox/wrong.png';
}

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
    navigate('/daily-log', { state: { skipLoading: true } });
  };

  const resultTitle = result.isBalanced ? 'Balanced meal!' : 'Nice check-in!';
  const resultTitleMy = result.isBalanced ? 'မျှတတဲ့အစားအစာပါ။' : 'စစ်ကြည့်တာ ကောင်းပါတယ်။';
  const resultPandaImage = getResultPandaImage(result.coveredGroups.length);

  return (
    <div className="daily-result-screen">
      <button
        className="daily-log-back-btn daily-result-back-btn"
        onClick={() => navigate('/daily-log', { state: { skipLoading: true } })}
        aria-label="Back to Daily Log"
      />

      <div className="daily-result-dialogue">
        <div className="daily-result-bubble">
          <span className="daily-result-bubble-my">
            {feedback?.text?.my || 'ဒီနေ့ စစ်ကြည့်တာ ကောင်းပါတယ်။'}
          </span>
          <span className="daily-result-bubble-en">
            {feedback?.text?.en || 'Great job checking in today!'}
          </span>
        </div>
      </div>

      <div className="daily-result-stage">
        <section className="daily-result-plate-panel" aria-label="Daily meal result">
          <div className="daily-result-plate-inner">
            <p className="daily-result-kicker">{resultTitleMy}</p>
            <h1>{resultTitle}</h1>
            <BalanceSummaryCard result={result} />
          </div>
        </section>

        <aside className="daily-result-side-panel">
          <img
            src={resultPandaImage}
            alt="Red Panda"
            className="daily-result-panda"
          />
          <div className="daily-result-note">
            <span>အာဟာရအုပ်စုတွေကို ကြည့်ပြီး နောက်တစ်ခါ ပိုကောင်းအောင် ရွေးကြမယ်။</span>
            <span>Look at your groups and try another tasty balance.</span>
          </div>
          {starsEarned > 0 && (
            <div className="stars-earned">
              <span className="daily-log-goal-star">★</span>
              <span>+{starsEarned} Stars earned!</span>
            </div>
          )}
        </aside>
      </div>

      <div className="daily-result-actions">
        <button className="btn-secondary" onClick={() => navigate('/home')}>
          Home
        </button>
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
