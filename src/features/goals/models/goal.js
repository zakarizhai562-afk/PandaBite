export const goals = [
  {
    id: 'grow-taller',
    name: { my: 'ပိုမြင့်စွာ ကြီးထွားဖို့', en: 'Grow Taller' },
    description: { my: 'အရိုးနှင့်ကြွက်သားများ ကြီးထွားဖို့ အစားအစာများ', en: 'Foods for strong bones and muscles' },
    matchingFoods: ['egg', 'rice', 'fish'],
    nonMatchingFoods: ['candy'],
    reactions: {
      correct: { my: 'ဟုတ်ကဲ့! ဒါက ပိုမြင့်စွာ ကြီးထွားဖို့ ကူညီပါတယ်!', en: 'Yes! This helps you grow taller!' },
      wrong: { my: 'ဒါက ဒီရည်မှန်းချက်အတွက် သိပ်မသင့်တောင်းဘူးနော်!', en: "This one doesn't quite fit this goal!" },
      hintClue: { my: 'ဒါက ပရိုတင်းနှင့် ကယ်လ်စီယမ် ပါဝင်ပါသလား?', en: 'Does this have protein or calcium?' },
    },
    tips: [
       { my: 'ဥနှင့်ငါးသည် ပရိုတင်းနှင့် ကယ်လ်စီယမ် ပါဝင်ပါသည်', en: 'Eggs and fish are rich in protein and calcium' },
       { my: 'ထမင်းသည် အင်အားပေးပါသည်', en: 'Rice gives you energy to play and grow' },
     ],
  },
  {
    id: 'more-energy',
    name: { my: 'ပိုများသော အင်အားရဖို့', en: 'Have More Energy' },
    description: { my: 'နေ့စဉ်ကစားဖို့ အင်အားပေးသော အစားအစာများ', en: 'Foods that give you energy to play all day' },
    matchingFoods: ['rice', 'banana', 'egg'],
    nonMatchingFoods: ['candy'],
    reactions: {
      correct: { my: 'ကောင်းပါတယ်! ဒါက အင်အားပေးပါတယ်!', en: 'Great! This gives you energy!' },
      wrong: { my: 'ဒါက အင်အားသိပ်မပေးနိုင်ဘူးနော်!', en: "This one doesn't give much energy!" },
      hintClue: { my: 'ဒါက ကစားဖို့ အင်အားပေးနိုင်ပါသလား?', en: 'Can this give you energy to play?' },
    },
    tips: [
      { my: 'ထမင်းနှင့် ငှက်ပျောသည် အင်အားပေးပါသည်', en: 'Rice and banana give you energy' },
      { my: 'ဥသည် ပရိုတင်းပေးပြီး အင်အားတည်ဆောက်ပါသည်', en: 'Egg gives protein and builds strength' },
    ],
  },
  {
    id: 'clear-skin',
    name: { my: 'သန့်ရှင်းသော အရေပြားရဖို့', en: 'Clear Skin' },
    description: { my: 'အရေပြားကျန်းမာဖို့ အစားအစာများ', en: 'Foods for healthy skin' },
    matchingFoods: ['banana', 'egg', 'rice'],
    nonMatchingFoods: ['candy'],
    reactions: {
      correct: { my: 'ကောင်းပါတယ်! ဒါက အရေပြားကို ကျန်းမာစေပါတယ်!', en: 'Great! This keeps your skin healthy!' },
      wrong: { my: 'ဒါက အရေပြားအတွက် သိပ်မကောင်းဘူးနော်!', en: "This one isn't the best for skin!" },
      hintClue: { my: 'ဒါက ဗီတာမင်ပါဝင်ပါသလား?', en: 'Does this have vitamins?' },
    },
    tips: [
      { my: 'ငှက်ပျောသည် ဗီတာမင်ပေးပြီး အရေပြားကို ကျန်းမာစေပါသည်', en: 'Banana gives vitamins and keeps skin healthy' },
      { my: 'ဥသည် အရေပြားတည်ဆောက်ဖို့ ကူညီပါသည်', en: 'Egg helps build healthy skin' },
    ],
  },
];

/**
 * Get a goal by its ID.
 * @param {string} goalId
 * @returns {typeof goals[0]|undefined}
 */
export function getGoalById(goalId) {
  return goals.find((g) => g.id === goalId);
}

/**
 * Check if a food matches a goal.
 * @param {string} goalId
 * @param {string} foodId
 * @returns {boolean}
 */
export function doesFoodMatchGoal(goalId, foodId) {
  const goal = getGoalById(goalId);
  if (!goal) return false;
  return goal.matchingFoods.includes(foodId);
}

/**
 * Get the food choices for a goal round (matching + non-matching, shuffled).
 * @param {string} goalId
 * @returns {string[]}
 */
export function getGoalFoodChoices(goalId) {
  const goal = getGoalById(goalId);
  if (!goal) return [];

  const choices = [...goal.matchingFoods, ...goal.nonMatchingFoods];
  return choices.sort(() => Math.random() - 0.5);
}
