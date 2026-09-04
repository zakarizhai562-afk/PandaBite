// Shared daily log entry model — owned by Person 2, read by Person 3

/**
 * @typedef {Object} DailyLogEntry
 * @property {string} date - ISO date string (YYYY-MM-DD)
 * @property {string[]} foodIds - List of food IDs on the plate
 * @property {string[]} coveredGroups - Food groups covered (carbs, protein, vitamins)
 * @property {string[]} missingGroups - Food groups missing
 * @property {number} whoaCount - Number of Whoa-tier items
 * @property {boolean} isBalanced - Whether the day counts as balanced
 */

export function createDailyLogEntry({ date, foodIds, coveredGroups, missingGroups, whoaCount, isBalanced }) {
  return {
    date,
    foodIds,
    coveredGroups,
    missingGroups,
    whoaCount,
    isBalanced,
  };
}
