import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BalanceSummaryCard from '../components/BalanceSummaryCard';
import { selectBalanceFeedback } from '../services/feedbackLibrary';

const FALLBACK_RESULT = {
  selectedFoodIds: [],
  coveredGroups: [],
  missingGroups: ['carbs', 'protein', 'vitamins'],
  whoaCount: 0,
  tierCounts: { go: 0, slow: 0, whoa: 0 },
  score: 0,
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
  };
}

function getDailyResultNoteMy(result) {
  if (result.whoaCount > 0 && result.coveredGroups.length === 0) {
    return 'Whoa food ပဲ ရွေးထားတာမို့ သကြားနဲ့ အဆီ များနိုင်ပါတယ်။ နောက်တစ်ခါ Go food လေးတွေ ထပ်ရွေးကြည့်ရအောင်။';
  }

  if (result.isBalanced) {
    if (result.whoaCount > 0) {
      return 'အာဟာရစုံအောင် ရွေးထားတာ ကောင်းပါတယ်။ Whoa food ပါလို့ ရေများများသောက်ပြီး နောက်တစ်ခါ နည်းနည်းပဲ စားရအောင်။';
    }
    return 'အာဟာရအုပ်စု သုံးမျိုးလုံး ပါတဲ့ အစားအစာပါ။ အရမ်းကောင်းပါတယ်!';
  }

  if (result.whoaCount >= 2) {
    return 'ဒီနေ့ Whoa food နည်းနည်းများနေပါတယ်။ နောက်တစ်ခါ အသီးအရွက်နဲ့ Go food တွေ ပိုရွေးရအောင်။';
  }

  if (result.missingGroups.length === 1) {
    if (result.missingGroups.includes('carbs')) {
      return 'အသားဓာတ်နဲ့ ဗီတာမင်တွေ ပါတာ ကောင်းပါတယ်။ အားအင်ရဖို့ ထမင်း၊ ပေါင်မုန့်လို ကာဗိုဟိုက်ဒရိတ်လေး ထပ်ဖြည့်ရအောင်။';
    }
    if (result.missingGroups.includes('protein')) {
      return 'ကာဗိုဟိုက်ဒရိတ်နဲ့ ဗီတာမင်တွေ ပါတာ ကောင်းပါတယ်။ ကြီးထွားဖို့ ကြက်ဥ၊ အသား၊ ပဲလို အသားဓာတ်လေး ထပ်ဖြည့်ရအောင်။';
    }
    if (result.missingGroups.includes('vitamins')) {
      return 'ဗိုက်ပြည့်စေတဲ့ အစားအစာတွေ ရွေးထားတာ ကောင်းပါတယ်။ ကျန်းမာနေဖို့ အသီးအရွက်လေးတွေ ထပ်ရွေးရအောင်။';
    }
  }

  if (result.coveredGroups.length === 1) {
    if (result.coveredGroups.includes('carbs')) {
      return 'အားအင်ရတဲ့ အစားအစာပါ။ နောက်တစ်ခါ အသားဓာတ်နဲ့ အသီးအရွက်လေးတွေပါ ထပ်ရွေးရအောင်။';
    }
    if (result.coveredGroups.includes('protein')) {
      return 'ကြီးထွားဖို့ ကူညီတဲ့ အစားအစာပါ။ နောက်တစ်ခါ အားအင်ရစေတဲ့ အစားအစာနဲ့ အသီးအရွက်လေးတွေပါ ထပ်ရွေးရအောင်။';
    }
    if (result.coveredGroups.includes('vitamins')) {
      return 'ဗီတာမင်ပါတဲ့ အစားအစာပါ။ နောက်တစ်ခါ အားအင်ရစေတဲ့ အစားအစာနဲ့ အသားဓာတ်လေးပါ ထပ်ရွေးရအောင်။';
    }
  }

  return 'ဒီနေ့ စစ်ကြည့်တာ ကောင်းပါတယ်။ နောက်တစ်ခါ အာဟာရစုံအောင် ထပ်ရွေးရအောင်။';
}

export default function DailyResultScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [feedback, setFeedback] = useState(null);

  const result = useMemo(
    () => normalizeResult(location.state?.result),
    [location.state?.result]
  );

  useEffect(() => {
    const fb = selectBalanceFeedback(result);
    setFeedback(fb);
  }, [result]);

  const handleContinue = () => {
    navigate('/daily-log', { state: { skipLoading: true } });
  };

  const resultTitle = result.isBalanced ? 'Balanced meal!' : 'Nice check-in!';
  const resultTitleMy = result.isBalanced ? 'မျှတတဲ့အစားအစာပါ။' : 'စစ်ကြည့်တာ ကောင်းပါတယ်။';
  const resultPandaImage = getResultPandaImage(result.score ?? result.coveredGroups.length);
  const isOnlyWhoaMeal = result.whoaCount > 0 && result.coveredGroups.length === 0;
  const noteTextMy = getDailyResultNoteMy(result);
  const noteText = isOnlyWhoaMeal
    ? {
        my: 'Whoa food ပဲ ရွေးထားတာမို့ သကြားနဲ့ အဆီများနိုင်ပါတယ်။ နောက်တစ်ခါ Go food လေးတွေ ထပ်ရွေးကြည့်ရအောင်။',
        en: 'You chose only a Whoa food. Treats are okay sometimes, but too much sugar or fat can cause tummy aches or an energy crash.',
      }
    : feedback?.text;

  return (
    <div className="daily-result-screen">
      <button
        className="daily-log-back-btn daily-result-back-btn"
        onClick={() => navigate('/daily-log', { state: { skipLoading: true } })}
        aria-label="Back to Daily Log"
      />

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
              <span>{noteTextMy}</span>
              <span>{noteText?.en || 'Great job checking in today!'}</span>
              {result.whoaCount > 0 && !isOnlyWhoaMeal && (
                <span className="daily-result-note-warning">
                  Whoa food warning: keep treats small. Too much sugar or fat can cause tummy aches, extra thirst, or an energy crash.
                </span>
              )}
            </div>
          </div>
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
