// Daily Balance Service — builds Prolog facts from foodDatabase.json,
// calls core/prolog/prologEngine.js, returns structured result.

import { runPrologQuery } from '../../../core/prolog/prologEngine';
import foodDatabase from '../../../data/foodDatabase.json';
import prologRules from './dailyBalanceRules.pl?raw';

const ALL_GROUPS = ['carbs', 'protein', 'vitamins'];
const FOOD_BY_ID = new Map(foodDatabase.foods.map((food) => [food.id, food]));

function buildFoodFacts() {
  return foodDatabase.foods
    .map((f) => `food('${f.id}', [${f.groups.map((g) => `'${g}'`).join(',')}], '${f.tier.toLowerCase()}').`)
    .join('\n');
}

function normalizeFoodIds(foodIds = []) {
  const selectedFoodIds = [];
  const invalidFoodIds = [];
  const duplicateFoodIds = [];
  const seen = new Set();

  foodIds.forEach((id) => {
    if (!FOOD_BY_ID.has(id)) {
      invalidFoodIds.push(id);
      return;
    }

    if (seen.has(id)) {
      duplicateFoodIds.push(id);
      return;
    }

    seen.add(id);
    selectedFoodIds.push(id);
  });

  return { selectedFoodIds, invalidFoodIds, duplicateFoodIds };
}

function clampScore(score) {
  return Math.max(0, Math.min(3, score));
}

function buildResult(selectedFoodIds, coveredGroups, whoaCount, invalidFoodIds = [], duplicateFoodIds = []) {
  const normalizedCoveredGroups = ALL_GROUPS.filter((group) => coveredGroups.includes(group));
  const missingGroups = ALL_GROUPS.filter((group) => !normalizedCoveredGroups.includes(group));
  const tierCounts = selectedFoodIds.reduce(
    (counts, id) => {
      const tier = FOOD_BY_ID.get(id)?.tier?.toLowerCase();
      if (tier === 'go') counts.go += 1;
      if (tier === 'slow') counts.slow += 1;
      if (tier === 'whoa') counts.whoa += 1;
      return counts;
    },
    { go: 0, slow: 0, whoa: 0 }
  );
  const score = clampScore(normalizedCoveredGroups.length - Math.max(0, whoaCount - 1));
  const isBalanced = missingGroups.length === 0 && whoaCount <= 1;

  return {
    selectedFoodIds,
    invalidFoodIds,
    duplicateFoodIds,
    coveredGroups: normalizedCoveredGroups,
    missingGroups,
    whoaCount,
    tierCounts,
    score,
    starsEarned: score,
    isBalanced,
  };
}

export async function calculateDailyBalance(foodIds) {
  const { selectedFoodIds, invalidFoodIds, duplicateFoodIds } = normalizeFoodIds(foodIds);

  if (selectedFoodIds.length === 0) {
    return buildResult([], [], 0, invalidFoodIds, duplicateFoodIds);
  }

  const facts = buildFoodFacts();
  const rulesSource = facts + '\n' + prologRules;
  const query = `covered_groups(${JSON.stringify(selectedFoodIds)}, Groups), whoa_count(${JSON.stringify(selectedFoodIds)}, WhoaCount), (is_balanced(${JSON.stringify(selectedFoodIds)}) -> IsBalanced = true ; IsBalanced = false).`;

  try {
    const result = await runPrologQuery(rulesSource, query);
    if (result) {
      const groups = Array.isArray(result.Groups) ? result.Groups : [];
      return buildResult(
        selectedFoodIds,
        groups,
        parseInt(result.WhoaCount, 10) || 0,
        invalidFoodIds,
        duplicateFoodIds
      );
    }
  } catch (e) {
    console.warn('Prolog engine failed, using JS fallback:', e);
  }

  return calculateDailyBalanceJS(selectedFoodIds, invalidFoodIds, duplicateFoodIds);
}

function calculateDailyBalanceJS(selectedFoodIds, invalidFoodIds = [], duplicateFoodIds = []) {
  const covered = new Set();
  let whoaCount = 0;

  selectedFoodIds.forEach((id) => {
    const food = FOOD_BY_ID.get(id);
    if (!food) return;
    food.groups.forEach((g) => covered.add(g));
    if (food.tier.toLowerCase() === 'whoa') whoaCount++;
  });

  return buildResult(selectedFoodIds, [...covered], whoaCount, invalidFoodIds, duplicateFoodIds);
}
