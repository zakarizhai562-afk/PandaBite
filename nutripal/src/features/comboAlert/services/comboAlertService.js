import { runPrologQuery } from '../../../core/prolog/prologEngine';
import comboAlertData from '../../../data/comboAlertPairs.json';
import comboAlertRulesSource from './comboAlertRules.pl?raw';

const SHOWN_ALERTS_KEY = 'nutripal_shown_combo_alerts';

function buildFactsString() {
  return comboAlertData.pairs
    .map((pair) => `combo_pair(${pair.foodA}, ${pair.foodB}, ${pair.type}).`)
    .join('\n');
}

function jsFallback(foodIdA, foodIdB) {
  const match = comboAlertData.pairs.find(
    (p) =>
      (p.foodA === foodIdA && p.foodB === foodIdB) ||
      (p.foodA === foodIdB && p.foodB === foodIdA)
  );
  return match ? match.type : null;
}

/**
 * Look up the combo type for two foods.
 * @param {string} foodIdA
 * @param {string} foodIdB
 * @returns {"bad"|"good"|null}
 */
export function getComboType(foodIdA, foodIdB) {
  if (!foodIdA || !foodIdB || foodIdA === foodIdB) return null;

  try {
    const facts = buildFactsString();
    const fullSource = `${facts}\n${comboAlertRulesSource}`;
    const query = `combo_type(${foodIdA}, ${foodIdB}, Type).`;
    const result = runPrologQuery(fullSource, query);

    if (result && result.Type) {
      return result.Type;
    }
    return jsFallback(foodIdA, foodIdB);
  } catch {
    return jsFallback(foodIdA, foodIdB);
  }
}

/**
 * Find the first matching combo pair in a list of food IDs.
 * @param {string[]} foodIds
 * @returns {{ pair: import('../models/comboPair').ComboPair, foodA: string, foodB: string } | null}
 */
export function findMatchingCombo(foodIds) {
  for (let i = 0; i < foodIds.length; i++) {
    for (let j = i + 1; j < foodIds.length; j++) {
      const type = getComboType(foodIds[i], foodIds[j]);
      if (type) {
        const pairData = comboAlertData.pairs.find(
          (p) =>
            (p.foodA === foodIds[i] && p.foodB === foodIds[j]) ||
            (p.foodA === foodIds[j] && p.foodB === foodIds[i])
        );
        if (pairData) {
          return { pair: pairData, foodA: foodIds[i], foodB: foodIds[j] };
        }
      }
    }
  }
  return null;
}

/**
 * Check if an alert has already been shown for this trigger event.
 * @param {string} triggerId - e.g. "candy-rice-2026-08-27"
 * @returns {boolean}
 */
export function hasAlertBeenShown(triggerId) {
  try {
    const shown = JSON.parse(localStorage.getItem(SHOWN_ALERTS_KEY) || '[]');
    return shown.includes(triggerId);
  } catch {
    return false;
  }
}

/**
 * Mark an alert as shown.
 * @param {string} triggerId
 */
export function markAlertShown(triggerId) {
  try {
    const shown = JSON.parse(localStorage.getItem(SHOWN_ALERTS_KEY) || '[]');
    if (!shown.includes(triggerId)) {
      shown.push(triggerId);
      localStorage.setItem(SHOWN_ALERTS_KEY, JSON.stringify(shown));
    }
  } catch {
    // localStorage unavailable — silently ignore
  }
}

/**
 * Build a trigger ID from two food IDs and today's date.
 * @param {string} foodIdA
 * @param {string} foodIdB
 * @returns {string}
 */
export function buildTriggerId(foodIdA, foodIdB) {
  const today = new Date().toISOString().slice(0, 10);
  const sorted = [foodIdA, foodIdB].sort().join('-');
  return `${sorted}-${today}`;
}
