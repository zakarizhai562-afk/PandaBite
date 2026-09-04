// Daily Log feedback libraries — per-item reactions and daily balance results
// Bilingual (Myanmar/English)

export const DL_ITEM_REACTIONS = {
  // Go tier foods
  rice: {
    my: 'ထမင်း က ကစားဖို့နဲ့ လေ့လာဖို့ ခွန်အား ပေးပါတယ်!',
    en: 'Rice gives you energy to play and learn!',
  },
  noodles: {
    my: 'ခေါက်ဆွဲ က ခွန်အား ပေးပါတယ်!',
    en: 'Noodles give you energy!',
  },
  bread: {
    my: 'ပေါင်မုန့် က ခွန်အား ပေးပါတယ်!',
    en: 'Bread gives you energy to move and play!',
  },
  egg: {
    my: 'ကြက်ဥ က ခန္ဓာကိုယ် ကြီးထွားဖို့ ကူညီပေးတယ်!',
    en: 'Egg helps your body grow strong!',
  },
  chicken: {
    my: 'ကြက်သား က ကြွက်သားတွေ သန်မာဖို့ ကူညီပေးတယ်!',
    en: 'Chicken helps your muscles grow strong!',
  },
  fish: {
    my: 'ငါး က ဦးနှောက်နဲ့ ခန္ဓာကိုယ် ကြီးထွားဖို့ ကူညီပေးတယ်!',
    en: 'Fish helps your brain and body grow!',
  },
  beans: {
    my: 'ပဲ က ကြွက်သားနဲ့ ခွန်အား ပေးပါတယ်!',
    en: 'Beans give you strength and energy!',
  },
  mango: {
    my: 'သရက်သီး က ဗီတာမင်တွေ ပေးပြီး ကျန်းမာစေတယ်!',
    en: 'Mango gives you vitamins to stay healthy!',
  },
  banana: {
    my: 'ငှက်ပျောသီး က ခွန်အားနဲ့ ဗီတာမင် ပေးပါတယ်!',
    en: 'Banana gives you energy and vitamins!',
  },
  carrot: {
    my: 'မုန်လာဥ က မျက်စိကောင်းဖို့ ကူညီပေးတယ်!',
    en: 'Carrots help your eyes stay healthy!',
  },
  spinach: {
    my: 'ဟင်းရွက် က ဗီတာမင်တွေ အများကြီး ပေးပါတယ်!',
    en: 'Spinach gives you lots of vitamins!',
  },
  // Slow tier foods
  fried_chicken: {
    my: 'ကြက်ကြော် က အရသာရှိပေမဲ့ အတိတ်စားပါ!',
    en: 'Fried chicken is tasty — enjoy it sometimes!',
  },
  cheese: {
    my: 'ဒိန်ခဲ က အရသာရှိပေမဲ့ အတိတ်စားပါ!',
    en: 'Cheese is tasty — enjoy it sometimes!',
  },
  fries: {
    my: 'အာလူးကြော် က အရသာရှိပေမဲ့ အတိတ်စားပါ!',
    en: 'French fries are tasty — enjoy them sometimes!',
  },
  juice: {
    my: 'ဖျော်ရည် က အရသာရှိပေမဲ့ သကြားဓာတ် များပါတယ်!',
    en: 'Juice is tasty but has some sugar — enjoy in moderation!',
  },
  // Whoa tier foods
  candy: {
    my: 'အနည်းငယ်စားရင် ရပါတယ်၊ ဒါပေမဲ့ အချိုဓာတ်များတဲ့ အစားအစာတွေ အလွန်အကျွံ မစားပါနဲ့နော်!',
    en: 'A little is okay, but try not to eat too much sugary food!',
  },
  soda: {
    my: 'အအေး က ခွန်အား မပေးပါဘူးနော်! ရေသောက်တာ ပိုကောင်းပါတယ်!',
    en: 'Soda doesn\'t give real energy — water is better for you!',
  },
  cake: {
    my: 'ကိတ်မုန့် က အရသာရှိပေမဲ့ သကြားဓာတ် အများကြီး ပါပါတယ်!',
    en: 'Cake is yummy but has lots of sugar — have a small piece!',
  },
  ice_cream: {
    my: 'ရေခဲမုန့် က အရသာရှိပေမဲ့ သကြားဓာတ် များပါတယ်!',
    en: 'Ice cream is yummy but has a lot of sugar!',
  },
};

// Fallback for unknown foods
export const DL_ITEM_DEFAULT = {
  my: 'ဒီအစားအစာ က ကောင်းပါတယ်!',
  en: 'This food is a good choice!',
};

export function getPerItemReaction(foodId) {
  return DL_ITEM_REACTIONS[foodId] || DL_ITEM_DEFAULT;
}

// Daily Balance result feedback library
export const BALANCE_FEEDBACK = {
  // Group 1 — Balanced (all 3 groups present)
  BAL_01: {
    my: 'ဝါး... ဒီနေ့ အာဟာရ သုံးမျိုးစလုံး စုံလင်အောင် စားနိုင်ခဲ့တာပဲ။ တော်လိုက်တာ! ခန္ဓာကိုယ်လေး ခွန်အားပြည့်ပြီး ကျန်းမာနေတော့မှာပဲ!',
    en: 'Wow, you ate a perfectly balanced meal today! Super job! Your body will feel energized and strong!',
  },
  BAL_02: {
    my: 'စူပါဟီးရိုးလေးလိုပဲ အာဟာရစုံအောင် ရွေးချယ်နိုင်ခဲ့တယ်! Red Panda က အရမ်း ဂုဏ်ယူနေတယ်နော်!',
    en: 'You picked a meal fit for a superhero today! Red Panda is super proud of you!',
  },
  BAL_03: {
    my: 'အာဟာရဓာတ်စုံလင်အောင် စားသုံးနိုင်ခဲ့တာပဲ၊ တော်လိုက်တာ! ဒီအတိုင်းလေးပဲ ဆက်လက် ထိန်းသိမ်းသွားကြရအောင်နော်!',
    en: 'Fantastic job eating a fully balanced meal! Let\'s keep up this great healthy habit!',
  },
  // Balanced but includes Whoa food
  BAL_04: {
    my: 'ဒီနေ့ အာဟာရစုံအောင် စားထားတာ အရမ်းကောင်းတယ်! Whoa food လေးလည်း ပါနေလို့ သကြားဓာတ် မများအောင် ရေအေးအေးလေး များများသောက်ပေးနော်!',
    en: 'Great job eating a balanced meal! Since you had a Whoa treat, make sure to drink plenty of fresh water today!',
  },
  // Group 2 — Missing exactly one group
  DEF_C01: {
    my: 'ဒီနေ့ ကြွက်သားနဲ့ ဗီတာမင်တော့ ပြည့်စုံပါပြီ! ဒါပေမဲ့ တနေကုန် တက်ကြွစွာ ဆော့ကစားဖို့ ခွန်အားပေးတဲ့ ကာဗိုဟိုက်ဒရိတ် (ထမင်း/ပေါင်မုန့်) လေး နည်းနည်း လိုနေသေးတယ်နော်!',
    en: 'Great protein and vitamins today! But you might need a bit more energy-rich carbs like rice or bread to play hard!',
  },
  DEF_P01: {
    my: 'ဒီနေ့ ကာဗိုဟိုက်ဒရိတ်နဲ့ ဗီတာမင် စားထားတာ ကောင်းတယ်နော်! ခန္ဓာကိုယ် ကြီးထွားဖို့ ပရိုတိန်း (ကြက်ဥ/အသား/ပဲ) လေး နည်းနည်း ထပ်ဖြည့်စားကြရအောင်!',
    en: 'Good job on carbs and vitamins today! Let\'s add some protein like eggs, meat, or beans to help grow strong muscles!',
  },
  DEF_V01: {
    my: 'ဗိုက်တော့ ပြည့်သွားပြီ! ဒါပေမဲ့ ခန္ဓာကိုယ်လေး ရောဂါကင်းစင်ပြီး လန်းဆန်းနေဖို့ အသီးအနှံနဲ့ ဟင်းသီးဟင်းရွက် (ဗီတာမင်) လေးတွေ နည်းနည်း ပိုစားကြည့်ရအောင်နော်!',
    en: 'A full belly, awesome! But how about adding a few more fruits or veggies for extra vitamins to stay healthy and bright?',
  },
  // Group 3 — Only one group present
  DEF_ONLY_C: {
    my: 'ခွန်အားတော့ အပြည့်ရသွားပြီ! နောက်တစ်ခါ စားရင်တော့ ခန္ဓာကိုယ် ကြီးထွားဖို့ ပရိုတိန်းနဲ့ ဗီတာမင်ပါ ပါအောင် စားကြည့်ရအောင်နော်!',
    en: 'Lots of energy unlocked! Next time, let\'s try to add some protein and vitamins to make your meal super complete!',
  },
  DEF_ONLY_P: {
    my: 'ကြွက်သားတွေ သန်မာဖို့ ပရိုတိန်း စားထားတာ တော်တယ်။ ခွန်အားရဖို့နဲ့ ရောဂါကင်းဖို့ ကာဗိုဟိုက်ဒရိတ်နဲ့ ဗီတာမင်လေးတွေပါ ထပ်ဖြည့်စားလိုက်ရအောင်!',
    en: 'Awesome protein choices! Let\'s pair them with some carbs for energy and vitamins for full protection!',
  },
  DEF_ONLY_V: {
    my: 'အသီးအနှံတွေ စားထားလို့ ဗီတာမင် ပြည့်ဝနေပြီ! ဆော့ကစားဖို့ ခွန်အားနဲ့ ကြီးထွားဖို့ ပရိုတိန်းပါ ထပ်ဖြည့် စားပေးရမယ်နော်!',
    en: 'Fresh vitamins unlocked! Make sure to also get some carbs for power and protein to grow big and strong!',
  },
  // Group 4 — High Whoa / excess sugar states
  WARN_W01: {
    my: 'အချိုမုန့်လေးတွေက အရသာရှိပေမဲ့ ခန္ဓာကိုယ်အတွက် ရေရှည်ခွန်အား မရဘူးနော်! ခန္ဓာကိုယ်လေး လန်းဆန်းသွားအောင် ရေအေးအေးလေး သောက်လိုက်ရအောင်!',
    en: 'Sweet treats taste yum, but they don\'t give lasting energy! Let\'s drink some fresh water to feel bright again!',
  },
  WARN_W02: {
    my: 'ဒီနေ့ မုန့်အချိုတွေ အများကြီး စားထားတယ်နော်! မနက်ဖြန်မှာတော့ ခန္ဓာကိုယ်လေး ပိုသန်မာလာအောင် အရည်ရွှမ်းတဲ့ သစ်သီးလေးတွေ အစားထိုး စားကြည့်ကြစို့၊',
    en: 'You had quite a few treats today! Tomorrow, let\'s replace them with juicy fruits for super strength!',
  },
  FALLBACK: {
    my: 'ဒီနေ့ စားထားတာ ကောင်းပါတယ်!',
    en: 'Great job checking in today!',
  },
};

/**
 * Select the right feedback line based on the calculation result.
 * @param {{ coveredGroups: string[], missingGroups: string[], whoaCount: number, isBalanced: boolean }} result
 * @returns {{ key: string, text: { my: string, en: string } }}
 */
export function selectBalanceFeedback(result) {
  const { coveredGroups, missingGroups, whoaCount, isBalanced } = result;

  // Balanced
  if (isBalanced) {
    if (whoaCount > 0) {
      return { key: 'BAL_04', text: BALANCE_FEEDBACK.BAL_04 };
    }
    const balKeys = ['BAL_01', 'BAL_02', 'BAL_03'];
    const pick = balKeys[Math.floor(Math.random() * balKeys.length)];
    return { key: pick, text: BALANCE_FEEDBACK[pick] };
  }

  // High Whoa
  if (whoaCount >= 2) {
    if (coveredGroups.length < 3) {
      return { key: 'WARN_W02', text: BALANCE_FEEDBACK.WARN_W02 };
    }
    return { key: 'WARN_W01', text: BALANCE_FEEDBACK.WARN_W01 };
  }

  // Only one group
  if (coveredGroups.length === 1) {
    if (coveredGroups.includes('carbs')) return { key: 'DEF_ONLY_C', text: BALANCE_FEEDBACK.DEF_ONLY_C };
    if (coveredGroups.includes('protein')) return { key: 'DEF_ONLY_P', text: BALANCE_FEEDBACK.DEF_ONLY_P };
    if (coveredGroups.includes('vitamins')) return { key: 'DEF_ONLY_V', text: BALANCE_FEEDBACK.DEF_ONLY_V };
  }

  // Missing exactly one group
  if (missingGroups.length === 1) {
    if (missingGroups.includes('carbs')) return { key: 'DEF_C01', text: BALANCE_FEEDBACK.DEF_C01 };
    if (missingGroups.includes('protein')) return { key: 'DEF_P01', text: BALANCE_FEEDBACK.DEF_P01 };
    if (missingGroups.includes('vitamins')) return { key: 'DEF_V01', text: BALANCE_FEEDBACK.DEF_V01 };
  }

  // Fallback
  return { key: 'FALLBACK', text: BALANCE_FEEDBACK.FALLBACK };
}
