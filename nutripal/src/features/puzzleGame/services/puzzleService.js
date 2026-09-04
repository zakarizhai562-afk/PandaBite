import { PUZZLE_FOODS, getFoodById, getBasketByGroup } from './puzzleData';

export const STARTING_LIVES = 3;
export const POINTS_PER_CORRECT = 10;
export const SCORE_TO_LEVEL_COMPLETE = 100;
export const MAX_LEVEL = 3;
export const FEEDBACK_DURATION_MS = 1600;
export const HINT_DURATION_MS = 1000;

export const PLAYING = 'PLAYING';
export const PAUSED = 'PAUSED';
export const LEVEL_COMPLETE = 'LEVEL_COMPLETE';
export const GAME_COMPLETE = 'GAME_COMPLETE';
export const GAME_OVER = 'GAME_OVER';

export const MESSAGE_TEXTS_IDLE = [
  { my: 'မင်္ဂလာပါ! ငါက Panda လေးပါ! အစားအစာကို မှန်ကန်တဲ့ ခြင်းထဲ ဆွဲထည့်ပါ!', en: "Hi! I'm Panda! Drag each food into the right basket to help me grow big and strong!" },
  { my: 'အတူတူ အစားအစာ ခွဲခြားကြရအောင်!', en: "Let's sort some yummy food together!" },
  { my: 'ဒီအစားအစာက ဘယ်ခြင်းမှာ ပါသလဲ?', en: 'Which basket does this food belong in?' },
  { my: 'နေ့တိုင်း ကျန်းမာရေးနဲ့ညီညွတ်တဲ့ အစားအစာကို နှစ်သက်တယ်!', en: 'I love eating healthy food every day!' },
];

export const MESSAGE_TEXTS_HAPPY = [
  { my: 'ဟုတ်ကဲ့! မှန်ကန်ပါတယ်!', en: 'Yay! You got it right!' },
  { my: 'တော်လိုက်တာ! အတိအကျမှန်တယ်!', en: "Great job! That's exactly right!" },
  { my: 'အရမ်းတော်တယ်! ဆက်လုပ်ပါ!', en: 'Awesome sorting! Keep it up!' },
  { my: "အစားအစာ ခွဲခြားတဲ့ ကြယ်လေးပါ!", en: "You're a food-sorting star!" },
];

export const MESSAGE_TEXTS_SAD = [
  { my: 'အိုး! နောက်တစ်ကြိမ် ကြိုးစားကြည့်ပါ!', en: 'Oops! Let\'s try again!' },
  { my: 'မမှန်သေးဘူး! နောက်တစ်ကြိမ် ကြိုးစားပါ!', en: 'Not quite! Give it another try!' },
  { my: 'ရပါတယ်၊ အမှားတွေက သင်ယူဖို့ ကူညီပါတယ်!', en: 'That\'s okay, mistakes help us learn!' },
  { my: 'နည်းနည်းလိုသေးတယ်! နောက်တစ်ကြိမ် တခြားခြင်းကို စမ်းပါ!', en: 'Almost! Try a different basket next time!' },
];

export const TUTORIAL_HINT_TEXT = {
  my: 'အစားအစာကို မှန်ကန်တဲ့ ခြင်းထဲ ဆွဲထည့်ပါ!',
  en: 'Drag the food to the correct basket!',
};

export function pickRandomMessage(list, previous = null) {
  if (!list.length) return null;
  if (list.length === 1) return list[0];
  const choices = previous ? list.filter((m) => m.en !== previous.en) : list;
  return choices[Math.floor(Math.random() * choices.length)];
}

export function validateFoodData(foodData = PUZZLE_FOODS) {
  const errors = [];
  const seen = new Set();
  foodData.forEach((entry, index) => {
    const name = (entry.name?.en || '').trim();
    const group = entry.groups?.[0] || '';
    const image = (entry.image || '').trim();
    const label = name || `entry #${index}`;
    if (!name) errors.push(`Entry #${index}: missing name`);
    else if (seen.has(entry.id)) errors.push(`Duplicate food id: '${entry.id}'`);
    else seen.add(entry.id);
    if (!group) errors.push(`'${label}': missing group`);
    else if (!['carbs', 'protein', 'vitamins'].includes(group)) errors.push(`'${label}': invalid group '${group}'`);
    if (!image) errors.push(`'${label}': missing image`);
  });
  if (errors.length) throw new Error(`FOOD_DATA validation failed:\n- ${errors.join('\n- ')}`);
}

export function createInitialState() {
  return {
    score: 0,
    lives: STARTING_LIVES,
    level: 1,
    state: PLAYING,
    mistakesThisLevel: 0,
  };
}

export function addScore(state, points = POINTS_PER_CORRECT) {
  const next = { ...state, score: state.score + points };
  if (next.score >= SCORE_TO_LEVEL_COMPLETE) {
    next.state = next.level >= MAX_LEVEL ? GAME_COMPLETE : LEVEL_COMPLETE;
  }
  return next;
}

export function loseLife(state) {
  const next = {
    ...state,
    lives: Math.max(0, state.lives - 1),
    mistakesThisLevel: state.mistakesThisLevel + 1,
  };
  if (next.lives <= 0) {
    next.state = GAME_OVER;
  }
  return next;
}

export function starRating(mistakesThisLevel) {
  if (mistakesThisLevel === 0) return 3;
  if (mistakesThisLevel <= 2) return 2;
  return 1;
}

export function nextLevel(state) {
  return {
    ...state,
    level: state.level + 1,
    score: 0,
    mistakesThisLevel: 0,
    state: PLAYING,
  };
}

export function resetGame() {
  return createInitialState();
}

export function togglePause(state) {
  if (state.state === PLAYING) return { ...state, state: PAUSED };
  if (state.state === PAUSED) return { ...state, state: PLAYING };
  return state;
}

export function isPlaying(state) {
  return state.state === PLAYING;
}

export function checkAnswer(foodId, basketId) {
  const food = getFoodById(foodId);
  if (!food) return { isCorrect: false, food: null, correctBasket: null };
  const correctGroup = food.groups[0];
  const correctBasket = getBasketByGroup(correctGroup);
  const isCorrect = correctBasket?.id === basketId;
  return { isCorrect, food, correctBasket };
}

export function getFeedbackForCorrect(food) {
  const basket = getBasketByGroup(food.groups[0]);
  return {
    title: 'Great Job!',
    detail: `+${POINTS_PER_CORRECT} Points`,
    titleMy: 'တော်လိုက်တာ!',
    detailMy: `+${POINTS_PER_CORRECT} မှတ်`,
    isCorrect: true,
    correctBasket: basket,
  };
}

export function getFeedbackForWrong(food) {
  const basket = getBasketByGroup(food.groups[0]);
  const detail = basket ? `${food.name.en} → ${basket.fullName}` : food.name.en;
  const detailMy = basket ? `${food.name.my} → ${basket.label.my}` : food.name.my;
  return {
    title: 'Try Again!',
    detail,
    titleMy: 'နောက်တစ်ကြိမ်!',
    detailMy: detailMy,
    isCorrect: false,
    correctBasket: basket,
  };
}

export function shouldSpawnNewFoodAfterCorrect() {
  return true;
}
