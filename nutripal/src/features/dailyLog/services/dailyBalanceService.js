// Daily Balance Service — builds Prolog facts from foodDatabase.json,
// calls core/prolog/prologEngine.js, returns structured result.

import { runPrologQuery } from '../../../core/prolog/prologEngine';
import foodDatabase from '../../../data/foodDatabase.json';
import prologRules from './dailyBalanceRules.pl?raw';

function buildFoodFacts() {
  return foodDatabase.foods
    .map((f) => `food('${f.id}', [${f.groups.map((g) => `'${g}'`).join(',')}], '${f.tier.toLowerCase()}').`)
    .join('\n');
}

export async function calculateDailyBalance(foodIds) {
  if (!foodIds || foodIds.length === 0) {
    return {
      coveredGroups: [],
      missingGroups: ['carbs', 'protein', 'vitamins'],
      whoaCount: 0,
      isBalanced: false,
    };
  }

  const facts = buildFoodFacts();
  const rulesSource = facts + '\n' + prologRules;
  const query = `covered_groups(${JSON.stringify(foodIds)}, Groups), whoa_count(${JSON.stringify(foodIds)}, WhoaCount), (is_balanced(${JSON.stringify(foodIds)}) -> IsBalanced = true ; IsBalanced = false).`;

  try {
    const result = await runPrologQuery(rulesSource, query);
    if (result) {
      const groups = Array.isArray(result.Groups) ? result.Groups : [];
      return {
        coveredGroups: groups,
        missingGroups: ['carbs', 'protein', 'vitamins'].filter(
          (g) => !groups.includes(g)
        ),
        whoaCount: parseInt(result.WhoaCount, 10) || 0,
        isBalanced: result.IsBalanced === 'true',
      };
    }
  } catch (e) {
    console.warn('Prolog engine failed, using JS fallback:', e);
  }

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
