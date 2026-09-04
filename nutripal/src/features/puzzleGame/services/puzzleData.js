import foodDatabase from '../../../data/foodDatabase.json';

export const VALID_GROUPS = ['carbs', 'protein', 'vitamins'];

export const GROUP_TO_BASKET = {
  carbs: 'energy',
  protein: 'body',
  vitamins: 'protective',
};

export const BASKET_TO_GROUP = {
  energy: 'carbs',
  body: 'protein',
  protective: 'vitamins',
};

export const BASKETS = [
  {
    id: 'energy',
    group: 'carbs',
    label: { my: 'စွမ်းအင်', en: 'Energy' },
    shortLabel: 'ENERGY',
    subtitle: 'Energy-Giving',
    fullName: 'Energy-Giving Foods',
    image: '/images/puzzle/bin_energy.png',
    fallbackColor: '#FF8C42',
    themeColor: '#FF8C42',
  },
  {
    id: 'body',
    group: 'protein',
    label: { my: 'ကြီးထွားမှု', en: 'Growth' },
    shortLabel: 'GROWTH',
    subtitle: 'Body-Building',
    fullName: 'Body-Building Foods',
    image: '/images/puzzle/bin_growth.png',
    fallbackColor: '#E85D75',
    themeColor: '#E85D75',
  },
  {
    id: 'protective',
    group: 'vitamins',
    label: { my: 'ကာကွယ်မှု', en: 'Health' },
    shortLabel: 'HEALTH',
    subtitle: 'Protective',
    fullName: 'Protective Foods',
    image: '/images/puzzle/bin_health.png',
    fallbackColor: '#2D6A4F',
    themeColor: '#2D6A4F',
  },
];

const PYTHON_EXTRA_FOODS = [
  { id: 'corn', name: { my: 'ပြောင်း', en: 'Corn' }, groups: ['carbs'], tier: 'Go', image: '/images/food/corn.png' },
  { id: 'potato', name: { my: 'အာလူး', en: 'Potato' }, groups: ['carbs'], tier: 'Go', image: '/images/food/potato.png' },
  { id: 'sweet_potato', name: { my: 'ကန်စွန်းဥ', en: 'Sweet Potato' }, groups: ['carbs'], tier: 'Go', image: '/images/food/sweet_potato.png' },
  { id: 'cereals', name: { my: 'စီရီရယ်', en: 'Cereals' }, groups: ['carbs'], tier: 'Go', image: '/images/food/cereals.png' },
  { id: 'pancakes', name: { my: 'ပန်ကိတ်', en: 'Pancakes' }, groups: ['carbs'], tier: 'Go', image: '/images/food/pancakes.png' },
  { id: 'wheat_flour', name: { my: 'ဂျုံမှုန့်', en: 'Wheat / Flour' }, groups: ['carbs'], tier: 'Go', image: '/images/food/wheat_flour.png' },
  { id: 'beef', name: { my: 'အမဲသား', en: 'Beef' }, groups: ['protein'], tier: 'Go', image: '/images/food/beef.png' },
  { id: 'milk', name: { my: 'နို့', en: 'Milk' }, groups: ['protein'], tier: 'Go', image: '/images/food/milk.png' },
  { id: 'soybeans', name: { my: 'ပဲပိစပ်', en: 'Soybeans' }, groups: ['protein'], tier: 'Go', image: '/images/food/soybeans.png' },
  { id: 'peanut', name: { my: 'မြေပဲ', en: 'Peanut' }, groups: ['protein'], tier: 'Go', image: '/images/food/peanut.png' },
  { id: 'broccoli', name: { my: 'ပန်းဂေါ်ဖီ', en: 'Broccoli' }, groups: ['vitamins'], tier: 'Go', image: '/images/food/broccoli.png' },
  { id: 'tomato', name: { my: 'ခရမ်းချဉ်', en: 'Tomato' }, groups: ['vitamins'], tier: 'Go', image: '/images/food/tomato.png' },
  { id: 'cucumber', name: { my: 'သခွားသီး', en: 'Cucumber' }, groups: ['vitamins'], tier: 'Go', image: '/images/food/cucumber.png' },
  { id: 'orange', name: { my: 'လိမ္မော်', en: 'Orange' }, groups: ['vitamins'], tier: 'Go', image: '/images/food/orange.png' },
  { id: 'apple', name: { my: 'ပန်းသီး', en: 'Apple' }, groups: ['vitamins'], tier: 'Go', image: '/images/food/apple.png' },
  { id: 'watermelon', name: { my: 'ဖရဲသီး', en: 'Watermelon' }, groups: ['vitamins'], tier: 'Go', image: '/images/food/watermelon.png' },
  { id: 'pineapple', name: { my: 'နာနတ်သီး', en: 'Pineapple' }, groups: ['vitamins'], tier: 'Go', image: '/images/food/pineapple.png' },
];

const SHARED_FOODS = foodDatabase.foods.filter((f) => f.groups.length > 0);

const existingIds = new Set(SHARED_FOODS.map((f) => f.id));
const mergedExtras = PYTHON_EXTRA_FOODS.filter((f) => !existingIds.has(f.id));

export const PUZZLE_FOODS = [...SHARED_FOODS, ...mergedExtras];

export function validatePuzzleFoods(foods = PUZZLE_FOODS) {
  const errors = [];
  const seen = new Set();
  foods.forEach((entry, index) => {
    const name = (entry.name?.en || '').trim();
    const group = entry.groups?.[0] || '';
    const image = (entry.image || '').trim();
    const label = name || `entry #${index}`;
    if (!name) errors.push(`Entry #${index}: missing name`);
    else if (seen.has(entry.id)) errors.push(`Duplicate food id: '${entry.id}'`);
    else seen.add(entry.id);
    if (!group) errors.push(`'${label}': missing group`);
    else if (!VALID_GROUPS.includes(group)) errors.push(`'${label}': invalid group '${group}' (valid: ${VALID_GROUPS})`);
    if (!image) errors.push(`'${label}': missing image`);
  });
  if (errors.length) throw new Error(`PUZZLE_FOODS validation failed:\n- ${errors.join('\n- ')}`);
}

export function getFoodById(id) {
  return PUZZLE_FOODS.find((f) => f.id === id) || null;
}

export function getBasketByGroup(group) {
  return BASKETS.find((b) => b.group === group) || null;
}

export function getBasketById(id) {
  return BASKETS.find((b) => b.id === id) || null;
}

export function getRandomFood(excludeId = null) {
  const pool = excludeId ? PUZZLE_FOODS.filter((f) => f.id !== excludeId) : PUZZLE_FOODS;
  return pool[Math.floor(Math.random() * pool.length)];
}
