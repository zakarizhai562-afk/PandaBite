// Shared daily log entry model — also available at core/models/dailyLogEntry.js
// This feature-local copy exists for convenience; both export the same shape.

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
