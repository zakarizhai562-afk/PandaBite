// Shared "spend points" helper — for Hints used in Puzzle (Person 4) and Goals (Person 3).
// Owned by Person 2.
// Two-tier cost model: Clue = 2 points, Reveal = 5 points.
// Never lets the total go negative.

import { getItem, setItem } from '../utils/storage';

const STORAGE_KEY = 'nutripal_stars';

export const HINT_COST = {
  CLUE: 2,
  REVEAL: 5,
};

/**
 * Spend points from the shared total.
 * @param {number} amount - Points to spend (must be positive)
 * @param {string} source - Feature name that triggered the spend
 * @returns {{ success: boolean, remaining: number, message?: string }}
 */
export function spendPoints(amount, source) {
  if (typeof amount !== 'number' || amount <= 0) {
    return { success: false, remaining: getItem(STORAGE_KEY) || 0, message: 'Invalid amount' };
  }

  const current = getItem(STORAGE_KEY) || 0;

  if (current < amount) {
    return {
      success: false,
      remaining: current,
      message: 'Not enough points yet',
    };
  }

  const newTotal = current - amount;
  setItem(STORAGE_KEY, newTotal);
  return { success: true, remaining: newTotal };
}
