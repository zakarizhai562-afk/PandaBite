// Daily Balance Service — builds Prolog facts from foodDatabase.json,
// calls core/prolog/prologEngine.js, returns structured result.
// Also exposes a plain-JS perItemReaction(foodId) lookup.

import { runPrologQuery } from '../../../core/prolog/prologEngine';
import foodDatabase from '../../../data/foodDatabase.json';

/**
 * Build Prolog food facts from the database.
 */
function buildFoodFacts() {
  return foodDatabase.foods
    .map((f) => `food('${f.id}', [${f.groups.map((g) => `'${g}'`).join(',')}], '${f.tier.toLowerCase()}').`)
    .join('\n');
}

/**
 * Run the Daily Balance Matching Engine for the plate contents.
 * @param {string[]} foodIds - IDs of foods currently on the plate
 * @returns {{ coveredGroups: string[], missingGroups: string[], whoaCount: number, isBalanced: boolean }}
 */
export function calculateDailyBalance(foodIds) {
  const facts = buildFoodFacts();
  const rules = ''; // TODO: load dailyBalanceRules.pl source
  const query = `covered_groups(${JSON.stringify(foodIds)}, Groups), whoa_count(${JSON.stringify(foodIds)}, WhoaCount), (is_balanced(${JSON.stringify(foodIds)}) -> IsBalanced = true ; IsBalanced = false).`;

  try {
    const result = runPrologQuery(facts + '\n' + rules, query);
    if (result) {
      return {
        coveredGroups: result.Groups || [],
        missingGroups: ['carbs', 'protein', 'vitamins'].filter(
          (g) => !(result.Groups || []).includes(g)
        ),
        whoaCount: result.WhoaCount || 0,
        isBalanced: result.IsBalanced || false,
      };
    }
  } catch (e) {
    console.warn('Prolog engine failed, using JS fallback:', e);
  }

  // Plain-JS fallback calculation
  return calculateDailyBalanceJS(foodIds);
}

function calculateDailyBalanceJS(foodIds) {
  const covered = new Set();
  let whoaCount = 0;

  foodIds.forEach((id) => {
    const food = foodDatabase.foods.find((f) => f.id === id);
    if (!food) return;
    food.groups.forEach((g) => covered.add(g));
    if (food.tier.toLowerCase() === 'whoa') whoaCount++;
  });

  const allGroups = ['carbs', 'protein', 'vitamins'];
  const coveredGroups = allGroups.filter((g) => covered.has(g));
  const missingGroups = allGroups.filter((g) => !covered.has(g));
  const isBalanced = missingGroups.length === 0 && whoaCount <= 1;

  return { coveredGroups, missingGroups, whoaCount, isBalanced };
}

/**
 * Per-item reaction lookup — plain JS, fires on every plate drop.
 * @param {string} foodId
 * @returns {{ key: string, text: { my: string, en: string } }}
 */
export function perItemReaction(foodId) {
  const food = foodDatabase.foods.find((f) => f.id === foodId);
  if (!food) return { key: 'DL_ITEM_GO', text: { my: '', en: '' } };

  const tier = food.tier.toLowerCase();
  if (tier === 'go') return { key: 'DL_ITEM_GO', text: { my: `${food.name.my} က ကစားဖို့နဲ့ လေ့လာဖို့ ခွန်အား ပေးပါတယ်!`, en: `${food.name.en} gives you energy to play and learn!` } };
  if (tier === 'slow') return { key: 'DL_ITEM_SLOW', text: { my: `${food.name.my} က အရသာရှိပေမဲ့ အတိတ်စားပါ!`, en: `${food.name.en} is tasty — enjoy it sometimes!` } };
  return { key: 'DL_ITEM_WHOA', text: { my: `${food.name.my} က အနည်းငယ်စားရင် ရပါတယ်!`, en: `${food.name.en} — a little is okay, but not too much!` } };
}
