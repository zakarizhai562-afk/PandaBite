// Shared "award Stars" helper — called by every feature that awards points.
// Owned by Person 2.
// Idempotent-safe: calling twice for the same logical event should not double-count.
// (Callers must ensure they don't call this twice for the same event.)

import { getItem, setItem } from '../utils/storage';

const STORAGE_KEY = 'nutripal_stars';

/**
 * Award Stars to the shared points total.
 * @param {number} amount - Points to add (must be positive)
 * @param {string} source - Feature name that triggered the award (for logging/debugging)
 * @returns {number} The new total after awarding
 */
export function awardStars(amount, source) {
  if (typeof amount !== 'number' || amount <= 0) {
    console.warn(`starAwardService: invalid amount ${amount} from ${source}`);
    return getItem(STORAGE_KEY) || 0;
  }

  const current = getItem(STORAGE_KEY) || 0;
  const newTotal = current + amount;
  setItem(STORAGE_KEY, newTotal);
  return newTotal;
}
