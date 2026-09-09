// Food dataset migrated 1:1 from the Python/Pygame reference (old/game/food.py
// FOOD_DATA). Names, groups, and image assignments are exactly as authored
// there -- do not invent, remove, or re-classify entries here. Images live in
// public/puzzle-classic/images/, copied verbatim from the Python project's
// assets/images/ folder.
export const VALID_GROUPS = ['energy', 'body', 'protective'];

const IMAGE_BASE = '/puzzle-classic/images';

export const FOOD_DATA = [
  // Energy-Giving Foods
  { name: 'Rice', group: 'energy', image: `${IMAGE_BASE}/rice.png` },
  { name: 'Bread', group: 'energy', image: `${IMAGE_BASE}/bread.png` },
  { name: 'Noodles', group: 'energy', image: `${IMAGE_BASE}/noodles.png` },
  { name: 'Corn', group: 'energy', image: `${IMAGE_BASE}/corn.png` },
  { name: 'Potato', group: 'energy', image: `${IMAGE_BASE}/potato.png` },
  { name: 'Sweet Potato', group: 'energy', image: `${IMAGE_BASE}/sweet_potato.png` },
  { name: 'Cereals', group: 'energy', image: `${IMAGE_BASE}/cereals.png` },
  { name: 'Pancakes', group: 'energy', image: `${IMAGE_BASE}/pancakes.png` },
  { name: 'Wheat / Flour', group: 'energy', image: `${IMAGE_BASE}/wheat_flour.png` },
  { name: 'Banana', group: 'energy', image: `${IMAGE_BASE}/banana.png` },

  // Body-Building Foods
  { name: 'Chicken', group: 'body', image: `${IMAGE_BASE}/chicken.png` },
  { name: 'Beef', group: 'body', image: `${IMAGE_BASE}/beef.png` },
  { name: 'Fish', group: 'body', image: `${IMAGE_BASE}/fish.png` },
  { name: 'Egg', group: 'body', image: `${IMAGE_BASE}/egg.png` },
  { name: 'Milk', group: 'body', image: `${IMAGE_BASE}/milk.png` },
  { name: 'Cheese', group: 'body', image: `${IMAGE_BASE}/cheese.png` },
  { name: 'Beans', group: 'body', image: `${IMAGE_BASE}/beans.png` },
  { name: 'Soybeans', group: 'body', image: `${IMAGE_BASE}/soybeans.png` },
  { name: 'Peanut', group: 'body', image: `${IMAGE_BASE}/peanut.png` },

  // Protective Foods
  { name: 'Carrot', group: 'protective', image: `${IMAGE_BASE}/carrot.png` },
  { name: 'Broccoli', group: 'protective', image: `${IMAGE_BASE}/broccoli.png` },
  { name: 'Tomato', group: 'protective', image: `${IMAGE_BASE}/tomato.png` },
  { name: 'Cucumber', group: 'protective', image: `${IMAGE_BASE}/cucumber.png` },
  { name: 'Orange', group: 'protective', image: `${IMAGE_BASE}/orange.png` },
  { name: 'Apple', group: 'protective', image: `${IMAGE_BASE}/apple.png` },
  { name: 'Watermelon', group: 'protective', image: `${IMAGE_BASE}/watermelon.png` },
  { name: 'Mango', group: 'protective', image: `${IMAGE_BASE}/mango.png` },
  { name: 'Pineapple', group: 'protective', image: `${IMAGE_BASE}/pineapple.png` },
];

export function validateFoodData(foodData = FOOD_DATA) {
  const errors = [];
  const seen = new Set();
  foodData.forEach((entry, index) => {
    const name = (entry.name || '').trim();
    const label = name || `entry #${index}`;
    if (!name) errors.push(`Entry #${index}: missing name`);
    else if (seen.has(name)) errors.push(`Duplicate food name: '${name}'`);
    else seen.add(name);
    if (!entry.group) errors.push(`'${label}': missing group`);
    else if (!VALID_GROUPS.includes(entry.group)) errors.push(`'${label}': invalid group '${entry.group}'`);
    if (!entry.image) errors.push(`'${label}': missing image`);
  });
  if (errors.length) throw new Error(`FOOD_DATA validation failed:\n- ${errors.join('\n- ')}`);
}

validateFoodData(FOOD_DATA);

export function getRandomFood(excludeName = null) {
  const pool = excludeName ? FOOD_DATA.filter((f) => f.name !== excludeName) : FOOD_DATA;
  return pool[Math.floor(Math.random() * pool.length)];
}
