import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BalanceSummaryCard from '../components/BalanceSummaryCard';
import { selectBalanceFeedback } from '../services/feedbackLibrary';
import { awardStars } from '../../../core/services/starAwardService';
import { useStars } from '../../../core/context/StarsContext';
import { getItem, setItem } from '../../../core/utils/storage';
import { getTodayKey } from '../../../core/utils/dateUtils';

const DAILY_LOG_AWARD_KEY = 'nutripal_daily_log_star_awards';
const FALLBACK_RESULT = {
  selectedFoodIds: [],
  coveredGroups: [],
  missingGroups: ['carbs', 'protein', 'vitamins'],
  whoaCount: 0,
  tierCounts: { go: 0, slow: 0, whoa: 0 },
  score: 0,
  starsEarned: 0,
  isBalanced: false,
};

function getResultPandaImage(score) {
  if (score >= 3) return '/images/combobox/happy.png';
  if (score === 2) return '/images/combobox/excited.png';
  if (score === 1) return '/images/combobox/thinking.png';
  return '/images/combobox/wrong.png';
}

function normalizeResult(rawResult) {
  const result = { ...FALLBACK_RESULT, ...(rawResult || {}) };
  const score = rawResult?.score ?? Math.max(
    0,
    Math.min(3, (result.coveredGroups?.length || 0) - Math.max(0, (result.whoaCount || 0) - 1))
  );

  return {
    ...result,
    score,
    starsEarned: rawResult?.starsEarned ?? score,
  };
}

function awardDailyLogStarsOnce(result, setStars) {
  const amount = result.starsEarned ?? result.score ?? 0;
  if (amount <= 0) return false;

  const awardKey = result.entryId || `${result.date || getTodayKey()}-${result.selectedFoodIds?.join('-') || 'fallback'}`;
  const awards = getItem(DAILY_LOG_AWARD_KEY) || {};
  if (awards[awardKey]) return false;

  awardStars(amount, 'daily-log', setStars);
  setItem(DAILY_LOG_AWARD_KEY, {
    ...awards,
    [awardKey]: {
      amount,
      awardedAt: new Date().toISOString(),
    },
  });
  return true;
}

export default function DailyResultScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setStars } = useStars();
  const [feedback, setFeedback] = useState(null);
  const [starsEarned, setStarsEarned] = useState(0);

  const result = useMemo(
    () => normalizeResult(location.state?.result),
    [location.state?.result]
  );

  useEffect(() => {
    const fb = selectBalanceFeedback(result);
    setFeedback(fb);

    setStarsEarned(result.starsEarned ?? result.score ?? 0);
    awardDailyLogStarsOnce(result, setStars);
  }, [result, setStars]);

  const handleContinue = () => {
    navigate('/daily-log', { state: { skipLoading: true } });
  };

  const resultTitle = result.isBalanced ? 'Balanced meal!' : 'Nice check-in!';
  const resultTitleMy = result.isBalanced ? 'မျှတတဲ့အစားအစာပါ။' : 'စစ်ကြည့်တာ ကောင်းပါတယ်။';
  const resultPandaImage = getResultPandaImage(result.score ?? result.coveredGroups.length);

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
          <div className="daily-result-coach-row">
            <img
              src={resultPandaImage}
              alt="Red Panda"
              className="daily-result-panda"
            />
            <div className="daily-result-note">
              <span>အာဟာရအုပ်စုတွေကို ကြည့်ပြီး နောက်တစ်ခါ ပိုကောင်းအောင် ရွေးကြမယ်။</span>
              <span>Look at your groups and try another tasty balance.</span>
            </div>
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
    </div>
  );
}
