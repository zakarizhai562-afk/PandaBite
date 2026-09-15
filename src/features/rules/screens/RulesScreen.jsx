import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RULE_PAGES = [
  {
    id: 'go',
    title: 'Go Foods',
    subtitle: 'Eat often',
    my: 'Go Foods တွေက ခန္ဓာကိုယ်ကို ကျန်းမာသန်စွမ်းစေတဲ့ အစားအစာတွေပါ။ အသီးအနှံ၊ ဟင်းသီးဟင်းရွက်၊ ရေ၊ ပြုတ်ထားတဲ့ အသား၊ ငါး၊ ကြက်ဥတွေကို နေ့တိုင်း စားလို့ကောင်းပါတယ်။',
    en: 'Go Foods help your body stay strong and healthy. Fruits, vegetables, water, boiled meat, fish, and eggs are good everyday choices.',
  },
  {
    id: 'slow',
    title: 'Slow Foods',
    subtitle: 'Eat sometimes',
    my: 'Slow Foods တွေက အာဟာရရှိပေမယ့် ဆီ၊ သကြား၊ ဂျုံဖြူ ပိုပါနိုင်ပါတယ်။ ပေါင်မုန့်ဖြူ၊ ခေါက်ဆွဲ၊ ကြော်ထားတဲ့ အစားအစာတွေကို အနည်းငယ်ပဲ စားပါ။',
    en: 'Slow Foods can give nutrients, but may have extra oil, sugar, or refined flour. Eat foods like white bread, noodles, and fried snacks in small amounts.',
  },
  {
    id: 'whoa',
    title: 'Whoa Foods',
    subtitle: 'Eat a little',
    my: 'Whoa Foods တွေမှာ သကြားနဲ့ အဆီများတတ်ပါတယ်။ သကြားလုံး၊ ဆိုဒါ၊ ကိတ်မုန့်၊ အာလူးကြော်တွေကို အထူးအချိန်တွေမှာပဲ နည်းနည်းစားပါ။',
    en: 'Whoa Foods usually have lots of sugar or fat. Candy, soda, cake, and fries are treats, so enjoy only a little once in a while.',
  },
];

export default function RulesScreen() {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(0);
  const page = RULE_PAGES[pageIndex];
  const isFirst = pageIndex === 0;
  const isLast = pageIndex === RULE_PAGES.length - 1;
  const progressLabel = useMemo(() => `${pageIndex + 1} / ${RULE_PAGES.length}`, [pageIndex]);

  const handleNext = () => {
    if (isLast) {
      navigate('/home');
      return;
    }
    setPageIndex((index) => index + 1);
  };

  return (
    <div className={`rules-screen rules-screen--${page.id}`}>
      <main className="rules-stage" aria-label="Food rules">
        <img
          className="rules-panda"
          src="/images/combobox/excited.png"
          alt="Excited panda"
          draggable="false"
        />

        <section className="rules-dialogue">
          <p className="rules-progress">{progressLabel}</p>
          <h1>{page.title}</h1>
          <p className="rules-subtitle">{page.subtitle}</p>
          <div className="rules-copy">
            <p className="rules-copy-my">{page.my}</p>
            <p className="rules-copy-en">{page.en}</p>
          </div>

          <div className="rules-actions">
            <button
              className="btn-primary rules-action-btn"
              type="button"
              onClick={() => setPageIndex((index) => Math.max(0, index - 1))}
              disabled={isFirst}
            >
              Back
            </button>
            <button className="btn-primary rules-action-btn" type="button" onClick={handleNext}>
              {isLast ? 'Home' : 'Next'}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
