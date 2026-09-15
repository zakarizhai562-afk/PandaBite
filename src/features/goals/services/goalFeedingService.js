import { doesFoodMatchGoal, getGoalById } from '../models/goal';

function areGoalFoodsResolved(goalId, choices, results) {
  const goal = getGoalById(goalId);
  if (!goal) return false;

  const requiredFoods = choices.filter((foodId) => goal.matchingFoods.includes(foodId));
  return requiredFoods.length > 0 && requiredFoods.every((foodId) => results[foodId]?.resolved);
}

/**
 * Create a new feeding round state for a goal.
 * @param {string} goalId
 * @param {string[]} foodChoices - shuffled list of food IDs
 * @returns {{ goalId: string, choices: string[], results: Record<string, { resolved: boolean, firstAttempt: boolean }>, allResolved: boolean }}
 */
export function createFeedingRound(goalId, foodChoices) {
  return {
    goalId,
    choices: foodChoices,
    results: {},
    allResolved: false,
  };
}

/**
 * Feed a food to the panda.
 * @param {object} round - current round state
 * @param {string} foodId - the food being fed
 * @returns {{ isCorrect: boolean, round: object }}
 */
export function feedFood(round, foodId) {
  const existing = round.results[foodId];
  const alreadyResolved = existing?.resolved;

  if (alreadyResolved) {
    return { isCorrect: false, round };
  }

  const isMatch = doesFoodMatchGoal(round.goalId, foodId);
  const isFirstAttempt = !existing || !existing.wrongAttempted;

  const newResults = { ...round.results };

  if (isMatch) {
    newResults[foodId] = {
      resolved: true,
      firstAttempt: isFirstAttempt,
    };
  } else {
    newResults[foodId] = {
      ...newResults[foodId],
      wrongAttempted: true,
      resolved: false,
      firstAttempt: false,
    };
  }

  const allResolved = areGoalFoodsResolved(round.goalId, round.choices, newResults);

  return {
    isCorrect: isMatch,
    round: { ...round, results: newResults, allResolved },
  };
}

/**
 * Get the reaction line for a feed attempt.
 * @param {string} goalId
 * @param {boolean} isCorrect
 * @returns {{ my: string, en: string }}
 */
export function getFeedReaction(goalId, isCorrect) {
  const goal = getGoalById(goalId);
  if (!goal) {
    return { my: 'ကြိုးစားပါ!', en: 'Try again!' };
  }
  return isCorrect ? goal.reactions.correct : goal.reactions.wrong;
}

/**
 * Get the hint clue line for a goal.
 * @param {string} goalId
 * @returns {{ my: string, en: string }}
 */
export function getHintClue(goalId) {
  const goal = getGoalById(goalId);
  if (!goal) {
    return { my: 'ဒါက ဘာလဲ?', en: 'What is this?' };
  }
  return goal.reactions.hintClue;
}
