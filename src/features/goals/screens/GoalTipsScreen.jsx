import { useLocation, useNavigate } from 'react-router-dom';
import { getGoalById } from '../models/goal';

const TIP_SCREEN_COPY = {
  'grow-taller': {
    title: 'Tips to Grow Taller',
    reminder: {
      my: 'ကိုယ်ခန္ဓာ ပိုကြီးထွားဖို့ ဒီအကြံပြုချက်တွေကို မှတ်ထားနော်။',
      en: 'Remember these tips for next time!',
    },
    tips: [
      {
        my: 'နို့နဲ့ ကယ်လ်စီယမ်ပါတဲ့ အစားအစာတွေကို စားပေးပါ။',
        en: 'Drink milk and eat calcium-rich foods.',
      },
      {
        my: 'အသီးအနှံနဲ့ ဟင်းသီးဟင်းရွက်တွေကို ပုံမှန်စားပေးပါ။',
        en: 'Eat fruits and vegetables regularly.',
      },
    ],
  },
  'more-energy': {
    title: 'Tips for More Energy',
    reminder: {
      my: 'အားအင်ပြည့်နေဖို့ ဒီအကြံပြုချက်တွေကို မှတ်ထားနော်။',
      en: 'Remember these tips for next time!',
    },
    tips: [
      {
        my: 'ထမင်းနဲ့ ငှက်ပျောသီးက အားအင်ပေးပါတယ်။',
        en: 'Rice and banana give you energy.',
      },
      {
        my: 'ကြက်ဥက ပရိုတင်းပေးပြီး ခန္ဓာကိုယ်ကို သန်မာစေပါတယ်။',
        en: 'Egg gives protein and builds strength.',
      },
    ],
  },
  'clear-skin': {
    title: 'Tips for Clear Skin',
    reminder: {
      my: 'အသားအရေ ကျန်းမာဖို့ ဒီအကြံပြုချက်တွေကို မှတ်ထားနော်။',
      en: 'Remember these tips for next time!',
    },
    tips: [
      {
        my: 'ရေလုံလောက်အောင် သောက်ပေးပါ။',
        en: 'Drink enough water.',
      },
      {
        my: 'အသီးအနှံနဲ့ ဟင်းသီးဟင်းရွက်တွေကို စားပေးပါ။',
        en: 'Eat fruits and vegetables.',
      },
    ],
  },
};

export default function GoalTipsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const goalId = location.state?.goalId;
  const goal = goalId ? getGoalById(goalId) : null;
  const tipScreen = goal ? TIP_SCREEN_COPY[goal.id] : null;

  if (!goal || !tipScreen) {
    return (
      <div className="goal-tips-screen goal-tips-screen--fallback">
        <p className="goal-tips-fallback-text">Goal not found.</p>
      </div>
    );
  }

  return (
    <div className={`goal-tips-screen goal-tips-screen--${goal.id}`}>
      <main className="goal-tips-stage" aria-label={tipScreen.title}>
        <h1 className="goal-tips-title">{tipScreen.title}</h1>

        <img
          className="goal-tips-panda"
          src="/images/combobox/excited.png"
          alt="Excited panda"
        />

        <section className="goal-tips-content">
          <div className="goal-tips-reminder">
            <div>
              <p className="goal-tips-my">{tipScreen.reminder.my}</p>
              <p className="goal-tips-en">{tipScreen.reminder.en}</p>
            </div>
          </div>

          <div className="goal-tips-list">
            {tipScreen.tips.map((tip, index) => (
              <article className="goal-tip-card" key={tip.en}>
                <span className="goal-tip-number" aria-hidden="true">
                  {index + 1}
                </span>
                <div className="goal-tip-text">
                  <p className="goal-tip-my">{tip.my}</p>
                  <p className="goal-tip-en">{tip.en}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="goal-tips-actions">
            <button
              className="btn-primary goal-tips-action-btn"
              onClick={() => navigate('/home')}
              type="button"
            >
              Home
            </button>
            <button
              className="btn-primary goal-tips-action-btn"
              onClick={() => navigate('/goals')}
              type="button"
            >
              Continue
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
